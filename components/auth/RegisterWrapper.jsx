'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Verfiy from '@/components/auth/Verfiy';
import Register from '@/components/auth/Register';
export default function Page() {
    const [step, setStep] = useState('login')
    const [phone, setPhone] = useState(null)
    const [countryIso , setCountryIso] = useState(null)
    const router = useRouter();
    useEffect(() => {
        if (localStorage.getItem('token')) {
            const prevPage = sessionStorage.getItem('previousPage');
                router.push('/profile');
            }
    }, [])
    return (
        <>
            {
                step === 'login' ? <Register step={step} setStep={setStep} setPhone={setPhone}  setCountryIso={setCountryIso}/> :
                    step === 'verify' ? <Verfiy step={step} setStep={setStep} phone={phone} countryIso={countryIso} setPhone={setPhone}  /> :
                        <p>Not a valid step</p>
            }
        </>

    );
}
