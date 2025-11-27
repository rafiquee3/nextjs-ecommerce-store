import Link from "next/link";
import ActiveLink from "../ActiveLinkComponent";
import CartIconClient from "../CartIconClient/CartIconClient";
import UserNav from "../user/UserNav";
import { checkAdminPermissions } from "@/lib/server/checkPermissions";

export default async function Header() {
    const isAdmin = !await checkAdminPermissions(); 
    const isActiveClass = "text-green-400";

    return (
        <header className="bg-sky-600 h-15 w-screen md:fixed z-2">
            <div className="flex h-full w-full min-w-[375px] items-center justify-between">
                <div className="flex-grow max-w-[250px]">
                    <Link href="/" className="font-bold ml-8 md:ml-22 truncate">
                        SHOP NAME    
                    </Link>
                </div>
                <nav className="flex flex-grow items-center gap-5 md:gap-10 justify-end mdl:justify-between font-bold text-gray-300 md:pl-10">
                    <div className="hidden mdl:flex md:gap-7">
                        <ActiveLink
                            href="/products" 
                            className="ml-2 hover:text-white" 
                            activeClassName={isActiveClass}
                            matchMode="startsWith"
                        >
                            Shop
                        </ActiveLink>
                        <Link href='/' className="hover:text-white">Link 1</Link>
                        <Link href='/' className="hover:text-white">Link 2</Link>
                        <Link href='/' className="hover:text-white">Link 3</Link>
                    </div>
                    <div className="flex gap-4 items-center text-sm">
                    {
                        isAdmin ? (         
                        <ActiveLink
                            href="/admin" 
                            className="" 
                            activeClassName={`${isActiveClass} truncate`}
                            matchMode="startsWith"
                        >
                            Admin Panel
                        </ActiveLink>)
                        :
                        null
                    }
                        <UserNav/>
                        <CartIconClient/>
                    </div>
                </nav>
            </div>
        </header>
    )
}