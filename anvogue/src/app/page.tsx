import React from 'react'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import SliderOne from '@/components/Slider/SliderOne'
import WhatNewOne from '@/components/Home1/WhatNewOne'
import Collection from '@/components/Home1/Collection'
import TabFeatures from '@/components/Home1/TabFeatures'
import Banner from '@/components/Home1/Banner'
import Benefit from '@/components/Home1/Benefit'
import testimonialFallback from '@/data/Testimonial.json'
import Testimonial from '@/components/Home1/Testimonial'
import Instagram from '@/components/Home1/Instagram'
import Brand from '@/components/Home1/Brand'
import Footer from '@/components/Footer/Footer'
import ModalNewsletter from '@/components/Modal/ModalNewsletter'
import { fetchProducts, fetchSliders, fetchTestimonials } from '@/lib/api'
import { mapApiProducts } from '@/lib/mappers'
import productFallback from '@/data/Product.json'

export default async function Home() {
  let productData = productFallback as any[]
  let sliderData: any[] = []

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

  let testimonialData: any[] = testimonialFallback
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
        avatar: '/images/avatar/1.png',
        address: '',
        category: r.product_name,
        images: [],
      }))
    }
  } catch {
    // Fall back to static testimonials
  }

  return (
    <>
      <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
      <div id="header" className='relative w-full'>
        <MenuOne props="bg-transparent" />
        <SliderOne slides={sliderData} />
      </div>
      <WhatNewOne data={productData} start={0} limit={4} />
      <Collection />
      <TabFeatures data={productData} start={0} limit={6} />
      <Banner />
      <Benefit props="md:py-20 py-10" />
      <Testimonial data={testimonialData} limit={6} />
      <Instagram />
      <Brand />
      <Footer />
      <ModalNewsletter />
    </>
  )
}