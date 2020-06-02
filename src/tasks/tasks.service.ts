import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v1 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = []

  public getAllTasks(): Task[] {
    return this.tasks
  }

  public getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto

    let tasks = this.getAllTasks()

    if (status) {
      tasks = tasks.filter(task => task.status === status)
    }

    if (search) {
      tasks = tasks.filter(task =>
        task.title.includes(search) || task.description.includes(search)  
      )
    }

    return tasks
  }

  public getTaskById(id: string): Task {
    const task = this.tasks.find(task => task.id === id)

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found.`)
    }

    return task
  }

  public createTask(createTaskDto: CreateTaskDto): Task {
    const task: Task = {
      ...createTaskDto,
      id: uuid(),
      status: TaskStatus.OPEN
    }

    this.tasks = [task, ...this.tasks]

    return task
  }

  public deleteTaskById(id: string):void {
    this.tasks = this.tasks.filter(task => task.id !== id)
  }

  public updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id)

    task.status = status

    return task
  }
}
