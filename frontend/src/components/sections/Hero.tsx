'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { heroService } from '@/src/services/hero.service';
import { HeroConfig } from '@/src/types/hero.types';
import { DEFAULT_HERO_CONFIG } from '@/src/config/hero.config';

export default function Hero() {
    const params = useParams();
    const locale = (params?.locale as string) || 'tr';

    const [currentSlide, setCurrentSlide] = useState(0);
    const [config, setConfig] = useState<HeroConfig>(DEFAULT_HERO_CONFIG);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch config from API
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                setIsLoading(true);
                const data = await heroService.getHeroConfig(locale);
                console.log('Hero config loaded:', data);
                setConfig(data);
            } catch (error) {
                console.error('Error fetching hero config:', error);
                setConfig(DEFAULT_HERO_CONFIG);
            } finally {
                setIsLoading(false);
            }
        };
        fetchConfig();
    }, [locale]);

    // Auto-play slides
    useEffect(() => {
        if (!config.autoPlay || config.slides.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % config.slides.length);
        }, config.autoPlayInterval);

        return () => clearInterval(timer);
    }, [config.slides.length, config.autoPlayInterval, config.autoPlay]);

    // Loading state
    if (isLoading) {
        return (
            <section className="h-[calc(70dvh-80px)] md:h-[calc(100dvh-80px)] relative overflow-hidden bg-gray-200 animate-pulse" />
        );
    }

    // No slides - show default
    if (!config.slides || config.slides.length === 0) {
        return (
            <section className="h-[calc(70dvh-80px)] md:h-[calc(100dvh-80px)] relative overflow-hidden bg-gray-800 flex items-center justify-center">
                <p className="text-white text-2xl">No slides configured</p>
            </section>
        );
    }

    return (
        <section className="h-[calc(70dvh-80px)] md:h-[calc(100dvh-80px)] relative overflow-hidden">
            {/* Slides */}
            <div className="w-full h-full z-30 relative">
                <div className="w-full h-full relative">
                    {config.slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
                                index === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                        >
                            <div
                                className="w-full h-full"
                                style={{
                                    backgroundImage: config.dotsPattern
                                        ? `url("${config.dotsPattern}"), url("${slide.image.url}")`
                                        : `url("${slide.image.url}")`,
                                    backgroundRepeat: config.dotsPattern ? 'repeat, no-repeat' : 'no-repeat',
                                    backgroundPosition: config.dotsPattern ? 'left top, center center' : 'center center',
                                    backgroundSize: config.dotsPattern ? 'auto, cover' : 'cover',
                                }}
                            />
                            <div
                                className="absolute inset-0 bg-black"
                                style={{ opacity: slide.overlayOpacity || 0.4 }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Center Text - Slide'dan gelen başlıklar */}
            {config.slides[currentSlide] && (config.slides[currentSlide].title || config.slides[currentSlide].subtitle) && (
                <div className="z-30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center px-4">
                    {config.slides[currentSlide].subtitle && (
                        <p className="text-sm breakpoint-500:text-base md:text-xl text-primary-pink-light">
                            {config.slides[currentSlide].subtitle}
                        </p>
                    )}
                    {config.slides[currentSlide].title && (
                        <p className="text-2xl breakpoint-500:text-3xl md:text-6xl text-primary-pink font-medium mt-2">
                            {config.slides[currentSlide].title}
                        </p>
                    )}
                </div>
            )}

            {/* Right Side Vertical Text - Config'den gelen */}
            {config.rightText && (
                <p className="z-30 font-medium uppercase absolute top-1/2 right-0 -translate-y-1/2 text-xs md:text-xl text-white tracking-[5px] rotate-90 translate-x-[calc(50%-16px)] breakpoint-500:translate-x-[calc(50%-24px)] md:translate-x-[calc(50%-28px)] whitespace-nowrap">
                    {config.rightText}
                </p>
            )}

            {/* Bottom Text - Config'den gelen */}
            {config.bottomText && (
                <div className="flex flex-col sm:flex-row gap-1 items-start sm:gap-0 sm:justify-between absolute bottom-[5px] w-full px-4 z-30">
                    <p className="capitalize text-xs md:text-sm text-white font-medium">
                        {config.bottomText}
                    </p>
                </div>
            )}

            {/* Indicators */}
            {config.slides.length > 1 && config.showIndicators && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-2">
                    {config.slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                index === currentSlide
                                    ? 'bg-primary-pink w-8'
                                    : 'bg-white/50 hover:bg-white/75'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}