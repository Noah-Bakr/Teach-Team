import { Entity, Column, OneToMany, PrimaryGeneratedColumn, JoinTable } from "typeorm";
import { Application } from "./Application";
import { PreviousRole } from "./PreviousRole";

@Entity()
export class User {
    @PrimaryGeneratedColumn({ type: "int" })
    user_id: number;

    @Column({ type: "varchar", length: 40 })
    username: string;

    @Column({ type: "varchar", length: 40 })
    first_name: string;

    @Column({ type: "varchar", length: 40 })
    last_name: string;

    @Column({ type: "varchar", length: 150, nullable: true })
    avatar: string;

    @Column({ type: "varchar", length: 254, unique: true })
    email: string;

    @Column({ type: "varchar", length: 254 })
    password: string;

    @Column({ type: "varchar", length: 100 })
    role: string[];

    @Column(() => PreviousRole)
    previousRoles: PreviousRole[];

    @Column({ type: "varchar", length: 100, nullable: true })
    academicCredentials: string;

    @Column({ type: "varchar", length: 150, nullable: true })
    skills: string[];

    @Column({ type: "varchar", length: 25, nullable: true })
    availability: string[];

    // One user to many applications
    @OneToMany(() => Application, (application) => application.user)
    @JoinTable()
    applications: Application[];
}
