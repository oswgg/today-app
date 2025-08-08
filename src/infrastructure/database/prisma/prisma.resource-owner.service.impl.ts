import { ResourceOwnerService } from 'src/domain/services/resource-owner.service';
import { PrismaService } from './prisma.service';

const prismaTableToModelMapping: { [key: string]: string } = {
    events: 'event',
    venues: 'venue',
};

export class PrismaResourceOwnerService
    extends PrismaService<any, any>
    implements ResourceOwnerService
{
    async isOwner(
        table: string,
        ownerField: string,
        identifierField: string,
        ownerValue: number,
        identifierValue: number,
    ): Promise<unknown> {
        const modelName = prismaTableToModelMapping[table];

        const modelToSearch = this[modelName] as {
            findFirst: (options: any) => Promise<any>;
        };

        const register: unknown = await modelToSearch.findFirst({
            where: {
                [ownerField]: ownerValue,
                [identifierField]: identifierValue,
            },
        });

        return register;
    }
}
