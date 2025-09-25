'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/apiConfig';
import logo from '@/public/images/blue-logo.svg';
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
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
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
  //get categories 
  const [filters, setFilters] = useState([]);
  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/general/filters`, { headers: { 'x-localization': lang, }, });
        const filters = response.data.data;
        setFilters(filters);
      } catch (error) {
        console.error('Error retrieving categories:', error);
      }
    };
    getCategories();
  }, [lang]);
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API_BASE_URL + `/general/socials`, {
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
  }, []);

  return (
    <footer style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <div className="container">
        <div className="footer-cont">
          <div className="row">
            <div className="col-md-2 col-xs-12">
              <figure className="footer-logo">
                <Link href="#"><Image src={logo} className="img-fluid" alt='B3' /></Link>
              </figure>
              {
                loading ? null :
                  <div className="social">
                    <Link href={data.tiktok} className="social-link" target='_blank'>
                      <Image src={tiktok} alt="social" />
                    </Link>
                    <Link href={data.instagram} className="social-link" target='_blank'>
                      <Image src={instagram} alt="social" />
                    </Link>
                    <Link href={data.twitter} className="social-link" target='_blank'>
                      <Image src={x} alt="social" />
                    </Link>
                    <Link href={data.snapchat} className="social-link" target='_blank'>
                      <Image src={snapchat} alt="social" />
                    </Link>
                    <Link href={data.facebook} className="social-link" target='_blank'>
                      <Image src={fb} alt="social" />
                    </Link>
                  </div>
              }
            </div>
            {/* categories */}
            <div className="col-md-2 col-xs-12">
              <div className="nav-foot-cont">
                <h2 className="nav-foot-header nav-accordion">{t(lang, 'categories')}</h2>
                <ul className="nav-foot nav-wrap list-unstyled">
                  {
                    filters?.categories?.map((category) =>
                      <li className="nav-foot-li" key={category.id}>
                        <a href={`/category?id=${category.id}&name=${category.name}`} className="nav-foot-link">
                          {category.name}
                        </a>
                      </li>
                    )
                  }
                </ul>
              </div>
            </div>
            {/* category End */}
            {/* tags */}
            {
              filters?.tags?.map((tagsGroupe, index) =>
                <div className="col-md-2 col-xs-12" key={index}>
                  <div className="nav-foot-cont">
                    <h2 className="nav-foot-header nav-accordion">{tagsGroupe.name}</h2>
                    <ul className="nav-foot nav-wrap list-unstyled">
                      {
                        tagsGroupe.items.map((tag) =>
                          <li className="nav-foot-li" key={tag.id}>
                            <a href={`category?tag=${tag.id}&name=${tag.name}`} className="nav-foot-link">{tag.name}</a>
                          </li>
                        )
                      }
                    </ul>
                  </div>
                </div>
              )
            }

            {/* tags End */}
            <div className="col-md-2 col-xs-12">
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
            <div className="col-md-2 col-xs-12">
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
      <div className="copy-section">
        <div className="container">
          <div className="copy-flex">
            <div className="empty-div"></div>
            <div className="copy-right">
              {t(lang, "copy_right")} <span>{t(lang, "b3")}</span>
            </div>
            <div className="design-text">
              {t(lang, "developed")}
              <Link href="#"><Image src={rayan} alt="rayan" className="rayan-img" /></Link>
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
