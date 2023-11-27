import { formatDistanceToNow } from 'date-fns';
import { vi, ja, enUS, ko, zhCN } from 'date-fns/locale';

export default function formatTimeToNow(date, locale) {
    switch (locale) {
        case 'vi':
            locale = vi;
            break;
        case 'en':
            locale = enUS;
            break;
        case 'ja':
            locale = ja;
            break;
        case 'ko':
            locale = ko;
            break;
        case 'zh':
            locale = zhCN;
            break;
        default:
            locale = vi;
            break;
    }
    return formatDistanceToNow(date, { locale: locale });
}
