import { Repository, EntityRepository } from "typeorm"
import { ConflictException, InternalServerErrorException } from "@nestjs/common"

import { User } from "./user.entity"
import { AuthCredentialsDto } from "./dto/auth-credentials.dto"
import * as bcrypt from 'bcrypt'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto

    const user = new User()
    user.username = username
    user.salt = await bcrypt.genSalt()
    user.password = await this.hashPassword(password, user.salt)
    
    try {
      await user.save()
    } catch (e) {
      const { code } = e

      if (code === '23505') { // duplicate username
        throw new ConflictException('Username already exists.')
      }

      throw new InternalServerErrorException()
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt)
  }

  async validateUserPassword(authCredentidalsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentidalsDto
    const user = await this.findOne({ username })

    if (user && await user.validatePassword(password)) {
      return user.username
    }

    return null
  }
}
