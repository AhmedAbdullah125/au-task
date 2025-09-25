import React from 'react';
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from 'next/link';
import Image from 'next/image';

export default function Hero({ data }) {
    return (
        <div className="hero">
            <main className="main-slider">
                <div className="container relative">
                    <Swiper
                        pagination={{ clickable: true }}
                        spaceBetween={0}
                        slidesPerView={1}
                        loop={true}
                        autoplay={true}
                        navigation={{
                            nextEl: `#swiper-btn-leftHero`,
                            prevEl: `#swiper-btn-rightHero`,
                        }}
                        modules={[Autoplay, Navigation, Pagination]}
                        breakpoints={{
                            1400: {
                                slidesPerView: 1,
                            },
                        }}
                    >
                        {
                            data.banners.map((img) =>
                              
                                    <SwiperSlide key={img.id}>
                                        <div className="main">
                                            <Link href="#!" className="pro-img">
                                                <Image src={img.image} className="img-fluid" width={1000} height={500} alt="test" />
                                            </Link>
                                        </div>
                                    </SwiperSlide>
                            )
                        }
                    </Swiper>
                    <div className="swiper-btn-prev swiper-btn" id="swiper-btn-rightHero">
                        <i className="fa-solid fa-chevron-right"></i>
                    </div>
                    <div  className="swiper-btn-next swiper-btn" id="swiper-btn-leftHero">
                    <i className="fa-solid fa-chevron-left"></i>
                    </div>
                </div>
            </main>
        </div>
    );
}
