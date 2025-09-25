'use client';
import { useEffect, useState } from 'react';
import 'react-phone-number-input/style.css';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/apiConfig';
import { deleteAddress } from './removeAddress';
import Link from 'next/link';
import locationIcon from '@/public/images/location-icon.svg';
import Loading from '../../loading';
import Image from 'next/image';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { t } from '@/lib/i18n';
export default function Address() {
    const lang = localStorage.getItem('lang') || 'en';
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [addresses, setAddesses] = useState(null);
    const [deletedAddress, setDeletedAddress] = useState([]);
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (!savedToken) {
            router.push('/login');
        }
    }, []);
    useEffect(() => {
        const getAddresses = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/user/address`, {
                    headers: { 'x-localization': localStorage.getItem('lang') || 'en', Authorization: `Bearer ${localStorage.getItem('token')}`, },
                });
                const data = response.data.data;
                setAddesses(data);
            } catch (error) {
                console.error('Error retrieving data:', error);
            } finally {
                setLoading(false);
            }
        };
        getAddresses();
    }, [deletedAddress]);
    const handleDelete = (id) => {
        deleteAddress(setLoading, router, id, deletedAddress, setDeletedAddress);
    };
    return (
        <div className="account-content">
            {
                loading ? <Loading /> :
                    <div className="address-cont">
                        <Link href="/profile/addaddress" className="form-btn add-ancor">+ {t(lang, 'add_new_address')}</Link>
                        {
                            addresses.map((address) =>
                                deletedAddress.includes(address.id) ? null :
                                    <div className="address-item" key={address.id}>
                                        <div className="address-info">
                                            <div className="address-head">
                                                <Image src={locationIcon} alt="icon" />
                                                <span>{address.name}</span>
                                            </div>
                                            <div className="address-desc">
                                                <span>{address.governorate.name}</span>, <span>{address.area.name}</span>, <span>{address.street_no}</span>, <span>{address.flat_no}</span>
                                            </div>
                                        </div>
                                        <div className="address-control">
                                            <a href={`/profile/edit_address?id=${address.id}`} className="address-edit">{t(lang, 'edit')}</a>
                                            <AlertDialog >
                                                <AlertDialogTrigger asChild>
                                                    <button className="address-delete">{t(lang, 'delete')}</button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle className="text-center font-light">{t(lang, "delete_address_alert")}</AlertDialogTitle>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter className={"flex flex-col-reverse gap-2 sm:flex-row sm:justify-center sm:space-x-2"}>
                                                        <AlertDialogCancel className="m-0">{lang == "en" ? "Cancel" : "إلغاء"}</AlertDialogCancel>
                                                        <AlertDialogAction className={"bg-[#C71919]"} onClick={() => {
                                                            handleDelete(address.id);
                                                        }}>{lang == "en" ? "Remove" : "حذف"}</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>

                                        </div>
                                    </div>
                            )

                        }

                    </div>
            }
        </div>

    );
}