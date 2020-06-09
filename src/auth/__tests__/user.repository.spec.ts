import { Test } from "@nestjs/testing"
import { ConflictException, InternalServerErrorException } from "@nestjs/common"
import * as bcrypt from 'bcrypt'

import { UserRepository } from "../user.repository"
import { User } from "../user.entity"

const mockCredientialsDto = {
  username: 'jdoe@twg.io',
  password: '123Test!'
}

describe('UserRepository', () => {
  let userRepository

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserRepository
      ]
    }).compile()

    userRepository = await module.get<UserRepository>(UserRepository)
  })

  describe('signUp', () => {
    let mockSave

    beforeEach(() => {
      mockSave = jest.fn()
      userRepository.create = jest.fn().mockReturnValue({ save: mockSave })
    })

    it('successfully registers a new user', async () => {
      mockSave.mockResolvedValue(undefined)
      await expect(userRepository.signUp(mockCredientialsDto)).resolves.not.toThrow()
    })

    it('throws a conflict exception when the username already exists', async () => {
      mockSave.mockRejectedValue({ code: '23505' })
      await expect(userRepository.signUp(mockCredientialsDto)).rejects.toThrow(ConflictException)
    })

    it('throws an internal server error', async () => {
      mockSave.mockRejectedValue({ code: '123456' })
      await expect(userRepository.signUp(mockCredientialsDto)).rejects.toThrow(InternalServerErrorException)
    })
  })

  describe('validateUserPassword', () => {
    let mockValidatePassword, mockFindOne, user

    beforeEach(() => {
      userRepository.findOne = jest.fn()
      user = new User()
      user.username = mockCredientialsDto.username
      user.validatePassword = jest.fn()
    })

    it('returns the username when validation is successful', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(user)
      user.validatePassword.mockResolvedValue(true)

      const output = await userRepository.validateUserPassword(mockCredientialsDto)

      expect(output).toEqual(mockCredientialsDto.username)
    })

    it('returns null when user cannot be found', async() => {
      userRepository.findOne = jest.fn().mockResolvedValue(false)

      const output = await userRepository.validateUserPassword(mockCredientialsDto)

      expect(output).toEqual(null)
      expect(user.validatePassword).not.toHaveBeenCalled()
    })

    it('returns null when password is invalid', async() => {
      userRepository.findOne = jest.fn().mockResolvedValue(user)
      user.validatePassword.mockResolvedValue(false)

      const output = await userRepository.validateUserPassword(mockCredientialsDto)

      expect(output).toEqual(null)
      expect(user.validatePassword).toHaveBeenCalled()
    })
  })

  describe('hashPassword', () => {
    it('calls bcrypt.hash to generate a hashed password', async () => {
      const mockHashedPassword = 'mockedHashPassword'
      const mockPassword = 'mockPassword'
      const mockSalt = 'mockSalt'
      bcrypt.hash = jest.fn().mockResolvedValue(mockHashedPassword)

      const output = await userRepository.hashPassword(mockPassword, mockSalt)
      
      expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, mockSalt)
      expect(output).toEqual(mockHashedPassword)
    })
  })
})
