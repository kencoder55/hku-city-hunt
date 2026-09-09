import { IsEmpty, IsNotEmpty } from "class-validator";
import { User } from "src/modules/users/entities/user.entity";

export class CreatePermissionDto {
    @IsEmpty()
    id: number;

    @IsNotEmpty()
    module: string;

    @IsNotEmpty()
    action: string;

    @IsNotEmpty()
    role_id: number;

    created_by: User;

    updated_by: User;

    @IsEmpty()
    deleted_by: User;

    @IsEmpty()
    created_at: Date;

    @IsEmpty()
    updated_at: Date;

    @IsEmpty()
    deleted_at: Date;
}
