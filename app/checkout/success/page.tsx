import SuccessRedirect from "@/app/components/CheckoutForm/SuccessRedirect";
import { redirect } from "next/navigation";

interface SuccessPageProps {
    searchParams: Promise<{orderComplet: string}>;
}

export default async function SuccessPage({searchParams}: SuccessPageProps) {
    const {orderComplet} = await searchParams; 
    const isSuccess = orderComplet === 'true' ? true : false;

    if (!isSuccess) {
        redirect('/');
    }

    return (
        <div className='flex flex-col items-center'>       
            <div className="flex flex-col items-center mt-8 bg-green-200 text-green-600 p-4 rounded-xl">
                <h2>✅ Success! Your order has been placed.</h2>
                <p>You will be redirected to the shop in a few moments.</p>
            </div>
            <SuccessRedirect/>
        </div>
    )
};