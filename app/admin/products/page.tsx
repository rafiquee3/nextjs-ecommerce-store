import { Metadata } from "next";
import { createProductSearchSchema, FilterParams, ProductsPageProps } from "@/src/types";
import ProductsPaginator from "@/app/components/ProductsPaginator";
import { getFilteredProducts } from "@/lib/server/getFilteredProducts";
import z from "zod";
import { ZodError } from "zod";
import { getValidCategoryNames } from "@/lib/server/category-utils";

export const metadata: Metadata = {
  title: 'Admin: Add new Product',
};

export default async function ProductsPage({searchParams}: ProductsPageProps)  {

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
console.log('render products Page')
const {products, totalCount, error} = await getFilteredProducts(filterParams);


  return (
        <div className="flex flex-col md:pt-8 bg-[#E2F7FF]" style={{minHeight: 'calc(100vh - 64px - 48px)'}}>
          <ProductsPaginator initialProducts={products} totalCount={totalCount} initialFilterParams={filterParams} isAdmin={true}/>
        </div>
    );
}