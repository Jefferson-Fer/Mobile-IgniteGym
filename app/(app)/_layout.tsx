import { Redirect, Stack } from "expo-router";

import Loading from "@/components/Loading";
import useAuth from "@/hooks/useAuth";

export default function AppLayout() {
  const { user, isLoadingUserStorageData } = useAuth();

  if (!user?.name) {
    return <Redirect href="sign-in" />;
  }

  if (isLoadingUserStorageData) {
    return <Loading />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
