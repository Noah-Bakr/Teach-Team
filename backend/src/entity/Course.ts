import { Entity, PrimaryGeneratedColumn, JoinTable, Column, OneToMany, ManyToMany } from 'typeorm';
import { Skills } from './Skills';
import { Application } from './Application';
import { User } from './User';

@Entity('Course')
export class Course {
    @PrimaryGeneratedColumn()
    course_id: number;

    @Column({ length: 150 })
    course_name: string;

    @Column({ unique: true, length: 50 })
    course_code: string;

    @Column({ type: 'enum', enum: ['1', '2']})
    semester: '1' | '2';

    // Many-to-Many relationship with Skills
    // A course can have many skills, and a skill can be associated with many courses
    @ManyToMany(() => Skills, (skill) => skill.courses, {eager: true})
    @JoinTable()
    skills: Skills[];

    // One course can have many applications (One-to-Many relationship)
    @OneToMany(() => Application, application => application.course)
    applications: Application[];

    // Many courses can have many lecturers (Many-to-Many relationship)
    @ManyToMany(() => User, (user) => user.courses)
    lecturers: User[];
}


// import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";
// import { Application } from "./Application";
//
// @Entity()
// export class Course {
//     @PrimaryGeneratedColumn({ type: "int" })
//     user_id: number;
//
//     @Column({ type: "varchar", length: 40 })
//     name: string;
//
//     @Column({ type: "varchar", length: 150, nullable: true })
//     skills: string[];
//
//     // One course to many applications
//     @OneToMany(() => Application, (application) => application.course)
//     applications: Application[];
// }