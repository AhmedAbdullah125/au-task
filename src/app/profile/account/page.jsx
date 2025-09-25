'use client';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import 'react-phone-number-input/style.css';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/apiConfig';
import { toast } from 'sonner';
import { updateProfile } from './updateProfileData';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormControl, FormMessage, } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import axios from 'axios';
import { ProfileDataContext } from '@/src/Context/ProfileContext';
import Loading from '../../loading';
import { t } from '@/lib/i18n';
export default function EditPage() {
    const lang = localStorage.getItem('lang') || 'en';
    let { data } = useContext(ProfileDataContext || null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [countryNumberLength, setCountryNumberLength] = useState(0)
    const [country, setCountry] = useState(String(data?.country?.id));
    const [token, setToken] = useState(null);
    const [countryIso, setCountryIso] = useState(String(data?.country?.iso));
    const [countryData, setCountryData] = useState(null);
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        setToken(savedToken);
        if (!savedToken) { router.push('/login'); }
    }, []);
    const FormSchema = z.object({
        fullName: z.string().min(2, { message: 'name must be at least 2 characters.', }),
        phone: z.string().min(8, { message: 'Phone number must be 8 characters.', }).regex(/^\+?\d+$/, { message: 'Phone number must start with a plus sign and contain only digits.', }),
    });
    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: { fullName: data?.name || '', phone: data?.phone || '' },
    });
    function onSubmit(data) {
        handleUpdateProfile(data);
    }
    const handleUpdateProfile = async (data) => {
        await updateProfile(data, countryIso, setLoading, lang, router);
    };
    useEffect(() => {
        setLoading(true)
        const getCountries = async () => {
            try {
                const response = await axios.get(API_BASE_URL + `/general/countries`, { headers: { 'x-localization': localStorage.getItem('lang') || 'en', }, });
                let data = response.data.data;
                setCountryData(data)
                setLoading(false)
            } catch (error) {
                console.error('Error retrieving data:', error);
                throw new Error('Could not get data');
                setLoading(false)
            }
        };
        getCountries();
    }, []);
    useEffect(() => {
        if (countryData && country) {
            const selectedCountry = countryData.find(item => item.id == country);
            if (selectedCountry) {
                setCountryNumberLength(selectedCountry?.phone_length);
                setCountryIso(selectedCountry?.iso);
            }
        }
    }, [country, countryData]);
    return (
        <div className="account-content">
            {
                loading || !data ? <Loading /> :
                    <div className="profile-form">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} encType="multipart/form-data" className="form-group">
                                {/* Full Name */}
                                <FormField control={form.control} name="fullName" render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input className="form-input mb-3" placeholder={lang == "en" ? "Enter your name" : "ادخل اسمك"} {...field} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                                {/* Date and Phone */}

                                <FormField control={form.control} name="phone" render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="input-of-mobile-num flex flex-row-reverse" >
                                                <div className="country-select">
                                                    <FormField control={form.control} name="country" className="h-full" render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Select className=" h-full" defaultValue={String(data?.country.id)} onValueChange={(value) => { setCountry(value); form.setValue('country', value); }} >
                                                                    <SelectTrigger className="w-28 pe-4 border-e p-0 border-none shadow-none border-black/10 h-[55px]">
                                                                        <SelectValue placeholder={lang === 'ar' ? 'البلد' : 'Country'} />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectGroup>
                                                                            {countryData?.map((item, index) => (
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
                                <div className="form-btn-cont">
                                    <Button className="form-btn" type="submit">{t(lang, "save")}</Button>
                                </div>
                            </form>
                        </Form>
                    </div>
            }
        </div>
    );
}