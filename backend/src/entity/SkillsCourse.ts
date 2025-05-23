import {Entity, PrimaryColumn, ManyToOne, JoinColumn} from 'typeorm';
import { Course } from './Course';
import { Skills } from './Skills';

@Entity('Skills_Course')
export class SkillsCourse {
    @PrimaryColumn()
    course_id: number;

    @PrimaryColumn()
    skill_id: number;

    // Many-to-One relationship: Each record links a course to a skill
    @ManyToOne(() => Course, course => course.skillsCourses)
    @JoinColumn({ name: 'course_id' })  // Foreign key to Course
    course: Course;

    @ManyToOne(() => Skills, skill => skill.courses)
    @JoinColumn({ name: 'skill_id' })  // Foreign key to Skills
    skill: Skills;
}
