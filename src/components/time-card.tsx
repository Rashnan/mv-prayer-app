import { Card } from "heroui-native";
import { LucideSunrise, LucideSunset } from "lucide-react-native";
import { Text } from "react-native";

export function TimeCard({ label, time }: { label: "Sunrise" | "Sunset"; time: string }) {
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
