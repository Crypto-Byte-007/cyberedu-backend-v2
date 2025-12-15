import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
  DefaultValuePipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../users/schemas/user.schema';
import { LabsService } from '../services/labs.service';
import { StartLabDto } from '../dto/start-lab.dto';
import { UpdateProgressDto } from '../dto/update-progress.dto';
import { CompleteStepDto } from '../dto/complete-step.dto';

@Controller('labs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LabsController {
  constructor(private readonly labsService: LabsService) {}

  @Get()
  @Roles(UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN)
  async findAll(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('difficulty') difficulty?: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('isActive') isActive?: boolean,
  ) {
    return await this.labsService.findAllLabs(req.user.id, {
      page,
      limit,
      difficulty,
      category,
      search,
      isActive,
    });
  }

  @Get('my-progress')
  @Roles(UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN)
  async getMyProgress(
    @Request() req,
    @Query('status') status?: string,
  ) {
    return await this.labsService.getUserLabsProgress(req.user.id, status);
  }

  @Get(':id')
  @Roles(UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN)
  async findOne(@Param('id') id: string, @Request() req) {
    return await this.labsService.findLabById(id, req.user.id);
  }

  @Get(':id/theory')
  @Roles(UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN)
  async getTheory(@Param('id') id: string, @Request() req) {
    return await this.labsService.getLabTheory(id, req.user.id);
  }

  @Post(':id/start')
  @Roles(UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async startLab(
    @Param('id') id: string,
    @Request() req,
    @Body() startLabDto: StartLabDto,
  ) {
    return await this.labsService.startLab(id, req.user.id, startLabDto);
  }

  @Get(':id/progress')
  @Roles(UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN)
  async getProgress(@Param('id') id: string, @Request() req) {
    return await this.labsService.getUserProgress(id, req.user.id);
  }

  @Post(':id/progress')
  @Roles(UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async updateProgress(
    @Param('id') id: string,
    @Request() req,
    @Body() updateProgressDto: UpdateProgressDto,
  ) {
    return await this.labsService.updateProgress(id, req.user.id, updateProgressDto);
  }

  @Post(':id/steps/:step/complete')
  @Roles(UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async completeStep(
    @Param('id') id: string,
    @Param('step', ParseIntPipe) step: number,
    @Request() req,
    @Body() completeStepDto: CompleteStepDto,
  ) {
    return await this.labsService.completeStep(
      id,
      step,
      req.user.id,
      completeStepDto,
    );
  }

  @Get(':id/hints/:step')
  @Roles(UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN)
  async getHints(
    @Param('id') id: string,
    @Param('step', ParseIntPipe) step: number,
    @Request() req,
  ) {
    return await this.labsService.getStepHints(id, step, req.user.id);
  }

  @Post(':id/restart')
  @Roles(UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async restartLab(@Param('id') id: string, @Request() req) {
    return await this.labsService.restartLab(id, req.user.id);
  }
}
