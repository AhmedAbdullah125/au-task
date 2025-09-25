'use client';
import React from 'react';
import Hero from './Hero';
import HomeProDuctsGrid from './HomeProDuctsGrid';
import { t } from '@/lib/i18n';
import HomeCategories from './HomeCategories';
import HomeBrands from './HomeBrands';
import data from '@/src/data/homeData';


export default function HomeWrapper() {

   
    const lang = localStorage.getItem('lang') || 'ar';

    return (

        <>
            <Hero data={data} />
            <HomeProDuctsGrid data={data.suggestions} title={t(lang, 'suggestions')} path="/suggestions" lang={lang} />
            <HomeProDuctsGrid data={data.most_sell} title={t(lang, 'most_sell')} path="/most_sell" lang={lang} />
        </>
    );
}
