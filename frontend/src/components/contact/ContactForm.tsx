'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Form, Input, Select, message } from 'antd';
import { contactService } from '@/src/services/contact.service';
import { ContactFormData } from '@/src/types/contact.types';
import {Button} from "@/components/ui/button";

const { TextArea } = Input;

interface ContactFormProps {
    subjects: string[];
    submitButtonText: string;
}

export default function ContactForm({ subjects, submitButtonText }: ContactFormProps) {
    const [form] = Form.useForm();
    const params = useParams();
    const locale = (params?.locale as string) || 'tr';
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: ContactFormData) => {
        setLoading(true);
        try {
            const response = await contactService.submitContactForm({
                ...values,
                locale,
            });

            message.success(response.message || 'Mesajınız başarıyla gönderildi!');
            form.resetFields();
        } catch (error: any) {
            message.error(error?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="ant-form ant-form-vertical"
        >
            <div className="px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:gap-4">
                    <Form.Item
                        name="name"
                        label={
                            <div className="flex items-center">
                                <p className="text-[14px] leading-5 text-[#474D66]">Ad - Soyad</p>
                                <span className="text-red-500 ml-[2px]">*</span>
                            </div>
                        }
                        rules={[{ required: true, message: 'Lütfen adınızı ve soyadınızı girin' }]}
                        className="!flex-1"
                    >
                        <Input
                            placeholder="Lütfen Ad - Soyad giriniz"
                            className="!h-[48px] !rounded-md"
                        />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label={
                            <div className="flex items-center">
                                <p className="text-[14px] leading-5 text-[#474D66]">E-posta</p>
                                <span className="text-red-500 ml-[2px]">*</span>
                            </div>
                        }
                        rules={[
                            { required: true, message: 'Lütfen e-posta adresinizi girin' },
                            { type: 'email', message: 'Geçerli bir e-posta adresi girin' },
                        ]}
                        className="!flex-1"
                    >
                        <Input
                            placeholder="Lütfen E-posta giriniz"
                            className="!h-[48px] !rounded-md"
                        />
                    </Form.Item>
                </div>

                <Form.Item
                    name="subject"
                    label={
                        <div className="flex items-center">
                            <p className="text-[14px] leading-5 text-[#474D66]">Konu</p>
                            <span className="text-red-500 ml-[2px]">*</span>
                        </div>
                    }
                    rules={[{ required: true, message: 'Lütfen bir konu seçin' }]}
                >
                    <Select
                        placeholder="Lütfen bir konu seçin"
                        className="!h-[48px]"
                    >
                        {subjects.map((subject) => (
                            <Select.Option key={subject} value={subject}>
                                {subject}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="message"
                    label={
                        <div className="flex items-center">
                            <p className="text-[14px] leading-5 text-[#474D66]">Mesaj</p>
                            <span className="text-red-500 ml-[2px]">*</span>
                        </div>
                    }
                    rules={[{ required: true, message: 'Lütfen mesajınızı girin' }]}
                >
                    <TextArea
                        placeholder="Lütfen mesajınızı giriniz"
                        className="!rounded-md"
                        rows={6}
                        maxLength={1000}
                        showCount
                    />
                </Form.Item>

                <div className="flex justify-center">
                    <Button
                        className={`
              bg-primary-pink
              text-white
              hover-bg-primary-blue
              px-5 md:px-8 py-2 md:py-4
              rounded-full
              cursor-pointer
              transition-colors duration-300 ease-in
              flex items-center justify-center gap-2 h-auto
              border-none
            `}
                    >
                        <p className="text-sm md:text-base capitalize font-medium">
                            {submitButtonText}
                        </p>
                    </Button>
                </div>
            </div>
        </Form>
    );
}
