'use client'
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
import { ProductType } from '@/type/ProductType'
import Product from '@/components/Product/Product'
import HandlePagination from '@/components/Other/HandlePagination'
import { fetchProducts } from '@/lib/api'
import { mapApiProducts } from '@/lib/mappers'

const SearchResult = () => {
    const searchParams = useSearchParams()
    const query = searchParams.get('query') ?? ''
    const router = useRouter()

    const [searchKeyword, setSearchKeyword] = useState('')
    const [products, setProducts] = useState<ProductType[]>([])
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)
    const productsPerPage = 8

    useEffect(() => {
        if (!query) return
        setLoading(true)
        setCurrentPage(0)
        fetchProducts({ name: query, page_size: '100' })
            .then(res => {
                const mapped = mapApiProducts(res.results ?? res)
                setProducts(mapped)
            })
            .catch(() => setProducts([]))
            .finally(() => setLoading(false))
    }, [query])

    const handleSearch = (value: string) => {
        router.push(`/search-result?query=${value}`)
        setSearchKeyword('')
    }

    const offset = currentPage * productsPerPage
    const pageCount = Math.ceil(products.length / productsPerPage)
    const currentProducts = products.slice(offset, offset + productsPerPage)

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
                            {loading ? 'Searching...' : `Found ${products.length} results for "${query}"`}
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
                                    className='button-main absolute top-1 bottom-1 right-1 flex items-center justify-center'
                                    onClick={() => handleSearch(searchKeyword)}
                                >
                                    search
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="list-product-block relative md:pt-10 pt-6">
                        <div className="heading6">Search results: {query}</div>
                        {loading ? (
                            <div className="flex items-center justify-center py-20 text-secondary">Loading...</div>
                        ) : (
                            <>
                                <div className={`list-product hide-product-sold grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 sm:gap-[30px] gap-[20px] mt-5`}>
                                    {currentProducts.length === 0 ? (
                                        <div className="col-span-full text-center text-secondary py-10">
                                            No products match &quot;{query}&quot;
                                        </div>
                                    ) : (
                                        currentProducts.map(item => (
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