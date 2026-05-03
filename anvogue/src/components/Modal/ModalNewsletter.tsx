'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import * as Icon from "@phosphor-icons/react/dist/ssr";

interface Promotion {
    id: number
    title: string
    subtitle: string
    discount_text: string
    coupon_code: string
    bg_color: string
    valid_until: string
}

interface Product {
    id: string
    name: string
    thumbImage: string[]
    price: number
    originPrice: number
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

const ModalNewsletter = () => {
    const [open, setOpen] = useState(false)
    const [copied, setCopied] = useState(false)
    const [timeLeft, setTimeLeft] = useState('')
    const [promotion, setPromotion] = useState<Promotion | null>(null)
    const [products, setProducts] = useState<Product[]>([])
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    useEffect(() => {
        // Fetch promotion and products client-side
        fetch(`${API_BASE}/inventory/promotion`, { cache: 'no-store' })
            .then(r => r.json())
            .then(data => {
                if (data && data.id) {
                    setPromotion(data)
                    // Show popup after 3s only if promotion is active
                    setTimeout(() => setOpen(true), 3000)
                }
            })
            .catch(() => {})

        fetch(`${API_BASE}/inventory/best_seller`)
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setProducts(data.slice(0, 5).map((p: any) => ({
                        id: p.id.toString(),
                        name: p.name,
                        thumbImage: p.images?.map((img: any) => img.url) || ['/images/product/1000x1000.png'],
                        price: p.pricing?.finalPrice || 0,
                        originPrice: p.pricing?.actual_price || 0,
                    })))
                }
            })
            .catch(() => {})
    }, [])

    useEffect(() => {
        if (!promotion) return
        const updateCountdown = () => {
            const diff = new Date(promotion.valid_until).getTime() - Date.now()
            if (diff <= 0) { setTimeLeft('Expired'); return }
            const d = Math.floor(diff / 86400000)
            const h = Math.floor((diff % 86400000) / 3600000)
            const m = Math.floor((diff % 3600000) / 60000)
            setTimeLeft(`${d}d ${h}h ${m}m left`)
        }
        updateCountdown()
        intervalRef.current = setInterval(updateCountdown, 60000)
        return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
    }, [promotion])

    const handleCopy = () => {
        navigator.clipboard.writeText(promotion!.coupon_code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (!promotion) return null

    return (
        <div className="modal-newsletter" onClick={() => setOpen(false)}>
            <div className="container h-full flex items-center justify-center w-full">
                <div
                    className={`modal-newsletter-main ${open ? 'open' : ''}`}
                    onClick={e => e.stopPropagation()}
                >
                    <div className="main-content flex rounded-[20px] overflow-hidden w-full">
                        {/* Left — promo panel */}
                        <div
                            className="left lg:w-1/2 sm:w-2/5 max-sm:hidden flex flex-col items-center justify-center gap-4 py-14 px-6"
                            style={{ backgroundColor: promotion.bg_color }}
                        >
                            <div className="text-xs font-semibold uppercase text-center text-white">{promotion.subtitle}</div>
                            <div className="lg:text-[60px] text-4xl lg:leading-[66px] leading-[42px] font-bold uppercase text-center text-white">
                                {promotion.title}
                            </div>
                            <div className="text-sm text-center text-white">{promotion.discount_text}</div>
                            <div className="bg-white py-2 px-4 rounded-lg font-bold tracking-widest text-black">
                                {promotion.coupon_code}
                            </div>
                            <button
                                onClick={handleCopy}
                                style={{ padding: '10px 24px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                            >
                                {copied ? 'Copied!' : 'Copy Coupon Code'}
                            </button>
                            {timeLeft && (
                                <div className="text-xs text-white opacity-80">{timeLeft}</div>
                            )}
                        </div>

                        {/* Right — product list */}
                        <div className="right lg:w-1/2 sm:w-3/5 w-full bg-white sm:pt-10 sm:pl-10 max-sm:p-6 relative">
                            <button
                                className="w-10 h-10 flex items-center justify-center border border-line rounded-full absolute right-5 top-5 cursor-pointer"
                                onClick={() => setOpen(false)}
                            >
                                <Icon.X weight='bold' className='text-xl' />
                            </button>
                            <div className="heading5 pb-5">You May Also Like</div>
                            <div className="flex flex-col gap-4 overflow-y-auto max-h-[420px] sm:pr-6">
                                {products.map(item => (
                                    <Link
                                        key={item.id}
                                        href={`/product/default?id=${item.id}`}
                                        className="flex items-center gap-4 pb-4 border-b border-line hover:opacity-80 duration-200"
                                        onClick={() => setOpen(false)}
                                    >
                                        <Image
                                            src={item.thumbImage[0] || '/images/product/1000x1000.png'}
                                            width={100}
                                            height={100}
                                            alt={item.name}
                                            className="w-[80px] h-[80px] object-cover rounded-lg flex-shrink-0"
                                        />
                                        <div>
                                            <div className="text-button">{item.name}</div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-title">PKR {item.price.toFixed(0)}</span>
                                                {item.originPrice > item.price && (
                                                    <del className="text-secondary text-sm">PKR {item.originPrice.toFixed(0)}</del>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalNewsletter