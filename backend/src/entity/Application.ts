import { Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Course } from "./Course";

@Entity()
export class Application {
    @PrimaryGeneratedColumn({ type: "int" })
    application_id: number;

    // Date of application (new Date().toISOString())
    @Column({ type: "varchar", length: 254 })
    date: string;

    // Availability of the applicant
    @Column({ type: "varchar", length: 254 })
    availability: string[];

    @Column({ type: "varchar", length: 254 })
    skills: string[]; // Skills of the applicant

    // Academic credentials of the applicant
    @Column({ type: "varchar", length: 254 })
    academicCredentials: string | null;

    // Previous roles of the applicant
    @Column({ type: "varchar", length: 254 })
    previousRoles: string[];

    // Whether the application is selected or not
    @Column({ type: "boolean", default: false })
    selected: boolean;

    // Rank of the application (optional)
    @Column({ type: "int", nullable: true })
    rank: number;

    // Comments left by the lecturer (optional)
    @Column({ type: "varchar", length: 254, nullable: true })
    comment: string[];

    // Many applications to one user
    @ManyToOne(() => User, (user) => user.applications)
    user: User;

    // Many applications to one course
    @ManyToOne(() => Course, (course) => course.applications)
    @JoinTable()
    course: Course;
}