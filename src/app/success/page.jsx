'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import logo from '@/public/images/sm-logo.png';
import Image from 'next/image';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 3000); // 3 seconds

    return () => clearTimeout(timer); // cleanup
  }, [router]);

  return (
    <div className="success-page">
      <Image src={logo} alt="test" className="logo-blue" />
      <h3>شكراً لاستثمارك بصحتك معنا</h3>
    </div>
  );
}
