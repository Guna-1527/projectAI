;"use client";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import {useAuth} from "@/lib/auth";
import {useRouter} from "next/navigation";
import {useToast} from "@/hooks/use-toast";
import Link from "next/link";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {createUserWithEmailAndPassword} = useAuth();
  const router = useRouter();
  const {toast} = useToast();

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(email, password);
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to register.",
        variant: "destructive",
      });
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Register</h1>
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
        <Button className="w-80" onClick={handleRegister}>
          Register
        </Button>
        <p className="text-sm text-muted-foreground">
          Already have an account? <Link href="/login" className="text-primary">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
