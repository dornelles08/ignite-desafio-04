import { PhotoRepository } from "@/domain/application/repositories/photo.repository";
import { Photo } from "@/domain/enterprise/entities/photo";
import { Injectable } from "@nestjs/common";
import { PrismaPhotoMapper } from "../mappers/prisma-photo.mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaPhotoRepository implements PhotoRepository {
  constructor(private prisma: PrismaService) {}

  async create(photo: Photo): Promise<void> {
    const data = PrismaPhotoMapper.toPrisma(photo);

    await this.prisma.photo.create({
      data,
    });
  }
}
