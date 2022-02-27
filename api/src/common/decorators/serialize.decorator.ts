import { UseInterceptors } from '@nestjs/common';
import { SerializeInterceptor } from '../interceptors/serialize.interceptor';

type Class = { new (...args: any[]): any };

export function Serialize(dto: Class) {
	return UseInterceptors(new SerializeInterceptor(dto));
}
