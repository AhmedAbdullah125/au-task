import React from 'react';
import { t } from '@/lib/i18n';
import Image from 'next/image';
import shipimg from '@/public/images/ship-img.png';
export default function ShippingWays({ data, lang, selectedShippingWay, setSelectedShippingWay }) {
    
    return (
        <>
            <h3 className="cart-title">{t(lang, "shipping")}</h3>
            <div className="cart-weight">{t(lang, "total_weight")} : 0.34 {t(lang, "grams")}</div>

            <div className="checkout-cont">
                <div className="payment-cont">
                    <div className="form-group">
                        <div className="check-group">
                            <div className="check-width">
                                <label className="check-label">
                                    <span className="payment-radio">
                                        <input type="radio" name="place" checked={selectedShippingWay === 1} onChange={() => setSelectedShippingWay(1)} />
                                        <div className="ship-cont">
                                            <figure>
                                                <Image src={shipimg} alt="ship-logo" />
                                            </figure>
                                            <span className="check-text" ><span>1 يونيو - 5 يونيو</span>
                                                <span className="cart-ship">3 {t(lang,"currency")} <span>{t(lang,"shipping_cost")}</span></span></span>
                                        </div>
                                        <span className="checkmark"></span>
                                    </span>
                                </label>
                            </div>
                            <div className="check-width">
                                <label className="check-label">
                                    <span className="payment-radio">
                                        <input type="radio" name="place" checked={selectedShippingWay === 2} onChange={() => setSelectedShippingWay(2)} />
                                        <div className="ship-cont">
                                            <figure>
                                                <Image src={shipimg} alt="ship-logo" />
                                            </figure>
                                            <span className="check-text" ><span>1 يونيو - 5 يونيو</span>
                                                <span className="cart-ship" >3 {t(lang,"currency")} <span>{t(lang,"shipping_cost")}</span></span ></span >
                                        </div>
                                        <span className="checkmark"></span>
                                    </span>
                                </label>
                            </div>
                            <div className="check-width">
                                <label className="check-label">
                                    <span className="payment-radio">
                                        <input type="radio" name="place" checked={selectedShippingWay === 3} onChange={() => setSelectedShippingWay(3)} />
                                        <div className="ship-cont">
                                            <figure>
                                                <Image src={shipimg} alt="ship-logo" />
                                            </figure>
                                            <span className="check-text" ><span>1 يونيو - 5 يونيو</span>
                                                <span className="cart-ship" >3 {t(lang,"currency")} <span>{t(lang,"shipping_cost")}</span></span ></span >
                                        </div>
                                        <span className="checkmark"></span>
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

