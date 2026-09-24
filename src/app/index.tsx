import { type JSX } from "react";
import { ScrollView, Text, View } from "react-native";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

import { DayList } from "../components/day-list";
import { IslandSelect } from "../components/island-select";
import { NextPrayerCard } from "../components/next-prayer-card";
import { PrayerList } from "../components/prayer-list";
import { useIsland } from "../providers/island-provider";

dayjs.extend(duration);

export default function HomeScreen(): JSX.Element {
  const {
    now,
    selectedDate,
    setSelectedDate,
    selectedSchedule,
    nextPrayer: next,
    error,
  } = useIsland();
  const countdown = next
    ? dayjs.duration(Math.max(0, next.at.diff(now))).format("HH:mm:ss")
    : "--:--:--";

  return (
    <View className="flex-1 bg-surface pt-safe">
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-6 px-3 pt-2 pb-6"
        showsVerticalScrollIndicator={false}
      >
        <View>
          <IslandSelect />
          {next && <NextPrayerCard prayer={next} countdown={countdown} />}
        </View>
        <View className="gap-4">
          <DayList today={now} selectedDate={selectedDate} onSelect={setSelectedDate} />
          {error ? (
            <Text className="text-red-700">{error}</Text>
          ) : selectedSchedule ? (
            <PrayerList
              schedule={selectedSchedule}
              nextPrayerName={next?.at.isSame(selectedDate, "day") ? next.name : undefined}
            />
          ) : (
            <Text>Loading prayer times...</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
