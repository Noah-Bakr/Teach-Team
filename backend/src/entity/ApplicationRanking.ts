import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    Index,
} from 'typeorm';
import { User } from './User';
import { Application } from './Application';

@Entity('ApplicationRanking')
@Index(['lecturer_id', 'application_id'], { unique: true })
export class ApplicationRanking {
    @PrimaryGeneratedColumn()
    ranking_id: number;

    @Column()
    lecturer_id: number;

    @Column()
    application_id: number;

    @Column('int')
    rank: number;

    @CreateDateColumn({ type: 'timestamp' })
    reviewed_at: Date;

    // Many rankings are created by one lecturer (Many-to-One relationship)
    @ManyToOne(() => User, (user) => user.rankings)
    @JoinColumn({ name: 'lecturer_id' })
    lecturer: User;

    // Many rankings refer to one application (Many-to-One relationship)
    @ManyToOne(() => Application, (application) => application.rankings)
    @JoinColumn({ name: 'application_id' })
    application: Application;
}
