import { API_BASE_URL } from '@/lib/apiConfig';
import { t } from '@/lib/i18n';
import axios from 'axios';
import { toast } from 'sonner';
export const removeCartItem = async (cartId, productId, lang, setChanges, changes, setLoading,cartLength,router,cartTrigger,setCartTrigger) => {
    // setLoading(true); // Set loading state
    const url = `${API_BASE_URL}/cart/${cartId}/item/${productId}`; // API endpoint
    
    try {
        setLoading(true);
        const response = await axios.delete(url, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'x-localization': lang, },
        });
        setLoading(false);
        if (response.status === 200) {
            const message = t(lang, 'item_deleted_successfully');
            setChanges(!changes);
            toast(message, { style: { borderColor: "#28a745", boxShadow: '0px 0px 10px rgba(40, 167, 69, .5)', }, });
            setCartTrigger(!cartTrigger);
            if(cartLength === 1){
                router.push('/cart');
            }

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
        console.error('Error adding to cart:', error);
        const errorMessage = error?.response?.data?.message || error.message || 'An unknown error occurred';
        toast(errorMessage, {
            style: { borderColor: "#dc3545", boxShadow: '0px 0px 10px rgba(220, 53, 69, .5)', },
        });
    }
};
