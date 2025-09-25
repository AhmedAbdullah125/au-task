import { API_BASE_URL } from '@/lib/apiConfig';
import { t } from '@/lib/i18n';
import axios from 'axios';
import { toast } from 'sonner';


export const addToCart = async (productId, options, qty, lang, setCount, setOptions,setCartTrigger, cartTrigger) => {
    // setLoading(true); // Set loading state
    const url = `${API_BASE_URL}/cart`; // API endpoint
   

    try {
        const response = await axios.post(url, {
            product_id: productId,
            options: options,
            qty: Number(qty)
        }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'x-localization': lang, },
        });
        // setLoading(false); // Reset loading state
        if (response.status === 200) {
            const message = t(lang, 'added_to_cart_success_message');
            toast(message, {
                style: {
                    borderColor: "#28a745",
                    boxShadow: '0px 0px 10px rgba(40, 167, 69, .5)',
                },
            });
            setCount(1);
            setOptions([]);
            setCartTrigger(!cartTrigger);
            console.log(cartTrigger);
            

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
        console.error('Error adding to cart:', error);
        const errorMessage = error?.response?.data?.message || error.message || 'An unknown error occurred';
        toast(errorMessage, {
            style: {
                borderColor: "#dc3545",
                boxShadow: '0px 0px 10px rgba(220, 53, 69, .5)',
            },
        });
    }
};
