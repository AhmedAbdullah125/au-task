"use client"
import { t } from '@/lib/i18n';
import React, { useState } from 'react';
import applepayImage from '@/public/images/pay-apple.svg';
import kentImage from '@/public/images/pay-k.svg';
import masterImage from '@/public/images/pay-master.svg';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { checkOut } from './checkOut';
import { checkCode } from './checkCode';

export default function DiscountAndPayment({ data, lang }) {
    const [paymentMethod, setPaymentMethod] = useState("knet");
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const addressId = searchParams.get('address');
    const [discount, setDiscount] = useState(0);
    const [code, setCode] = useState("");
    const [percentage, setPercentage] = useState(false);
    const router = useRouter();
    const paymentMethods = [
        { id: 1, name: t(lang, "visa"), image: masterImage, value: "visa/master" },
        { id: 2, name: t(lang, "kent"), image: kentImage, value: "knet" },
        { id: 3, name: t(lang, "apple_pay"), image: applepayImage, value: "apple_pay" },
    ]
    const handleCheckout = async () => {
        await checkOut(setLoading, data.id, addressId, paymentMethod, router, lang,code);
    };
    const handleCheckCode = async (code) => {
        await checkCode(code, data.id, setLoading, setDiscount, setCode, setPercentage, lang);
    };

    return (
        <div className="left-cart" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            <h3 className="cart-title">{t(lang, "coupon")}</h3>
            <div className="discount-input">
                <input type="text" id='Voucher' placeholder={t(lang, "coupon_error")} name="" />
                <button
                    disabled={loading} onClick={() => {
                        const input = document.getElementById("Voucher");
                        if (input.value === "") {
                            input.style.border = "1px solid #C71919";
                            setTimeout(() => input.style.border = "1px solid #e0e0e0", 2000);
                        } else {
                            handleCheckCode(input.value);
                        }
                    }}
                >{t(lang, "Apply")}</button>
            </div>
            <h3 className="cart-title">{t(lang, "payment_method")}</h3>
            <div className="checkout-cont">
                <div className="payment-cont">
                    <div className="form-group">
                        <div className="check-group">
                            {
                                paymentMethods.map((item) => (
                                    <div className="check-width" key={item.id}>
                                        <label className="check-label">
                                            <span className="payment-radio">
                                                <input type="radio" name="place" checked={paymentMethod === item.value} onChange={() => setPaymentMethod(item.value)} />
                                                <div className="ship-cont">
                                                    <figure>
                                                        <Image src={item.image} alt="ship-logo" />
                                                    </figure>
                                                    <span className="check-text">{item.name}</span>
                                                </div>
                                                <span className="checkmark"></span>
                                            </span>
                                        </label>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
            <h3 className="cart-title">{t(lang, "order_summary")}</h3>
            <div className="product-total-box">
                <div className="total-ckeckout">
                    <span>{t(lang, "subtotal")}</span>
                    <span className="total-num">{Number(data.total).toFixed(3)} {t(lang, "currency")}</span>
                </div>
                <div className="total-ckeckout">
                    <span>{t(lang, "shipping")}</span>
                    <span className="total-num">{data?.shipment_fee || "0.000"} {t(lang, "currency")}</span>
                </div>
                <div className="total-ckeckout red">
                    <span>{t(lang, "discount")}</span>
                    <span className="total-num">{percentage ? (Number(discount)*(Number(data.total) / 100)).toFixed(3) + " " + t(lang, "currency") : Number(discount) + " " + t(lang, "currency")}</span>
                </div>
                <div className="total-ckeckout final">
                    <span>{t(lang, "total")}</span>
                    {
                        discount == 0?
                        <span className="total-num">{Number(data.total).toFixed(3)} {t(lang, "currency")}</span>
                        :
                        percentage?
                        <span className="total-num">{Number(data.total - (data.total * Number(discount) / 100)).toFixed(3)} {t(lang, "currency")}</span>
                        :
                        <span className="total-num">{Number(data.total - Number(discount)).toFixed(3)} {t(lang, "currency")}</span>
                    }
                </div>
                <button className="btn-addToCart" onClick={handleCheckout}>{t(lang, "confirm_order")}</button>
            </div>
        </div>
    );
}

