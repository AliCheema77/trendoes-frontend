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
    const { openModalCart } = useModalCartContext()
    const { cartState } = useCart()
    const { openModalWishlist } = useModalWishlistContext()
    const { openModalSearch } = useModalSearchContext()

    const handleOpenSubNavMobile = (index: number) => {
        setOpenSubNavMobile(openSubNavMobile === index ? null : index)
    }

    const [fixedHeader, setFixedHeader] = useState(false)
    const [lastScrollPosition, setLastScrollPosition] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setFixedHeader(scrollPosition > 0 && scrollPosition < lastScrollPosition);
            setLastScrollPosition(scrollPosition);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollPosition]);

    const handleGenderClick = (gender: string) => {
        router.push(`/shop/breadcrumb1?gender=${gender}`);
    };

    const handleGenderTypeClick = (gender: string, type: string) => {
        router.push(`/shop/breadcrumb1?gender=${gender}&type=${type}`);
    };

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
                                <div className="heading4">Anvogue</div>
                            </Link>
                            <div className="menu-main h-full max-lg:hidden">
                                <ul className='flex items-center gap-8 h-full'>
                                    <li className='h-full relative'>
                                        <Link
                                            href="/shop/breadcrumb1?gender=men"
                                            className={`text-button-uppercase duration-300 h-full flex items-center justify-center gap-1 ${pathname.includes('gender=men') ? 'active' : ''}`}
                                        >
                                            Men
                                        </Link>
                                        <div className="sub-menu py-3 px-5 -left-10 w-max absolute bg-white rounded-b-xl">
                                            <ul>
                                                <li>
                                                    <div onClick={() => handleGenderTypeClick('men', 'outerwear')} className="link text-secondary duration-300 cursor-pointer">
                                                        Outerwear | Coats
                                                    </div>
                                                </li>
                                                <li>
                                                    <div onClick={() => handleGenderTypeClick('men', 'sweater')} className="link text-secondary duration-300 cursor-pointer">
                                                        Sweaters | Cardigans
                                                    </div>
                                                </li>
                                                <li>
                                                    <div onClick={() => handleGenderTypeClick('men', 'shirt')} className="link text-secondary duration-300 cursor-pointer">
                                                        Shirt | Sweatshirts
                                                    </div>
                                                </li>
                                                <li>
                                                    <div onClick={() => handleGenderClick('men')} className="link text-secondary duration-300 cursor-pointer view-all-btn">
                                                        View All
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                    <li className='h-full relative'>
                                        <Link
                                            href="/shop/breadcrumb1?gender=women"
                                            className={`text-button-uppercase duration-300 h-full flex items-center justify-center gap-1 ${pathname.includes('gender=women') ? 'active' : ''}`}
                                        >
                                            Women
                                        </Link>
                                        <div className="sub-menu py-3 px-5 -left-10 w-max absolute bg-white rounded-b-xl">
                                            <ul>
                                                <li>
                                                    <div onClick={() => handleGenderTypeClick('women', 'dress')} className="link text-secondary duration-300 cursor-pointer">
                                                        Dresses | Jumpsuits
                                                    </div>
                                                </li>
                                                <li>
                                                    <div onClick={() => handleGenderTypeClick('women', 't-shirt')} className="link text-secondary duration-300 cursor-pointer">
                                                        T-shirts | Sweatshirts
                                                    </div>
                                                </li>
                                                <li>
                                                    <div onClick={() => handleGenderTypeClick('women', 'accessories')} className="link text-secondary duration-300 cursor-pointer">
                                                        Accessories | Jewelry
                                                    </div>
                                                </li>
                                                <li>
                                                    <div onClick={() => handleGenderClick('women')} className="link text-secondary duration-300 cursor-pointer view-all-btn">
                                                        View All
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                    <li className='h-full relative'>
                                        <Link
                                            href="/shop/breadcrumb1?gender=kids"
                                            className={`text-button-uppercase duration-300 h-full flex items-center justify-center gap-1 ${pathname.includes('gender=kids') ? 'active' : ''}`}
                                        >
                                            Kids
                                        </Link>
                                        <div className="sub-menu py-3 px-5 -left-10 w-max absolute bg-white rounded-b-xl">
                                            <ul>
                                                <li>
                                                    <div onClick={() => handleGenderTypeClick('kids', 'toy')} className="link text-secondary duration-300 cursor-pointer">
                                                        Boy&apos;s Toy
                                                    </div>
                                                </li>
                                                <li>
                                                    <div onClick={() => handleGenderTypeClick('kids', 'blanket')} className="link text-secondary duration-300 cursor-pointer">
                                                        Baby Blanket
                                                    </div>
                                                </li>
                                                <li>
                                                    <div onClick={() => handleGenderTypeClick('kids', 'clothing')} className="link text-secondary duration-300 cursor-pointer">
                                                        Newborn Clothing
                                                    </div>
                                                </li>
                                                <li>
                                                    <div onClick={() => handleGenderClick('kids')} className="link text-secondary duration-300 cursor-pointer view-all-btn">
                                                        View All
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
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
                                <Link href={'/'} className='logo text-3xl font-semibold text-center'>Anvogue</Link>
                            </div>
                            <div className="form-search relative mt-2">
                                <Icon.MagnifyingGlass size={20} className='absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer' />
                                <input type="text" placeholder='What are you looking for?' className=' h-12 rounded-lg border border-line text-sm w-full pl-10 pr-4' />
                            </div>
                            <div className="list-nav mt-6">
                                <ul>
                                    <li
                                        className={`${openSubNavMobile === 1 ? 'open' : ''}`}
                                        onClick={() => handleOpenSubNavMobile(1)}
                                    >
                                        <a href={'#!'} className='text-xl font-semibold flex items-center justify-between'>Men
                                            <span className='text-right'>
                                                <Icon.CaretRight size={20} />
                                            </span>
                                        </a>
                                        <div className="sub-nav-mobile">
                                            <div className="back-btn flex items-center gap-3" onClick={() => handleOpenSubNavMobile(1)}>
                                                <Icon.CaretLeft />
                                                Back
                                            </div>
                                            <div className="list-nav-item w-full pt-2 pb-6">
                                                <ul>
                                                    <li>
                                                        <div onClick={() => handleGenderTypeClick('men', 'outerwear')} className="link text-secondary duration-300 cursor-pointer">
                                                            Outerwear | Coats
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div onClick={() => handleGenderTypeClick('men', 'sweater')} className="link text-secondary duration-300 cursor-pointer">
                                                            Sweaters | Cardigans
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div onClick={() => handleGenderTypeClick('men', 'shirt')} className="link text-secondary duration-300 cursor-pointer">
                                                            Shirt | Sweatshirts
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div onClick={() => handleGenderClick('men')} className="link text-secondary duration-300 cursor-pointer view-all-btn">
                                                            View All
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                    <li
                                        className={`${openSubNavMobile === 2 ? 'open' : ''}`}
                                        onClick={() => handleOpenSubNavMobile(2)}
                                    >
                                        <a href={'#!'} className='text-xl font-semibold flex items-center justify-between mt-5'>Women
                                            <span className='text-right'>
                                                <Icon.CaretRight size={20} />
                                            </span>
                                        </a>
                                        <div className="sub-nav-mobile">
                                            <div className="back-btn flex items-center gap-3" onClick={() => handleOpenSubNavMobile(2)}>
                                                <Icon.CaretLeft />
                                                Back
                                            </div>
                                            <div className="list-nav-item w-full pt-2 pb-6">
                                                <ul>
                                                    <li>
                                                        <div onClick={() => handleGenderTypeClick('women', 'dress')} className="link text-secondary duration-300 cursor-pointer">
                                                            Dresses | Jumpsuits
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div onClick={() => handleGenderTypeClick('women', 't-shirt')} className="link text-secondary duration-300 cursor-pointer">
                                                            T-shirts | Sweatshirts
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div onClick={() => handleGenderTypeClick('women', 'accessories')} className="link text-secondary duration-300 cursor-pointer">
                                                            Accessories | Jewelry
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div onClick={() => handleGenderClick('women')} className="link text-secondary duration-300 cursor-pointer view-all-btn">
                                                            View All
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                    <li
                                        className={`${openSubNavMobile === 3 ? 'open' : ''}`}
                                        onClick={() => handleOpenSubNavMobile(3)}
                                    >
                                        <a href={'#!'} className='text-xl font-semibold flex items-center justify-between mt-5'>Kids
                                            <span className='text-right'>
                                                <Icon.CaretRight size={20} />
                                            </span>
                                        </a>
                                        <div className="sub-nav-mobile">
                                            <div className="back-btn flex items-center gap-3" onClick={() => handleOpenSubNavMobile(3)}>
                                                <Icon.CaretLeft />
                                                Back
                                            </div>
                                            <div className="list-nav-item w-full pt-2 pb-6">
                                                <ul>
                                                    <li>
                                                        <div onClick={() => handleGenderTypeClick('kids', 'toy')} className="link text-secondary duration-300 cursor-pointer">
                                                            Boy&apos;s Toy
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div onClick={() => handleGenderTypeClick('kids', 'blanket')} className="link text-secondary duration-300 cursor-pointer">
                                                            Baby Blanket
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div onClick={() => handleGenderTypeClick('kids', 'clothing')} className="link text-secondary duration-300 cursor-pointer">
                                                            Newborn Clothing
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div onClick={() => handleGenderClick('kids')} className="link text-secondary duration-300 cursor-pointer view-all-btn">
                                                            View All
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
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
