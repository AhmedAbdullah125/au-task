import React from 'react';
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from 'next/link';
import Image from 'next/image';
import { t } from '@/lib/i18n';
import ProductCard from '../General/ProductCard';

export default function HomeProDuctsGrid({ data ,title ,path,lang}) {    
    return (
        <section className="product-section" style={{ direction: lang === 'en' ? 'ltr' : 'rtl' }}>
            <div className="container">
                <div className="section-head">
                    <h3 className="section-title">{title}</h3>
                    <Link href={path} className="products-link">{t(lang, 'see_all')}</Link>
                </div>
                <Swiper
                    pagination={false}
                    spaceBetween={12}
                    slidesPerView={5}
                    loop={true}
                    autoplay={true}
                    navigation={false}
                    modules={[Autoplay, Navigation, Pagination]}
                    breakpoints={{
                        1400: {
                            slidesPerView: 5,
                        },
                        1200: {
                            slidesPerView: 4,
                        },
                        992: {
                            slidesPerView: 3,
                        },
                        768: {
                            slidesPerView: 2,
                        },
                        200: {
                            slidesPerView: 2,
                        },
                    }}
                >
                    {
                        data.map((item) =>
                            <SwiperSlide key={item.id}>
                                <ProductCard product={item} lang={lang} />
                            </SwiperSlide>
                        )
                    }
                </Swiper>
            </div>
        </section>
    );
}
