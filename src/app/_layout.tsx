import { NativeTabs } from "expo-router/unstable-native-tabs";
import { SQLiteProvider } from "expo-sqlite";
import { HeroUINativeProvider } from "heroui-native";
import type { JSX } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import "../global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout(): JSX.Element {
  return (
    <GestureHandlerRootView className="flex-1">
      <HeroUINativeProvider>
        <SafeAreaProvider>
          <SQLiteProvider
            databaseName="salat.db"
            assetSource={{ assetId: require("../../assets/db/salat.db") }}
          >
            <NativeTabs tintColor="#006044" indicatorColor={"#d0fae5"} backgroundColor="#ffffff">
              <NativeTabs.Trigger name="index">
                <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
              </NativeTabs.Trigger>
            </NativeTabs>
          </SQLiteProvider>
        </SafeAreaProvider>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}
