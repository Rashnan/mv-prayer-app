import dayjs, { type Dayjs } from "dayjs";
import { useSQLiteContext } from "expo-sqlite";
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react";

import {
  getIslands,
  getNextPrayer,
  getPrayerSchedule,
  type Island,
  type PrayerSchedule,
} from "../lib/prayer-times";

type IslandContextValue = {
  islands: Island[];
  islandId: number;
  island?: Island;
  setIslandId: (id: number) => void;
  now: Dayjs;
  selectedDate: Dayjs;
  setSelectedDate: (date: Dayjs) => void;
  selectedSchedule?: PrayerSchedule;
  nextPrayer: ReturnType<typeof getNextPrayer> | null;
  error: string | null;
};

const IslandContext = createContext<IslandContextValue | null>(null);

export function IslandProvider({ children }: PropsWithChildren) {
  const db = useSQLiteContext();
  const [islands, setIslands] = useState<Island[]>([]);
  const [islandId, setIslandId] = useState(102);
  const [now, setNow] = useState(() => dayjs());
  const [selectedDate, setSelectedDate] = useState(() => dayjs());
  const [selectedSchedule, setSelectedSchedule] = useState<{
    key: string;
    schedule: PrayerSchedule;
  } | null>(null);
  const [currentSchedules, setCurrentSchedules] = useState<{
    key: string;
    today: PrayerSchedule;
    tomorrow: PrayerSchedule;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const todayKey = now.format("YYYY-MM-DD");
  const selectedKey = `${islandId}:${selectedDate.format("YYYY-MM-DD")}`;
  const currentKey = `${islandId}:${todayKey}`;

  useEffect(() => {
    let active = true;
    getIslands(db)
      .then((rows) => {
        if (active) setIslands(rows);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Could not load islands");
      });
    return () => {
      active = false;
    };
  }, [db]);

  useEffect(() => {
    const interval = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let active = true;
    getPrayerSchedule(db, selectedDate, islandId)
      .then((schedule) => {
        if (active) {
          setSelectedSchedule({ key: selectedKey, schedule });
          setError(null);
        }
      })
      .catch((cause: unknown) => {
        if (active)
          setError(cause instanceof Error ? cause.message : "Could not load prayer times");
      });
    return () => {
      active = false;
    };
  }, [db, selectedDate, selectedKey, islandId]);

  useEffect(() => {
    let active = true;
    Promise.all([
      getPrayerSchedule(db, dayjs(todayKey), islandId),
      getPrayerSchedule(db, dayjs(todayKey).add(1, "day"), islandId),
    ])
      .then(([today, tomorrow]) => {
        if (active) {
          setCurrentSchedules({ key: currentKey, today, tomorrow });
          setError(null);
        }
      })
      .catch((cause: unknown) => {
        if (active)
          setError(cause instanceof Error ? cause.message : "Could not load prayer times");
      });
    return () => {
      active = false;
    };
  }, [db, todayKey, islandId, currentKey]);

  const nextPrayer =
    currentSchedules?.key === currentKey
      ? getNextPrayer(currentSchedules.today, currentSchedules.tomorrow, now)
      : null;

  return (
    <IslandContext.Provider
      value={{
        islands,
        islandId,
        island: islands.find((item) => item.id === islandId),
        setIslandId,
        now,
        selectedDate,
        setSelectedDate,
        selectedSchedule:
          selectedSchedule?.key === selectedKey ? selectedSchedule.schedule : undefined,
        nextPrayer,
        error,
      }}
    >
      {children}
    </IslandContext.Provider>
  );
}

export function useIsland() {
  const context = useContext(IslandContext);
  if (!context) throw new Error("useIsland must be used within IslandProvider");
  return context;
}
