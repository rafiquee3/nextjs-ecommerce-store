import { LoginForm } from "../components/auth/LoginForm";

export default function LoginPage() {

    return (
        <div className="flex flex-col items-center mt-15">
            <h2 className="font-bold mb-2">Sign in</h2>
            <LoginForm/>
        </div>
    )
}