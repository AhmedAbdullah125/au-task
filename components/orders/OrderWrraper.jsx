'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/apiConfig';
import BreadCrumb from '../General/BreadCrumb';
import { t } from '@/lib/i18n';
import OrderStore from './OrderStore';
import Loading from '@/src/app/loading';
import OrderItems from './OrderItems';
import masterimg from '@/public/images/pay-master.svg';
import applepayImg from '@/public/images/pay-apple.svg';
import kenetImg from '@/public/images/pay-k.svg';
import Image from 'next/image';
import OrderPayment from './OrderPayment';
export default function OrderWrraper() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('id');
    const lang = localStorage.getItem('lang') || 'en';
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [order, setOrder] = useState([])
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (!savedToken) {
            toast.error(t(lang, "login_error"))
            router.push('/login');
        }
    }, []);
    useEffect(() => {
        setLoading(true)
        const getOrders = async () => {
            try {
                const response = await axios.get(API_BASE_URL + `/orders/${orderId}`, { headers: { 'x-localization': localStorage.getItem('lang') || 'en', Authorization: `Bearer ${localStorage.getItem('token')}` }, });
                let data = response.data.data;
                setOrder(data)
                setLoading(false)
            } catch (error) {
                console.error('Error retrieving data:', error);
                throw new Error('Could not get data');
                setLoading(false)
            }
        };
        getOrders();
    }, []);
    return (
        <section className="content-section" style={{ direction: lang == "ar" ? "rtl" : "ltr" }}>
            {
                loading ? <Loading /> :
                    <div className="container">
                        <BreadCrumb first={t(lang, 'my_orders')} firstLink={'/profile/orders'} second={t(lang, "order_details")} secondLink={`#`} lang={lang} />
                        <div className="cart-details-grid">
                            <div className="right-cart">
                                <OrderStore data={order} lang={lang} t={t} />
                                <h3 className="cart-title">{t(lang, "order")}</h3>
                                <OrderItems data={order} lang={lang} t={t} setLoading={setLoading} />
                                {
                                    order?.shipped_by ?
                                        <>
                                            <h3 className="cart-title">{t(lang, "shipping_by")}</h3>
                                            <div className="cart-box">
                                                <div className="ship-cont">
                                                    <figure>
                                                        <img src="images/ship-img.png" alt="ship-logo" />
                                                    </figure>
                                                    <span className="check-text"
                                                    ><span>1 يونيو - 5 يونيو</span>
                                                        <span className="cart-ship" >{order.shipment_fee} {t(lang, "currency")} <span>{t(lang, "shipping_cost")}</span></span></span>
                                                </div>
                                            </div>
                                        </>
                                        : null
                                }
                                <h3 className="cart-title">{t(lang,"payment_by")}</h3>
                                <div className="cart-box">
                                    <div className="ship-cont">
                                        <figure>
                                            <Image src={order.payment_method == 'visa/master' ? masterimg : order.payment_method=='knet' ? kenetImg : applepayImg} alt={order.payment_method_translated} />
                                        </figure>
                                        <span className="check-text"><span>{order.payment_method_translated}</span></span>
                                    </div>
                                </div>
                            </div>

                            <OrderPayment data={order} lang={lang} t={t} />
                        </div>
                    </div>
            }
        </section>
    );
}