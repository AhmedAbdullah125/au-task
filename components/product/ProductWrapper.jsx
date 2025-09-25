'use client';
import React, { useEffect, useState } from 'react';
import BreadCrumb from '../General/BreadCrumb';
import { t } from '@/lib/i18n';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/apiConfig';
import { useSearchParams } from 'next/navigation';
import ProductSwiper from './ProductSwiper';
import Loading from '@/src/app/loading';
import ProductDetails from './ProductDetails';
import ProductCount from './ProductCount';
import ProductInfo from './ProductInfo';

export default function ProductWrapper() {
    const searchParams = useSearchParams();
    const productId = searchParams.get('id');
    const [lang, setLang] = useState(localStorage.getItem('lang') || 'ar');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [options, setOptions] = useState([]);    
    const [count, setCount] = useState(1);
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
    })
    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(API_BASE_URL + `/product/${productId}`, {
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
            {
                loading ? <Loading /> :
                    <div className="container">
                        <BreadCrumb first={data?.category.name} firstLink={`/category?name=${data?.category.name}&id=${data?.category.id}`} lang={lang} />
                        <div className="product-cont">
                            <ProductSwiper product={data} lang={lang} setLoading={setLoading} />
                            <ProductDetails product={data} lang={lang} options={options} setOptions={setOptions} />
                            <ProductCount product={data} lang={lang} count={count} setCount={setCount} options={options} setOptions={setOptions} />
                        </div>
                            <ProductInfo product={data} lang={lang} t={t} />
                    </div>
            }
        </section >
    );
}

