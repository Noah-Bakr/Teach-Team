import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './User';
import { Course } from './Course';
import { Comment} from "./Comment";

@Entity('Application')
export class Application {
    @PrimaryGeneratedColumn()
    application_id: number;

    @Column({ type: 'enum', enum: ['tutor', 'lab_assistant']})
    position_type: 'tutor' | 'lab_assistant';

    @Column({ type: 'enum', enum: ['pending', 'accepted', 'rejected']})
    status: 'pending' | 'accepted' | 'rejected';

    @CreateDateColumn({ type: 'timestamp' })
    applied_at: Date;

    @Column('boolean')
    selected: boolean;

    @Column({ type: 'enum', enum: ['Full-Time', 'Part-Time', 'Not Available']})
    availability: 'Full-Time' | 'Part-Time' | 'Not Available';

    @Column('int', { nullable: true })
    rank: number;

    // Many applications can be made by a user, but each application belongs to one user (Many-to-One relationship)
    @ManyToOne(() => User, user => user.applications)
    @JoinColumn({ name: 'user_id' })
    user: User;

    // Many applications can be for the same course, but each application is for one course (Many-to-One relationship)
    @ManyToOne(() => Course, course => course.applications)
    @JoinColumn({ name: 'course_id' })
    course: Course;

    // One application can have many comments (One-to-Many relationship)
    @OneToMany(() => Comment, comment => comment.application)
    comments: Comment[];
}


// import { Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
// import { User } from "./User";
// import { Course } from "./Course";
//
// @Entity()
// export class Application {
//     @PrimaryGeneratedColumn({ type: "int" })
//     application_id: number;
//
//     // Date of application (new Date().toISOString())
//     @Column({ type: "varchar", length: 254 })
//     date: string;
//
//     // Availability of the applicant
//     @Column({ type: "varchar", length: 254 })
//     availability: string[];
//
//     @Column({ type: "varchar", length: 254 })
//     skills: string[]; // Skills of the applicant
//
//     // Academic credentials of the applicant
//     @Column({ type: "varchar", length: 254 })
//     academicCredentials: string | null;
//
//     // Previous roles of the applicant
//     @Column({ type: "varchar", length: 254 })
//     previousRoles: string[];
//
//     // Whether the application is selected or not
//     @Column({ type: "boolean", default: false })
//     selected: boolean;
//
//     // Rank of the application (optional)
//     @Column({ type: "int", nullable: true })
//     rank: number;
//
//     // Comments left by the lecturer (optional)
//     @Column({ type: "varchar", length: 254, nullable: true })
//     comment: string[];
//
//     // Many applications to one user
//     @ManyToOne(() => User, (user) => user.applications)
//     user: User;
//
//     // Many applications to one course
//     @ManyToOne(() => Course, (course) => course.applications)
//     @JoinTable()
//     course: Course;
// }