import { BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet";
import { LucideCheck, LucideChevronDown, LucideMapPin } from "lucide-react-native";
import { useRef } from "react";
import { Pressable, Text } from "react-native";

import { type Island } from "../lib/prayer-times";
import { useIsland } from "../providers/island-provider";

function islandLabel(island: Island) {
  return island.id === 102 ? "Malé, Maldives" : `${island.name}, ${island.atoll} Maldives`;
}

export function IslandSelect() {
  const { islands, island, islandId, setIslandId } = useIsland();
  const islandSheet = useRef<BottomSheetModal>(null);

  return (
    <>
      <Pressable
        className="mb-4 flex-row items-center gap-2"
        onPress={() => islandSheet.current?.present()}
        accessibilityRole="button"
        accessibilityLabel="Choose island"
      >
        <LucideMapPin />
        <Text className="font-bold">{island ? islandLabel(island) : "Malé, Maldives"}</Text>
        <LucideChevronDown size={18} />
      </Pressable>
      <BottomSheetModal ref={islandSheet} snapPoints={["70%"]} enableDynamicSizing={false}>
        <BottomSheetFlatList
          data={islands}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <Pressable
              className="flex-row items-center justify-between border-b border-slate-100 px-6 py-4"
              onPress={() => {
                setIslandId(item.id);
                islandSheet.current?.dismiss();
              }}
              accessibilityRole="button"
              accessibilityState={{ selected: item.id === islandId }}
            >
              <Text className="text-base">{islandLabel(item)}</Text>
              {item.id === islandId && <LucideCheck size={18} color="#047857" />}
            </Pressable>
          )}
        />
      </BottomSheetModal>
    </>
  );
}
