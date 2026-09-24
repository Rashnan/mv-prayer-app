import { Text, View } from "react-native";
import { Card, Typography } from "heroui-native";

import { type Prayer } from "../lib/prayer-times";
import { MosqueArtwork } from "./mosque-artwork";

export function NextPrayerCard({ prayer, countdown }: { prayer: Prayer; countdown: string }) {
  return (
    <View>
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
  );
}
