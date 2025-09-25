'use client'
import BreadCrumb from '@/components/General/BreadCrumb';
import SideData from '@/components/profile/SideData';
import { t } from '@/lib/i18n';
import React, { useState } from 'react'

export default function Profile({ children }) {

    const [lang, setLang] = useState(() => {
        if (typeof window !== 'undefined') {
            const storedLang = localStorage.getItem('lang');
            if (storedLang === 'ar' || storedLang === 'en') return storedLang;
            localStorage.setItem('lang', 'ar');
            return 'ar';
        }
        return 'ar';
    });
    return (
        <section className="content-section" style={{ direction: lang == "ar" ? "rtl" : "ltr" }}>
            <div className="container">
                <BreadCrumb first={t(lang, 'my_account')} firstLink='/profile' lang={lang} />
                <div className="account-cont">
                    <SideData />
                    <div className="profile-content" id='profile-content'>
                        {children}
                    </div>
                </div>
            </div>
        </section >
    )
}
