'use client';
import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/apiConfig';
import axios from 'axios';
import Loading from '@/src/app/loading';

export default function ProductInfo({ product, lang, t }) {
    const [maxComments, setMaxComments] = useState(3);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    useEffect(() => {
        const getData = async () => {
            if (token) {
                setLoading(true);
                try {
                    const response = await axios.get(API_BASE_URL + `/product/${product.id}/rates`, {
                        headers: { 'x-localization': lang, Authorization: `Bearer ${localStorage.getItem('token')}` },
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
            else {
                setLoading(false);
            }
        }
        getData();
    }, [lang]);

    return (
        <>
            <h3 className="details-head">{t(lang, "product_description")}</h3>
            <div className="details-box">{product?.description}</div>
            <h3 className="details-head">{t(lang, "product_details")}</h3>
            <div className="details-box">{product?.details} </div>
            {
                loading ? <Loading /> :
                    token ?
                        <>

                            <div className="details-rate">
                                <h3 className="details-head">{t(lang,"comments")}</h3>
                                {
                                    product.rates.count > 0 ?
                                        <div className="product-rate">
                                            {
                                                Array.from({ length: 5 }).map((_, index) => (
                                                    <i key={index} className={`fa-solid fa-star ${Math.round(product.rates.rate) > index ? 'active' : ''}`}></i>

                                                ))
                                            }
                                        </div>
                                        : null
                                }
                            </div>
                            {
                                data?.rates?.length > 0 ?
                                    <div className="rate-box">
                                        {
                                            data.rates.slice(0, maxComments).map((comment, index) => (
                                                <div className="rate-item" key={index}>
                                                    <div className="rate-name">{comment.user}</div>
                                                    {/* <div className="rate-time">منذ 1 ساعة</div> */}
                                                    <div className="product-rate">
                                                        {
                                                            Array.from({ length: 5 }).map((_, index) => (
                                                                <i key={index} className={`fa-solid fa-star ${Math.round(comment.rate) > index ? 'active' : ''}`}></i>
                                                            ))
                                                        }
                                                    </div>
                                                    <div className="rate-text">{comment.comment}</div>
                                                </div>
                                            ))
                                        }

                                        <button className="rate-more" onClick={() => {
                                            if (maxComments === data.rates.length) {
                                                setMaxComments(3);
                                            }
                                            else {
                                                setMaxComments(data.rates.length)
                                            }

                                        }}>
                                            <span>{maxComments === data.rates.length ? t(lang, "show_less") : t(lang, "show_more")}</span><i className="fa-solid fa-angle-left"></i>
                                        </button>
                                    </div>
                                    : null
                            }
                        </>
                        : null
            }
        </>
    );
}
