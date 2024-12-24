import { ApiProperty } from '@nestjs/swagger';

export class UpdateTunelDto {
  @ApiProperty({
    description: 'The configuration object for the tunnel',
    example: {
      ingress: [
        {
          service: 'http://localhost:3000',
          hostname: 'mouse.theinnovatesoft.xyz',
          originRequest: {}
        },
        {
          service: 'http://localhost:4000',
          hostname: 'segundo_mouse.theinnovatesoft.xyz',
          originRequest: {}
        },
        {
          service: 'http_status:404'
        }
      ],
      'warp-routing': {
        enabled: false
      }
    },
  })
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
