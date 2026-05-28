import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import Footer from '@/components/Footer/Footer'
import { fetchBlogPost, fetchBlogPosts } from '@/lib/api'

// Next.js passes the URL segment as params.id
// URL /blog/42  →  params = { id: "42" }
interface PageProps {
    params: { id: string }
}

export default async function BlogDetail({ params }: PageProps) {
    let post: any = null
    let relatedPosts: any[] = []

    try {
        // Both fetches run in parallel — post detail + related posts from same category
        const postData = await fetchBlogPost(params.id)
        post = postData

        const related = await fetchBlogPosts({ category: post.category, page_size: '3' })
        relatedPosts = (related.results ?? related ?? []).filter((p: any) => p.id !== post.id).slice(0, 2)
    } catch {
        // 404 from the API — show Next.js not-found page
        notFound()
    }

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan='Welcome to Trendoes' />
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-white" />
            </div>
            <div className='blog-detail md:mt-[74px] mt-[56px] border-t border-line'>
                <div className="container lg:pt-20 md:pt-14 pt-10">
                    <div className="blog-content flex justify-between max-lg:flex-col gap-y-10">
                        <div className="main xl:w-3/4 lg:w-2/3 lg:pr-[15px]">
                            {/* Tag + Title */}
                            <div className="blog-tag bg-green py-1 px-2.5 rounded-full text-button-uppercase inline-block">
                                {post.tag || post.category}
                            </div>
                            <div className="heading3 mt-3">{post.title}</div>

                            {/* Author + Date */}
                            <div className="author flex items-center gap-4 mt-4">
                                {post.avatar && (
                                    <div className="avatar w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                        <Image src={post.avatar} width={80} height={80} alt={post.author} className='w-full h-full object-cover' />
                                    </div>
                                )}
                                <div className='flex items-center gap-2'>
                                    <span className="caption1 text-secondary">by {post.author}</span>
                                    <span className="text-secondary">·</span>
                                    <span className="caption1 text-secondary">
                                        {new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>

                            {/* Cover image */}
                            {(post.cover_image || post.thumb_image) && (
                                <div className="cover-img mt-8 rounded-2xl overflow-hidden">
                                    <Image
                                        src={post.cover_image || post.thumb_image}
                                        width={1200}
                                        height={700}
                                        alt={post.title}
                                        className='w-full object-cover'
                                        priority
                                    />
                                </div>
                            )}

                            {/* Post body — whitespace-pre-wrap preserves paragraph breaks */}
                            <div className="body1 mt-8 whitespace-pre-wrap">{post.body}</div>

                            {/* Back link */}
                            <Link href="/blog" className="button-main mt-10 inline-block">
                                ← Back to Blog
                            </Link>
                        </div>

                        {/* Sidebar — related posts */}
                        {relatedPosts.length > 0 && (
                            <div className="sidebar xl:w-1/4 lg:w-1/3 xl:pl-[52px] md:pl-8">
                                <div className="heading6">Related Posts</div>
                                <div className="list-related mt-4 flex flex-col gap-6">
                                    {relatedPosts.map((related: any) => (
                                        <Link href={`/blog/${related.id}`} key={related.id} className="item flex gap-4 group">
                                            <Image
                                                src={related.thumb_image}
                                                width={80}
                                                height={80}
                                                alt={related.title}
                                                className='w-20 h-20 object-cover rounded-lg flex-shrink-0'
                                            />
                                            <div>
                                                <div className="blog-tag whitespace-nowrap bg-green py-0.5 px-2 rounded-full text-button-uppercase text-xs inline-block">
                                                    {related.tag || related.category}
                                                </div>
                                                <div className="text-title mt-1 group-hover:underline">{related.title}</div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                <div className="mt-8">
                                    <Link href="/blog" className="text-button has-line-before">
                                        All Posts
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}