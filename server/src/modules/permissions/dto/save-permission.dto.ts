import { IsNotEmpty, IsObject } from "class-validator";

export class SavePermissionDto {
    @IsNotEmpty()
    role_id: number;

    @IsObject()
    @IsNotEmpty()
    permission: object;
}
