import { getMyJobs } from "@/api/apiJobs"; // API function to get jobs created by the user
import useFetch from "@/hooks/use-fetch"; // Custom hook for data fetching
import { useUser } from "@clerk/clerk-react"; // Hook to access user information
import { BarLoader } from "react-spinners"; // Loading spinner component
import JobCard from "./job-card"; // Component to display job details
import { useEffect } from "react"; // Hook for managing side effects

// Component to display jobs created by the user
const CreatedJobs = () => {
  const { user } = useUser(); // Get the current user

  const {
    loading: loadingCreatedJobs, // State for loading created jobs
    data: createdJobs, // Data for the jobs created by the user
    fn: fnCreatedJobs, // Function to fetch created jobs
  } = useFetch(getMyJobs, {
    recruiter_id: user.id, // Pass recruiter ID to fetch jobs
  });

  useEffect(() => {
    fnCreatedJobs(); // Fetch created jobs on component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {loadingCreatedJobs ? (
        // Show loading indicator while jobs are being fetched
        <BarLoader className="mt-4" width={"100%"} color="#00bbee" />
      ) : (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {createdJobs?.length ? (
            // If jobs are found, map over them and render JobCard for each
            createdJobs.map((job) => {
              return (
                <JobCard
                  key={job.id} // Unique key for each job
                  job={job} // Pass job data to JobCard
                  onJobAction={fnCreatedJobs} // Function to refresh jobs
                  isMyJob // Indicate that this job was created by the user
                />
              );
            })
          ) : (
            // If no jobs found, display a message
            <div>No Jobs Found 😢</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreatedJobs; // Export component for use in other parts of the application
