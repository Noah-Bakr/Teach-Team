// src/entities/PreviousRole.ts
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
    end_date: Date;

    @Column('text', { nullable: true })
    description: string;

    // Many PreviousRoles can belong to one User (Many-to-One relationship)
    @ManyToOne(() => User, user => user.previousRoles)
    @JoinColumn({ name: 'user_id' })
    user: User;
}

// import { Column } from "typeorm";
//
// export class PreviousRole {
//     @Column({ type: "varchar", length: 254, nullable: true })
//     role: string;
//
//     @Column({ type: "varchar", length: 254, nullable: true })
//     company: string;
//
//     // (new Date().toISOString())
//     @Column({ type: "varchar", length: 254, nullable: true })
//     startDate: string;
//
//     // endDate can be null if the user is still employed
//     @Column({ type: "varchar", length: 254, nullable: true })
//     endDate: string | null;
//
//     @Column({ type: "varchar", length: 254, nullable: true })
//     description: string;
// }