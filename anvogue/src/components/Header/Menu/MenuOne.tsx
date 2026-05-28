'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { usePathname } from 'next/navigation';
import useLoginPopup from '@/store/useLoginPopup';
import useMenuMobile from '@/store/useMenuMobile';
import { useModalCartContext } from '@/context/ModalCartContext';
import { useModalWishlistContext } from '@/context/ModalWishlistContext';
import { useModalSearchContext } from '@/context/ModalSearchContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

// ---------- Types ----------
interface SubCategoryItem {
    id: number
    name: string
    category_name: string
}
interface CategoryGroup {
    name: string
    subcategories: SubCategoryItem[]
}

// ---------- Static fallback (shown instantly, replaced when API responds) ----------
const STATIC_GROUPS: CategoryGroup[] = [
    {
        name: 'Men',
        subcategories: [
            { id: 0, name: 'Outerwear | Coats', category_name: 'Men' },
            { id: 1, name: 'Sweaters | Cardigans', category_name: 'Men' },
            { id: 2, name: 'Shirt | Sweatshirts', category_name: 'Men' },
        ],
    },
    {
        name: 'Women',
        subcategories: [
            { id: 3, name: 'Dresses | Jumpsuits', category_name: 'Women' },
            { id: 4, name: 'T-shirts | Sweatshirts', category_name: 'Women' },
            { id: 5, name: 'Accessories | Jewelry', category_name: 'Women' },
        ],
    },
    {
        name: 'Kids',
        subcategories: [
            { id: 6, name: "Boy's Toy", category_name: 'Kids' },
            { id: 7, name: 'Baby Blanket', category_name: 'Kids' },
            { id: 8, name: 'Newborn Clothing', category_name: 'Kids' },
        ],
    },
]

// ---------- Props ----------
interface Props {
    props: string;
}

