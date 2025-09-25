'use client';
import { useEffect, useState } from 'react';
import emptyImg from '@/public/images/empty.webp'
import 'react-phone-number-input/style.css';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/apiConfig';
import { toast } from 'sonner';
import Image from 'next/image';
import axios from 'axios';
import { t } from '@/lib/i18n';
import Link from 'next/link';
import Loading from '@/src/app/loading';
export default function OrdersDetails() {
    const lang = localStorage.getItem('lang') || 'en';
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [orders, setOrders] = useState([])
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
                const response = await axios.get(API_BASE_URL + `/orders`, { headers: { 'x-localization': localStorage.getItem('lang') || 'en', Authorization: `Bearer ${localStorage.getItem('token')}` }, });
                let data = response.data.data;
                setOrders(data)

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
        <div className="account-content">
            {loading ?
                <Loading />
                :
                orders.length > 0 ?
                    <div className="account-content">
                        {
                            orders.map((ordersGroup) =>
                                <div key={ordersGroup.type}>
                                    <h3 className={`cart-title ${ordersGroup.type == " current " ? "current" : " mt-3"}`}>{ordersGroup.type == "current" ? "الطلبات المكتملة" : "الطلبات المكتملة"}</h3>
                                    {
                                        ordersGroup.items.map((order) =>

                                            <Link href={`/order?id=${order.id}`} className="order-item" key={order.id}>
                                                <div className="order-item-cont">
                                                    <div className="product-by">
                                                        <figure className="product-logo">
                                                            <Image src={order.store.image} alt="logo" width={1000} height={500}/>
                                                        </figure>
                                                        <span>{order.store.name}</span>
                                                    </div>
                                                    <span>{order.created_at}</span>
                                                </div>
                                                <div className="order-item-details">
                                                    <div className="order-id">#{order.id}</div>
                                                    <span>-</span>
                                                    <div className="order-status">{order.status_translated}</div>
                                                </div>
                                                <div className="order-item-total">
                                                    <div className="order-counter">{t(lang, "products_count")} : {order.products_count}</div>
                                                    <div className="order-total">{order.total} {t(lang, "currency")}</div>
                                                </div>
                                            </Link>
                                        )
                                    }

                                </div>

                            )
                        }
                    </div>
                    :
                    <div className="empty-img-cont flex justify-center items-center">
                        <Image src={emptyImg} alt="empty" />
                    </div>

            }
        </div>
    );
}