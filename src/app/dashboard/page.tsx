
"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {useState} from "react";
import {generateErDiagram} from "@/ai/flows/generate-er-diagram";
import {generateSql} from "@/ai/flows/generate-sql";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useToast} from "@/hooks/use-toast";
import {Copy, FileImage, LayoutDashboard, LogOut} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger} from "@/components/ui/alert-dialog";
import {cn} from "@/lib/utils";
import {Skeleton} from "@/components/ui/skeleton";

const DashboardPage = () => {
  const [projectRequirements, setProjectRequirements] = useState("");
  const [sqlCode, setSqlCode] = useState<string | null>(null);
  const [erDiagram, setErDiagram] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {toast} = useToast();

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const sqlResult = await generateSql({projectRequirements});
      setSqlCode(sqlResult.sqlCode);

      const erDiagramResult = await generateErDiagram({projectRequirements});
      setErDiagram(erDiagramResult.erDiagram);

      toast({
        title: "Generation successful!",
        description: "SQL code and ER diagram generated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate SQL and ER diagram.",
        variant: "destructive",
      });
      console.error("Generation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySqlCode = () => {
    if (sqlCode) {
      navigator.clipboard.writeText(sqlCode);
      toast({
        title: "SQL Code Copied",
        description: "SQL code has been copied to your clipboard.",
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar className="w-64 border-r flex-shrink-0">
          <SidebarHeader>
            <Link href="/" className="flex items-center space-x-2">
              <FileImage className="h-6 w-6"/>
              <span className="font-bold">ArchAItect</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <LayoutDashboard className="mr-2 h-4 w-4"/>
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <SidebarMenuButton className="w-full justify-start">
                  <LogOut className="mr-2 h-4 w-4"/>
                  <span>Logout</span>
                </SidebarMenuButton>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will log you out of your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Logout</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b p-4 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://picsum.photos/50/50" alt="User Avatar"/>
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Open user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href="/" className="flex items-center space-x-2">
                    <LogOut className="mr-2 h-4 w-4"/>
                    <span>Logout</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex-1 p-6">
            <section className="mb-8">
              <h2 className="text-3xl font-bold mb-4">Submit Project Requirements</h2>
              <Textarea
                placeholder="Enter your project requirements here..."
                className="w-full h-40 mb-4"
                value={projectRequirements}
                onChange={(e) => setProjectRequirements(e.target.value)}
              />
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/80"
                onClick={handleGenerate}
                disabled={isLoading}
              >
                {isLoading ? "Generating..." : "Generate"}
              </Button>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>SQL Code</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  {sqlCode ? (
                    <div className="bg-secondary rounded-md p-4 font-mono text-sm text-secondary-foreground">
                      <pre className="whitespace-pre-wrap">{sqlCode}</pre>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                        onClick={handleCopySqlCode}
                      >
                        <Copy className="h-4 w-4"/>
                        <span className="sr-only">Copy SQL code</span>
                      </Button>
                    </div>
                  ) : (
                    isLoading ? (
                      <Skeleton className="w-full h-24"/>
                    ) : (
                      <p className="text-muted-foreground">No SQL code generated yet.</p>
                    )
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>ER Diagram</CardTitle>
                </CardHeader>
                <CardContent>
                  {erDiagram ? (
                    <img
                      src={`data:image/svg+xml;utf8,${encodeURIComponent(erDiagram)}`}
                      alt="ER Diagram"
                      className="max-w-full max-h-64"
                    />
                  ) : (
                    isLoading ? (
                      <Skeleton className="w-full h-64"/>
                    ) : (
                      <p className="text-muted-foreground">No ER diagram generated yet.</p>
                    )
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardPage;
