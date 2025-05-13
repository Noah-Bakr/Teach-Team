import { Column } from "typeorm";

export class PreviousRole {
    @Column({ type: "varchar", length: 254, nullable: true })
    role: string;

    @Column({ type: "varchar", length: 254, nullable: true })
    company: string;

    // (new Date().toISOString())
    @Column({ type: "varchar", length: 254, nullable: true })
    startDate: string;

    // endDate can be null if the user is still employed
    @Column({ type: "varchar", length: 254, nullable: true })
    endDate: string | null;

    @Column({ type: "varchar", length: 254, nullable: true })
    description: string;
}