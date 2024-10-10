/* eslint-disable react/prop-types */
import { Heart, MapPinIcon, Trash2Icon } from "lucide-react"; // Importing icons for the job card
import { Button } from "./ui/button"; // Custom button component
import {
  Card,
  CardContent,
  CardFooter,
} from "./ui/card"; // Custom card component
import { Link } from "react-router-dom"; // Router component for navigation
import useFetch from "@/hooks/use-fetch"; // Custom hook for data fetching
import { deleteJob, saveJob } from "@/api/apiJobs"; // API functions for job actions
import { useUser } from "@clerk/clerk-react"; // Hook to access user information
import { useEffect, useState } from "react"; // Hooks for managing state and side effects
import { BarLoader } from "react-spinners"; // Loader component for loading states
import TimeAgo from 'react-timeago'; // Component to display time ago

// JobCard component to display job details and actions
const JobCard = ({
  job,
  savedInit = false,
  onJobAction = () => {},
  isMyJob = false,
}) => {
  const [saved, setSaved] = useState(savedInit); // State to track if the job is saved

  const { user } = useUser(); // Get current user information

  const { loading: loadingDeleteJob, fn: fnDeleteJob } = useFetch(deleteJob, {
    job_id: job.id, // Pass job ID for deletion
  });

  const {
    loading: loadingSavedJob,
    data: savedJob,
    fn: fnSavedJob,
  } = useFetch(saveJob); // Fetch function for saving jobs

  // Function to handle saving a job
  const handleSaveJob = async () => {
    await fnSavedJob({
      user_id: user.id,
      job_id: job.id,
    });
    onJobAction(); // Callback to refresh job actions
  };

  // Function to handle deleting a job
  const handleDeleteJob = async () => {
    await fnDeleteJob();
    onJobAction(); // Callback to refresh job actions
  };

  useEffect(() => {
    // Effect to set saved state based on savedJob data
    if (savedJob !== undefined) setSaved(savedJob?.length > 0);
  }, [savedJob]);

  const renderTimeAgo = () => {
    // Function to render how long ago the job was posted
    const postedAt = job.posted_at || job.created_at; // Use posted_at or created_at date
    console.log('posted_at:', job.posted_at, 'created_at:', job.created_at); // Debug log
    if (postedAt && !isNaN(new Date(postedAt).getTime())) {
      return <TimeAgo date={postedAt} />; // Return formatted time ago
    }
    return <span>Recently posted</span>; // Fallback text
  };

  return (
    <Card className="flex flex-col bg-white shadow-md rounded-lg overflow-hidden h-full">
      {loadingDeleteJob && (
        // Loader displayed while deleting a job
        <BarLoader className="mt-4" width={"100%"} color="#00bbee" />
      )}
      <CardContent className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex-shrink-0">
              {job.company && job.company.logo_url ? (
                // Display company logo if available
                <img src={job.company.logo_url} alt={job.company.name} className="h-10 w-10 object-contain" />
              ) : (
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div> // Placeholder if logo is not available
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{job.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-1">{job.company ? job.company.name : 'Company Name'}</p>
            </div>
          </div>
          {isMyJob ? (
            // Render delete icon if this is the user's job
            <Trash2Icon
              size={20}
              className="text-red-500 cursor-pointer flex-shrink-0"
              onClick={handleDeleteJob} // Call delete function on click
            />
          ) : (
            // Render save button if this is not the user's job
            <Button
              variant="ghost"
              className="p-2 flex-shrink-0"
              onClick={handleSaveJob}
              disabled={loadingSavedJob} // Disable button while saving
            >
              <Heart size={20} className={saved ? "text-red-500 fill-red-500" : "text-gray-400"} />
            </Button>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
          {job.description} {/* Job description */}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
          <div className="flex items-center space-x-2">
            <MapPinIcon size={16} />
            <span className="line-clamp-1">{job.location}</span> {/* Job location */}
          </div>
          <div className="flex-shrink-0">
            {renderTimeAgo()} {/* Render time ago */}
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 px-6 py-4">
        <Link to={`/job/${job.id}`} className="w-full">
          <Button variant="secondary" className="w-full bg-gray-300 hover:bg-gray-700 hover:text-white">
            More Details {/* Button for more job details */}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default JobCard; // Export JobCard component for use in other parts of the application
