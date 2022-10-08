import I18n from 'react-native-i18n';
//import { Localization } from 'expo';
//import i18n from 'i18n-js';
import en from './en';
import fr from './fr';

I18n.fallbacks = true;
I18n.currentLocale();


I18n.translations = {
    fr,
    en
};
//i18n.locale = Localization.locale;

export default I18n;