import MissionsList from "@/components/mission/MissionsList";
import { MissionApi } from "@/data/MissionApi";

export default async function MissionsPage({ params }) {
  const { locale } = await params;

  let missions = [];
  try {
    const response = await MissionApi.list(1, null, [], locale);
    missions = response.data || [];
  } catch (error) {
    console.warn(
      "[MissionsPage] Failed to fetch missions:",
      error?.code || error?.message || error,
    );
  }

  return <MissionsList initialMissions={missions} />;
}
