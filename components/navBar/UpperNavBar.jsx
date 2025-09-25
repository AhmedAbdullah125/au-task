'use client'
import React, { useEffect, useState } from 'react'
import global from '@/app/assets/global.svg'
import Image from 'next/image'

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import axios from 'axios'
import { API_BASE_URL } from '@/lib/apiConfig'
export default function UpperNavBar() {
    let [lang, setLang] = useState( localStorage.getItem('lang') || 'ar');
    const [countryData, setCountryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCountry , setSelectedCountry] = useState('');



    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('lang') === 'ar' || localStorage.getItem('lang') === 'en') {
                setLang(localStorage.getItem('lang'));
            }
            else {
                localStorage.setItem('lang', 'ar');
                setLang('ar');
            }
        }
        const getCountries = async () => {
            try {
                const response = await axios.get(API_BASE_URL + `/general/countries`, {
                    headers: {
                        'x-localization': lang,
                    },
                });
                setCountryData(response.data.data);
            } catch (error) {
                console.error('Error retrieving addresses:', error);
            } finally {
                setLoading(false);
            }
        }
        getCountries();

    }, []);
    return (
        <div className="container" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            {
                loading ? null :
                    <div className='upper'>
                        <span className='welcomeSpan'>{lang === 'ar' ? 'مرحباً بك في موقع بي ثري ' : 'Welcome to B3 App'}</span>
                        <div className="right-side">
                            <Select onValueChange={(e) => {
                                setSelectedCountry(e);
                             }} defaultValue={String(countryData[0].id)}
                            >
                                <SelectTrigger className="w-auto"
                                    style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
                                >
                                    <Image src={countryData[0].image} className='country-img' alt='global' width={20} height={15}></Image>
                                    <span>{lang =='ar' ? 'شحن إلي ' : 'Ship to '}</span>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                       {
                                        countryData.map((item, index) => 
                                            <SelectItem value={String(item.id)} className='text-xs font-light text-[#1E1E1E]' key={index}>{item.name}</SelectItem>
                                        )
                                       }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <span className='font14-400 hafgez'>|</span>
                            <Select onValueChange={(e) => {
                                localStorage.setItem('lang', e);
                                window.location.reload();
                            }} defaultValue={localStorage.getItem('lang')}
                            >
                                <SelectTrigger className="w-auto"
                                    style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
                                >
                                    <Image src={global} alt='global'></Image>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="ar" className='text-xs font-light text-[#1E1E1E]'>عربي</SelectItem>
                                        <SelectItem value="en" className='text-xs font-light text-[#1E1E1E]'>EN</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
            }
        </div>
    )
}
