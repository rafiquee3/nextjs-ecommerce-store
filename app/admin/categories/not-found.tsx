import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="text-center p-10">
      <h2 className="text-4xl font-bold text-red-600">404 - Category Not Found</h2>
      <p className="mt-4 text-lg">
        The category you are looking for does not exist or has been removed.
      </p>
      <Link href="/admin/categories" className="mt-6 inline-block text-blue-500 hover:underline">
        Go back to Category Management
      </Link>
    </div>
  );
}