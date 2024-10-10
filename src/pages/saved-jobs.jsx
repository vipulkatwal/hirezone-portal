import { getSavedJobs } from "@/api/apiJobs";
import JobCard from "@/components/job-card";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";

const SavedJobs = () => {
  // Fetching user information
  const { isLoaded } = useUser();

  // Fetching saved jobs using custom hook
  const {
    loading: loadingSavedJobs,
    data: savedJobs,
    fn: fnSavedJobs,
  } = useFetch(getSavedJobs);

  // Effect to fetch saved jobs when user is loaded
  useEffect(() => {
    if (isLoaded) {
      fnSavedJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  // Show loader while fetching data
  if (!isLoaded || loadingSavedJobs) {
    return <BarLoader className="mb-4" width={"100%"} color="#00bbee" />;
  }

  return (
    <div>
      <h1 className="font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Saved Jobs
      </h1>

      {loadingSavedJobs === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedJobs?.length ? (
            // Map over saved jobs and render JobCard for each
            savedJobs?.map((saved) => {
              return (
                <JobCard
                  key={saved.id}
                  job={saved?.job}
                  onJobAction={fnSavedJobs} // Refresh jobs on action
                  savedInit={true} // Indicates the job is saved
                />
              );
            })
          ) : (
            // Message when no saved jobs are found
            <div className="items-center text-center">No Saved Jobs 👀</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
