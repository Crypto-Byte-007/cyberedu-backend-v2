import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LabDocument = HydratedDocument<Lab>;

@Schema({ timestamps: true })
export class Lab {
  @Prop({ required: true, unique: true })
  labId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  difficulty: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Object })
  theoryContent: Record<string, any>;

  @Prop({ type: Object })
  simulation: Record<string, any>;

  @Prop({ type: [Object] })
  questions: Record<string, any>[];

  // Virtual properties for compatibility
  get steps() {
    return this.simulation?.steps || [];
  }

  get requiredLabs() {
    return this.simulation?.requiredLabs || [];
  }
}

export const LabSchema = SchemaFactory.createForClass(Lab);