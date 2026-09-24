import { NativeTabs } from "expo-router/unstable-native-tabs";

export function AppTabs() {
  return (
    <NativeTabs
      tintColor="#006044"
      indicatorColor="#d0fae5"
      backgroundColor="#ffffff"
      shadowColor="#cbd5e1"
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
