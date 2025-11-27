import { Metadata } from "next";
import ProductForm from "@/app/components/admin/ProductForm";
export const metadata: Metadata = {
  title: 'Admin: Add new Product',
};

export default function AddNewProductPage() {
    return (
        <div className=''>
          <ProductForm />
        </div>
    );
}