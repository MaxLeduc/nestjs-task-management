import { Injectable, NotFoundException } from '@nestjs/common';

import { TaskStatus } from './task-status.enum'
import { CreateTaskDto } from './dto/create-task.dto'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity'
import { DeleteResult } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository
  ) {
  }

  public getAllTasks(): Promise<Task[]> {
    return this.taskRepository.find()
  }

  // public getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = filterDto

  //   let tasks = this.getAllTasks()

  //   if (status) {
  //     tasks = tasks.filter(task => task.status === status)
  //   }

  //   if (search) {
  //     tasks = tasks.filter(task =>
  //       task.title.includes(search) || task.description.includes(search)  
  //     )
  //   }

  //   return tasks
  // }

  // public getTaskById(id: string): Task {
  //   const found = this.tasks.find(task => task.id === id)

  //   if (!found) {
  //     throw new NotFoundException(`Task with id ${id} not found.`)
  //   }

  //   return found
  // }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.taskRepository.findOne(id)

    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found.`)
    }

    return found
  }


  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto)
  }

  async deleteTaskById(id: string): Promise<DeleteResult> {
    const deleted = this.taskRepository.delete(id)

    if (!deleted) {
      throw new NotFoundException(`Task with id ${id} not found.`)
    }

    return deleted
  }

  // public updateTaskStatus(id: string, status: TaskStatus): Task {
  //   const task = this.getTaskById(id)

  //   task.status = status

  //   return task
  // }
}
