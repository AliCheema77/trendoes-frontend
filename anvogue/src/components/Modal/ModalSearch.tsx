'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import Product from '../Product/Product';
import { useModalSearchContext } from '@/context/ModalSearchContext'
import { fetchSubCategories, fetchProductById, fetchProducts } from '@/lib/api'
import { mapApiProduct, mapApiProducts } from '@/lib/mappers'
import { getRecentlyViewed } from '@/lib/recentlyViewed'
import { ProductType } from '@/type/ProductType'

const ModalSearch = () => {
    const { isModalOpen, closeModalSearch } = useModalSearchContext();
    const [searchKeyword, setSearchKeyword] = useState('');
    const [keywords, setKeywords] = useState<string[]>([]);
    const [recentProducts, setRecentProducts] = useState<ProductType[]>([]);
    const [suggestions, setSuggestions] = useState<ProductType[]>([]);
    const [suggestionsLoading, setSuggestionsLoading] = useState(false);
    const router = useRouter()

    // Fetch subcategory keywords once on mount
    useEffect(() => {
        fetchSubCategories()
            .then((data: { id: number; name: string }[]) => {
                setKeywords(data.slice(0, 6).map(s => s.name))
            })
            .catch(() => {})
    }, [])

    // Fetch recently viewed products each time the modal opens
    useEffect(() => {
        if (!isModalOpen) return
        const ids = getRecentlyViewed()
        if (ids.length === 0) return
        Promise.all(ids.map(id => fetchProductById(id).then(mapApiProduct).catch(() => null)))
            .then(results => setRecentProducts(results.filter(Boolean) as ProductType[]))
    }, [isModalOpen])

    // Debounced live suggestions — fires 350ms after the user stops typing.
    // Interview note: debouncing prevents a flood of API calls on every keystroke.
    // clearTimeout in the cleanup function cancels any pending call when the
    // keyword changes again before the timer fires.
    useEffect(() => {
        const trimmed = searchKeyword.trim()
        if (!trimmed) {
            setSuggestions([])
            return
        }
        setSuggestionsLoading(true)
        const timer = setTimeout(() => {
            fetchProducts({ name: trimmed, page_size: '4' })
                .then(res => setSuggestions(mapApiProducts(res.results ?? [])))
                .catch(() => setSuggestions([]))
                .finally(() => setSuggestionsLoading(false))
        }, 350)

        // Cleanup: cancel the previous timer before starting a new one
        return () => clearTimeout(timer)
    }, [searchKeyword])

    // Clear suggestions when modal closes
    useEffect(() => {
        if (!isModalOpen) {
            setSearchKeyword('')
            setSuggestions([])
        }
    }, [isModalOpen])

    const handleSearch = (value: string) => {
        const trimmed = value.trim()
        if (!trimmed) return
        router.push(`/search-result?query=${encodeURIComponent(trimmed)}`)
        closeModalSearch()
        setSearchKeyword('')
    }

    const showSuggestions = searchKeyword.trim().length > 0
    const showRecent = !showSuggestions && recentProducts.length > 0

    return (
        <>
            <div className={`modal-search-block`} onClick={closeModalSearch}>
                <div
                    className={`modal-search-main md:p-10 p-6 rounded-[32px] ${isModalOpen ? 'open' : ''}`}
                    onClick={(e) => { e.stopPropagation() }}
                >
                    <div className="form-search relative">
                        <Icon.MagnifyingGlass
                            className='absolute heading5 right-6 top-1/2 -translate-y-1/2 cursor-pointer'
                            onClick={() => handleSearch(searchKeyword)}
                        />
                        <input
                            type="text"
                            placeholder='Searching...'
                            className='text-button-lg h-14 rounded-2xl border border-line w-full pl-6 pr-12'
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchKeyword)}
                            autoFocus={isModalOpen}
                        />
                    </div>

                    {/* Live suggestions — shown while user is typing */}
                    {showSuggestions && (
                        <div className="suggestions mt-6">
                            {suggestionsLoading ? (
                                <div className="flex items-center gap-2 text-secondary text-sm py-2">
                                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                    Searching...
                                </div>
                            ) : suggestions.length > 0 ? (
                                <>
                                    <div className="heading6 mb-4">
                                        Results for &quot;{searchKeyword.trim()}&quot;
                                    </div>
                                    <div className="list-product pb-2 hide-product-sold grid xl:grid-cols-4 sm:grid-cols-2 gap-5">
                                        {suggestions.map(product => (
                                            <div key={product.id} onClick={closeModalSearch}>
                                                <Product data={product} type='grid' />
                                            </div>
                                        ))}
                                    </div>
                                    <div
                                        className="mt-4 text-sm text-center cursor-pointer hover:underline font-semibold"
                                        onClick={() => handleSearch(searchKeyword)}
                                    >
                                        See all results for &quot;{searchKeyword.trim()}&quot; →
                                    </div>
                                </>
                            ) : (
                                <div className="text-secondary text-sm py-2">
                                    No products found for &quot;{searchKeyword.trim()}&quot;
                                </div>
                            )}
                        </div>
                    )}

                    {/* Featured keywords — shown when not typing */}
                    {!showSuggestions && (
                        <div className="keyword mt-8">
                            <div className="heading5">Feature Keywords Today</div>
                            <div className="list-keyword flex items-center flex-wrap gap-3 mt-4">
                                {keywords.map(kw => (
                                    <div
                                        key={kw}
                                        className="item px-4 py-1.5 border border-line rounded-full cursor-pointer duration-300 hover:bg-black hover:text-white"
                                        onClick={() => handleSearch(kw)}
                                    >
                                        {kw}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recently viewed — shown when not typing and there's history */}
                    {showRecent && (
                        <div className="list-recent mt-8">
                            <div className="heading6">Recently Viewed Products</div>
                            <div className="list-product pb-5 hide-product-sold grid xl:grid-cols-4 sm:grid-cols-2 gap-7 mt-4">
                                {recentProducts.map(product => (
                                    <div key={product.id} onClick={closeModalSearch}>
                                        <Product data={product} type='grid' />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default ModalSearch