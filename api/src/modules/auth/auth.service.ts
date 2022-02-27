import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { LoginDto } from './dtos/login.dto';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dtos/register.dto';

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private configService: ConfigService
	) {}

	async register(user: RegisterDto) {
		if (
			(await this.userService.findOne({ email: user.email })) ||
			(await this.userService.findOne({ username: user.username }))
		)
			throw new BadRequestException('email or username already exists');

		user.password = await bcrypt.hash(user.password, 6);
		return this.userService.create(user);
	}

	async login(credential: LoginDto) {
		const user = await this.userService.findOneEx({
			email: credential.email,
		});
		const verifyPassword = await bcrypt.compare(
			credential.password,
			user.password
		);
		if (!verifyPassword)
			throw new UnauthorizedException('invalid password');

		return jwt.sign(
			{ userId: user.id },
			this.configService.get<string>('JWT_SECRET'),
			{
				expiresIn: '1h',
			}
		);
	}
}
