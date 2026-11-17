import InteractiveMap from "@/components/home/InteractiveMap";
import { MissionApi } from "@/data/MissionApi";

export default async function Home({ params }) {
  const { locale } = await params;

  let missions = [];
  try {
    const response = await MissionApi.list(1, null, [], locale);
    missions = response.data || [];
  } catch (error) {
    console.warn(
      "[Home] Failed to fetch missions:",
      error?.code || error?.message || error,
    );
    // Render page with empty missions rather than crashing
  }

  return <InteractiveMap initialMissions={missions} />;
}
