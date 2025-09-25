'use client'
import React, { useEffect, useState } from 'react';
import Verfiy from '@/components/auth/Verfiy';
import { useRouter } from 'next/navigation';
import LoginPage from './LoginPage';
import { sendPostRequest } from './loginRequest';

export default function LoginWrapper() {
    const [step, setStep] = useState('login')
    const [phone, setPhone] = useState(null)
    const router = useRouter();
    const [countryIso , setCountryIso] = useState(null)
    useEffect(() => {
        if (localStorage.getItem('token')) {
            router.push('/');
        }
    }, [])

    return (
        <>
            {
                step === 'login' ? <LoginPage step={step} setStep={setStep} setPhone={setPhone} setCountryIso={setCountryIso}/> :
                    step === 'verify' ? <Verfiy step={step} setStep={setStep} phone={phone} countryIso={countryIso} setPhone={setPhone}  /> :
                        <p>Not a valid step</p>
            }
        </>

    );
}
