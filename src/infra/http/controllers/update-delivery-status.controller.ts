import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { Roles } from "@/infra/auth/roles.decorator";
import { Body, Controller, HttpCode, Param, Patch } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";

const updateDeliveryStatusBodySchema = z.object({
  status: z.enum(["created", "waiting", "delivered", "returned"]),
});
const bodyValidationPipe = new ZodValidationPipe(updateDeliveryStatusBodySchema);
type UpdateDeliveryStatusBodySchema = z.infer<typeof updateDeliveryStatusBodySchema>;

@Controller("/order/:deliveryId/status")
export class UpdateDeliveryStatusController {
  constructor() {}

  @Patch()
  @Roles("DELIVERIER")
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: UpdateDeliveryStatusBodySchema,
    @Param("deliveryId") deliveryId: string
  ) {
    const { status } = body;
    const { sub: userId, role } = user;

    console.log({ status, role, userId, deliveryId });
  }
}
