export interface HeroSlide {
    image: {
        url: string;
        alt: string;
    };
    title?: string;
    subtitle?: string;
    overlayOpacity?: number;
    order?: number;
    isActive?: boolean;
}

export interface HeroConfig {
    slides: HeroSlide[];
    rightText: string;
    bottomText: string;
    dotsPattern: string;
    autoPlay: boolean;
    autoPlayInterval: number;
    showControls: boolean;
    showIndicators: boolean;
    showCounter: boolean;
    mobileHeight: string;
    desktopHeight: string;
    meta?: string;
}

export interface HeroApiResponse {
    data: Partial<HeroConfig>;
    success: boolean;
    message?: string;
}

export interface HeroError {
    message: string;
    code?: string;
}