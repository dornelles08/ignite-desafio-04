import { DeliveryOrderUseCase } from "@/domain/application/useCases/delivery-order";
import { NotAllowed } from "@/domain/application/useCases/errors/NotAllowed.error";
import { NotFound } from "@/domain/application/useCases/errors/NotFound";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { Roles } from "@/infra/auth/roles.decorator";
import {
  Controller,
  FileTypeValidator,
  ForbiddenException,
  HttpCode,
  InternalServerErrorException,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("/orders/:orderId/delivery")
export class DeliveryOrderController {
  constructor(private deliveryOrder: DeliveryOrderUseCase) {}

  @Post()
  @HttpCode(204)
  @Roles("DELIVERIER")
  @UseInterceptors(FileInterceptor("file"))
  async handle(
    @CurrentUser() user: UserPayload,
    @Param("orderId") orderId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2, // 2MB
          }),
          new FileTypeValidator({ fileType: ".(jpeg|png|jpg)" }),
        ],
      })
    )
    file: Express.Multer.File
  ) {
    const { sub: userId } = user;

    const result = await this.deliveryOrder.execute({
      userId,
      orderId,
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotFound:
          throw new NotFoundException();
        case NotAllowed:
          throw new ForbiddenException();
        default:
          throw new InternalServerErrorException();
      }
    }
  }
}
