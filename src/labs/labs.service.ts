import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lab, LabDocument } from './schemas/lab.schema';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LabsService {
  private allLabs: any[] = [];

  constructor(
    @InjectModel(Lab.name)
    private readonly labModel: Model<LabDocument>,
  ) {
    this.loadLabs();
  }

  // Load all labs at startup
  private async loadLabs() {
    try {
      const schoolLabsPath = path.join(__dirname, 'data', 'school-labs.json');
      const institutionLabsPath = path.join(__dirname, 'data', 'institution-labs.json');
      
      const schoolLabs = JSON.parse(fs.readFileSync(schoolLabsPath, 'utf8'));
      const institutionLabs = JSON.parse(fs.readFileSync(institutionLabsPath, 'utf8'));
      
      this.allLabs = [
        ...schoolLabs,
        ...institutionLabs
      ];

      for (const lab of this.allLabs) {
        const exists = await this.labModel.findOne({ labId: lab.labId });
        if (!exists) {
          await this.labModel.create(lab);
        }
      }

      console.log(`✅ Labs loaded: ${this.allLabs.length}`);
    } catch (err) {
      console.error('❌ Failed loading labs:', err);
    }
  }

  async findAll() {
    return this.labModel.find({}, { simulation: 0 }).lean();
  }

  async findOne(id: string) {
    const lab = await this.labModel.findOne({ labId: id }).lean();
    if (!lab) throw new NotFoundException('Lab not found');
    return lab;
  }

  async getTheory(id: string) {
    const lab = await this.findOne(id);
    return lab.theoryContent;
  }

  async getSimulation(id: string) {
    const lab = await this.findOne(id);
    return lab.simulation;
  }

  async getQuestions(id: string) {
    const lab = await this.findOne(id);
    return lab.questions;
  }
}