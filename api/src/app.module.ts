import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { User } from './modules/user/user.entity';
import { VerifyModule } from './modules/verify/verify.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `.env.${process.env.NODE_ENV}`,
		}),
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService) => {
				return {
					type: 'sqlite',
					database: config.get<string>('DATABASE_NAME'),
					entities: [User],
					synchronize: true,
				};
			},
		}),
		MailerModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService) => {
				return {
					transport: {
						host: config.get<string>('SMTP_HOST'),
						port: config.get<number>('SMTP_PORT'),
						auth: {
							user: config.get<string>('SMTP_USER'),
							pass: config.get<string>('SMTP_PASS'),
						},
						ignoreTLS: true,
						secure: false,
					},
					defaults: {
						from: '"Shoppy Team" <shoppy@dev.test>',
					},
				};
			},
		}),
		UserModule,
		AuthModule,
		VerifyModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
