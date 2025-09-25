import { API_BASE_URL } from '@/lib/apiConfig';
import axios from 'axios';
import { toast } from 'sonner';


export const toggleNotification = async (productId, lang ,setIsFavourite ,fav) => {
    // setLoading(true); // Set loading state
    const formData = new FormData();
    formData.append('product_id', productId);
    const url = `${API_BASE_URL}/user/favourite`; // API endpoint
    try {
        const response = await axios.post(url, formData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'x-localization': lang, },
        });
        // setLoading(false); // Reset loading state
        if (response.status === 200) {
            const message = response.data?.message || 'Profile updated successfully';
        } else {
            const unexpectedMessage = response.data?.message || 'Unexpected response';
            toast(unexpectedMessage, {
                style: {
                    borderColor: "#dc3545",
                    boxShadow: '0px 0px 10px rgba(220, 53, 69, .5)',
                },
            });
        }
    } catch (error) {
        // setLoading(false); // Reset loading state
        console.error('Profile update error:', error);
        const errorMessage = error?.response?.data?.msg || error.message || 'An unknown error occurred';
        setIsFavourite(fav);
        toast(errorMessage, {
            style: {
                borderColor: "#dc3545",
                boxShadow: '0px 0px 10px rgba(220, 53, 69, .5)',
            },
        });
    }
};
