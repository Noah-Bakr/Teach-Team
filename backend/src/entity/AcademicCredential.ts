import { Entity, PrimaryGeneratedColumn, Column, JoinTable, ManyToMany } from 'typeorm';
import { User } from './User';

@Entity('AcademicCredential')
export class AcademicCredential {
    @PrimaryGeneratedColumn()
    academic_id: number;

    @Column({ length: 100 })
    degree_name: string;

    @Column({ length: 100 })
    institution: string;

    @Column('date')
    start_date: Date;

    @Column('date', { nullable: true })
    end_date: Date | null;

    @Column('text', { nullable: true })
    description: string;

    // Many academic credential can be associated with many users (Many-to-Many relationship)
    @ManyToMany(() => User, (user) => user.academicCredentials)
    users: User[];
}
