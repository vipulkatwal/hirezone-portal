import { useEffect, useState } from "react"; // Hooks for managing state and side effects
import { Link, useSearchParams } from "react-router-dom"; // Router components for navigation and search params
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignIn,
  useUser,
} from "@clerk/clerk-react"; // Clerk components for user authentication
import { Button } from "./ui/button"; // Custom button component
import { BriefcaseBusiness, Heart, PenBox } from "lucide-react"; // Icons for the header

// Header component to display navigation and user authentication options
const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false); // State to control visibility of sign-in modal

  const [search, setSearch] = useSearchParams(); // Hook to manage search parameters in the URL
  const { user } = useUser(); // Get current user information

  useEffect(() => {
    // Effect to show sign-in modal if "sign-in" query parameter is present
    if (search.get("sign-in")) {
      setShowSignIn(true);
    }
  }, [search]);

  const handleOverlayClick = (e) => {
    // Close the sign-in modal if the overlay is clicked
    if (e.target === e.currentTarget) {
      setShowSignIn(false); // Hide sign-in modal
      setSearch({}); // Clear search parameters
    }
  };

  return (
    <>
      <nav className="py-4 flex justify-between items-center">
        <Link to="/">
          <img src="/logo.png" className="h-20" alt="hirezone Logo" />
        </Link>

        <div className="flex gap-8">
          <SignedOut>
            <Button
              className="bg-blue-500 border rounded-lg text-white hover:bg-blue-700"
              variant="outline"
              onClick={() => setShowSignIn(true)} // Show sign-in modal on button click
            >
              Login
            </Button>
          </SignedOut>
          <SignedIn>
            {user?.unsafeMetadata?.role === "recruiter" && (
              <Link to="/post-job">
                <Button variant="destructive" className="rounded-3xl">
                  <PenBox size={20} className="mr-2" />
                  Post a Job
                </Button>
              </Link>
            )}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10", // Customize user button appearance
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="My Jobs" // Link to the user's jobs
                  labelIcon={<BriefcaseBusiness size={15} />}
                  href="/my-jobs"
                />
                <UserButton.Link
                  label="Saved Jobs" // Link to saved jobs
                  labelIcon={<Heart size={15} />}
                  href="/saved-jobs"
                />
                <UserButton.Action label="manageAccount" /> {/* Link to manage account */}
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </nav>

      {showSignIn && (
        // Render sign-in modal if showSignIn is true
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleOverlayClick} // Handle overlay click to close modal
        >
          <SignIn
            signUpForceRedirectUrl="/onboarding" // Redirect after sign-up
            fallbackRedirectUrl="/onboarding" // Redirect after sign-in
          />
        </div>
      )}
    </>
  );
};

export default Header; // Export Header component for use in other parts of the application
