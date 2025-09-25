import React from 'react';
import { t } from '@/lib/i18n';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductCard({ product, lang }) {
    return (
        <Link href={`/product?id=${product.id}`} className="product-item" key={product.id}>
            <div className="product-by">
                <figure className="product-logo">
                    <Image src={product.store.image} width={1000} height={500} alt={product.store.name} />
                </figure>
                <span>{product.store.name}</span>
            </div>
            <figure className="product-img">
                <Image src={product.image} className="img-fluid" width={1000} height={500} alt={product.name} />
            </figure>
            <div className="product-content">
                <div className="product-name">{product.name}</div>
                <div className="product-rate">
                    {
                        Array.from({ length: 5 }).map((_, index) => (
                            <i key={index} className={`fa-solid fa-star ${Math.round(product.rate) > index ? 'active' : ''}`}></i>

                        ))
                    }
                </div>
                <div className="price-box">
                    <span className="new-price">{product.price} {t(lang, 'currency')}</span>
                    {
                        product.price_before_discount ?
                            <span className="old-price">{product.price_before_discount} {t(lang, 'currency')}</span>
                            : null
                    }
                </div>
            </div>
        </Link>
    );
}
