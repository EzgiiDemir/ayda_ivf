import tr from '../../../../ayda/frontend/src/messages/tr.json';
import en from '../../../../ayda/frontend/src/messages/en.json';

export function useTranslations(locale = 'tr') {
    const messages = locale === 'en' ? en : tr;
    return (key) => messages[key] || key;
}
