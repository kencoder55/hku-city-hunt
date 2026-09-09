import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/modules/users/entities/user.entity';
export class CreateRoleDto {
    @IsEmpty()
    id: number;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    type: string = 'user';

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
