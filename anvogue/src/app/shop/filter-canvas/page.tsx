'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation';
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import ShopFilterCanvas from '@/components/Shop/ShopFilterCanvas'
import Footer from '@/components/Footer/Footer'
import { ProductType } from '@/type/ProductType'
import { fetchProducts } from '@/lib/api'
import { mapApiProducts } from '@/lib/mappers'

const PRODUCTS_PER_PAGE = 12

export default function FilterCanvas() {
    const searchParams = useSearchParams()
    const type = searchParams.get('type')
    const category = searchParams.get('category')
    const gender = searchParams.get('gender')
    const pageParam = Math.max(0, parseInt(searchParams.get('page') || '1', 10) - 1)

    const [products, setProducts] = useState<ProductType[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(pageParam)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        const params: Record<string, string> = {
            page: String(currentPage + 1),
            page_size: String(PRODUCTS_PER_PAGE),
        }
        if (category) params.category = category
        if (gender) params.gender = gender
        if (type) params.subcategory = type
        fetchProducts(params)
            .then(res => {
                setProducts(mapApiProducts(res.results ?? []))
                setTotalCount(res.count ?? 0)
            })
            .catch(() => { setProducts([]); setTotalCount(0) })
            .finally(() => setLoading(false))
    }, [category, gender, type, currentPage])

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
            </div>
            {loading && products.length === 0 ? (
                <div className="flex justify-center items-center py-40">
                    <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <ShopFilterCanvas
                    data={products}
                    productPerPage={PRODUCTS_PER_PAGE}
                    dataType={type}
                    productStyle='style-1'
                />
            )}
            <Footer />
        </>
    )
}