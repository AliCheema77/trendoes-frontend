import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import Footer from '@/components/Footer/Footer'
import { fetchBlogPosts, fetchBlogCategories } from '@/lib/api'
import * as Icon from "@phosphor-icons/react/dist/ssr";

// In Server Components, search params come in as a plain prop — no useSearchParams() hook needed
interface PageProps {
    searchParams: { category?: string; page?: string }
}

export default async function BlogDefault({ searchParams }: PageProps) {
    const category = searchParams.category ?? ''
    const page = searchParams.page ?? '1'

    let posts: any[] = []
    let totalCount = 0
    let categories: any[] = []
    let recentPosts: any[] = []

    // Fire all requests in parallel — posts, categories, and recent 3 posts at once
    try {
        const params: Record<string, string> = { page, page_size: '6' }
        if (category) params.category = category

        const [postsRes, catsRes, recentRes] = await Promise.all([
            fetchBlogPosts(params),
            fetchBlogCategories(),
            fetchBlogPosts({ page_size: '3' }),
        ])

        posts = postsRes.results ?? postsRes ?? []
        totalCount = postsRes.count ?? posts.length
        categories = Array.isArray(catsRes) ? catsRes : []
        recentPosts = recentRes.results ?? recentRes ?? []
    } catch {
        // Blog API unreachable — show empty state
    }

    const postsPerPage = 6
    const pageCount = Math.ceil(totalCount / postsPerPage)
    const currentPage = parseInt(page)

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan='Welcome to Trendoes' />
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
                <Breadcrumb heading='Blog' subHeading='Blog' />
            </div>
            <div className='blog default md:py-20 py-10'>
                <div className="container">
                    <div className="flex justify-between max-md:flex-col gap-y-12">
                        {/* Main post list */}
                        <div className="left xl:w-3/4 md:w-2/3 pr-2">
                            {posts.length === 0 ? (
                                <div className="text-secondary">No posts found.</div>
                            ) : (
                                <div className="list-blog flex flex-col md:gap-10 gap-8">
                                    {posts.map((post: any) => (
                                        <Link key={post.id} href={`/blog/${post.id}`} className="blog-item block group">
                                            <div className="blog-img rounded-2xl overflow-hidden">
                                                <Image
                                                    src={post.thumb_image}
                                                    width={800}
                                                    height={500}
                                                    alt={post.title}
                                                    className='w-full h-64 object-cover group-hover:scale-105 duration-500'
                                                />
                                            </div>
                                            <div className="blog-tag bg-green py-1 px-2.5 rounded-full text-button-uppercase inline-block mt-4">
                                                {post.tag || post.category}
                                            </div>
                                            <div className="heading5 mt-2 group-hover:underline">{post.title}</div>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="caption1 text-secondary">by {post.author}</span>
                                                <span className="text-secondary">·</span>
                                                <span className="caption1 text-secondary">
                                                    {new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <div className="body2 text-secondary mt-2">{post.short_desc}</div>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Pagination — plain links, no JS needed */}
                            {pageCount > 1 && (
                                <div className="flex items-center justify-center gap-2 md:mt-10 mt-6">
                                    {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
                                        <Link
                                            key={p}
                                            href={`/blog/default?${new URLSearchParams({ ...(category ? { category } : {}), page: String(p) })}`}
                                            className={`w-10 h-10 flex items-center justify-center rounded-full border ${currentPage === p ? 'bg-black text-white border-black' : 'border-line hover:bg-black hover:text-white duration-300'}`}
                                        >
                                            {p}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="right xl:w-1/4 md:w-1/3 xl:pl-[52px] md:pl-8">
                            <form className='form-search relative w-full h-12' action="/blog/default" method="get">
                                {category && <input type="hidden" name="category" value={category} />}
                                <input className='py-2 px-4 w-full h-full border border-line rounded-lg' type="text" name="q" placeholder='Search' />
                                <button type="submit">
                                    <Icon.MagnifyingGlass className='heading6 text-secondary hover:text-black duration-300 absolute top-1/2 -translate-y-1/2 right-4 cursor-pointer' />
                                </button>
                            </form>

                            {/* Recent posts */}
                            {recentPosts.length > 0 && (
                                <div className="recent md:mt-10 mt-6 pb-8 border-b border-line">
                                    <div className="heading6">Recent Posts</div>
                                    <div className="list-recent pt-1">
                                        {recentPosts.map((post: any) => (
                                            <Link href={`/blog/${post.id}`} key={post.id} className="item flex gap-4 mt-5 cursor-pointer">
                                                <Image
                                                    src={post.thumb_image}
                                                    width={80}
                                                    height={80}
                                                    alt={post.title}
                                                    className='w-20 h-20 object-cover rounded-lg flex-shrink-0'
                                                />
                                                <div>
                                                    <div className="blog-tag whitespace-nowrap bg-green py-0.5 px-2 rounded-full text-button-uppercase text-xs inline-block">
                                                        {post.tag || post.category}
                                                    </div>
                                                    <div className="text-title mt-1">{post.title}</div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Categories — dynamic from API */}
                            {categories.length > 0 && (
                                <div className="filter-category md:mt-10 mt-6 pb-8 border-b border-line">
                                    <div className="heading6">Categories</div>
                                    <div className="list-cate pt-1">
                                        {categories.map((cat: any) => (
                                            <Link
                                                key={cat.category}
                                                href={`/blog/default?category=${cat.category}`}
                                                className={`cate-item flex items-center justify-between cursor-pointer mt-3 ${category === cat.category ? 'active' : ''}`}
                                            >
                                                <span className='capitalize has-line-before hover:text-black text-secondary'>{cat.category}</span>
                                                <span className="text-secondary2">({cat.count})</span>
                                            </Link>
                                        ))}
                                        {category && (
                                            <Link href="/blog/default" className="mt-3 block text-sm text-secondary hover:text-black underline">
                                                Clear filter
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
