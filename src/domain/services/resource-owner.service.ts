export interface ResourceOwnerService {
    isOwner(
        table: string,
        ownerField: string,
        identifierField: string,
        ownerValue: number | bigint,
        identifierValue: number | bigint,
    ): Promise<unknown>;
}

export const RESOURCE_OWNER_SERVICE = Symbol('resourcer_owner.service');
