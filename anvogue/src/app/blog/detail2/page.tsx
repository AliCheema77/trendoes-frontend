'use client'
import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function BlogDetail2Redirect() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const id = searchParams.get('id')

    useEffect(() => {
        router.replace(id ? `/blog/${id}` : '/blog/default')
    }, [id, router])

    return null
}
