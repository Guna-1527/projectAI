'use client';

import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useAuth, useUser} from "@/lib/auth";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function Home() {
  const user = useUser();
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, router, auth.isLoading]);

  if (auth.isLoading) {
    return <div className="container mx-auto py-24 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-24 text-center">
      <h1 className="text-5xl font-bold mb-4">
        Welcome to <span className="text-primary">ArchAItect</span>
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        AI-powered database design from project requirements.
      </p>
      {user ? (
        <Link href="/dashboard">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/80">
            Go to Dashboard
          </Button>
        </Link>
      ) : (
        <Link href="/login">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/80">
            Login
          </Button>
        </Link>
      )}
    </div>
  );
}

