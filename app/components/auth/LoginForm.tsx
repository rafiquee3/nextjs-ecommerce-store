'use client';
import { useForm } from "react-hook-form";
import { LoginFormData, LoginFormSchema } from "@/src/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { styleButtonPrimary, styleForm } from "@/src/styles/utilityClasses";

export function LoginForm() {
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
        } = useForm<LoginFormData>({
            mode: 'onSubmit',
            reValidateMode: 'onSubmit',
            resolver: zodResolver(LoginFormSchema),
            defaultValues: {
                login: '',
                password: '',
            },
    });

    const watchedFields = watch(['login', 'password']);
    const watchedFieldsString = JSON.stringify(watchedFields);

    useEffect(() => {
        if(statusMessage !== '') {
            const isAnyFieldEdited = Object.values(watchedFields).some(value => typeof value === 'string' && value.length > 0);
            if (isAnyFieldEdited) {
                setStatusMessage('');
            }
        }
    }, [watchedFieldsString]);

    const onSubmit = async (data: LoginFormData) => {
        setIsSubmitting(true);
        setStatusMessage('');

        try {
           LoginFormSchema.parse(data);
           const result = await signIn('credentials', {
                redirect: false, // Prevents automatic redirect on failure
                login: data.login,     // Pass the credentials (login/username)
                password: data.password, // Pass the credentials (password)
            });

            if (result?.error) {
                setIsSubmitting(false);
                setStatusMessage('❌ The provided username or password is incorrect.');
            } else if (result?.ok) {
                setIsSubmitting(false);
                window.location.href = '/'; // Redirect to the admin dashboard
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
                    <label htmlFor="password" className={styleForm.label}>Password</label>
                    <input 
                        id="password"
                        type='password'
                        {...register("password")}
                        className={styleForm.input}
                    />
                    {errors.password && <p className={styleForm.errors}>{errors.password.message}</p>}
                </div>
                <button type='submit' className={`${styleButtonPrimary} bg-green-200 hover:bg-green-300 rounded`}>{isSubmitting ? '...Login' : 'Login'}</button>
            </div>
        </form>
    )
}