/* eslint-disable react/prop-types */
import { Boxes, BriefcaseBusiness, Download, School } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { updateApplicationStatus } from "@/api/apiApplication";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";

// Component to display individual application details
const ApplicationCard = ({ application, isCandidate = false }) => {
  // Function to handle resume download
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = application?.resume; // Set link to the resume URL
    link.target = "_blank"; // Open in a new tab
    link.click(); // Trigger download
  };

  // Custom hook to manage application status update
  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateApplicationStatus,
    {
      job_id: application.job_id, // Pass job_id to the API call
    }
  );

  // Function to handle status change of the application
  const handleStatusChange = (status) => {
    fnHiringStatus(status) // Update status
      .then(() => fnHiringStatus()); // Refetch status after updating
  };

  return (
    <Card>
      {/* Loader displayed while updating status */}
      {loadingHiringStatus && <BarLoader width={"100%"} color="#00bbee" />}
      <CardHeader>
        <CardTitle className="flex justify-between font-bold">
          {/* Display job title and company name or applicant's name */}
          {isCandidate
            ? `${application?.job?.title} at ${application?.job?.company?.name}`
            : application?.name}
          {/* Download icon to trigger resume download */}
          <Download
            size={18}
            className="bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer"
            onClick={handleDownload}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col md:flex-row justify-between">
          {/* Display experience */}
          <div className="flex gap-2 items-center">
            <BriefcaseBusiness size={15} /> {application?.experience} years of
            experience
          </div>
          {/* Display education */}
          <div className="flex gap-2 items-center">
            <School size={15} />
            {application?.education}
          </div>
          {/* Display skills */}
          <div className="flex gap-2 items-center">
            <Boxes size={15} /> Skills: {application?.skills}
          </div>
        </div>
        <hr />
      </CardContent>
      <CardFooter className="flex justify-between">
        {/* Display creation date of application */}
        <span>{new Date(application?.created_at).toLocaleString()}</span>
        {/* Render status display or selection based on role */}
        {isCandidate ? (
          <span className="capitalize font-bold">
            Status: {application.status}
          </span>
        ) : (
          <Select
            onValueChange={handleStatusChange} // Handle status change
            defaultValue={application.status}
          >
            {/* Status selection options */}
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Application Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;
