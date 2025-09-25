'use client';
import React, { useContext, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/apiConfig';
import smallLogo from '@/public/images/sm-logo.png';
import cartImage from '@/public/images/cart.svg';
import logo from '@/public/images/sm-logo.png';
import { t } from '@/lib/i18n';
import {  useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Loading from '@/src/app/loading';
import { CounterContext } from '@/src/Context/CounterContext';

export default function NavBar() {
    const {cartTotalPrice ,cartCont} = useContext(CounterContext);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [lang, setLang] = useState(() => {
        if (typeof window !== 'undefined') {
            const storedLang = localStorage.getItem('lang');
            if (storedLang === 'ar' || storedLang === 'en') return storedLang;
            localStorage.setItem('lang', 'ar');
            return 'ar';
        }
        return 'ar';
    });
    const [searchData, setSearchData] = useState([]);
    const sendSearchRequest = async () => {
        setLoading(true);
        let inputValue = document.getElementById('search-input').value;
        if (inputValue) {
            setLoading(true);
            document.getElementById('search-input').style.border = 'none';
            try {
                const response = await axios.get(`${API_BASE_URL}/products?keyword=${inputValue}`, {
                    headers: { 'x-localization': lang, },

                });
                let result = response.data.data;
                setSearchData(result);
                setLoading(false);
                if (result.items === 0) {
                    toast.error(lang === 'ar' ? 'لا يوجد بيانات للبحث' : 'No search results found');
                }
            } catch (error) {
                console.error('Error retrieving data:', error);
            }
        } else {
            setLoading(false);
            setSearchData([]);
            document.getElementById('search-input').style.border = '1px solid red';
        }
    };

    return (
            <header style={{ direction: lang === 'en' ? 'ltr' : 'rtl' }}>
                <div className="header-cont">
                    <div className="container">
                        <div className="upper-header">
                            <span className="header-welcome">{t(lang, 'welcome')}</span>
                            <div className="lang-section">
                                
                                <div className="dropdown cat-anchor">
                                    <div className="upper-drop">
                                        <i className="fa-solid fa-globe"></i>
                                        {lang === 'en' ? t(lang, 'language_en') : t(lang, 'language_ar')}
                                        <i className="fa-solid fa-chevron-down"></i>
                                    </div>
                                    <div className="dropdown-content">
                                        <p
                                            className="cat-drop"
                                            onClick={() => {
                                                if (lang !== 'ar') {
                                                    localStorage.setItem('lang', 'ar');
                                                    window.location.reload();
                                                    
                                                }
                                                else {
                                                    toast.error('لغة الموقع الحالية هي العربية');
                                                }
                                            }}
                                        >
                                            {t('ar', 'language_ar')}
                                        </p>
                                        <p
                                            className="cat-drop"
                                            onClick={() => {
                                                if (lang !== 'en') {
                                                    localStorage.setItem('lang', 'en');
                                                    window.location.reload();
                                                }
                                                else {
                                                    toast.error('The current website language is English');
                                                }
                                            }}
                                        >
                                            {t('en', 'language_en')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <figure className="img-logo">
                                <Link href="/">
                                    <Image alt="logo-small" src={smallLogo} />
                                </Link>
                            </figure>
                        </div>
                    </div>

                    <div className="top-header">
                        <div className="container">
                            <div className="nav-header">
                                <figure className="img-logo">
                                    <Link href="/">
                                        <Image alt="logo" src={logo} />
                                    </Link>
                                </figure>
                                <div className="search-section">
                                    <div className="search-form">
                                        <input
                                            className="search-input"
                                            type="text"
                                            placeholder={t(lang, 'search_placeholder')}
                                            id='search-input'

                                            onKeyDown={(e) => { if (e.key === 'Enter') sendSearchRequest(); }}
                                        />
                                        <button className="search-button" onClick={sendSearchRequest}>
                                            <i className="fa-solid fa-magnifying-glass"></i>
                                        </button>
                                    </div>
                                    {
                                        loading ?
                                            <div className="search-data">
                                                <Loading />
                                            </div>

                                            :
                                            searchData.paginate && (
                                                <div className="search-data">
                                                    {searchData?.items?.length > 0 ? (
                                                        searchData.items.map((item, index) => (
                                                            <a href={`/product?id=${item.id}`} key={index} onClick={() => {
                                                                document.getElementById('search-input').value = '';
                                                                setSearchData([]);
                                                                router.push(`/product?id=${item.id}`);
                                                            }}>
                                                                <div className="img">
                                                                    <Image src={item.image} alt='image' width={100} height={100} />
                                                                </div>
                                                                <div className="text">
                                                                    <h2>{item.name}</h2>
                                                                    <h3>{item.price} {t('K.D', 'د.ك')}</h3>
                                                                </div>
                                                            </a>
                                                        ))
                                                    ) : (
                                                        <h4>{t('There are no results', 'لا توجد نتائج')}</h4>
                                                    )}
                                                </div>
                                            )
                                    }
                                </div>
                                <div className="header-icons">
                                   
                                    <Link href="/cart" className="add-to">
                                        <Image alt="cart" src={cartImage} />
                                        <div className="user-info">
                                            <span className="user-anc">{t(lang, 'cart')}</span>
                                            <span>{cartTotalPrice.toFixed(3)} {t(lang, 'currency')}</span>
                                        </div>
                                        <span className="counter">{cartCont?.length || 0}</span>
                                    </Link>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
    );
}
