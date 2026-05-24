import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import * as Icon from "@phosphor-icons/react/dist/ssr";

// Social links come from .env.local — update those values, not this file
const SOCIAL = {
    facebook:  process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK  || 'https://www.facebook.com/',
    instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || 'https://www.instagram.com/',
    twitter:   process.env.NEXT_PUBLIC_SOCIAL_TWITTER   || 'https://twitter.com/',
    youtube:   process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE   || 'https://www.youtube.com/',
    pinterest: process.env.NEXT_PUBLIC_SOCIAL_PINTEREST || 'https://www.pinterest.com/',
}

const Footer = () => {
    return (
        <div id="footer" className='footer'>
            <div className="footer-main bg-surface">
                <div className="container">
                    <div className="content-footer py-[60px] flex justify-between flex-wrap gap-y-8">
                        <div className="company-infor basis-1/4 max-lg:basis-full pr-7">
                            <Link href={'/'} className="logo">
                                <div className="heading4">Trendoes</div>
                            </Link>
                            <div className='flex gap-3 mt-3'>
                                <div className="flex flex-col">
                                    <span className="text-button">Mail:</span>
                                    <span className="text-button mt-3">Phone:</span>
                                    <span className="text-button mt-3">Address:</span>
                                </div>
                                <div className="flex flex-col">
                                    <span>info@trendoes.com</span>
                                    <span className='mt-3'>+92-303-7555545</span>
                                    <span className='mt-3 pt-px'>Chishtian, Pakistan</span>
                                </div>
                            </div>
                        </div>
                        <div className="right-content flex flex-wrap gap-y-8 basis-3/4 max-lg:basis-full">
                            <div className="list-nav flex justify-between basis-2/3 max-md:basis-full gap-4">
                                <div className="item flex flex-col basis-1/3">
                                    <div className="text-button-uppercase pb-3">Information</div>
                                    <Link className='caption1 has-line-before duration-300 w-fit' href={'/pages/contact'}>Contact us</Link>
                                    <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/my-account'}>My Account</Link>
                                    <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/order-tracking'}>Order & Returns</Link>
                                    <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/pages/faqs'}>FAQs</Link>
                                </div>
                                <div className="item flex flex-col basis-1/3">
                                    <div className="text-button-uppercase pb-3">Quick Shop</div>
                                    <Link className='caption1 has-line-before duration-300 w-fit' href={'/shop/breadcrumb1?gender=women'}>Women</Link>
                                    <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/shop/breadcrumb1?gender=men'}>Men</Link>
                                    <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/shop/breadcrumb1?gender=kids'}>Kids</Link>
                                    <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/blog'}>Blog</Link>
                                </div>
                                <div className="item flex flex-col basis-1/3">
                                    <div className="text-button-uppercase pb-3">Customer Services</div>
                                    <Link className='caption1 has-line-before duration-300 w-fit' href={'/pages/faqs'}>Orders FAQs</Link>
                                    <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/pages/faqs'}>Shipping</Link>
                                    <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/pages/faqs'}>Privacy Policy</Link>
                                    <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/order-tracking'}>Return & Refund</Link>
                                </div>
                            </div>
                            <div className="newsletter basis-1/3 pl-7 max-md:basis-full max-md:pl-0">
                                <div className="text-button-uppercase">Newsletter</div>
                                <div className="caption1 mt-3">Sign up and get 10% off your first order</div>
                                <div className="input-block w-full h-[52px] mt-4">
                                    <form className='w-full h-full relative' action="post">
                                        <input type="email" placeholder='Enter your e-mail' className='caption1 w-full h-full pl-4 pr-14 rounded-xl border border-line' required />
                                        <button className='w-[44px] h-[44px] bg-black flex items-center justify-center rounded-xl absolute top-1 right-1'>
                                            <Icon.ArrowRight size={24} color='#fff' />
                                        </button>
                                    </form>
                                </div>
                                <div className="list-social flex items-center gap-6 mt-4">
                                    <Link href={SOCIAL.facebook} target='_blank'>
                                        <div className="icon-facebook text-2xl text-black"></div>
                                    </Link>
                                    <Link href={SOCIAL.instagram} target='_blank'>
                                        <div className="icon-instagram text-2xl text-black"></div>
                                    </Link>
                                    <Link href={SOCIAL.twitter} target='_blank'>
                                        <div className="icon-twitter text-2xl text-black"></div>
                                    </Link>
                                    <Link href={SOCIAL.youtube} target='_blank'>
                                        <div className="icon-youtube text-2xl text-black"></div>
                                    </Link>
                                    <Link href={SOCIAL.pinterest} target='_blank'>
                                        <div className="icon-pinterest text-2xl text-black"></div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom py-3 flex items-center justify-between gap-5 max-lg:justify-center max-lg:flex-col border-t border-line">
                        <div className="copyright caption1 text-secondary">
                            ©{new Date().getFullYear()} Trendoes. All Rights Reserved.
                        </div>
                        <div className="right flex items-center gap-2">
                            <div className="caption1 text-secondary">Payment:</div>
                            {[0, 1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="payment-img">
                                    <Image
                                        src={`/images/payment/Frame-${i}.png`}
                                        width={500}
                                        height={500}
                                        alt='payment'
                                        className='w-9'
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer