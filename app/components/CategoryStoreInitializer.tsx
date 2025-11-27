"use client";
import { Category } from "@/src/types";
import { useEffect, useRef } from "react";
import { useCategoryStore } from "@/src/store/categoryStore";
interface initializerProps {
    categoriesApiData: Category[];
}
export default function CategoryStoreInitializer({categoriesApiData}: initializerProps) {
    const setCategories = useCategoryStore(state => state.setCategories);
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            setCategories(categoriesApiData);
            initialized.current = true;
        }
    }, [categoriesApiData, setCategories]);

    return null;
}