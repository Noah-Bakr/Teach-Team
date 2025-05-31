import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';
import { Role } from './Role';
import { Skills } from './Skills';
import { Application } from './Application';
import { AcademicCredentialUser } from './AcademicCredentialUser';
import { Course } from './Course';
import { PreviousRole } from './PreviousRole';
import { Comment } from './Comment';
import { ApplicationRanking} from "./ApplicationRanking";

@Entity('User')
export class User {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column({ unique: true, length: 100 })
    username: string;

    @Column({ unique: true, length: 150 })
    email: string;

    @Column({ length: 255 })
    password: string;

    @CreateDateColumn({
        type: 'datetime',
    })
    created_at: Date;

    @UpdateDateColumn({
        type: 'datetime',
    })
    updated_at: Date;

    @Column({ length: 100 })
    first_name: string;

    @Column({ length: 100 })
    last_name: string;

    @Column({ nullable: true, length: 150 })
    avatar: string;

    // One user can have only one role, but many users can have the same role (Many-to-One relationship)
    @ManyToOne(() => Role, role => role.users)
    @JoinColumn({ name: 'role_id' })
    role: Role;

    // Many users can have many skills (Many-to-Many relationship)
    @ManyToMany(() => Skills, skill => skill.users)
    skills: Skills[];

    // One user can have many applications (One-to-Many relationship)
    @OneToMany(() => Application, application => application.user)
    applications: Application[];

    // One user can have many academic credentials (One-to-Many relationship)
    @OneToMany(() => AcademicCredentialUser, academicCredentialUser => academicCredentialUser.user)
    academicCredentialUsers: AcademicCredentialUser[];

    // Many lecturers can be assigned to many courses (Many-to-Many relationship)
    @ManyToMany(() => Course, course => course.lecturers)
    courses: Course[];

    // One user can have many previous roles (One-to-Many relationship)
    @OneToMany(() => PreviousRole, previousRole => previousRole.user)
    previousRoles: PreviousRole[];

    // Many comments can be made by one lecturer (Many-to-One relationship)
    @OneToMany(() => Comment, comment => comment.lecturer)
    comments: Comment[];

    @OneToMany(() => ApplicationRanking, (ranking) => ranking.lecturer)
    rankings: ApplicationRanking[];
}
