'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation';
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import ShopBreadCrumbImg from '@/components/Shop/ShopBreadCrumbImg';
import Footer from '@/components/Footer/Footer'
import { fetchProducts } from '@/lib/api'
import { mapApiProducts } from '@/lib/mappers'
import productFallback from '@/data/Product.json'
import { ProductType } from '@/type/ProductType'

export default function Default() {
    const searchParams = useSearchParams()
    const type = searchParams.get('type')
    const category = searchParams.get('category')
    const [products, setProducts] = useState<ProductType[]>(productFallback as any[])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const params: Record<string, string> = { page_size: '100' }
        if (category) params.category = category

        fetchProducts(params)
            .then(res => {
                const results = res.results ?? res
                if (Array.isArray(results) && results.length > 0) {
                    setProducts(mapApiProducts(results))
                }
            })
            .catch(() => { /* use fallback */ })
            .finally(() => setLoading(false))
    }, [category])

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
            </div>
            {loading ? (
                <div className="flex justify-center items-center py-40">
                    <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <ShopBreadCrumbImg data={products} productPerPage={12} dataType={type} />
            )}
            <Footer />
        </>
    )
}