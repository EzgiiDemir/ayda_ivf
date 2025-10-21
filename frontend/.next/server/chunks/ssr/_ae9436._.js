module.exports = {

"[project]/i18n/request.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$server$2f$react$2d$server$2f$getRequestConfig$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__getRequestConfig$3e$__ = __turbopack_import__("[project]/node_modules/next-intl/dist/esm/development/server/react-server/getRequestConfig.js [app-rsc] (ecmascript) <export default as getRequestConfig>");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$server$2f$react$2d$server$2f$getRequestConfig$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__getRequestConfig$3e$__["getRequestConfig"])(async ({ requestLocale })=>{
    let locale = await requestLocale;
    const locales = [
        'en',
        'tr'
    ];
    const defaultLocale = 'tr';
    if (!locale || !locales.includes(locale)) {
        locale = defaultLocale;
    }
    const baseMessages = (await __turbopack_module_context__({
        "../src/messages/en.json": {
            id: ()=>"[project]/src/messages/en.json (json, async loader)",
            module: ()=>__turbopack_require__("[project]/src/messages/en.json (json, async loader)")(__turbopack_import__)
        },
        "../src/messages/en/Footer.json": {
            id: ()=>"[project]/src/messages/en/Footer.json (json, async loader)",
            module: ()=>__turbopack_require__("[project]/src/messages/en/Footer.json (json, async loader)")(__turbopack_import__)
        },
        "../src/messages/en/acupuncture.json": {
            id: ()=>"[project]/src/messages/en/acupuncture.json (json, async loader)",
            module: ()=>__turbopack_require__("[project]/src/messages/en/acupuncture.json (json, async loader)")(__turbopack_import__)
        },
        "../src/messages/en/contact.json": {
            id: ()=>"[project]/src/messages/en/contact.json (json, async loader)",
            module: ()=>__turbopack_require__("[project]/src/messages/en/contact.json (json, async loader)")(__turbopack_import__)
        },
        "../src/messages/en/contactMap.json": {
            id: ()=>"[project]/src/messages/en/contactMap.json (json, async loader)",
            module: ()=>__turbopack_require__("[project]/src/messages/en/contactMap.json (json, async loader)")(__turbopack_import__)
        },
        "../src/messages/en/eggDonation.json": {
            id: ()=>"[project]/src/messages/en/eggDonation.json (json, async loader)",
            module: ()=>__turbopack_require__("[project]/src/messages/en/eggDonation.json (json, async loader)")(__turbopack_import__)
        },
        "../src/messages/en/eggFreezing.json": {
            id: ()=>"[project]/src/messages/en/eggFreezing.json (json, async loader)",
            module: ()=>__turbopack_require__("[project]/src/messages/en/eggFreezing.json (json, async loader)")(__turbopack_import__)
        },
        "../src/messages/en/embryoDonation.json": {
            id: ()=>"[project]/src/messages/en/embryoDonation.json (json, async loader)",
            module: ()=>__turbopack_require__("[project]/src/messages/en/embryoDonation.json (json, async loader)")(__turbopack_import__)
        },
        "../src/messages/en/faq.json": {
            id: ()=>"[project]/src/messages/en/faq.json (json, async loader)",
            module: ()=>__turbopack_require__("[project]/src/messages/en/faq.json (json, async loader)")(__turbopack_import__)
        },
        "../src/messages/en/ivfIcsi.json": {
            id: ()=>"[project]/src/messages/en/ivfIcsi.json (json, async loader)",
            module: ()=>__turbopack_require__("[project]/src/messages/en/ivfIcsi.json (json, async loader)")(__turbopack_import__)
        },
        "../src/messages/en/ovarianEndometrial.json": {
            id: ()=>"[project]/src/messages/en/ovarianEndometrial.json (json, async loader)",
            module: ()=>__turbopack_require__("[project]/src/messages/en/ovarianEndometrial.json (json, async loader)")(__turbopack_import__)
        },
        "../src/messages/en/prices.json": {
            id: ()=>"[project]/src/messages/en/prices.json (json, async loader)",
            module: ()=>__turbopack_require__("[project]/src/messages/en/prices.json (json, async loader)")(__turbopack_import__)
        },
        "../src/messages/en/spermDonation.json": {
            id: ()=>"[project]/src/messages/en/spermDonation.json (json, async loader)",
            module: ()=>__turbopack_require__("[project]/src/messages/en/spermDonation.json (json, async loader)")(__turbopack_import__)
        },
        "../src/messages/en/successRates.json": {
            id: ()=>"[project]/src/messages/en/successRates.json (json, async loader)",
            module: ()=>__turbopack_require__("[project]/src/messages/en/successRates.json (json, async loader)")(__turbopack_import__)
        },
        "../src/messages/en/team.json": {
            id: ()=>"[project]/src/messages/en/team.json (json, async loader)",
            module: ()=>__turbopack_require__("[project]/src/messages/en/team.json (json, async loader)")(__turbopack_import__)
        },
        "../src/messages/en/travel.json": {
            id: ()=>"[project]/src/messages/en/travel.json (json, async loader)",
            module: ()=>__turbopack_require__("[project]/src/messages/en/travel.json (json, async loader)")(__turbopack_import__)
        },
        "../src/messages/en/treatments.json": {
            id: ()=>"[project]/src/messages/en/treatments.json (json, async loader)",
            module: ()=>__turbopack_require__("[project]/src/messages/en/treatments.json (json, async loader)")(__turbopack_import__)
        },
        "../src/messages/en/whyUs.json": {
            id: ()=>"[project]/src/messages/en/whyUs.json (json, async loader)",
            module: ()=>__turbopack_require__("[project]/src/messages/en/whyUs.json (json, async loader)")(__turbopack_import__)
        },
        "../src/messages/tr.json": {
            id: ()=>"[project]/src/messages/tr.json (json, async loader)",
            module: ()=>__turbopack_require__("[project]/src/messages/tr.json (json, async loader)")(__turbopack_import__)
        },
        "../src/messages/tr/Footer.json": {
            id: ()=>"[project]/src/messages/tr/Footer.json (json, async loader)",
            module: ()=>__turbopack_require__("[project]/src/messages/tr/Footer.json (json, async loader)")(__turbopack_import__)
        },
        "../src/messages/tr/acupuncture.json": {
            id: ()=>"[project]/src/messages/tr/acupuncture.json (json, async loader)",
            module: ()=>__turbopack_require__("[project]/src/messages/tr/acupuncture.json (json, async loader)")(__turbopack_import__)
        },
        "../src/messages/tr/contact.json": {
            id: ()=>"[project]/src/messages/tr/contact.json (json, async loader)",
            module: ()=>__turbopack_require__("[project]/src/messages/tr/contact.json (json, async loader)")(__turbopack_import__)
        },
        "../src/messages/tr/contactMap.json": {
            id: ()=>"[project]/src/messages/tr/contactMap.json (json, async loader)",
            module: ()=>__turbopack_require__("[project]/src/messages/tr/contactMap.json (json, async loader)")(__turbopack_import__)
        },
        "../src/messages/tr/eggDonation.json": {
            id: ()=>"[project]/src/messages/tr/eggDonation.json (json, async loader)",
            module: ()=>__turbopack_require__("[project]/src/messages/tr/eggDonation.json (json, async loader)")(__turbopack_import__)
        },
        "../src/messages/tr/eggFreezing.json": {
            id: ()=>"[project]/src/messages/tr/eggFreezing.json (json, async loader)",
            module: ()=>__turbopack_require__("[project]/src/messages/tr/eggFreezing.json (json, async loader)")(__turbopack_import__)
        },
        "../src/messages/tr/embryoDonation.json": {
            id: ()=>"[project]/src/messages/tr/embryoDonation.json (json, async loader)",
            module: ()=>__turbopack_require__("[project]/src/messages/tr/embryoDonation.json (json, async loader)")(__turbopack_import__)
        },
        "../src/messages/tr/faq.json": {
            id: ()=>"[project]/src/messages/tr/faq.json (json, async loader)",
            module: ()=>__turbopack_require__("[project]/src/messages/tr/faq.json (json, async loader)")(__turbopack_import__)
        },
        "../src/messages/tr/ivfIcsi.json": {
            id: ()=>"[project]/src/messages/tr/ivfIcsi.json (json, async loader)",
            module: ()=>__turbopack_require__("[project]/src/messages/tr/ivfIcsi.json (json, async loader)")(__turbopack_import__)
        },
        "../src/messages/tr/ovarianEndometrial.json": {
            id: ()=>"[project]/src/messages/tr/ovarianEndometrial.json (json, async loader)",
            module: ()=>__turbopack_require__("[project]/src/messages/tr/ovarianEndometrial.json (json, async loader)")(__turbopack_import__)
        },
        "../src/messages/tr/prices.json": {
            id: ()=>"[project]/src/messages/tr/prices.json (json, async loader)",
            module: ()=>__turbopack_require__("[project]/src/messages/tr/prices.json (json, async loader)")(__turbopack_import__)
        },
        "../src/messages/tr/spermDonation.json": {
            id: ()=>"[project]/src/messages/tr/spermDonation.json (json, async loader)",
            module: ()=>__turbopack_require__("[project]/src/messages/tr/spermDonation.json (json, async loader)")(__turbopack_import__)
        },
        "../src/messages/tr/successRates.json": {
            id: ()=>"[project]/src/messages/tr/successRates.json (json, async loader)",
            module: ()=>__turbopack_require__("[project]/src/messages/tr/successRates.json (json, async loader)")(__turbopack_import__)
        },
        "../src/messages/tr/team.json": {
            id: ()=>"[project]/src/messages/tr/team.json (json, async loader)",
            module: ()=>__turbopack_require__("[project]/src/messages/tr/team.json (json, async loader)")(__turbopack_import__)
        },
        "../src/messages/tr/travel.json": {
            id: ()=>"[project]/src/messages/tr/travel.json (json, async loader)",
            module: ()=>__turbopack_require__("[project]/src/messages/tr/travel.json (json, async loader)")(__turbopack_import__)
        },
        "../src/messages/tr/treatments.json": {
            id: ()=>"[project]/src/messages/tr/treatments.json (json, async loader)",
            module: ()=>__turbopack_require__("[project]/src/messages/tr/treatments.json (json, async loader)")(__turbopack_import__)
        },
        "../src/messages/tr/whyUs.json": {
            id: ()=>"[project]/src/messages/tr/whyUs.json (json, async loader)",
            module: ()=>__turbopack_require__("[project]/src/messages/tr/whyUs.json (json, async loader)")(__turbopack_import__)
        }
    }).import(`../src/messages/${locale}.json`).catch(()=>({
            default: {}
        }))).default;
    const footer = (await __turbopack_module_context__({
        "../src/messages/en/Footer.json": {
            id: ()=>"[project]/src/messages/en/Footer.json (json, async loader)",
            module: ()=>__turbopack_require__("[project]/src/messages/en/Footer.json (json, async loader)")(__turbopack_import__)
        },
        "../src/messages/tr/Footer.json": {
            id: ()=>"[project]/src/messages/tr/Footer.json (json, async loader)",
            module: ()=>__turbopack_require__("[project]/src/messages/tr/Footer.json (json, async loader)")(__turbopack_import__)
        }
    }).import(`../src/messages/${locale}/Footer.json`).catch(()=>({
            default: {}
        }))).default;
    // const contact = (await import(`../src/messages/${locale}/contact.json`).catch(() => ({ default: {} }))).default;
    const messages = {
        ...baseMessages,
        Footer: footer
    };
    return {
        locale,
        messages
    };
});
}}),
"[project]/i18n/routing.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "Link": (()=>Link),
    "redirect": (()=>redirect),
    "routing": (()=>routing),
    "usePathname": (()=>usePathname),
    "useRouter": (()=>useRouter)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$routing$2f$defineRouting$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__defineRouting$3e$__ = __turbopack_import__("[project]/node_modules/next-intl/dist/esm/development/routing/defineRouting.js [app-rsc] (ecmascript) <export default as defineRouting>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$navigation$2f$react$2d$server$2f$createNavigation$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__createNavigation$3e$__ = __turbopack_import__("[project]/node_modules/next-intl/dist/esm/development/navigation/react-server/createNavigation.js [app-rsc] (ecmascript) <export default as createNavigation>");
;
;
const routing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$routing$2f$defineRouting$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__defineRouting$3e$__["defineRouting"])({
    locales: [
        'tr',
        'en'
    ],
    defaultLocale: 'tr'
});
const { Link, redirect, usePathname, useRouter } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$navigation$2f$react$2d$server$2f$createNavigation$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__createNavigation$3e$__["createNavigation"])(routing);
}}),
"[project]/src/components/layout/navbar.tsx (client proxy) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/components/layout/navbar.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/layout/navbar.tsx <module evaluation>", "default");
}}),
"[project]/src/components/layout/navbar.tsx (client proxy)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/components/layout/navbar.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/layout/navbar.tsx", "default");
}}),
"[project]/src/components/layout/navbar.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$navbar$2e$tsx__$28$client__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_import__("[project]/src/components/layout/navbar.tsx (client proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$navbar$2e$tsx__$28$client__proxy$29$__ = __turbopack_import__("[project]/src/components/layout/navbar.tsx (client proxy)");
;
__turbopack_export_namespace__(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$navbar$2e$tsx__$28$client__proxy$29$__);
}}),
"[project]/src/types/footer.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "DEFAULT_FOOTER_CONFIG": (()=>DEFAULT_FOOTER_CONFIG)
});
const DEFAULT_FOOTER_CONFIG = {
    address: {
        icon: 'https://api.aydaivf.com/uploads/map_white_1bd6772a21.svg',
        isoLogo: 'https://api.aydaivf.com/uploads/iso1_659752db23.png'
    },
    contact: {
        icon: 'https://api.aydaivf.com/uploads/phone_white_10236cf66a.svg',
        phone: '+90 533 123 4567',
        phoneLink: 'tel:+905331234567',
        email: 'info@aydaivf.com',
        emailLink: 'mailto:info@aydaivf.com',
        socialLinks: [
            {
                id: '1',
                platform: 'facebook',
                url: 'https://facebook.com',
                isActive: true
            },
            {
                id: '2',
                platform: 'instagram',
                url: 'https://instagram.com',
                isActive: true
            },
            {
                id: '3',
                platform: 'youtube',
                url: 'https://youtube.com',
                isActive: true
            }
        ]
    },
    quickAccess: {
        icon: 'https://api.aydaivf.com/uploads/link_white_8ce9830683.svg',
        links: [
            {
                id: '1',
                label: 'home',
                href: '/',
                isActive: true,
                order: 1
            },
            {
                id: '2',
                label: 'treatments',
                href: '/treatments',
                isActive: true,
                order: 2
            },
            {
                id: '3',
                label: 'travel',
                href: '/travel',
                isActive: true,
                order: 3
            }
        ]
    },
    copyrightLogo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYEAAAAlCAYAAACko1VoAAAACXBIWXMAAA7DAAAOwwHHb6hkAAATX0lEQVR4nO1dS28j2XU+t5Q9NWtJZHGG/diRswgSOHDENmwggBfkBAYmswjEtjOTQbRo6hdI+gViL2QbfomCjYxhIx4yCJDYMCIKsA0HCdzkbtzDMavY4trUVirqBrd4LnV069aDFEX2434AQdb71H2c97lknHMwWCx+tpEtMGBlCwAsBmABa5f6XzRmIeL/7Ae2xaDMgK1a410OADTyvc+GgZMNDAwMFBghsGD8ZN0uWGwsABhAwQJWQmFwagErl/pfJGbev7PvVyyAIwuYuJcUKGABnANAOd/7rBW4yMDAwIDACIEl45ONbNECaFjAUhZAhzEo/n3/T7GCoJW5V7EYO/IFCIAr7oHWQNlikEJh8G6+91k7cLGBgYEBwjINsVx88KLX8gDKHnDwgOdHHGpJCBoB1DzOweO86XFe+GvnefWvnD9WPOAFj0PHPwY80b0MDAzeXBhLYIH4H/tBYQVgz2JsdWX82Fa+99me+PHjdVvs30XN/vH7L3r1MMr+M50rWgxOfBcQsLe+6n4+bGXuFSwA52/dz4e/te8L6+IErYG3/tL5o4kPGBgYaGEsgQXhNHOvcAn82QXw0iXnmxecb46A73ayD313zT+eOXse56djDR5qn2xkC2GUjbV9DiMOp0IA/CqTsz0AYVH4MYC/cZ6L34DWReh9DAwMDIwQWBAugdsXnGe/5DxnF8Czl8CfXnKAC87zf8g+8LV+D3jZAzj3OE95nNd/spFd1VHnAV+VTN7f5mB7wFPCnTQ5Z+wqEgLFwMDAIBRGCCwIX3W7ja+4n4v0Tfiy89z5kvO8egF8/xI4XHDY+l/7QeVbZ+5wLAh85p0fcb1P3+PI5KUQAGT4xLM3Gt/D329gYGAQBiMElogvO8/3Ljg/9QUB8Nrv7fuFD8/clsdhB105W0frdkWlcMzgr5m+2B4RywCkoAB+Y5+BgYGBir8I7DG4MzzLPrQtAMHURaC2Lgq6LoGXRxycFYDUiLG6COr+88CtfWctXfRrCBiv/WA90/6nM3eS6im0e8ZE0HfiDvJ/M3ZNuWD+Fge4AmY69CVDzs7aACA+w67Tey1TeHO2H9OS7syX+j1zdrZINp2u03MCJ93+GTO1xyLa8Y0TAtjh2sbM2b4PvnAXA0FkBlkALZLDv9fJPix+ze22/yudK48YnKxwyIvUTwCoXPkf3rY4ZCxg9e+tZ4ofnbl+lo9w81icwxXe22f4/r5rhu+hmWdFWAI5Oysyk3Zx82nX6VU154j2OsHN/a7T28P9Igi9GbipBl2np5VEOTsrYiFbUc/X0KlCFMaJvqx3nfCMKs09503/Ttfpad13cD22xPEyAKTIfvHVBICqHHMx76vitOv0ioG9M7yn7N8pn/+o6/QmRYk5OyuUHHF9RqHDFftpHym03bgPOYfSQscfHdhh14beHwWxuNeW5rpTpLWl7J88M2xMKOeLPq/iJ6UcC7SHcjysHc9xrNSVc49wUxwv6PhX2HmWPCgaTPPZw8Z6nXCCk1GHAh4PuGBuixHwPT94O/bnn4vfVwCtdvZh4e/63dYl5zsXnIsA8tavM/cq24O+YPjlqzGTvxEfkG6ekdzGAPBNdxC/ETdIgCdL6OtyyO9pkMKJfoRMeVn0h44ZbFcHGU4qcAJASQgy1PpeWWD7H6mMC5HBPgoVWLfA3jSXYju3dQIAIcbTSc7OzjompQBooQDT9blsjwAvIsxa144pvG4y3lAgnJLjgfZAeuj+mhQUMiZg44vTbJQCvsArPzhfBnh8ktHzFAu6xllAwOt/yD5c/Xr/i9ol8KYvCDiv/TKTK2wP+mKg7gjyrwC2DtfSfsePBQnJDiJMX8KbBIanevlZmWgHB2HYJwCcYHRyZBKOM1d5xjk5toWa47QIo/sUktOfjxCiNeVcofnv47ekXxyX60c5yvM7Ee8fsGgVtJXzXXJY7beA9qg5R/0MSXtQpiqOPcbPMdnfuAN+skmZYgLQ/jjHvniEc422Tx2Z5ywQ2n+eXPcUAN7D9qBj6gkVjNiOR+T4MV6zo7TjkdKO1Ire0ozFKhEqrrSoQOMOqkoTiJgyu8gcjCC4BYgLZ7jpfu781r5fswB2Lc7yV+PK3soF55UVBu0RQGaFQ10UhW0P+rXDtXQRtUXx25/0V/79xvRM3EGguoP4tJF/MZmKOtM6BtUZrtFpWRVlMOtQpwMYgi6Dik4TikKUOyUCOvrLIVZmifzWuSV6uOkLQtTsqLlPXXKB94+C6mJT2ipJvyXtW8qEj7tOj27X0TVTw49O2NwWwmvR6Dq9yMJIZJzSRSQEgE2uaaE100IGnsI+nUU5ou2uuqvqiiuxgs8EpR33NWOdtuPkXYV7O2dnj8k99+S9CC/X0RbOI0TDIAHnVKKJRhQvkLOzTs7ODkXDS6mDx1pUKosBjPuotJPup4IkUphFyj1XyfnSNVXF4wWFliFeG5gc+CwH75l0sov7ikbleG1VeT91YslBHoooF84I+Nbv7QeVb7z40/CC8/Ll2C2Uv7he9qGCGkoKB+QqHy8d4WOE6aHU9TOavU5Ax8TuApKJdoj2pWOssSDjFEJM6Lukv0noj9NGXZWhokm+H2V1vCKgcysgyIVg6zq9VdFXcYx6RmR0z9WAKrOCphu04DadA1Mrv8gPpaXRCRGilFfRZ9B2DMxFpR1VYVol82CL8DsakxAxpBsrFocKAbiWICllu4XSxkFJJP2Zqxhs3VQmQyVkXwGll7znE7xnG+9JG24TtZcDqUWgIJC0yHN3pY8NBUubmFY20abiUELB18TBdSCECb5fgQ427PAw3+IEUS4cFAa139n3C++/6LUvAeMDnG/9Iv32JD6A98qrzGYk00YVd9BotjqB/JSm9dRQXCl14gZJ6hLS4S60Sy0U+huE/iiXEOD7BdoWJ3QRP69qttCET9wRk0+CagL3De2fMDrpWJplPMY+Q2Hg1G00cztqBJiM6dIgf2D8hQoBlCLSDGrit/SlPcIBa6OviwYjmko2gmReVMJtKuZPHrMrimiaH+OEopqhkHCPu06vgBNF0vJu1+mVkRYXfWyr+Nw8Zp0Ik68g/esJ0JH3Fd+yQfG7oTAr+V6RJqM3ye3nN7fBX+zNHfnxAaj/xr6/+sGLXu2S8+YFjOMDP994+0Z8QBdo4ugimjxv+joB6m+s3cIXmgS0XxtK2wUGaRywL+REcmNOv2v6ddZMk/w+Qqu0fMdt/CaBBkUD2vObBLSK5RzYJAoKIC8MKEtqTOAEU9YoXKL5FjXmTQ21eMkUxbESMUVSOAlKSs5rg9xTwCHXSEIL5Ly2kk5VQNpWyXVt1NwLhJ7JNSKFL2dnDxKMiYbUyNBacYmbQfrypP9aTvrIP4UZ++3ZROqO/PgAA4vxoagdsIA9szjPX2GK6AVAZYXzcXyAQf2nG1k1PhAJWSdgJa8TkHEf6QutTuFbF+0aprXoUjcnriCSFinbuBxj1tuKW6+sMF6d6R2JGFdeFP1N1L7oGKloGFEVx7kU3iXZhzk728TxFqlELBFRfdsOS+udAWHPibKsaPs+w9/CDVJ73eovcMwH3Nkh8aEK8XpI5eg8bD6rQuBYMYVaCsPPqGa3mMQ5O9sh2n8D3TZFZPjnSNSf4bpQCshklS/2aYC6EKAwSeEnzMUjhUBA8s0A6XYS79vCCV/GGESJMINQyIIuC3my5/+pzJhRf73/RfuXmdyOBXDAgG39d+Ze65tnTv3765nyCsCzEYf8CgoH/EhhZx+upUO1ySv/M5U7qErac3eKlMt8YM811Fxr1RUk0UBlQgZHwybxVoT77TxGgIQhKo8+in4q+CX9vkuIalw4R2wUDirtJVSQBN2ViPdeFqL6dp6Y+TmaoGhNxzBfcRRDajcCjB151KkyrqthPEoVAvWQIAaFzkdmS5OMCIUyCgE/Yo8aTxGFQIdMEgcHwFthRGogz+ugmycAjAds4jMjtfQEULUROeGrZDsSwmfvu2ywoEu4hYRAkBW9Hudta2wZCOZd+3XmXvvDM7f93bXMzgrjByOArfq63doe9OuHa+kyaj4ZZKRzMYFx8DSJpVFLeO9OmO9TI4Sp1l4gwXwqzJJkCak4xuKbMDqiEBWQnYX+QJYQ0lXB88vEDSqRx+wUe4k+dR2i+naeAivsOXbCYH+VFOJt3ibH/zVBhWSddaIszWkrhjuo6RRJKqlseCo8ZKAXCINskCDtPjm3jROgrKTFVcIIR0HjqloXalsFjH7LAToRAlMMjCIGuoekipj6mqULbBe1z1ghMGb6zNf+YeKuIUs/yJTOsQsndcV4/VeZXPHjgeu7gFYASiMGRz9cz7RFfOBwLb2DFlesa2hKVMk9Swkn+jQporQPwjT6KJfQMY4TSmdTSUmcClOmiFL6nwSOjqFzCfnAsVpD94dNBJ60bEOvXRJmSf+dBdrnJK1exrlaI+feVSrqUoBun8TV+sgj5aZOuE4QGhgOgZyYJyQt8lNkkHTgUqbY0uyjv2vISI9IKmg7QXWh1MDaSMueXD4AGXcD7/sE79uYwuW0iTEKOZBSSmzBIQU8sbnJQLKBRpxkB5HArazu9QBcP7OH87x3/S9jlRGAeznOGGp8bz2zKuIDJOA4N0FAUhYlwpjx1NAUWIUhKkvIQWZRIelwpUVoflPQH5cl5EO0NU5u2sZRY94gAkpQNDPFchlvNKYSAjj53sOG3kINWTCiMmWEeN459ZXjt1/hSf2e+LuITFWmgq5iJlBAMyDX1bGSboi07CLDLmKNwxBNyX2ks6TkdEdBZso8QcHySBOAaSjfkSDZQD6uU0NxG1cF9Th3POA7KCS2/iP9TpWmiIpA8SXnUiBV7igbpqZUss4LlFHLKk36eUqOR2r22L83yuAXkG1D6d/R0H+snotKDceP1rKN09ReEUwqt2OUt7tGnNJCLduw8UL3h/KgCMQ+Qxmr1B3ZCZwcRJiCNBN8dxA1NeKArpZYxicKGjT7tIOD5N9rEbZYk1pZqTkuGUXSd2v58dpkKKJASyYEOGYHMeL+4dcVvSMM4ort9/u92r9tvC3+QrLEgR38e/qdluoCOlxLVzFbqEwyI+YCNK2rSvn6PECZaE21oERhHnGxRLmEZH/VMO8+j5qfqlXPG5T+QKERZrfQKtAaWT8GMJlgVWM5Uppf1ayWFo0loct48p7YTzUZw9KlKs4DYj5qgqIU9Ll+jCamP6amE+fPOSpQ+ZAq/LBnSPc4IG1qxXBgMbrbwiwlPSXQTVHGQXac9GqZqWOR/wC4Iks9eCgQrnA9aA94xeKsbQHPMAaNRvqdgpIienC4llaFAwjhECUYk0IIWBxwSbI2KjHan0w/lYNXm01FkgryCbKEJGhGk3D91afNsNFVms9IP00VlfGqFtmXku5LcllRYVi3TWKYN+L6VmYQ1ogQyCvvWSDHFhHzqIYpRthHUkiI/vgzJkO00XNAXX5uWH9EjBnaHlL4n+C4rpNn0GA3bQ+6nMQuCs8WWovqdXOBEQLTo4YDqDOL1jlZ/hktgytGAsXAxD//+9vvv+gNP9nIli2AZ4yzjAW+C6ispIg2DtfSUjgUcPAcKJbPbTSuakQKLkVYgFeiNUUuf4sIntgsIWSyt00PjAs8qvRrGQM5Rq0ZuXx0C5lLJuJ5T1/CFNHYanjJ+JR+CHvP4l1ZARKalFEVkrFKhlrSxNXOo9IqQ95NooVLclMBn5eKmoJ9xT0u2nGf3D+jeY/zeVoD5p/FpkcV/b/FiAESiyu5tIMSKB6RvP4PXvTaHsDO+J/DeOlnG29XlSUkMkTrr5JAsRwgT7cH/ZknHGo0zcCB2ZCUicZV3+pA10yZdkXJpJiFfp8O4u4MsxyFxvneHAuvlgLM0HovJE4l33FRQq6qrDA7AQoh2R+6c5o4v6P6ORbo/t4PaY8OtkfAosB9jzTXnSPNcx3fjJv/oF0IhOsGtYL97UF/73AtLVPfTrcH/eK3x/8kdmIBnH40cG9osj9etxsWYyU2ltrv/sOLXhuXlZY++x3MFgKMEfjrKm0P+lEat8GSsIh/slo2SGr1S/+OdCUDje9+Xs+wSb1RexoFMuqPsOYB4w56ScBJnECFJ5aV8IvJIHPFWONfN7IFLBorSheQjA9sD/qJAvcGy8OC8u6X/Y7DGLffS4NFWCcoBGcShHc9Xow76CWDzi57fOYMPeBlD+B8xHnGu04RrdJ6haglJAwMDAx0MELgFcG3zty2B7yKtQal+rot4wOyaErEB9roDhJuoVX5T2QGBgYGYTBCYHmQJqj8jtXiPzxz6x6H49G48OzgR+u2XGJaBhSFIPj0cC3NccE+U31qYGAQCSMEFgfpD/QZM/ruH20P+pKBJ8qE8a0Bzjuj8f8FNH4wXkKijtkETfIPVSIAbSwBAwODSJjsoAUBg7gy5/4xMm4fSqbPjWM6YE1AywJIMWDNjwfum75iooGBwYwwQmCBOFxLN0hRSgezeMqkOKqzPeiHLp9BQQUHAzi2gFU/Hrivwxo0BgYGC4QRAgsEZu/UNdWJgC6cMgZ7EwEFgfybTZcBNCyAoQVs+NHAfaP/Zs/AwCAZjBBYAtCdc2MZhVkLuw7X0nItEhlYdoQw+JcphImBgcEbCgD4f1/4R2cX/ad1AAAAAElFTkSuQmCC'
};
}}),
"[project]/src/lib/utils/api-helpers.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
/**
 * Get full URL for Strapi media
 */ __turbopack_esm__({
    "fetchWithRetry": (()=>fetchWithRetry),
    "fetchWithTimeout": (()=>fetchWithTimeout),
    "getStrapiMediaUrl": (()=>getStrapiMediaUrl)
});
function getStrapiMediaUrl(url) {
    if (!url) return '';
    // Already a full URL
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    // Relative URL - prepend API URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.aydaivf.com';
    return `${apiUrl}${url}`;
}
async function fetchWithTimeout(url, options = {}, timeout = 5000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(()=>controller.abort(), timeout);
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        return response;
    } finally{
        clearTimeout(timeoutId);
    }
}
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
    let lastError;
    for(let i = 0; i < maxRetries; i++){
        try {
            const response = await fetchWithTimeout(url, options);
            if (response.ok) return response;
            // Don't retry on 4xx errors
            if (response.status >= 400 && response.status < 500) {
                return response;
            }
        } catch (error) {
            lastError = error;
            // Wait before retry with exponential backoff
            if (i < maxRetries - 1) {
                await new Promise((resolve)=>setTimeout(resolve, Math.pow(2, i) * 1000));
            }
        }
    }
    throw lastError;
}
}}),
"[project]/src/lib/api/footer.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "getFooterConfig": (()=>getFooterConfig)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$footer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/types/footer.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$api$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/lib/utils/api-helpers.ts [app-rsc] (ecmascript)");
;
;
;
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';
const REVALIDATE_TIME_RAW = Number(process.env.FOOTER_REVALIDATE_TIME ?? '3600');
const REVALIDATE_TIME = Number.isFinite(REVALIDATE_TIME_RAW) ? REVALIDATE_TIME_RAW : 3600;
const asArray = (v)=>Array.isArray(v) ? v : [];
const media = (input)=>{
    const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$api$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStrapiMediaUrl"])(input);
    return url && url.length > 0 ? url : undefined;
};
const getFooterConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(async (locale)=>{
    try {
        if (!API_URL) {
            console.warn('[Footer] NEXT_PUBLIC_API_URL not set — returning DEFAULT_FOOTER_CONFIG');
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$footer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DEFAULT_FOOTER_CONFIG"];
        }
        const url = `${API_URL}/api/footer?locale=${encodeURIComponent(locale)}&populate=deep`;
        const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$api$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchWithRetry"])(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...process.env.API_TOKEN ? {
                    Authorization: `Bearer ${process.env.API_TOKEN}`
                } : {}
            },
            next: {
                revalidate: REVALIDATE_TIME,
                tags: [
                    `footer-${locale}`
                ]
            }
        }, 0);
        if (!res || !res.ok) {
            console.error(`[Footer] Footer API error: ${res ? `${res.status} ${res.statusText}` : 'no response'}`);
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$footer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DEFAULT_FOOTER_CONFIG"];
        }
        const data = await res.json();
        // transformFooterData fonksiyonu null/undefined güvenli olsun
        return transformFooterData(data);
    } catch (error) {
        console.error('[Footer] Error fetching footer config:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$footer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DEFAULT_FOOTER_CONFIG"];
    }
});
function transformFooterData(payload) {
    try {
        const attrs = payload?.data?.attributes ?? {};
        const social = asArray(attrs?.contact?.socialLinks).filter((link)=>link?.isActive !== false).map((link)=>({
                ...link,
                url: link?.url || '#'
            }));
        const quickLinks = asArray(attrs?.quickAccess?.links).filter((l)=>l?.isActive !== false).sort((a, b)=>(a?.order ?? 0) - (b?.order ?? 0));
        return {
            address: {
                icon: media(attrs?.address?.icon) ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$footer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DEFAULT_FOOTER_CONFIG"].address.icon,
                isoLogo: media(attrs?.address?.isoLogo) ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$footer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DEFAULT_FOOTER_CONFIG"].address.isoLogo,
                text: attrs?.address?.text ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$footer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DEFAULT_FOOTER_CONFIG"].address.text
            },
            contact: {
                icon: media(attrs?.contact?.icon) ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$footer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DEFAULT_FOOTER_CONFIG"].contact.icon,
                phone: attrs?.contact?.phone ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$footer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DEFAULT_FOOTER_CONFIG"].contact.phone,
                phoneLink: attrs?.contact?.phoneLink ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$footer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DEFAULT_FOOTER_CONFIG"].contact.phoneLink,
                email: attrs?.contact?.email ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$footer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DEFAULT_FOOTER_CONFIG"].contact.email,
                emailLink: attrs?.contact?.emailLink ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$footer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DEFAULT_FOOTER_CONFIG"].contact.emailLink,
                socialLinks: social
            },
            quickAccess: {
                icon: media(attrs?.quickAccess?.icon) ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$footer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DEFAULT_FOOTER_CONFIG"].quickAccess.icon,
                links: quickLinks
            },
            copyrightLogo: media(attrs?.copyrightLogo?.data?.attributes?.url) ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$footer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DEFAULT_FOOTER_CONFIG"].copyrightLogo,
            copyrightText: attrs?.copyrightText ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$footer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DEFAULT_FOOTER_CONFIG"].copyrightText
        };
    } catch (err) {
        console.error('[Footer] transformFooterData error:', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$footer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DEFAULT_FOOTER_CONFIG"];
    }
}
}}),
"[project]/src/components/layout/footer.tsx [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
const e = new Error(`Could not parse module '[project]/src/components/layout/footer.tsx'

Unexpected eof`);
e.code = 'MODULE_UNPARSEABLE';
throw e;}}),
"[project]/src/components/FooterSkeleton.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>FooterSkeleton)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
;
function FooterSkeleton() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: "mt-auto bg-primary-blue pt-10 flex flex-col gap-10 animate-pulse",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto px-4",
                children: [
                    1,
                    2,
                    3
                ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-md p-5 h-64",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-10 h-10 bg-gray-200 rounded-md mx-auto mb-4"
                            }, void 0, false, {
                                fileName: "[project]/src/components/FooterSkeleton.tsx",
                                lineNumber: 8,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-6 bg-gray-200 rounded w-32 mx-auto mb-4"
                            }, void 0, false, {
                                fileName: "[project]/src/components/FooterSkeleton.tsx",
                                lineNumber: 9,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-4 bg-gray-200 rounded w-full"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/FooterSkeleton.tsx",
                                        lineNumber: 11,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-4 bg-gray-200 rounded w-3/4 mx-auto"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/FooterSkeleton.tsx",
                                        lineNumber: 12,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-4 bg-gray-200 rounded w-5/6 mx-auto"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/FooterSkeleton.tsx",
                                        lineNumber: 13,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/FooterSkeleton.tsx",
                                lineNumber: 10,
                                columnNumber: 25
                            }, this)
                        ]
                    }, i, true, {
                        fileName: "[project]/src/components/FooterSkeleton.tsx",
                        lineNumber: 7,
                        columnNumber: 21
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/FooterSkeleton.tsx",
                lineNumber: 5,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col md:flex-row justify-center items-center gap-2 py-4 bg-gray-600/30",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-4 bg-gray-200/50 rounded w-48"
                    }, void 0, false, {
                        fileName: "[project]/src/components/FooterSkeleton.tsx",
                        lineNumber: 20,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-4 bg-gray-200/50 rounded w-32"
                    }, void 0, false, {
                        fileName: "[project]/src/components/FooterSkeleton.tsx",
                        lineNumber: 21,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/FooterSkeleton.tsx",
                lineNumber: 19,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/FooterSkeleton.tsx",
        lineNumber: 4,
        columnNumber: 9
    }, this);
}
}}),
"[project]/src/app/[locale]/layout.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>LocaleLayout),
    "generateStaticParams": (()=>generateStaticParams)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_import__("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$i18n$2f$routing$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/i18n/routing.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$navbar$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/components/layout/navbar.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$footer$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/components/layout/footer.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$FooterSkeleton$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/components/FooterSkeleton.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$server$2f$react$2d$server$2f$RequestLocaleCache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__setCachedRequestLocale__as__setRequestLocale$3e$__ = __turbopack_import__("[project]/node_modules/next-intl/dist/esm/development/server/react-server/RequestLocaleCache.js [app-rsc] (ecmascript) <export setCachedRequestLocale as setRequestLocale>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$server$2f$react$2d$server$2f$getMessages$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__getMessages$3e$__ = __turbopack_import__("[project]/node_modules/next-intl/dist/esm/development/server/react-server/getMessages.js [app-rsc] (ecmascript) <export default as getMessages>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$server$2f$NextIntlClientProviderServer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__NextIntlClientProvider$3e$__ = __turbopack_import__("[project]/node_modules/next-intl/dist/esm/development/react-server/NextIntlClientProviderServer.js [app-rsc] (ecmascript) <export default as NextIntlClientProvider>");
;
;
;
;
;
;
;
;
;
;
function generateStaticParams() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$i18n$2f$routing$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["routing"].locales.map((locale)=>({
            locale
        }));
}
async function LocaleLayout({ children, params }) {
    const { locale } = await params;
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$i18n$2f$routing$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["routing"].locales.includes(locale)) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$server$2f$react$2d$server$2f$RequestLocaleCache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__setCachedRequestLocale__as__setRequestLocale$3e$__["setRequestLocale"])(locale);
    const messages = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$server$2f$react$2d$server$2f$getMessages$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__getMessages$3e$__["getMessages"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("html", {
        lang: locale,
        suppressHydrationWarning: true,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("body", {
            suppressHydrationWarning: true,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$server$2f$NextIntlClientProviderServer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__NextIntlClientProvider$3e$__["NextIntlClientProvider"], {
                messages: messages,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$navbar$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/src/app/[locale]/layout.tsx",
                        lineNumber: 35,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "min-h-screen",
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/src/app/[locale]/layout.tsx",
                        lineNumber: 36,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Suspense"], {
                        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$FooterSkeleton$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                            fileName: "[project]/src/app/[locale]/layout.tsx",
                            lineNumber: 37,
                            columnNumber: 33
                        }, void 0),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$footer$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                            locale: locale
                        }, void 0, false, {
                            fileName: "[project]/src/app/[locale]/layout.tsx",
                            lineNumber: 38,
                            columnNumber: 17
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/[locale]/layout.tsx",
                        lineNumber: 37,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/[locale]/layout.tsx",
                lineNumber: 34,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/[locale]/layout.tsx",
            lineNumber: 33,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/[locale]/layout.tsx",
        lineNumber: 32,
        columnNumber: 9
    }, this);
}
}}),
"[project]/src/app/[locale]/layout.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_export_namespace__(__turbopack_import__("[project]/src/app/[locale]/layout.tsx [app-rsc] (ecmascript)"));
}}),

};

//# sourceMappingURL=_ae9436._.js.map