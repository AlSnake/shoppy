import { Module } from '@nestjs/common';
import { VerifyService } from './verify.service';
import { VerifyController } from './verify.controller';
import { UserModule } from '../user/user.module';

@Module({
	imports: [UserModule],
	providers: [VerifyService],
	controllers: [VerifyController],
})
export class VerifyModule {}
