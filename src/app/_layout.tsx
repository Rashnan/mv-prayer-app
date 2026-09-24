import { NativeTabs } from "expo-router/unstable-native-tabs";
import { SQLiteProvider } from "expo-sqlite";
import { HeroUINativeProvider } from "heroui-native";
import type { JSX } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Uniwind } from "uniwind";

import "../global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { IslandProvider } from "../providers/island-provider";

Uniwind.setTheme("light");

export default function RootLayout(): JSX.Element {
  return (
    <GestureHandlerRootView className="flex-1">
      <HeroUINativeProvider config={{ devInfo: { stylingPrinciples: false } }}>
        <SafeAreaProvider>
          <BottomSheetModalProvider>
            <SQLiteProvider
              databaseName="salat.db"
              assetSource={{ assetId: require("../../assets/db/salat.db") }}
            >
              <IslandProvider>
                <NativeTabs
                  tintColor="#006044"
                  indicatorColor={"#d0fae5"}
                  backgroundColor="#ffffff"
                >
                  <NativeTabs.Trigger name="index">
                    <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
                    <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
                  </NativeTabs.Trigger>
                </NativeTabs>
              </IslandProvider>
            </SQLiteProvider>
          </BottomSheetModalProvider>
        </SafeAreaProvider>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}
