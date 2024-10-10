import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { State } from "country-state-city";
import { BarLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";

import JobCard from "@/components/job-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getCompanies } from "@/api/apiCompanies";
import { getJobs } from "@/api/apiJobs";
import { Search, MapPin, Building2, X } from "lucide-react"; // Import icons

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [location, setLocation] = useState(""); // State for selected location
  const [company_id, setCompany_id] = useState(""); // State for selected company

  const { isLoaded } = useUser(); // Check if the user is loaded

  // Fetch companies
  const { data: companies, fn: fnCompanies } = useFetch(getCompanies);

  // Fetch jobs based on filters
  const { loading: loadingJobs, data: jobs, fn: fnJobs } = useFetch(getJobs, {
    location,
    company_id,
    searchQuery,
  });

  // Fetch companies on user load
  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  // Fetch jobs when filters change
  useEffect(() => {
    if (isLoaded) fnJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, location, company_id, searchQuery]);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent default form submission
    let formData = new FormData(e.target); // Get form data

    const query = formData.get("search-query"); // Get search query
    if (query) setSearchQuery(query); // Update search query state
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setCompany_id("");
    setLocation("");
  };

  // Show loading spinner while fetching user data
  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#00bbee" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Latest Jobs
      </h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative flex items-center">
          <Input
            type="text"
            placeholder="Search Jobs by Title..."
            name="search-query"
            className="w-full pl-4 pr-12 py-6 text-lg rounded-full border-2 border-gray-200 "
          />
          <Button
            type="submit"
            className="absolute right-1 p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition duration-200"
            variant="blue"
          >
            <Search className="w-6 h-6 text-white" />
          </Button>
        </div>
      </form>

      {/* Filters for Location and Company */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Select value={location} onValueChange={(value) => setLocation(value)}>
            <SelectTrigger className="pl-10 rounded-lg">
              <SelectValue placeholder="Filter by Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {State.getStatesOfCountry("IN").map(({ name }) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="relative flex-1">
          <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Select
            value={company_id}
            onValueChange={(value) => setCompany_id(value)}
          >
            <SelectTrigger className="pl-10 rounded-lg">
              <SelectValue placeholder="Filter by Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {companies?.map(({ name, id }) => (
                  <SelectItem key={name} value={id}>
                    {name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button
          className="sm:w-1/4 rounded-lg"
          variant="destructive"
          onClick={clearFilters}
        >
          <X className="mr-2" /> Clear Filters
        </Button>
      </div>

      {/* Show loading spinner while fetching jobs */}
      {loadingJobs && (
        <BarLoader className="mt-4" width={"100%"} color="#00bbee" />
      )}

      {/* Job Listings */}
      {loadingJobs === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs?.length ? (
            jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                savedInit={job?.saved?.length > 0}
              />
            ))
          ) : (
            <div className="flex justify-center col-span-full text-center text-xl text-gray-500">No Jobs Found 😢</div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobListing;
