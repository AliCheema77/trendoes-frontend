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

export default function FilterCanvas() {
    const searchParams = useSearchParams()
    const type = searchParams.get('type')
    const category = searchParams.get('category')

    const [products, setProducts] = useState<ProductType[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        const params: Record<string, string> = { page_size: '100' }
        if (category) params.category = category
        fetchProducts(params)
            .then(res => setProducts(mapApiProducts(res.results ?? res)))
            .catch(() => setProducts([]))
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
                <ShopFilterCanvas data={products} productPerPage={12} dataType={type} productStyle='style-1' />
            )}
            <Footer />
        </>
    )
}
