"use client"; 
import { CartItem, CheckoutFormData, CheckoutFormSchema } from '@/src/types';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import fetchDataFromAPI from '@/lib/api';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { styleButtonPrimary, styleForm } from '@/src/styles/utilityClasses';
import { useCartStore } from '@/src/store/cartStore';

export default function CheckoutForm() {
    const [statusMessage, setStatusMessage] = useState<String>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const totalItems = useCartStore(store => store.totalItems);
    const items: CartItem[] = useCartStore(store => store.items);
    const clearCart = useCartStore(store => store.clearCart);
    const METHOD = "POST";
    const URL = '/api/checkout'
    const router = useRouter();
    
    const defaultValues: CheckoutFormData = {
        email: '',
        phone: '',
        first_name: '',
        last_name: '',
        address: '',
        city: '',
        zip: '',
        paymentMethod: 'card',
        items: items
    }

    const { 
      register, 
      handleSubmit, 
      formState: { errors },
      getValues,
      reset, 
      clearErrors, 
      watch
      } = useForm<CheckoutFormData>({
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        resolver: zodResolver(CheckoutFormSchema), 
        defaultValues
      });

    const watchedFields = watch(['email', 'phone', 'first_name', 'last_name', 'address', 'city', 'zip', 'paymentMethod']);
    const watchedFieldsString = JSON.stringify(watchedFields);

    useEffect(() => {
        const isFormDefaultValues = JSON.stringify(defaultValues) === JSON.stringify(getValues());
        if (!isFormDefaultValues) setStatusMessage('');
    }, [watchedFieldsString]);

    useEffect(() => {
        if (totalItems === 0) {
            router.push('/');
        }
    }, [totalItems, router])

    const onSubmit = async (data: CheckoutFormData) => {
      setIsSubmitting(true);
      setStatusMessage('');
      clearErrors();

      try {
        CheckoutFormSchema.parse(data);
        const response = await fetchDataFromAPI(URL, METHOD, data);

        if (response.ok) {
          reset();
            router.push('/checkout/success?orderComplet=true');
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

    if (totalItems === 0) {
        return <p className='text-center p-10 bg-red-200 rounded-lg my-8'>You are being redirected to the store because your cart contains no products.</p>
    }
  return (       
        <form className = {`${styleForm.form} w-screen md:px-[20%] md:py-10`} onSubmit={handleSubmit(onSubmit)} noValidate={true}>
            {statusMessage && (
            <p className={`p-3 rounded-xl font-medium ${statusMessage.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {statusMessage}
            </p>
            )}
            <section className = {`${styleForm.select}`}>
                <h3 className = "text-xl font-semibold text-gray-800 mb-4">1. Contact Information</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="email" className={styleForm.label}>Email Address</label>
                        <input type="email" id="email" required
                             {...register("email")}
                            className={styleForm.input}
                        />
                        {errors.email && <p className={styleForm.errors}>{errors.email.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="phone" className={styleForm.label}>Phone Number (Optional)</label>
                        <input type="tel" id="phone"
                             {...register("phone")}
                            className={styleForm.input}
                        />
                         {errors.phone && <p className={styleForm.errors}>{errors.phone.message}</p>}
                    </div>
                </div>
            </section>

            <section className = {`${styleForm.select}`}>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">2. Shipping Address</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    
                    <div>
                        <label htmlFor="first_name" className={styleForm.label}>First Name</label>
                        <input type="text" id="first_name" required
                         {...register("first_name")}
                            className={styleForm.input}
                        />
                        {errors.first_name && <p className={styleForm.errors}>{errors.first_name.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="last_name" className={styleForm.label}>Last Name</label>
                        <input type="text" id="last_name" required
                            {...register("last_name")}
                            className={styleForm.input}
                        />
                        {errors.last_name && <p className={styleForm.errors}>{errors.last_name.message}</p>}
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="address" className={styleForm.label}>Street Address</label>
                        <input type="text" id="address" required
                            {...register("address")}
                            className={styleForm.input}
                        />
                        {errors.address && <p className={styleForm.errors}>{errors.address.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="city" className={styleForm.label}>City</label>
                        <input type="text" id="city" required
                            {...register("city")}
                            className={styleForm.input}
                        />
                         {errors.city && <p className={styleForm.errors}>{errors.city.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="zip" className={styleForm.label}>ZIP / Postal Code</label>
                        <input type="text" id="zip" required
                            {...register("zip")}
                            className={styleForm.input}
                        />
                        {errors.zip && <p className={styleForm.errors}>{errors.zip.message}</p>}
                    </div>
                </div>
            </section>

            <section className = {`${styleForm.select}`}>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">3. Payment Method</h3>
                <div className="space-y-4">
                    <div className="flex items-center">
                        <input type="radio" 
                            value='card'
                            {...register("paymentMethod")}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"/>
                        <label htmlFor="payment_card" className="ml-3 block text-base font-medium text-gray-700">Credit or Debit Card</label>
                    </div>
                    <div className="flex items-center">
                        <input type="radio"
                            value='paypal'
                            {...register("paymentMethod")}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"/>
                        <label htmlFor="payment_paypal" className="ml-3 block text-base font-medium text-gray-700">PayPal</label>
                    </div>
                </div>
            </section>

            <div className="pt-6 border-t border-gray-300 flex justify-end">
                <button type="submit"
                      className={`${styleButtonPrimary} rounded`}
                        disabled={isSubmitting}
                        >
                    Place Order
                </button>
            </div>

        </form>
    )
}