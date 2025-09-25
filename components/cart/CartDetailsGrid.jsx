'use client';
import React, {  useContext, useEffect, useState } from 'react';
import { t } from '@/lib/i18n';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select"
import Image from 'next/image';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { updateCartItemQty } from './updateCartItemQty';
import { toggleNotification } from '@/src/app/product/toggelNotification';
import { removeCartItem } from './removeCartItem';
import { useRouter } from 'next/navigation';
import { CounterContext } from '@/src/Context/CounterContext';
export default function CartDetailsGrid({ data, lang, setChanges, changes, setLoading }) {
    const token = localStorage.getItem('token');
    const [isFavourite, setIsFavourite] = useState(data.items[0].product.is_favourite);
    const [favourites , setFavourites] = useState([]);
    const router =useRouter();
    const {cartTrigger, setCartTrigger} = useContext(CounterContext);

    useEffect(() => {
        //getting favourates items
        for(let i = 0 ; i < data.items.length ; i++){
            if(data.items[i].product.is_favourite && !favourites.includes(data.items[i].product.id) ){
                setFavourites([...favourites , data.items[i].product.id])
            }
        }
    })
    
    return (
            <>
            <div className="right-cart">
                <div className="cart-item">
                    <div className="product-by">
                        <figure className="product-logo">
                            <Image src={data.store.image} alt="logo" width={1000} height={500} />
                        </figure>
                        <span>{data.store.name}</span>
                    </div>
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
                                        <Select onValueChange={(value) => {
                                            if (!token) {
                                                toast(t(lang, 'login_to_add_to_cart'), {
                                                    style: {
                                                        borderColor: "#28a745",
                                                        boxShadow: '0px 0px 10px rgba(40, 167, 69, .5)',
                                                    },
                                                });
                                                return
                                            }
                                            updateCartItemQty(data.id, product.id, value, lang, setChanges, changes, setLoading);
                                        }} >
                                            <SelectTrigger className="w-[64px] bg-[#E3DCDC] rounded-sm text-[#1E1E1E] font-light">
                                                <SelectValue placeholder={product.qty} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>{t(lang, "count")}</SelectLabel>
                                                    {
                                                        Array.from({ length: product.product.purchase_limit }, (_, index) => (
                                                            <SelectItem value={index + 1} key={index}>{index + 1}</SelectItem>
                                                        ))
                                                    }
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <span>{product.total} {t(lang, 'currency')}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="cart-btn-cont">
                                <AlertDialog >
                                    <AlertDialogTrigger asChild>
                                        <button>
                                            <i className="fa-regular fa-trash-can"></i><span>حذف</span>
                                        </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="text-center font-light">{t(lang, "delete_product")}</AlertDialogTitle>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter className={"flex flex-col-reverse gap-2 sm:flex-row sm:justify-center sm:space-x-2"}>
                                            <AlertDialogCancel className="m-0">{lang == "en" ? "Cancel" : "إلغاء"}</AlertDialogCancel>
                                            <AlertDialogAction className={"bg-[#C71919]"} onClick={() => {
                                               removeCartItem(data.id, product.id, lang, setChanges, changes, setLoading,data.items.length,router,cartTrigger,setCartTrigger);
                                                
                                            }}>{lang == "en" ? "Remove" : "حذف"}</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                                <button onClick={
                                    () => {
                                        if(favourites.includes(product.product.id)){
                                            setFavourites(favourites.filter((id) => id !== product.product.id))
                                        }
                                        else{
                                            setFavourites([...favourites , product.product.id])
                                        }
                                        const fav = product.product.is_favourite
                                        toggleNotification(product.product.id, lang, setIsFavourite, fav);
                                    }
                                }>
                                    <i className={` fa-heart ${favourites.includes(product.product.id) ? 'fa-solid active' : 'fa-regular'}`}></i><span>{t(lang, "add_to_wishlist")}</span>
                                </button>
                            </div>
                        </div>
                    ))
                }

            </div>
          
            </>
    );
}

