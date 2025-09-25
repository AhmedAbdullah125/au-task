'use client';
import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ProfileDataContext } from '@/src/Context/ProfileContext';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/apiConfig';
import flag from '@/public/images/flag.svg';
import smallLogo from '@/public/images/sm-logo.svg';
import cartImage from '@/public/images/cart.svg';
import logo from '@/public/images/logo.svg';
import { t } from '@/lib/i18n';
import { usePathname, useRouter } from 'next/navigation';
import { logOut } from '../profile/logout';
import { toast } from 'sonner';
import Loading from '@/src/app/loading';
import { CounterContext } from '@/src/Context/CounterContext';

export default function NavBar() {
    const { data } = useContext(ProfileDataContext);
    const {cartTotalPrice ,cartCont} = useContext(CounterContext);
    const token = localStorage.getItem('token');
    const [countryData, setCountryData] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [selectedCountry, setSelectedCountry] = useState(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('country');
            return stored ? JSON.parse(stored) : null;
        }
        return null;
    });
    const handleLogout = () => {
        logOut(API_BASE_URL, setLoading, router, toast);
    };

    const [lang, setLang] = useState(() => {
        if (typeof window !== 'undefined') {
            const storedLang = localStorage.getItem('lang');
            if (storedLang === 'ar' || storedLang === 'en') return storedLang;
            localStorage.setItem('lang', 'ar');
            return 'ar';
        }
        return 'ar';
    });
    const pathname = usePathname();

    useEffect(() => {
        const getCountries = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/general/countries`, { headers: { 'x-localization': lang, }, });
                const countries = response.data.data;
                setCountryData(countries);
                if (!localStorage.getItem('country')) {
                    const defaultCountry = countries[0];
                    setSelectedCountry(defaultCountry);
                    localStorage.setItem('country', JSON.stringify(defaultCountry));
                }
            } catch (error) {
                console.error('Error retrieving countries:', error);
            } finally {
                setLoading(false);
            }
        };
        getCountries();
    }, [lang]);
    //get categories 
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        const getCategories = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/general/categories`, { headers: { 'x-localization': lang, }, });
                const categories = response.data.data;
                setCategories(categories);
            } catch (error) {
                console.error('Error retrieving categories:', error);
            }
        };
        getCategories();
    }, [lang]);
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
        <>
            <header style={{ direction: lang === 'en' ? 'ltr' : 'rtl' }}>
                <div className="header-cont">
                    <div className="container">
                        <div className="upper-header">
                            <span className="header-welcome">{t(lang, 'welcome')}</span>
                            <div className="lang-section">
                                <div className="dropdown cat-anchor">

                                    {countryData.length > 0 && (
                                        <>
                                            <div className="upper-drop">
                                                <Image alt="flag" src={selectedCountry?.image || flag} width={10} height={5} />
                                                {`${t(lang, 'shipping_to')} ${countryData.find((country) => country.id === selectedCountry?.id)?.name || ''}`}
                                                <i className="fa-solid fa-chevron-down"></i>
                                            </div>
                                            <div className="dropdown-content">
                                                {countryData.map((country) => (
                                                    <button
                                                        className="cat-drop"
                                                        key={country.id} onClick={() => {
                                                            setSelectedCountry(country);
                                                            localStorage.setItem('country', JSON.stringify(country));
                                                            window.location.reload();
                                                        }}
                                                    >
                                                        {country.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                                <span className="line">|</span>
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
                                    <div className="dropdown cat-anchor">
                                        <div className="add-to">
                                            <div className="user-cont">
                                                <Link href="/profile">
                                                    {
                                                        data?.image ? <Image alt="user" src={data.image} width={30} height={30} /> : <i className="fa-solid fa-user"></i>
                                                    }
                                                </Link>
                                                {
                                                    token ?
                                                        <div className="user-info">
                                                            {data ? <span>{t(lang, 'hello_user')} {data.name}</span> : null}
                                                            <span className="user-anc">
                                                                {t(lang, 'account')}
                                                                <i className="fa-solid fa-chevron-down"></i>
                                                            </span>
                                                        </div>
                                                        : null
                                                }
                                            </div>
                                            {
                                                token ?
                                                    <div className="dropdown-content">
                                                        <Link className="cat-drop" href="/profile/account">
                                                            {t(lang, 'my_account')}
                                                        </Link>
                                                        <Link className="cat-drop" href="/profile/orders">
                                                            {t(lang, 'my_orders')}
                                                        </Link>
                                                        <Link className="cat-drop" href="/profile/favourites">
                                                            {t(lang, 'my_wishlist')}
                                                        </Link>
                                                        <Link className="cat-drop" href="/profile/addresses">
                                                            {t(lang, 'saved_addresses')}
                                                        </Link>

                                                        <button className="cat-drop" onClick={handleLogout} >
                                                            {t(lang, 'logout')}
                                                        </button>
                                                    </div>
                                                    : null
                                            }
                                        </div>
                                    </div>
                                    <Link href="/cart" className="add-to">
                                        <Image alt="cart" src={cartImage} />
                                        <div className="user-info">
                                            <span className="user-anc">{t(lang, 'cart')}</span>
                                            <span>{cartTotalPrice.toFixed(3)} {t(lang, 'currency')}</span>
                                        </div>
                                        <span className="counter">{cartCont?.length || 0}</span>
                                    </Link>
                                    <div className="show-icons">
                                        <Link className="menu-bars fixall" id="menu-id" href="#!">
                                            <span className="bars open-bars"></span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {
                        categories?.length > 0 && pathname !== '/category' &&
                        <nav>
                            <div className="container">
                                <div className="navgition">
                                    <div className={lang === 'ar' ? `blur-start` : `blur-end`}></div>
                                    <ul className="big-menu list-unstyled">
                                        {
                                            categories.map((category) => (
                                                <li className="cat-li" key={category.id}>
                                                    <a href={`/category?id=${category.id}&name=${category.name}`} className="cat-anchor">
                                                        {category.name}
                                                    </a>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </div>
                        </nav>
                    }
                </div>
            </header>

            <div className="menu-bar">
                <div>
                    <Link href="/" className="active">
                        <i className="fa-solid fa-house"></i>
                        <span>الرئيسية</span>
                    </Link>
                </div>
                {/* <div>
                    <Link href="#">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <span>استكشف</span>
                    </Link>
                </div> */}
                <div>
                    <Link href="/cart" className="cart-icon">
                        <Image src={cartImage} alt="icon" />
                    </Link>
                </div>
                {/* <div>
                    <Link href="#">
                        <i className="fa-solid fa-award"></i>
                        <span>الماركات</span>
                    </Link>
                </div> */}
                <div>
                    <Link href="/profile">
                        <i className="fa-solid fa-user"></i>
                        <span>الحساب</span>
                    </Link>
                </div>
            </div>
        </>
    );
}
