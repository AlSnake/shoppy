import { InternalServerErrorException } from '@nestjs/common';
import crypto from 'crypto';

export function tokenGenerator(size: number): Promise<string> {
	return new Promise((resolve, reject) => {
		crypto.randomBytes(size, async (err, buffer) => {
			if (err)
				throw new InternalServerErrorException(
					'failed to generator token'
				);
			resolve(buffer.toString('hex'));
		});
	});
}
