'use client';
import React, { useEffect, useState } from 'react';
import BreadCrumb from '../General/BreadCrumb';
import { t } from '@/lib/i18n';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/apiConfig';
import CartGrid from './CartGrid';
import Loading from '@/src/app/loading';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function CartWrapper() {
    const [lang, setLang] = useState(localStorage.getItem('lang') || 'ar');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('lang') === 'ar' || localStorage.getItem('lang') === 'en') {
                setLang(localStorage.getItem('lang'));
            }
            else {
                localStorage.setItem('lang', 'ar');
                setLang('ar');
            }
        }
        if (!token) {
            toast(t(lang, 'login_error'), { style: { borderColor: "#dc3545", boxShadow: '0px 0px 10px rgba(220, 53, 69, .5)', }, });
            router.push('/login');
        }
    })
    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            if (!token) {
                router.push('/login');
                return;
                
            }
            try {
                const response = await axios.get(API_BASE_URL + `/cart`, {
                    headers: {
                        'x-localization': lang,
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                });
                let data = response.data.data;
                setData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error retrieving data:', error);
                throw new Error('Could not get data');
                setLoading(false);
            }
        }
        getData();
    }, [lang]);
    return (
        <section className="content-section" style={{ direction: lang === 'en' ? 'ltr' : 'rtl' }}>
            <div className="container">
                {
                    loading ? <Loading /> :
                        <>
                            <BreadCrumb first={t(lang, 'cart')} firstLink='/cart' lang={lang} />
                            <CartGrid data={data} lang={lang} />
                        </>
                }
            </div>
        </section>
    );
}

