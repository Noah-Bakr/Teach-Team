import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Application } from "./Application";

@Entity()
export class Course {
    @PrimaryGeneratedColumn({ type: "int" })
    user_id: number;

    @Column({ type: "varchar", length: 40 })
    name: string;

    @Column({ type: "varchar", length: 150, nullable: true })
    skills: string[];

    // One course to many applications
    @OneToMany(() => Application, (application) => application.course)
    applications: Application[];
}