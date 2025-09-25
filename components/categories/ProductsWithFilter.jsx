'use client';
import React, { useEffect, useState } from 'react';
import Filter from './Filter';
import Loading from '@/src/app/loading';
import ProductsGrid from './ProductsGrid';

export default function ProductsWithFilter({ loading, data, lang, setSortBy, sortBy, brand, setBrand, tags, setTags, setPage, category, setCategory, prices ,setPrices }) {

    return (
        <div className="row">
            <Filter data={data} lang={lang} setSortBy={setSortBy} sortBy={sortBy} brand={brand} setBrand={setBrand} tags={tags} setTags={setTags} category={category} setCategory={setCategory}  prices={prices} setPrices={setPrices} />
            {
                loading ?
                    <div className="col-lg-9">
                        <Loading />
                    </div> :
                    <ProductsGrid data={data} lang={lang} setPage={setPage} />
            }
        </div>
    );
}

