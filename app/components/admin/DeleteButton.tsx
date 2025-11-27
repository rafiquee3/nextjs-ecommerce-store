'use client';
import { useTransition } from "react";
import fetchDataFromAPI from "@/lib/api";
import { useRouter } from "next/navigation";
import { useCategoryStore } from "@/src/store/categoryStore";

interface DeleteButtonProps {
    id: number;
    target: 'products' | 'categories';
}

export default function DeleteButton({id, target}: DeleteButtonProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const setCategories = useCategoryStore(state => state.setCategories);
    const METHOD = 'DELETE';
    let URL = `/api/admin/${target}/${id}`;

    const handleClick: () => Promise<void> = async () => {
        if (!confirm(`Are you sure you want to delete ?`)) {
            return;
        }

        startTransition(async () => {
            const response = await fetchDataFromAPI(URL, METHOD);

            if (response.ok) {
                const response = await fetchDataFromAPI(`/api/categories`, 'GET');
                const categories = await response.json();

                setCategories(categories);
                router.refresh();
                console.log(`Deleted successfully.`);
            } else {
                console.error('Failed to delete.');
            }
        })
    }
    
    return (
        <button onClick={handleClick} disabled={isPending} className='bg-red-100 hover:bg-red-300 text-gray-800 px-2 cursor-pointer rounded '>{isPending ? '...' : '✕'}</button>
    )
}