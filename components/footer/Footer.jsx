'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/apiConfig';
import logo from '@/public/images/sm-logo.png';
import Image from 'next/image';
import tiktok from '@/public/images/tiktok.svg';
import instagram from '@/public/images/instagram.svg';
import apple from '@/public/images/apple-btn.png';
import google from '@/public/images/google-btn.png';
import x from '@/public/images/x.svg';
import snapchat from '@/public/images/snapchat.png';
import Link from 'next/link';
import { t } from '@/lib/i18n';
import rayan from '@/public/images/rayan.png';
import fb from '@/public/images/fb.png';
export default function Footer() {
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'ar');
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


  return (
    <footer style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <div className="container">
        <div className="footer-cont">
          <div className="footer-content">
            <div className="">
              <figure className="footer-logo">
                <Link href="#"><Image src={logo} className="img-fluid" alt='B3' /></Link>
              </figure>

              <div className="social">
                <Link href="https://www.tiktok.com" className="social-link" target='_blank'>
                  <Image src={tiktok} alt="social" />
                </Link>
                <Link href="https://www.instagram.com" className="social-link" target='_blank'>
                  <Image src={instagram} alt="social" />
                </Link>
                <Link href="https://www.snapchat.com" className="social-link" target='_blank'>
                  <Image src={x} alt="social" />
                </Link>
                <Link href="https://www.snapchat.com" className="social-link" target='_blank'>
                  <Image src={snapchat} alt="social" />
                </Link>
                <Link href="https://www.facebook.com" className="social-link" target='_blank'>
                  <Image src={fb} alt="social" />
                </Link>
              </div>
            </div>

            {/* category End */}
            {/* tags */}

            {/* tags End */}
            <div className="">
              <div className="nav-foot-cont">
                <h2 className="nav-foot-header nav-accordion">{t(lang, 'quick_links')}</h2>
                <ul className="nav-foot nav-wrap list-unstyled">
                  <li className="nav-foot-li">
                    <Link href="/contact" className="nav-foot-link">{t(lang, "contact")}</Link>
                  </li>
                  <li className="nav-foot-li">
                    <Link href="/terms" className="nav-foot-link">{t(lang, "terms")}</Link>
                  </li>
                  <li className="nav-foot-li">
                    <Link href="/privacy" className="nav-foot-link">{t(lang, "privacy")}</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="">
              <div className="nav-foot-cont">
                <h2 className="nav-foot-header nav-accordion">{t(lang, 'download')}</h2>
                <div className="nav-foot">
                  <div className="download-btn-cont">
                    <Link href="https://testflight.apple.com/join/DcG2C37G"><Image src={apple} alt="download" /></Link>
                    <Link href="#" ><Image src={google} alt="download" /></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button className="arrow-top">
        <i className="fa-solid fa-chevron-up"></i>
      </button>
    </footer>

  );
}
