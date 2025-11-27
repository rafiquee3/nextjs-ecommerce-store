import { Product } from "@/src/types";
import ProductForm from "@/app/components/admin/ProductForm";
import fetchDataFromAPI from "@/lib/api";
import { notFound } from "next/navigation";

interface ProductPageProps {
    params: Promise<{slug: string}>;
}

export default async function ProductPage({params}: ProductPageProps) {
    const {slug} = await params;
    const url = `/api/products/${slug}`;

    try {
        const response = await fetchDataFromAPI(url);
        const product: Product = await response.json();

        return (
            <div className="">
                <ProductForm product={product} isEditMode={true}/>
            </div>
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