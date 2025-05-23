import { Entity, PrimaryColumn, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './User';
import { AcademicCredential } from './AcademicCredential';

@Entity('AcademicCredential_User')
export class AcademicCredentialUser {
    @PrimaryColumn()
    user_id: number;

    @PrimaryColumn()
    academic_id: number;

    // Many-to-One relationship: Each academic credential-user pair links to a single user
    @ManyToOne(() => User, user => user.academicCredentialUsers)
    @JoinColumn({ name: 'user_id' })
    user: User;

    // Many-to-One relationship: Each academic credential-user pair links to a single academic credential
    @ManyToOne(() => AcademicCredential, academicCredential => academicCredential.academicCredentialUsers)
    @JoinColumn({ name: 'academic_id' })
    academicCredential: AcademicCredential;
}
