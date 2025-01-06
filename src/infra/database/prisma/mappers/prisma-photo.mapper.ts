import { Photo } from "@/domain/enterprise/entities/photo";
import { Prisma, Photo as PrismaPhoto } from "@prisma/client";

export class PrismaPhotoMapper {
  static toPrisma(photo: Photo): Prisma.PhotoUncheckedCreateInput {
    return {
      id: photo.id,
      orderId: photo.orderId,
      title: photo.title,
      url: photo.url,
      createdAt: photo.createdAt,
      updatedAt: photo.updatedAt,
    };
  }

  static toDomain(raw: PrismaPhoto): Photo {
    return Photo.create(
      {
        orderId: raw.orderId,
        title: raw.title,
        url: raw.url,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id
    );
  }
}
