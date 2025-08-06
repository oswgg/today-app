import { Injectable, PipeTransform } from '@nestjs/common';
import { Validator } from 'src/infrastructure/http/validator/validator';

@Injectable()
export class ValidationPipe<T> implements PipeTransform {
    constructor(private validator: Validator<T>) {}

    transform(value: unknown) {
        return this.validator.validate(value);
    }
}
