"use client";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/firebaseConfig";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    try {
      // Authenticate the user with Firebase using email and password credentials
      await signInWithEmailAndPassword(auth, email, password);

      // Redirect user to the dashboard upon successful login
      router.push("/dashboard");
    } catch (error: any) {
      // Display an alert for failed login attempts with a readable message
      alert("Login failed: " + error.message);
    }
  };

  return (
    // Page container keeps content centered both vertically and horizontally
    // Provides a clean and simple login view for parents
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-100">
      
      {/* Heading that clearly communicates page purpose */}
      <h1 className="text-3xl font-bold mb-6 text-purple-800">Parent Login</h1>
      
      {/* Login form component that manages user input and triggers login logic */}
      <LoginForm onLogin={handleLogin} />
    </div>
  );
}
