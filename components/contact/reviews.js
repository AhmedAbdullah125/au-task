import axios from 'axios';
import { toast } from 'sonner';

/**
 * Sends a POST request to submit a review.
 * @param {string} API_BASE_URL - The base URL for the API.
 * @param {Object} data - The data to be sent in the request.
 * @param {Function} setLoading - Function to toggle loading state.
 */
export const review = async (API_BASE_URL, data, setLoading) => {
    setLoading(true); // Set loading state
    const url = `${API_BASE_URL}/general/contact-us`; // API endpoint   
     
    try {
        // Prepare the request payload
        const queryParams = {
            name: data.name,
            email: data.email,
            message: data.feedback,
        };

        const response = await axios({
            method: 'post',
            url: url,
            data: queryParams,
            headers: {
                lang: localStorage.getItem('lang') || 'en',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        setLoading(false); // Reset loading state

        // Get message from response
        const message = response.data?.message || 'Operation successful';

        if (response.status === 200) {
            // Success toast notification
            toast(message, {
                style: {
                    borderColor: "#28a745",
                    boxShadow: '0px 0px 10px rgba(40, 167, 69, .5)',
                },
            });
        } else {
            // Handle unexpected responses
            toast('Unexpected response', {
                style: {
                    borderColor: "#dc3545",
                    boxShadow: '0px 0px 10px rgba(220, 53, 69, .5)',
                },
            });
        }
    } catch (error) {
        setLoading(false); // Reset loading state

        // Log the error for debugging
        console.error(error);

        // Extract error message from response
        const errorMessage = error?.response?.data?.message || error.message || 'An unknown error occurred';

        // Display error toast notification
        toast(errorMessage, {
            style: {
                borderColor: "#dc3545",
                boxShadow: '0px 0px 10px rgba(220, 53, 69, .5)',
            },
        });
    }
};
