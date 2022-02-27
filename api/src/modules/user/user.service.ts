import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User) private userRepository: Repository<User>
	) {}

	create(user: Partial<User>) {
		const createUser = this.userRepository.create(user);
		return this.userRepository.save(createUser);
	}

	find(user: Partial<User>) {
		return this.userRepository.find(user);
	}

	findOne(user: Partial<User>) {
		if (!user) return null;
		return this.userRepository.findOne(user);
	}

	async findOneEx(user: Partial<User>) {
		const findUser = await this.findOne(user);
		if (!findUser) throw new NotFoundException('user not found');
		return findUser;
	}

	async update(id: number, user: Partial<User>) {
		const findUser = await this.findOneEx({ id });
		Object.assign(findUser, user);
		return this.userRepository.save(findUser);
	}

	async remove(id: number) {
		const findUser = await this.findOneEx({ id });
		return this.userRepository.remove(findUser);
	}
}
