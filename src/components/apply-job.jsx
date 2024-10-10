/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useFetch from "@/hooks/use-fetch";
import { applyToJob } from "@/api/apiApplication";
import { BarLoader } from "react-spinners";

// Schema validation for the application form using Zod
const schema = z.object({
  experience: z
    .number()
    .min(0, { message: "Experience must be at least 0" }) // Minimum experience validation
    .int(), // Must be an integer
  skills: z.string().min(1, { message: "Skills are required" }), // Skills must be provided
  education: z.enum(["Intermediate", "Graduate", "Post Graduate"], {
    message: "Education is required",
  }), // Education selection is required
  resume: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "application/pdf" ||
          file[0].type === "application/msword"),
      { message: "Only PDF or Word documents are allowed" } // Resume must be a valid file type
    ),
});

// Component for applying to a job using a drawer
export function ApplyJobDrawer({ user, job, fetchJob, applied = false }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema), // Use Zod for form validation
  });

  const {
    loading: loadingApply,
    error: errorApply,
    fn: fnApply,
  } = useFetch(applyToJob); // Fetch hook for applying to the job

  // Handle form submission
  const onSubmit = (data) => {
    fnApply({
      ...data,
      job_id: job.id, // Include job ID in submission
      candidate_id: user.id, // Include candidate ID
      name: user.fullName, // Include candidate name
      status: "applied", // Set initial status
      resume: data.resume[0], // Attach the uploaded resume
    }).then(() => {
      fetchJob(); // Refresh job details
      reset(); // Reset the form after submission
    });
  };

  return (
    <Drawer open={applied ? false : undefined}>
      <DrawerTrigger asChild>
        <Button
          size="lg"
          variant={job?.isOpen && !applied ? "blue" : "destructive"} // Set button variant based on job status
          disabled={!job?.isOpen || applied} // Disable button if job is closed or already applied
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold"
        >
          {job?.isOpen ? (applied ? "Applied" : "Apply") : "Hiring Closed"}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-2xl font-bold mb-2">
            Apply for {job?.title} at {job?.company?.name}
          </DrawerTitle>
          <p className="text-gray-600 mb-6">Please fill the form below</p>
        </DrawerHeader>

        <form
          onSubmit={handleSubmit(onSubmit)} // Handle form submission
          className="flex flex-col gap-6 px-6 pb-6"
        >
          <div>
            <Input
              type="number"
              placeholder="Years of Experience"
              className="w-full p-3 border border-gray-300 rounded-md"
              {...register("experience", { valueAsNumber: true })} // Register experience input
            />
            {errors.experience && ( // Display error message if validation fails
              <p className="text-red-500 mt-1">{errors.experience.message}</p>
            )}
          </div>

          <div>
            <Input
              type="text"
              placeholder="Skills (Comma Separated)"
              className="w-full p-3 border border-gray-300 rounded-md"
              {...register("skills")} // Register skills input
            />
            {errors.skills && ( // Display error message if validation fails
              <p className="text-red-500 mt-1">{errors.skills.message}</p>
            )}
          </div>

          <div>
            <Controller
              name="education" // Controller for education radio group
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange} // Update field value on change
                  {...field}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center">
                    <RadioGroupItem value="Intermediate" id="intermediate" className="mr-2" />
                    <Label htmlFor="intermediate">Intermediate</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="Graduate" id="graduate" className="mr-2" />
                    <Label htmlFor="graduate">Graduate</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="Post Graduate" id="post-graduate" className="mr-2" />
                    <Label htmlFor="post-graduate">Post Graduate</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.education && ( // Display error message if validation fails
              <p className="text-red-500 mt-1">{errors.education.message}</p>
            )}
          </div>

          <div>
            <Input
              type="file"
              accept=".pdf, .doc, .docx"
              className="w-full p-3 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              {...register("resume")} // Register resume input
            />
            {errors.resume && ( // Display error message if validation fails
              <p className="text-red-500 mt-1">{errors.resume.message}</p>
            )}
          </div>

          {errorApply?.message && ( // Display error message if API call fails
            <p className="text-red-500">{errorApply?.message}</p>
          )}
          {loadingApply && <BarLoader width={"100%"} color="#00bbee" />} {/* Loader displayed during submission */}

          <div className="flex justify-center">
            <Button type="submit" className="w-52 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold">
              Apply
            </Button>
          </div>
        </form>

        <DrawerFooter>
          <DrawerClose asChild>
            <div className="flex justify-center">
              <Button variant="outline" className="bg-gray-300 hover:bg-red-400 w-52 py-2 rounded-lg">Cancel</Button>
            </div>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
