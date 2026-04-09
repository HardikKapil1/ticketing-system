import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Role } from '../common/enums/role.enum';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column({
        enum: Role,
        type: 'enum',
        enumName: 'user_role',
        default: Role.USER
    })
    role!: Role;

}
