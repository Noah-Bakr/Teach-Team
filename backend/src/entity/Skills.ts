import { Entity, PrimaryGeneratedColumn, Column, JoinTable, ManyToMany } from 'typeorm';
import { User } from './User';
import { Course } from './Course';

@Entity('Skills')
export class Skills {
    @PrimaryGeneratedColumn()
    skill_id: number;

    @Column({ length: 100 })
    skill_name: string;

    // Many users can have many skills (Many-to-Many relationship)
    @ManyToMany(() => User, (user) => user.skills)
    users: User[];

    // Many courses can require many skills (Many-to-Many relationship)
    @ManyToMany(() => Course, (course) => course.skills)
    courses: Course[];
}
