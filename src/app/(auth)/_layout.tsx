import CustomStatusBar from "@/src/components/CustomStatusBar";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <>
      <CustomStatusBar />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
