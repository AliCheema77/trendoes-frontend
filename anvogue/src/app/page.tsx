import React from 'react'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import SliderOne from '@/components/Slider/SliderOne'
import WhatNewOne from '@/components/Home1/WhatNewOne'
import Collection from '@/components/Home1/Collection'
import TabFeatures from '@/components/Home1/TabFeatures'
import Banner from '@/components/Home1/Banner'
import Benefit from '@/components/Home1/Benefit'
import Testimonial from '@/components/Home1/Testimonial'
import Instagram from '@/components/Home1/Instagram'
import Brand from '@/components/Home1/Brand'
import Footer from '@/components/Footer/Footer'
import ModalNewsletter from '@/components/Modal/ModalNewsletter'
import { fetchProducts, fetchSliders, fetchTestimonials, fetchActivePromotion, fetchBanners, fetchBenefits, fetchBrandCarousel, fetchInstagramSettings, fetchInstagramPosts } from '@/lib/api'
import { mapApiProducts } from '@/lib/mappers'
import productFallback from '@/data/Product.json'

const DEFAULT_SLOGAN = 'New customers save 10% with the code GET10'

export default async function Home() {
  let productData = productFallback as any[]
  let sliderData: any[] = []
  let slogan = DEFAULT_SLOGAN
  let bannerData: any[] = []
  let benefitData: any[] = []
  let brandData: any[] = []
  let instagramSettings: any = null
  let instagramPosts: any[] = []

  try {
    const res = await fetchProducts({ page_size: '20' })
    const results = res.results ?? res
    if (Array.isArray(results) && results.length > 0) {
      productData = mapApiProducts(results)
    }
  } catch {
    // Backend unreachable — fall back to static data
  }

  try {
    const slides = await fetchSliders()
    const slideList = Array.isArray(slides) ? slides : (slides?.results ?? [])
    if (slideList.length > 0) sliderData = slideList
  } catch {
    // No sliders configured yet — SliderOne will show fallback
  }

  try {
    const promo = await fetchActivePromotion()
    if (promo?.discount_text && promo?.coupon_code) {
      slogan = `${promo.discount_text} ${promo.coupon_code}`
    } else if (promo?.title) {
      slogan = promo.title
    }
  } catch {
    // No active promotion — keep default slogan
  }

  try {
    const banners = await fetchBanners()
    if (Array.isArray(banners) && banners.length > 0) bannerData = banners
  } catch {
    // No banners yet — Banner component shows FALLBACK_BANNERS
  }

  try {
    const benefits = await fetchBenefits()
    if (Array.isArray(benefits) && benefits.length > 0) benefitData = benefits
  } catch {
    // No benefits yet — Benefit component shows FALLBACK_BENEFITS
  }

  try {
    const brands = await fetchBrandCarousel()
    if (Array.isArray(brands) && brands.length > 0) brandData = brands
  } catch {
    // No brands with logos yet — Brand component shows FALLBACK_BRANDS
  }

  // Fire both Instagram requests simultaneously instead of sequentially
  try {
    const [settings, posts] = await Promise.all([
      fetchInstagramSettings(),
      fetchInstagramPosts(),
    ])
    if (settings) instagramSettings = settings
    if (Array.isArray(posts) && posts.length > 0) instagramPosts = posts
  } catch {
    // Instagram section shows fallback content
  }

  let testimonialData: any[] = []
  try {
    const reviews = await fetchTestimonials()
    if (Array.isArray(reviews) && reviews.length > 0) {
      testimonialData = reviews.map((r: any) => ({
        id: r.id.toString(),
        name: r.name,
        star: r.rating,
        title: r.product_name,
        description: r.comment,
        date: r.date,
        avatar: '',
        address: '',
        category: r.product_name,
        images: [],
      }))
    }
  } catch {
    // testimonials section hidden when unavailable
  }

  return (
    <>
      <TopNavOne props="style-one bg-black" slogan={slogan} />
      <div id="header" className='relative w-full'>
        <MenuOne props="bg-transparent" />
        <SliderOne slides={sliderData} />
      </div>
      <WhatNewOne data={productData} start={0} limit={4} />
      <Collection />
      <TabFeatures data={productData} start={0} limit={6} />
      <Banner banners={bannerData} />
      <Benefit props="md:py-20 py-10" benefits={benefitData} />
      <Testimonial data={testimonialData} limit={6} />
      <Instagram settings={instagramSettings} posts={instagramPosts} />
      <Brand brands={brandData} />
      <Footer />
      <ModalNewsletter />
    </>
  )
}