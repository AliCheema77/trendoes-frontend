'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css/bundle';
import 'swiper/css/effect-fade';

interface SlideItem {
    id?: number
    title: string
    subtitle?: string
    image: string
    link: string
    button_text?: string
}

const FALLBACK_SLIDES: SlideItem[] = [
    {
        title: 'Summer Sale Collections',
        subtitle: 'Sale! Up To 50% Off!',
        image: '/images/slider/bg1-1.png',
        link: '/shop/breadcrumb-img',
        button_text: 'Shop Now',
    },
    {
        title: 'Fashion for Every Occasion',
        subtitle: 'Sale! Up To 50% Off!',
        image: '/images/slider/bg1-2.png',
        link: '/shop/breadcrumb-img',
        button_text: 'Shop Now',
    },
    {
        title: 'Stylish Looks for Any Season',
        subtitle: 'Sale! Up To 50% Off!',
        image: '/images/slider/bg1-3.png',
        link: '/shop/breadcrumb-img',
        button_text: 'Shop Now',
    },
]

interface Props {
    slides?: SlideItem[]
}

const SliderOne = ({ slides }: Props) => {
    const displaySlides = slides && slides.length > 0 ? slides : FALLBACK_SLIDES

    return (
        <div className="slider-block style-one bg-linear xl:h-[860px] lg:h-[800px] md:h-[580px] sm:h-[500px] h-[350px] max-[420px]:h-[320px] w-full">
            <div className="slider-main h-full w-full">
                <Swiper
                    spaceBetween={0}
                    slidesPerView={1}
                    loop={true}
                    pagination={{ clickable: true }}
                    modules={[Pagination, Autoplay]}
                    className='h-full relative'
                    autoplay={{ delay: 4000 }}
                >
                    {displaySlides.map((slide, index) => (
                        <SwiperSlide key={slide.id ?? index}>
                            <div className="slider-item h-full w-full relative">
                                <div className="container w-full h-full flex items-center relative">
                                    <div className="text-content basis-1/2">
                                        {slide.subtitle && (
                                            <div className="text-sub-display">{slide.subtitle}</div>
                                        )}
                                        <div className="text-display md:mt-5 mt-2">{slide.title}</div>
                                        <Link href={slide.link} className="button-main md:mt-8 mt-3">
                                            {slide.button_text || 'Shop Now'}
                                        </Link>
                                    </div>
                                    <div className="sub-img absolute sm:w-1/2 w-3/5 2xl:-right-[60px] -right-[16px] bottom-0">
                                        <Image
                                            src={slide.image}
                                            width={670}
                                            height={936}
                                            alt={slide.title}
                                            priority={index === 0}
                                        />
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    )
}

export default SliderOne