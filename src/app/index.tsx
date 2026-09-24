import { useEffect, useState, type JSX } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

import dayjs, { type Dayjs } from "dayjs";
import duration from "dayjs/plugin/duration";
import { useSQLiteContext } from "expo-sqlite";

import { LucideMapPin, LucideRotateCcw, LucideSunrise, LucideSunset } from "lucide-react-native";
import { Card, ListGroup, Select, Separator, Typography } from "heroui-native";
import {
  getIslands,
  getNextPrayer,
  getPrayerSchedule,
  type Island,
  type Prayer,
  type PrayerSchedule,
} from "../lib/prayer-times";

dayjs.extend(duration);

function islandLabel(island: Island) {
  return island.id === 102 ? "Malé, Maldives" : `${island.name}, ${island.atoll} Maldives`;
}

function MosqueArtwork() {
  return (
    <View className="absolute bottom-0 right-0 h-[170px] w-[205px]" pointerEvents="none">
      <Svg
        width={205}
        height={170}
        viewBox="0 0 205 170"
        pointerEvents="none"
        accessibilityElementsHidden
      >
        <Circle cx="145" cy="47" r="34" fill="#5b8673" opacity={0.25} />
        <Path
          d="M45 170V103h12V79l4-9 4 9v24h12v67M164 170V92h10V62l5-12 5 12v30h10v78"
          fill="#8eb4a3"
          opacity={0.42}
        />
        <Path d="M69 170v-39c0-32 20-52 48-59 28 7 48 27 48 59v39Z" fill="#8eb4a3" opacity={0.47} />
        <Path
          d="M116 72V59m-8 3h17"
          stroke="#8eb4a3"
          strokeWidth={3}
          strokeLinecap="round"
          opacity={0.55}
        />
        <Rect x="76" y="132" width="82" height="38" fill="#8eb4a3" opacity={0.47} />
        <Path
          d="M105 170v-25a12 12 0 0 1 24 0v25M83 158v-14a7 7 0 0 1 14 0v14M138 158v-14a7 7 0 0 1 14 0v14"
          fill="#1a432f"
          opacity={0.35}
        />
        <Path
          d="M28 170v-24c0-13 8-21 19-26 11 5 19 13 19 26v24M174 170v-29c0-12 7-20 17-25 10 5 14 13 14 25v29"
          fill="#a6c5b4"
          opacity={0.35}
        />
      </Svg>
    </View>
  );
}

function NextPrayerCard({
  prayer,
  countdown,
  islands,
  islandId,
  onIslandChange,
}: {
  prayer: Prayer;
  countdown: string;
  islands: Island[];
  islandId: number;
  onIslandChange: (id: number) => void;
}) {
  const selectedIsland = islands.find((island) => island.id === islandId);
  return (
    <>
      <View>
        <Select
          presentation="bottom-sheet"
          value={{
            value: String(islandId),
            label: selectedIsland ? islandLabel(selectedIsland) : "Malé, Maldives",
          }}
          onValueChange={(option) => {
            if (option) onIslandChange(Number(option.value));
          }}
        >
          <Select.Trigger className="mb-4" variant="unstyled">
            <View className="flex-row items-center gap-2">
              <LucideMapPin />
              <Text className="font-bold">
                {selectedIsland ? islandLabel(selectedIsland) : "Malé, Maldives"}
              </Text>
              <Select.TriggerIndicator />
            </View>
          </Select.Trigger>
          <Select.Portal>
            <Select.Overlay />
            <Select.Content presentation="bottom-sheet" snapPoints={["70%"]}>
              <BottomSheetScrollView className="flex-1">
                {islands.map((island) => (
                  <Select.Item
                    key={island.id}
                    value={String(island.id)}
                    label={islandLabel(island)}
                  />
                ))}
              </BottomSheetScrollView>
            </Select.Content>
          </Select.Portal>
        </Select>
        <Card className="relative overflow-hidden bg-emerald-800">
          <MosqueArtwork />
          <Card.Body className="min-h-36 justify-center">
            <View className="gap-1 mb-4">
              <Card.Description className="text-slate-200 font-light">Next Prayer</Card.Description>
              <Card.Title className="text-slate-200 font-light">
                {prayer.name} <Text className="text-slate-200">{prayer.arabic}</Text>
              </Card.Title>
            </View>
            <Card.Description>
              <Typography.Heading className="text-slate-200 font-medium">
                {countdown}
              </Typography.Heading>
            </Card.Description>
          </Card.Body>
        </Card>
      </View>
    </>
  );
}

function DayList({
  today,
  selectedDate,
  onSelect,
}: {
  today: Dayjs;
  selectedDate: Dayjs;
  onSelect: (date: Dayjs) => void;
}) {
  const days = Array.from({ length: 7 }, (_, i) => today.add(i - 3, "day"));

  return (
    <View className="gap-4">
      <View className="mx-2 flex-row items-center justify-between">
        <Text className="text-xl font-bold">{selectedDate.format("MMMM YYYY")}</Text>
        <Pressable
          className="flex-row items-center gap-1 rounded-full bg-emerald-100 px-3 py-1"
          onPress={() => onSelect(dayjs())}
          accessibilityRole="button"
          accessibilityLabel="Back to today"
        >
          {!selectedDate.isSame(today, "day") && <LucideRotateCcw size={14} color="#065f46" />}
          <Text className="font-semibold text-emerald-800">Today</Text>
        </Pressable>
      </View>
      <View className="flex-row justify-evenly gap-2">
        {days.map((date) => {
          const selected = date.isSame(selectedDate, "day");
          return (
            <Pressable
              key={date.format("YYYY-MM-DD")}
              onPress={() => onSelect(date)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              className={`gap-1 rounded-full p-1 pt-2 ${selected ? "bg-emerald-700" : "bg-surface"}`}
            >
              <Text className={`text-center ${selected ? "text-slate-200" : ""}`}>
                {date.format("ddd").toUpperCase()}
              </Text>
              <View className="items-center justify-center">
                <View className="h-9 w-9 items-center justify-center rounded-full bg-background">
                  <Text>{date.format("D")}</Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function TimeCard({ label, time }: { label: "Sunrise" | "Sunset"; time: string }) {
  return (
    <Card className="flex-1 rounded-2xl bg-background" variant="transparent">
      <Card.Body className="items-center justify-center">
        {label === "Sunrise" ? <LucideSunrise size={20} /> : <LucideSunset size={20} />}

        <Text className="mt-1 text-xs text-muted-foreground">{label}</Text>

        <Text className="text-lg font-medium">{time}</Text>
      </Card.Body>
    </Card>
  );
}

function PrayerList({
  schedule,
  nextPrayerName,
}: {
  schedule: PrayerSchedule;
  nextPrayerName?: string;
}) {
  return (
    <View className="gap-4">
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

export default function HomeScreen(): JSX.Element {
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

  const next =
    currentSchedules?.key === currentKey
      ? getNextPrayer(currentSchedules.today, currentSchedules.tomorrow, now)
      : null;
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
        {next && (
          <NextPrayerCard
            prayer={next}
            countdown={countdown}
            islands={islands}
            islandId={islandId}
            onIslandChange={setIslandId}
          />
        )}
        <View className="gap-2">
          <DayList today={now} selectedDate={selectedDate} onSelect={setSelectedDate} />
          {error ? (
            <Text className="text-red-700">{error}</Text>
          ) : selectedSchedule?.key === selectedKey ? (
            <PrayerList
              schedule={selectedSchedule.schedule}
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
