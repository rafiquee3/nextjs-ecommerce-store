import { createProductSearchSchema, FilterParams, ProductsPageProps } from "@/src/types";
import ProductsPaginator from "../components/ProductsPaginator";
import { getValidCategoryNames } from "@/lib/server/category-utils";
import z, { ZodError } from "zod";
import { getFilteredProducts } from "@/lib/server/getFilteredProducts";

export default async function ProductsPage({searchParams}: ProductsPageProps) {
    
    const rawParams = await (searchParams as any);

    const validCategoryNames = await getValidCategoryNames();
    const ProductSearchSchema = createProductSearchSchema(validCategoryNames).strict();

    let validatedParams;
    let validationError: z.ZodError | null = null;
    try {
        validatedParams = ProductSearchSchema.parse(rawParams);
    } catch (error) {
        if (error instanceof ZodError) {
            validationError = error;
            validatedParams = ProductSearchSchema.strict().parse({}); 
        } else {
            throw Error('Parsing data error.');
        }
    }

    if (validationError) {
        return (
            <div className="mx-auto container p-8 text-red-600 bg-red-200 rounded w-fit my-8">
                <h2>❌ Error: The page address you entered appears to be invalid.</h2>
                <p>The URL contains invalid or unknown parameters.</p>
            </div>
        );
    }

    const filterParams: FilterParams = {
        page: validatedParams.page,
        limit: validatedParams.limit,
        category: validatedParams.category,
        sort: validatedParams.sort,
        q: validatedParams.q,
    };

    const {products, totalCount, error} = await getFilteredProducts(filterParams);

    if (error) {
        return (
            <div className="mx-auto container p-8 text-red-600 bg-red-200 rounded w-fit my-8">
                <h2>❌ Error: The page address you entered appears to be invalid.</h2>
                <p>The URL contains invalid or unknown parameters.</p>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col items-center md:mt-8 pb-8">
            <ProductsPaginator initialProducts={products} totalCount={totalCount} initialFilterParams={filterParams} isAdmin={false}/>
            {products.length === 0 && (
                <p className="my-20">No products available.</p>
            )}
        </div>
    );
}