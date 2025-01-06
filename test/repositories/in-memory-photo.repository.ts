import { PhotoRepository } from "@/domain/application/repositories/photo.repository";
import { Photo } from "@/domain/enterprise/entities/photo";

export class InMemoryPhotoRepository implements PhotoRepository {
  public items: Photo[] = [];

  async create(photo: Photo): Promise<void> {
    this.items.push(photo);
  }
}
