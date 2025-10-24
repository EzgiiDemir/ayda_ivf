module.exports = {

"[project]/src/config/hero.config.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "DEFAULT_HERO_CONFIG": (()=>DEFAULT_HERO_CONFIG),
    "HERO_API_CONFIG": (()=>HERO_API_CONFIG),
    "HERO_CACHE_CONFIG": (()=>HERO_CACHE_CONFIG)
});
const DEFAULT_HERO_CONFIG = {
    slides: [],
    rightText: 'FERTILITY CLINIC',
    bottomText: 'creating miracles',
    dotsPattern: '',
    autoPlay: true,
    autoPlayInterval: 6000,
    showControls: true,
    showIndicators: true,
    showCounter: false,
    mobileHeight: 'calc(70dvh - 80px)',
    desktopHeight: 'calc(100dvh - 80px)',
    meta: ''
};
const HERO_API_CONFIG = {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    endpoint: '/api/hero',
    timeout: 10000
};
const HERO_CACHE_CONFIG = {
    key: 'hero_config',
    ttl: 3600000,
    enabled: true
};
}}),
"[project]/src/services/hero.service.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "HeroService": (()=>HeroService),
    "heroService": (()=>heroService)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$hero$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/config/hero.config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
;
;
class HeroService {
    cache;
    constructor(){
        this.cache = new Map();
    }
    /**
     * Get hero configuration from API with caching
     */ async getHeroConfig(locale) {
        // Check cache first
        if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$hero$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HERO_CACHE_CONFIG"].enabled) {
            const cached = this.getFromCache(locale);
            if (cached) {
                console.log(`[HeroService] Using cached config for locale: ${locale}`);
                return cached;
            }
        }
        try {
            const config = await this.fetchFromApi(locale);
            if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$hero$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HERO_CACHE_CONFIG"].enabled) {
                this.saveToCache(locale, config);
            }
            return config;
        } catch (error) {
            console.error('[HeroService] Failed to fetch config:', error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$hero$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_HERO_CONFIG"];
        }
    }
    /**
     * Fetch hero config from API
     */ /**
     * Fetch hero config from API
     */ async fetchFromApi(locale) {
        const url = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$hero$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HERO_API_CONFIG"].baseURL}${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$hero$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HERO_API_CONFIG"].endpoint}`;
        console.log('[HeroService] Request Details:', {
            url,
            locale,
            fullURL: `${url}?locale=${locale}`
        });
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(url, {
                params: {
                    locale
                },
                timeout: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$hero$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HERO_API_CONFIG"].timeout,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('[HeroService] Response:', response.data);
            if (!response.data || !response.data.data) {
                throw new Error('Invalid API response structure');
            }
            const config = this.validateAndTransformConfig(response.data.data);
            return config;
        } catch (error) {
            if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].isAxiosError(error)) {
                const axiosError = error;
                // Enhanced error logging
                console.error('[HeroService] Axios Error Details:', {
                    status: axiosError.response?.status,
                    statusText: axiosError.response?.statusText,
                    data: axiosError.response?.data,
                    headers: axiosError.response?.headers,
                    requestURL: axiosError.config?.url,
                    requestParams: axiosError.config?.params
                });
                if (axiosError.response) {
                    throw new Error(`API Error: ${axiosError.response.status} - ${JSON.stringify(axiosError.response.data) || 'Unknown error'}`);
                } else if (axiosError.request) {
                    throw new Error('No response from API server');
                } else {
                    throw new Error(`Request error: ${axiosError.message}`);
                }
            }
            throw error;
        }
    }
    /**
     * Validate and transform API config
     */ validateAndTransformConfig(config) {
        const slides = (config.slides ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$hero$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_HERO_CONFIG"].slides).filter((s)=>s.isActive !== false).sort((a, b)=>(a.order ?? 0) - (b.order ?? 0)).map((s)=>({
                ...s,
                image: {
                    url: s.image?.url ?? '',
                    alt: s.image?.alt ?? s.title ?? ''
                },
                overlayOpacity: s.overlayOpacity ?? 0.4,
                order: s.order ?? 0,
                isActive: s.isActive ?? true,
                id: s.id
            }));
        if (slides.length === 0) {
            console.warn('[HeroService] No active slides found, using defaults');
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$hero$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_HERO_CONFIG"];
        }
        const validatedConfig = {
            slides,
            rightText: config.rightText ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$hero$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_HERO_CONFIG"].rightText,
            bottomText: config.bottomText ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$hero$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_HERO_CONFIG"].bottomText,
            dotsPattern: config.dotsPattern ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$hero$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_HERO_CONFIG"].dotsPattern,
            autoPlay: config.autoPlay ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$hero$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_HERO_CONFIG"].autoPlay,
            autoPlayInterval: config.autoPlayInterval ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$hero$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_HERO_CONFIG"].autoPlayInterval,
            showControls: config.showControls ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$hero$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_HERO_CONFIG"].showControls,
            showIndicators: config.showIndicators ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$hero$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_HERO_CONFIG"].showIndicators,
            showCounter: config.showCounter ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$hero$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_HERO_CONFIG"].showCounter,
            mobileHeight: config.mobileHeight ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$hero$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_HERO_CONFIG"].mobileHeight,
            desktopHeight: config.desktopHeight ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$hero$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_HERO_CONFIG"].desktopHeight,
            meta: config.meta ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$hero$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_HERO_CONFIG"].meta ?? ''
        };
        return validatedConfig;
    }
    preloadImages(config) {
        if ("TURBOPACK compile-time truthy", 1) return;
        "TURBOPACK unreachable";
    }
    /**
     * Get config from cache
     */ getFromCache(locale) {
        const cacheKey = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$hero$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HERO_CACHE_CONFIG"].key}_${locale}`;
        const cached = this.cache.get(cacheKey);
        if (!cached) {
            return null;
        }
        const now = Date.now();
        const isExpired = now - cached.timestamp > __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$hero$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HERO_CACHE_CONFIG"].ttl;
        if (isExpired) {
            this.cache.delete(cacheKey);
            return null;
        }
        return cached.data;
    }
    /**
     * Save config to cache
     */ saveToCache(locale, config) {
        const cacheKey = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$hero$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HERO_CACHE_CONFIG"].key}_${locale}`;
        this.cache.set(cacheKey, {
            data: config,
            timestamp: Date.now()
        });
    }
    /**
     * Clear cache for specific locale or all
     */ clearCache(locale) {
        if (locale) {
            const cacheKey = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$hero$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HERO_CACHE_CONFIG"].key}_${locale}`;
            this.cache.delete(cacheKey);
            console.log(`[HeroService] Cache cleared for locale: ${locale}`);
        } else {
            this.cache.clear();
            console.log('[HeroService] All cache cleared');
        }
    }
    /**
     * Prefetch config for multiple locales
     */ async prefetchConfigs(locales) {
        const promises = locales.map((locale)=>this.getHeroConfig(locale).catch((err)=>{
                console.error(`[HeroService] Failed to prefetch for locale ${locale}:`, err);
            }));
        await Promise.allSettled(promises);
        console.log('[HeroService] Prefetch completed');
    }
    /**
     * Force refresh config from API
     */ async refreshConfig(locale) {
        this.clearCache(locale);
        return this.getHeroConfig(locale);
    }
}
const heroService = new HeroService();
;
}}),
"[project]/src/components/sections/Hero.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>Hero)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$hero$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/services/hero.service.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$hero$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/config/hero.config.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
function Hero() {
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useParams"])();
    const locale = params?.locale || 'tr';
    const [currentSlide, setCurrentSlide] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [config, setConfig] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$hero$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_HERO_CONFIG"]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const fetchConfig = async ()=>{
            try {
                setIsLoading(true);
                const data = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$hero$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heroService"].getHeroConfig(locale);
                console.log('✅ Hero config loaded:', data);
                setConfig(data);
            } catch (error) {
                console.error('❌ Error fetching hero config:', error);
                setConfig(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$hero$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_HERO_CONFIG"]);
            } finally{
                setIsLoading(false);
            }
        };
        fetchConfig();
    }, [
        locale
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!config.autoPlay || config.slides.length <= 1) return;
        const timer = setInterval(()=>{
            setCurrentSlide((prev)=>(prev + 1) % config.slides.length);
        }, config.autoPlayInterval);
        return ()=>clearInterval(timer);
    }, [
        config.slides.length,
        config.autoPlayInterval,
        config.autoPlay
    ]);
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "h-[calc(70dvh-80px)] md:h-[calc(100dvh-80px)] relative overflow-hidden bg-gray-200 animate-pulse"
        }, void 0, false, {
            fileName: "[project]/src/components/sections/Hero.tsx",
            lineNumber: 46,
            columnNumber: 13
        }, this);
    }
    if (!config.slides || config.slides.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "h-[calc(70dvh-80px)] md:h-[calc(100dvh-80px)] relative overflow-hidden bg-gray-800 flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-white text-2xl",
                children: "No slides configured"
            }, void 0, false, {
                fileName: "[project]/src/components/sections/Hero.tsx",
                lineNumber: 53,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/sections/Hero.tsx",
            lineNumber: 52,
            columnNumber: 13
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "h-[calc(70dvh-80px)] md:h-[calc(100dvh-80px)] relative overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full h-full z-30 relative",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full h-full relative",
                    children: config.slides.map((slide, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `absolute inset-0 w-full h-full transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-full h-full",
                                    style: {
                                        backgroundImage: config.dotsPattern ? `url("${config.dotsPattern}"), url("${slide.image.url}")` : `url("${slide.image.url}")`,
                                        backgroundRepeat: config.dotsPattern ? 'repeat, no-repeat' : 'no-repeat',
                                        backgroundPosition: config.dotsPattern ? 'left top, center center' : 'center center',
                                        backgroundSize: config.dotsPattern ? 'auto, cover' : 'cover'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/sections/Hero.tsx",
                                    lineNumber: 70,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute inset-0 bg-black",
                                    style: {
                                        opacity: slide.overlayOpacity || 0.4
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/sections/Hero.tsx",
                                    lineNumber: 81,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, index, true, {
                            fileName: "[project]/src/components/sections/Hero.tsx",
                            lineNumber: 64,
                            columnNumber: 25
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/components/sections/Hero.tsx",
                    lineNumber: 62,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/sections/Hero.tsx",
                lineNumber: 61,
                columnNumber: 13
            }, this),
            config.slides[currentSlide] && (config.slides[currentSlide].title || config.slides[currentSlide].subtitle) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "z-30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center px-4",
                children: [
                    config.slides[currentSlide].subtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm breakpoint-500:text-base md:text-xl text-primary-pink-light",
                        children: config.slides[currentSlide].subtitle
                    }, void 0, false, {
                        fileName: "[project]/src/components/sections/Hero.tsx",
                        lineNumber: 93,
                        columnNumber: 25
                    }, this),
                    config.slides[currentSlide].title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-2xl breakpoint-500:text-3xl md:text-6xl text-primary-pink font-medium mt-2",
                        children: config.slides[currentSlide].title
                    }, void 0, false, {
                        fileName: "[project]/src/components/sections/Hero.tsx",
                        lineNumber: 98,
                        columnNumber: 25
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/sections/Hero.tsx",
                lineNumber: 91,
                columnNumber: 17
            }, this),
            config.rightText && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "z-30 font-medium uppercase absolute top-1/2 right-0 -translate-y-1/2 text-xs md:text-xl text-white tracking-[5px] rotate-90 translate-x-[calc(50%-16px)] breakpoint-500:translate-x-[calc(50%-24px)] md:translate-x-[calc(50%-28px)] whitespace-nowrap",
                children: config.rightText
            }, void 0, false, {
                fileName: "[project]/src/components/sections/Hero.tsx",
                lineNumber: 106,
                columnNumber: 17
            }, this),
            config.bottomText && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row gap-1 items-start sm:gap-0 sm:justify-between absolute bottom-[5px] w-full px-4 z-30",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "capitalize text-xs md:text-sm text-white font-medium",
                    children: config.bottomText
                }, void 0, false, {
                    fileName: "[project]/src/components/sections/Hero.tsx",
                    lineNumber: 113,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/sections/Hero.tsx",
                lineNumber: 112,
                columnNumber: 17
            }, this),
            config.slides.length > 1 && config.showIndicators && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-2",
                children: config.slides.map((_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setCurrentSlide(index),
                        className: `w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-primary-pink w-8' : 'bg-white/50 hover:bg-white/75'}`,
                        "aria-label": `Go to slide ${index + 1}`
                    }, index, false, {
                        fileName: "[project]/src/components/sections/Hero.tsx",
                        lineNumber: 123,
                        columnNumber: 25
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/sections/Hero.tsx",
                lineNumber: 121,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/sections/Hero.tsx",
        lineNumber: 59,
        columnNumber: 9
    }, this);
}
}}),
"[project]/src/config/welcome.config.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "DEFAULT_WELCOME_CONFIG": (()=>DEFAULT_WELCOME_CONFIG),
    "WELCOME_API_CONFIG": (()=>WELCOME_API_CONFIG),
    "WELCOME_CACHE_CONFIG": (()=>WELCOME_CACHE_CONFIG)
});
const DEFAULT_WELCOME_CONFIG = {
    image: {
        url: 'https://api.aydaivf.com/uploads/1617890130_4018_org_74c04c13d4.png',
        alt: 'Ayda CEO',
        width: 400,
        height: 400
    },
    gradient: {
        from: '#F7DFE6',
        via: '#FFFFFF',
        to: '#FFFFFF'
    },
    title_top: 'HOŞGELDİNİZ',
    title: 'AYDA IVF',
    paragraphs: [
        'Hoş geldiniz paragraf 1',
        'Hoş geldiniz paragraf 2',
        'Hoş geldiniz paragraf 3',
        'Hoş geldiniz paragraf 4',
        'Hoş geldiniz paragraf 5'
    ],
    signature_name: 'Dr. Ayda Yılmaz',
    signature_title: 'CEO & Founder',
    meta: {
        version: '1.0.0'
    }
};
const WELCOME_API_CONFIG = {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    endpoint: '/api/welcome',
    timeout: 5000
};
const WELCOME_CACHE_CONFIG = {
    key: 'welcome_config',
    ttl: 3600000,
    enabled: true
};
}}),
"[project]/src/services/welcome.service.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "WelcomeService": (()=>WelcomeService),
    "welcomeService": (()=>welcomeService)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$welcome$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/config/welcome.config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