const MenuOne: React.FC<Props> = ({ props }) => {
    const router = useRouter()
    const pathname = usePathname()
    const { user, logout } = useAuth()
    const { openLoginPopup, handleLoginPopup } = useLoginPopup()
    const { openMenuMobile, handleMenuMobile } = useMenuMobile()
    const [openSubNavMobile, setOpenSubNavMobile] = useState<number | null>(null)
    const [mobileSearchKeyword, setMobileSearchKeyword] = useState('')
    const { openModalCart } = useModalCartContext()
    const { cartState } = useCart()
    const { openModalWishlist } = useModalWishlistContext()
    const { openModalSearch } = useModalSearchContext()

    const [fixedHeader, setFixedHeader] = useState(false)
    const [lastScrollPosition, setLastScrollPosition] = useState(0)

    // Start with static fallback so nav is visible immediately on page load.
    // The useEffect below overwrites this with live data from the API.
    const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>(STATIC_GROUPS)

    useEffect(() => {
        const CACHE_KEY = 'trendoes_subcategories'
        const CACHE_TTL = 60 * 60 * 1000 // 1 hour

        const applyData = (data: SubCategoryItem[]) => {
            if (!Array.isArray(data) || data.length === 0) return
            const map: Record<string, SubCategoryItem[]> = {}
            for (const sc of data) {
                const cat = sc.category_name || 'Other'
                if (!map[cat]) map[cat] = []
                map[cat].push(sc)
            }
            setCategoryGroups(
                Object.entries(map).map(([name, subcategories]) => ({ name, subcategories }))
            )
        }

        try {
            const cached = localStorage.getItem(CACHE_KEY)
            if (cached) {
                const { data, timestamp } = JSON.parse(cached)
                if (Date.now() - timestamp < CACHE_TTL) {
                    applyData(data)
                    return
                }
            }
        } catch {
            // localStorage unavailable — proceed to fetch
        }

        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
        fetch(`${API_BASE}/inventory/subcategories`)
            .then(r => r.json())
            .then((data: SubCategoryItem[]) => {
                applyData(data)
                try {
                    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }))
                } catch { }
            })
            .catch(() => {
                // API unreachable — STATIC_GROUPS remain in state, nav still works
            })
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setFixedHeader(scrollPosition > 0 && scrollPosition < lastScrollPosition);
            setLastScrollPosition(scrollPosition);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollPosition]);

    const handleOpenSubNavMobile = (index: number) => {
        setOpenSubNavMobile(openSubNavMobile === index ? null : index)
    }

    const genderParam = (name: string) => name.toLowerCase()
    const typeParam = (name: string) => name.toLowerCase()

    return (
        <>
            <div className={`header-menu style-one ${fixedHeader ? 'fixed' : 'absolute'} top-0 left-0 right-0 w-full md:h-[74px] h-[56px] ${props}`}>
                <div className="container mx-auto h-full">
                    <div className="header-main flex justify-between h-full">
                        <div className="menu-mobile-icon lg:hidden flex items-center" onClick={handleMenuMobile}>
                            <i className="icon-category text-2xl"></i>
                        </div>
                        <div className="left flex items-center gap-16">
                            <Link href={'/'} className='flex items-center max-lg:absolute max-lg:left-1/2 max-lg:-translate-x-1/2'>
                                <div className="heading4">Trendoes</div>
                            </Link>
                            {/* Desktop nav — rendered from live API data */}
                            <div className="menu-main h-full max-lg:hidden">
                                <ul className='flex items-center gap-8 h-full'>
                                    {categoryGroups.map((group) => (
                                        <li key={group.name} className='h-full relative'>
                                            <Link
                                                href={`/shop/breadcrumb1?gender=${genderParam(group.name)}`}
                                                className={`text-button-uppercase duration-300 h-full flex items-center justify-center gap-1 ${pathname.includes(`gender=${genderParam(group.name)}`) ? 'active' : ''}`}
                                            >
                                                {group.name}
                                            </Link>
                                            <div className="sub-menu py-3 px-5 -left-10 w-max absolute bg-white rounded-b-xl">
                                                <ul>
                                                    {group.subcategories.map((sc) => (
                                                        <li key={sc.id}>
                                                            <div
                                                                onClick={() => router.push(`/shop/breadcrumb1?gender=${genderParam(group.name)}&type=${typeParam(sc.name)}`)}
                                                                className="link text-secondary duration-300 cursor-pointer"
                                                            >
                                                                {sc.name}
                                                            </div>
                                                        </li>
                                                    ))}
                                                    <li>
                                                        <div
                                                            onClick={() => router.push(`/shop/breadcrumb1?gender=${genderParam(group.name)}`)}
                                                            className="link text-secondary duration-300 cursor-pointer view-all-btn"
                                                        >
                                                            View All
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="right flex gap-12">
                            <div className="max-md:hidden search-icon flex items-center cursor-pointer relative">
                                <Icon.MagnifyingGlass size={24} color='black' onClick={openModalSearch} />
                                <div className="line absolute bg-line w-px h-6 -right-6"></div>
                            </div>
                            <div className="list-action flex items-center gap-4">
                                <div className="user-icon flex items-center justify-center cursor-pointer">
                                    <Icon.User size={24} color='black' onClick={handleLoginPopup} />
                                    <div
                                        className={`login-popup absolute top-[74px] w-[320px] p-7 rounded-xl bg-white box-shadow-sm
                                            ${openLoginPopup ? 'open' : ''}`}
                                    >
                                        {user ? (
                                            <>
                                                <div className="heading6">Hi, {user.username}!</div>
                                                <div className="text-secondary text-sm mt-1 pb-4">{user.email}</div>
                                                <Link href={'/my-account'} className="button-main w-full text-center">Dashboard</Link>
                                                <div className="bottom mt-4 pt-4 border-t border-line"></div>
                                                <div
                                                    onClick={() => { logout(); handleLoginPopup() }}
                                                    className='body1 hover:underline cursor-pointer text-red'
                                                >
                                                    Logout
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <Link href={'/login'} className="button-main w-full text-center">Login</Link>
                                                <div className="text-secondary text-center mt-3 pb-4">Don&apos;t have an account?
                                                    <Link href={'/register'} className='text-black pl-1 hover:underline'>Register</Link>
                                                </div>
                                                <Link href={'/my-account'} className="button-main bg-white text-black border border-black w-full text-center">Dashboard</Link>
                                                <div className="bottom mt-4 pt-4 border-t border-line"></div>
                                                <Link href={'#!'} className='body1 hover:underline'>Support</Link>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="max-md:hidden wishlist-icon flex items-center cursor-pointer" onClick={openModalWishlist}>
                                    <Icon.Heart size={24} color='black' />
                                </div>
                                <div className="cart-icon flex items-center relative cursor-pointer" onClick={openModalCart}>
                                    <Icon.Handbag size={24} color='black' />
                                    <span className="quantity cart-quantity absolute -right-1.5 -top-1.5 text-xs text-white bg-black w-4 h-4 flex items-center justify-center rounded-full">
                                        {cartState.cartArray.reduce((sum, item) => sum + item.quantity, 0)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile nav */}
            <div id="menu-mobile" className={`${openMenuMobile ? 'open' : ''}`}>
                <div className="menu-container bg-white h-full">
                    <div className="container h-full">
                        <div className="menu-main h-full overflow-hidden">
                            <div className="heading py-2 relative flex items-center justify-center">
                                <div
                                    className="close-menu-mobile-btn absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-surface flex items-center justify-center"
                                    onClick={handleMenuMobile}
                                >
                                    <Icon.X size={14} />
                                </div>
                                <Link href={'/'} className='logo text-3xl font-semibold text-center'>Trendoes</Link>
                            </div>
                            <div className="form-search relative mt-2">
                                <Icon.MagnifyingGlass
                                    size={20}
                                    className='absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer'
                                    onClick={() => {
                                        const trimmed = mobileSearchKeyword.trim()
                                        if (trimmed) router.push(`/search-result?query=${encodeURIComponent(trimmed)}`)
                                    }}
                                />
                                <input
                                    type="text"
                                    placeholder='What are you looking for?'
                                    className='h-12 rounded-lg border border-line text-sm w-full pl-10 pr-4'
                                    value={mobileSearchKeyword}
                                    onChange={(e) => setMobileSearchKeyword(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            const trimmed = mobileSearchKeyword.trim()
                                            if (trimmed) router.push(`/search-result?query=${encodeURIComponent(trimmed)}`)
                                        }
                                    }}
                                />
                            </div>
                            <div className="list-nav mt-6">
                                <ul>
                                    {categoryGroups.map((group, index) => (
                                        <li
                                            key={group.name}
                                            className={`${index > 0 ? 'mt-5' : ''} ${openSubNavMobile === index ? 'open' : ''}`}
                                            onClick={() => handleOpenSubNavMobile(index)}
                                        >
                                            <a href={'#!'} className='text-xl font-semibold flex items-center justify-between'>
                                                {group.name}
                                                <span className='text-right'>
                                                    <Icon.CaretRight size={20} />
                                                </span>
                                            </a>
                                            <div className="sub-nav-mobile">
                                                <div className="back-btn flex items-center gap-3" onClick={() => handleOpenSubNavMobile(index)}>
                                                    <Icon.CaretLeft />
                                                    Back
                                                </div>
                                                <div className="list-nav-item w-full pt-2 pb-6">
                                                    <ul>
                                                        {group.subcategories.map((sc) => (
                                                            <li key={sc.id}>
                                                                <div
                                                                    onClick={() => router.push(`/shop/breadcrumb1?gender=${genderParam(group.name)}&type=${typeParam(sc.name)}`)}
                                                                    className="link text-secondary duration-300 cursor-pointer"
                                                                >
                                                                    {sc.name}
                                                                </div>
                                                            </li>
                                                        ))}
                                                        <li>
                                                            <div
                                                                onClick={() => router.push(`/shop/breadcrumb1?gender=${genderParam(group.name)}`)}
                                                                className="link text-secondary duration-300 cursor-pointer view-all-btn"
                                                            >
                                                                View All
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="menu_bar fixed bg-white bottom-0 left-0 w-full h-[70px] sm:hidden z-[101]">
                <div className="menu_bar-inner grid grid-cols-4 items-center h-full">
                    <Link href={'/'} className='menu_bar-link flex flex-col items-center gap-1'>
                        <Icon.House weight='bold' className='text-2xl' />
                        <span className="menu_bar-title caption2 font-semibold">Home</span>
                    </Link>
                    <Link href={'/shop/filter-canvas'} className='menu_bar-link flex flex-col items-center gap-1'>
                        <Icon.List weight='bold' className='text-2xl' />
                        <span className="menu_bar-title caption2 font-semibold">Category</span>
                    </Link>
                    <Link href={'/search-result'} className='menu_bar-link flex flex-col items-center gap-1'>
                        <Icon.MagnifyingGlass weight='bold' className='text-2xl' />
                        <span className="menu_bar-title caption2 font-semibold">Search</span>
                    </Link>
                    <Link href={'/cart'} className='menu_bar-link flex flex-col items-center gap-1'>
                        <div className="icon relative">
                            <Icon.Handbag weight='bold' className='text-2xl' />
                            <span className="quantity cart-quantity absolute -right-1.5 -top-1.5 text-xs text-white bg-black w-4 h-4 flex items-center justify-center rounded-full">
                                {cartState.cartArray.reduce((sum, item) => sum + item.quantity, 0)}
                            </span>
                        </div>
                        <span className="menu_bar-title caption2 font-semibold">Cart</span>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default MenuOne