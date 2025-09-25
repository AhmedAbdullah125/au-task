'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/apiConfig';
import BreadCrumb from '../General/BreadCrumb';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'; // For form validation using Zod schema
import { z } from 'zod'; // Zod library for schema-based validation
import { Button } from '@/components/ui/button'; // Button UI component
// Import UI components for form handling
import { Form, FormField, FormItem, FormControl, FormMessage, } from '@/components/ui/form';
import 'react-phone-number-input/style.css'; // Styles for phone input component
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@radix-ui/react-radio-group';
import { Label } from '@radix-ui/react-label';
import { toast } from 'sonner';
import { t } from '@/lib/i18n';
import { useRouter } from 'next/navigation';
import { Input } from '../ui/input';
import { review } from './reviews';

export default function ContactWrapper() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [lang, setLang] = useState(localStorage.getItem('lang') || 'ar');
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('lang') === 'ar' || localStorage.getItem('lang') === 'en') {
                setLang(localStorage.getItem('lang'));
            }
            else {
                localStorage.setItem('lang', 'ar');
                setLang('ar');
            }
        }
    })
    const FormSchema = z.object({
        name: z.string().min(1, { message: t(lang, 'name_error') }),
        email: z.string().email({ message: t(lang, 'email_error') }),
        feedback: z.string().min(1, { message: t(lang, 'message_error') }),
    });
    // Initialize React Hook Form with Zod validation schema
    const form = useForm({
        resolver: zodResolver(FormSchema), // Use Zod schema for validation
        defaultValues: {
            name: '',
            email: '',
            feedback: '',
        }, // Default form values
    });
    const handleSubmit = async (data) => {
        await review(API_BASE_URL, data, setLoading);
    };

    // Form submission handler
    function onSubmit(data) {
        if (!localStorage.getItem('token')) {
            // router.push('/login');
            //toast with red border
            toast.error("Please login to submit feedback", { style: { border: '1px solid #FF0000' } });
            //handle redirect to login in 3 seconds if user is not logged in

        }
        else {
            handleSubmit(data); // Call API request function
            form.reset(); // Reset form fields
        }


    }

    return (
        <section className="content-section">
            <div className="container">
                <BreadCrumb first={t(lang, 'contact')} firstLink={'/contact'} lang={lang} />
                <div className="terms-container">
                    <div className="contact-container">
                        <p className="contact-pargh">
                            إذا كان لديك اي استفسار او شكوي لا تتردد في الاتصال بنا
                        </p>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                {/* Phone number input field */}
                                <div className="contact-grid">
                                    <div className="form-group">

                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Label className='form-label'>{t(lang, 'name')}</Label>
                                                    <FormControl>
                                                        <Input {...field} placeholder={t(lang, "name")} className="form-input" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="form-group">

                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Label className='form-label'>{t(lang, 'email')}</Label>
                                                    <FormControl>
                                                        <Input {...field} placeholder={t(lang, "email")} className="form-input" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="form-group full-grid">
                                        <FormField control={form.control} name="feedback"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Label className='form-label'>{t(lang, 'message')}</Label>
                                                    <FormControl>
                                                        <Textarea className="form-input" placeholder={lang == "en" ? "Type your message here." : "اكتب رسالتك هنا"}  {...field} />
                                                    </FormControl>
                                                    <FormMessage /> {/* Validation error message */}
                                                </FormItem>
                                            )}
                                        />

                                    </div>
                                </div>
                                <div className="form-btn-cont">
                                    <Button className="form-btn" type="submit"> {lang == "en" ? 'Send' : 'ارسل'}</Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                    <figure className="terms-img">
                        <img src="images/contact.svg" alt="terms-img" />
                    </figure>
                </div>
            </div>
        </section>

    );
}
