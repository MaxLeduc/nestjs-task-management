import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Strategy, ExtractJwt } from 'passport-jwt'
import * as config from 'config'

import { JwtPayload } from './jwt-payload.interface'
import { UserRepository } from './user.repository'

const { secret } = config.get('jwt')

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || secret,
    })
  }

  async validate(payload: JwtPayload) {
    const { username } = payload
    const user = await this.userRepository.findOne({username})

    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }
}
