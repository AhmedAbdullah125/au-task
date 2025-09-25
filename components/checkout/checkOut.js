import { API_BASE_URL } from '@/lib/apiConfig';
import axios from 'axios';
import { toast } from 'sonner';


export const checkOut = async (setLoading, id, addressId, paymentMethod, router, lang,code) => {

    setLoading(true); // Set loading state
    const formData = new FormData();
    // formData.append('code', code);
    formData.append('address_id', addressId);
    formData.append('payment_method', paymentMethod);
    formData.append('coupon', code);
    const url = `${API_BASE_URL}/cart/${id}/checkout`; // API endpoint
    try {
        const response = await axios.post(url, formData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'x-localization': lang, },
        });
        setLoading(false); // Reset loading state

        if (response.status === 200) {
                const message = response.data?.message || 'Order Submited Successfully';
                toast(message, {
                    style: {
                        borderColor: "#28a745",
                        boxShadow: '0px 0px 10px rgba(40, 167, 69, .5)',
                    },
                });
                router.push(response.data.data);
      

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
        const errorMessage = error?.response?.data?.message || error.message || error.response?.message || 'An unknown error occurred';
        toast(errorMessage, {
            style: {
                borderColor: "#dc3545",
                boxShadow: '0px 0px 10px rgba(220, 53, 69, .5)',
            },
        });
    }
};
