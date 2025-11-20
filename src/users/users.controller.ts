import { Controller, Get, Param, Patch, Body, UseGuards, Request, Post as HttpPost } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Get(':id/posts')
  @UseGuards(JwtAuthGuard)
  async findUserPosts(@Param('id') id: string) {
    return this.usersService.findPostsByUserId(id);
  }

  @HttpPost(':id/follow')
  @UseGuards(JwtAuthGuard)
  async followUser(@Param('id') followedId: string, @Request() req: any) {
    const followerId = req.user.userId;
    return this.usersService.followUser(followerId, followedId);
  }

  // TODO: Add unfollow route
}
