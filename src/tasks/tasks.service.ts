import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v1 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto'

@Injectable()
export class TasksService {
  private tasks: Task[] = []

  public getAllTasks(): Task[] {
    return this.tasks
  }

  public getTaskById(id: string): Task {
    return this.tasks.find(task => task.id === id)
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
    let updatedTask
    
    this.tasks = this.tasks.map(task => {
      if (task.id === id) {
        updatedTask = { ...task, status }
        return updatedTask
      }

      return task
    })

    return updatedTask
  }
}
