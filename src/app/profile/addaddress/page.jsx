'use client';

import {  useEffect, useState } from 'react';
import 'react-phone-number-input/style.css';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormControl,  FormMessage, } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { API_BASE_URL } from '@/lib/apiConfig';
import Loading from '@/src/app/loading';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { addAddress } from './addAddress';
import { t } from '@/lib/i18n';
import MapSelector from '@/components/profile/MapSelector';
import locationIcon from '@/public/images/location-icon.svg';
import Image from 'next/image';

export default function Address() {
    const lang = localStorage.getItem('lang') || 'en';
    const router = useRouter();
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loadingGovernorates, setLoadingGovernorates] = useState(true);
    const [governorates, setGovernorates] = useState([]);
    const [areas, setAreas] = useState([]);
    const [selectedGovernorate, setSelectedGovernorate] = useState('');
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const [displayMap, setDisplayMap] = useState(false);
    const [iserror, setIserror] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('country');
            return stored ? JSON.parse(stored) : null;
        }
        return null;
    });

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        setToken(savedToken);
        if (!savedToken) { router.push('/login'); }
    }, []);

    useEffect(() => {
        const getGovernorates = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/general/governorates/${selectedCountry.id}`, {
                    headers: { 'x-localization': localStorage.getItem('lang') || 'en', Authorization: `Bearer ${token}`, },
                });
                setGovernorates(response.data.data);
            } catch (error) {
                console.error('Error retrieving governorates:', error);
            } finally {
                setLoadingGovernorates(false);
            }
        }
        getGovernorates();
    }, []);
    useEffect(() => {
        const getAreas = async () => {
            if (selectedGovernorate) {
                try {
                    const response = await axios.get(`${API_BASE_URL}/general/areas/${selectedGovernorate}`, {
                        headers: { 'x-localization': localStorage.getItem('lang') || 'en', Authorization: `Bearer ${token}`, },
                    });
                    setAreas(response.data.data);
                } catch (error) {
                    console.error('Error retrieving governorates:', error);
                } finally {
                    setLoadingGovernorates(false);
                }
            }
        }
        getAreas();
    }, [selectedGovernorate]);

    const form = useForm({
        resolver: zodResolver(
            z.object({
                street: z.string().min(2, { message: t(lang, "street_name_error") }),
                governorate: z.string().min(1, { message: t(lang, "governorate_error") }),
                area: z.string().min(1, { message: t(lang, "select_area") }),
                addressName: z.string().min(2, { message: t(lang, "address_name_error") }),
                buildingNo: z.string().min(1, { message: t(lang, "building_number_error") }),
                apartment: z.string().min(1, { message: t(lang, "apartment_number_error") }),
            })
        ),
        defaultValues: {
            addressName: '',
            street: '',
            governorate: '',
            area: '',
            buildingNo: '',
            apartment: '',

        },
    });

    function onSubmit(data) {
        if (!lat || !lng) {
            setIserror(true);
        } else {
            handleAddAddress(data);
            form.reset();
            
        }
    }

    const handleAddAddress = async (data) => {
        await addAddress(data, setLoadingGovernorates, lat, lng,router);
    };

    if (loadingGovernorates) {
        return <Loading />;
    }
    return (

        <div className="account-content">
            <div className="address-edit-cont">
                {
                    displayMap ?
                        <div className="mb-3">
                            <MapSelector setLat={setLat} setLng={setLng} iserror={iserror} />
                        </div>
                        :
                        null

                }
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="address-setting">
                        {
                            displayMap ? null :
                                <div className="form-group full-grid">
                                    <input type="text" className="form-input" placeholder="حدد الموقع" onClick={() => {
                                        setIserror(false);
                                        setDisplayMap(true);
                                    }} />
                                    <button className="location-btn">
                                        <Image src={locationIcon} alt="icon" />
                                    </button>
                                </div>
                        }
                        <div className="form-group">

                            <FormField
                                control={form.control}
                                name="addressName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input {...field} placeholder={lang === 'ar' ? 'أدخل عنوانك' : 'Enter your address'} className="form-input" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="form-group">
                            <FormField
                                control={form.control}
                                name="governorate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Select value={String(field.value)} onValueChange={(value) => { field.onChange(value); setSelectedGovernorate(value); form.setValue('area', ''); }}
                                                className="form-input">
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t(lang, "city_error")} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {governorates.map((gov) => (
                                                            <SelectItem key={gov.id} value={String(gov.id)}>
                                                                {gov.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="form-group">
                            <FormField
                                control={form.control}
                                name="area"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Select value={String(field.value)} onValueChange={(value) => { field.onChange(value); }}
                                                className="form-input">
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t(lang, "area_error")} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {areas.map((area) => (
                                                            <SelectItem key={area.id} value={String(area.id)}>
                                                                {area.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="form-group">

                            <FormField
                                control={form.control}
                                name="street"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input {...field} placeholder={t(lang, "street_name")} className="form-input" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="form-group">

                            <FormField
                                control={form.control}
                                name="apartment"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input {...field} placeholder={t(lang, "apartment_number")} className="form-input" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="form-group">

                            <FormField
                                control={form.control}
                                name="buildingNo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input {...field} placeholder={t(lang, "building_number")} className="form-input" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="form-btn-cont"><Button className="form-btn" type="submit">{t(lang, "add")}</Button></div>
                    </form>
                </Form>

            </div>
        </div>
    );
}