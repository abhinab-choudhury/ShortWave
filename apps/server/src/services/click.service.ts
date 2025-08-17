import Click from "../database/models/click.model";
import { IClick, IUser } from "../interfaces/model";

export async function getClickById(urlId: string): Promise<IClick> {
  const requiredUrl = await Click.findById(urlId);
  return requiredUrl!;
}

export async function createClick(
  data: Pick<
    IClick,
    "short_url" | "date" | "click_cnt" | "device" | "country" | "os" | "browser"
  >,
): Promise<IClick> {
  const response = new Click(data);
  return await response.save();
}

export async function getTotalCGRPercent(userId: IUser["_id"]) {
  return "10%";
}
