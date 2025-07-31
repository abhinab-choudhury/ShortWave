import Click from "../database/models/click.model";
import { IClick } from "../interfaces/model";

export async function getClickById(urlId: string): Promise<IClick> {
  const requiredUrl = await Click.findById(urlId);
  return requiredUrl!;
}

export async function createClick(
  data: Pick<
    IClick,
    "user_id" | "url_id" | "device_id" | "location_id" | "click_log"
  >,
): Promise<IClick> {
  const response = new Click(data);
  return await response.save();
}

export async function getTotalCGRPercent() {
  return "10%";
}
