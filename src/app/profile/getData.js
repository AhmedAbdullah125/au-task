// get profile data function 

const { API_BASE_URL } = require("@/lib/apiConfig");
const { default: axios } = require("axios");


const token = localStorage.getItem('token');
export default async function getData() {
    if (!token) {
        return
    }
    try {
        const response = await axios.get(API_BASE_URL + '/auth/profile',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        let data = response.data.data;
        return data
    } catch (error) {
        console.error('Error retrieving data:', error);
        throw new Error('Could not get data');
        setLoading(false)
        
    }
};