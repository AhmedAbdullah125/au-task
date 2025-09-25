'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import bluelogo from '@/public/images/blue-logo.svg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sendPostRequest } from './loginRequest';
import { Form, FormField, FormItem, FormControl, FormMessage, } from '@/components/ui/form';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import 'react-phone-number-input/style.css';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/apiConfig';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { toast } from 'sonner';
import { t } from '@/lib/i18n';
import Link from 'next/link';
export default function LoginPage({ setStep, setPhone, setCountryIso }) {
  const lang = localStorage.getItem('lang') || 'en';
  const [country, setCountry] = useState(0);
  const [loading, setLoading] = useState(false);
  const [countryNumberLength, setCountryNumberLength] = useState(0);
  const [data, setData] = useState(null);
  const FormSchema = z.object({
    phone: z.string().min(8, { message: lang === 'ar' ? 'يجب أن يكون رقم الهاتف 8 أحرف على الأقل' : 'Phone number must be at least 8 characters.', }).regex(/^\+?\d+$/, { message: t(lang, "phone_Length_error") }),
    country: z.string().min(1, { message: t(lang, "select_country_error"), }),
  });
  const form = useForm({ resolver: zodResolver(FormSchema), defaultValues: { phone: '', country: '' }, });
  const onSubmit = (formdata) => {
    const country = data.find((item) => item.id === Number(formdata.country));
    const countryCode = country?.iso;
    setCountryIso(countryCode)
    const phone = formdata.phone;    
    sendPostRequest({ phone, countryCode, lang, setLoading, setStep, setPhone, resetForm: form.reset, });
  };
  useEffect(() => {
    if (localStorage.getItem('token')) { window.history.back(); }
    setLoading(true);
    const getCountries = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/general/countries`, { headers: { 'x-localization': lang }, });
        setData(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error(t(lang, "error"), error);
        setLoading(false);
        throw new Error(lang === 'ar' ? 'لا يمكن الحصول على البيانات' : 'Could not get data');
      }
    };
    getCountries();
  }, []);
  useEffect(() => {
    if (data && country) {
      const selectedCountry = data.find((item) => item.id == country);
      if (selectedCountry) { setCountryNumberLength(selectedCountry.phone_length); }
    }
  }, [country, data]);
  return (
    <div className="sign-section" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <div className="sign-container">
        <div className="upper-head">
          <a href="index.html" className="logo-ancor"> <figure className="logo-img"> <Image src={bluelogo} alt="logo" className="img-fluid" /> </figure> </a>
        </div>
        <h2 className="form-head">{t(lang, "login-page")}</h2>
        <p className="form-pargh">{t(lang, "login-error")}</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="input-of-mobile-num flex flex-row-reverse" >
                    <div className="country-select">
                      <FormField control={form.control} name="country" className="h-full" render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select className=" h-full" onValueChange={(value) => { setCountry(value); form.setValue('country', value); }} >
                              <SelectTrigger className="w-28 pe-4 border-e p-0 border-none shadow-none border-black/10 h-[55px]">
                                <SelectValue placeholder={lang === 'ar' ? 'البلد' : 'Country'} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {data?.map((item, index) => (
                                    <SelectItem value={String(item.id)} key={index}>
                                      <div className="code-country-slug-cont">
                                        <div className="select-country-item-cont "> <Image src={item.image} alt={item.name} width={20} height={20} className="w-7 h-4" /> {/* <span>{item.name}</span> */}</div>
                                        <p>({item.phone_code})</p>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>)}
                      />
                    </div>
                    <Input type="tel" className="h-full shadow-none border-none outline-none" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }} placeholder={lang === 'ar' ? 'أدخل رقم هاتفك' : 'Enter Your Phone'} maxLength={countryNumberLength} {...field} onKeyDown={(e) => {
                      if (countryNumberLength === 0) {
                        e.preventDefault();
                        toast(t(lang, "select_country"),
                          { style: { borderColor: '#dc3545', boxShadow: '0px 0px 10px rgba(220, 53, 69, .5)', }, }
                        );
                      } else if (!/^[0-9]|Backspace|Delete$/.test(e.key)) { e.preventDefault(); }
                    }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            />
            <div className="form-btn-cont"> <Button type="submit" className="form-btn" disabled={loading}> {loading ? t(lang, 'loading') : t(lang, 'check')}</Button> </div>
            <div className="text-center">
              <span className="register-span">{t(lang, "no_account")}</span> <Link href="/register" className="register-btn">{t(lang, "create_account")}</Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
