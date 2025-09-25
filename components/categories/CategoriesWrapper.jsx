'use client';
import React, { useEffect, useState } from 'react';
import BreadCrumb from '../General/BreadCrumb';
import { t } from '@/lib/i18n';
import ProductsWithFilter from './ProductsWithFilter';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/apiConfig';
import { useSearchParams } from 'next/navigation';

export default function CategoriesWrapper({ type }) {
    const [lang, setLang] = useState(localStorage.getItem('lang') || 'ar');
    const [country, setCountry] = useState(JSON.parse(localStorage.getItem('country')) || 1);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState(null);
    const [brand, setBrand] = useState(null);
    const [page, setPage] = useState(1);
    const [prices, setPrices] = useState([]);
    const searchParams = useSearchParams();
    const categoryId = searchParams.get('id');
    const tagId = searchParams.get('tag');
    const categoryName = searchParams.get('name');
    const [tags, setTags] = useState(tagId ? Number(tagId) : null);
    const [category, setCategory] = useState(categoryId ? Number(categoryId) : null);

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
    })
    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(API_BASE_URL + `/products?country_id=${country.id}${type ? `&type=${type}` : ''}${prices.length > 0 ? `&prices=${prices[0]},${prices[1]}` : ''}&order_by=${sortBy}${category ? `&categories[]=${category}` : categoryId ? `&categories[]=${categoryId}` : ''}${brand ? `&brand_id=${brand}` : ''}${tags ? `&tags[]=${tags}` : ''}&page=${page}`, {
                    headers: {
                        'x-localization': lang,
                    },
                });
                let data = response.data.data;
                setData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error retrieving data:', error);
                throw new Error('Could not get data');
                setLoading(false);
            }
        }
        getData();
    }, [lang, sortBy, type, brand, tags, page, category, prices]);
    return (
        <section className="content-section" style={{ direction: lang === 'en' ? 'ltr' : 'rtl' }}>
            <div className="container">
                <BreadCrumb
                    first={type ?
                        type === 'suggestions' ? t(lang, 'suggestions') : type == "most_sell" ? t(lang, 'most_sell') : ""
                        :
                        categoryId || tagId ? categoryName :
                            ""
                    }
                    firstLink={
                        type ? type === 'suggestions' ? '/suggestions' : ''
                            : categoryId ? `/category?id=${categoryId}&name=${categoryName}` :
                                tagId ? `/category?tag=${tagId}&name=${categoryName}` : ''}
                    lang={lang} />
                <ProductsWithFilter loading={loading} data={data} lang={lang} setSortBy={setSortBy} sortBy={sortBy} brand={brand} setBrand={setBrand} tags={tags} setTags={setTags} setPage={setPage} category={category} setCategory={setCategory} prices={prices} setPrices={setPrices} />
            </div>
        </section>
    );
}

