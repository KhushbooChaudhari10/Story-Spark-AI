"use client";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/firebaseConfig";
import SignupForm from "@/components/SignupForm";

export default function SignupPage() {
  const router = useRouter();

  const handleSignup = async (name: string, email: string, password: string) => {
    try {
<<<<<<< HEAD
      // Create a new user in Firebase Authentication using email and password
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      // Add the user's display name immediately after account creation
      // Helps personalize the dashboard or app experience
=======
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      // Set display name
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
      }

<<<<<<< HEAD
      // Retrieve the user's authentication token for secure backend communication
      const token = await userCred.user.getIdToken();

      // Send user details to backend API to register the user in the local database
      // Ensures Firebase and backend stay in sync for user management
=======
      const token = await userCred.user.getIdToken();

      // Register in backend
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

<<<<<<< HEAD
      // Handle backend registration errors gracefully
=======
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Registration failed");
      }

<<<<<<< HEAD
      // Redirect to dashboard after successful signup and registration
      router.push("/dashboard");
    } catch (err: any) {
      // Display friendly error message if any step fails
=======
      router.push("/dashboard");
    } catch (err: any) {
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
      alert("Signup failed: " + err.message);
    }
  };

  return (
<<<<<<< HEAD
    // Full-page layout with centered signup form for clean user focus
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-100">
      
      {/* Page heading communicates purpose clearly */}
      <h1 className="text-3xl font-bold mb-6 text-purple-800">Parent Signup</h1>

      {/* Custom signup form component that handles input and triggers signup logic */}
=======
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-100">
      <h1 className="text-3xl font-bold mb-6 text-purple-800">Parent Signup</h1>
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
      <SignupForm onSignup={handleSignup} />
    </div>
  );
}
