import { Controller, Get, Param } from '@nestjs/common';
import { LabsService } from './labs.service';

@Controller('labs')
export class LabsController {
  constructor(private readonly labsService: LabsService) {}

  @Get()
  async findAll() {
    return this.labsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.labsService.findOne(id);
  }

  @Get(':id/theory')
  async getTheory(@Param('id') id: string) {
    return this.labsService.getTheory(id);
  }

  @Get(':id/simulation')
  async getSimulation(@Param('id') id: string) {
    return this.labsService.getSimulation(id);
  }

  @Get(':id/questions')
  async getQuestions(@Param('id') id: string) {
    return this.labsService.getQuestions(id);
  }
}