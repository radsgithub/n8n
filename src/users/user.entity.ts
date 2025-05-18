import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    phone: string;
    @Column({ type: 'jsonb', nullable: true })
    extra_fields?: Record<string, any>; // ← dynamic fields go here
}

