import { getCompanies } from "@/api/apiCompanies"; // Importing function to fetch companies
import { addNewJob } from "@/api/apiJobs"; // Importing function to add a new job
import AddCompanyDrawer from "@/components/add-company-drawer"; // Importing AddCompanyDrawer component
import { Button } from "@/components/ui/button"; // Importing custom Button component
import { Input } from "@/components/ui/input"; // Importing custom Input component
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Importing custom Select components
import { Textarea } from "@/components/ui/textarea"; // Importing custom Textarea component
import useFetch from "@/hooks/use-fetch"; // Importing custom hook for data fetching
import { useUser } from "@clerk/clerk-react"; // Importing user management from Clerk
import { zodResolver } from "@hookform/resolvers/zod"; // Importing Zod for form validation
import MDEditor from "@uiw/react-md-editor"; // Importing Markdown Editor
import { State } from "country-state-city"; // Importing State for country-state management
import { useEffect } from "react"; // Importing useEffect for side effects
import { Controller, useForm } from "react-hook-form"; // Importing form management hooks
import { Navigate, useNavigate } from "react-router-dom"; // Importing navigation functionality
import { BarLoader } from "react-spinners"; // Importing loading spinner
import { z } from "zod"; // Importing Zod for schema validation

// Schema for job posting validation
const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a location" }),
  company_id: z.string().min(1, { message: "Select or Add a new Company" }),
  requirements: z.string().min(1, { message: "Requirements are required" }),
});

const PostJob = () => {
  const { user, isLoaded } = useUser(); // Destructuring user and loading state from useUser hook
  const navigate = useNavigate(); // Initializing navigation

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { location: "", company_id: "", requirements: "" }, // Setting default values for the form
    resolver: zodResolver(schema), // Applying validation schema
  });

  // Fetching job creation status and data
  const {
    loading: loadingCreateJob,
    error: errorCreateJob,
    data: dataCreateJob,
    fn: fnCreateJob,
  } = useFetch(addNewJob);

  // Function to handle form submission
  const onSubmit = (data) => {
    fnCreateJob({
      ...data,
      recruiter_id: user.id, // Adding recruiter ID to the data
      isOpen: true, // Setting job status to open
    });
  };

  // Redirect to jobs page upon successful job creation
  useEffect(() => {
    if (dataCreateJob?.length > 0) navigate("/jobs");
  }, [loadingCreateJob]);

  // Fetching companies for the dropdown
  const {
    loading: loadingCompanies,
    data: companies,
    fn: fnCompanies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) {
      fnCompanies(); // Fetch companies when user data is loaded
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  // Display loading spinner while data is loading
  if (!isLoaded || loadingCompanies) {
    return <BarLoader className="mb-4" width={"100%"} color="#00bbee" />;
  }

  // Redirect if the user is not a recruiter
  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-extrabold text-6xl text-center mb-8">Post a Job</h1>
      <div className="bg-gray-50 shadow-md rounded-3xl p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Input
              placeholder="Job Title"
              {...register("title")} // Registering input with validation
              className="w-full"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Textarea
              placeholder="Job Description"
              {...register("description")} // Registering textarea with validation
              className="w-full h-32"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Controller
                name="location" // Managing location selection with Controller
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    className="w-full"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Job Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {State.getStatesOfCountry("IN").map(({ name }) => (
                          <SelectItem key={name} value={name}>
                            {name} // Mapping states as options
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>
            <div className="flex-1">
              <Controller
                name="company_id" // Managing company selection with Controller
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    className="w-full"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Company">
                        {field.value
                          ? companies?.find(
                              (com) => com.id === Number(field.value)
                            )?.name // Displaying selected company name
                          : "Company"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {companies?.map(({ name, id }) => (
                          <SelectItem key={name} value={id}>
                            {name} // Mapping companies as options
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.company_id && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.company_id.message}
                </p>
              )}
            </div>
            <AddCompanyDrawer fetchCompanies={fnCompanies} /> {/* Drawer to add new company */}
          </div>

          <div>
            <Controller
              name="requirements" // Managing job requirements with Controller
              control={control}
              render={({ field }) => (
                <MDEditor
                  value={field.value}
                  onChange={field.onChange}
                  preview="edit" // Markdown editor for job requirements
                  className="w-full"
                />
              )}
            />
            {errors.requirements && (
              <p className="text-red-500 text-sm mt-1">
                {errors.requirements.message}
              </p>
            )}
          </div>

          {errors.errorCreateJob && (
            <p className="text-red-500 text-sm">
              {errors?.errorCreateJob?.message}
            </p>
          )}
          {errorCreateJob?.message && (
            <p className="text-red-500 text-sm">{errorCreateJob?.message}</p>
          )}
          {loadingCreateJob && <BarLoader width={"100%"} color="#00bbee" />} {/* Loading spinner for job creation */}

          <div className="flex justify-center">
            <Button
              type="submit" // Submit button for form
              variant="blue"
              size="lg"
              className="w-40 mt-6 text-white"
            >
              Create a Job
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
