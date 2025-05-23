import { Entity, PrimaryColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from './User';
import { Course } from './Course';

@Entity('Lecturer_Course')
export class LecturerCourse {
    @PrimaryColumn()
    user_id: number;

    @PrimaryColumn()
    course_id: number;

    // Many-to-Many relationship: A lecturer can be assigned to many courses
    // Each course can have many lecturers
    @ManyToMany(() => User, user => user.courses)
    @JoinTable()
    lecturer: User;

    @ManyToMany(() => Course, course => course.lecturers)
    @JoinTable()
    course: Course;
}
