"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

const Header = () => {
  const { user } = useUser();
  return (
    <div className="flex justify-between px-4 py-2 items-center">
      {user && (
        <h1>
          {user?.firstName}
          {`'s`} Space
        </h1>
      )}
      {/* Breadcrumbs */}
      <div>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Header;
