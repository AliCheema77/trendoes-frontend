import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface BannerItem {
    id: number
    title: string
    subtitle: string
    image: string
    link: string
}

// Shown when no banners exist in the database yet
const FALLBACK_BANNERS: BannerItem[] = [
    {
        id: 1,
        title: 'Best Sellers',
        subtitle: 'Shop Now',
        image: '/images/banner/1.png',
        link: '/shop/breadcrumb-img',
    },
    {
        id: 2,
        title: 'New Arrivals',
        subtitle: 'Shop Now',
        image: '/images/banner/2.png',
        link: '/shop/breadcrumb-img',
    },
]

interface Props {
    banners?: BannerItem[]
}

const Banner = ({ banners }: Props) => {
    const displayBanners = banners && banners.length > 0 ? banners : FALLBACK_BANNERS

    return (
        <div className="banner-block style-one grid sm:grid-cols-2 gap-5 md:pt-20 pt-10">
            {displayBanners.map((banner) => (
                <Link key={banner.id} href={banner.link} className="banner-item relative block overflow-hidden duration-500">
                    <div className="banner-img">
                        <Image
                            src={banner.image}
                            width={2000}
                            height={1300}
                            alt={banner.title}
                            priority={true}
                            className='duration-1000'
                        />
                    </div>
                    <div className="banner-content absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                        <div className="heading2 text-white">{banner.title}</div>
                        <div className="text-button text-white relative inline-block pb-1 border-b-2 border-white duration-500 mt-2">
                            {banner.subtitle}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default Banner