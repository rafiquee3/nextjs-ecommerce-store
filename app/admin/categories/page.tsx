import { CategoriesPageProps, Category, createCategorySearchSchema, FilterParams } from "@/src/types";
import CategoriesPaginator from "@/app/components/CategoriesPaginator";
import { getValidCategoryNames } from "@/lib/server/category-utils";
import z, { ZodError } from "zod";
import { getFilteredCategories } from "@/lib/server/getFilteredCategories";

export default async function CategoriesPage({searchParams}: CategoriesPageProps)  {

  const rawParams = await (searchParams as any);

  const validCategoryNames = await getValidCategoryNames();
  const CategorySearchSchema = createCategorySearchSchema(validCategoryNames).strict();

  let validatedParams;
  let validationError: z.ZodError | null = null;
  try {
      validatedParams = CategorySearchSchema.parse(rawParams);
  } catch (error) {
      if (error instanceof ZodError) {
          validationError = error;
          validatedParams = CategorySearchSchema.strict().parse({}); 
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

  const {categories, totalCount, error} = await getFilteredCategories(filterParams);

  return (
        <div className="flex flex-col md:pt-8 bg-[#E1F8FF]" style={{ minHeight: 'calc(100vh - 64px - 48px)'}}>
          <CategoriesPaginator initialCategories={categories} totalCount={totalCount} initialFilterParams={filterParams}/>
        </div>
    );
}