import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole, UserStatus } from './schemas/user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangeUserStatusDto } from './dto/change-user-status.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<UserDocument> {
    const updateData: any = { ...updateProfileDto };
    
    if (updateProfileDto.email) {
      const existingUser = await this.userModel.findOne({
        email: updateProfileDto.email.toLowerCase(),
        _id: { $ne: userId },
      });
      
      if (existingUser) {
        throw new ConflictException('Email already in use');
      }
      updateData.email = updateProfileDto.email.toLowerCase();
    }
    
    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true },
      )
      .select('-password -refreshToken -verificationToken -passwordResetToken')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          password: hashedPassword,
          lastPasswordChangeAt: new Date(),
        },
      },
      { runValidators: true },
    ).exec();
  }

  async getUserWithPassword(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId).select('+password').exec();
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return user;
  }

  async findAllUsers(query: {
    page: number;
    limit: number;
    role?: UserRole;
    status?: string;
    search?: string;
  }): Promise<{
    users: UserDocument[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    const { page, limit, role, status, search } = query;
    const skip = (page - 1) * limit;

    const filter: any = { isDeleted: false };

    if (role) filter.role = role;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { institution: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.userModel
        .find(filter)
        .select('-password -refreshToken -verificationToken -passwordResetToken')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.userModel.countDocuments(filter).exec(),
    ]);

    return {
      users,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async findUserById(id: string): Promise<UserDocument> {
    const user = await this.userModel
      .findOne({ _id: id, isDeleted: false })
      .select('-password -refreshToken -verificationToken -passwordResetToken')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    const updateData: any = { ...updateUserDto };
    
    if (updateUserDto.email) {
      const existingUser = await this.userModel.findOne({
        email: updateUserDto.email.toLowerCase(),
        _id: { $ne: id },
      });
      
      if (existingUser) {
        throw new ConflictException('Email already in use');
      }
      updateData.email = updateUserDto.email.toLowerCase();
    }
    
    const user = await this.userModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        { $set: updateData },
        { new: true, runValidators: true },
      )
      .select('-password -refreshToken -verificationToken -passwordResetToken')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async changeUserStatus(id: string, changeUserStatusDto: ChangeUserStatusDto): Promise<UserDocument> {
    const updateData: any = {
      status: changeUserStatusDto.status,
    };

    if (changeUserStatusDto.status === UserStatus.ACTIVE) {
      updateData.isActive = true;
    } else if (changeUserStatusDto.status === UserStatus.SUSPENDED) {
      updateData.isActive = false;
    }

    const user = await this.userModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        { $set: updateData },
        { new: true, runValidators: true },
      )
      .select('-password -refreshToken -verificationToken -passwordResetToken')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async softDeleteUser(id: string): Promise<{ message: string }> {
    const user = await this.userModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        {
          $set: {
            isDeleted: true,
            deletedAt: new Date(),
            isActive: false,
            status: UserStatus.INACTIVE,
          },
        },
        { new: true },
      )
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { message: 'User soft deleted successfully' };
  }

  async restoreUser(id: string): Promise<UserDocument> {
    const user = await this.userModel
      .findOneAndUpdate(
        { _id: id, isDeleted: true },
        {
          $set: {
            isDeleted: false,
            deletedAt: null,
            isActive: true,
            status: UserStatus.ACTIVE,
          },
        },
        { new: true, runValidators: true },
      )
      .select('-password -refreshToken -verificationToken -passwordResetToken')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found or not deleted');
    }

    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel
      .findOne({ email: email.toLowerCase(), isDeleted: false })
      .exec();
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel
      .findOne({ _id: id, isDeleted: false })
      .select('-password -refreshToken -verificationToken -passwordResetToken')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
