// src/components/navbar.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Phone, ChevronDown } from 'lucide-react';
import { DEFAULT_NAVBAR_CONFIG } from '@/src/config/navbar.config';
import { NavConfig } from '@/src/types/navbar.types';
import axios from 'axios';

export default function Navbar() {
    const [aboutOpen, setAboutOpen] = useState(false);
    const [treatmentsOpen, setTreatmentsOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
    const [mobileTreatmentsOpen, setMobileTreatmentsOpen] = useState(false);
    const [config, setConfig] = useState<NavConfig>(DEFAULT_NAVBAR_CONFIG);
    const [loading, setLoading] = useState(true);

    const params = useParams();
    const locale = (params?.locale as string) || 'tr';

    // ✅ API'DEN VERİ ÇEK - LOCALE İLE
    useEffect(() => {
        const fetchNavbarData = async () => {
            try {
                setLoading(true);
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

                // 🔥 ÖNEMLİ: locale parametresini URL'ye ekle
                console.log(`🔍 Fetching navbar for locale: ${locale}`);
                const response = await axios.get(`${apiUrl}/api/navbar?locale=${locale}`);

                console.log(`✅ Navbar data received for ${locale}:`, response.data.data);

                if (response.data.success && response.data.data) {
                    const apiData = response.data.data;

                    const newConfig: NavConfig = {
                        logo: {
                            url: apiData.logo.url || DEFAULT_NAVBAR_CONFIG.logo.url,
                            alt: apiData.logo.alt || DEFAULT_NAVBAR_CONFIG.logo.alt,
                            width: apiData.logo.width || DEFAULT_NAVBAR_CONFIG.logo.width,
                            height: apiData.logo.height || DEFAULT_NAVBAR_CONFIG.logo.height,
                        },
                        about: {
                            label: apiData.about.label || DEFAULT_NAVBAR_CONFIG.about.label,
                            links: apiData.about.links.filter((link: any) => link.is_active).map((link: any) => ({
                                id: link.id,
                                label: link.label,
                                href: link.href,
                            })),
                            id: ""
                        },
                        treatments: {
                            label: apiData.treatments.label || DEFAULT_NAVBAR_CONFIG.treatments.label,
                            links: apiData.treatments.links.filter((link: any) => link.is_active).map((link: any) => ({
                                id: link.id,
                                label: link.label,
                                href: link.href,
                            })),
                            id: ""
                        },
                        links: apiData.links.filter((link: any) => link.is_active).map((link: any) => ({
                            id: link.id,
                            label: link.label,
                            href: link.href,
                        })),
                        contact: {
                            phoneNumber: apiData.contact.phone_number || DEFAULT_NAVBAR_CONFIG.contact.phoneNumber,
                            whatsappNumber: apiData.contact.whatsapp_number || DEFAULT_NAVBAR_CONFIG.contact.whatsappNumber,
                            email: apiData.contact.email || DEFAULT_NAVBAR_CONFIG.contact.email,
                        },
                    };

                    setConfig(newConfig);
                }
            } catch (error: any) {
                console.error(`❌ Navbar fetch error for ${locale}:`, error);
                setConfig(DEFAULT_NAVBAR_CONFIG);
            } finally {
                setLoading(false);
            }
        };

        fetchNavbarData();
    }, [locale]); // ✅ locale değiştiğinde yeniden çek

    useEffect(() => {
        setMobileMenuOpen(false);
        setMobileAboutOpen(false);
        setMobileTreatmentsOpen(false);
    }, [locale]);

    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    useEffect(() => {
        const handleClickOutside = () => {
            setAboutOpen(false);
            setTreatmentsOpen(false);
        };

        if (aboutOpen || treatmentsOpen) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => document.removeEventListener('click', handleClickOutside);
    }, [aboutOpen, treatmentsOpen]);

    const handleMobileMenuToggle = () => setMobileMenuOpen(!mobileMenuOpen);
    const handleMobileLinkClick = () => {
        setMobileMenuOpen(false);
        setMobileAboutOpen(false);
        setMobileTreatmentsOpen(false);
    };

    const phoneNumber = config.contact.phoneNumber;
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[\s\-\(\)]/g, '')}`;

    return (
        <>
            <nav className="sticky top-0 shadow-md bg-white/60 backdrop-blur-[30px] h-20 z-50 border-b-2 border-primary-pink-light">
                <div className="container h-full flex items-center justify-between px-4 mx-auto max-w-7xl">
                    <Link href={`/${locale}`} className="relative w-[125px] h-[65px] transition-transform duration-300 hover:scale-105">
                        <Image
                            src={config.logo.url}
                            alt={config.logo.alt}
                            width={config.logo.width}
                            height={config.logo.height}
                            className="w-full h-full object-contain transition-all duration-300 hover:contrast-125 hover:brightness-110"
                            priority
                            quality={90}
                            unoptimized
                        />
                    </Link>

                    <div className="hidden md:flex items-center gap-6">
                        <ul className="flex items-center gap-6 text-black capitalize">
                            {/* About Dropdown */}
                            {config.about.links.length > 0 && (
                                <li className="relative" onMouseEnter={() => setAboutOpen(true)} onMouseLeave={() => setAboutOpen(false)}>
                                    <button className="flex items-center gap-1 hover-primary-pink transition-colors duration-300" aria-expanded={aboutOpen} aria-haspopup="true">
                                        <span>{config.about.label}</span>
                                    </button>
                                    <ul className={`absolute top-full left-0 bg-gray-light shadow-lg flex flex-col min-w-[220px] transition-all duration-300 rounded-b-md overflow-hidden ${aboutOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                                        {config.about.links.map((link) => (
                                            <li key={link.id}>
                                                <Link href={`/${locale}${link.href}`} className="block px-4 py-3 hover-bg-primary-pink hover:text-white transition-colors duration-300">
                                                    {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            )}

                            {/* Treatments Dropdown */}
                            {config.treatments.links.length > 0 && (
                                <li className="relative" onMouseEnter={() => setTreatmentsOpen(true)} onMouseLeave={() => setTreatmentsOpen(false)}>
                                    <button className="flex items-center gap-1 hover-primary-pink transition-colors duration-300" aria-expanded={treatmentsOpen} aria-haspopup="true">
                                        <span>{config.treatments.label}</span>
                                    </button>
                                    <ul className={`absolute top-full left-0 bg-gray-light shadow-lg flex flex-col min-w-[220px] transition-all duration-300 rounded-b-md overflow-hidden ${treatmentsOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                                        {config.treatments.links.map((link) => (
                                            <li key={link.id}>
                                                <Link href={`/${locale}${link.href}`} className="block px-4 py-3 hover-bg-primary-pink hover:text-white transition-colors duration-300">
                                                    {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            )}

                            {/* Main Links */}
                            {config.links.map((link) => (
                                <li key={link.id}>
                                    <Link href={`/${locale}${link.href}`} className="hover-primary-pink transition-colors duration-300">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-md bg-primary-pink hover-bg-primary-blue transition-colors duration-300 flex justify-center items-center" aria-label="WhatsApp ile iletişim">
                            <Phone className="text-white" size={18} />
                        </a>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button className="flex md:hidden flex-col gap-[6px] p-2 z-50" onClick={handleMobileMenuToggle} aria-label="Menüyü aç/kapat">
                        <span className={`h-[2px] w-6 bg-primary-pink rounded-md transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-[8px]' : ''}`} />
                        <span className={`h-[2px] w-6 bg-primary-pink rounded-md transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                        <span className={`h-[2px] w-6 bg-primary-pink rounded-md transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} />
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden fixed top-20 left-0 w-full h-[calc(100vh-5rem)] bg-gray-light shadow-lg overflow-y-auto transition-transform duration-300 z-40 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="container mx-auto px-4 py-6 flex flex-col gap-4 h-full">
                        <nav className="flex flex-col gap-3 text-black capitalize flex-1">
                            {/* Mobile About */}
                            {config.about.links.length > 0 && (
                                <div>
                                    <button onClick={() => setMobileAboutOpen(!mobileAboutOpen)} className="flex items-center gap-1 py-2 hover-primary-pink transition-colors duration-300 w-full">
                                        <span>{config.about.label}</span>
                                        <ChevronDown size={16} className={`transition-transform duration-300 ${mobileAboutOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    <div className={`bg-gray-50 overflow-hidden flex flex-col transition-all duration-300 rounded-md ${mobileAboutOpen ? 'opacity-100 max-h-[500px] mt-2' : 'opacity-0 max-h-0'}`}>
                                        {config.about.links.map((link) => (
                                            <Link key={link.id} href={`/${locale}${link.href}`} onClick={handleMobileLinkClick} className="px-4 py-3 hover:bg-primary-pink-light transition-colors duration-300">
                                                {link.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Mobile Treatments */}
                            {config.treatments.links.length > 0 && (
                                <div>
                                    <button onClick={() => setMobileTreatmentsOpen(!mobileTreatmentsOpen)} className="flex items-center gap-1 py-2 hover-primary-pink transition-colors duration-300 w-full">
                                        <span>{config.treatments.label}</span>
                                        <ChevronDown size={16} className={`transition-transform duration-300 ${mobileTreatmentsOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    <div className={`bg-gray-50 overflow-hidden flex flex-col transition-all duration-300 rounded-md ${mobileTreatmentsOpen ? 'opacity-100 max-h-[500px] mt-2' : 'opacity-0 max-h-0'}`}>
                                        {config.treatments.links.map((link) => (
                                            <Link key={link.id} href={`/${locale}${link.href}`} onClick={handleMobileLinkClick} className="px-4 py-3 hover:bg-primary-pink-light transition-colors duration-300">
                                                {link.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Mobile Main Links */}
                            {config.links.map((link) => (
                                <Link key={link.id} href={`/${locale}${link.href}`} onClick={handleMobileLinkClick} className="py-2 hover-primary-pink transition-colors duration-300">
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-[90%] mx-auto rounded-md bg-primary-pink hover-bg-primary-blue transition-colors duration-300 flex justify-center items-center gap-3 p-3">
                            <Phone className="text-white" size={20} />
                            <span className="text-white font-medium">{phoneNumber}</span>
                        </a>
                    </div>
                </div>

                {mobileMenuOpen && <div className="md:hidden fixed inset-0 bg-black/50 z-30 top-20" onClick={handleMobileMenuToggle} />}
            </nav>
        </>
    );
}