'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
import { useAuth } from '@/context/AuthContext'
import { fetchUserProfile, trackGuestOrder } from '@/lib/api'

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow text-yellow',
    confirmed: 'bg-blue text-blue',
    processing: 'bg-purple text-purple',
    shipped: 'bg-purple text-purple',
    delivered: 'bg-success text-success',
    cancelled: 'bg-red text-red',
    refunded: 'bg-red text-red',
}

interface OrderItem {
    id: number
    product_name: string
    quantity: number
    size_name: string
    color_name: string
    price: string
}

interface Order {
    id: number
    name: string
    email: string
    total: string
    status: string
    created_at: string
    order_items: OrderItem[]
}

const OrderTracking = () => {
    const { user, accessToken } = useAuth()
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(false)
    const [openDetail, setOpenDetail] = useState<number | null>(null)

    // Guest tracking state
    const [guestOrderId, setGuestOrderId] = useState('')
    const [guestEmail, setGuestEmail] = useState('')
    const [guestLoading, setGuestLoading] = useState(false)
    const [guestOrder, setGuestOrder] = useState<Order | null>(null)
    const [guestError, setGuestError] = useState('')
    const [trackBtnHover, setTrackBtnHover] = useState(false)

    const handleGuestTrack = async (e: React.FormEvent) => {
        e.preventDefault()
        setGuestError('')
        setGuestOrder(null)
        setGuestLoading(true)
        try {
            const data = await trackGuestOrder(guestEmail.trim(), parseInt(guestOrderId))
            setGuestOrder(data)
        } catch (err: any) {
            setGuestError(err?.error || 'Something went wrong. Please try again.')
        } finally {
            setGuestLoading(false)
        }
    }

    useEffect(() => {
        if (!accessToken) return
        setLoading(true)
        fetchUserProfile()
            .then(data => setOrders(data['order data'] || []))
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [accessToken])

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
                <Breadcrumb heading='Order Tracking' subHeading='Order Tracking' />
            </div>
            <div className="order-tracking md:py-20 py-10">
                <div className="container">
                    {user ? (
                        /* ── Logged-in view: show real orders ── */
                        <div>
                            <div className="heading4 mb-2">Your Orders</div>
                            <div className="text-secondary mb-8">
                                Signed in as <span className="text-black font-semibold">{user.username}</span> · {user.email}
                            </div>

                            {loading ? (
                                <div className="flex justify-center py-16">
                                    <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="text-secondary text-center py-16">
                                    You have no orders yet.{' '}
                                    <Link href="/shop/breadcrumb1" className="text-black hover:underline font-semibold">Start shopping</Link>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-5">
                                    {orders.map(order => (
                                        <div key={order.id} className="border border-line rounded-xl overflow-hidden">
                                            {/* Order header */}
                                            <div
                                                className="flex flex-wrap items-center justify-between gap-4 p-5 bg-surface cursor-pointer"
                                                onClick={() => setOpenDetail(openDetail === order.id ? null : order.id)}
                                            >
                                                <div className="flex items-center gap-6 flex-wrap">
                                                    <div>
                                                        <span className="text-secondary text-sm">Order</span>
                                                        <div className="text-button">#{order.id}</div>
                                                    </div>
                                                    <div>
                                                        <span className="text-secondary text-sm">Date</span>
                                                        <div className="text-button">
                                                            {new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className="text-secondary text-sm">Total</span>
                                                        <div className="text-button">PKR {parseFloat(order.total).toFixed(0)}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className={`tag px-4 py-1.5 rounded-full bg-opacity-10 caption1 font-semibold capitalize ${STATUS_COLORS[order.status] || 'bg-yellow text-yellow'}`}>
                                                        {order.status}
                                                    </span>
                                                    <span className="text-secondary text-sm">{openDetail === order.id ? '▲ Hide' : '▼ Details'}</span>
                                                </div>
                                            </div>

                                            {/* Order items */}
                                            {openDetail === order.id && (
                                                <div className="px-5 pb-5">
                                                    {(order.order_items ?? []).map(item => (
                                                        <div key={item.id} className="flex items-center justify-between gap-4 py-4 border-b border-line last:border-0">
                                                            <div>
                                                                <div className="text-title">{item.product_name}</div>
                                                                <div className="caption1 text-secondary mt-1">
                                                                    {item.size_name} / {item.color_name}
                                                                </div>
                                                            </div>
                                                            <div className="text-title flex-shrink-0">
                                                                {item.quantity} × PKR {parseFloat(item.price).toFixed(0)}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <div className="flex justify-between pt-4">
                                                        <span className="text-button">Order Total</span>
                                                        <span className="text-button">PKR {parseFloat(order.total).toFixed(0)}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        /* ── Guest view: tracking form + login prompt ── */
                        <div className="content-main flex gap-y-8 max-md:flex-col">
                            <div className="left md:w-1/2 w-full lg:pr-[60px] md:pr-[40px] md:border-r border-line">
                                <div className="heading4">Order Tracking</div>
                                <div className="mt-2">To track your order please enter your Order ID and the billing email you used at checkout, then press &quot;Track Order&quot;. These were included in your confirmation email.</div>
                                <form className="md:mt-7 mt-4" onSubmit={handleGuestTrack}>
                                    <div>
                                        <input
                                            className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                                            type="number"
                                            placeholder="Order ID *"
                                            value={guestOrderId}
                                            onChange={e => setGuestOrderId(e.target.value)}
                                            required
                                            min={1}
                                        />
                                    </div>
                                    <div className="mt-5">
                                        <input
                                            className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                                            type="email"
                                            placeholder="Billing Email *"
                                            value={guestEmail}
                                            onChange={e => setGuestEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    {guestError && (
                                        <div className="mt-4 text-red caption1">{guestError}</div>
                                    )}
                                    <div className="block-button md:mt-7 mt-4">
                                        <button
                                            type="submit"
                                            disabled={guestLoading}
                                            onMouseEnter={() => setTrackBtnHover(true)}
                                            onMouseLeave={() => setTrackBtnHover(false)}
                                            style={{ width: '100%', padding: '14px', background: trackBtnHover ? '#D2EF9A' : '#1F1F1F', color: trackBtnHover ? '#1F1F1F' : '#fff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', cursor: guestLoading ? 'not-allowed' : 'pointer', opacity: guestLoading ? 0.7 : 1, transition: 'all ease 0.4s' }}
                                        >
                                            {guestLoading ? 'Tracking…' : 'Track Order'}
                                        </button>
                                    </div>
                                </form>

                                {/* Result */}
                                {guestOrder && (
                                    <div className="mt-8 border border-line rounded-xl overflow-hidden">
                                        <div
                                            className="flex flex-wrap items-center justify-between gap-4 p-5 bg-surface cursor-pointer"
                                            onClick={() => setOpenDetail(openDetail === guestOrder.id ? null : guestOrder.id)}
                                        >
                                            <div className="flex items-center gap-6 flex-wrap">
                                                <div>
                                                    <span className="text-secondary text-sm">Order</span>
                                                    <div className="text-button">#{guestOrder.id}</div>
                                                </div>
                                                <div>
                                                    <span className="text-secondary text-sm">Date</span>
                                                    <div className="text-button">
                                                        {new Date(guestOrder.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-secondary text-sm">Total</span>
                                                    <div className="text-button">PKR {parseFloat(guestOrder.total).toFixed(0)}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`tag px-4 py-1.5 rounded-full bg-opacity-10 caption1 font-semibold capitalize ${STATUS_COLORS[guestOrder.status] || 'bg-yellow text-yellow'}`}>
                                                    {guestOrder.status}
                                                </span>
                                                <span className="text-secondary text-sm">{openDetail === guestOrder.id ? '▲ Hide' : '▼ Details'}</span>
                                            </div>
                                        </div>
                                        {openDetail === guestOrder.id && (
                                            <div className="px-5 pb-5">
                                                {(guestOrder.order_items ?? []).map(item => (
                                                    <div key={item.id} className="flex items-center justify-between gap-4 py-4 border-b border-line last:border-0">
                                                        <div>
                                                            <div className="text-title">{item.product_name}</div>
                                                            <div className="caption1 text-secondary mt-1">
                                                                {item.size_name} / {item.color_name}
                                                            </div>
                                                        </div>
                                                        <div className="text-title flex-shrink-0">
                                                            {item.quantity} × PKR {parseFloat(item.price).toFixed(0)}
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="flex justify-between pt-4">
                                                    <span className="text-button">Order Total</span>
                                                    <span className="text-button">PKR {parseFloat(guestOrder.total).toFixed(0)}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="right md:w-1/2 w-full lg:pl-[60px] md:pl-[40px] flex items-center">
                                <div className="text-content">
                                    <div className="heading4">Already have an account?</div>
                                    <div className="mt-2 text-secondary">Welcome back. Sign in to access your personalized experience, saved preferences, and more. We&apos;re thrilled to have you with us again!</div>
                                    <div className="block-button md:mt-7 mt-4">
                                        <Link href={'/login'} className="button-main">Login</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    )
}

export default OrderTracking