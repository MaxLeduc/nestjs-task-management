/* eslint-disable @typescript-eslint/no-explicit-any */

import { PipeTransform, BadRequestException } from "@nestjs/common";
import { TaskStatus } from '../task-status.enum'

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = Object.values(TaskStatus)

  private isStatusValid (status: any) {
    return this.allowedStatuses.includes(status)
  }

  transform(value: any) {
    const status = value.toUpperCase()
    const isValid = this.isStatusValid(status)

    if (!isValid) {
      throw new BadRequestException(`${value} is an invalid status.`)
    }

    return status
  }
}
