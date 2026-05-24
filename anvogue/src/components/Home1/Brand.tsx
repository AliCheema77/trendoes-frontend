'use client'

import React from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';

interface BrandItem {
    id: number
    name: string
    logo: string
}

// Shown until real brands with logos are added in Django admin
const FALLBACK_BRANDS: BrandItem[] = [
    { id: 1, name: 'Brand 1', logo: '/images/brand/1.png' },
    { id: 2, name: 'Brand 2', logo: '/images/brand/2.png' },
    { id: 3, name: 'Brand 3', logo: '/images/brand/3.png' },
    { id: 4, name: 'Brand 4', logo: '/images/brand/4.png' },
    { id: 5, name: 'Brand 5', logo: '/images/brand/5.png' },
    { id: 6, name: 'Brand 6', logo: '/images/brand/6.png' },
]

interface Props {
    brands?: BrandItem[]
}

// 'use client' is required because Swiper uses browser APIs (touch, DOM)
// but the data itself is fetched server-side and passed as a prop — no useEffect needed
const Brand = ({ brands }: Props) => {
    const displayBrands = brands && brands.length > 0 ? brands : FALLBACK_BRANDS

    return (
        <div className="brand-block md:py-[60px] py-[32px]">
            <div className="container">
                <div className="list-brand">
                    <Swiper
                        spaceBetween={12}
                        slidesPerView={2}
                        loop={true}
                        modules={[Autoplay]}
                        autoplay={{ delay: 4000 }}
                        breakpoints={{
                            500: { slidesPerView: 3, spaceBetween: 16 },
                            680: { slidesPerView: 4, spaceBetween: 16 },
                            992: { slidesPerView: 5, spaceBetween: 16 },
                            1200: { slidesPerView: 6, spaceBetween: 16 },
                        }}
                    >
                        {displayBrands.map((brand) => (
                            <SwiperSlide key={brand.id}>
                                <div className="brand-item relative flex items-center justify-center h-[36px]">
                                    <Image
                                        src={brand.logo}
                                        width={300}
                                        height={300}
                                        alt={brand.name}
                                        className='h-full w-auto duration-500 relative object-cover'
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    )
}

export default Brand