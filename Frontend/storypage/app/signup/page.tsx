"use client";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/firebaseConfig";
import SignupForm from "@/components/SignupForm";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function SignupPage() {
  const router = useRouter();

  const handleSignup = async (name: string, email: string, password: string) => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
      }

      const token = await userCred.user.getIdToken();

      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Registration failed");
      }

      router.push("/dashboard");
    } catch (err: any) {
      alert("Signup failed: " + err.message);
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

      {/* Sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        <span className="absolute top-16 left-14 text-yellow-200 text-xl animate-pulse">✨</span>
        <span className="absolute bottom-24 right-16 text-yellow-200 text-xl animate-bounce">⭐</span>
        <span className="absolute top-40 right-40 text-yellow-300 text-sm animate-ping">🌟</span>
      </div>

      {/* Glassmorphic Signup Card */}
      <div className="relative z-20 w-full max-w-md bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/40">
        
        <h1 className="text-4xl font-extrabold text-center text-white drop-shadow-lg mb-6">
          Parent Signup
        </h1>

        <p className="text-center text-purple-100 mb-6 text-lg">
          Begin your child’s magical storytelling journey ✨
        </p>

        <SignupForm onSignup={handleSignup} />

        {/* Already have account? */}
        <p className="mt-6 text-center text-white/90">
          Already have an account?{" "}
          <span
            className="text-yellow-300 font-semibold hover:underline cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}
