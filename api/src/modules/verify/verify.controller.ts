import { Body, Controller, Post } from '@nestjs/common';
import { RequestEmailDto } from './dtos/request-email.dto';
import { VerifyService } from './verify.service';
import { ConfirmEmailDto } from './dtos/confirm-email.dto';

@Controller('verify')
export class VerifyController {
	constructor(private verifyService: VerifyService) {}

	@Post('/request/email')
	async requestEmail(@Body() body: RequestEmailDto) {
		const res = await this.verifyService.requestEmail(body);
		const msg = res
			? 'email verification sent'
			: 'failed to send email verification';
		return { message: msg };
	}

	@Post('/confirm/email')
	async confirmEmail(@Body() body: ConfirmEmailDto) {
		await this.verifyService.confirmEmail(body);
		return { message: 'email has been verified' };
	}
}
