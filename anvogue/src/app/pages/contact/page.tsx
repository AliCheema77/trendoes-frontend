'use client'
import React, { useState } from 'react'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { submitContactForm } from '@/lib/api'

const ContactUs = () => {
    const [form, setForm] = useState({ name: '', email: '', message: '' })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [btnHover, setBtnHover] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.id]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSuccess(null)
        setError(null)
        setLoading(true)
        try {
            const res = await submitContactForm(form.name, form.email, form.message)
            setSuccess(res.msg)
            setForm({ name: '', email: '', message: '' })
        } catch (err: any) {
            setError(err?.error || 'Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
                <Breadcrumb heading='Contact us' subHeading='Contact us' />
            </div>
            <div className='contact-us md:py-20 py-10'>
                <div className="container">
                    <div className="flex justify-between max-lg:flex-col gap-y-10">
                        <div className="left lg:w-2/3 lg:pr-4">
                            <div className="heading3">Drop Us A Line</div>
                            <div className="body1 text-secondary2 mt-3">Use the form below to get in touch with us — we'll reply to your email directly.</div>
                            <form className="md:mt-6 mt-4" onSubmit={handleSubmit}>
                                {success && (
                                    <div className="mb-5 p-4 rounded-lg bg-surface border border-line text-sm font-medium flex items-center gap-2">
                                        <Icon.CheckCircle size={18} color="#3DAB25" />
                                        <span>{success}</span>
                                    </div>
                                )}
                                {error && (
                                    <div className="mb-5 p-4 rounded-lg bg-surface border border-red text-sm text-red font-medium">
                                        {error}
                                    </div>
                                )}
                                <div className='grid sm:grid-cols-2 grid-cols-1 gap-4 gap-y-5'>
                                    <div>
                                        <input
                                            className="border-line px-4 py-3 w-full rounded-lg"
                                            id="name"
                                            type="text"
                                            placeholder="Your Name *"
                                            required
                                            value={form.name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <input
                                            className="border-line px-4 py-3 w-full rounded-lg"
                                            id="email"
                                            type="email"
                                            placeholder="Your Email *"
                                            required
                                            value={form.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <textarea
                                            className="border border-line px-4 pt-3 pb-3 w-full rounded-lg"
                                            id="message"
                                            rows={5}
                                            placeholder="Your Message *"
                                            required
                                            value={form.message}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="block-button md:mt-6 mt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        onMouseEnter={() => setBtnHover(true)}
                                        onMouseLeave={() => setBtnHover(false)}
                                        style={{ width: '100%', padding: '14px', background: btnHover ? '#D2EF9A' : '#1F1F1F', color: btnHover ? '#1F1F1F' : '#fff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'all ease 0.4s' }}
                                    >
                                        {loading ? 'Sending...' : 'Send Message'}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="right lg:w-1/4 lg:pl-4">
                            <div className="item">
                                <div className="heading4">Our Store</div>
                                <p className="mt-3">Chishtian, Punjab, Pakistan</p>
                                <p className="mt-3">Phone: <span className='whitespace-nowrap'>+92-303-7555545</span></p>
                                <p className="mt-1">Email: <span className='whitespace-nowrap'>info@trendoes.com</span></p>
                            </div>
                            <div className="item mt-10">
                                <div className="heading4">Open Hours</div>
                                <p className="mt-3">Mon - Sat: <span className='whitespace-nowrap'>10:00am - 8:00pm PKT</span></p>
                                <p className="mt-3">Sunday: <span className='whitespace-nowrap'>12:00pm - 6:00pm PKT</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default ContactUs