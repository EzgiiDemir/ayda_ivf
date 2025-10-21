import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    const locales = ['en', 'tr'];
    const defaultLocale = 'tr';

    if (!locale || !locales.includes(locale)) {
        locale = defaultLocale;
    }

    const baseMessages = (await import(`../src/messages/${locale}.json`).catch(() => ({ default: {} }))).default;

    const footer = (await import(`../src/messages/${locale}/Footer.json`).catch(() => ({ default: {} }))).default;
    // const contact = (await import(`../src/messages/${locale}/contact.json`).catch(() => ({ default: {} }))).default;

    const messages = {
        ...baseMessages,
        Footer: footer,
        // contact: contact
    };

    return {
        locale,
        messages
    };
});
