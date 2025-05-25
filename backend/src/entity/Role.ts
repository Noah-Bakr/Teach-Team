import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './User';

@Entity('Role')
export class Role {
    @PrimaryGeneratedColumn()
    role_id: number;

    @Column({ type: 'enum', enum: ['admin', 'lecturer', 'candidate']})
    role_name: 'admin' | 'lecturer' | 'candidate';

    // One role can be assigned to many users (One-to-Many relationship)
    @OneToMany(() => User, user => user.role)
    users: User[];
}
