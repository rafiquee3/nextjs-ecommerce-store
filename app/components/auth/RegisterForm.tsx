'use client';
import { useForm } from "react-hook-form";
import { SignUpFormData, SignUpSchema } from "@/src/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import fetchDataFromAPI from "@/lib/api";
import { styleButtonPrimary, styleForm } from "@/src/styles/utilityClasses";

export function RegisterForm() {
    const [isSubmitting , setIsSubmitting] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<String>('');

    const { 
        register, 
        handleSubmit, 
        formState: { errors },
        reset, 
        setValue,
        setError,
        clearErrors, 
        getValues,
        watch
        } = useForm<SignUpFormData>({
            mode: 'onSubmit',
            reValidateMode: 'onSubmit',
            resolver: zodResolver(SignUpSchema),
            defaultValues: {
                login: '',
                email: '',
                password: '',
            },
    });

    const watchedFields = watch(['login', 'email', 'password']);
    const watchedFieldsString = JSON.stringify(watchedFields);

    useEffect(() => {
        if(statusMessage !== '') {
            const isAnyFieldEdited = Object.values(watchedFields).some(value => typeof value === 'string' && value.length > 0);
            if (isAnyFieldEdited) {
                setStatusMessage('');
            }
        }
    }, [watchedFieldsString]);

    const onSubmit = async (data: SignUpFormData) => {
        const URL = '/api/register';
        const METHOD = 'POST';
        setIsSubmitting(true);
        setStatusMessage('');

        try {
           SignUpSchema.parse(data);
           const response = await fetchDataFromAPI(URL, METHOD, data);

           if (response.ok) {
                setIsSubmitting(false);
                setStatusMessage('✅ User was successfully added to the "database"!');
                reset(); 
            } else {
                setIsSubmitting(false);
                const errorData = await response.json();
                if (response.status === 409) {
                    setError(errorData.field, {
                        type: 'server',
                        message: errorData.message, 
                    });
                    setStatusMessage(`❌ Rejestracja nieudana.`);
                } else {
                    setStatusMessage(`❌ Błąd po stronie serwera: ${errorData.message || 'Nieznany błąd.'}`);
                }
            }
        } catch (error) {
            setStatusMessage('❌ Network or connection error.');
            console.error(error);
        }
    };
    
    return (
        <form onSubmit={handleSubmit(onSubmit)} className={`${styleForm.form} w-[305px] rounded`}>
            <div className={`${styleForm.select} flex flex-col gap-6`}>
                {statusMessage && (
                <p className={`p-3 rounded font-medium ${statusMessage.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {statusMessage}
                </p>
                )}
                <div>
                    <label htmlFor="name" className={styleForm.label}>Login</label>
                    <input 
                        id="login"
                        {...register("login")}
                        className={styleForm.input}
                    />
                    {errors.login && <p className={styleForm.errors}>{errors.login.message}</p>}
                </div>
                <div>
                    <label htmlFor="email" className={styleForm.label}>Email</label>
                    <input 
                        id="email"
                        {...register("email")}
                        className={styleForm.input}
                    />
                    {errors.email && <p className={styleForm.errors}>{errors.email.message}</p>}
                </div>
                <div>
                    <label htmlFor="password" className={styleForm.label}>Password</label>
                    <input 
                        id="password"
                        type='password'
                        {...register("password")}
                        className={styleForm.input}
                    />
                    {errors.password && <p className={styleForm.errors}>{errors.password.message}</p>}
                </div>
                <button type='submit' className={`${styleButtonPrimary} rounded bg-green-200 hover:bg-green-300`}>{isSubmitting ? '...Sending' : 'Send'}</button>
            </div>
        </form>
    )
}