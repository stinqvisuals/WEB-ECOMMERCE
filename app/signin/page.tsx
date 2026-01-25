import { LoginGoogleButton } from "@/components/login-button";
import { Metadata } from "next";
import Navbar from "@/components/Navbar/Navbar";

export const metadata: Metadata = {
    title: "Sign In",
};

const SignInPage = () => {
    return (
        <div>
            <Navbar />
            <div className="min-h-screen flex items-center">
                <div className="bg-black w-96 mx-auto rounded-sm shadow p-8">
                    <h1 className="text-4xl text-white font-bold mb-1">Sign In</h1>
                    <p className="font-medium mb-5 text-gray-300">Sign In to your account</p>
                    <div className="py-4 text-center">
                        <LoginGoogleButton />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignInPage