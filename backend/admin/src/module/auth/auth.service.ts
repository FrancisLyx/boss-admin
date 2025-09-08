import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common'
import { CreateAuthDto } from './dto/create-auth.dto'
import { UpdateAuthDto } from './dto/update-auth.dto'
import { LoginAuthDto } from './dto/login-auth.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '../../entity/user.entity'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly repository: Repository<UserEntity>,
		private readonly jwtService: JwtService
	) {}

	async register(dto: CreateAuthDto) {
		const exists = await this.repository.findOne({ where: { email: dto.email } })
		if (exists) throw new BadRequestException('Email already exists')

		const passwordHash = await bcrypt.hash(dto.password, 10)
		const user = await this.repository.save({
			name: dto.name,
			email: dto.email,
			password: passwordHash,
			role: dto.role ?? 'user'
		})
		const { password, ...safe } = user
		return { message: 'User registered successfully', user: safe }
	}

	async login(dto: LoginAuthDto) {
		const user = await this.repository.findOne({ where: { email: dto.email } })
		if (!user) throw new UnauthorizedException('Invalid credentials')
		const ok = await bcrypt.compare(dto.password, user.password)
		if (!ok) throw new UnauthorizedException('Invalid credentials')
		const payload = { id: user.id, email: user.email, role: user.role }
		const access_token = await this.jwtService.signAsync(payload)
		return { access_token }
	}

	async me(userId: string) {
		const user = await this.repository.findOne({ where: { id: userId } })
		if (!user) throw new UnauthorizedException('Unauthorized')
		const { password, ...safe } = user
		return safe
	}

	// legacy stubs
	findAll() {
		return 'OK'
	}
	findOne(id: number) {
		return `noop ${id}`
	}
	update(id: number, _updateAuthDto: UpdateAuthDto) {
		return `noop ${id}`
	}
	remove(id: number) {
		return `noop ${id}`
	}
}
