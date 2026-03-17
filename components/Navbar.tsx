'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

// ❌ SignedIn / SignedOut removed in Clerk v7
// ✅ Use useUser for conditional rendering
import {
  SignInButton,
  UserButton,
  useUser
} from "@clerk/nextjs";

import { cn } from "@/lib/utils";

const navItems = [
  { label: "Library", href: "/" },
  { label: "Add New", href: "/books/new" },
  { label: "Pricing", href: "/subscriptions" },
];

const Navbar = () => {
  const pathName = usePathname(); // Get the current URL path of the page. 
  
  // ✅ Updated: useUser now provides auth state instead of SignedIn/SignedOut
  const { user, isSignedIn, isLoaded } = useUser();

  // ✅ Important: wait until Clerk loads (prevents hydration issues)
  if (!isLoaded) return null;

  return (
    <header className="w-full fixed z-50 bg-(--bg-primary)">
      <div className="wrapper navbar-height py-4 flex justify-between items-center">
        
        <Link href="/" className="flex gap-0.5 items-center">
          <Image src="/assets/logo.png" alt="Bookfied" width={42} height={26} />
          <span className="logo-text">Bookified</span>
        </Link>

        <nav className="w-fit flex gap-7.5 items-center">
          
          {navItems.map(({ label, href }) => {
            const isActive =
              pathName === href ||
              (href !== "/" && pathName.startsWith(href));

            return (
              // cn is a utility function used to conditionally combine multiple class names in a clean and readable way.
              <Link
                href={href}
                key={label}
                className={cn(
                  "nav-link-base",
                  isActive
                    ? "nav-link-active"
                    : "text-black hover:opacity-70"
                )}
              >
                {label}
              </Link>
            );
          })}

          <div className="flex gap-7.5 items-center">
            
            {/* ❌ Old (v4/v5): SignedIn / SignedOut removed */}
            {/* ✅ New (v7): conditional rendering using isSignedIn */}

            {!isSignedIn ? (
              // Show sign-in button when user is NOT logged in
              <SignInButton mode="modal" />
            ) : (
              // Show user info when logged in
              <div className="nav-user-link">
                <UserButton /> 
                {/* UserButton is a prebuilt auth component that automatically shows the user's avatar/profile UI. */}
                
                {/* Show user's first name if available */}
                {user?.firstName && (
                  <Link href="/subscriptions" className="nav-user-name">
                    {user.firstName}
                  </Link>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;