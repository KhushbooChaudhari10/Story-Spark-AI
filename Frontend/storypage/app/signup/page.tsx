"use client";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/firebaseConfig";
import SignupForm from "@/components/SignupForm";

export default function SignupPage() {
  const router = useRouter();

  const handleSignup = async (name: string, email: string, password: string) => {
    try {
      // Create a new user in Firebase Authentication using email and password
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      // Add the user's display name immediately after account creation
      // Helps personalize the dashboard or app experience
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
      }

      // Retrieve the user's authentication token for secure backend communication
      const token = await userCred.user.getIdToken();

      // Send user details to backend API to register the user in the local database
      // Ensures Firebase and backend stay in sync for user management
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      // Handle backend registration errors gracefully
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Registration failed");
      }

      // Redirect to dashboard after successful signup and registration
      router.push("/dashboard");
    } catch (err: any) {
      // Display friendly error message if any step fails
      alert("Signup failed: " + err.message);
    }
  };

  return (
    // Full-page layout with centered signup form for clean user focus
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-100">
      
      {/* Page heading communicates purpose clearly */}
      <h1 className="text-3xl font-bold mb-6 text-purple-800">Parent Signup</h1>

      {/* Custom signup form component that handles input and triggers signup logic */}
      <SignupForm onSignup={handleSignup} />
    </div>
  );
}
