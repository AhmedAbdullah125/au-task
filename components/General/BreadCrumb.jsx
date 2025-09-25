import { t } from '@/lib/i18n';
import Link from 'next/link';
import React from 'react';


export default function BreadCrumb({ first, firstLink, second, secondLink, lang }) {
    return (
        <h2 className="page-title">
            <Link href={'/'}>{t(lang, 'home')}</Link>
            <span> - </span>
            <Link href={firstLink}>{first}</Link>
            {
                second ?
                    <>
                        <span> - </span>
                        <Link href={secondLink}>{second}</Link>
                    </>
                    :
                    ''
            }
        </h2>

    );
}

