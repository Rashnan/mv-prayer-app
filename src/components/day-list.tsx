import dayjs, { type Dayjs } from "dayjs";
import { LucideRotateCcw } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

export function DayList({
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
      <View className="flex-row gap-2">
        {days.map((date) => {
          const selected = date.isSame(selectedDate, "day");
          return (
            <Pressable
              key={date.format("YYYY-MM-DD")}
              onPress={() => onSelect(date)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              className={`flex-1 items-center gap-1 rounded-xl p-1 ${selected ? "bg-emerald-700" : "bg-surface"}`}
            >
              <Text className={`text-center ${selected ? "text-slate-200" : ""}`}>
                {date.format("ddd").toUpperCase()}
              </Text>
              <View className="items-center justify-center">
                <View
                  className={`h-9 w-9 items-center justify-center rounded-full ${selected ? "bg-surface" : "bg-background"}`}
                >
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
