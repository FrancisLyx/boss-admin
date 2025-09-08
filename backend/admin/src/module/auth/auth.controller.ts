import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateAuthDto } from './dto/create-auth.dto'
import { UpdateAuthDto } from './dto/update-auth.dto'
import { LoginAuthDto } from './dto/login-auth.dto'
import { AuthGuard } from '@nestjs/passport'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	register(@Body() dto: CreateAuthDto) {
		return this.authService.register(dto)
	}

	@Post('login')
	login(@Body() dto: LoginAuthDto) {
		return this.authService.login(dto)
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('me')
	me(@Req() req: any) {
		return this.authService.me(req.user.id)
	}

	// legacy CRUD endpoints below are not used in spec
	@Get()
	findAll() {
		return this.authService.findAll()
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.authService.findOne(+id)
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
		return this.authService.update(+id, updateAuthDto)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.authService.remove(+id)
	}
}
