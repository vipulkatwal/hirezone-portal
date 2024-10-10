import { useUser } from "@clerk/clerk-react"; // Importing user management from Clerk
import { Button } from "@/components/ui/button"; // Importing custom Button component
import { useNavigate } from "react-router-dom"; // Importing navigation functionality
import { useEffect } from "react"; // Importing useEffect for side effects
import { BarLoader } from "react-spinners"; // Importing loading spinner

const Onboarding = () => {
  const { user, isLoaded } = useUser(); // Destructuring user and loading state from useUser hook
  const navigate = useNavigate(); // Initializing navigation

  // Function to navigate the user based on their selected role
  const navigateUser = (currRole) => {
    navigate(currRole === "recruiter" ? "/post-job" : "/jobs");
  };

  // Function to handle role selection and update user metadata
  const handleRoleSelection = async (role) => {
    await user
      .update({ unsafeMetadata: { role } }) // Updating user role in unsafe metadata
      .then(() => {
        console.log(`Role updated to: ${role}`); // Log success
        navigateUser(role); // Navigate based on selected role
      })
      .catch((err) => {
        console.error("Error updating role:", err); // Log any errors
      });
  };

  useEffect(() => {
    // Redirect if the user's role is already set
    if (user?.unsafeMetadata?.role) {
      navigateUser(user.unsafeMetadata.role);
    }
  }, [user]); // Dependency on user object

  // Display loader while user data is loading
  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#00bbee" />;
  }

  return (
    <div className="flex flex-col items-center justify-center mt-40">
      <h2 className="font-extrabold text-7xl sm:text-8xl tracking-tighter">
        I am a...
      </h2>
      <div className="mt-16 grid grid-cols-2 gap-4 w-full md:px-40">
        {/* Button for Candidate role selection */}
        <Button
          variant="blue"
          className="h-36 text-2xl"
          onClick={() => handleRoleSelection("candidate")}
        >
          Candidate
        </Button>
        {/* Button for Recruiter role selection */}
        <Button
          variant="destructive"
          className="h-36 text-2xl"
          onClick={() => handleRoleSelection("recruiter")}
        >
          Recruiter
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
