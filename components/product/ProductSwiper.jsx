'use client';
import React, { useState, useEffect } from 'react';
import { Autoplay, Navigation, Pagination, Controller } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from 'next/image';
import { t } from '@/lib/i18n';
import { toast } from 'sonner';
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { toggleNotification } from '@/src/app/product/toggelNotification';


export default function ProductSwiper({ product, lang }) {
    const [bigSwiper, setBigSwiper] = useState(null);
    const [smallSwiper, setSmallSwiper] = useState(null);
    const token = localStorage.getItem('token');
    const [isFavourite, setIsFavourite] = useState(product.is_favourite);
    Fancybox.bind("[data-fancybox]", {
        animated: true,
        showClass: "fancybox-zoomIn",
        hideClass: "fancybox-zoomOut",
        dragToClose: true,
        backdropClick: "close",
        closeButton: "outside",
        placeFocusBack: false,
        Images: { zoom: true, Panzoom: { maxScale: 3, }, },
        Thumbs: { autoStart: false, },
    });
    // Link swipers after both are ready
    useEffect(() => {
        if (bigSwiper && smallSwiper) {
            bigSwiper.controller.control = smallSwiper;
            smallSwiper.controller.control = bigSwiper;
        }
    }, [bigSwiper, smallSwiper]);
    return (
        <div className="product-imgs-cont">
            {/* Big Swiper */}
            <Swiper
                spaceBetween={0}
                slidesPerView={1}
                onSwiper={setBigSwiper}
                loop={true}
                autoplay={true}
                navigation={{ nextEl: `#swiper-btn-leftHero`, prevEl: `#swiper-btn-rightHero`, }}
                pagination={false}
                modules={[Autoplay, Navigation, Pagination, Controller]}
            >
                {product.media.map((img, index) => (
                    <SwiperSlide key={index}>
                        <div className="single-img-container">
                            <a href={img} data-fancybox="gallery" className="single-img">
                                <Image src={img} width={1000} height={500} alt={`Product ${index + 1}`} />
                            </a>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            {/* Thumbnail Swiper */}
            <Swiper
                spaceBetween={8}
                slidesPerView={4}
                onSwiper={setSmallSwiper}
                loop={true}
                autoplay={true}
                className="product-thumbs"
                modules={[Autoplay, Navigation, Pagination, Controller]}
            >
                {product.media.map((img, index) => (
                    <SwiperSlide key={index} onClick={() => bigSwiper?.slideToLoop(index)}>
                        <div className="thumb-cont">
                            <div className="thumb-img">
                                <Image src={img} width={120} height={80} alt={`Thumb ${index + 1}`} />
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            {/* Buttons and status */}
            <div className="product-btn">
                {token ? <button onClick={
                    () => {
                        const fav = isFavourite
                        setIsFavourite(!isFavourite)
                        toggleNotification(product.id, lang ,setIsFavourite ,fav);
                    }
                }><i className={` fa-heart ${isFavourite ? 'active-heart fa-solid' : ' fa-regular'}`} ></i></button> : null}
                {/* copy link data.shareLnk */}
                <button onClick={() => {
                    navigator.clipboard.writeText(product.shareLnk)
                    toast(t(lang, 'Copied'), {
                        duration: 5000,
                        style: { background: '#61A7C6', color: '#fff', fontFamily: 'inherit', fontSize: '16px', padding: '10px', },
                    })
                }}><i className="fa-solid fa-share-nodes"></i></button>
            </div>
            <span className="item-status">{product.qty > 0 ? t(lang, 'available') : t(lang, 'not_available')}</span>
        </div>
    );
}