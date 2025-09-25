import axios from 'axios';

/**
 * Logs out the user.
 * @param {string} API_BASE_URL - Base URL of the API.
 * @param {function} setLoading - Function to toggle loading state.
 * @param {object} router - Next.js router object for navigation.
 * @param {function} toast - Toast function for notifications.
 */
export const logOut = async (API_BASE_URL, setLoading, router, toast) => {
    setLoading(true); // Set loading state
    const url = `${API_BASE_URL}/user/logout`; // API endpoint

    try {
        const response = await axios.post(url, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'x-localization': localStorage.getItem('lang') || 'en',
            }
        });

        setLoading(false); // Reset loading state

        if (response.status === 200) {
            const message = response.data?.message;

            // Success toast notification
            toast(message, {
                style: {
                    borderColor: "#28a745",
                    boxShadow: '0px 0px 10px rgba(40, 167, 69, .5)'
                },
            });

            // Clear token and redirect
            localStorage.removeItem('token');
            location.reload();
            router.push('/');

        } else {
            const unexpectedMessage = response.data?.message || 'Unexpected response';
            toast(unexpectedMessage, {
                style: {
                    borderColor: "#dc3545",
                    boxShadow: '0px 0px 10px rgba(220, 53, 69, .5)'
                },
            });
        }
    } catch (error) {
        setLoading(false); // Reset loading state

        // Log the error for debugging
        console.error('Logout error:', error);

        // Extract error message from response
        const errorMessage = error?.response?.data?.msg || error.message || 'An unknown error occurred';

        // Display error toast notification
        toast(errorMessage, {
            style: {
                borderColor: "#dc3545",
                boxShadow: '0px 0px 10px rgba(220, 53, 69, .5)'
            },
        });
    }
};
