"use client"; 
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Category, InitialProductFormData, ProductSchema, InitialProductSchema } from '@/src/types';
import { useEffect, useState } from 'react';
import { useCategoryStore } from '@/src/store/categoryStore';
import { uploadFile } from '@/lib/uploadFile';
import { Product } from '@/src/types';
import fetchDataFromAPI from '@/lib/api';
import areObjectsSame from '@/lib/areObjectsSame';
import { useRouter } from 'next/navigation';
import { slugify } from '@/lib/slugify';
import { styleButtonPrimary, styleForm } from '@/src/styles/utilityClasses';

interface ProductFormProps {
  product?: Product;
  isEditMode?: boolean;
}

export default function ProductForm({product, isEditMode = false}: ProductFormProps) {
  const categories: Category[] = useCategoryStore(state => state.categories);
    const getDefaultValues = (categories: Category[], product?: InitialProductFormData): InitialProductFormData => {
      const defaultCategorySlug = categories.length > 0 ? categories[0].slug : '';

      if (product) {
        const slug = slugify(product.category);
        return {
            name: product.name,
            price: product.price,
            description: product.description,
            imageUrl: product.imageUrl,
            category: slug, 
            stock: product.stock,
            isFeatured: product.isFeatured,
            isActive: product.isActive,
        };
      }
      return {
        name: '',
        price: 0,
        description: '',
        imageUrl: '',
        category: defaultCategorySlug,
        stock: 0,
        isFeatured: false,
        isActive: true,
      };
    }
    
    const [statusMessage, setStatusMessage] = useState<String>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [savedProduct, setSavedProduct] = useState<InitialProductFormData>(getDefaultValues(categories, product));

    const METHOD = isEditMode ? "PATCH" : "POST";
    const URL = isEditMode ? `/api/admin/products/${product!.id}` : "/api/admin/products";
    const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    const router = useRouter();

    const { 
      register, 
      handleSubmit, 
      formState: { errors },
      reset, 
      setValue,
      getValues,
      setError,
      clearErrors, 
      watch
      } = useForm<InitialProductFormData>({
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        resolver: zodResolver(InitialProductSchema), 
        defaultValues: getDefaultValues(categories, product)
      });
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        } else {
        setImageFile(null);
        }
    };

    const watchedFields = watch(['name', 'price', 'description', 'stock', 'imageUrl']);
    const watchedFieldsString = JSON.stringify(watchedFields);

    useEffect(() => {
      if (statusMessage) {
        const isFormDefaultValues = JSON.stringify(getDefaultValues(categories, product)) === JSON.stringify(getDefaultValues(categories, getValues()));
        if (!isFormDefaultValues) setStatusMessage('');
      }
    }, [watchedFieldsString]);

    const onSubmit = async (data: InitialProductFormData) => {
      setIsSubmitting(true);
      setStatusMessage('');
      clearErrors('imageUrl');

      if (isEditMode) {
          const formData = data;
          const nothingChange = areObjectsSame(savedProduct, formData);

          if (nothingChange) {
              setStatusMessage(`❌ Form data has not been changed.`);
              setIsSubmitting(false);
              return;
          }
      }

      try {
        let finalData = {
          ...data
        };

        if (!isEditMode && !imageFile) {
            setError("imageUrl", { 
                type: "manual", 
                message: "Please select an image file." 
            });
            return; 
        }

        if (imageFile) {         
            const isValidType = ACCEPTED_IMAGE_TYPES.includes(imageFile.type);
            if (!isValidType) {
               setError("imageUrl", { 
                type: "manual", 
                message: "Please select an valid image file." 
              });
              return;
            } 

            const result = await uploadFile(imageFile, "/api/admin/products/upload-img");
            if (!result) throw new Error("Failed to upload file");
            
            finalData.imageUrl = result.secure_url;       
        } 

        ProductSchema.parse(finalData);
        const response = await fetchDataFromAPI(URL, METHOD, finalData);

        if (response.ok) {
          setStatusMessage('✅ Product was successfully added to the "database"!');
          setImageFile(null);
          setSavedProduct(data);
          if (!isEditMode) reset();
            router.refresh();
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
    };

  return (
    <form onSubmit={handleSubmit(onSubmit)} 
          className={`${styleForm.form} flex-grow rounded-none md:pl-[20%] md:pr-[20%] h-max text-sm md:py-10`} 
          style={{minHeight: 'calc(100vh - 64px - 48px)'}
    }>
        {statusMessage && (
        <p className={`p-3 rounded-xl font-medium ${statusMessage.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {statusMessage}
        </p>
        )}
      <div className={`${styleForm.select} rounded-none md:rounded-xl flex flex-col gap-6`}>
        <h3 className = "text-xl font-semibold text-gray-800 -mb-2">{isEditMode ? 'Edit product' : 'Add product'}</h3>
        <div>
          <label htmlFor="name" className={styleForm.label}>Product Name</label>
          <input 
            id="name"
            {...register("name")}
            className={styleForm.input}
          />
          {errors.name && <p className={styleForm.errors}>{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="price" className={styleForm.label}>Price</label>
          <input 
            id="price"
            type="number"
            step="0.01"
            {...register("price", { valueAsNumber: true })}
            className={styleForm.input}
          />
          {errors.price && <p className={styleForm.errors}>{errors.price.message}</p>}
        </div>
        <div>
          <label htmlFor="category" className={styleForm.label}>Category</label>
          <div className='relative'>
              <select 
                id="category"
                {...register("category")}
                className={styleForm.input}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
              <div className="absolute top-1/2 right-2 -translate-y-1/2 pointer-events-none">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
              </div>
              {errors.category && <p className={styleForm.errors}>{errors.category.message}</p>}
          </div>
        </div>
        <div>
          <label htmlFor="description" className={styleForm.label}>Description</label>
          <textarea 
            id="description"
            {...register("description")}
            rows={4}
            className={`${styleForm.input} resize-none`}
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
        </div>
        <div>
          <label htmlFor="imageUrl" className={styleForm.label}>Image</label>
          <div className='relative'>
            <input 
              id="imageUrl"
              type="file"
              onChange={handleFileChange}
              className={styleForm.input}
            />     
            <div className="absolute top-1/2 right-2 -translate-y-1/2 pointer-events-none">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
            </div>
            {errors.imageUrl && <p className={styleForm.errors}>{errors.imageUrl.message}</p>}
          </div>
        </div>
        <div>
          <label htmlFor="stock" className={styleForm.label}>Stock Level</label>
          <input 
            id="stock"
            type="number"
            {...register("stock", { valueAsNumber: true })} 
            className={styleForm.input}
          />
          {errors.stock && <p className={styleForm.errors}>{errors.stock.message}</p>}
        </div>
        <div className="flex items-center space-x-4 py-2">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              {...register("isFeatured")}
              className={styleForm.checkbox}
            />
            <span className="ml-2 text-sm text-gray-700">Featured on the homepage</span>
          </label>
          <label className="flex items-center">
            <input 
              type="checkbox" 
              {...register("isActive")}
              className={styleForm.checkbox}
            />
            <span className="ml-2 text-sm text-gray-700">Active (visible in store)</span>
          </label>
        </div>
        <div className='w-full flex'> 
          <button
            type="submit"
            disabled={isSubmitting}
            className={`${styleButtonPrimary} rounded-l mr-[1px] w-1/2 bg-green-200 hover:bg-green-300`}
          >
            {isSubmitting ? 
                'Sending...' 
                : isEditMode 
                  ? 'Edit' 
                  : 'Add'
            }
          </button>
          <button
            type="button"
            onClick={() => {router.back()}}
            className={`${styleButtonPrimary} bg-red-100 rounded-r w-1/2 hover:bg-red-300`}
          >
            Back
          </button>

        </div>
      </div>
    </form>
  )
}