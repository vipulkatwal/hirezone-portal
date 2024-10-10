/* eslint-disable react/prop-types */
import { Navigate, useLocation } from "react-router-dom"; // Importing navigation components
import { useUser } from "@clerk/clerk-react"; // Hook to access user information

// ProtectedRoute component to manage access based on user authentication
const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded, user } = useUser(); // Destructuring user state
  const { pathname } = useLocation(); // Getting the current pathname

  // Check if user is loaded and not signed in
  if (isLoaded && !isSignedIn && isSignedIn !== undefined) {
    return <Navigate to="/?sign-in=true" />; // Redirect to sign-in page
  }

  // Check if user has no role and is not on the onboarding page
  if (
    user !== undefined &&
    !user?.unsafeMetadata?.role &&
    pathname !== "/onboarding"
  ) {
    return <Navigate to="/onboarding" />; // Redirect to onboarding page
  }

  return children; // Render children components if all conditions are satisfied
};

export default ProtectedRoute; // Export ProtectedRoute for use in other parts of the application
