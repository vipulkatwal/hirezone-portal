import { useSession } from "@clerk/clerk-react"; // Import useSession to access Clerk session
import { useState } from "react"; // Import useState for state management

// Custom hook for fetching data with a callback function and options
const useFetch = (cb, options = {}) => {
	// State to hold fetched data, loading status, and error information
	const [data, setData] = useState(undefined);
	const [loading, setLoading] = useState(null);
	const [error, setError] = useState(null);

	const { session } = useSession(); // Get the current user session from Clerk

	// Function to perform the fetch operation
	const fn = async (...args) => {
		setLoading(true); // Set loading to true before starting the fetch
		setError(null); // Reset any previous error

		try {
			// Get Supabase access token using the Clerk session
			const supabaseAccessToken = await session.getToken({
				template: "supabase", // Specify the template for the token
			});

			// Call the provided callback function with the access token and other arguments
			const response = await cb(supabaseAccessToken, options, ...args);

			// Update data state with the response
			setData(response);
			setError(null); // Reset error state on successful fetch
		} catch (error) {
			// Capture any errors during the fetch operation
			setError(error);
		} finally {
			// Set loading to false once the fetch is complete
			setLoading(false);
		}
	};

	// Return data, loading state, error information, and the fetch function
	return { data, loading, error, fn };
};

export default useFetch;
