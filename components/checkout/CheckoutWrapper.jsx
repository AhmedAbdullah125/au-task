'use client';
import React, { useEffect, useState } from 'react';
import BreadCrumb from '../General/BreadCrumb';
import { t } from '@/lib/i18n';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/apiConfig';
import Loading from '@/src/app/loading';
import { useSearchParams } from 'next/navigation';
import CartDetailsGrid from './CartDetailsGrid';
import ShippingWays from './ShippingWays';
import DiscountAndPayment from './DiscountAndPayment';

export default function CheckoutWrapper() {
    const [lang, setLang] = useState(localStorage.getItem('lang') || 'ar');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const cartId = searchParams.get('id');
    // const [selectedShippingWay, setSelectedShippingWay] = useState(1);
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
                const response = await axios.get(API_BASE_URL + `/cart/${cartId}`, {
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
                            <div className="cart-details-grid">
                                <div className="right-cart">
                                    <CartDetailsGrid data={data} lang={lang} />
                                    {/* <ShippingWays lang={lang} data={data} selectedShippingWay={selectedShippingWay} setSelectedShippingWay={setSelectedShippingWay} /> */}
                                </div>
                                <DiscountAndPayment lang={lang} data={data} />
                            </div>
                        </>
                }
            </div>
        </section>
    );
}

