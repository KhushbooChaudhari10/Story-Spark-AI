"use client";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/firebaseConfig";
import SignupForm from "@/components/SignupForm";

export default function SignupPage() {
  const router = useRouter();

  const handleSignup = async (name: string, email: string, password: string) => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      // Set display name
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
      }

      const token = await userCred.user.getIdToken();

      // Register in backend
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-100">
      <h1 className="text-3xl font-bold mb-6 text-purple-800">Parent Signup</h1>
      <SignupForm onSignup={handleSignup} />
    </div>
  );
}
