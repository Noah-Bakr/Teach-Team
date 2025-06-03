import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';
import { User } from './User';
import { Application } from './Application';

@Entity('Review')
@Index(['lecturer_id', 'application_id'], { unique: true })
export class Review {
    @PrimaryGeneratedColumn()
    review_id: number;

    @Column()
    lecturer_id: number;

    @Column()
    application_id: number;

    @Column('int', { nullable: true })
    rank: number | null;

    @Column('text', { nullable: true })
    comment: string | null;

    @CreateDateColumn({ type: 'timestamp' })
    reviewed_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    // Many reviews are written by one lecturer (User)
    @ManyToOne(() => User, (user) => user.reviews)
    @JoinColumn({ name: 'lecturer_id' })
    lecturer: User;

    // Many reviews refer to one application
    @ManyToOne(() => Application, (app) => app.reviews)
    @JoinColumn({ name: 'application_id' })
    application: Application;
}
