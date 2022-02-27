import {
	Injectable,
	NestMiddleware,
	UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';
import { UserService } from '../../modules/user/user.service';

function decodeJWT(jwttoken: string, jwtsecret: string): jwt.JwtPayload {
	try {
		const token = jwttoken.split(' ')[1];
		if (!token) throw new UnauthorizedException('invalid jwt format');
		return jwt.verify(token, jwtsecret) as jwt.JwtPayload;
	} catch (err) {
		throw new UnauthorizedException(err.message);
	}
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	constructor(
		private configService: ConfigService,
		private userService: UserService
	) {}

	async use(req: Request, res: Response, next: NextFunction) {
		const jwt = req.headers['authorization'];
		if (!jwt) throw new UnauthorizedException('no jwt provided');

		const { userId } = decodeJWT(
			jwt,
			this.configService.get<string>('JWT_SECRET')
		);
		if (!userId) throw new UnauthorizedException('invalid jwt data');

		req.authuser = await this.userService.findOne({ id: userId });
		next();
	}
}
