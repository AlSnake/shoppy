import {
	IsAlphanumeric,
	IsEmail,
	IsString,
	Length,
	Matches,
} from 'class-validator';

export class RegisterDto {
	@IsEmail()
	email: string;

	@IsAlphanumeric()
	@Length(2, 32)
	username: string;

	@IsString()
	@Matches(
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
		{
			message:
				'Password must be at least 8 characters, and must contain at least one Lowercase, one Uppercase, one Number, and one Special character',
		}
	)
	password: string;
}
