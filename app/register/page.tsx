import { RegisterForm } from "../components/auth/RegisterForm";

export default async function RegisterPage() {
    return (
        <div className="flex flex-col items-center place-self-center mt-15">
            <h2 className="font-bold pb-2">Register</h2>
            <RegisterForm/>
        </div>
    )
}