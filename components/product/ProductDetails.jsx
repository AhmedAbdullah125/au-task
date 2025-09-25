'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { t } from '@/lib/i18n';

export default function ProductDetails({ product, lang, options, setOptions }) {
    const handleOptionChange = (optionId, valueId, price) => {        
        setOptions((prevOptions) => {
            const filtered = prevOptions.filter(o => o.option_id !== optionId);
            return [...filtered, { option_id: optionId, option_value_id: valueId, option_value_price: price }];
        });
    };

    return (
        <div className="product-details-cont">
            <div className="product-by">
                <figure className="product-logo">
                    <Image src={product?.store.image} alt="logo" width={1000} height={500} />
                </figure>
                <span>{product?.store.name}</span>
            </div>
            <div className="product-content">
                <div className="product-name">{product?.name}</div>
                <div className="product-social">
                    <div className="product-rate">
                        {
                            Array.from({ length: 5 }).map((_, index) => (
                                <i key={index} className={`fa-solid fa-star ${Math.round(product.rates.rate) > index ? 'active' : ''}`}></i>
                            ))
                        }
                    </div>
                    <span>{product.rates.count} {t(lang, 'comment')}</span>
                </div>
                <div className="price-box">
                    <span className="new-price">{product.price} {t(lang, 'currency')}</span>
                    {
                        product.price_before_discount &&
                        <span className="old-price">{product.price_before_discount} {t(lang, 'currency')}</span>
                    }
                </div>
                <div className="product-date">
                    <i className="fa-light fa-calendar-clock"></i>
                    <span>{t(lang, 'end_date')} :</span>
                    <span>{product.valid_for}</span>
                </div>

                {
                    product.options.map((option) =>
                        <div key={option.id}>
                            <h3 className="product-label-name">{option.name}</h3>
                            <div className="product-label">
                                {
                                    option.values.map((value) => (
                                        <label className="label-check" key={value.id}>
                                            <span>
                                                <input
                                                    type="radio"
                                                    name={`option_${option.id}`}
                                                    checked={options.some(o => o.option_id === option.id && o.option_value_id === value.id)}
                                                    onChange={() => handleOptionChange(option.id, value.id, value.price)}
                                                />
                                                <span className="label-checkmark"></span>
                                                <span className="label-text">
                                                    {option.has_price && (
                                                        <span className="label-price">{value.price} {t(lang, 'currency')}</span>
                                                    )}
                                                    <span>{value.name}</span>
                                                </span>
                                            </span>
                                        </label>
                                    ))
                                }
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
}
