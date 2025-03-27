import RoomProvider from "@/components/RoomProvider";
import { auth } from "@clerk/nextjs/server";

const DocLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) => {
  // Ensure authentication before accessing params
  await auth.protect();

  // Wait for params to be available
  const resolvedParams = await params;

  console.log(resolvedParams, "params from DocLayout");

  return (
    <RoomProvider roomId={resolvedParams.id}>
      {children}
    </RoomProvider>
  );
};

export default DocLayout;
