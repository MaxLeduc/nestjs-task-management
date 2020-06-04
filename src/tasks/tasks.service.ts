import { Injectable, NotFoundException } from '@nestjs/common';

import { TaskStatus } from './task-status.enum'
import { CreateTaskDto } from './dto/create-task.dto'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity'
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository
  ) {
  }

  public getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user)
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id, userId: user.id }})

    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found.`)
    }

    return found
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user)
  }

  async deleteTaskById(id: string, user: User): Promise<void> {
    const deleteResult = await this.taskRepository.delete({ id, userId: user.id })

    if (!deleteResult.affected) {
      throw new NotFoundException(`Task with id ${id} not found.`)
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user)
    
    task.status = status

    task.save()

    return task
  }
}
