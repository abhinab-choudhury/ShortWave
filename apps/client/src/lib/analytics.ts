export type RangeValue = "7d" | "30d" | "90d";

export const RANGE_DAYS: Record<RangeValue, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

export const RANGE_LABELS: Record<RangeValue, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
};

export interface NamedCount {
  count: number;
  device_name?: string;
  browser_name?: string;
  country_name?: string;
  os_name?: string;
}

export interface ClickRecord {
  date: string;
  click_cnt: number;
  device?: NamedCount[];
  browser?: NamedCount[];
  country?: NamedCount[];
  os?: NamedCount[];
}

export interface CampaignUrlRecord {
  _id?: string;
  short_url: string;
  original_url: string;
  createdAt?: string;
  clicks?: ClickRecord[];
}

export interface CampaignLinkRecord {
  _id: string;
  name: string;
  urls?: CampaignUrlRecord[];
}

export interface DailyClicks {
  date: string;
  clicks: number;
}

export interface DeviceDailyClicks {
  date: string;
  desktop: number;
  mobile: number;
  tablet: number;
  other: number;
}

export type Dimension = "browser" | "device" | "country" | "os";

const DIMENSION_KEYS: Record<
  Dimension,
  "browser_name" | "device_name" | "country_name" | "os_name"
> = {
  browser: "browser_name",
  device: "device_name",
  country: "country_name",
  os: "os_name",
};

const DIMENSION_FALLBACK: Record<Dimension, string> = {
  browser: "Unknown browser",
  device: "Unknown device",
  country: "Unknown location",
  os: "Unknown OS",
};

export function parseDateKey(value: string): Date | null {
  if (!value) return null;
  const datePart = value.slice(0, 10);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datePart);
  if (match) {
    const [, year, month, day] = match;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
}

export function startOfToday() {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

export function rangeStart(days: number) {
  const start = startOfToday();
  start.setDate(start.getDate() - (days - 1));
  return start;
}

export function filterByRange<T extends { date: string }>(
  rows: T[],
  range: RangeValue,
): T[] {
  const start = rangeStart(RANGE_DAYS[range]);
  const end = startOfToday();
  end.setHours(23, 59, 59, 999);

  return rows.filter((row) => {
    const date = parseDateKey(row.date);
    return date !== null && date >= start && date <= end;
  });
}

export function formatDayLabel(value: string) {
  const date = parseDateKey(value);
  if (!date) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatFullDayLabel(value: string) {
  const date = parseDateKey(value);
  if (!date) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function mergeClicks(
  urls: CampaignUrlRecord[] | undefined,
  shortUrl?: string,
) {
  const records: ClickRecord[] = [];
  if (!urls?.length) return records;

  for (const url of urls) {
    if (shortUrl && url.short_url !== shortUrl) continue;
    records.push(...(url.clicks ?? []));
  }
  return records;
}

export function buildDailyClicks(
  urls: CampaignUrlRecord[] | undefined,
  shortUrl?: string,
): DailyClicks[] {
  const totals = new Map<string, number>();

  for (const click of mergeClicks(urls, shortUrl)) {
    const date = parseDateKey(click.date);
    if (!date) continue;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    totals.set(key, (totals.get(key) ?? 0) + (click.click_cnt ?? 0));
  }

  return Array.from(totals, ([date, clicks]) => ({ date, clicks })).sort(
    (a, b) => (parseDateKey(a.date)?.getTime() ?? 0) - (parseDateKey(b.date)?.getTime() ?? 0),
  );
}

export function buildDeviceDailyClicks(
  urls: CampaignUrlRecord[] | undefined,
  shortUrl?: string,
): DeviceDailyClicks[] {
  const rows = new Map<string, DeviceDailyClicks>();

  for (const click of mergeClicks(urls, shortUrl)) {
    const date = parseDateKey(click.date);
    if (!date) continue;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const row =
      rows.get(key) ??
      ({
        date: key,
        desktop: 0,
        mobile: 0,
        tablet: 0,
        other: 0,
      } satisfies DeviceDailyClicks);

    for (const device of click.device ?? []) {
      const name = (device.device_name ?? "").toLowerCase();
      if (name === "desktop") row.desktop += device.count;
      else if (name === "mobile") row.mobile += device.count;
      else if (name === "tablet") row.tablet += device.count;
      else row.other += device.count;
    }

    rows.set(key, row);
  }

  return Array.from(rows.values()).sort(
    (a, b) => (parseDateKey(a.date)?.getTime() ?? 0) - (parseDateKey(b.date)?.getTime() ?? 0),
  );
}

export function buildDimensionCounts(
  urls: CampaignUrlRecord[] | undefined,
  shortUrl: string,
  dimension: Dimension,
) {
  const counts = new Map<string, number>();
  const key = DIMENSION_KEYS[dimension];

  for (const click of mergeClicks(urls, shortUrl)) {
    for (const item of click[dimension] ?? []) {
      const label = item[key]?.trim() || DIMENSION_FALLBACK[dimension];
      counts.set(label, (counts.get(label) ?? 0) + item.count);
    }
  }

  return Array.from(counts, ([name, count]) => ({ name, count })).sort(
    (a, b) => b.count - a.count,
  );
}

export function getTotalClicks(
  urls: CampaignUrlRecord[] | undefined,
  shortUrl?: string,
) {
  return mergeClicks(urls, shortUrl).reduce(
    (total, click) => total + (click.click_cnt ?? 0),
    0,
  );
}
