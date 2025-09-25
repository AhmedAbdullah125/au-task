import React from 'react';
import ProductCard from '../General/ProductCard';
import Pagination from '../General/Pagination';
import emptyImg from '@/public/images/empty.webp'
import Image from 'next/image';

export default function ProductsGrid({ data, lang, setPage }) {

    return (
        <div className="col-lg-9">


            {
                data.items.length > 0 ?
                    <div className="items-grid">

                        {
                            data.items.map((product) => (
                                <ProductCard product={product} key={product.id} lang={lang} />
                            ))
                        }
                    </div>
                    :
                    <div className="empty-img-cont flex justify-center items-center">
                        <Image src={emptyImg} alt="empty" />
                    </div>}



            <Pagination data={data} setPage={setPage} />
        </div>
    );
}

