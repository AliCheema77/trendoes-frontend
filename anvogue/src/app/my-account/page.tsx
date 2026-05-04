'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useAuth } from '@/context/AuthContext'
import { fetchUserProfile, updateUserProfile } from '@/lib/api'

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
    product: number
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

const MyAccount = () => {
    const { user, accessToken, isLoading, logout } = useAuth()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<string>('dashboard')
    const [activeOrders, setActiveOrders] = useState<string>('all')
    const [openDetail, setOpenDetail] = useState<number | null>(null)
    const [orders, setOrders] = useState<Order[]>([])
    const [profileLoading, setProfileLoading] = useState(true)
    const [settingForm, setSettingForm] = useState({ first_name: '', last_name: '', phone_number: '' })
    const [settingSaving, setSettingSaving] = useState(false)
    const [settingMsg, setSettingMsg] = useState<string | null>(null)
    const [settingError, setSettingError] = useState<string | null>(null)

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login')
        }
    }, [user, isLoading, router])

    useEffect(() => {
        if (!accessToken) return
        fetchUserProfile(accessToken)
            .then(data => {
                setOrders(data['order data'] || [])
                const u = data['user information ']
                if (u) setSettingForm({ first_name: u.first_name || '', last_name: u.last_name || '', phone_number: u.phone_number || '' })
            })
            .catch(() => {})
            .finally(() => setProfileLoading(false))
    }, [accessToken])

    const handleSettingSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSettingMsg(null)
        setSettingError(null)
        setSettingSaving(true)
        try {
            await updateUserProfile(accessToken!, settingForm)
            setSettingMsg('Profile saved successfully.')
        } catch {
            setSettingError('Failed to save. Please try again.')
        } finally {
            setSettingSaving(false)
        }
    }

    const filteredOrders = activeOrders === 'all'
        ? orders
        : orders.filter(o => o.status === activeOrders)

    const pendingCount = orders.filter(o => o.status === 'pending' || o.status === 'confirmed' || o.status === 'processing').length
    const cancelledCount = orders.filter(o => o.status === 'cancelled').length

    if (isLoading || profileLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!user) return null

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
                <Breadcrumb heading='My Account' subHeading='My Account' />
            </div>
            <div className="profile-block md:py-20 py-10">
                <div className="container">
                    <div className="content-main flex gap-y-8 max-md:flex-col w-full">
                        {/* Sidebar */}
                        <div className="left md:w-1/3 w-full xl:pr-[3.125rem] lg:pr-[28px] md:pr-[16px]">
                            <div className="user-infor bg-surface lg:px-7 px-4 lg:py-10 py-5 md:rounded-[20px] rounded-xl">
                                <div className="heading flex flex-col items-center justify-center">
                                    <div className="avatar">
                                        <Image src={'/images/avatar/1.png'} width={300} height={300} alt='avatar' className='md:w-[140px] w-[120px] md:h-[140px] h-[120px] rounded-full' />
                                    </div>
                                    <div className="name heading6 mt-4 text-center">{user.username}</div>
                                    <div className="mail heading6 font-normal normal-case text-secondary text-center mt-1">{user.email}</div>
                                </div>
                                <div className="menu-tab w-full max-w-none lg:mt-10 mt-6">
                                    {[
                                        { id: 'dashboard', icon: <Icon.HouseLine size={20} />, label: 'Dashboard' },
                                        { id: 'orders', icon: <Icon.Package size={20} />, label: 'History Orders' },
                                        { id: 'setting', icon: <Icon.GearSix size={20} />, label: 'Setting' },
                                    ].map(tab => (
                                        <Link key={tab.id} href='#!' scroll={false} className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white mt-1.5 ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                                            {tab.icon}
                                            <strong className="heading6">{tab.label}</strong>
                                        </Link>
                                    ))}
                                    <button className="item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white mt-1.5" onClick={() => { logout(); router.push('/login') }}>
                                        <Icon.SignOut size={20} />
                                        <strong className="heading6">Logout</strong>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Main content */}
                        <div className="right md:w-2/3 w-full pl-2.5">
                            {/* Dashboard tab */}
                            <div className={`tab text-content w-full ${activeTab === 'dashboard' ? 'block' : 'hidden'}`}>
                                <div className="overview grid sm:grid-cols-3 gap-5">
                                    <div className="item flex items-center justify-between p-5 border border-line rounded-lg box-shadow-xs">
                                        <div className="counter">
                                            <span className="text-secondary">Pending / Processing</span>
                                            <h5 className="heading5 mt-1">{pendingCount}</h5>
                                        </div>
                                        <Icon.HourglassMedium className='text-4xl' />
                                    </div>
                                    <div className="item flex items-center justify-between p-5 border border-line rounded-lg box-shadow-xs">
                                        <div className="counter">
                                            <span className="text-secondary">Cancelled Orders</span>
                                            <h5 className="heading5 mt-1">{cancelledCount}</h5>
                                        </div>
                                        <Icon.ReceiptX className='text-4xl' />
                                    </div>
                                    <div className="item flex items-center justify-between p-5 border border-line rounded-lg box-shadow-xs">
                                        <div className="counter">
                                            <span className="text-secondary">Total Orders</span>
                                            <h5 className="heading5 mt-1">{orders.length}</h5>
                                        </div>
                                        <Icon.Package className='text-4xl' />
                                    </div>
                                </div>
                                <div className="recent_order pt-5 px-5 pb-2 mt-7 border border-line rounded-xl">
                                    <h6 className="heading6">Recent Orders</h6>
                                    <div className="list overflow-x-auto w-full mt-5">
                                        <table className="w-full max-[1400px]:w-[700px] max-md:w-[700px]">
                                            <thead className="border-b border-line">
                                                <tr>
                                                    <th className="pb-3 text-left text-sm font-bold uppercase text-secondary whitespace-nowrap">Order</th>
                                                    <th className="pb-3 text-left text-sm font-bold uppercase text-secondary whitespace-nowrap">Products</th>
                                                    <th className="pb-3 text-left text-sm font-bold uppercase text-secondary whitespace-nowrap">Total</th>
                                                    <th className="pb-3 text-right text-sm font-bold uppercase text-secondary whitespace-nowrap">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orders.slice(0, 6).map(order => (
                                                    <tr key={order.id} className="item duration-300 border-b border-line">
                                                        <th scope="row" className="py-3 text-left">
                                                            <strong className="text-title">#{order.id}</strong>
                                                        </th>
                                                        <td className="py-3">
                                                            <div className="info flex flex-col">
                                                                <strong className="product_name text-button">{order.order_items?.[0]?.product_name || '—'}</strong>
                                                                {(order.order_items?.length ?? 0) > 1 && <span className="caption1 text-secondary">+{(order.order_items?.length ?? 0) - 1} more</span>}
                                                            </div>
                                                        </td>
                                                        <td className="py-3">PKR {parseFloat(order.total).toFixed(0)}</td>
                                                        <td className="py-3 text-right">
                                                            <span className={`tag px-4 py-1.5 rounded-full bg-opacity-10 caption1 font-semibold ${STATUS_COLORS[order.status] || 'bg-yellow text-yellow'}`}>
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {orders.length === 0 && (
                                                    <tr><td colSpan={4} className="py-5 text-secondary text-center">No orders yet.</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Orders history tab */}
                            <div className={`tab text-content overflow-hidden w-full p-7 border border-line rounded-xl ${activeTab === 'orders' ? 'block' : 'hidden'}`}>
                                <h6 className="heading6">Your Orders</h6>
                                <div className="w-full overflow-x-auto">
                                    <div className="menu-tab flex flex-wrap gap-2 border-b border-line mt-3 pb-3">
                                        {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(item => (
                                            <button
                                                key={item}
                                                className={`px-3 py-2 text-sm rounded-full border duration-300 capitalize ${activeOrders === item ? 'bg-black text-white border-black' : 'border-line text-secondary hover:border-black hover:text-black'}`}
                                                onClick={() => setActiveOrders(item)}
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="list_order mt-4">
                                    {filteredOrders.length === 0 ? (
                                        <p className="text-secondary py-5 text-center">No orders found.</p>
                                    ) : (
                                        filteredOrders.map(order => (
                                            <div key={order.id} className="order_item mt-5 border border-line rounded-lg box-shadow-xs">
                                                <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-line">
                                                    <div className="flex items-center gap-2">
                                                        <strong className="text-title">Order #:</strong>
                                                        <strong className="text-button">#{order.id}</strong>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <strong className="text-title">Status:</strong>
                                                        <span className={`tag px-4 py-1.5 rounded-full bg-opacity-10 caption1 font-semibold capitalize ${STATUS_COLORS[order.status] || 'bg-yellow text-yellow'}`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="list_prd px-5">
                                                    {(order.order_items ?? []).map(item => (
                                                        <div key={item.id} className="prd_item flex flex-wrap items-center justify-between gap-3 py-5 border-b border-line">
                                                            <div className="flex items-center gap-3">
                                                                <div>
                                                                    <div className="prd_name text-title">{item.product_name}</div>
                                                                    <div className="caption1 text-secondary mt-1">
                                                                        <span>{item.size_name}</span> / <span>{item.color_name}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className='text-title'>
                                                                {item.quantity} x PKR {parseFloat(item.price).toFixed(0)}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="total-order flex justify-between p-5">
                                                    <strong className="text-title">Total</strong>
                                                    <strong className="text-title">PKR {parseFloat(order.total).toFixed(0)}</strong>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                            {/* Setting tab */}
                            <div className={`tab text-content w-full p-7 border border-line rounded-xl ${activeTab === 'setting' ? 'block' : 'hidden'}`}>
                                <h6 className="heading6">Account Settings</h6>
                                <form className="mt-6" onSubmit={handleSettingSave}>
                                    {settingMsg && <div className="text-sm mb-4 p-3 bg-green bg-opacity-10 text-green rounded-lg">{settingMsg}</div>}
                                    {settingError && <div className="text-sm mb-4 p-3 bg-red bg-opacity-10 text-red rounded-lg">{settingError}</div>}
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-title text-sm mb-1 block">First Name</label>
                                            <input
                                                className="border-line px-4 py-3 w-full rounded-lg"
                                                type="text"
                                                placeholder="First Name"
                                                value={settingForm.first_name}
                                                onChange={e => setSettingForm(p => ({ ...p, first_name: e.target.value }))}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-title text-sm mb-1 block">Last Name</label>
                                            <input
                                                className="border-line px-4 py-3 w-full rounded-lg"
                                                type="text"
                                                placeholder="Last Name"
                                                value={settingForm.last_name}
                                                onChange={e => setSettingForm(p => ({ ...p, last_name: e.target.value }))}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-title text-sm mb-1 block">Email</label>
                                            <input
                                                className="border-line px-4 py-3 w-full rounded-lg bg-surface cursor-not-allowed"
                                                type="email"
                                                value={user?.email || ''}
                                                disabled
                                            />
                                        </div>
                                        <div>
                                            <label className="text-title text-sm mb-1 block">Phone Number</label>
                                            <input
                                                className="border-line px-4 py-3 w-full rounded-lg"
                                                type="text"
                                                placeholder="Phone Number"
                                                value={settingForm.phone_number}
                                                onChange={e => setSettingForm(p => ({ ...p, phone_number: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <button className="button-main" type="submit" disabled={settingSaving}>
                                            {settingSaving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default MyAccount