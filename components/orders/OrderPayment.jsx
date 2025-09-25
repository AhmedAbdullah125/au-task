import React from 'react';
import Image from 'next/image';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"

export default function OrderPayment({ data, lang, t }) {

    return (
        <div className="left-cart">
            <h3 className="cart-title">{t(lang, "order_summary")}</h3>
            <div className="product-total-box">
                <div className="total-ckeckout">
                    <span>{t(lang, "subtotal")}</span>
                    <span className="total-num">{data.subtotal} {t(lang, "currency")}</span>
                </div>
                <div className="total-ckeckout">
                    <span>{t(lang, "shipping")}</span>
                    <span className="total-num">{data.shipment_fee} {t(lang, "currency")}</span>
                </div>
                <div className="total-ckeckout red">
                    <span>{t(lang, "discount")}</span>
                    <span className="total-num">{data.discount} {t(lang, "currency")}</span>
                </div>
                <div className="total-ckeckout final">
                    <span>{t(lang, "total")}</span>
                    <span className="total-num">{data.total} {t(lang, "currency")}</span>
                </div>
                <AlertDialog className="relative max-w-[700px]">
                    <AlertDialogTrigger asChild>
                        <button className="btn-addToCart" data-bs-toggle="modal" data-bs-target="#trackModal">
                            {t(lang, "track")}
                        </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent
                        className="sm:rounded-[44px] rounded-[20px] max-w-[900px] p-0 overflow-hidden m-0 gap-0 "
                        style={{ direction: lang === "ar" ? "rtl" : "ltr" }}
                    >
                        <AlertDialogHeader >
                            <AlertDialogTitle >
                                <div className="modal-dialog track-model">
                                    <div className="modal-content">
                                        <h3 className="model-title">{t(lang, "track")}</h3>
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
                                        <div className="flex-in-mobile">
                                        <div className="order-progress">
                                            <div className={`order-step ${data.logs.length >=1 ? "done" : ""}`}>
                                                <div className="step-icon">
                                                    <i className="fas fa-check"></i>
                                                </div>
                                                <span className="step-name">{t(lang, "order_placed")}</span>
                                                
                                            </div>
                                            <div className={`order-step ${data.logs.length >=2 ? "done" : ""}`}>
                                                <div className="step-icon">
                                                    <i className="fas fa-check"></i>
                                                </div>
                                                <span className="step-name"> {t(lang, "order_prepared")}</span>
                                            </div>
                                            <div className={`order-step ${data.logs.length >=3 ? "done" : ""}`}>
                                                <div className="step-icon">
                                                    <i className="fas fa-check"></i>
                                                </div>
                                                <span className="step-name">{t(lang, "order_is_shipping")}</span>
                                            </div>
                                            <div className={`order-step ${data.logs.length >=4 ? "done" : ""}`}>
                                                <div className="step-icon">
                                                    <i className="fas fa-check"></i>
                                                </div>
                                                <span className="step-name">{t(lang, "order_shipped")}</span>
                                            </div>
                                        </div>
                                        <div className="order-progress order-progress-g">
                                            
                                        {
                                            data.logs.map((log,index) => (
                                                <div className="step-time" key={index}>{log.date}</div>
                                            ))
                                        }
                                        </div>
                                        </div>
                                    </div>
                                </div> 
                            </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-center sm:space-x-2 close-download-cont mb-2">
                            <AlertDialogCancel className="mt-2 sm:mt-0 p-0 border-0 outline-none shadow-none bg-transparent absolute close-dialog top-5 start-5">
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </div>
        </div>
    );
}