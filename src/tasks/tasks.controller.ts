import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, UseGuards, Logger } from '@nestjs/common';

import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum'
import { CreateTaskDto } from './dto/create-task.dto'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity'
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TaskController')

  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User
  ): Promise<Task[]> {
    this.logger.verbose(`User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`)
    
    return this.taskService.getTasks(filterDto, user)
  }

  @Get('/:id')
  getTaskById(
    @Param('id') id: string,
    @GetUser() user: User
  ): Promise<Task> {
    return this.taskService.getTaskById(id, user)
  }

  @Post()
  @UsePipes()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User
  ): Promise<Task> {
    this.logger.verbose(`User "${user.username}" creating a new task. Data: ${JSON.stringify(createTaskDto)}`)

    return this.taskService.createTask(createTaskDto, user)
  }

  @Delete('/:id')
  deleteTaskById(
    @Param('id') id: string,
    @GetUser() user: User
  ): Promise<void> {
    return this.taskService.deleteTaskById(id, user)
  }

  @Patch('/:id/status')
  patchTask(
    @Param('id') id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User
  ): Promise<Task> {
    return this.taskService.updateTaskStatus(id, status, user)
  }
}
