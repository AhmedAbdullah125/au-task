import React from 'react';
import Image from 'next/image';
export default function OrderStore({data,lang,t}) {

    return (
        <div className="order-item">
            <div className="order-item-cont">
                <div className="product-by">
                    <figure className="product-logo">
                        <Image src={data.store.image} alt="logo" width={1000} height={500} />
                    </figure>
                    <span>{data.store.name}</span>
                </div>
                <span>{data.created_at}</span>
            </div>
            <div className="order-item-details">
                <div className="order-id">#{data.id}</div>
                <span>-</span>
                <div className="order-status">{data.status_translated}</div>
            </div>
            <div className="order-item-total">
                <div className="order-counter">{t(lang, "products_count")} : {data.products_count}</div>
                <div className="order-total">{data.total} {t(lang, "currency")}</div>
            </div>
        </div>
    );
}