import { useEffect } from "react"; // Import useEffect for side effects
import { BarLoader } from "react-spinners"; // Import BarLoader for loading indication
import MDEditor from "@uiw/react-md-editor"; // Import Markdown editor for job requirements
import { useParams } from "react-router-dom"; // Import useParams for URL parameters
import { useUser } from "@clerk/clerk-react"; // Import useUser for user authentication
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react"; // Import icons

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import UI components for dropdown
import { ApplyJobDrawer } from "@/components/apply-job"; // Import job application drawer
import ApplicationCard from "@/components/application-card"; // Import application card component
import { Button } from "@/components/ui/button"; // Import button component

import useFetch from "@/hooks/use-fetch"; // Import custom fetch hook
import { getSingleJob, updateHiringStatus } from "@/api/apiJobs"; // Import API functions

const JobPage = () => {
  const { id } = useParams(); // Get job ID from URL parameters
  const { isLoaded, user } = useUser(); // Get user authentication status and data

  // Fetch single job data
  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useFetch(getSingleJob, {
    job_id: id,
  });

  // Fetch job data when user is loaded
  useEffect(() => {
    if (isLoaded) fnJob();
  }, [isLoaded]);

  // Fetch hiring status update function
  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateHiringStatus,
    {
      job_id: id,
    }
  );

  // Handle status change for the job
  const handleStatusChange = (value) => {
    const isOpen = value === "open"; // Determine if job is open or closed
    fnHiringStatus(isOpen).then(() => fnJob()); // Update status and refetch job data
  };

  // Show loader while loading job data
  if (!isLoaded || loadingJob) {
    return <BarLoader className="mb-4" width={"100%"} color="#00bbee" />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{job?.title}</h1>
        <img src={job?.company?.logo_url} className="h-12 w-12 object-contain" alt={job?.company?.name} />
      </div>

      <div className="flex justify-between items-center text-gray-600 mb-8">
        <div className="flex items-center">
          <MapPinIcon className="mr-2" size={20} />
          <span>{job?.location}</span>
        </div>

        <div className="flex items-center">
          <Briefcase className="mr-2" size={20} />
          <span>{job?.applications?.length || 0} Applicants</span>
        </div>

        <div className="flex items-center">
          {job?.isOpen ? (
            <>
              <DoorOpen className="mr-2" size={20} />
              <span className="text-green-600 font-semibold">Open</span>
            </>
          ) : (
            <>
              <DoorClosed className="mr-2" size={20} />
              <span className="text-red-600 font-semibold">Closed</span>
            </>
          )}
        </div>
      </div>

      {/* Status change select for recruiters */}
      {job?.recruiter_id === user?.id && (
        <div className="mb-8">
          <Select onValueChange={handleStatusChange}>
            <SelectTrigger
              className={`w-full ${job?.isOpen ? "bg-green-500" : "bg-red-500"} text-white`}
            >
              <SelectValue
                placeholder={
                  "Hiring Status " + (job?.isOpen ? "( Open )" : "( Closed )")
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">About the job</h2>
        <p className="text-gray-700 leading-relaxed">{job?.description}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">What we are looking for</h2>
        <MDEditor.Markdown
          source={job?.requirements}
          className="bg-transparent text-gray-700 leading-relaxed"
        />
      </section>

      {/* Job application section */}
      {job?.recruiter_id !== user?.id && (
        <div className="mb-8">
          <ApplyJobDrawer
            job={job}
            user={user}
            fetchJob={fnJob}
            applied={job?.applications?.find((ap) => ap.candidate_id === user.id)}
          >
            <div className="flex justify-center w-full">
              <Button className="w-52 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold">
                Apply
              </Button>
            </div>
          </ApplyJobDrawer>
        </div>
      )}

      {loadingHiringStatus && <BarLoader width={"100%"} color="#00bbee" />}

      {/* Display applications for recruiters */}
      {job?.applications?.length > 0 && job?.recruiter_id === user?.id && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Applications</h2>
          <div className="space-y-4">
            {job?.applications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default JobPage;
