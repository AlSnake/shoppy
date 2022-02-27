import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { AuthService } from './auth.service';
import { Serialize } from '../../common/decorators/serialize.decorator';
import { UserDto } from '../user/dtos/user.dto';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('/register')
	@Serialize(UserDto)
	register(@Body() body: RegisterDto) {
		return this.authService.register(body);
	}

	@Post('/login')
	async login(@Body() body: LoginDto) {
		const jwt = await this.authService.login(body);
		return { token: jwt };
	}
}
