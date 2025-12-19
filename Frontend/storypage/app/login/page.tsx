"use client";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/firebaseConfig";
import LoginForm from "@/components/LoginForm";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error: any) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-300">
    <Navbar />

      {/* Magical Background Image */}
      <Image
        src="/child-login-background.png"
        alt="Background Magic"
        fill
        className="object-cover opacity-30"
      />

      {/* Magical sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        <span className="absolute top-20 left-10 text-yellow-200 text-xl animate-pulse">✨</span>
        <span className="absolute bottom-32 right-20 text-yellow-200 text-xl animate-bounce">⭐</span>
        <span className="absolute top-40 right-44 text-yellow-300 text-sm animate-ping">🌟</span>
      </div>

      {/* Glassmorphic Login Box */}
      <div className="relative z-20 w-full max-w-md bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/40">
        
        <h1 className="text-4xl font-extrabold text-center text-white drop-shadow-lg mb-6">
          Parent Login
        </h1>

        <p className="text-center text-purple-100 mb-6 text-lg">
          Access your child's magical story world ✨
        </p>

        <LoginForm onLogin={handleLogin} />

        {/* Signup Link */}
        <p className="mt-6 text-center text-white/90">
          New here?{" "}
          <span
            className="text-yellow-300 font-semibold hover:underline cursor-pointer"
            onClick={() => router.push("/signup")}
          >
            Create an account
          </span>
        </p>
      </div>
    </div>
  );
}
