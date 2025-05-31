import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AcademicCredentialUser } from './AcademicCredentialUser';

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

    // One academic credential can be associated with many users (One-to-Many relationship)
    @OneToMany(() => AcademicCredentialUser, academicCredentialUser => academicCredentialUser.academicCredential)
    academicCredentialUsers: AcademicCredentialUser[];
}
