import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dtos/user.dto';
import { Serialize } from 'src/common/decorators/serialize.decorator';
import { AuthUser } from 'src/common/decorators/authuser.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('users')
@Serialize(UserDto)
export class UserController {
	constructor(private userService: UserService) {}

	@Get('/me')
	@UseGuards(AuthGuard)
	getMe(@AuthUser() user: User) {
		return user;
	}

	@Get('/:username')
	getUserByUsername(@Param('username') username: string) {
		return this.userService.findOneEx({ username });
	}
}
