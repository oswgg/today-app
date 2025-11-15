import { SetMetadata } from '@nestjs/common';
import {
    RequiredRole,
    REQUIRED_ROLE_KEY,
    RequiredRoleOptions,
} from './required-user-role.decorator';
import { UserRole } from 'src/domain/types/user-role.enum';

jest.mock('@nestjs/common', () => ({
    SetMetadata: jest.fn((key: string, value: any) => {
        return (target: any) => {
            target[key] = value;
            return target;
        };
    }),
}));

describe('RequiredRole Decorator', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(RequiredRole).toBeDefined();
        expect(REQUIRED_ROLE_KEY).toBeDefined();
    });

    it('should have the correct metadata key', () => {
        expect(REQUIRED_ROLE_KEY).toBe('requiredUserRole');
    });

    it('should call SetMetadata with correct parameters for single ORGANIZER role', () => {
        const roles: RequiredRoleOptions = [UserRole.ORGANIZER];
        RequiredRole(roles);

        expect(SetMetadata).toHaveBeenCalledWith(REQUIRED_ROLE_KEY, roles);
        expect(SetMetadata).toHaveBeenCalledTimes(1);
    });

    it('should call SetMetadata with correct parameters for single INSTITUTION role', () => {
        const roles: RequiredRoleOptions = [UserRole.INSTITUTION];
        RequiredRole(roles);

        expect(SetMetadata).toHaveBeenCalledWith(REQUIRED_ROLE_KEY, roles);
        expect(SetMetadata).toHaveBeenCalledTimes(1);
    });

    it('should call SetMetadata with correct parameters for multiple roles', () => {
        const roles: RequiredRoleOptions = [
            UserRole.ORGANIZER,
            UserRole.INSTITUTION,
        ];
        RequiredRole(roles);

        expect(SetMetadata).toHaveBeenCalledWith(REQUIRED_ROLE_KEY, roles);
        expect(SetMetadata).toHaveBeenCalledTimes(1);
    });

    it('should call SetMetadata with correct parameters for all roles', () => {
        const roles: RequiredRoleOptions = [
            UserRole.ORGANIZER,
            UserRole.INSTITUTION,
            UserRole.USER,
        ];
        RequiredRole(roles);

        expect(SetMetadata).toHaveBeenCalledWith(REQUIRED_ROLE_KEY, roles);
        expect(SetMetadata).toHaveBeenCalledTimes(1);
    });

    it('should handle empty array', () => {
        const roles: RequiredRoleOptions = [];
        RequiredRole(roles);

        expect(SetMetadata).toHaveBeenCalledWith(REQUIRED_ROLE_KEY, roles);
        expect(SetMetadata).toHaveBeenCalledTimes(1);
    });

    it('should return a decorator function', () => {
        const roles: RequiredRoleOptions = [UserRole.ORGANIZER];
        const decorator = RequiredRole(roles);

        expect(typeof decorator).toBe('function');
    });

    it('should properly attach metadata to target', () => {
        const roles: RequiredRoleOptions = [
            UserRole.ORGANIZER,
            UserRole.INSTITUTION,
        ];
        const decorator = RequiredRole(roles);
        const target: any = function () {};

        decorator(target);

        expect(target[REQUIRED_ROLE_KEY]).toEqual(roles);
    });
});
