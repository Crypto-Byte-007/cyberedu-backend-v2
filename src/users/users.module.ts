import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';
import { UsersController } from './controllers/users.controller';
import { UserProfileController } from './controllers/user-profile.controller';
import { AdminController } from './controllers/admin.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController, UserProfileController, AdminController],
  providers: [UsersService],
  exports: [UsersService, MongooseModule],
})
export class UsersModule {}