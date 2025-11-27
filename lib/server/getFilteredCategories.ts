import { FilterParams } from "@/src/types";
import fetchDataFromAPI from "../api";

export async function getFilteredCategories(params: FilterParams) {
    const query: string = new URLSearchParams(params as any).toString();
    const URL = `/api/admin/categories?${query}`;

    const response = await fetchDataFromAPI(URL);
    if(!response.ok) {
        const errorData = await response.json();
        return {
            categories: [],
            totalCount: 0,
            error: errorData.message,
        }
    }
    const categories = await response.json();
    return {
        categories: categories.data, 
        totalCount: categories.totalCount,
        error: null,
    }
}