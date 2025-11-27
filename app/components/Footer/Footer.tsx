export default function Footer() {
    return (
        <footer className="text-center text-xs py-5 bg-blue-900">
            <div className="">
                &copy; {new Date().getFullYear()} NextShop Portfolio. Built with Next.js and Tailwind CSS.
            </div>
        </footer>
    )
}