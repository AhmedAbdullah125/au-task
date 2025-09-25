'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { t } from '@/lib/i18n';
import { logOut } from './logout';
import { API_BASE_URL } from '@/lib/apiConfig';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"

export default function SideData() {
    const pathname = usePathname();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [lang, setLang] = useState(() => {
        if (typeof window !== 'undefined') {
            const storedLang = localStorage.getItem('lang');
            if (storedLang === 'ar' || storedLang === 'en') return storedLang;
            localStorage.setItem('lang', 'ar');
            return 'ar';
        }
        return 'ar';
    });

    useEffect(() => {
        if (pathname.length > 0 && pathname.length > 10) {
        }
        else {
            //scroll to the top
            window.scrollTo(0, 0);
        }
    })
    const handleLogout = () => {
        logOut(API_BASE_URL, setLoading, router, toast);
    };
    return (
        <div className="account-sidebar-cont">
            <div className="account-sidebar">
                <ul className="account-list">
                    <li>
                        <Link href="/profile/account" className={`account-ancor ${pathname == "/profile/account" ? "active" : ""}`}>
                            <i className={`fa-solid fa-angle-${lang == "ar" ? "left" : "right"}`}></i>
                            <span>{t(lang, "my_account")}</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/profile/orders" className={`account-ancor ${pathname == "/profile/orders" ? "active" : ""}`}>
                            <i className={`fa-solid fa-angle-${lang == "ar" ? "left" : "right"}`}></i>
                            <span>{t(lang, "my_orders")}</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/profile/favourites" className={`account-ancor ${pathname == "/profile/favourites" ? "active" : ""}`}>
                            <i className={`fa-solid fa-angle-${lang == "ar" ? "left" : "right"}`}></i>
                            <span>{t(lang, "my_wishlist")}</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/profile/addresses" className={`account-ancor ${pathname == "/profile/addresses" || pathname == "/profile/addaddress" ? "active" : ""}`}>
                            <i className={`fa-solid fa-angle-${lang == "ar" ? "left" : "right"}`}></i>
                            <span>{t(lang, "saved_addresses")}</span>
                        </Link>
                    </li>
                    <li>
                        <AlertDialog >
                            <AlertDialogTrigger asChild>
                                <button href="#" className="account-ancor out" disabled={loading}>
                                    <span style={loading ? { opacity: .3 } : { opacity: 1 }}>{loading ? t(lang, "logging_out") : t(lang, "logout")}</span>
                                </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-center font-light">{t(lang, "log_out_messege")}</AlertDialogTitle>
                                </AlertDialogHeader>
                                <AlertDialogFooter className={"flex flex-col-reverse gap-2 sm:flex-row sm:justify-center sm:space-x-2"}>
                                    <AlertDialogCancel className="m-0">{t(lang, "cancel")}</AlertDialogCancel>
                                    <AlertDialogAction className={"bg-[#C71919]"} onClick={handleLogout}>{t(lang, "log_out")}</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                    </li>
                </ul>
            </div>
        </div>
    );
}
