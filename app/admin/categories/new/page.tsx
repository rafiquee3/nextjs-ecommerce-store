import { Metadata } from "next";
import CategoryForm from "@/app/components/admin/CategoryForm";
export const metadata: Metadata = {
  title: 'Admin: Add new Category',
};

export default function AddNewCategoryPage() {
    return (
        <div>
          <CategoryForm />
        </div>
    );
}