'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';

interface InstagramPost {
    id: number
    image: string
    post_url: string
    caption: string
}

interface InstagramSettingsData {
    heading: string
    hashtag: string
    profile_url: string
}

const FALLBACK_SETTINGS: InstagramSettingsData = {
    heading: 'Our Instagram',
    hashtag: '#Trendoes',
    profile_url: 'https://www.instagram.com/',
}

const FALLBACK_POSTS: InstagramPost[] = [
    { id: 1, image: '/images/instagram/1.png', post_url: 'https://www.instagram.com/', caption: '' },
    { id: 2, image: '/images/instagram/2.png', post_url: 'https://www.instagram.com/', caption: '' },
    { id: 3, image: '/images/instagram/3.png', post_url: 'https://www.instagram.com/', caption: '' },
    { id: 4, image: '/images/instagram/4.png', post_url: 'https://www.instagram.com/', caption: '' },
    { id: 5, image: '/images/instagram/5.png', post_url: 'https://www.instagram.com/', caption: '' },
]

interface Props {
    settings?: InstagramSettingsData
    posts?: InstagramPost[]
}

// 'use client' required for Swiper. Data is fetched server-side and passed as props.
const Instagram = ({ settings, posts }: Props) => {
    const s = settings ?? FALLBACK_SETTINGS
    const displayPosts = posts && posts.length > 0 ? posts : FALLBACK_POSTS

    return (
        <div className="instagram-block md:pt-20 pt-10">
            <div className="container">
                <div className="heading">
                    <div className="heading3 text-center">{s.heading}</div>
                    <div className="text-center mt-3">{s.hashtag}</div>
                </div>
                <div className="list-instagram md:mt-10 mt-6">
                    <Swiper
                        spaceBetween={12}
                        slidesPerView={2}
                        loop={true}
                        modules={[Autoplay]}
                        autoplay={{ delay: 4000 }}
                        breakpoints={{
                            500: { slidesPerView: 2, spaceBetween: 16 },
                            680: { slidesPerView: 3, spaceBetween: 16 },
                            992: { slidesPerView: 4, spaceBetween: 16 },
                            1200: { slidesPerView: 5, spaceBetween: 16 },
                        }}
                    >
                        {displayPosts.map((post) => (
                            <SwiperSlide key={post.id}>
                                <Link
                                    href={post.post_url}
                                    target='_blank'
                                    className="item relative block rounded-[32px] overflow-hidden"
                                >
                                    <Image
                                        src={post.image}
                                        width={300}
                                        height={300}
                                        alt={post.caption || s.hashtag}
                                        className='h-full w-full duration-500 relative'
                                    />
                                    <div className="icon w-12 h-12 bg-white hover:bg-black duration-500 flex items-center justify-center rounded-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1]">
                                        <div className="icon-instagram text-2xl text-black"></div>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    )
}

export default Instagram