import { ListGroup, Separator } from "heroui-native";
import { Text, View } from "react-native";

import { type PrayerSchedule } from "../lib/prayer-times";
import { TimeCard } from "./time-card";

export function PrayerList({
  schedule,
  nextPrayerName,
}: {
  schedule: PrayerSchedule;
  nextPrayerName?: string;
}) {
  return (
    <View className="gap-2">
      <View className="flex-row justify-evenly gap-4">
        <TimeCard label="Sunrise" time={schedule.sunrise} />
        <TimeCard label="Sunset" time={schedule.sunset} />
      </View>
      <ListGroup className="bg-surface" variant="transparent">
        {schedule.prayers.map((prayer, index) => {
          const upcoming = prayer.name === nextPrayerName;
          return (
            <View key={prayer.name}>
              <ListGroup.Item className={upcoming ? "rounded-xl bg-emerald-100" : ""}>
                <ListGroup.ItemContent>
                  <ListGroup.ItemTitle className={upcoming ? "text-emerald-800" : ""}>
                    {prayer.name} <Text className="text-muted-foreground">{prayer.arabic}</Text>
                  </ListGroup.ItemTitle>
                </ListGroup.ItemContent>
                <ListGroup.ItemDescription
                  className={upcoming ? "font-bold text-emerald-800" : "font-bold"}
                >
                  {prayer.time}
                </ListGroup.ItemDescription>
              </ListGroup.Item>
              {index < schedule.prayers.length - 1 &&
                !upcoming &&
                schedule.prayers[index + 1].name !== nextPrayerName && (
                  <Separator className="mx-4" />
                )}
            </View>
          );
        })}
      </ListGroup>
    </View>
  );
}
