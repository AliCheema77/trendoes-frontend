'use client'

import React, { useState, useMemo } from 'react'
import Product from '../Product/Product'
import { ProductType } from '@/type/ProductType'
import { motion } from 'framer-motion'

interface Props {
    data: Array<ProductType>
    start: number
    limit: number
}

const WhatNewOne: React.FC<Props> = ({ data, start, limit }) => {
    const tabs = useMemo(() => {
        const seen = new Set<string>()
        const result: string[] = []
        for (const p of data) {
            if (p.type && !seen.has(p.type)) {
                seen.add(p.type)
                result.push(p.type)
            }
            if (result.length >= 6) break
        }
        return result
    }, [data])

    const [activeTab, setActiveTab] = useState<string>('')

    const currentTab = activeTab || tabs[0] || ''

    const filteredProducts = data.filter(p => p.type === currentTab)

    return (
        <div className="whate-new-block md:pt-20 pt-10">
            <div className="container">
                <div className="heading flex flex-col items-center text-center">
                    <div className="heading3">What&apos;s New</div>
                    {tabs.length > 0 && (
                        <div className="menu-tab flex items-center gap-2 p-1 bg-surface rounded-2xl mt-6 flex-wrap justify-center">
                            {tabs.map(type => (
                                <div
                                    key={type}
                                    className={`tab-item relative text-secondary text-button-uppercase py-2 px-5 cursor-pointer duration-500 hover:text-black ${currentTab === type ? 'active' : ''}`}
                                    onClick={() => setActiveTab(type)}
                                >
                                    {currentTab === type && (
                                        <motion.div layoutId='active-pill' className='absolute inset-0 rounded-2xl bg-white' />
                                    )}
                                    <span className='relative text-button-uppercase z-[1] capitalize'>{type}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="list-product hide-product-sold grid lg:grid-cols-4 grid-cols-2 sm:gap-[30px] gap-[20px] md:mt-10 mt-6">
                    {filteredProducts.slice(start, start + limit).map((prd, index) => (
                        <Product data={prd} type='grid' key={index} style='style-1' />
                    ))}
                    {filteredProducts.length === 0 && (
                        <p className="col-span-4 text-center text-secondary py-10">No products found.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default WhatNewOne