;
;
class WelcomeService {
    cache;
    constructor(){
        this.cache = new Map();
    }
    async getWelcomeConfig(locale) {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$welcome$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WELCOME_CACHE_CONFIG"].enabled) {
            const cached = this.getFromCache(locale);
            if (cached) {
                console.log(`[WelcomeService] Using cached config for locale: ${locale}`);
                return cached;
            }
        }
        try {
            const config = await this.fetchFromApi(locale);
            if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$welcome$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WELCOME_CACHE_CONFIG"].enabled) {
                this.saveToCache(locale, config);
            }
            return config;
        } catch (error) {
            console.error('[WelcomeService] Failed to fetch config:', error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$welcome$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_WELCOME_CONFIG"];
        }
    }
    async fetchFromApi(locale) {
        const url = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$welcome$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WELCOME_API_CONFIG"].baseURL}${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$welcome$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WELCOME_API_CONFIG"].endpoint}`;
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(url, {
                params: {
                    locale
                },
                timeout: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$welcome$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WELCOME_API_CONFIG"].timeout,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.data || !response.data.data) {
                throw new Error('Invalid API response structure');
            }
            return this.validateConfig(response.data.data);
        } catch (error) {
            if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].isAxiosError(error)) {
                const axiosError = error;
                console.error('[WelcomeService] API Error:', axiosError.response?.data);
            }
            throw error;
        }
    }
    validateConfig(config) {
        return {
            image: config.image || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$welcome$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_WELCOME_CONFIG"].image,
            gradient: config.gradient || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$welcome$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_WELCOME_CONFIG"].gradient,
            title_top: config.title_top || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$welcome$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_WELCOME_CONFIG"].title_top,
            title: config.title || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$welcome$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_WELCOME_CONFIG"].title,
            paragraphs: config.paragraphs || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$welcome$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_WELCOME_CONFIG"].paragraphs,
            signature_name: config.signature_name || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$welcome$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_WELCOME_CONFIG"].signature_name,
            signature_title: config.signature_title || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$welcome$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_WELCOME_CONFIG"].signature_title,
            meta: config.meta
        };
    }
    getFromCache(locale) {
        const cacheKey = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$welcome$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WELCOME_CACHE_CONFIG"].key}_${locale}`;
        const cached = this.cache.get(cacheKey);
        if (!cached) return null;
        const now = Date.now();
        const isExpired = now - cached.timestamp > __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$welcome$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WELCOME_CACHE_CONFIG"].ttl;
        if (isExpired) {
            this.cache.delete(cacheKey);
            return null;
        }
        return cached.data;
    }
    saveToCache(locale, config) {
        const cacheKey = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$welcome$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WELCOME_CACHE_CONFIG"].key}_${locale}`;
        this.cache.set(cacheKey, {
            data: config,
            timestamp: Date.now()
        });
    }
    clearCache(locale) {
        if (locale) {
            const cacheKey = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$welcome$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WELCOME_CACHE_CONFIG"].key}_${locale}`;
            this.cache.delete(cacheKey);
        } else {
            this.cache.clear();
        }
    }
}
const welcomeService = new WelcomeService();
;
}}),
"[project]/src/components/sections/Welcome.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>Welcome)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$welcome$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/services/welcome.service.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$welcome$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/config/welcome.config.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
function Welcome() {
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useParams"])();
    const locale = params?.locale || 'tr';
    const [config, setConfig] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$welcome$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_WELCOME_CONFIG"]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let mounted = true;
        const fetchConfig = async ()=>{
            try {
                setIsLoading(true);
                const data = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$welcome$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["welcomeService"].getWelcomeConfig(locale);
                console.log('✅ Welcome config loaded:', data);
                if (mounted) setConfig(data);
            } catch (error) {
                console.error('❌ Error fetching welcome config:', error);
                if (mounted) setConfig(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$welcome$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_WELCOME_CONFIG"]);
            } finally{
                if (mounted) setIsLoading(false);
            }
        };
        fetchConfig();
        return ()=>{
            mounted = false;
        };
    }, [
        locale
    ]);
    // Loading skeleton
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "py-7 md:py-14 bg-white",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mx-auto px-4 max-w-7xl",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col lg:flex-row gap-8 lg:gap-12 lg:items-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "lg:flex-[0.4] flex items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full max-w-[700px] lg:max-w-none aspect-square bg-gray-200 animate-pulse rounded-br-[37%] rounded-bl-[37%]"
                            }, void 0, false, {
                                fileName: "[project]/src/components/sections/Welcome.tsx",
                                lineNumber: 43,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/sections/Welcome.tsx",
                            lineNumber: 42,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "lg:flex-[0.6] space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-8 bg-gray-200 animate-pulse rounded w-3/4 mx-auto lg:mx-0"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/sections/Welcome.tsx",
                                    lineNumber: 47,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-3",
                                    children: [
                                        ...Array(5)
                                    ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-4 bg-gray-200 animate-pulse rounded"
                                        }, i, false, {
                                            fileName: "[project]/src/components/sections/Welcome.tsx",
                                            lineNumber: 50,
                                            columnNumber: 37
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/sections/Welcome.tsx",
                                    lineNumber: 48,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/sections/Welcome.tsx",
                            lineNumber: 46,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/sections/Welcome.tsx",
                    lineNumber: 41,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/sections/Welcome.tsx",
                lineNumber: 40,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/sections/Welcome.tsx",
            lineNumber: 39,
            columnNumber: 13
        }, this);
    }
    // Main content
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "py-7 md:py-14 bg-white",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto px-4 max-w-7xl",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col lg:flex-row gap-8 lg:gap-12 lg:items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:flex-[0.4] flex items-center justify-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-full max-w-[700px] lg:max-w-none aspect-square relative rounded-br-[37%] rounded-bl-[37%] overflow-hidden",
                            style: {
                                background: `radial-gradient(circle, ${config.gradient.from}, ${config.gradient.via} 45%, ${config.gradient.to} 65%)`
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                src: config.image.url,
                                alt: config.image.alt || 'Welcome Image',
                                width: config.image.width || 400,
                                height: config.image.height || 400,
                                className: "w-full h-full object-contain",
                                style: {
                                    position: 'absolute',
                                    inset: 0,
                                    height: '100%',
                                    width: '100%',
                                    filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))'
                                },
                                priority: true
                            }, void 0, false, {
                                fileName: "[project]/src/components/sections/Welcome.tsx",
                                lineNumber: 73,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/sections/Welcome.tsx",
                            lineNumber: 67,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/sections/Welcome.tsx",
                        lineNumber: 66,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:flex-[0.6] space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center mb-6",
                                children: [
                                    config.title_top && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-primary-pink uppercase text-xs md:text-sm font-medium tracking-wide mb-2",
                                        children: config.title_top
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/sections/Welcome.tsx",
                                        lineNumber: 95,
                                        columnNumber: 33
                                    }, this),
                                    config.title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900",
                                        children: config.title
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/sections/Welcome.tsx",
                                        lineNumber: 100,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/sections/Welcome.tsx",
                                lineNumber: 93,
                                columnNumber: 25
                            }, this),
                            config.paragraphs && config.paragraphs.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm md:text-base text-gray-700 space-y-3",
                                children: config.paragraphs.map((paragraph, index)=>paragraph ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-justify leading-relaxed",
                                        children: paragraph
                                    }, index, false, {
                                        fileName: "[project]/src/components/sections/Welcome.tsx",
                                        lineNumber: 110,
                                        columnNumber: 41
                                    }, this) : null)
                            }, void 0, false, {
                                fileName: "[project]/src/components/sections/Welcome.tsx",
                                lineNumber: 107,
                                columnNumber: 29
                            }, this),
                            (config.signature_name || config.signature_title) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-right mt-8 pt-4",
                                children: [
                                    config.signature_name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-lg md:text-xl font-bold text-gray-900 mb-1",
                                        children: config.signature_name
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/sections/Welcome.tsx",
                                        lineNumber: 121,
                                        columnNumber: 37
                                    }, this),
                                    config.signature_title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-primary-pink text-sm md:text-base font-medium",
                                        children: config.signature_title
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/sections/Welcome.tsx",
                                        lineNumber: 126,
                                        columnNumber: 37
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/sections/Welcome.tsx",
                                lineNumber: 119,
                                columnNumber: 29
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/sections/Welcome.tsx",
                        lineNumber: 92,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/sections/Welcome.tsx",
                lineNumber: 64,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/sections/Welcome.tsx",
            lineNumber: 63,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/sections/Welcome.tsx",
        lineNumber: 62,
        columnNumber: 9
    }, this);
}
}}),
"[project]/src/config/treatments.config.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "DEFAULT_TREATMENTS_CONFIG": (()=>DEFAULT_TREATMENTS_CONFIG),
    "TREATMENTS_API_CONFIG": (()=>TREATMENTS_API_CONFIG),
    "TREATMENTS_CACHE_CONFIG": (()=>TREATMENTS_CACHE_CONFIG)
});
const DEFAULT_TREATMENTS_CONFIG = {
    background_logo: '/images/logoonly.svg',
    top_title: 'TEDAVİLERİMİZ',
    title: 'Tedavi Yöntemlerimiz',
    description1: 'AYDA IVF, en güncel tedavi yöntemleri ve teknolojileriyle size en iyi hizmeti sunmak için burada.',
    description2: 'Uzman kadromuz ve modern ekipmanlarımızla her adımda yanınızdayız.',
    contact_button_text: 'İletişime Geçin',
    treatments: [
        {
            id: 'ivf-icsi',
            label: 'Tüp Bebek (IVF) - ICSI',
            href: '/ivf-icsi',
            order: 1,
            isActive: true
        },
        {
            id: 'egg-donation',
            label: 'Yumurta Donasyonu',
            href: '/egg-donation',
            order: 2,
            isActive: true
        },
        {
            id: 'sperm-donation',
            label: 'Sperm Donasyonu',
            href: '/sperm-donation',
            order: 3,
            isActive: true
        },
        {
            id: 'embryo-donation',
            label: 'Embriyo Donasyonu',
            href: '/embryo-donation',
            order: 4,
            isActive: true
        },
        {
            id: 'ovarian-prp',
            label: 'Ovarian ve Endometrial PRP',
            href: '/ovarian-endometrial-prp',
            order: 5,
            isActive: true
        },
        {
            id: 'genetic-screening',
            label: 'Embriyo Genetik Tarama (NGS, Tek Gen)',
            href: '/genetic-screening',
            order: 6,
            isActive: true
        },
        {
            id: 'gender-selection',
            label: 'Cinsiyet Seçimi (PGD)',
            href: '/gender-selection',
            order: 7,
            isActive: true
        },
        {
            id: 'egg-freezing',
            label: 'Yumurta Dondurma',
            href: '/egg-freezing',
            order: 8,
            isActive: true
        },
        {
            id: 'surrogacy',
            label: 'Taşıyıcı Annelik',
            href: '/surrogacy',
            order: 9,
            isActive: true
        },
        {
            id: 'pgd',
            label: 'Embriyo Genetik Tarama (PGD)',
            href: '/pgd',
            order: 10,
            isActive: true
        }
    ],
    meta: {
        version: '1.0.0'
    }
};
const TREATMENTS_API_CONFIG = {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    endpoint: '/api/treatments',
    timeout: 5000
};
const TREATMENTS_CACHE_CONFIG = {
    key: 'treatments_config',
    ttl: 3600000,
    enabled: true
};
}}),
"[project]/src/services/treatments.service.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "TreatmentsService": (()=>TreatmentsService),
    "treatmentsService": (()=>treatmentsService)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$treatments$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/config/treatments.config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
