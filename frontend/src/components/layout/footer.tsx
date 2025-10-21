"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Youtube, Twitter, Linkedin } from 'lucide-react';
import axios from 'axios';

interface FooterConfig {
    address: {
        icon: string;
        iso_logo: string;
        text: string;
    };
    contact: {
        icon: string;
        phone: string;
        phone_link: string;
        email: string;
        email_link: string;
        social_links: Array<{
            id: number;
            platform: string;
            url: string;
            is_active: boolean;
        }>;
    };
    quick_access: {
        icon: string;
        links: Array<{
            id: number;
            label: string;
            href: string;
            is_active: boolean;
        }>;
    };
    copyright_logo: string;
    copyright_text: string;
}

function SocialIcon({ platform }: { platform: string }) {
    const icons: Record<string, any> = {
        facebook: Facebook,
        instagram: Instagram,
        youtube: Youtube,
        twitter: Twitter,
        linkedin: Linkedin,
    };

    const key = platform?.toLowerCase?.() || '';
    const Icon = icons[key];
    return Icon ? <Icon className="text-white" size={20} /> : null;
}

function FooterCard({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-md p-5 flex flex-col justify-center items-center w-full">
            {children}
        </div>
    );
}

function IconBadge({ src, alt }: { src: string; alt: string }) {
    return (
        <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-md bg-primary-pink p-2 hover:bg-primary-blue transition-colors duration-300 flex justify-center items-center my-2 md:my-4">
            <Image
                src={src}
                alt={alt}
                width={28}
                height={28}
                className="object-contain"
                loading="lazy"
                unoptimized
            />
        </div>
    );
}

function CardTitle({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-gray-900 capitalize text-lg md:text-[22px] font-medium text-center">{children}</p>
    );
}

export default function Footer({ locale }: { locale: string }) {
    const t = useTranslations('Footer');
    const [config, setConfig] = useState<FooterConfig | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFooterData = async () => {
            try {
                setLoading(true);
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                const response = await axios.get(`${apiUrl}/api/footer?locale=${locale}`);

                if (response.data?.success && response.data?.data) {
                    setConfig(response.data.data);
                    console.log('✅ Footer data loaded:', response.data.data);
                }
            } catch (error) {
                console.error('❌ Footer fetch error:', error);
                // Hata durumunda default fallback (config null kalırsa loading bloğu gösteririz)
            } finally {
                setLoading(false);
            }
        };

        fetchFooterData();
    }, [locale]);

    // Loading durumunda basit footer göster
    if (loading || !config) {
        return (
            <footer className="mt-auto bg-primary-blue py-4">
                <div className="container text-center text-white">
                    <p className="text-sm">{t('copyright.text')}</p>
                </div>
            </footer>
        );
    }

    return (
        <footer className="mt-auto bg-primary-blue pt-10 flex flex-col gap-10">
            <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto px-4">
                {/* Address Card */}
                <FooterCard>
                    {config.address?.icon && <IconBadge src={config.address.icon} alt={t('address.iconAlt')} />}

                    <div className="flex flex-col gap-2 md:gap-4 flex-1 items-center">
                        <CardTitle>{t('address.title')}</CardTitle>
                        <div className="flex flex-col gap-3 items-center">
                            {config.address?.iso_logo && (
                                <div className="w-[65px] h-[65px] relative">
                                    <Image
                                        src={config.address.iso_logo}
                                        alt={t('address.isoAlt')}
                                        width={65}
                                        height={65}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                        unoptimized
                                    />
                                </div>
                            )}

                            {config.address?.text && <p className="text-center text-base text-gray-700">{config.address.text}</p>}
                        </div>
                    </div>
                </FooterCard>

                {/* Contact Card */}
                <FooterCard>
                    {config.contact?.icon && <IconBadge src={config.contact.icon} alt={t('contact.iconAlt')} />}

                    <div className="flex flex-col flex-1 gap-2 md:gap-4 items-center">
                        <CardTitle>{t('contact.title')}</CardTitle>

                        <div className="flex flex-col gap-2 items-center">
                            {config.contact?.phone && (
                                <p className="text-base text-gray-700 capitalize">
                                    <a
                                        href={config.contact.phone_link || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-pink-light font-medium hover:text-primary-pink transition-colors"
                                        aria-label={t('contact.phoneLabel')}
                                    >
                                        {config.contact.phone}
                                    </a>
                                </p>
                            )}

                            {config.contact?.email && (
                                <p className="text-base text-gray-700 capitalize">
                                    <a
                                        href={config.contact.email_link || `mailto:${config.contact.email}`}
                                        className="text-primary-pink-light lowercase font-medium hover:text-primary-pink transition-colors"
                                        aria-label={t('contact.emailLabel')}
                                    >
                                        {config.contact.email}
                                    </a>
                                </p>
                            )}

                            {config.contact?.social_links?.length > 0 && (
                                <div className="flex items-center gap-2 justify-center" role="list">
                                    {config.contact.social_links
                                        .filter((social) => social.is_active)
                                        .map((social) => (
                                            <a
                                                key={social.id}
                                                href={social.url}
                                                className="w-10 h-10 cursor-pointer rounded-md bg-primary-pink p-2 hover:bg-primary-blue transition-colors duration-300 flex justify-center items-center"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={social.platform}
                                                role="listitem"
                                            >
                                                <SocialIcon platform={social.platform} />
                                            </a>
                                        ))}
                                </div>
                            )}
                        </div>
                    </div>
                </FooterCard>

                {/* Quick Access Card */}
                <FooterCard>
                    {config.quick_access?.icon && <IconBadge src={config.quick_access.icon} alt={t('quickAccess.iconAlt')} />}

                    <div className="flex flex-col flex-1 gap-2 md:gap-4 items-center">
                        <CardTitle>{t('quickAccess.title')}</CardTitle>

                        {config.quick_access?.links?.length > 0 && (
                            <nav className="flex flex-col gap-2 items-center" aria-label={t('quickAccess.navLabel')}>
                                {config.quick_access.links
                                    .filter((link) => link.is_active)
                                    .map((link) => (
                                        <Link
                                            key={link.id}
                                            className="text-base text-primary-pink-light font-medium hover:text-primary-pink transition-colors capitalize"
                                            href={`/${locale}${link.href}`}
                                            aria-label={link.label}
                                        >
                                            {/* label translation expects a key based on link.label */}
                                            {t(`quickAccess.links.${link.label}.text`)}
                                        </Link>
                                    ))}
                            </nav>
                        )}
                    </div>
                </FooterCard>
            </div>

            {/* Copyright Section */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-1 py-4 bg-gray-600/30 text-gray-300">
                {config.copyright_text && <p className="text-sm">{config.copyright_text}</p>}
                {config.copyright_text && config.copyright_logo && (
                    <span className="text-gray-300 hidden md:inline-block" aria-hidden="true">|</span>
                )}

                {config.copyright_logo && (
                    <div className="w-[180px] h-[18px]">
                        <Image
                            src={config.copyright_logo}
                            alt={t('copyright.logoAlt')}
                            width={180}
                            height={18}
                            className="w-full h-full object-contain"
                            loading="lazy"
                            unoptimized
                        />
                    </div>
                )}
            </div>
        </footer>
    );
}
