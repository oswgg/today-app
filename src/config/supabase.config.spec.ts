import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SupabaseConfig } from './supabase.config';
import { ConfigModule } from './config.module';

describe('SupabaseConfig', () => {
    let config: SupabaseConfig;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SupabaseConfig,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn(),
                    },
                },
            ],
            imports: [ConfigModule],
        }).compile();

        config = module.get<SupabaseConfig>(SupabaseConfig);
        configService = module.get<ConfigService>(ConfigService);
    });

    it('should be defined', () => {
        expect(config).toBeDefined();
    });

    it('should return supabase URL when environment variable is set', () => {
        const mockUrl = 'https://test.supabase.co';
        jest.spyOn(configService, 'get').mockReturnValue(mockUrl);

        expect(config.supabaseUrl).toBe(mockUrl);
    });

    it('should throw error when SUPABASE_AUTH_URL is not set', () => {
        jest.spyOn(configService, 'get').mockReturnValue(undefined);

        expect(() => config.supabaseUrl).toThrow(
            'SUPABASE_AUTH_URL environment variable is required',
        );
    });

    it('should return supabase key when environment variable is set', () => {
        const mockKey = 'test-key';
        jest.spyOn(configService, 'get').mockReturnValue(mockKey);

        expect(config.supabaseKey).toBe(mockKey);
    });

    it('should throw error when SUPABASE_API_KEY is not set', () => {
        jest.spyOn(configService, 'get').mockReturnValue(undefined);

        expect(() => config.supabaseKey).toThrow(
            'SUPABASE_API_KEY environment variable is required',
        );
    });
});
