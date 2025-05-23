import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Application } from './Application';
import { User } from './User';

@Entity('Comment')
export class Comment {
    @PrimaryGeneratedColumn()
    comment_id: number;

    @Column('text')
    comment: string;

    @Column('date')
    created_at: Date;

    @Column('date')
    updated_at: Date;

    // Many comments can be linked to one application (Many-to-One relationship)
    @ManyToOne(() => Application, application => application.comments)
    @JoinColumn({ name: 'application_id' })
    application: Application;

    // Many comments can be made by one lecturer (Many-to-One relationship)
    @ManyToOne(() => User, user => user.comments)
    @JoinColumn({ name: 'lecturer_id' })
    lecturer: User;
}
