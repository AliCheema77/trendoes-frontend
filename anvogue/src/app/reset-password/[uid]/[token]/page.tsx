'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
import { confirmPasswordReset } from '@/lib/api'

interface Props {
    params: { uid: string; token: string }
}

const ResetPassword = ({ params }: Props) => {
    const router = useRouter()
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [btnHover, setBtnHover] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== password2) {
            setError("Passwords don't match.")
            return
        }
        setLoading(true)
        setError('')
        try {
            await confirmPasswordReset(params.uid, params.token, password, password2)
            router.push('/login?reset=1')
        } catch (err: any) {
            setError(
                err?.token?.[0] ||
                err?.uidb64?.[0] ||
                err?.password?.[0] ||
                err?.non_field_errors?.[0] ||
                'Something went wrong. The link may have expired.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
                <Breadcrumb heading='Reset Password' subHeading='Reset Password' />
            </div>
            <div className="forgot-pass md:py-20 py-10">
                <div className="container">
                    <div className="content-main flex gap-y-8 max-md:flex-col">
                        <div className="left md:w-1/2 w-full lg:pr-[60px] md:pr-[40px] md:border-r border-line">
                            <div className="heading4">Set a new password</div>
                            <div className="body1 mt-2">Enter your new password below</div>
                            <form className="md:mt-7 mt-4" onSubmit={handleSubmit}>
                                <div className="password">
                                    <input
                                        className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                                        type="password"
                                        placeholder="New password *"
                                        required
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="password mt-4">
                                    <input
                                        className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                                        type="password"
                                        placeholder="Confirm new password *"
                                        required
                                        value={password2}
                                        onChange={e => setPassword2(e.target.value)}
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
                                        {loading ? 'Resetting...' : 'Reset Password'}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="right md:w-1/2 w-full lg:pl-[60px] md:pl-[40px] flex items-center">
                            <div className="text-content">
                                <div className="heading4">Remember your password?</div>
                                <div className="mt-2 text-secondary">If you remembered your password, head back to login and sign in to your account.</div>
                                <div className="block-button md:mt-7 mt-4">
                                    <Link href="/login" className="button-main">Back to Login</Link>
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

export default ResetPassword