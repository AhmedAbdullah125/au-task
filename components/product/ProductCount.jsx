import React, { useContext, useEffect, useState } from 'react';
import { t } from '@/lib/i18n';
import { addToCart } from './addToCart';
import { toast } from 'sonner';
import { CounterContext } from '@/src/Context/CounterContext';
export default function ProductCount({ product, lang, count, setCount, options, setOptions }) {
    const token = localStorage.getItem('token');
    const [totalPrices, setTotalPrices] = useState(Number(product.price) * count.toFixed(2));
    const {cartTrigger, setCartTrigger} = useContext(CounterContext);
    //total options prices
    console.log(product);
    
    useEffect(() => {
        let prices = 0
        if (options.length === 0) {
            setTotalPrices((Number(product.price) * count).toFixed(2))
        }
        for (let i = 0; i < options.length; i++) {
            prices += Number(options[i].option_value_price);
            setTotalPrices(((Number( prices)) * count).toFixed(2))
        }
    }, [options, count])
    return (
        <div className="product-total-box">
            <div className="total-price-cont">
                <h4 className="total-head">{t(lang, 'total')}</h4>
                <div className="total-price">{Number(totalPrices).toFixed(2)} {t(lang, 'currency')}</div>
            </div>
            <div className="total-price-cont border-0">
                <div className="counter-head">{t(lang, 'quantity')}</div>
                <div className="item-qty">
                    <button className="qty-control qty-plus bd-0" onClick={() => {
                        if (count >= product.purchase_limit ) {
                            toast(t(lang, 'purchase_limit_reached'), {
                                style: {
                                    borderColor: "#28a745",
                                    boxShadow: '0px 0px 10px rgba(40, 167, 69, .5)',
                                }
                            })
                            return
                        }
                        if (count >= product.qty) {
                            toast(lang=="ar" ? `الكميه الموجودة في المخزون ${product.qty}` : `There are ${product.qty} available in stock`, {
                                style: {
                                    borderColor: "#28a745",
                                    boxShadow: '0px 0px 10px rgba(40, 167, 69, .5)',
                                }
                            })
                            return
                            
                        }
                        setCount(count + 1)
                    }}>
                        <i className="fas fa-plus-circle"></i>
                    </button>
                    <button className="qty-control qty-minus bd-0" onClick={() => {
                        if (count <= 1) {
                            return;
                        }
                        setCount(count - 1)
                    }}>
                        <i className="fas fa-minus-circle"></i>
                    </button>
                    <span className="qty-input">{count}</span>
                </div>
            </div>
            <button className="btn-addToCart" onClick={
                () => {
                    if (!token) {
                        toast(t(lang, 'login_to_add_to_cart'), {
                            style: {
                                borderColor: "#28a745",
                                boxShadow: '0px 0px 10px rgba(40, 167, 69, .5)',
                            },
                        });
                        return
                    }
                    addToCart(product.id, options, count, lang, setCount, setOptions, setCartTrigger, cartTrigger); 
                }
            }>{t(lang, 'add_to_cart')}</button>
        </div>
    );
}
