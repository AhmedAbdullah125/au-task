import React, { useState } from 'react';
import OrdersDetails from '@/components/orders/OrdersDetails';
import Image from 'next/image';
import { t } from '@/lib/i18n';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { API_BASE_URL } from '@/lib/apiConfig';
import { review } from './reviews';
import { toast } from 'sonner';
import Link from 'next/link';

export default function OrderItems({ data, lang, t, setLoading }) {
    const [rating, setRating] = useState(null);
    const [comment, setComment] = useState("");

    const [hover, setHover] = useState(0);   // hover preview
    const handleSubmit = async ({ productId, rating, comment, }) => {
        const data = { id: productId, feedback: comment, rate: rating };
        await review(API_BASE_URL, data, setLoading, lang);
    };

    return (
        <>
            {
                data.items.map((product) => (
                    <div className="cart-box" key={product.id}>
                        <div className="cart-flex">
                            <Link href={`/product?id=${product.product.id}`} className='block'>
                                <figure>
                                    <img src={product.product.image} alt="product" />
                                </figure>
                            </Link>
                            <div className="product-container">
                                <Link href={`/product?id=${product.product.id}`} className='block'>
                                    <div className="product-name">{product.product.name}</div>
                                </Link>
                                <div className="order-item-total">
                                    <div className="product-detail-flex flex-col">
                                        {
                                            product.options.map((option, index) => (
                                                <div className="product-weight" key={index}>{option.option} : {option.value}</div>
                                            ))
                                        }
                                    </div>
                                    <div className="order-total">{product.total} {t(lang, "currency")}</div>
                                </div>
                            </div>
                        </div>
                        {
                            data.status == "delivered" ?
                                <AlertDialog className="relative">
                                    <AlertDialogTrigger asChild>
                                        <button className="rate-btn">
                                            <span>{t(lang, "order_rate")}</span>
                                            <i className="fa-solid fa-angle-left"></i>
                                        </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent
                                        className="sm:rounded-[44px] rounded-[20px]"
                                        style={{ direction: lang === "ar" ? "rtl" : "ltr" }}
                                    >
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                <h3 className="model-title">تقييم المنتج</h3>
                                                <form onSubmit={(e) => e.preventDefault()}>
                                                    <div className="rating">
                                                        {[1, 2, 3, 4, 5].map((num) => (
                                                            <i
                                                                key={num}
                                                                className={`fa-solid fa-star rate-image ${num <= (hover || rating) ? "active" : ""
                                                                    }`}
                                                                onClick={() => setRating(num)}
                                                                onMouseEnter={() => setHover(num)}
                                                                onMouseLeave={() => setHover(0)}
                                                            ></i>
                                                        ))}
                                                    </div>
                                                    <div className="form-group">
                                                        <textarea placeholder="اكتب تعليقك هنا" className="form-input" value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                                                    </div>
                                                </form>
                                            </AlertDialogTitle>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-center sm:space-x-2 close-download-cont mb-2">
                                            <AlertDialogCancel className="mt-2 sm:mt-0 p-0 border-0 outline-none shadow-none bg-transparent absolute close-dialog top-5 start-5">
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                className="btn-addToCart"
                                                onClick={() => {
                                                    if (rating && comment.length > 3) {
                                                        handleSubmit({
                                                            productId: product.product.id,
                                                            rating: rating,
                                                            comment: comment,
                                                        });
                                                    }
                                                    else {
                                                        toast.error(t(lang, "rate_error"));
                                                    }
                                                }}
                                            >
                                                {t(lang, "send_rate")}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                                : null
                        }
                    </div>

                ))
            }
        </>
    );
}