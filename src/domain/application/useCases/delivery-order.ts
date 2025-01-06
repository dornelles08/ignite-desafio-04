import { Either, left, right } from "@/core/either";
import { Order } from "@/domain/enterprise/entities/order";
import { Photo } from "@/domain/enterprise/entities/photo";
import { Injectable } from "@nestjs/common";
import { OrderRepository } from "../repositories/order.repository";
import { PhotoRepository } from "../repositories/photo.repository";
import { Uploader } from "../storage/uploader";
import { InvalidPhotoType } from "./errors/InvalidPhotoType";
import { NotAllowed } from "./errors/NotAllowed.error";
import { NotFound } from "./errors/NotFound";
import { UnkownError } from "./errors/UnkownError.error";

interface DeliveryOrderUseCaseRequest {
  orderId: string;
  userId: string;
  fileName: string;
  fileType: string;
  body: Buffer;
}

type DeliveryOrderUseCaseResponse = Either<
  NotFound | UnkownError | NotAllowed | InvalidPhotoType,
  { order: Order; photo: Photo }
>;

@Injectable()
export class DeliveryOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private photoRepository: PhotoRepository,
    private uploader: Uploader
  ) {}

  async execute({
    orderId,
    userId,
    fileName,
    fileType,
    body,
  }: DeliveryOrderUseCaseRequest): Promise<DeliveryOrderUseCaseResponse> {
    try {
      if (!fileType.includes("image")) {
        return left(new InvalidPhotoType(fileType));
      }

      const order = await this.orderRepository.findById(orderId);

      if (!order) {
        return left(new NotFound("Order"));
      }

      if (order.deliverierId !== userId || order.status !== "PICKUP") {
        return left(new NotAllowed());
      }

      order.status = "DELIVERED";

      const { url } = await this.uploader.upload({ fileName, fileType, body });

      const photo = Photo.create({
        orderId,
        title: fileName,
        url,
      });

      await Promise.all([this.orderRepository.save(order), this.photoRepository.create(photo)]);

      return right({ order, photo });
    } catch (error) {
      return left(new UnkownError());
    }
  }
}
