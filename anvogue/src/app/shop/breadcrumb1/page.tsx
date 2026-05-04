'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation';
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import ShopBreadCrumb1 from '@/components/Shop/ShopBreadCrumb1'
import Footer from '@/components/Footer/Footer'
import { ProductType } from '@/type/ProductType'
import { fetchProducts } from '@/lib/api'
import { mapApiProducts } from '@/lib/mappers'

export default function BreadCrumb1() {
    const searchParams = useSearchParams()
    const datatype = searchParams.get('type')
    const gender = searchParams.get('gender')
    const category = searchParams.get('category')

    const [products, setProducts] = useState<ProductType[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        const params: Record<string, string> = { page_size: '100' }
        if (gender) params.gender = gender
        if (category) params.category = category
        if (datatype) params.subcategory = datatype
        fetchProducts(params)
            .then(res => {
                const mapped = mapApiProducts(res.results ?? res)
                setProducts(mapped)
            })
            .catch(() => setProducts([]))
            .finally(() => setLoading(false))
    }, [gender, category, datatype])

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
                <ShopBreadCrumb1
                    data={products}
                    productPerPage={9}
                    dataType={datatype}
                    gender={gender}
                    category={category}
                />
            )}
            <Footer />
        </>
    )
}
