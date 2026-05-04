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
import { fetchProductById, fetchProducts } from '@/lib/api'
import { mapApiProduct, mapApiProducts } from '@/lib/mappers'
import { addRecentlyViewed } from '@/lib/recentlyViewed'

const ProductDefault = () => {
    const searchParams = useSearchParams()
    const productId = searchParams.get('id') ?? '1'
    const [allProducts, setAllProducts] = useState<ProductType[]>(productFallback as any[])

    useEffect(() => {
        fetchProductById(productId)
            .then(async data => {
                const mapped = mapApiProduct(data)
                addRecentlyViewed(mapped.id)
                try {
                    const res = await fetchProducts({ subcategory: mapped.type, page_size: '5' })
                    const related = mapApiProducts(res.results ?? res)
                        .filter(p => p.id !== mapped.id)
                        .slice(0, 4)
                    setAllProducts([mapped, ...related])
                } catch {
                    setAllProducts([mapped])
                }
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