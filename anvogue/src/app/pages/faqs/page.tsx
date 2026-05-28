'use client'
import React, { useState, useEffect } from 'react'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
import * as Icon from "@phosphor-icons/react/dist/ssr"
import { fetchFAQs } from '@/lib/api'

interface FAQ {
    id: number
    category: string
    question: string
    answer: string
    order: number
}

const Faqs = () => {
    const [faqs, setFaqs] = useState<FAQ[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<string>('')
    const [activeQuestion, setActiveQuestion] = useState<number | null>(null)

    useEffect(() => {
        fetchFAQs()
            .then(data => {
                const list: FAQ[] = Array.isArray(data) ? data : []
                setFaqs(list)
                if (list.length > 0) setActiveTab(list[0].category)
            })
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [])

    // Build unique ordered category list preserving backend order
    const categories = faqs.reduce<string[]>((acc, faq) => {
        if (!acc.includes(faq.category)) acc.push(faq.category)
        return acc
    }, [])

    const faqsInTab = faqs.filter(f => f.category === activeTab)

    const toggleQuestion = (id: number) => {
        setActiveQuestion(prev => prev === id ? null : id)
    }

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
                <Breadcrumb heading='FAQs' subHeading='FAQs' />
            </div>
            <div className='faqs-block md:py-20 py-10'>
                <div className="container">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : faqs.length === 0 ? (
                        <p className="text-secondary text-center py-20">No FAQs available yet.</p>
                    ) : (
                        <div className="flex justify-between max-md:flex-col gap-y-8">
                            <div className="left w-1/4 max-md:w-full">
                                <div className="menu-tab flex flex-col gap-5">
                                    {categories.map(cat => (
                                        <div
                                            key={cat}
                                            className={`tab-item inline-block w-fit heading6 has-line-before text-secondary2 hover:text-black duration-300 cursor-pointer capitalize ${activeTab === cat ? 'active' : ''}`}
                                            onClick={() => { setActiveTab(cat); setActiveQuestion(null) }}
                                        >
                                            {cat}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="right w-2/3 max-md:w-full">
                                <div className="flex flex-col gap-5">
                                    {faqsInTab.map(faq => (
                                        <div
                                            key={faq.id}
                                            className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === faq.id ? 'open' : ''}`}
                                            onClick={() => toggleQuestion(faq.id)}
                                        >
                                            <div className="heading flex items-center justify-between gap-6">
                                                <div className="heading6">{faq.question}</div>
                                                <Icon.CaretRight
                                                    size={24}
                                                    className={`flex-shrink-0 transition-transform duration-300 ${activeQuestion === faq.id ? 'rotate-90' : ''}`}
                                                />
                                            </div>
                                            <div className="content body1 text-secondary">{faq.answer}</div>
                                        </div>
                                    ))}
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

export default Faqs