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
    <header className="flex justify-between items-center px-4 min-h-[64px] border-b bg-white shadow-sm">
      {/* Sidebar for mobile */}
      <div className="md:hidden">
        <Sidebar />
      </div>

      {/* Middle section - Title or Welcome message */}
      <div className="flex-1 text-center">
        <SignedIn>
          <h1 className="text-lg font-semibold">
            {user?.firstName}
            {`'s`} Space
          </h1>
        </SignedIn>

        <SignedOut>
          <h1 className="text-lg font-semibold text-gray-700">Welcome to the Structura</h1>
        </SignedOut>
      </div>

      {/* Right section - Auth actions */}
      <div className="flex items-center space-x-4">
        {/* Breadcrumbs if needed */}
        {/* <Breadcrumbs /> */}

        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-900 transition">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "w-10 h-10",
              },
            }}
            afterSignOutUrl="/"
          />
        </SignedIn>
      </div>
    </header>
  );
};

export default Header;
