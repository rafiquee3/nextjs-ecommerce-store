"use client";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";

interface ActiveLinkProps extends LinkProps {
    children: React.ReactNode;
    activeClassName: string;
    className?: string;
    matchMode?: "startsWith" | "exact";
}

export default function ActiveLink({children, activeClassName, className="", matchMode="exact", ...props}: ActiveLinkProps) {
    const pathName = usePathname();
    const href = String(props.href);
    let isActive = false;

    if (matchMode === "startsWith") {
        isActive = pathName.startsWith(href);
    } else {
        isActive = pathName === href;
    }

    return (
        <Link
            {...props}
            className={`${className} ${isActive ? activeClassName : ''}`}
        >
            {children}
        </Link>
    )
}