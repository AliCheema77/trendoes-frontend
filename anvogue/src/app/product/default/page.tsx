'use client'
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation';
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import BreadcrumbProduct from '@/components/Breadcrumb/BreadcrumbProduct'
import Default from '@/components/Product/Detail/Default';
import Footer from '@/components/Footer/Footer'
import { ProductType } from '@/type/ProductType'
import productFallback from '@/data/Product.json'
import { fetchProductById } from '@/lib/api'
import { mapApiProduct } from '@/lib/mappers'

const ProductDefault = () => {
    const searchParams = useSearchParams()
    const productId = searchParams.get('id') ?? '1'
    const [allProducts, setAllProducts] = useState<ProductType[]>(productFallback as any[])

    useEffect(() => {
        fetchProductById(productId)
            .then(data => {
                const mapped = mapApiProduct(data)
                setAllProducts(prev => {
                    const withoutCurrent = prev.filter(p => p.id !== mapped.id)
                    return [mapped, ...withoutCurrent]
                })
            })
            .catch(() => { /* use fallback */ })
    }, [productId])

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-white" />
                <BreadcrumbProduct data={allProducts} productPage='default' productId={productId} />
            </div>
            <Default data={allProducts} productId={productId} />
            <Footer />
        </>
    )
}

export default ProductDefault