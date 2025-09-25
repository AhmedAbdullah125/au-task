'use client';
import React, { useEffect, useState } from 'react';
import { t } from '@/lib/i18n';
import emptyImg from '@/public/images/empty.webp'
import Image from 'next/image';
import Link from 'next/link';
export default function CartGrid({ data, lang }) {
    return (
        <>
            {
                data.length > 0 ?
                    <div className="cart-grid">
                        {
                            data.map((item) => (
                                <div className="cart-item" key={item.id}>
                                    <div className="product-by">
                                        <figure className="product-logo">
                                            <Image src={item.store.image} alt="logo" width={1000} height={500} />
                                        </figure>
                                        <span>{item.store.name}</span>
                                    </div>
                                    <div className="cart-product-num">{t(lang, "products_count")} : <span>{item.products_count}</span></div>
                                    <Link href={`/cartdetails?id=${item.id}`} className="form-btn" >{t(lang, "view_cart")} <span>{item.price} {t(lang, "currency")}</span></Link>
                                </div>
                            ))
                        }
                    </div> :
                    <div className="empty-img-cont flex justify-center items-center">
                        <Image src={emptyImg} alt="empty" />
                    </div>
            }
        </>
    );
}

