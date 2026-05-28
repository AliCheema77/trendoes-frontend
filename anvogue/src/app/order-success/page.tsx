'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'

// The shape of an order item returned by the backend
interface OrderItem {
    id: number
    product_name: string
    quantity: number
    size_name: string
    color_name: string
    price: string
}

// The shape of the order returned by POST /invoice/invoice
interface Order {
    id: number
    name: string
    email: string
    phone: string
    street: string
    city: string
    subtotal: string
    shipping_fee: string
    discount: string
    total: string
    payment_method: string
    status: string
    created_at: string
    order_items: OrderItem[]
}

const OrderSuccess = () => {
    const [order, setOrder] = useState<Order | null>(null)

    useEffect(() => {
        // Read the order that checkout stored just before redirecting here.
        // We delete it immediately so refreshing the page shows the fallback
        // instead of stale data from a previous order.
        const raw = sessionStorage.getItem('lastOrder')
        if (raw) {
            setOrder(JSON.parse(raw))
            sessionStorage.removeItem('lastOrder')
        }
    }, [])

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
                <Breadcrumb heading='Order Confirmed' subHeading='Order Confirmed' />
            </div>

            <div className="order-success md:py-20 py-10">
                <div className="container">
                    {order ? (
                        <div className="max-w-2xl mx-auto">
                            {/* Success header */}
                            <div className="text-center mb-10">
                                <div style={{ width: 64, height: 64, background: '#f0fdf4', border: '2px solid #bbf7d0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                                <div className="heading4">Thank you, {order.name.split(' ')[0]}!</div>
                                <div className="text-secondary mt-2">
                                    Your order <span className="text-black font-semibold">#{order.id}</span> has been placed successfully.
                                    A confirmation will be sent to <span className="text-black font-semibold">{order.email}</span>.
                                </div>
                            </div>

                            {/* Order items */}
                            <div className="border border-line rounded-xl overflow-hidden mb-6">
                                <div className="bg-surface px-5 py-3 text-button">Order Summary</div>
                                <div className="px-5">
                                    {order.order_items.map(item => (
                                        <div key={item.id} className="flex items-center justify-between gap-4 py-4 border-b border-line last:border-0">
                                            <div>
                                                <div className="text-title">{item.product_name}</div>
                                                <div className="caption1 text-secondary mt-1">{item.size_name} / {item.color_name}</div>
                                            </div>
                                            <div className="text-title flex-shrink-0">
                                                {item.quantity} × PKR {parseFloat(item.price).toFixed(0)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals */}
                                <div className="px-5 py-4 bg-surface border-t border-line space-y-2">
                                    <div className="flex justify-between text-secondary text-sm">
                                        <span>Subtotal</span>
                                        <span>PKR {parseFloat(order.subtotal).toFixed(0)}</span>
                                    </div>
                                    <div className="flex justify-between text-secondary text-sm">
                                        <span>Shipping</span>
                                        <span>{parseFloat(order.shipping_fee) === 0 ? 'Free' : `PKR ${parseFloat(order.shipping_fee).toFixed(0)}`}</span>
                                    </div>
                                    {parseFloat(order.discount) > 0 && (
                                        <div className="flex justify-between text-sm" style={{ color: '#16a34a' }}>
                                            <span>Discount</span>
                                            <span>− PKR {parseFloat(order.discount).toFixed(0)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-button pt-2 border-t border-line">
                                        <span>Total</span>
                                        <span>PKR {parseFloat(order.total).toFixed(0)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery address */}
                            <div className="border border-line rounded-xl overflow-hidden mb-8">
                                <div className="bg-surface px-5 py-3 text-button">Delivery Address</div>
                                <div className="px-5 py-4 text-secondary text-sm space-y-1">
                                    <div>{order.street}</div>
                                    <div>{order.city}{order.phone ? ` · ${order.phone}` : ''}</div>
                                    <div className="capitalize">Payment: {order.payment_method.replace('_', ' ')}</div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4">
                                <Link href="/shop/breadcrumb1" style={{ flex: 1, padding: '14px', background: '#000', color: '#fff', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textAlign: 'center', textDecoration: 'none' }}>
                                    Continue Shopping
                                </Link>
                                <Link href="/order-tracking" style={{ flex: 1, padding: '14px', background: 'transparent', color: '#000', border: '1.5px solid #000', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textAlign: 'center', textDecoration: 'none' }}>
                                    Track Orders
                                </Link>
                            </div>
                        </div>
                    ) : (
                        /* Fallback: user landed here directly or refreshed the page */
                        <div className="text-center py-20">
                            <div className="heading4 mb-3">No order found</div>
                            <div className="text-secondary mb-8">It looks like you navigated here directly. Place an order to see your confirmation.</div>
                            <Link href="/shop/breadcrumb1" style={{ display: 'inline-block', padding: '14px 32px', background: '#000', color: '#fff', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none' }}>
                                Shop Now
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    )
}

export default OrderSuccess