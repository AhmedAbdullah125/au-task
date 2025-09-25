'use client';
import React, {  useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/apiConfig';
import Hero from './Hero';
import Loading from '@/src/app/loading';
import HomeProDuctsGrid from './HomeProDuctsGrid';
import { t } from '@/lib/i18n';
import HomeCategories from './HomeCategories';
import HomeBrands from './HomeBrands';

export default function HomeWrapper() {

    const [data, setData] = useState(null);
    const [brands,setBrands] = useState(null); 
    const [lang, setLang] = useState(localStorage.getItem('lang') || 'ar');
    const [country, setCountry] = useState(JSON.parse(localStorage.getItem('country')) || 1);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`${API_BASE_URL}/home?country_id=${country.id}`, {
                    headers: {
                        'x-localization': lang,
                        Authorization: `Bearer ${token}`,
                    },
                });
                setData(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error retrieving data:', error);
                throw new Error('Could not get data');
                setLoading(false);
            }
        };
        getData();
    }, [lang]);
    useEffect(() => {
        const getData = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`${API_BASE_URL}/general/brands`, {
                    headers: {
                        'x-localization': lang,
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBrands(response.data.data);
            } catch (error) {
                console.error('Error retrieving data:', error);
                throw new Error('Could not get data');
            }
        };
        getData();
    }, [lang]);
    



    return (
        <>
            {
                loading ? <Loading /> :
                    <>
                        <Hero data={data} />
                        <HomeProDuctsGrid data={data.suggestions} title={t(lang, 'suggestions')}  path="/suggestions" lang={lang} />
                        <HomeCategories data={data.categories} title={t(lang, 'categories')}  path="/category" lang={lang} />
                        <HomeProDuctsGrid data={data.most_sell} title={t(lang, 'most_sell')}  path="/most_sell" lang={lang} />
                        {
                            brands && <HomeBrands data={brands} title={t(lang, 'brands')}  path="/brand" lang={lang} />
                        }
                    </>
            }
        </>
    );
}
