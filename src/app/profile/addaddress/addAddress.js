import { API_BASE_URL } from '@/lib/apiConfig';
import axios from 'axios';
import { toast } from 'sonner';


export const addAddress = async (data, setLoading,lat, lng,router) => {
    setLoading(true); // Set loading state
    const formData = new FormData();
    formData.append('name', data.addressName || ''); // Fallback if addressName is undefined
    formData.append('lat', lat); // Fallback if street is undefined
    formData.append('lng', lng); // Fallback if street is undefined
    formData.append('governorate_id', Number(data.governorate) || '');
    formData.append('area_id', Number(data.area)); // Fallback to 1 if undefined
    formData.append('street_no', data.street || ''); // Fallback if street is undefined
    formData.append('home_no', data.buildingNo || ''); // Fallback if street is undefined
    formData.append('flat_no', data.apartment || ''); // Fallback if street is undefined
    const url = `${API_BASE_URL}/user/address`; // API endpoint
    try {
        const response = await axios.post(url, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'x-localization': localStorage.getItem('lang') || 'en',
            },
        });
        setLoading(false); // Reset loading state
        if (response.status === 200 || response.status === 201) {
            const message = response.data?.message || 'Profile updated successfully';

            toast(message, {
                style: {
                    borderColor: "#28a745",
                    boxShadow: '0px 0px 10px rgba(40, 167, 69, .5)',
                },
            });
            router.push('/profile/addresses');
            
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
        setLoading(false); // Reset loading state
        console.error('Profile update error:', error);
        const errorMessage = error?.response?.data?.message || error.message || 'An unknown error occurred';
        toast(errorMessage, {
            style: {
                borderColor: "#dc3545",
                boxShadow: '0px 0px 10px rgba(220, 53, 69, .5)',
            },
        });
    }
};
