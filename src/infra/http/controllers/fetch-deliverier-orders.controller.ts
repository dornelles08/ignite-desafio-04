import { FetchDeliverierOrdersUseCase } from "@/domain/application/useCases/fetch-deliverier-orders";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { Controller, Get, InternalServerErrorException, Query } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { OrderPresenter } from "../presenters/order.presenter";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

type PageQueryParamsSchema = z.infer<typeof pageQueryParamSchema>;
const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

@Controller("/orders")
export class FetchDeliverierOrdersController {
  constructor(private fetchDeliverierOrders: FetchDeliverierOrdersUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query("page", queryValidationPipe) page: PageQueryParamsSchema
  ) {
    const { sub: deliverierId } = user;

    const result = await this.fetchDeliverierOrders.execute({
      deliverierId,
      page,
    });

    if (result.isLeft()) {
      throw new InternalServerErrorException();
    }

    const { orders } = result.value;

    return {
      orders: orders.map(OrderPresenter.toHTTP),
    };
  }
}
