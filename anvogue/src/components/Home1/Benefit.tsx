import React from 'react'

interface BenefitItem {
    id: number
    icon: string
    title: string
    description: string
}

const FALLBACK_BENEFITS: BenefitItem[] = [
    {
        id: 1,
        icon: 'icon-phone-call',
        title: '24/7 Customer Service',
        description: "We're here to help you with any questions or concerns you have, 24/7.",
    },
    {
        id: 2,
        icon: 'icon-return',
        title: '14-Day Money Back',
        description: "If you're not satisfied with your purchase, simply return it within 14 days for a refund.",
    },
    {
        id: 3,
        icon: 'icon-guarantee',
        title: 'Our Guarantee',
        description: 'We stand behind our products and services and guarantee your satisfaction.',
    },
    {
        id: 4,
        icon: 'icon-delivery-truck',
        title: 'Shipping Worldwide',
        description: 'We ship our products worldwide, making them accessible to customers everywhere.',
    },
]

interface Props {
    props: string
    benefits?: BenefitItem[]
}

// Pure Server Component — no 'use client', no useState, no JS sent to the browser
const Benefit: React.FC<Props> = ({ props, benefits }) => {
    const displayBenefits = benefits && benefits.length > 0 ? benefits : FALLBACK_BENEFITS

    return (
        <div className="container">
            <div className={`benefit-block ${props}`}>
                <div className="list-benefit grid items-start lg:grid-cols-4 grid-cols-2 gap-[30px]">
                    {displayBenefits.map((item) => (
                        <div key={item.id} className="benefit-item flex flex-col items-center justify-center">
                            <i className={`${item.icon} lg:text-7xl text-5xl`}></i>
                            <div className="heading6 text-center mt-5">{item.title}</div>
                            <div className="caption1 text-secondary text-center mt-3">{item.description}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Benefit