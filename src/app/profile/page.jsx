'use client'
import React, { useEffect } from 'react'
// import { CounterContext } from '@/app/Context/CounterContext';
import Image from 'next/image'
import logo from '@/public/images/blue-logo.svg'
import { useRouter } from 'next/navigation';
export default function Profile() {
    const router = useRouter();
    useEffect(() => {
        if (!localStorage.getItem('token')) {
            router.push('/login');
        }

    }, [])
    return (

        <div className="img-empty">
            <Image src={logo} alt='B3' className='logo-in-footer'></Image>
        </div>
    )
}
