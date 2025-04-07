
import { auth } from "@clerk/nextjs/server";
import EmptyDashboard from "@/components/EmptyDashboard";
import { ArrowLeftCircle } from "lucide-react";

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    return <EmptyDashboard />;
  }

  return (
    <div className="p-4 h-full flex justify-center items-center">
      {/* TODO: Render user docs here */}
      <main className="flex space-x-2 items-center animate-pulse">
        <ArrowLeftCircle className="w-12 h-12"/>
        <h1 className="font-bold">Get started with creating a New Document</h1>
    </main>
    </div>
  );
}
