import type { Dayjs } from "dayjs";
import type { SQLiteDatabase } from "expo-sqlite";

export type Prayer = {
  name: string;
  arabic: string;
  time: string;
  at: Dayjs;
};

export type PrayerSchedule = {
  prayers: Prayer[];
  sunrise: string;
  sunset: string;
};

export type Island = {
  id: number;
  name: string;
  atoll: string;
};

type IslandRow = { IslandId: number; Island: string; Atoll: string };

export async function getIslands(db: SQLiteDatabase): Promise<Island[]> {
  const rows = await db.getAllAsync<IslandRow>(
    "SELECT IslandId, Island, Atoll FROM Island ORDER BY Atoll COLLATE NOCASE, Island COLLATE NOCASE"
  );
  return rows.map((row) => ({ id: row.IslandId, name: row.Island, atoll: row.Atoll }));
}

type PrayerRow = {
  Fajuru: number;
  Sunrise: number;
  Dhuhr: number;
  Asr: number;
  Maghrib: number;
  Isha: number;
  Minutes: number;
};

export async function getPrayerSchedule(
  db: SQLiteDatabase,
  date: Dayjs,
  islandId: number
): Promise<PrayerSchedule> {
  const row = await db.getFirstAsync<PrayerRow>(
    `SELECT p.Fajuru, p.Sunrise, p.Dhuhr, p.Asr, p.Maghrib, p.Isha, i.Minutes
     FROM PrayerTimes p
     JOIN Island i ON i.CategoryId = p.CategoryId
     WHERE i.IslandId = ? AND p.MonthDay = ?`,
    [islandId, date.format("MM-DD")]
  );
  if (!row) throw new Error(`No prayer times for island ${islandId} on ${date.format("MM-DD")}`);

  const at = (minutes: number) => date.startOf("day").add(minutes + row.Minutes, "minute");
  const prayers = [
    { name: "Fajr", arabic: "الفجر", minutes: row.Fajuru },
    { name: "Dhuhr", arabic: "الظهر", minutes: row.Dhuhr },
    { name: "Asr", arabic: "العصر", minutes: row.Asr },
    { name: "Maghrib", arabic: "المغرب", minutes: row.Maghrib },
    { name: "Isha", arabic: "العشاء", minutes: row.Isha },
  ].map(({ name, arabic, minutes }) => ({
    name,
    arabic,
    at: at(minutes),
    time: at(minutes).format("h:mm A"),
  }));

  return {
    prayers,
    sunrise: at(row.Sunrise).format("HH:mm"),
    sunset: at(row.Maghrib).format("HH:mm"),
  };
}

export function getNextPrayer(today: PrayerSchedule, tomorrow: PrayerSchedule, now: Dayjs) {
  return today.prayers.find((prayer) => prayer.at.isAfter(now)) ?? tomorrow.prayers[0];
}
