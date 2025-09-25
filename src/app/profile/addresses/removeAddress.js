import { API_BASE_URL } from '@/lib/apiConfig';
import axios from 'axios';
import { toast } from 'sonner';

export const deleteAddress = async (setLoading, router, id, deletedAddress, setDeletedAddress) => {
    setLoading(true); // Set loading state
    const url = `${API_BASE_URL}/user/address/${id}`; // API endpoint

    try {
        const response = await axios.delete(url, {
            headers: {
                "x-localization": localStorage.getItem('lang') || 'en',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        setLoading(false); // Reset loading state

        if (response.status === 200) {
            const message = response.data?.message || 'Address deleted successfully';

            // Success toast notification
            toast(message, {
                style: {
                    borderColor: "#28a745",
                    boxShadow: '0px 0px 10px rgba(40, 167, 69, .5)'
                },
            });
            router.refresh();
            setDeletedAddress([...deletedAddress, id]);
            // location.reload();
            return id;
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
        const errorMessage = error?.response?.data?.message || error.message || 'An unknown error occurred';

        // Display error toast notification
        toast(errorMessage, {
            style: {
                borderColor: "#dc3545",
                boxShadow: '0px 0px 10px rgba(220, 53, 69, .5)'
            },
        });
    }
};
