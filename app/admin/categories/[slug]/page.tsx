import CategoryForm from "@/app/components/admin/CategoryForm";
import fetchDataFromAPI from "@/lib/api";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

interface CategoryPageProps {
    params: Promise<{ slug: string }>;
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
    const { slug } = await params;
    const url = `/api/admin/categories/${slug}`;
    const requestHeaders = await headers();
    let cookie = requestHeaders.get('cookie') || undefined;
    console.log('cookie', cookie)
    
    try {
        const response = await fetchDataFromAPI(url, 'GET', undefined, false, cookie);
        const category = await response.json();

        return (
            <CategoryForm category={category} isEditMode={true}/>
        );
    } catch (error) {
        const status = (error as any).status || 
                       ((error as Error).message.includes('404') ? 404 : 0);
        
        if (status === 404) {
            notFound(); 
        }
        throw error;
    }
}
