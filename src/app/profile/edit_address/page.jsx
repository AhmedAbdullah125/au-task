'use client';

import { useEffect, useState } from 'react';
import 'react-phone-number-input/style.css';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { API_BASE_URL } from '@/lib/apiConfig';
import Loading from '@/src/app/loading';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { editAddress } from './editAddress';
import { t } from '@/lib/i18n';
import MapSelector from '@/components/profile/MapSelector';
import locationIcon from '@/public/images/location-icon.svg';
import Image from 'next/image';
import { toast } from 'sonner';

export default function Address() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const lang = typeof window !== 'undefined' ? localStorage.getItem('lang') || 'en' : 'en';
    const AddressId = searchParams.get('id');

    const [token, setToken] = useState('');
    const [loadingGovernorates, setLoadingGovernorates] = useState(true);
    const [governorates, setGovernorates] = useState([]);
    const [areas, setAreas] = useState([]);
    const [selectedGovernorate, setSelectedGovernorate] = useState('');
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const [displayMap, setDisplayMap] = useState(false);
    const [iserror, setIserror] = useState(false);
    const [address, setAddress] = useState({});
    const [selectedCountry, setSelectedCountry] = useState(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('country');
            return stored ? JSON.parse(stored) : null;
        }
        return null;
    });

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
        defaultValues: { addressName: '', street: '', governorate: '', area: '', buildingNo: '', apartment: '', },
    });

    // Load token
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        setToken(savedToken);
        if (!savedToken) router.push('/login');
    }, []);

    // Fetch Address (for edit mode)
    useEffect(() => {
        const getAddresses = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/user/address`, { headers: { 'x-localization': lang, Authorization: `Bearer ${localStorage.getItem("token")}`, }, });
                const data = response.data.data;
                const found = data.find((item) => Number(item.id) === Number(AddressId));
                if (found) { setAddress(found); }
            } catch (error) {
                console.error('Error retrieving addresses:', error);
            }
        };
        if (AddressId) getAddresses();
    }, [AddressId, token]);

    // Set form values from address (after it's loaded)
    useEffect(() => {
        if (address && Object.keys(address).length > 0) {
            form.reset({
                addressName: address?.name || '',
                street: address?.street_no || '',
                governorate: address?.governorate?.id?.toString() || '',
                area: address?.area?.id?.toString() || '',
                buildingNo: address?.home_no?.toString() || '',
                apartment: address?.flat_no?.toString() || '',
                setLat: address?.lat?.toString() || '',
                setLng: address?.lng?.toString() || '',
            });

            if (address?.lat && address?.lng) {
                setLat(Number(address.lat));
                setLng(Number(address.lng));
            }

            if (address?.governorate?.id) {
                setSelectedGovernorate(address.governorate.id.toString());
            }
        }
    }, [address]);

    // Fetch governorates
    useEffect(() => {
        const getGovernorates = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/general/governorates/${selectedCountry?.id}`, {
                    headers: {
                        'x-localization': lang,
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setGovernorates(response.data.data);
            } catch (error) {
                console.error('Error retrieving governorates:', error);
            } finally {
                setLoadingGovernorates(false);
            }
        };

        if (selectedCountry?.id) getGovernorates();
    }, [selectedCountry, token]);

    // Fetch areas for selected governorate
    useEffect(() => {
        const getAreas = async () => {
            if (selectedGovernorate) {
                try {
                    const response = await axios.get(`${API_BASE_URL}/general/areas/${selectedGovernorate}`, {
                        headers: {
                            'x-localization': lang,
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    });
                    setAreas(response.data.data);
                } catch (error) {
                    console.error('Error retrieving areas:', error);
                }
            }
        };
        getAreas();
    }, [selectedGovernorate, token]);

    // Submit
    const onSubmit = async (data) => {
        if (!lat || !lng) {
            setIserror(true);
            toast.error('Please select a location');
            return;
        }
        await editAddress(data, AddressId, setLoadingGovernorates, lat, lng, router);
        form.reset();
        router.back();
    };

    if (loadingGovernorates) return <Loading />;

    return (
        <div className="account-content">
            <div className="address-edit-cont">
                {displayMap && (
                    <div className="mb-3">
                        <MapSelector setLat={setLat} setLng={setLng} iserror={iserror} />
                    </div>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="address-setting">
                        {!displayMap && (
                            <div className="form-group full-grid">
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="حدد الموقع"
                                    onClick={() => {
                                        setIserror(false);
                                        setDisplayMap(true);
                                    }}
                                />
                                <button className="location-btn">
                                    <Image src={locationIcon} alt="icon" />
                                </button>
                            </div>
                        )}

                        <div className="form-group">
                            <FormField
                                control={form.control}
                                name="addressName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input {...field} placeholder={t(lang, "address_name")} className="form-input" />
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
                                            <Select
                                                value={String(field.value)}
                                                onValueChange={(value) => {
                                                    field.onChange(value);
                                                    setSelectedGovernorate(value);
                                                    form.setValue('area', '');
                                                }}
                                                className="form-input"
                                            >
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
                                            <Select
                                                value={String(field.value)}
                                                onValueChange={field.onChange}
                                                className="form-input"
                                            >
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

                        <div className="form-btn-cont">
                            <Button className="form-btn" type="submit">{t(lang, "save")}</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
