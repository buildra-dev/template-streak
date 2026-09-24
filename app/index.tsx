import { Redirect } from "expo-router";
import { useStore } from "../src/store";

export default function Index() {
  const { onboarded } = useStore();
  return <Redirect href={onboarded ? "/today" : "/onboarding"} />;
}
