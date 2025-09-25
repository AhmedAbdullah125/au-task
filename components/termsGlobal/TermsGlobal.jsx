'use client';
import React, { useEffect, useState } from 'react';
import BreadCrumb from '../General/BreadCrumb';
import termsImg from '@/public/images/terms.svg';
import policyImg from '@/public/images/policy.svg';
import Image from 'next/image';
import Loading from '@/src/app/loading';
import { t } from '@/lib/i18n';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/apiConfig';
export default function TermsGlobal({ title }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lang, setLang] = useState(() => {
        if (typeof window !== 'undefined') {
            const storedLang = localStorage.getItem('lang');
            if (storedLang === 'ar' || storedLang === 'en') return storedLang;
            localStorage.setItem('lang', 'ar');
            return 'ar';
        } return 'ar';
    });
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/general/setting/${title}`, { headers: { 'x-localization': lang, }, });
                const data = response.data.data;
                setData(data);
            } catch (error) {
                console.error('Error retrieving countries:', error);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, [lang])

    return (
        <section className="content-section" style={{ direction: lang == "ar" ? "rtl" : "ltr" }}>
            <div className="container">
                <BreadCrumb first={t(lang, title)} firstLink={`/${title}`} lang={lang} />
                {
                    loading ? <Loading /> :
                        <div className="terms-container"> <div className="terms-content"><p className="content-pargh">{data} </p> </div>
                            <figure className="terms-img"><Image src={title == 'terms' ? termsImg : title == 'privacy' ? policyImg : ""} alt={t(lang, title)} /> </figure>
                        </div>
                }
            </div>
        </section>
    );
}
