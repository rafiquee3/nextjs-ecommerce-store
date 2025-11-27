"use client";
import { InitialCategoryFormData, InitialCategorySchema, CategorySchema, Category } from "@/src/types";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from "react";
import { slugify } from "@/lib/slugify";
import { useCategoryStore } from "@/src/store/categoryStore";
import fetchDataFromAPI from "@/lib/api";
import areObjectsSame from "@/lib/areObjectsSame";
import { useRouter } from "next/navigation";
import { styleButtonPrimary, styleForm } from "@/src/styles/utilityClasses";

interface CategoryFormProps {
    category?: Category;
    isEditMode?: boolean;
}

export default function CategoryForm({ category, isEditMode = false }: CategoryFormProps) {
    const getDefaultValues = (category?: InitialCategoryFormData): InitialCategoryFormData => {
        if (category) {
            return {
                name: category.name,
                description: category.description,
                productCount: category.productCount,
            };
        }
        return {
            name: "",
            description: "",
            productCount: 0,
        };
    }
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<String>("");
    const [savedCategory, setSavedCategory] = useState<InitialCategoryFormData>(getDefaultValues(category));

    const setCategories = useCategoryStore((state) => state.setCategories);
    const METHOD = isEditMode ? 'PATCH' : 'POST';
    const URL = isEditMode ? `/api/admin/categories/${category!.id}` : "/api/admin/categories";
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        getValues,
        watch
    } = useForm<InitialCategoryFormData>({
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        resolver: zodResolver(InitialCategorySchema),
        defaultValues: getDefaultValues(category),
    });;

    const watchedFields = watch(['name', 'description', 'productCount']);
    const watchedFieldsString = JSON.stringify(watchedFields);

    useEffect(() => {
        if(statusMessage) {
            const isFormDefaultValues = JSON.stringify(getDefaultValues(category)) === JSON.stringify(getDefaultValues(getValues()));
            if (!isFormDefaultValues) setStatusMessage('');
        }
    }, [watchedFieldsString]); 

    const onSubmit = async (data: InitialCategoryFormData) => {
        setIsSubmitting(true);
        setStatusMessage('');

        if (isEditMode) {
            const formData = data;
            const nothingChange = areObjectsSame(savedCategory, formData);

            if (nothingChange) {
                setStatusMessage(`❌ Form data has not been changed.`);
                setIsSubmitting(false);
                return;
            }
        }

        const slug = slugify(data.name);
        const finalData = {
            ...data,
            slug
        }
      
        try {
            CategorySchema.parse(finalData);
            const response = await fetchDataFromAPI(URL, METHOD, finalData)

            if (response.ok) {
                const response = await fetchDataFromAPI('/api/categories');
                const categoriesList = await response.json();

                setCategories(categoriesList);
                setSavedCategory(data);
                setStatusMessage(isEditMode ? '✅ Category successfully edited in the database.' : '✅ Category was successfully added to the "database"!');
                if (!isEditMode) reset();
            } else {
                const errorData = await response.json();
                setStatusMessage(`❌ Server-side error: ${errorData.message || 'Unknown error.'}`);
            }

        } catch (error) {
            setStatusMessage('❌ Network or connection error.');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}
              className={`${styleForm.form} md:pl-[20%] md:pr-[20%] md:py-10 text-sm`} 
              style={{minHeight: 'calc(100vh - 64px - 48px)'}}
        >
                {statusMessage && (
                <p className={`p-3 rounded-xl font-medium ${statusMessage.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {statusMessage}
                </p>
                )}
            <div className={`${styleForm.select} flex flex-col gap-6`}>
                <h3 className = "text-xl font-semibold text-gray-800 -mb-2">{isEditMode ? 'Edit category' : 'Add category'}</h3>
                <div>
                    <label htmlFor="name" className={styleForm.label}>Name</label>
                    <input
                        id="name"
                        {...register("name")}
                    className={styleForm.input}
                    />
                    {errors.name && <p className={styleForm.errors}></p>}
                </div>
                <div>
                    <label htmlFor="description" className={styleForm.label}>Description</label>
                    <input
                        id="description"
                        {...register("description")}
                        className={styleForm.input}
                    />
                    {errors.description && <p className={styleForm.errors}>{errors.description.message}</p>}
                </div>
                <div>
                    <label htmlFor="productCount" className={styleForm.label}>Number of products</label>
                    <input
                        type="number"
                        id="productCount"
                        {...register("productCount", { valueAsNumber: true })}
                        className={styleForm.input}
                    />
                    {errors.productCount && <p className={styleForm.errors}>{errors.productCount.message}</p>}
                </div>
                <div className='flex mt-7'>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`${styleButtonPrimary} rounded-l w-1/2 bg-green-200 hover:bg-green-300`}
                    >
                        {
                            isSubmitting
                                ? 'Sending...'
                                : isEditMode
                                    ? 'Edit'
                                    : 'Add'
                        }
                    </button>
                    <button
                        onClick={() => router.push('/admin/categories')}
                        type="button"
                        className={`${styleButtonPrimary} rounded-r w-1/2 bg-red-100 hover:bg-red-300`}
                    >
                        Back
                    </button>
                </div>
            </div>
        </form>
    )
}
