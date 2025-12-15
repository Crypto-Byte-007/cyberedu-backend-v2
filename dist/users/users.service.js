"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
let UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async updateProfile(userId, updateProfileDto) {
        const updateData = { ...updateProfileDto };
        if (updateProfileDto.email) {
            const existingUser = await this.userModel.findOne({
                email: updateProfileDto.email.toLowerCase(),
                _id: { $ne: userId },
            });
            if (existingUser) {
                throw new common_1.ConflictException('Email already in use');
            }
            updateData.email = updateProfileDto.email.toLowerCase();
        }
        const user = await this.userModel
            .findByIdAndUpdate(userId, { $set: updateData }, { new: true, runValidators: true })
            .select('-password -refreshToken -verificationToken -passwordResetToken')
            .exec();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async updatePassword(userId, hashedPassword) {
        await this.userModel.findByIdAndUpdate(userId, {
            $set: {
                password: hashedPassword,
                lastPasswordChangeAt: new Date(),
            },
        }, { runValidators: true }).exec();
    }
    async getUserWithPassword(userId) {
        const user = await this.userModel.findById(userId).select('+password').exec();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async findAllUsers(query) {
        const { page, limit, role, status, search } = query;
        const skip = (page - 1) * limit;
        const filter = { isDeleted: false };
        if (role)
            filter.role = role;
        if (status)
            filter.status = status;
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
    async findUserById(id) {
        const user = await this.userModel
            .findOne({ _id: id, isDeleted: false })
            .select('-password -refreshToken -verificationToken -passwordResetToken')
            .exec();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async updateUser(id, updateUserDto) {
        const updateData = { ...updateUserDto };
        if (updateUserDto.email) {
            const existingUser = await this.userModel.findOne({
                email: updateUserDto.email.toLowerCase(),
                _id: { $ne: id },
            });
            if (existingUser) {
                throw new common_1.ConflictException('Email already in use');
            }
            updateData.email = updateUserDto.email.toLowerCase();
        }
        const user = await this.userModel
            .findOneAndUpdate({ _id: id, isDeleted: false }, { $set: updateData }, { new: true, runValidators: true })
            .select('-password -refreshToken -verificationToken -passwordResetToken')
            .exec();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async changeUserStatus(id, changeUserStatusDto) {
        const updateData = {
            status: changeUserStatusDto.status,
        };
        if (changeUserStatusDto.status === user_schema_1.UserStatus.ACTIVE) {
            updateData.isActive = true;
        }
        else if (changeUserStatusDto.status === user_schema_1.UserStatus.SUSPENDED) {
            updateData.isActive = false;
        }
        const user = await this.userModel
            .findOneAndUpdate({ _id: id, isDeleted: false }, { $set: updateData }, { new: true, runValidators: true })
            .select('-password -refreshToken -verificationToken -passwordResetToken')
            .exec();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async softDeleteUser(id) {
        const user = await this.userModel
            .findOneAndUpdate({ _id: id, isDeleted: false }, {
            $set: {
                isDeleted: true,
                deletedAt: new Date(),
                isActive: false,
                status: user_schema_1.UserStatus.INACTIVE,
            },
        }, { new: true })
            .exec();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return { message: 'User soft deleted successfully' };
    }
    async restoreUser(id) {
        const user = await this.userModel
            .findOneAndUpdate({ _id: id, isDeleted: true }, {
            $set: {
                isDeleted: false,
                deletedAt: null,
                isActive: true,
                status: user_schema_1.UserStatus.ACTIVE,
            },
        }, { new: true, runValidators: true })
            .select('-password -refreshToken -verificationToken -passwordResetToken')
            .exec();
        if (!user) {
            throw new common_1.NotFoundException('User not found or not deleted');
        }
        return user;
    }
    async findByEmail(email) {
        return await this.userModel
            .findOne({ email: email.toLowerCase(), isDeleted: false })
            .exec();
    }
    async findById(id) {
        const user = await this.userModel
            .findOne({ _id: id, isDeleted: false })
            .select('-password -refreshToken -verificationToken -passwordResetToken')
            .exec();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map