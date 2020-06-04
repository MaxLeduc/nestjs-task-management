import { Test } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'

import { TasksService } from '../tasks.service'
import { TaskRepository } from '../task.repository'
import { GetTasksFilterDto } from '../dto/get-tasks-filter.dto'
import { TaskStatus } from '../task-status.enum'

const mockUser = {
  username: 'Jane',
  id: '123'
}

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
})

describe('TaskService', () => {
  let tasksService, taskRepository

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers:[
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository }
      ]
    }).compile()

    tasksService = await module.get<TasksService>(TasksService)
    taskRepository = await module.get<TaskRepository>(TaskRepository)
  })

  describe('getTasks', () => {
    it('gets all tasks from repository', async () => {
      const filter: GetTasksFilterDto = { status: TaskStatus.OPEN, search: 'test'}
      const mockValue = 'someValue'
      taskRepository.getTasks.mockResolvedValue(mockValue)

      expect(taskRepository.getTasks).toHaveBeenCalledTimes(0)

      const output = await tasksService.getTasks(filter, mockUser)

      expect(taskRepository.getTasks).toHaveBeenCalledTimes(1)
      expect(taskRepository.getTasks).toHaveBeenCalledWith(filter, mockUser)
      expect(output).toEqual(mockValue)
    })
  })

  describe('getTaskById', () => {
    it('calls taskRepositoy.findOne() and successfully retireves and returns the task', async () => {
      const mockTask = { title: 'Test', description: 'This is a test task.'}
      taskRepository.findOne.mockResolvedValue(mockTask)

      const output = await tasksService.getTaskById('1', mockUser)

      expect(output).toEqual(mockTask)
      expect(taskRepository.findOne).toHaveBeenCalledTimes(1)
      expect(taskRepository.findOne).toHaveBeenCalledWith({'where': {'id': '1', 'userId': '123'}})
    })

    it('throws an error when task is not found', async () => {
      taskRepository.findOne.mockResolvedValue(null)

      expect(tasksService.getTaskById('1', mockUser)).rejects.toThrow(NotFoundException)
    })
  })

  describe('createTask', () => {
    it('calls taskRepository.createTask and returns the results', async() => {
      const mockTask = { title: 'Test', description: 'This is a test task.'}  
      taskRepository.createTask.mockResolvedValue(mockTask) 
   
      const output = await tasksService.createTask({ ...mockTask }, mockUser)
      
      expect(taskRepository.createTask).toHaveBeenCalledTimes(1)
      expect(output).toEqual(mockTask)
    })
  })
})
