'use client'

import React from 'react'
import Link from 'next/link'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { ProductType } from '@/type/ProductType'
import Product from '../Product/Product';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css'
import HandlePagination from '../Other/HandlePagination';
import { FilterOptions } from '@/app/shop/breadcrumb1/page'

interface Props {
    data: ProductType[]
    totalCount: number
    currentPage: number
    productPerPage: number
    isLoading: boolean
    dataType: string | null | undefined
    gender: string | null
    category: string | null
    // Filter state — owned by the parent page
    type: string | null
    size: string | null
    color: string | null
    brand: string | null
    priceRange: { min: number; max: number }
    sortOption: string
    showOnlySale: boolean
    // Sidebar filter options from the /inventory/filter-options endpoint
    filterOptions: FilterOptions
    // Callbacks — parent handles state updates and API refetch
    onTypeChange: (t: string | null) => void
    onSizeChange: (s: string | null) => void
    onColorChange: (c: string | null) => void
    onBrandChange: (b: string | null) => void
    onPriceChange: (values: number | number[]) => void
    onSortChange: (option: string) => void
    onSaleToggle: () => void
    onClearAll: () => void
    onPageChange: (page: number) => void
}

const ShopBreadCrumb1: React.FC<Props> = ({
    data, totalCount, currentPage, productPerPage, isLoading,
    dataType, gender, category,
    type, size, color, brand, priceRange, sortOption, showOnlySale,
    filterOptions,
    onTypeChange, onSizeChange, onColorChange, onBrandChange,
    onPriceChange, onSortChange, onSaleToggle, onClearAll, onPageChange,
}) => {
    const pageCount = Math.ceil(totalCount / productPerPage)

    // Show "no results" placeholder when the API returns an empty page
    const displayProducts = data.length > 0 ? data : [{
        id: 'no-data', category: 'no-data', type: 'no-data', name: 'no-data',
        gender: 'no-data', new: false, sale: false, rate: 0, price: 0,
        originPrice: 0, brand: 'no-data', sold: 0, quantity: 0,
        quantityPurchase: 0, sizes: [], variation: [], thumbImage: [],
        images: [], description: 'no-data', action: 'no-data', slug: 'no-data',
    } as ProductType]

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
                            {/* Top subcategory tabs — sourced from the filter-options endpoint */}
                            <div className="list-tab flex flex-wrap items-center justify-center gap-y-5 gap-8 lg:mt-[70px] mt-12 overflow-hidden">
                                {filterOptions.types.map((item) => (
                                    <div
                                        key={item}
                                        className={`tab-item text-button-uppercase cursor-pointer has-line-before line-2px ${type === item ? 'active' : ''}`}
                                        onClick={() => onTypeChange(item)}
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
                                    {filterOptions.types.map((item) => (
                                        <div
                                            key={item}
                                            className={`item flex items-center justify-between cursor-pointer ${type === item ? 'active' : ''}`}
                                            onClick={() => onTypeChange(item)}
                                        >
                                            <div className='text-secondary has-line-before hover:text-black capitalize'>{item}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Size */}
                            <div className="filter-size pb-8 border-b border-line mt-8">
                                <div className="heading6">Size</div>
                                <div className="list-size flex items-center flex-wrap gap-3 gap-y-4 mt-4">
                                    {filterOptions.sizes.map((item) => (
                                        <div
                                            key={item}
                                            className={`size-item text-button px-3 py-2 flex items-center justify-center rounded-full border border-line cursor-pointer ${size === item ? 'active' : ''}`}
                                            onClick={() => onSizeChange(item)}
                                        >
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="filter-price pb-8 border-b border-line mt-8">
                                <div className="heading6">Price Range</div>
                                <Slider
                                    range
                                    value={[priceRange.min, priceRange.max]}
                                    min={filterOptions.priceRange.min}
                                    max={filterOptions.priceRange.max}
                                    onChange={onPriceChange}
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

                            {/* Colors */}
                            <div className="filter-color pb-8 border-b border-line mt-8">
                                <div className="heading6">Colors</div>
                                <div className="list-color flex items-center flex-wrap gap-3 gap-y-4 mt-4">
                                    {filterOptions.colors.map(({ name, hex }) => (
                                        <div
                                            key={name}
                                            className={`color-item px-3 py-[5px] flex items-center justify-center gap-2 rounded-full border border-line cursor-pointer ${color === name ? 'active' : ''}`}
                                            onClick={() => onColorChange(name)}
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

                            {/* Brands */}
                            <div className="filter-brand mt-8">
                                <div className="heading6">Brands</div>
                                <div className="list-brand mt-4">
                                    {filterOptions.brands.map((item) => (
                                        <div key={item} className="brand-item flex items-center justify-between">
                                            <div className="left flex items-center cursor-pointer">
                                                <div className="block-input">
                                                    <input
                                                        type="checkbox"
                                                        name={item}
                                                        id={item}
                                                        checked={brand === item}
                                                        onChange={() => onBrandChange(item)}
                                                    />
                                                    <Icon.CheckSquare size={20} weight='fill' className='icon-checkbox' />
                                                </div>
                                                <label htmlFor={item} className="brand-name capitalize pl-2 cursor-pointer">{item}</label>
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
                                            onChange={onSaleToggle}
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
                                            onChange={(e) => onSortChange(e.target.value)}
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

                            {/* Active filter chips */}
                            <div className="list-filtered flex items-center gap-3 mt-4">
                                <div className="total-product">
                                    {isLoading ? '...' : totalCount}
                                    <span className='text-secondary pl-1'>Products Found</span>
                                </div>
                                {(type || size || color || brand) && (
                                    <>
                                        <div className="list flex items-center gap-3">
                                            <div className='w-px h-4 bg-line'></div>
                                            {type && (
                                                <div className="item flex items-center px-2 py-1 gap-1 bg-linear rounded-full capitalize cursor-pointer" onClick={() => onTypeChange(null)}>
                                                    <Icon.X className='cursor-pointer' /><span>{type}</span>
                                                </div>
                                            )}
                                            {size && (
                                                <div className="item flex items-center px-2 py-1 gap-1 bg-linear rounded-full capitalize cursor-pointer" onClick={() => onSizeChange(null)}>
                                                    <Icon.X className='cursor-pointer' /><span>{size}</span>
                                                </div>
                                            )}
                                            {color && (
                                                <div className="item flex items-center px-2 py-1 gap-1 bg-linear rounded-full capitalize cursor-pointer" onClick={() => onColorChange(null)}>
                                                    <Icon.X className='cursor-pointer' /><span>{color}</span>
                                                </div>
                                            )}
                                            {brand && (
                                                <div className="item flex items-center px-2 py-1 gap-1 bg-linear rounded-full capitalize cursor-pointer" onClick={() => onBrandChange(null)}>
                                                    <Icon.X className='cursor-pointer' /><span>{brand}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div
                                            className="clear-btn flex items-center px-2 py-1 gap-1 rounded-full border border-red cursor-pointer"
                                            onClick={onClearAll}
                                        >
                                            <Icon.X color='rgb(219, 68, 68)' className='cursor-pointer' />
                                            <span className='text-button-uppercase text-red'>Clear All</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Product grid — subtle opacity when a filter refetch is in flight */}
                            <div
                                className="list-product hide-product-sold grid lg:grid-cols-3 grid-cols-2 sm:gap-[30px] gap-[20px] mt-7"
                                style={{ opacity: isLoading ? 0.5 : 1, transition: 'opacity 0.2s' }}
                            >
                                {displayProducts.map((item) => (
                                    item.id === 'no-data' ? (
                                        <div key={item.id} className="no-data-product">No products match the selected criteria.</div>
                                    ) : (
                                        <Product key={item.id} data={item} type='grid' style='style-1' />
                                    )
                                ))}
                            </div>

                            {pageCount > 1 && (
                                <div className="list-pagination flex items-center md:mt-10 mt-7">
                                    <HandlePagination pageCount={pageCount} onPageChange={onPageChange} />
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