import { API_BASE_URL } from '@/lib/apiConfig';
import axios from 'axios';
import { toast } from 'sonner';


export const checkCode = async (code, cartId, setLoading, setDiscount, setCode, setPercentage,lang) => {

    setLoading(true); // Set loading state
    const formData = new FormData();
    formData.append('code', code); // Fallback if street is undefined
    formData.append('cart_id', cartId); // Fallback if street is undefined
    const url = `${API_BASE_URL}/cart/check-coupon`; // API endpoint
    try {
        const response = await axios.post(url, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                x_localization: localStorage.getItem('lang')
            },

        });
        setLoading(false); // Reset loading state

        if (response.status === 200) {
            setDiscount(response.data?.data.amount);
            if (response.data?.data.type === 'percentage') {
                setPercentage(true);
                const message =lang === 'en' ? response.data?.data.amount + " % Discount was applied" : `تم تطبيق خصم بنسبة ${response.data?.data.amount} %` || 'Voucher applied successfully';
                toast(message, {
                    style: {
                        borderColor: "#28a745",
                        boxShadow: '0px 0px 10px rgba(40, 167, 69, .5)',
                    },
                });
            }
            else if (response.data?.data.type === 'fixed') {
                setPercentage(false);
                const message = lang === 'en' ? response.data?.data.amount + " KD Discount was applied" : `تم تطبيق خصم بقيمة ${response.data?.data.amount} د.ك` || 'Voucher applied successfully';
                toast(message, {
                    style: {
                        borderColor: "#28a745",
                        boxShadow: '0px 0px 10px rgba(40, 167, 69, .5)',
                    },
                });
            }
            setCode(code);
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
