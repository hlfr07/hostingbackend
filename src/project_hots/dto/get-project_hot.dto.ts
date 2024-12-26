import { ApiProperty } from "@nestjs/swagger";

export class GetProjectHotDto {
    @ApiProperty()
    id: number;
    @ApiProperty()
    zipProject: any;
    @ApiProperty()
    namecarpeta: string;
    @ApiProperty()
    url: string;
    @ApiProperty()
    port: number;
    @ApiProperty()
    estado: boolean;
}