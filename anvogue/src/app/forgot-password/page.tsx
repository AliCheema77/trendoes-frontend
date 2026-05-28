'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
import { requestPasswordReset } from '@/lib/api'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState('')
    const [btnHover, setBtnHover] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            await requestPasswordReset(email)
            setSubmitted(true)
        } catch (err: any) {
            setError(err?.email?.[0] || err?.error || 'Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
                <Breadcrumb heading='Forget your password' subHeading='Forget your password' />
            </div>
            <div className="forgot-pass md:py-20 py-10">
                <div className="container">
                    <div className="content-main flex gap-y-8 max-md:flex-col">
                        <div className="left md:w-1/2 w-full lg:pr-[60px] md:pr-[40px] md:border-r border-line">
                            <div className="heading4">Reset your password</div>
                            <div className="body1 mt-2">We will send you an email to reset your password</div>
                            {submitted ? (
                                <div style={{ marginTop: '28px', padding: '16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', color: '#166534', fontSize: '15px' }}>
                                    Check your inbox — we sent a password reset link to <strong>{email}</strong>.
                                </div>
                            ) : (
                                <form className="md:mt-7 mt-4" onSubmit={handleSubmit}>
                                    <div className="email">
                                        <input
                                            className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                                            type="email"
                                            placeholder="Email address *"
                                            required
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                        />
                                    </div>
                                    {error && (
                                        <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{error}</div>
                                    )}
                                    <div className="block-button md:mt-7 mt-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            onMouseEnter={() => setBtnHover(true)}
                                            onMouseLeave={() => setBtnHover(false)}
                                            style={{ width: '100%', padding: '14px', background: btnHover ? '#D2EF9A' : '#1F1F1F', color: btnHover ? '#1F1F1F' : '#fff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'all ease 0.4s' }}
                                        >
                                            {loading ? 'Sending...' : 'Submit'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                        <div className="right md:w-1/2 w-full lg:pl-[60px] md:pl-[40px] flex items-center">
                            <div className="text-content">
                                <div className="heading4">New Customer</div>
                                <div className="mt-2 text-secondary">Be part of our growing family of new customers! Join us today and unlock a world of exclusive benefits, offers, and personalized experiences.</div>
                                <div className="block-button md:mt-7 mt-4">
                                    <Link href={'/register'} className="button-main">Register</Link>
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

export default ForgotPassword