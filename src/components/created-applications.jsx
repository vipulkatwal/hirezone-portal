import { useUser } from "@clerk/clerk-react";
import ApplicationCard from "./application-card";
import { useEffect } from "react";
import { getApplications } from "@/api/apiApplication";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";

// Component to display created applications by the user
const CreatedApplications = () => {
  const { user } = useUser(); // Get the current user

  const {
    loading: loadingApplications, // State for loading applications
    data: applications, // Data for the applications
    fn: fnApplications, // Function to fetch applications
  } = useFetch(getApplications, {
    user_id: user.id, // Pass user ID to fetch applications
  });

  useEffect(() => {
    fnApplications(); // Fetch applications on component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show loading indicator while applications are being fetched
  if (loadingApplications) {
    return <BarLoader className="mb-4" width={"100%"} color="#00bbee" />;
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Map over applications and render an ApplicationCard for each */}
      {applications?.map((application) => {
        return (
          <ApplicationCard
            key={application.id} // Unique key for each application
            application={application} // Pass application data to card
            isCandidate={true} // Indicate that the user is a candidate
          />
        );
      })}
    </div>
  );
};

export default CreatedApplications; // Export component for use in other parts of the application
