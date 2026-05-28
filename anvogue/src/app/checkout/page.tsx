'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { useSearchParams } from 'next/navigation';
import { createOrder } from '@/lib/api'
import { StockEntry } from '@/type/ProductType'

interface DiscountCode {
    id: number
    code: string
    discount_percent: number
    min_order_amount: number
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

function resolveStockIds(stocksRaw: StockEntry[] | undefined, sizeName: string, colorName: string) {
    if (!stocksRaw) return { sizeId: null, colorId: null }
    for (const s of stocksRaw) {
        if (s.size.name === sizeName) {
            for (const c of s.colors) {
                if (c.color.name === colorName) return { sizeId: s.size.id, colorId: c.color.id }
            }
        }
    }
    return { sizeId: null, colorId: null }
}

const Checkout = () => {
    const searchParams = useSearchParams()
    const ship = Number(searchParams.get('ship') || 0)
    const router = useRouter()

    const { cartState, removeFromCart } = useCart()
    const { user, accessToken } = useAuth()

    const subtotal = cartState.cartArray.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const [appliedDiscount, setAppliedDiscount] = useState<number>(0)
    const [appliedCode, setAppliedCode] = useState<string>('')
    const [voucherInput, setVoucherInput] = useState<string>('')
    const [voucherError, setVoucherError] = useState<string>('')
    const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([])

    useEffect(() => {
        fetch(`${API_BASE}/inventory/discount-codes`)
            .then(r => r.json())
            .then(data => setDiscountCodes(Array.isArray(data) ? data : []))
            .catch(() => {})
    }, [])

    const applyDiscount = async (code: string) => {
        setVoucherError('')
        try {
            const res = await fetch(`${API_BASE}/inventory/validate-discount`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: code.trim().toUpperCase(), cart_total: subtotal }),
            })
            const data = await res.json()
            if (!res.ok) {
                setVoucherError(data.error || 'Invalid code')
                setAppliedDiscount(0)
                setAppliedCode('')
            } else {
                setAppliedDiscount(data.discount_amount)
                setAppliedCode(data.code)
                setVoucherError('')
            }
        } catch {
            setVoucherError('Could not reach server')
        }
    }

    const handleVoucherSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (voucherInput.trim()) applyDiscount(voucherInput)
    }

    const total = subtotal - appliedDiscount + ship

    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', country: '', city: '', street: '', postalCode: '', notes: '' })
    const [activePayment, setActivePayment] = useState('COD')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (user?.email) {
            setForm(prev => ({ ...prev, email: user.email }))
        }
    }, [user])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.id]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        const items = cartState.cartArray.map(item => {
            const { sizeId, colorId } = resolveStockIds(
                item.stocksRaw,
                item.selectedSize || item.sizes[0],
                item.selectedColor || item.variation[0]?.color
            )
            return {
                product: parseInt(item.id),
                quantity: item.quantity,
                size: sizeId ?? item.sizeId,
                color: colorId ?? item.colorId,
                price: item.price,
            }
        })

        const missingStock = items.some(i => !i.size || !i.color)
        if (missingStock) {
            setError('Some items are missing size/color selection. Please update your cart.')
            return
        }

        const payload = {
            name: `${form.firstName} ${form.lastName}`.trim(),
            email: form.email,
            phone: form.phone,
            street: form.street,
            city: form.city,
            postal_code: form.postalCode,
            country: form.country,
            payment_method: activePayment,
            coupon_code: appliedCode || undefined,
            notes: form.notes,
            subtotal,
            shipping_fee: ship,
            discount: appliedDiscount,
            total,
            items,
        }

        setLoading(true)
        try {
            const order = await createOrder(payload)
            sessionStorage.setItem('lastOrder', JSON.stringify(order))
            cartState.cartArray.forEach(item => removeFromCart(item.id))
            router.push('/order-success')
        } catch (err: any) {
            const msgs = Object.values(err || {}).flat()
            setError(msgs.length > 0 ? (msgs[0] as string) : 'Failed to place order. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
                <Breadcrumb heading='Shopping cart' subHeading='Shopping cart' />
            </div>
            <div className="cart-block md:py-20 py-10">
                <div className="container">
                    <div className="content-main flex justify-between">
                        <div className="left w-1/2">
                            {!user && (
                                <div className="login bg-surface py-3 px-4 flex justify-between rounded-lg">
                                    <div className="left flex items-center">
                                        <span className="text-on-surface-variant1 pr-4">Already have an account? </span>
                                        <Link href="/login" className="text-button text-on-surface hover-underline">Login</Link>
                                    </div>
                                </div>
                            )}
                            {user && (
                                <div className="login bg-surface py-3 px-4 rounded-lg">
                                    <span className="text-on-surface-variant1">Checking out as </span>
                                    <span className="text-button">{user.username}</span>
                                    <span className="text-on-surface-variant1"> ({user.email})</span>
                                </div>
                            )}
                            <div className="information mt-5">
                                <div className="heading5">Information</div>
                                <form className="form-checkout mt-5" onSubmit={handleSubmit}>
                                    {error && <div className="text-red text-sm mb-4 p-3 bg-red bg-opacity-10 rounded-lg">{error}</div>}
                                    <div className="grid sm:grid-cols-2 gap-4 gap-y-5 flex-wrap">
                                        <div>
                                            <input className="border-line px-4 py-3 w-full rounded-lg" id="firstName" type="text" placeholder="First Name *" required value={form.firstName} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <input className="border-line px-4 py-3 w-full rounded-lg" id="lastName" type="text" placeholder="Last Name *" required value={form.lastName} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <input className="border-line px-4 py-3 w-full rounded-lg" id="email" type="email" placeholder="Email Address *" required value={form.email} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <input className="border-line px-4 py-3 w-full rounded-lg" id="phone" type="text" placeholder="Phone Number *" required value={form.phone} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <input className="border-line px-4 py-3 w-full rounded-lg" id="country" type="text" placeholder="Country *" required value={form.country} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <input className="border-line px-4 py-3 w-full rounded-lg" id="city" type="text" placeholder="Town/City *" required value={form.city} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <input className="border-line px-4 py-3 w-full rounded-lg" id="street" type="text" placeholder="Street Address *" required value={form.street} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <input className="border-line px-4 py-3 w-full rounded-lg" id="postalCode" type="text" placeholder="Postal Code *" required value={form.postalCode} onChange={handleChange} />
                                        </div>
                                        <div className="col-span-full">
                                            <textarea className="border border-line px-4 py-3 w-full rounded-lg" id="notes" placeholder="Order notes (optional)" value={form.notes} onChange={handleChange as any} />
                                        </div>
                                    </div>

                                    <div className="voucher-block md:mt-8 mt-6">
                                        <div className="heading5 mb-4">Discount Code</div>
                                        <div className="input-block discount-code w-full h-12">
                                            <form className='w-full h-full relative' onSubmit={handleVoucherSubmit}>
                                                <input
                                                    type="text"
                                                    placeholder='Enter discount code'
                                                    className='w-full h-full bg-surface pl-4 pr-36 rounded-lg border border-line'
                                                    value={voucherInput}
                                                    onChange={e => setVoucherInput(e.target.value)}
                                                />
                                                <button type="submit" className='button-main absolute top-1 bottom-1 right-1 px-5 rounded-lg flex items-center justify-center'>Apply Code</button>
                                            </form>
                                            {voucherError && <div className="caption1 text-red mt-1">{voucherError}</div>}
                                            {appliedCode && <div className="caption1 text-green-600 mt-1 font-semibold">✓ Code {appliedCode} applied — PKR {appliedDiscount} off</div>}
                                        </div>
                                        {discountCodes.length > 0 && (
                                            <div className="list-voucher flex items-center gap-5 flex-wrap mt-5">
                                                {discountCodes.map(dc => (
                                                    <div key={dc.id} className={`item ${appliedCode === dc.code ? 'bg-green' : ''} border border-line rounded-lg py-2`}>
                                                        <div className="top flex gap-10 justify-between px-3 pb-2 border-b border-dashed border-line">
                                                            <div className="left">
                                                                <div className="caption1">Discount</div>
                                                                <div className="caption1 font-bold">{dc.discount_percent}% OFF</div>
                                                            </div>
                                                            <div className="right">
                                                                <div className="caption1">For all orders <br />from PKR {dc.min_order_amount}</div>
                                                            </div>
                                                        </div>
                                                        <div className="bottom gap-6 items-center flex justify-between px-3 pt-2">
                                                            <div className="text-button-uppercase">Code: {dc.code}</div>
                                                            <div
                                                                className="py-1 px-3 rounded-full text-xs font-semibold cursor-pointer capitalize"
                                                                style={appliedCode === dc.code
                                                                    ? { backgroundColor: '#fff', color: '#000', border: '1px solid #000' }
                                                                    : { backgroundColor: '#000', color: '#fff' }
                                                                }
                                                                onClick={() => applyDiscount(dc.code)}
                                                            >
                                                                {appliedCode === dc.code ? 'Applied' : 'Apply Code'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="payment-block md:mt-8 mt-6">
                                        <div className="heading5">Payment Method:</div>
                                        <div className="list-payment mt-5">
                                            {[
                                                { id: 'COD', label: 'Cash on Delivery' },
                                                { id: 'card', label: 'Credit / Debit Card' },
                                                { id: 'bank_transfer', label: 'Bank Transfer' },
                                            ].map(method => (
                                                <div key={method.id} className={`type bg-surface p-5 border border-line rounded-lg mt-3 ${activePayment === method.id ? 'open' : ''}`}>
                                                    <input className="cursor-pointer" type="radio" id={method.id} name="payment" checked={activePayment === method.id} onChange={() => setActivePayment(method.id)} />
                                                    <label className="text-button pl-2 cursor-pointer" htmlFor={method.id}>{method.label}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="md:mt-10 mt-6">
                                        <button
                                            type="submit"
                                            disabled={loading || cartState.cartArray.length === 0}
                                            className="custom-button-main w-full"
                                        >
                                            {loading ? 'Placing Order...' : 'Place Order'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="right w-5/12">
                            <div className="checkout-block">
                                <div className="heading5 pb-3">Your Order</div>
                                <div className="list-product-checkout">
                                    {cartState.cartArray.length < 1 ? (
                                        <p className='text-button pt-3'>No product in cart</p>
                                    ) : (
                                        cartState.cartArray.map(product => (
                                            <div key={product.id} className="item flex items-center justify-between w-full pb-5 border-b border-line gap-6 mt-5">
                                                <div className="bg-img w-[100px] aspect-square flex-shrink-0 rounded-lg overflow-hidden">
                                                    <Image src={product.thumbImage[0]} width={500} height={500} alt='img' className='w-full h-full object-cover' />
                                                </div>
                                                <div className="flex items-center justify-between w-full">
                                                    <div>
                                                        <div className="name text-title">{product.name}</div>
                                                        <div className="caption1 text-secondary mt-2">
                                                            <span className='size capitalize'>{product.selectedSize || product.sizes[0]}</span>
                                                            <span>/</span>
                                                            <span className='color capitalize'>{product.selectedColor || product.variation[0]?.color}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-title">
                                                        <span>{product.quantity}</span>
                                                        <span className='px-1'>x</span>
                                                        <span>PKR {product.price.toFixed(0)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="subtotal-block py-5 flex justify-between border-b border-line">
                                    <div className="text-title">Subtotal</div>
                                    <div className="text-title">PKR {subtotal.toFixed(0)}</div>
                                </div>
                                {appliedDiscount > 0 && (
                                    <div className="discount-block py-5 flex justify-between border-b border-line">
                                        <div className="text-title">Discount ({appliedCode})</div>
                                        <div className="text-title text-green-600">-PKR {appliedDiscount}</div>
                                    </div>
                                )}
                                <div className="ship-block py-5 flex justify-between border-b border-line">
                                    <div className="text-title">Shipping</div>
                                    <div className="text-title">{ship === 0 ? 'Free' : `PKR ${ship}`}</div>
                                </div>
                                <div className="total-cart-block pt-5 flex justify-between">
                                    <div className="heading5">Total</div>
                                    <div className="heading5">PKR {total.toFixed(0)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Checkout