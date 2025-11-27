import { FilterParams } from "@/src/types";
import fetchDataFromAPI from "../api";

export async function getFilteredProducts(params: FilterParams) {
    const query: string = new URLSearchParams(params as any).toString();
    const URL = `/api/products?${query}`;

    const response = await fetchDataFromAPI(URL);
    if(!response.ok) {
        const errorData = await response.json();
        return {
            products: [],
            totalCount: 0,
            error: errorData.message,
        }
    }
    const products = await response.json();
    return {
        products: products.data, 
        totalCount: products.totalCount,
        error: null,
    }
}