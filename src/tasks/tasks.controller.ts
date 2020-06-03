import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';

import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum'
import { CreateTaskDto } from './dto/create-task.dto'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity'
import { DeleteResult } from 'typeorm';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(
    // @Query() filterDto: GetTasksFilterDto
  ): Promise<Task[]> {
    // if (Object.keys(filterDto).length) {
    //   return this.taskService.getTasksWithFilters(filterDto)
    // }

    return this.taskService.getAllTasks()
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Promise<Task> {
    console.log('hey')
    return this.taskService.getTaskById(id)
  }

  @Post()
  @UsePipes()
  createTask(
    @Body() createTaskDto: CreateTaskDto
  ): Promise<Task> {
    return this.taskService.createTask(createTaskDto)
  }

  @Delete('/:id')
  deleteTaskById(@Param('id') id: string): Promise<DeleteResult> {
    return this.taskService.deleteTaskById(id)
  }

  // @Patch('/:id/status')
  // patchTask(
  //   @Param('id') id: string,
  //   @Body('status', TaskStatusValidationPipe) status: TaskStatus
  // ) {
  //   return this.taskService.updateTaskStatus(id, status)
  // }
}
