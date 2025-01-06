import { Photo } from "@/domain/enterprise/entities/photo";

export abstract class PhotoRepository {
  abstract create(photo: Photo): Promise<void>;
}
