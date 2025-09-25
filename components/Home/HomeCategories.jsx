import React from 'react';
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from 'next/image';
import catImage from '@/public/images/category/01.svg';
import Link from 'next/link';

export default function HomeCategories({ data, title, path, lang }) {
    return (
        <section className="category-section" style={{ direction: lang === 'en' ? 'ltr' : 'rtl' }}>
            <div className="container">
                <div className="section-head">
                    <h3 className="section-title">{title}</h3>
                </div>
                <div className="category-slider">

                <Swiper
                    pagination={false}
                    spaceBetween={12}
                    slidesPerView={5}
                    loop={true}
                    autoplay={true}
                    navigation={{
                        nextEl: `#swiper-btn-left${title}`,
                        prevEl: `#swiper-btn-right${title}`,
                    }}
                    modules={[Autoplay, Navigation, Pagination]}
                    breakpoints={{
                        1400: {
                            slidesPerView: 5,
                        },
                        1200: {
                            slidesPerView: 5,
                        },
                        992: {
                            slidesPerView: 2,
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
                                <Link href={`${path}?id=${item.id}&name=${item.name}`} className="category-item">
                                    <figure className="category-figure">
                                        <Image className="category-img img-fluid" alt={item.name} src={item.image} width={100} height={100} />
                                    </figure>
                                    <div className="category-content">
                                        <figure>
                                            <Image src={catImage} alt="category" width={50} height={50} />
                                        </figure>
                                        <span>{item.name}</span>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        )
                    }
                </Swiper>
                <div className="swiper-btn-prev swiper-btn" id={`swiper-btn-right${title}`}>
                    <i className="fa-solid fa-chevron-right"></i>
                </div>
                <div className="swiper-btn-next swiper-btn" id={`swiper-btn-left2${title}`}>
                    <i className="fa-solid fa-chevron-left"></i>
                </div>
                </div>
            </div>
        </section>
    );
}