;
;
class TreatmentsService {
    cache;
    constructor(){
        this.cache = new Map();
    }
    async getTreatmentsConfig(locale) {
        // Check cache first
        if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$treatments$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TREATMENTS_CACHE_CONFIG"].enabled) {
            const cached = this.getFromCache(locale);
            if (cached) {
                console.log(`[TreatmentsService] Using cached config for locale: ${locale}`);
                return cached;
            }
        }
        try {
            const config = await this.fetchFromApi(locale);
            if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$treatments$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TREATMENTS_CACHE_CONFIG"].enabled) {
                this.saveToCache(locale, config);
            }
            return config;
        } catch (error) {
            console.error('[TreatmentsService] Failed to fetch config:', error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$treatments$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_TREATMENTS_CONFIG"];
        }
    }
    async fetchFromApi(locale) {
        const url = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$treatments$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TREATMENTS_API_CONFIG"].baseURL}${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$treatments$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TREATMENTS_API_CONFIG"].endpoint}`;
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(url, {
                params: {
                    locale
                },
                timeout: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$treatments$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TREATMENTS_API_CONFIG"].timeout,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.data || !response.data.data) {
                throw new Error('Invalid API response structure');
            }
            return this.validateConfig(response.data.data);
        } catch (error) {
            if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].isAxiosError(error)) {
                const axiosError = error;
                console.error('[TreatmentsService] API Error:', axiosError.response?.data);
            }
            throw error;
        }
    }
    validateConfig(config) {
        const treatments = (config.treatments || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$treatments$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_TREATMENTS_CONFIG"].treatments).filter((treatment)=>treatment.isActive !== false).sort((a, b)=>(a.order || 0) - (b.order || 0));
        return {
            background_logo: config.background_logo || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$treatments$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_TREATMENTS_CONFIG"].background_logo,
            top_title: config.top_title || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$treatments$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_TREATMENTS_CONFIG"].top_title,
            title: config.title || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$treatments$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_TREATMENTS_CONFIG"].title,
            description1: config.description1 || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$treatments$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_TREATMENTS_CONFIG"].description1,
            description2: config.description2 || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$treatments$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_TREATMENTS_CONFIG"].description2,
            contact_button_text: config.contact_button_text || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$treatments$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_TREATMENTS_CONFIG"].contact_button_text,
            treatments: treatments.length > 0 ? treatments : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$treatments$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_TREATMENTS_CONFIG"].treatments,
            meta: config.meta
        };
    }
    getFromCache(locale) {
        const cacheKey = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$treatments$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TREATMENTS_CACHE_CONFIG"].key}_${locale}`;
        const cached = this.cache.get(cacheKey);
        if (!cached) return null;
        const now = Date.now();
        const isExpired = now - cached.timestamp > __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$treatments$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TREATMENTS_CACHE_CONFIG"].ttl;
        if (isExpired) {
            this.cache.delete(cacheKey);
            return null;
        }
        return cached.data;
    }
    saveToCache(locale, config) {
        const cacheKey = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$treatments$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TREATMENTS_CACHE_CONFIG"].key}_${locale}`;
        this.cache.set(cacheKey, {
            data: config,
            timestamp: Date.now()
        });
    }
    clearCache(locale) {
        if (locale) {
            const cacheKey = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$treatments$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TREATMENTS_CACHE_CONFIG"].key}_${locale}`;
            this.cache.delete(cacheKey);
        } else {
            this.cache.clear();
        }
    }
    async refreshConfig(locale) {
        this.clearCache(locale);
        return this.getTreatmentsConfig(locale);
    }
}
const treatmentsService = new TreatmentsService();
;
}}),
"[project]/src/components/sections/TreatmentMethods.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>TreatmentMethods)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$treatments$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/services/treatments.service.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$treatments$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/config/treatments.config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-ssr] (ecmascript) <export default as Check>");
'use client';
;
;
;
;
;
;
;
function TreatmentMethods() {
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useParams"])();
    const locale = params?.locale || 'tr';
    const [config, setConfig] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$treatments$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_TREATMENTS_CONFIG"]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const fetchConfig = async ()=>{
            try {
                setIsLoading(true);
                const data = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$treatments$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["treatmentsService"].getTreatmentsConfig(locale);
                console.log('✅ Treatments config loaded:', data);
                setConfig(data);
            } catch (error) {
                console.error('❌ Error fetching treatments config:', error);
                setConfig(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$treatments$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_TREATMENTS_CONFIG"]);
            } finally{
                setIsLoading(false);
            }
        };
        fetchConfig();
    }, [
        locale
    ]);
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "w-full bg-white py-7 md:py-14",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full flex justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container max-w-4xl mx-auto flex flex-col items-center text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-6 w-32 bg-gray-200 animate-pulse rounded mb-2"
                        }, void 0, false, {
                            fileName: "[project]/src/components/sections/TreatmentMethods.tsx",
                            lineNumber: 40,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-8 w-64 bg-gray-200 animate-pulse rounded mb-4"
                        }, void 0, false, {
                            fileName: "[project]/src/components/sections/TreatmentMethods.tsx",
                            lineNumber: 41,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2 w-full",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-4 bg-gray-200 animate-pulse rounded w-3/4 mx-auto"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/sections/TreatmentMethods.tsx",
                                    lineNumber: 43,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-4 bg-gray-200 animate-pulse rounded w-2/3 mx-auto"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/sections/TreatmentMethods.tsx",
                                    lineNumber: 44,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/sections/TreatmentMethods.tsx",
                            lineNumber: 42,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 w-full",
                            children: [
                                ...Array(6)
                            ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-6 bg-gray-200 animate-pulse rounded"
                                }, i, false, {
                                    fileName: "[project]/src/components/sections/TreatmentMethods.tsx",
                                    lineNumber: 48,
                                    columnNumber: 33
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/sections/TreatmentMethods.tsx",
                            lineNumber: 46,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/sections/TreatmentMethods.tsx",
                    lineNumber: 39,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/sections/TreatmentMethods.tsx",
                lineNumber: 38,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/sections/TreatmentMethods.tsx",
            lineNumber: 37,
            columnNumber: 13
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "w-full bg-white py-7 md:py-14",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full flex justify-center",
            style: {
                backgroundImage: config.background_logo ? `linear-gradient(90deg, rgba(255,255,255,0.68), rgba(255,255,255,0.68)), url("${config.background_logo}")` : undefined,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                backgroundSize: 'auto 80%'
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container max-w-7xl mx-auto flex flex-col items-center text-center px-4",
                children: [
                    config.top_title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm md:text-base text-primary-pink uppercase font-medium",
                        children: config.top_title
                    }, void 0, false, {
                        fileName: "[project]/src/components/sections/TreatmentMethods.tsx",
                        lineNumber: 75,
                        columnNumber: 25
                    }, this),
                    config.title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-900 capitalize text-2xl md:text-3xl font-medium tracking-wide mb-2",
                        children: config.title
                    }, void 0, false, {
                        fileName: "[project]/src/components/sections/TreatmentMethods.tsx",
                        lineNumber: 80,
                        columnNumber: 25
                    }, this),
                    (config.description1 || config.description2) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm md:text-base text-gray-700",
                        children: [
                            config.description1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mb-0",
                                children: config.description1
                            }, void 0, false, {
                                fileName: "[project]/src/components/sections/TreatmentMethods.tsx",
                                lineNumber: 88,
                                columnNumber: 53
                            }, this),
                            config.description2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: config.description2
                            }, void 0, false, {
                                fileName: "[project]/src/components/sections/TreatmentMethods.tsx",
                                lineNumber: 89,
                                columnNumber: 53
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/sections/TreatmentMethods.tsx",
                        lineNumber: 87,
                        columnNumber: 25
                    }, this),
                    config.treatments && config.treatments.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-4 justify-center items-center flex-wrap max-w-[700px] mx-auto mt-6",
                        children: config.treatments.map((treatment)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: `/${locale}${treatment.href}`,
                                className: "text-xs md:text-sm text-gray-700 font-medium flex gap-1 items-center hover-primary-pink",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                        size: 16,
                                        className: "text-primary-pink flex-shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/sections/TreatmentMethods.tsx",
                                        lineNumber: 102,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "hover:text-primary-pink transition-colors duration-300 cursor-pointer",
                                        children: treatment.label
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/sections/TreatmentMethods.tsx",
                                        lineNumber: 103,
                                        columnNumber: 37
                                    }, this)
                                ]
                            }, treatment.id, true, {
                                fileName: "[project]/src/components/sections/TreatmentMethods.tsx",
                                lineNumber: 97,
                                columnNumber: 33
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/sections/TreatmentMethods.tsx",
                        lineNumber: 95,
                        columnNumber: 25
                    }, this),
                    config.contact_button_text && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: `/${locale}/contact`,
                        className: "bg-primary-pink hover-bg-primary-blue px-5 md:px-8 py-2 md:py-4 rounded-full cursor-pointer transition-colors duration-300 mt-4 md:mt-6 flex items-center justify-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-sm md:text-base text-white capitalize font-medium",
                            children: config.contact_button_text
                        }, void 0, false, {
                            fileName: "[project]/src/components/sections/TreatmentMethods.tsx",
                            lineNumber: 117,
                            columnNumber: 29
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/sections/TreatmentMethods.tsx",
                        lineNumber: 113,
                        columnNumber: 25
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/sections/TreatmentMethods.tsx",
                lineNumber: 72,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/sections/TreatmentMethods.tsx",
            lineNumber: 60,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/sections/TreatmentMethods.tsx",
        lineNumber: 58,
        columnNumber: 9
    }, this);
}
}}),
"[project]/src/config/contactMap.config.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "CONTACT_MAP_API_CONFIG": (()=>CONTACT_MAP_API_CONFIG),
    "CONTACT_MAP_CACHE_CONFIG": (()=>CONTACT_MAP_CACHE_CONFIG),
    "DEFAULT_CONTACT_MAP_CONFIG": (()=>DEFAULT_CONTACT_MAP_CONFIG)
});
const DEFAULT_CONTACT_MAP_CONFIG = {
    image: '/images/showcase.png',
    mapUrl: '',
    showIframe: false,
    meta: {
        version: '1.0.0'
    }
};
const CONTACT_MAP_API_CONFIG = {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    endpoint: '/api/contact-map',
    timeout: 5000
};
const CONTACT_MAP_CACHE_CONFIG = {
    key: 'contact_map_config',
    ttl: 3600000,
    enabled: true
};
}}),
"[project]/src/services/contactMap.service.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "ContactMapService": (()=>ContactMapService),
    "contactMapService": (()=>contactMapService)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$contactMap$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/config/contactMap.config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
