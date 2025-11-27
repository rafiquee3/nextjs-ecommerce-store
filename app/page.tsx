import fetchDataFromAPI from "@/lib/api";
import ProductSlider from "./components/ProductSlider";
import { Category, Product } from "@/src/types";

interface SliderData {
  categoryName: string;
  products: Product[];
}

export default async function Home() {
  const URL = '/api/categories';
  const response = await fetchDataFromAPI(URL);
  const categories: Category[] = await response.json();
  const allPromises: Promise<SliderData>[] = [];

  if (categories.length) {
    categories.forEach(category => {
        const currentParams = new URLSearchParams();
        currentParams.set('category', category.name.toLowerCase());
        currentParams.set('limit', '10');

        const URL = `/api/products/random?${currentParams.toString()}`;
        const promise = fetchDataFromAPI(URL)
                        .then(res => res.json())
                        .then(products => ({
                          products, 
                          categoryName: category.name
                        }))
                        .catch(error => {
                          console.error(`Error loading products for ${category.name}:`, error);
                          return { categoryName: category.name, products: [] };
                        }); 
        allPromises.push(promise);
    });
  }

  const slidersData: SliderData[] = await Promise.all(allPromises);

  return (
    <div className="flex flex-col last:mb-8 gap-6 mt-8">
      {
        slidersData.map((data, index) => {
          if (data.products && data.products.length > 0) {
            return (
              <div key={index} className="">
                <ProductSlider 
                  products={data.products} 
                  categoryName={data.categoryName} 
                  step={1} 
                  displayCount={5} 
                />
              </div>
            );
          }
        })
      }
    </div>
  );
}
