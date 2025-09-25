'use client';
import React, { useEffect, useState } from 'react';
import { t } from '@/lib/i18n';
import Image from 'next/image';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/apiConfig';
import { useRouter, useSearchParams } from 'next/navigation';
export default function CartDetailsGrid({ data, lang }) {
    const token = localStorage.getItem('token');
    const [favourites, setFavourites] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const searchParams = useSearchParams();
    const addressId = searchParams.get('address');
    const cartId = searchParams.get('id');
    const [loading, setLoading] = useState(true);
    const [selectedAddress, setSelectedAddress] = useState({});
    const router = useRouter();
    useEffect(() => {
        //getting favourates items
        for (let i = 0; i < data.items.length; i++) {
            if (data.items[i].product.is_favourite && !favourites.includes(data.items[i].product.id)) {
                setFavourites([...favourites, data.items[i].product.id])
            }
        }
    })
    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(API_BASE_URL + `/user/address`, {
                    headers: {
                        'x-localization': lang,
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                });
                let data = response.data.data;
                //gettign selected address using address id that came from url
                const found = data.find((item) => Number(item.id) === Number(addressId));
                setSelectedAddress(found);
                setAddresses(data);
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
        <>

            <div className="cart-item">
                <div className="product-by">
                    <figure className="product-logo">
                        <Image src={data.store.image} alt="logo" width={1000} height={500} />
                    </figure>
                    <span>{data.store.name}</span>
                </div>
                {
                    loading ? null :

                        <div className="cart-place">
                            <p>
                                {t(lang, "shipping_to")} :
                                <span>{`${selectedAddress?.area?.name} ، ${selectedAddress?.governorate?.name} ،${selectedAddress?.street_no} ، ${selectedAddress?.home_no}`}</span>
                            </p>
                            <button className='change_address_btn'
                                onClick={() => { router.push(`cartdetails?id=${cartId}&action=changAddress`) }}>{t(lang, "change")}</button>
                        </div>
                }
            </div>
            <h3 className="cart-title">{t(lang, "products")}</h3>
            {
                data.items.map((product) => (
                    <div className="cart-box" key={product.id}>
                        <div className="cart-flex">
                            <figure>
                                <Image src={product.product.image} alt={product.product.name} width={1000} height={500} />
                            </figure>
                            <div className="product-container">
                                <div className="product-name">{product.product.name} </div>
                                {
                                    product.options.map((option) => (
                                        <div className="product-weight" key={option.id}>{option.option} : {option.value}</div>
                                    ))
                                }
                                <div className="product-detail-flex">
                                    <div className="product-weight">{t(lang, "quantity")} : {product.qty}</div>
                                    <span>{product.total} {t(lang, 'currency')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            }


        </>
    );
}

