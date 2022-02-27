import {
	BadRequestException,
	Injectable,
	UnprocessableEntityException,
} from '@nestjs/common';
import { RequestEmailDto } from './dtos/request-email.dto';
import { UserService } from '../user/user.service';
import { MailerService } from '@nestjs-modules/mailer';
import { tokenGenerator } from '../../common/helpers/token-generator.helper';
import { ConfirmEmailDto } from './dtos/confirm-email.dto';

@Injectable()
export class VerifyService {
	constructor(
		private mailerService: MailerService,
		private userService: UserService
	) {}

	async requestEmail(data: RequestEmailDto) {
		const findUser = await this.userService.findOneEx({
			email: data.email,
		});
		if (findUser.emailVerified)
			throw new BadRequestException('email is already verified');

		const verifyToken = await tokenGenerator(32);
		const emailBody = `
			<p>Shoppy Email Verification</p>
			<p>Verify Token: ${verifyToken}</p>
		`;

		findUser.emailVerifyToken = verifyToken;
		findUser.emailVerifyTokenExpiry = Date.now();
		await this.userService.update(findUser.id, findUser);

		try {
			await this.mailerService.sendMail({
				to: data.email,
				subject: 'Shoppy Email Verification',
				html: emailBody,
			});
		} catch (err) {
			return false;
		}
		return true;
	}

	async confirmEmail(data: ConfirmEmailDto) {
		const findUser = await this.userService.findOneEx({
			email: data.email,
		});
		if (findUser.emailVerified)
			throw new BadRequestException('email is already verified');

		if (findUser.emailVerifyToken !== data.token)
			throw new UnprocessableEntityException(
				'invalid verification token'
			);

		if (findUser.emailVerifyTokenExpiry < Date.now())
			throw new UnprocessableEntityException(
				'verification token expired'
			);

		findUser.emailVerified = true;
		findUser.emailVerifyToken = null;
		findUser.emailVerifyTokenExpiry = null;
		return this.userService.update(findUser.id, findUser);
	}
}
