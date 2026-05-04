'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { ProductType } from '@/type/ProductType'
import Product from '../Product/Product';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css'
import HandlePagination from '../Other/HandlePagination';

interface Props {
    data: Array<ProductType>
    productPerPage: number
    dataType: string | null | undefined
    gender: string | null
    category: string | null
}

const ShopBreadCrumb1: React.FC<Props> = ({ data, productPerPage, dataType, gender, category }) => {
    const [showOnlySale, setShowOnlySale] = useState(false)
    const [sortOption, setSortOption] = useState('');
    const [type, setType] = useState<string | null | undefined>(dataType)
    const [size, setSize] = useState<string | null>(null)
    const [color, setColor] = useState<string | null>(null)
    const [brand, setBrand] = useState<string | null>(null)
    const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 100000 });
    const [currentPage, setCurrentPage] = useState(0);
    const productsPerPage = productPerPage;
    const offset = currentPage * productsPerPage;

    // ─── DYNAMIC FILTER OPTIONS (computed from real data) ────────────────────
    /**
     * useMemo caches an expensive calculation and only re-runs it when
     * its dependencies (listed in the [] at the end) change.
     *
     * Here, `data` is the dependency. So these computations run:
     *   - Once when the component first mounts (with fallback JSON data)
     *   - Once more when the API data arrives and `data` changes
     *   - Never again after that, even if the user clicks filters many times
     *
     * Without useMemo: every filter click → re-render → all loops run again
     * With useMemo: filter click → re-render → cached results returned instantly
     *
     * This is the main use case for useMemo: derived data from props/state.
     */

    // Unique types only from products matching the active gender/category filter
    const uniqueTypes = useMemo(() => {
        const relevant = data.filter(p => {
            if (gender && p.gender?.toLowerCase() !== gender.toLowerCase()) return false
            if (category && p.category?.toLowerCase() !== category.toLowerCase()) return false
            return true
        })
        const seen = new Set(relevant.map(p => p.type).filter(Boolean))
        return Array.from(seen).sort()
    }, [data, gender, category])

    // All unique sizes — prefers stocksRaw (API data), falls back to sizes[]
    const uniqueSizes = useMemo(() => {
        const seen = new Set<string>()
        for (const p of data) {
            if (p.stocksRaw && p.stocksRaw.length > 0) {
                for (const stock of p.stocksRaw) seen.add(stock.size.name)
            } else {
                for (const s of p.sizes) seen.add(s)
            }
        }
        return Array.from(seen).sort()
    }, [data])

    // All unique colors with their hex codes
    const uniqueColors = useMemo(() => {
        const colorMap = new Map<string, string>() // colorName → hexCode
        for (const p of data) {
            if (p.stocksRaw && p.stocksRaw.length > 0) {
                for (const stock of p.stocksRaw) {
                    for (const c of stock.colors) {
                        if (!colorMap.has(c.color.name)) colorMap.set(c.color.name, c.color.HEX)
                    }
                }
            } else {
                for (const v of p.variation) {
                    if (!colorMap.has(v.color)) colorMap.set(v.color, v.colorCode || '#000000')
                }
            }
        }
        return Array.from(colorMap.entries())
            .map(([name, hex]) => ({ name, hex }))
            .sort((a, b) => a.name.localeCompare(b.name))
    }, [data])

    // All unique brand names
    const uniqueBrands = useMemo(() => {
        const seen = new Set(data.map(p => p.brand).filter(Boolean))
        return Array.from(seen).sort()
    }, [data])

    // Min and max price from actual product data
    const priceStats = useMemo(() => {
        const prices = data.map(p => p.price).filter(p => p > 0)
        if (prices.length === 0) return { min: 0, max: 100000 }
        return {
            min: Math.floor(Math.min(...prices)),
            max: Math.ceil(Math.max(...prices))
        }
    }, [data])

    /**
     * useEffect here watches priceStats (which changes when API data loads).
     * When real product prices arrive, we reset the slider range to match.
     *
     * Dependency array [priceStats.min, priceStats.max] means:
     * "run this effect whenever either of these values changes".
     *
     * Without this: slider stays at 0–100 even after real PKR prices load.
     */
    useEffect(() => {
        setPriceRange({ min: priceStats.min, max: priceStats.max })
    }, [priceStats.min, priceStats.max])

    // ─── HANDLERS ────────────────────────────────────────────────────────────

    const handleShowOnlySale = () => setShowOnlySale(prev => !prev)

    const handleSortChange = (option: string) => {
        setSortOption(option)
        setCurrentPage(0)
    }

    const handleType = (newType: string | null) => {
        setType(prev => (prev === newType ? null : newType))
        setCurrentPage(0)
    }

    const handleSize = (newSize: string) => {
        setSize(prev => (prev === newSize ? null : newSize))
        setCurrentPage(0)
    }

    const handlePriceChange = (values: number | number[]) => {
        if (Array.isArray(values)) {
            setPriceRange({ min: values[0], max: values[1] })
            setCurrentPage(0)
        }
    }

    const handleColor = (newColor: string) => {
        setColor(prev => (prev === newColor ? null : newColor))
        setCurrentPage(0)
    }

    const handleBrand = (newBrand: string) => {
        setBrand(prev => (prev === newBrand ? null : newBrand))
        setCurrentPage(0)
    }

    const handleClearAll = () => {
        setShowOnlySale(false)
        setSortOption('')
        setType(null)
        setSize(null)
        setColor(null)
        setBrand(null)
        setPriceRange({ min: priceStats.min, max: priceStats.max })
        setCurrentPage(0)
    }

    // ─── FILTERING ───────────────────────────────────────────────────────────

    let filteredData = data.filter(product => {
        // Sale filter
        if (showOnlySale && !product.sale) return false

        // Gender filter (from URL param) — case-insensitive
        if (gender && product.gender?.toLowerCase() !== gender.toLowerCase()) return false

        // Category filter (from URL param) — case-insensitive
        if (category && product.category?.toLowerCase() !== category.toLowerCase()) return false

        // Type filter (from URL param or sidebar click) — case-insensitive
        const activeType = type ?? dataType
        if (activeType && product.type?.toLowerCase() !== activeType.toLowerCase()) return false

        // Size filter — check stocksRaw for API products, sizes[] for fallback
        if (size) {
            const hasSize = product.stocksRaw && product.stocksRaw.length > 0
                ? product.stocksRaw.some(s => s.size.name === size)
                : product.sizes.includes(size)
            if (!hasSize) return false
        }

        // Color filter — check stocksRaw for API products, variation[] for fallback
        if (color) {
            const hasColor = product.stocksRaw && product.stocksRaw.length > 0
                ? product.stocksRaw.some(s => s.colors.some(c => c.color.name.toLowerCase() === color.toLowerCase()))
                : product.variation.some(v => v.color.toLowerCase() === color.toLowerCase())
            if (!hasColor) return false
        }

        // Brand filter
        if (brand && product.brand !== brand) return false

        // Price range filter
        if (product.price < priceRange.min || product.price > priceRange.max) return false

        return true
    })

    // ─── SORTING ─────────────────────────────────────────────────────────────

    let sortedData = [...filteredData]
    if (sortOption === 'soldQuantityHighToLow') sortedData.sort((a, b) => b.sold - a.sold)
    else if (sortOption === 'discountHighToLow') sortedData.sort((a, b) =>
        Math.floor(100 - (b.price / b.originPrice) * 100) - Math.floor(100 - (a.price / a.originPrice) * 100)
    )
    else if (sortOption === 'priceHighToLow') sortedData.sort((a, b) => b.price - a.price)
    else if (sortOption === 'priceLowToHigh') sortedData.sort((a, b) => a.price - b.price)
    filteredData = sortedData

    const totalProducts = filteredData.length

    if (filteredData.length === 0) {
        filteredData = [{
            id: 'no-data', category: 'no-data', type: 'no-data', name: 'no-data',
            gender: 'no-data', new: false, sale: false, rate: 0, price: 0,
            originPrice: 0, brand: 'no-data', sold: 0, quantity: 0,
            quantityPurchase: 0, sizes: [], variation: [], thumbImage: [],
            images: [], description: 'no-data', action: 'no-data', slug: 'no-data',
        }]
    }

    const pageCount = Math.ceil(filteredData.length / productsPerPage)
    const currentProducts = filteredData.slice(offset, offset + productsPerPage)

    const handlePageChange = (selected: number) => setCurrentPage(selected)

    // ─── RENDER ──────────────────────────────────────────────────────────────

    return (
        <>
            <div className="breadcrumb-block style-img">
                <div className="breadcrumb-main bg-linear overflow-hidden">
                    <div className="container lg:pt-[134px] pt-24 pb-10 relative">
                        <div className="main-content w-full h-full flex flex-col items-center justify-center relative z-[1]">
                            <div className="text-content">
                                <div className="heading2 text-center">{dataType === null ? 'Shop' : dataType}</div>
                                <div className="link flex items-center justify-center gap-1 caption1 mt-3">
                                    <Link href={'/'}>Homepage</Link>
                                    <Icon.CaretRight size={14} className='text-secondary2' />
                                    <div className='text-secondary2 capitalize'>{dataType === null ? 'Shop' : dataType}</div>
                                </div>
                            </div>
                            {/* Top type tabs — built from actual subcategory names in the data */}
                            <div className="list-tab flex flex-wrap items-center justify-center gap-y-5 gap-8 lg:mt-[70px] mt-12 overflow-hidden">
                                {uniqueTypes.map((item) => (
                                    <div
                                        key={item}
                                        className={`tab-item text-button-uppercase cursor-pointer has-line-before line-2px ${type === item ? 'active' : ''}`}
                                        onClick={() => handleType(item)}
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="shop-product breadcrumb1 lg:py-20 md:py-14 py-10">
                <div className="container">
                    <div className="flex max-md:flex-wrap max-md:flex-col-reverse gap-y-8">
                        {/* ── SIDEBAR ── */}
                        <div className="sidebar lg:w-1/4 md:w-1/3 w-full md:pr-12">

                            {/* Products Type */}
                            <div className="filter-type pb-8 border-b border-line">
                                <div className="heading6">Products Type</div>
                                <div className="list-type mt-4">
                                    {uniqueTypes.map((item) => (
                                        <div
                                            key={item}
                                            className={`item flex items-center justify-between cursor-pointer ${type === item ? 'active' : ''}`}
                                            onClick={() => handleType(item)}
                                        >
                                            <div className='text-secondary has-line-before hover:text-black capitalize'>{item}</div>
                                            <div className='text-secondary2'>
                                                ({data.filter(p => p.type === item).length})
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Size — built from actual stock data */}
                            <div className="filter-size pb-8 border-b border-line mt-8">
                                <div className="heading6">Size</div>
                                <div className="list-size flex items-center flex-wrap gap-3 gap-y-4 mt-4">
                                    {uniqueSizes.map((item) => (
                                        <div
                                            key={item}
                                            className={`size-item text-button px-3 py-2 flex items-center justify-center rounded-full border border-line cursor-pointer ${size === item ? 'active' : ''}`}
                                            onClick={() => handleSize(item)}
                                        >
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range — uses real PKR prices from data */}
                            <div className="filter-price pb-8 border-b border-line mt-8">
                                <div className="heading6">Price Range</div>
                                <Slider
                                    range
                                    value={[priceRange.min, priceRange.max]}
                                    min={priceStats.min}
                                    max={priceStats.max}
                                    onChange={handlePriceChange}
                                    className='mt-5'
                                />
                                <div className="price-block flex items-center justify-between flex-wrap mt-4">
                                    <div className="min flex items-center gap-1">
                                        <div>Min:</div>
                                        <div className='price-min'>PKR <span>{priceRange.min.toLocaleString()}</span></div>
                                    </div>
                                    <div className="max flex items-center gap-1">
                                        <div>Max:</div>
                                        <div className='price-max'>PKR <span>{priceRange.max.toLocaleString()}</span></div>
                                    </div>
                                </div>
                            </div>

                            {/* Colors — built from real hex codes in stock data */}
                            <div className="filter-color pb-8 border-b border-line mt-8">
                                <div className="heading6">Colors</div>
                                <div className="list-color flex items-center flex-wrap gap-3 gap-y-4 mt-4">
                                    {uniqueColors.map(({ name, hex }) => (
                                        <div
                                            key={name}
                                            className={`color-item px-3 py-[5px] flex items-center justify-center gap-2 rounded-full border border-line cursor-pointer ${color === name ? 'active' : ''}`}
                                            onClick={() => handleColor(name)}
                                        >
                                            <div
                                                className="w-5 h-5 rounded-full border border-line"
                                                style={{ backgroundColor: hex }}
                                            />
                                            <div className="caption1 capitalize">{name}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Brands — built from actual brand names in product data */}
                            <div className="filter-brand mt-8">
                                <div className="heading6">Brands</div>
                                <div className="list-brand mt-4">
                                    {uniqueBrands.map((item) => (
                                        <div key={item} className="brand-item flex items-center justify-between">
                                            <div className="left flex items-center cursor-pointer">
                                                <div className="block-input">
                                                    <input
                                                        type="checkbox"
                                                        name={item}
                                                        id={item}
                                                        checked={brand === item}
                                                        onChange={() => handleBrand(item)}
                                                    />
                                                    <Icon.CheckSquare size={20} weight='fill' className='icon-checkbox' />
                                                </div>
                                                <label htmlFor={item} className="brand-name capitalize pl-2 cursor-pointer">{item}</label>
                                            </div>
                                            <div className='text-secondary2'>
                                                ({data.filter(p => p.brand === item).length})
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ── PRODUCT LIST ── */}
                        <div className="list-product-block lg:w-3/4 md:w-2/3 w-full md:pl-3">
                            <div className="filter-heading flex items-center justify-between gap-5 flex-wrap">
                                <div className="left flex has-line items-center flex-wrap gap-5">
                                    <div className="choose-layout flex items-center gap-2">
                                        <div className="item three-col w-8 h-8 border border-line rounded flex items-center justify-center cursor-pointer active">
                                            <div className='flex items-center gap-0.5'>
                                                <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                                <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                                <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                            </div>
                                        </div>
                                        <Link href={'/shop/sidebar-list'} className="item row w-8 h-8 border border-line rounded flex items-center justify-center cursor-pointer">
                                            <div className='flex flex-col items-center gap-0.5'>
                                                <span className='w-4 h-[3px] bg-secondary2 rounded-sm'></span>
                                                <span className='w-4 h-[3px] bg-secondary2 rounded-sm'></span>
                                                <span className='w-4 h-[3px] bg-secondary2 rounded-sm'></span>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="check-sale flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            name="filterSale"
                                            id="filter-sale"
                                            className='border-line'
                                            checked={showOnlySale}
                                            onChange={handleShowOnlySale}
                                        />
                                        <label htmlFor="filter-sale" className='caption1 cursor-pointer'>Show only products on sale</label>
                                    </div>
                                </div>
                                <div className="right flex items-center gap-3">
                                    <div className="select-block relative">
                                        <select
                                            id="select-filter"
                                            name="select-filter"
                                            className='caption1 py-2 pl-3 md:pr-20 pr-10 rounded-lg border border-line'
                                            onChange={(e) => handleSortChange(e.target.value)}
                                            value={sortOption || 'Sorting'}
                                        >
                                            <option value="Sorting" disabled>Sorting</option>
                                            <option value="soldQuantityHighToLow">Best Selling</option>
                                            <option value="discountHighToLow">Best Discount</option>
                                            <option value="priceHighToLow">Price High To Low</option>
                                            <option value="priceLowToHigh">Price Low To High</option>
                                        </select>
                                        <Icon.CaretDown size={12} className='absolute top-1/2 -translate-y-1/2 md:right-4 right-2' />
                                    </div>
                                </div>
                            </div>

                            <div className="list-filtered flex items-center gap-3 mt-4">
                                <div className="total-product">
                                    {totalProducts}
                                    <span className='text-secondary pl-1'>Products Found</span>
                                </div>
                                {(type || size || color || brand) && (
                                    <>
                                        <div className="list flex items-center gap-3">
                                            <div className='w-px h-4 bg-line'></div>
                                            {type && (
                                                <div className="item flex items-center px-2 py-1 gap-1 bg-linear rounded-full capitalize cursor-pointer" onClick={() => setType(null)}>
                                                    <Icon.X className='cursor-pointer' /><span>{type}</span>
                                                </div>
                                            )}
                                            {size && (
                                                <div className="item flex items-center px-2 py-1 gap-1 bg-linear rounded-full capitalize cursor-pointer" onClick={() => setSize(null)}>
                                                    <Icon.X className='cursor-pointer' /><span>{size}</span>
                                                </div>
                                            )}
                                            {color && (
                                                <div className="item flex items-center px-2 py-1 gap-1 bg-linear rounded-full capitalize cursor-pointer" onClick={() => setColor(null)}>
                                                    <Icon.X className='cursor-pointer' /><span>{color}</span>
                                                </div>
                                            )}
                                            {brand && (
                                                <div className="item flex items-center px-2 py-1 gap-1 bg-linear rounded-full capitalize cursor-pointer" onClick={() => setBrand(null)}>
                                                    <Icon.X className='cursor-pointer' /><span>{brand}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div
                                            className="clear-btn flex items-center px-2 py-1 gap-1 rounded-full border border-red cursor-pointer"
                                            onClick={handleClearAll}
                                        >
                                            <Icon.X color='rgb(219, 68, 68)' className='cursor-pointer' />
                                            <span className='text-button-uppercase text-red'>Clear All</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="list-product hide-product-sold grid lg:grid-cols-3 grid-cols-2 sm:gap-[30px] gap-[20px] mt-7">
                                {currentProducts.map((item) => (
                                    item.id === 'no-data' ? (
                                        <div key={item.id} className="no-data-product">No products match the selected criteria.</div>
                                    ) : (
                                        <Product key={item.id} data={item} type='grid' style='style-1' />
                                    )
                                ))}
                            </div>

                            {pageCount > 1 && (
                                <div className="list-pagination flex items-center md:mt-10 mt-7">
                                    <HandlePagination pageCount={pageCount} onPageChange={handlePageChange} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ShopBreadCrumb1