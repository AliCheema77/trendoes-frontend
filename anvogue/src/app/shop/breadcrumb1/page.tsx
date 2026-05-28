'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import ShopBreadCrumb1 from '@/components/Shop/ShopBreadCrumb1'
import Footer from '@/components/Footer/Footer'
import { ProductType } from '@/type/ProductType'
import { fetchProducts, fetchFilterOptions } from '@/lib/api'
import { mapApiProducts } from '@/lib/mappers'

const PRODUCTS_PER_PAGE = 9

// Maps the UI sort option name → Django OrderingFilter param
const SORT_MAP: Record<string, string> = {
    soldQuantityHighToLow: '-total_sold',
    discountHighToLow: '-discount_percent',
    priceHighToLow: '-price',
    priceLowToHigh: 'price',
}

export interface FilterOptions {
    types: string[]
    sizes: string[]
    colors: { name: string; hex: string }[]
    brands: string[]
    priceRange: { min: number; max: number }
}

const EMPTY_OPTIONS: FilterOptions = {
    types: [], sizes: [], colors: [], brands: [], priceRange: { min: 0, max: 100000 },
}

export default function BreadCrumb1() {
    const searchParams = useSearchParams()
    const router = useRouter()

    // These come from the menu URL (e.g. /shop/breadcrumb1?gender=men&type=shirts)
    const datatype = searchParams.get('type')
    const gender = searchParams.get('gender')
    const category = searchParams.get('category')
    const pageParam = Math.max(0, parseInt(searchParams.get('page') || '1', 10) - 1)

    // ── Filter state ────────────────────────────────────────────────────────
    const [type, setType] = useState<string | null>(datatype)
    const [size, setSize] = useState<string | null>(null)
    const [color, setColor] = useState<string | null>(null)
    const [brand, setBrand] = useState<string | null>(null)
    const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 100000 })
    const [sortOption, setSortOption] = useState('')
    const [showOnlySale, setShowOnlySale] = useState(false)
    const [currentPage, setCurrentPage] = useState(pageParam)

    // ── Data state ──────────────────────────────────────────────────────────
    const [products, setProducts] = useState<ProductType[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [filterOptions, setFilterOptions] = useState<FilterOptions>(EMPTY_OPTIONS)

    // ── Fetch sidebar filter options whenever gender/category context changes ─
    // These are small metadata queries — they tell us what filter values exist
    // for the current navigation context (e.g. men's sizes vs women's sizes).
    useEffect(() => {
        const params: Record<string, string> = {}
        if (gender) params.gender = gender
        if (category) params.category = category
        fetchFilterOptions(params)
            .then((data: any) => {
                const opts: FilterOptions = {
                    types: data.types || [],
                    sizes: data.sizes || [],
                    colors: data.colors || [],
                    brands: data.brands || [],
                    priceRange: {
                        min: data.price_range?.min ?? 0,
                        max: data.price_range?.max ?? 100000,
                    },
                }
                setFilterOptions(opts)
                // Reset price slider bounds to match real product prices
                setPriceRange({ min: opts.priceRange.min, max: opts.priceRange.max })
            })
            .catch(() => {})
    }, [gender, category])

    // ── Fetch products on every filter/page change ───────────────────────────
    // Interview note: every filter change resets the page to 0 (via handlers),
    // which triggers this effect. The dependency array is the single source of
    // truth for what triggers a new API call.
    useEffect(() => {
        setLoading(true)
        const params: Record<string, string> = {
            page: String(currentPage + 1),       // backend pages are 1-indexed
            page_size: String(PRODUCTS_PER_PAGE),
        }
        if (gender) params.gender = gender
        if (category) params.category = category
        if (type) params.subcategory = type
        if (size) params.size = size
        if (color) params.color = color
        if (brand) params.brand = brand
        if (priceRange.min > filterOptions.priceRange.min) params.min_price = String(priceRange.min)
        if (priceRange.max < filterOptions.priceRange.max) params.max_price = String(priceRange.max)
        if (showOnlySale) params.on_sale = 'true'
        if (sortOption && SORT_MAP[sortOption]) params.ordering = SORT_MAP[sortOption]

        fetchProducts(params)
            .then(res => {
                setProducts(mapApiProducts(res.results ?? []))
                setTotalCount(res.count ?? 0)
            })
            .catch(() => { setProducts([]); setTotalCount(0) })
            .finally(() => setLoading(false))
    }, [gender, category, type, size, color, brand, priceRange, sortOption, showOnlySale, currentPage, filterOptions.priceRange])

    // ── Sync ?page=N into the URL so refresh/share preserves position ────────
    // Interview note: router.replace updates the URL without adding to browser
    // history (unlike router.push), so the back button still works naturally.
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString())
        if (currentPage === 0) params.delete('page')
        else params.set('page', String(currentPage + 1))
        router.replace(`?${params.toString()}`, { scroll: false })
    }, [currentPage])

    // ── Filter handlers — all reset page to 0 ───────────────────────────────
    // Passing null means "clear this filter". Passing the same value as current
    // means "toggle off".
    const handleTypeChange = (t: string | null) => {
        setType(prev => t === null ? null : (prev === t ? null : t))
        setCurrentPage(0)
    }
    const handleSizeChange = (s: string | null) => {
        setSize(prev => s === null ? null : (prev === s ? null : s))
        setCurrentPage(0)
    }
    const handleColorChange = (c: string | null) => {
        setColor(prev => c === null ? null : (prev === c ? null : c))
        setCurrentPage(0)
    }
    const handleBrandChange = (b: string | null) => {
        setBrand(prev => b === null ? null : (prev === b ? null : b))
        setCurrentPage(0)
    }
    const handlePriceChange = (values: number | number[]) => {
        if (Array.isArray(values)) { setPriceRange({ min: values[0], max: values[1] }); setCurrentPage(0) }
    }
    const handleSortChange = (option: string) => { setSortOption(option); setCurrentPage(0) }
    const handleSaleToggle = () => { setShowOnlySale(prev => !prev); setCurrentPage(0) }
    const handleClearAll = () => {
        setType(null); setSize(null); setColor(null); setBrand(null)
        setPriceRange({ min: filterOptions.priceRange.min, max: filterOptions.priceRange.max })
        setSortOption(''); setShowOnlySale(false); setCurrentPage(0)
    }

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
                <ShopBreadCrumb1
                    data={products}
                    totalCount={totalCount}
                    currentPage={currentPage}
                    productPerPage={PRODUCTS_PER_PAGE}
                    isLoading={loading}
                    dataType={datatype}
                    gender={gender}
                    category={category}
                    type={type}
                    size={size}
                    color={color}
                    brand={brand}
                    priceRange={priceRange}
                    sortOption={sortOption}
                    showOnlySale={showOnlySale}
                    filterOptions={filterOptions}
                    onTypeChange={handleTypeChange}
                    onSizeChange={handleSizeChange}
                    onColorChange={handleColorChange}
                    onBrandChange={handleBrandChange}
                    onPriceChange={handlePriceChange}
                    onSortChange={handleSortChange}
                    onSaleToggle={handleSaleToggle}
                    onClearAll={handleClearAll}
                    onPageChange={setCurrentPage}
                />
            )}
            <Footer />
        </>
    )
}