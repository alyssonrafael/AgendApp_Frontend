import { Stack } from "expo-router";
import CustomStatusBar from "../../components/CustomStatusBar";

export default function Layout() {
  return (
    <>
      <CustomStatusBar />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
