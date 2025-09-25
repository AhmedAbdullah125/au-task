'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import logo from '@/public/images/paymenterror.webp';
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
    <div className="fail-page">
      <Image src={logo} alt="B3" className="logo-blue" />
      <h3>نعتذر، حدث خطأ</h3>
    </div>
  );
}
