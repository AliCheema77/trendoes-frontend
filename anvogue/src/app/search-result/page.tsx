'use client'
import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
import { ProductType } from '@/type/ProductType'
import Product from '@/components/Product/Product'
import HandlePagination from '@/components/Other/HandlePagination'
import { fetchProducts } from '@/lib/api'
import { mapApiProducts } from '@/lib/mappers'

const PRODUCTS_PER_PAGE = 8

const SearchResult = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const query = searchParams.get('query') ?? ''
    const pageParam = Math.max(0, parseInt(searchParams.get('page') || '1', 10) - 1)

    const [searchKeyword, setSearchKeyword] = useState('')
    const [products, setProducts] = useState<ProductType[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(pageParam)

    // Fetch from backend whenever query or page changes.
    // Backend ?name= filter uses icontains, so partial matches work.
    useEffect(() => {
        if (!query) return
        setLoading(true)
        fetchProducts({ name: query, page: String(currentPage + 1), page_size: String(PRODUCTS_PER_PAGE) })
            .then(res => {
                setProducts(mapApiProducts(res.results ?? []))
                setTotalCount(res.count ?? 0)
            })
            .catch(() => { setProducts([]); setTotalCount(0) })
            .finally(() => setLoading(false))
    }, [query, currentPage])

    // Reset to page 0 when a new search is submitted
    const handleSearch = (value: string) => {
        const trimmed = value.trim()
        if (!trimmed) return
        setCurrentPage(0)
        router.push(`/search-result?query=${encodeURIComponent(trimmed)}`)
        setSearchKeyword('')
    }

    const pageCount = Math.ceil(totalCount / PRODUCTS_PER_PAGE)

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
                <Breadcrumb heading='Search Result' subHeading='Search Result' />
            </div>
            <div className="shop-product breadcrumb1 lg:py-20 md:py-14 py-10">
                <div className="container">
                    <div className="heading flex flex-col items-center">
                        <div className="heading4 text-center">
                            {loading
                                ? 'Searching...'
                                : query
                                    ? `Found ${totalCount} result${totalCount !== 1 ? 's' : ''} for "${query}"`
                                    : 'Search for products'}
                        </div>
                        <div className="input-block lg:w-1/2 sm:w-3/5 w-full md:h-[52px] h-[44px] sm:mt-8 mt-5">
                            <div className='w-full h-full relative'>
                                <input
                                    type="text"
                                    placeholder='Search...'
                                    className='caption1 w-full h-full pl-4 md:pr-[150px] pr-32 rounded-xl border border-line'
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchKeyword)}
                                />
                                <button
                                    onClick={() => handleSearch(searchKeyword)}
                                    style={{ position: 'absolute', top: 4, bottom: 4, right: 4, padding: '0 20px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="list-product-block relative md:pt-10 pt-6">
                        <div className="heading6">Search results: {query}</div>
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : (
                            <>
                                <div className="list-product hide-product-sold grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 sm:gap-[30px] gap-[20px] mt-5">
                                    {products.length === 0 ? (
                                        <div className="col-span-full text-center text-secondary py-10">
                                            No products match &quot;{query}&quot;
                                        </div>
                                    ) : (
                                        products.map(item => (
                                            <Product key={item.id} data={item} type='grid' style='' />
                                        ))
                                    )}
                                </div>
                                {pageCount > 1 && (
                                    <div className="list-pagination flex items-center justify-center md:mt-10 mt-7">
                                        <HandlePagination pageCount={pageCount} onPageChange={setCurrentPage} />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default SearchResult