
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto py-24 text-center">
      <h1 className="text-5xl font-bold mb-4">
        Welcome to <span className="text-primary">ArchAItect</span>
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        AI-powered database design from project requirements.
      </p>
      <Link href="/dashboard">
        <Button className="bg-primary text-primary-foreground hover:bg-primary/80">
          Go to Dashboard
        </Button>
      </Link>
    </div>
  );
}
