import {
    IntlCache,
    IntlShape,
    createIntlCache,
    createIntl
} from '@formatjs/intl';
import { capitalize } from './common/utils';
import { LocaleMessages } from './LocaleMessages';
import en from './locale/en';

export class LocaleManager {
    private static messages: LocaleMessages = en;
    private static locale: string = 'en';

    private intlCache: IntlCache = createIntlCache();
    private intl: IntlShape;

    public constructor(private fieldName: string) {
        this.intl = createIntl({
            locale: LocaleManager.locale,
            messages: LocaleManager.messages,
        }, this.intlCache);
    }

    public localize(message: string, params?: Record<string, any>): string {
        return capitalize(this.intl.formatMessage({
            id: message,
            defaultMessage: message
        }, {
            name: this.fieldName,
            ...(params || {})
        }));
    }

    public static setLocale(locale: string, messages: LocaleMessages): void {
        LocaleManager.locale = locale;
        LocaleManager.messages = messages;
    }
}
