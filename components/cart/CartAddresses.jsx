'use client';
import React, { useEffect, useState } from 'react';
import { t } from '@/lib/i18n';
import axios from 'axios';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select"
import Loading from '@/src/app/loading';
import { API_BASE_URL } from '@/lib/apiConfig';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
export default function CartAddresses({ data, lang, action }) {
    const [loading, setLoading] = useState(true);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const token = localStorage.getItem('token');
    const router = useRouter();
    const [errorBorder, setErrorBorder] = useState(action=="changAddress");
    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(API_BASE_URL + `/user/address`, {
                    headers: { 'x-localization': lang, Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                let data = response.data.data;
                if (data.length === 0) {
                    toast(t(lang, "add_address_first_error"), { style: { borderColor: "#28a745", boxShadow: '0px 0px 10px rgba(40, 167, 69, .5)', }, });
                    router.push("/profile/addresses")
                }
                setAddresses(data);
                setSelectedAddress(data[0].id);
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
        <div className="left-cart" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            {
                loading ? <Loading /> :
                    <>
                        <h3 className="cart-title">{t(lang, "shipping_Address")}</h3>

                        <div className={`cart-box ${errorBorder? "error-border":""}`} >
                            <Select onValueChange={(value) => {
                                if (!token) {
                                    toast(t(lang, 'login_to_add_to_cart'), {
                                        style: {
                                            borderColor: "#28a745",
                                            boxShadow: '0px 0px 10px rgba(40, 167, 69, .5)',
                                        },
                                    });
                                    return
                                }
                                setErrorBorder(false);
                                setSelectedAddress(value);

                            }} >
                                <SelectTrigger className="p-0 border-0 outline-none shadow-none " style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
                                    <SelectValue className='p-0' placeholder={
                                        <div className='flex flex-col items-start'>
                                            <span className='address-name'>{addresses[0].name}</span>
                                            <p className='add-dets'><span>{addresses[0].governorate.name}</span> <span>{addresses[0].area.name}</span> <span>{addresses[0].street_no}</span></p>
                                        </div>
                                    } />
                                </SelectTrigger>
                                <SelectContent style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
                                    <SelectGroup>
                                        <SelectLabel>{t(lang, "Addresses")}</SelectLabel>
                                        {addresses.map((address, index) =>
                                            <SelectItem value={address.id} key={index}>{address.name}</SelectItem>
                                        )
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="product-total-box">
                            <h4 className="total-head">{t(lang, 'total')}</h4>
                            <div className="total-price">{data.total} {t(lang, 'currency')}</div>
                            <Link href={`/checkout?address=${selectedAddress}&id=${data.id}`} className="btn-addToCart">{t(lang, 'confirm_order')}</Link>
                        </div>
                    </>
            }
        </div>
    );
}

