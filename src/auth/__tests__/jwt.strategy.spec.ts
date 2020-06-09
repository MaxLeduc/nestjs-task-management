import { Test } from '@nestjs/testing'

import { JwtStrategy } from '../jwt.strategy'
import { UserRepository } from '../user.repository'
import { User } from '../user.entity'
import { UnauthorizedException } from '@nestjs/common'

const mockUserRepository = () => ({
  findOne: jest.fn()
})

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy
  let userRepository

  beforeEach(async() => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: UserRepository, useFactory: mockUserRepository }
      ]
    }).compile()

    jwtStrategy = await module.get<JwtStrategy>(JwtStrategy)
    userRepository = await module.get<UserRepository>(UserRepository)
  })

  describe('validate', () => {
    let user
    
    beforeEach(() => {
      user = new User()
      user.username = 'New User'
    })

    it('validates and returns a user object when successful', async () => {
      userRepository.findOne.mockResolvedValue(user)

      const output = await jwtStrategy.validate({ username: user.username })

      expect(output).toEqual(user)
    })

    it('throw unauthorized exception if user cannot be found', async () => {
      userRepository.findOne.mockResolvedValue(undefined)

      await expect(jwtStrategy.validate({ username: user.username })).rejects.toThrow(UnauthorizedException)
    })
  })
})
