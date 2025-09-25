import React from 'react';
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from 'next/link';
import Image from 'next/image';
import { t } from '@/lib/i18n';
import catImage from '@/public/images/category/01.svg';

export default function HomeBrands({ data, title, path, lang }) {
    return (
        <section className="brands-section" style={{ direction: lang === 'en' ? 'ltr' : 'rtl' }}>
            <div className="container">
                <div className="section-head">
                    <h3 className="section-title">الماركات</h3>
                </div>
                <div className="brands-slider">

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
                                    <Link href="#">
                                        <figure className="brands-figure">
                                            <Image
                                                className="brands-img img-fluid"
                                                alt="image1"
                                                src={item.image}
                                                width={100}
                                                height={100}

                                            />
                                        </figure>
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
