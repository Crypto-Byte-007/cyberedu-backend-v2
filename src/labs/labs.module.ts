import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LabsService } from './labs.service';
import { LabsController } from './labs.controller';
import { Lab, LabSchema } from './schemas/lab.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lab.name, schema: LabSchema }]),
  ],
  controllers: [LabsController],
  providers: [LabsService],
})
export class LabsModule {}