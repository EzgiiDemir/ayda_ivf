'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { NextIntlClientProvider, useTranslations } from 'next-intl';
import {
    LayoutDashboard,
    FileText,
    Image,
    Settings,
    Menu,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Globe,
    Home,
    ChevronDown,
    Mail,
    HelpCircle,
    FileType,
    Layout,
    Plus,
    Star,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';

import trMessages from '@/src/messages/tr.json';
import enMessages from '@/src/messages/en.json';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface SubMenuItem {
    name: string;
    translationKey?: string;
    icon: ReactNode;
    href: string;
}

interface MenuItem {
    name: string;
    translationKey: string;
    icon: ReactNode;
    href?: string;
    submenu?: SubMenuItem[];
}

function AdminLayoutContent({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations('admin');

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentLocale, setCurrentLocale] = useState('tr');
    const [openMenus, setOpenMenus] = useState<string[]>(['pages', 'specialPages']);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        const savedLocale = localStorage.getItem('locale') || 'tr';
        setCurrentLocale(savedLocale);

        if (!token) {
            router.push('/login');
            return;
        }

        if (userData) {
            setUser(JSON.parse(userData));
        }

        setLoading(false);
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    const handleLanguageChange = (locale: string) => {
        setCurrentLocale(locale);
        localStorage.setItem('locale', locale);
        window.location.reload();
    };

    const toggleMenu = (menuKey: string) => {
        setOpenMenus(prev =>
            prev.includes(menuKey)
                ? prev.filter(key => key !== menuKey)
                : [...prev, menuKey]
        );
    };

    const menuItems: MenuItem[] = [
        {
            name: 'Dashboard',
            translationKey: 'dashboard',
            icon: <LayoutDashboard className="w-5 h-5" />,
            href: '/dashboard',
        },
        {
            name: 'Layout',
            translationKey: 'layout',
            icon: <Layout className="w-5 h-5" />,
            submenu: [
                {
                    name: 'Navbar',
                    translationKey: 'navbar',
                    icon: <Menu className="w-4 h-4" />,
                    href: '/layout/navbar',
                },
                {
                    name: 'Footer',
                    translationKey: 'footer',
                    icon: <Layout className="w-4 h-4" />,
                    href: '/layout/footer',
                },
            ],
        },
        {
            name: 'Sayfalar',
            translationKey: 'pages',
            icon: <FileText className="w-5 h-5" />,
            submenu: [
                {
                    name: 'Tüm Sayfalar',
                    translationKey: 'allPages',
                    icon: <FileType className="w-4 h-4" />,
                    href: '/pages',
                },
                {
                    name: 'Yeni Sayfa Oluştur',
                    translationKey: 'createPage',
                    icon: <Plus className="w-4 h-4" />,
                    href: '/pages/create',
                },
            ],
        },
        {
            name: 'Özel Sayfalar',
            translationKey: 'specialPages',
            icon: <Star className="w-5 h-5" />,
            submenu: [
                {
                    name: 'Ana Sayfa',
                    translationKey: 'home',
                    icon: <Home className="w-4 h-4" />,
                    href: '/home',
                },
                {
                    name: 'İletişim',
                    translationKey: 'contact',
                    icon: <Mail className="w-4 h-4" />,
                    href: '/pages/contact',
                },
                {
                    name: 'İletişim Form Kayıtları',
                    translationKey: 'contactSubmissions',
                    icon: <FileText className="w-4 h-4" />,
                    href: '/pages/contact/submissions',
                },
                {
                    name: 'FAQ',
                    translationKey: 'faq',
                    icon: <HelpCircle className="w-4 h-4" />,
                    href: '/pages/faq',
                },
            ],
        },
        {
            name: 'Medya',
            translationKey: 'media',
            icon: <Image className="w-5 h-5" />,
            href: '/media',
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-pink"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <aside
                className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ${
                    sidebarOpen ? 'w-64' : 'w-20'
                } bg-white border-r border-gray-200 shadow-sm`}
            >
                <div className="h-full flex flex-col">
                    <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                        {sidebarOpen && (
                            <div>
                                <h2 className="text-xl font-bold text-primary-pink">
                                    {t('title')}
                                </h2>
                                <p className="text-xs text-gray-500 mt-1">{t('subtitle')}</p>
                            </div>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="ml-auto"
                        >
                            {sidebarOpen ? (
                                <ChevronLeft className="w-5 h-5 text-primary-pink" />
                            ) : (
                                <ChevronRight className="w-5 h-5 text-primary-pink" />
                            )}
                        </Button>
                    </div>

                    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                        {menuItems.map((item) => {
                            if (item.submenu) {
                                const isAnySubmenuActive = item.submenu.some(sub => pathname === sub.href);
                                const isOpen = openMenus.includes(item.translationKey);

                                return (
                                    <Collapsible
                                        key={item.translationKey}
                                        open={isOpen}
                                        onOpenChange={() => toggleMenu(item.translationKey)}
                                    >
                                        <CollapsibleTrigger asChild>
                                            <button
                                                className={`w-full flex items-center ${
                                                    sidebarOpen ? 'px-3' : 'px-0 justify-center'
                                                } py-3 rounded-lg transition-all duration-200 group ${
                                                    isAnySubmenuActive
                                                        ? 'bg-pink-50 text-primary-pink font-semibold'
                                                        : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                            >
                                                <span
                                                    className={`${
                                                        isAnySubmenuActive
                                                            ? 'text-primary-pink'
                                                            : 'text-gray-400 group-hover:text-gray-600'
                                                    }`}
                                                >
                                                    {item.icon}
                                                </span>
                                                {sidebarOpen && (
                                                    <>
                                                        <span className="ml-3 flex-1 text-left">
                                                            {t(item.translationKey as any)}
                                                        </span>
                                                        <ChevronDown
                                                            className={`w-4 h-4 transition-transform ${
                                                                isOpen ? 'rotate-180' : ''
                                                            }`}
                                                        />
                                                    </>
                                                )}
                                            </button>
                                        </CollapsibleTrigger>
                                        {sidebarOpen && (
                                            <CollapsibleContent className="mt-1 space-y-1">
                                                {item.submenu.map((subItem) => {
                                                    const isActive = pathname === subItem.href;
                                                    return (
                                                        <Link
                                                            key={subItem.href}
                                                            href={subItem.href}
                                                            className={`flex items-center ml-4 px-3 py-2 rounded-lg transition-all duration-200 group ${
                                                                isActive
                                                                    ? 'bg-pink-100 text-primary-pink font-medium'
                                                                    : 'text-gray-600 hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            <span
                                                                className={
                                                                    isActive
                                                                        ? 'text-primary-pink'
                                                                        : 'text-gray-400'
                                                                }
                                                            >
                                                                {subItem.icon}
                                                            </span>
                                                            <span className="ml-2 text-sm">
                                                                {t(subItem.translationKey as any)}
                                                            </span>
                                                        </Link>
                                                    );
                                                })}
                                            </CollapsibleContent>
                                        )}
                                    </Collapsible>
                                );
                            }

                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href!}
                                    className={`flex items-center ${
                                        sidebarOpen ? 'px-3' : 'px-0 justify-center'
                                    } py-3 rounded-lg transition-all duration-200 group ${
                                        isActive
                                            ? 'bg-pink-50 text-primary-pink font-semibold'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                    title={!sidebarOpen ? t(item.translationKey as any) : ''}
                                >
                                    <span
                                        className={`${
                                            isActive
                                                ? 'text-primary-pink'
                                                : 'text-gray-400 group-hover:text-gray-600'
                                        }`}
                                    >
                                        {item.icon}
                                    </span>
                                    {sidebarOpen && (
                                        <span className="ml-3">{t(item.translationKey as any)}</span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    <Separator />

                    <div className="p-4">
                        {sidebarOpen ? (
                            <div>
                                <div className="flex items-center mb-3">
                                    <Avatar>
                                        <AvatarFallback className="bg-primary-pink text-white">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="ml-3 flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 truncate">
                                            {user?.name}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                    </div>
                                </div>
                                <Button
                                    onClick={handleLogout}
                                    variant="outline"
                                    className="w-full text-primary-pink border-primary-pink hover:bg-pink-50"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    {t('logout')}
                                </Button>
                            </div>
                        ) : (
                            <Button
                                onClick={handleLogout}
                                variant="ghost"
                                size="icon"
                                className="w-full"
                                title={t('logout')}
                            >
                                <LogOut className="w-5 h-5 text-primary-pink" />
                            </Button>
                        )}
                    </div>
                </div>
            </aside>

            <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
                <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
                    <div className="px-6 py-4 flex items-center justify-between">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden"
                        >
                            <Menu className="w-6 h-6" />
                        </Button>

                        <div className="ml-auto flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Globe className="w-4 h-4" />
                                        {currentLocale.toUpperCase()}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        onClick={() => handleLanguageChange('tr')}
                                        className={currentLocale === 'tr' ? 'bg-pink-50' : ''}
                                    >
                                        🇹🇷 Türkçe
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => handleLanguageChange('en')}
                                        className={currentLocale === 'en' ? 'bg-pink-50' : ''}
                                    >
                                        🇬🇧 English
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
    const [locale, setLocale] = useState('tr');

    useEffect(() => {
        const savedLocale = localStorage.getItem('locale') || 'tr';
        setLocale(savedLocale);
    }, []);

    const messages = locale === 'tr' ? trMessages : enMessages;

    return (
        <NextIntlClientProvider
            locale={locale}
            messages={messages}
            timeZone="Europe/Istanbul"
        >
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </NextIntlClientProvider>
    );
}