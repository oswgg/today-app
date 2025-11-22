import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AddInterestCategoriesDto } from 'src/application/dtos/user/interests/categories/add-interest-categories.dto';
import { RemoveInterestCategoriesDto } from 'src/application/dtos/user/interests/categories/remove-interest-categories.dto';
import { AddInterestCategories } from 'src/application/use-cases/user/interests/categories/add-interest-categories.usecase';
import { RemoveInterestCategories } from 'src/application/use-cases/user/interests/categories/remove-interest-categories.usecase';
import { ListUserInterestCategories } from 'src/application/use-cases/user/interests/categories/list-user-interest-categories.usecase';
import { IsUserInterested } from 'src/application/use-cases/user/interests/categories/is-user-interested-category.usecase';
import { UserRoleGuard } from '../shared/guards/user-role.guard';
import { RequiredRole } from '../shared/decorators/required-user-role.decorator';
import { UserRole } from 'src/domain/types/user-role.enum';
import { User } from '../shared/decorators/user.decorator';
import { JwtUserPayload } from 'src/domain/entities/auth/jwt-payload.entity';
import { ZodValidator } from 'src/infrastructure/http/validator/zod/zod.validator';
import { ZodAddInterestCategoriesSchema } from 'src/infrastructure/http/validator/zod/user/interests/categories/zod.add-interest-categories.schema';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { ZodRemoveInterestCategoriesSchema } from 'src/infrastructure/http/validator/zod/user/interests/categories/zod.remove-interest-category.schema';

@ApiTags('User Interests')
@ApiBearerAuth('JWT-auth')
@Controller('user/interests')
@UseGuards(UserRoleGuard)
@RequiredRole([UserRole.USER])
export class UserInterestsController {
    constructor(
        private readonly addInterests: AddInterestCategories,
        private readonly removeInterests: RemoveInterestCategories,
        private readonly listInterests: ListUserInterestCategories,
        private readonly isInterested: IsUserInterested,
    ) {}

    @Get('/categories')
    async list(@User() user: JwtUserPayload) {
        return this.listInterests.execute(user.id);
    }

    @Post('/categories')
    async add(
        @User() user: JwtUserPayload,
        @Body(
            new ValidationPipe(
                new ZodValidator(ZodAddInterestCategoriesSchema),
            ),
        )
        body: AddInterestCategoriesDto,
    ) {
        return this.addInterests.execute(user.id, body.categoryIds);
    }

    @Delete('/categories')
    async remove(
        @User() user: JwtUserPayload,
        @Body(
            new ValidationPipe(
                new ZodValidator(ZodRemoveInterestCategoriesSchema),
            ),
        )
        body: RemoveInterestCategoriesDto,
    ) {
        return this.removeInterests.execute(user.id, body.categoryIds);
    }

    @Get('/categories/:categoryId')
    async checkInterestInCategory(
        @User() user: JwtUserPayload,
        @Param('categoryId', ParseIntPipe) categoryId: number,
    ) {
        const interested = await this.isInterested.execute(user.id, categoryId);
        return { interested };
    }
}
