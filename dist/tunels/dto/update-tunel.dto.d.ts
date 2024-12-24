export declare class UpdateTunelDto {
    config: {
        ingress: {
            service: string;
            hostname?: string;
            originRequest?: Record<string, any>;
        }[];
        'warp-routing': {
            enabled: boolean;
        };
    };
}
