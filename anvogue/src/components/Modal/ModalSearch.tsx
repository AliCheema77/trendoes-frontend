'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import Product from '../Product/Product';
import { useModalSearchContext } from '@/context/ModalSearchContext'
import { fetchSubCategories, fetchProductById } from '@/lib/api'
import { mapApiProduct } from '@/lib/mappers'
import { getRecentlyViewed } from '@/lib/recentlyViewed'
import { ProductType } from '@/type/ProductType'

const ModalSearch = () => {
    const { isModalOpen, closeModalSearch } = useModalSearchContext();
    const [searchKeyword, setSearchKeyword] = useState('');
    const [keywords, setKeywords] = useState<string[]>([]);
    const [recentProducts, setRecentProducts] = useState<ProductType[]>([]);
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
            .then(results => {
                setRecentProducts(results.filter(Boolean) as ProductType[])
            })
    }, [isModalOpen])

    const handleSearch = (value: string) => {
        router.push(`/search-result?query=${value}`)
        closeModalSearch()
        setSearchKeyword('')
    }

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
                        />
                    </div>
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
                    {recentProducts.length > 0 && (
                        <div className="list-recent mt-8">
                            <div className="heading6">Recently Viewed Products</div>
                            <div className="list-product pb-5 hide-product-sold grid xl:grid-cols-4 sm:grid-cols-2 gap-7 mt-4">
                                {recentProducts.map(product => (
                                    <Product key={product.id} data={product} type='grid' />
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