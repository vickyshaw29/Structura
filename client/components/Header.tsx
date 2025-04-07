"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Sidebar from "./Sidebar";
import Breadcrumbs from "./Breadcrumbs";

const Header = () => {
  const { user } = useUser();
  return (
    <div className="flex justify-between items-center px-2 min-h-[64px]">
      <div className="md:hidden">
        <Sidebar />
      </div>
      {user && (
        <h1>
          {user?.firstName}
          {`'s`} Space
        </h1>
      )}
      {/* Breadcrumbs */}
      {/* <Breadcrumbs/> */}
      <div>
      {/* <SignedOut>
        <SignInButton mode="modal">
          <button className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition">
            Sign in to get started
          </button>
        </SignInButton>
      </SignedOut> */}
        <SignedIn>
          <div className="ml-auto">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-10 h-10",
                },
              }}
              afterSignOutUrl="/"
            />
          </div>
        </SignedIn>
      </div>
    </div>
  );
};

export default Header;
