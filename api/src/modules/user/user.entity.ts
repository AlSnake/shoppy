import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	email: string;

	@Column()
	username: string;

	@Column()
	password: string;

	@Column({ default: false })
	emailVerified: boolean;

	@Column({ nullable: true })
	emailVerifyToken: string;

	@Column({ nullable: true })
	emailVerifyTokenExpiry: number;
}