;
;
class ContactMapService {
    cache;
    constructor(){
        this.cache = new Map();
    }
    /**
     * Get contact map configuration from API with caching
     */ async getContactMapConfig(locale) {
        // Check cache first
        if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$contactMap$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CONTACT_MAP_CACHE_CONFIG"].enabled) {
            const cached = this.getFromCache(locale);
            if (cached) {
                console.log(`[ContactMapService] Using cached config for locale: ${locale}`);
                return cached;
            }
        }
        try {
            const config = await this.fetchFromApi(locale);
            // Save to cache
            if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$contactMap$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CONTACT_MAP_CACHE_CONFIG"].enabled) {
                this.saveToCache(locale, config);
            }
            return config;
        } catch (error) {
            console.error('[ContactMapService] Failed to fetch config:', error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$contactMap$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_CONTACT_MAP_CONFIG"];
        }
    }
    /**
     * Fetch contact map config from API
     */ async fetchFromApi(locale) {
        const url = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$contactMap$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CONTACT_MAP_API_CONFIG"].baseURL}${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$contactMap$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CONTACT_MAP_API_CONFIG"].endpoint}`;
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(url, {
                params: {
                    locale
                },
                timeout: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$contactMap$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CONTACT_MAP_API_CONFIG"].timeout,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.data || !response.data.data) {
                throw new Error('Invalid API response structure');
            }
            return this.validateConfig(response.data.data);
        } catch (error) {
            if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].isAxiosError(error)) {
                const axiosError = error;
                if (axiosError.response) {
                    throw new Error(`API Error: ${axiosError.response.status} - ${axiosError.response.data?.message || 'Unknown error'}`);
                } else if (axiosError.request) {
                    throw new Error('No response from API server');
                } else {
                    throw new Error(`Request error: ${axiosError.message}`);
                }
            }
            throw error;
        }
    }
    /**
     * Validate and merge with default config
     */ validateConfig(config) {
        return {
            image: config.image || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$contactMap$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_CONTACT_MAP_CONFIG"].image,
            mapUrl: config.mapUrl || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$contactMap$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_CONTACT_MAP_CONFIG"].mapUrl,
            showIframe: config.showIframe ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$contactMap$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_CONTACT_MAP_CONFIG"].showIframe,
            meta: config.meta
        };
    }
    /**
     * Get config from cache
     */ getFromCache(locale) {
        const cacheKey = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$contactMap$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CONTACT_MAP_CACHE_CONFIG"].key}_${locale}`;
        const cached = this.cache.get(cacheKey);
        if (!cached) {
            return null;
        }
        const now = Date.now();
        const isExpired = now - cached.timestamp > __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$contactMap$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CONTACT_MAP_CACHE_CONFIG"].ttl;
        if (isExpired) {
            this.cache.delete(cacheKey);
            return null;
        }
        return cached.data;
    }
    /**
     * Save config to cache
     */ saveToCache(locale, config) {
        const cacheKey = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$contactMap$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CONTACT_MAP_CACHE_CONFIG"].key}_${locale}`;
        this.cache.set(cacheKey, {
            data: config,
            timestamp: Date.now()
        });
    }
    /**
     * Clear cache
     */ clearCache(locale) {
        if (locale) {
            const cacheKey = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$contactMap$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CONTACT_MAP_CACHE_CONFIG"].key}_${locale}`;
            this.cache.delete(cacheKey);
            console.log(`[ContactMapService] Cache cleared for locale: ${locale}`);
        } else {
            this.cache.clear();
            console.log('[ContactMapService] All cache cleared');
        }
    }
    /**
     * Force refresh config from API
     */ async refreshConfig(locale) {
        this.clearCache(locale);
        return this.getContactMapConfig(locale);
    }
}
const contactMapService = new ContactMapService();
;
}}),
"[project]/src/components/sections/ContactMap.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>ContactMap)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$contactMap$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/services/contactMap.service.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$contactMap$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/config/contactMap.config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_import__("[project]/node_modules/next-intl/dist/esm/development/react-client/index.js [app-ssr] (ecmascript) <locals>");
'use client';
;
;
;
;
;
;
function ContactMap() {
    const t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useTranslations"])('contactMap');
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useParams"])();
    const locale = params?.locale || 'tr';
    const [config, setConfig] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$contactMap$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_CONTACT_MAP_CONFIG"]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    // Fetch config from API
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const fetchConfig = async ()=>{
            try {
                setIsLoading(true);
                const data = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$contactMap$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["contactMapService"].getContactMapConfig(locale);
                setConfig(data);
            } catch (error) {
                console.error('Error fetching contact map config:', error);
                setConfig(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$contactMap$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_CONTACT_MAP_CONFIG"]);
            } finally{
                setIsLoading(false);
            }
        };
        fetchConfig();
    }, [
        locale
    ]);
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full aspect-[16/11] md:aspect-[16/6] bg-gray-200 animate-pulse"
            }, void 0, false, {
                fileName: "[project]/src/components/sections/ContactMap.tsx",
                lineNumber: 38,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/sections/ContactMap.tsx",
            lineNumber: 37,
            columnNumber: 13
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        children: config.showIframe && config.mapUrl ? // Google Maps Iframe
        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full aspect-[16/11] md:aspect-[16/6] relative",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("iframe", {
                src: config.mapUrl,
                width: "100%",
                height: "100%",
                style: {
                    border: 0
                },
                allowFullScreen: true,
                loading: "lazy",
                referrerPolicy: "no-referrer-when-downgrade",
                className: "absolute inset-0"
            }, void 0, false, {
                fileName: "[project]/src/components/sections/ContactMap.tsx",
                lineNumber: 48,
                columnNumber: 21
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/sections/ContactMap.tsx",
            lineNumber: 47,
            columnNumber: 17
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full aspect-[16/11] md:aspect-[16/6]",
            style: {
                backgroundImage: `url("${config.image}")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                backgroundSize: 'cover'
            },
            role: "img",
            "aria-label": t('imageAlt') || 'Contact showcase image'
        }, void 0, false, {
            fileName: "[project]/src/components/sections/ContactMap.tsx",
            lineNumber: 60,
            columnNumber: 17
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/sections/ContactMap.tsx",
        lineNumber: 44,
        columnNumber: 9
    }, this);
}
}}),
"[project]/src/app/[locale]/page.tsx [app-rsc] (ecmascript, Next.js server component, client modules ssr)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
}}),
"[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_esm__({
    "__iconNode": (()=>__iconNode),
    "default": (()=>Check)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M20 6 9 17l-5-5",
            key: "1gmf2c"
        }
    ]
];
const Check = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("check", __iconNode);
;
 //# sourceMappingURL=check.js.map
}}),
"[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-ssr] (ecmascript) <export default as Check>": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_esm__({
    "Check": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-ssr] (ecmascript)");
}}),
"[project]/node_modules/next-intl/dist/esm/development/react-client/index.js [app-ssr] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "useFormatter": (()=>useFormatter),
    "useTranslations": (()=>useTranslations)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/use-intl/dist/esm/development/react.js [app-ssr] (ecmascript)");
;
;
/**
 * This is the main entry file when non-'react-server'
 * environments import from 'next-intl'.
 *
 * Maintainer notes:
 * - Make sure this mirrors the API from 'react-server'.
 * - Make sure everything exported from this module is
 *   supported in all Next.js versions that are supported.
 */ // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function callHook(name, hook) {
    return (...args)=>{
        try {
            return hook(...args);
        } catch  {
            throw new Error(`Failed to call \`${name}\` because the context from \`NextIntlClientProvider\` was not found.

This can happen because:
1) You intended to render this component as a Server Component, the render
   failed, and therefore React attempted to render the component on the client
   instead. If this is the case, check the console for server errors.
2) You intended to render this component on the client side, but no context was found.
   Learn more about this error here: https://next-intl.dev/docs/environments/server-client-components#missing-context`);
        }
    };
}
const useTranslations = callHook('useTranslations', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTranslations"]);
const useFormatter = callHook('useFormatter', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFormatter"]);
;
}}),

};

//# sourceMappingURL=_1ee2d8._.js.map