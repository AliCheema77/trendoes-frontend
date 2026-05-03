'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'
import 'swiper/css/bundle'
import { fetchSubCategories } from '@/lib/api'

interface SubCategory {
    id: number
    name: string
    image: string | null
}

const FALLBACK_IMAGE = '/images/collection/top.png'

const Collection = () => {
    const router = useRouter()
    const [subcategories, setSubcategories] = useState<SubCategory[]>([])

    useEffect(() => {
        fetchSubCategories()
            .then(data => {
                const list = Array.isArray(data) ? data : (data?.results ?? [])
                setSubcategories(list)
            })
            .catch(() => {})
    }, [])

    const handleClick = (name: string) => {
        router.push(`/shop/breadcrumb1?type=${encodeURIComponent(name)}`)
    }

    if (subcategories.length === 0) return null

    return (
        <div className="collection-block md:pt-20 pt-10">
            <div className="container">
                <div className="heading3 text-center">Explore Collections</div>
            </div>
            <div className="list-collection section-swiper-navigation md:mt-10 mt-6 sm:px-5 px-4">
                <Swiper
                    spaceBetween={12}
                    slidesPerView={2}
                    navigation
                    loop={subcategories.length > 4}
                    modules={[Navigation, Autoplay]}
                    breakpoints={{
                        576: { slidesPerView: 2, spaceBetween: 12 },
                        768: { slidesPerView: 3, spaceBetween: 20 },
                        1200: { slidesPerView: 4, spaceBetween: 20 },
                    }}
                    className='h-full'
                >
                    {subcategories.map(sub => (
                        <SwiperSlide key={sub.id}>
                            <div
                                className="collection-item block relative rounded-2xl overflow-hidden cursor-pointer"
                                onClick={() => handleClick(sub.name)}
                            >
                                <div className="bg-img">
                                    <Image
                                        src={sub.image || FALLBACK_IMAGE}
                                        width={1000}
                                        height={600}
                                        alt={sub.name}
                                        className="w-full object-cover"
                                    />
                                </div>
                                <div className="collection-name heading5 text-center sm:bottom-8 bottom-4 lg:w-[200px] md:w-[160px] w-[100px] md:py-3 py-1.5 bg-white rounded-xl duration-500 capitalize">
                                    {sub.name}
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    )
}

export default Collection