import { Entity, PrimaryGeneratedColumn, JoinColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity('PreviousRole')
export class PreviousRole {
    @PrimaryGeneratedColumn()
    previous_role_id: number;

    @Column({ length: 255 })
    previous_role: string;

    @Column({ length: 255 })
    company: string;

    @Column('date')
    start_date: Date;

    @Column('date', { nullable: true })
    end_date: Date | null;

    @Column('text', { nullable: true })
    description: string;

    // Many PreviousRoles can belong to one User (Many-to-One relationship)
    @ManyToOne(() => User, user => user.previousRoles, { eager: true })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
