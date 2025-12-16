import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lab, LabDocument } from './schemas/lab.schema';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LabsService implements OnModuleInit {
  private allLabs: any[] = [];

  constructor(
    @InjectModel(Lab.name)
    private readonly labModel: Model<LabDocument>,
  ) {}

  // ✅ Correct lifecycle hook (DO NOT load in constructor)
  async onModuleInit() {
    await this.loadLabs();
  }

  // Load all labs at startup
  private async loadLabs() {
    try {
      // ✅ SAFE PATH: works in dev, prod, docker, windows
      const basePath = path.join(
        process.cwd(),
        'src',
        'labs',
        'data',
      );

      const schoolLabsPath = path.join(basePath, 'school-labs.json');
      const institutionLabsPath = path.join(basePath, 'institution-labs.json');

      if (!fs.existsSync(schoolLabsPath)) {
        throw new Error(`Missing file: ${schoolLabsPath}`);
      }

      if (!fs.existsSync(institutionLabsPath)) {
        throw new Error(`Missing file: ${institutionLabsPath}`);
      }

      const schoolLabs = JSON.parse(
        fs.readFileSync(schoolLabsPath, 'utf8'),
      );

      const institutionLabs = JSON.parse(
        fs.readFileSync(institutionLabsPath, 'utf8'),
      );

      this.allLabs = [...schoolLabs, ...institutionLabs];

      for (const lab of this.allLabs) {
        const exists = await this.labModel.findOne({ labId: lab.labId });
        if (!exists) {
          await this.labModel.create(lab);
        }
      }

      console.log(`✅ Labs loaded: ${this.allLabs.length}`);
    } catch (err: any) {
      console.error('❌ Failed loading labs:', err.message);
    }
  }

  async findAll() {
    return this.labModel.find({}, { simulation: 0 }).lean();
  }

  async findOne(id: string) {
    const lab = await this.labModel.findOne({ labId: id }).lean();
    if (!lab) {
      throw new NotFoundException('Lab not found');
    }
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
