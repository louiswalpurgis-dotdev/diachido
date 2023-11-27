import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

/*
    vi: Việt Nam
    en: English
    zh: Chinese
    ja: Japanese
    ko: Korean
*/
i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: require('~/locales/en/translate.json'),
            },
            vi: {
                translation: require('~/locales/vi/translate.json'),
            },
            zh: {
                translation: require('~/locales/zh/translate.json'),
            },
            ja: {
                translation: require('~/locales/ja/translate.json'),
            },
            ko: {
                translation: require('~/locales/ko/translate.json'),
            },
        },
        lng: 'vi',
        fallbackLng: 'en',
        supportedLngs: ['en', 'vi', 'zh', 'ja', 'ko'],
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        },
    });
export default i18n;
