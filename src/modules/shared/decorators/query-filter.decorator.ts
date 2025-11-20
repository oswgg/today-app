import {
    createParamDecorator,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { QueryStringParser } from 'src/domain/shared/utils/query-string-parser';
import { QueryOptions } from 'src/application/dtos/shared/query-options.dto';
import { I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

/**
 * Custom decorator to parse query string filters with optional field whitelist
 *
 * Usage in controller:
 * ```typescript
 * // Allow filtering by any field
 * @Get('/')
 * async findAll(@QueryFilter() filters?: QueryOptions<EventEntity>) {
 *   return this.service.findAll(filters);
 * }
 *
 * // Only allow filtering by specific fields
 * @Get('/')
 * async findAll(
 *   @QueryFilter<EventEntity>(['creator_id', 'location_id', 'status'])
 *   filters?: QueryOptions<EventEntity>
 * ) {
 *   return this.service.findAll(filters);
 * }
 * ```
 *
 * Example requests:
 * - GET /events?q=creator_id=eq[1],location_id=in[1,2,3]
 * - GET /events?q=status=eq[active],created_at=gte[2024-01-01]
 */
export const QueryFilter = createParamDecorator(
    <T>(
        allowedFields: Array<keyof T> | undefined,
        ctx: ExecutionContext,
    ): QueryOptions<T> | undefined => {
        const request = ctx.switchToHttp().getRequest();
        const queryString = request.query.q as string | undefined;
        const i18n = I18nContext.current<I18nTranslations>();

        const { filters, rejectedFields } = QueryStringParser.parse<T>(
            queryString,
            allowedFields,
        );

        // If there are rejected fields, throw forbidden exception with i18n message
        if (rejectedFields.length > 0) {
            const message = i18n?.t('app.errors.filtering_not_allowed', {
                args: {
                    field: rejectedFields[0],
                    allowedFields: allowedFields?.join(', ') || 'none',
                },
            });
            throw new ForbiddenException(message);
        }

        return filters;
    },
);
