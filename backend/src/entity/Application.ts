import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './User';
import { Course } from './Course';
import { Review } from './Review';

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

    // Many applications can be made by a user, but each application belongs to one user (Many-to-One relationship)
    @ManyToOne(() => User, user => user.applications, { eager: true })
    @JoinColumn({ name: 'user_id' })
    user: User;

    // Many applications can be for the same course, but each application is for one course (Many-to-One relationship)
    @ManyToOne(() => Course, course => course.applications, { eager: true })
    @JoinColumn({ name: 'course_id' })
    course: Course;

    @OneToMany(() => Review, (review) => review.application)
    reviews: Review[];
}