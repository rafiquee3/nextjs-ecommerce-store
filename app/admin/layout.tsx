'use client'
import { ReactNode, useEffect, useState } from 'react';
import ActiveLink from '../components/ActiveLinkComponent';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function AdminLayout({children}: {children: ReactNode}) {
    const router = useRouter();
    const {data: session, status}: any = useSession();
    const isActiveClass = 'text-green-500';
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const styleMdNav = `md:block md:bg-white md:text-black`;

    const handleToggle = (close?: boolean) => {
        if (close) {
            setIsCollapsed(false);
        } else {
            setIsCollapsed(!isCollapsed);
        }
    };

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/signin');
            console.warn('Access denied: You need to be logged in.');
            return;
        }

        if (session && session.user?.role !== 'admin') {
            router.push('/'); 
            console.warn('Access denied: You must be an administrator.');
            return;
        }
    }, [session, status, router]);

    if (status === 'loading' || status === 'unauthenticated' || session?.user?.role !== 'admin') {
        if (status === 'loading') {
            return <div className='pt-8'>Checking authorization...</div>;
        }
        
        return <div>Access Denied. Redirecting...</div>;
    } 

    return (
        <div className='md:flex justify-center w-full content-between'>
            <div className='md:w-[250px]'>
                <aside className="flex flex-col items-center w-screen md:w-[230px] md:fixed md:top-30">
                    <div className='relative w-full md:hidden'>
                        <button className="text-sm font-bold bg-[#E1F8FF] p-3 w-full" onClick={() => handleToggle()}>Admin Panel</button>
                        <div className="absolute top-1/2 right-2 -translate-y-1/2 pointer-events-none">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                            </svg>
                        </div>
                    </div>
                
                    <img src="/images/admin.png" className="w-25 pb-5 hidden"/>
                    <nav className={ isCollapsed ? `absolute bg-[#1C398D] md:block mt-[44px] w-full md:w-fit md:w-[250px] px-8 py-7 md:p-0 text-gray-300 z-2 ${styleMdNav}` : `hidden ${styleMdNav}`}>         
                        <ul className="flex flex-col gap-3 p-3">
                            <li>    
                                <ActiveLink 
                                    href="/admin" 
                                    className={`hover:${isActiveClass}`}
                                    activeClassName={isActiveClass}
                                    onClick={() => handleToggle(true)}
                                >
                                    Dashboard
                                </ActiveLink>
                            </li>
                            <li>
                                <ActiveLink 
                                    href="/admin/products/new" 
                                    className={`hover:${isActiveClass}`}
                                    activeClassName={isActiveClass}
                                    onClick={() => handleToggle(true)}
                                >
                                    Add Product
                                </ActiveLink>
                            </li>
                            <li>
                                <ActiveLink 
                                    href="/admin/categories/new" 
                                    className={`hover:${isActiveClass}`}
                                    activeClassName={isActiveClass}
                                    onClick={() => handleToggle(true)}
                                >
                                    Add Categories
                                </ActiveLink>
                            </li>
                            <li>
                                <ActiveLink 
                                    href="/admin/products" 
                                    className={`hover:${isActiveClass}`} 
                                    activeClassName={isActiveClass}
                                    onClick={() => handleToggle(true)}
                                >
                                    Menage Products
                                </ActiveLink>
                            </li>
                            <li>
                                <ActiveLink 
                                    href="/admin/categories" 
                                    className={`hover:${isActiveClass}`} 
                                    activeClassName={isActiveClass}
                                    onClick={() => handleToggle(true)}
                                >
                                    Manage categories
                                </ActiveLink>
                            </li>
                        </ul>
                    </nav>
                </aside>
            </div>
            <div className="flex flex-col md:flex-grow">
                {children}
            </div>
        </div>
    )
}