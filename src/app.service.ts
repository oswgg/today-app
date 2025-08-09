import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from './i18n/generated/i18n.generated';

@Injectable()
export class AppService {
    constructor(private readonly translator: I18nService<I18nTranslations>) {}
    getHello(): string {
        return this.translator.t('app.hello');
    }
}
