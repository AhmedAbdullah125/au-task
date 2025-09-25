'use client';
import { useEffect, useState } from 'react';
import emptyImg from '@/public/images/empty.webp'
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/apiConfig';
import { toast } from 'sonner';
import Image from 'next/image';
import axios from 'axios';
import Loading from '../../loading';
import { t } from '@/lib/i18n';
import ProductCard from '@/components/General/ProductCard';
import Pagination from '@/components/General/Pagination';
export default function Page() {
    const lang = localStorage.getItem('lang') || 'en';
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [favourites, setFavourites] = useState([])
    const [page, setPage] = useState(1)
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (!savedToken) {
            toast.error(t(lang, "login_error"))
            router.push('/login');
        }
    }, []);
    useEffect(() => {
        setLoading(true)
        const getFavourites = async () => {
            try {
                const response = await axios.get(API_BASE_URL + `/user/favourites?page=${page}`, { headers: { 'x-localization': localStorage.getItem('lang') || 'en', Authorization: `Bearer ${localStorage.getItem('token')}` }, });
                let data = response.data.data;
                setFavourites(data)
                setLoading(false)
            } catch (error) {
                console.error('Error retrieving data:', error);
                throw new Error('Could not get data');
                setLoading(false)
            }
        };
        getFavourites();
    }, []);
    return (
        <div className="account-content">
            {loading ? <Loading /> :
                <>
                    <div className="items-grid">
                        {
                            favourites?.items?.length == 0 ?
                                <div className="empty-img-cont flex justify-center items-center">
                                    <Image src={emptyImg} alt="empty" />
                                </div>
                                :
                                favourites?.items?.map((product) => (
                                    <ProductCard product={product} key={product.id} lang={lang} />
                                ))
                        }
                    </div>
                    <Pagination data={favourites} setPage={setPage} />
                </>
            }
        </div>
    );
}