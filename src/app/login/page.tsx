;"use client";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import {useAuth} from "@/lib/auth";
import {useRouter} from "next/navigation";
import {useToast} from "@/hooks/use-toast";
import Link from "next/link";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {signInWithEmailAndPassword, signInWithGoogle} = useAuth();
  const router = useRouter();
  const {toast} = useToast();

  const handleEmailSignIn = async () => {
    try {
      await signInWithEmailAndPassword(email, password);
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign in with email and password.",
        variant: "destructive",
      });
      console.error("Email sign-in failed:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign in with Google.",
        variant: "destructive",
      });
      console.error("Google sign-in failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Login</h1>
        <Input
          type="email"
          placeholder="Email"
          className="w-80"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          className="w-80"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button className="w-80" onClick={handleEmailSignIn}>
          Sign In with Email
        </Button>
        <Button className="w-80" variant="secondary" onClick={handleGoogleSignIn}>
          Sign In with Google
        </Button>
        <p className="text-sm text-muted-foreground">
          Don't have an account? <Link href="/register" className="text-primary">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
