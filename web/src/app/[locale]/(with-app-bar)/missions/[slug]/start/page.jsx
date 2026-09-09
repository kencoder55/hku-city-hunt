import AuthContainer from "@/components/common/AuthContainer";
import GpsGuard from "@/components/mission/GpsGuard";
import MissionAr from "@/components/mission/MissionAr";
import MissionLetter from "@/components/mission/MissionLetter";
import MissionMatchingGame from "@/components/mission/MissionMatchingGame";
import MissionPainting from "@/components/mission/MissionPainting";
import MissionPhoto from "@/components/mission/MissionPhoto";
import MissionQuiz from "@/components/mission/MissionQuiz";
import MissionReflection from "@/components/mission/MissionReflection";
import MissionVideo from "@/components/mission/MissionVideo";
import MissionWalking from "@/components/mission/MissionWalking";
import { MissionApi } from "@/data/MissionApi";
import { notFound } from "next/navigation";

export default async function MissionStart({ params }) {
  const { slug, locale } = await params;

  let mission;
  try {
    mission = await MissionApi.getMissionBySlug(slug, locale);
  } catch (error) {
    console.error('[MissionStart] Failed to fetch mission:', error?.message);
    throw new Error('Internal Server Error');
  }

  if (!mission) {
    notFound();
  }

  // check if the mission is active based on startTime and endTime
  const now = new Date();
  const startTime = new Date(mission.startTime);
  const endTime = new Date(mission.endTime);

  if (now < startTime || now > endTime) {
    notFound();
  }

  return (
    <AuthContainer>
      <GpsGuard mission={mission}>
        {mission.type == "quiz" && <MissionQuiz mission={mission} />}
        {mission.type == "photo" && <MissionPhoto mission={mission} />}
        {mission.type == "video" && <MissionVideo mission={mission} />}
        {mission.type == "reflection" && <MissionReflection mission={mission} />}
        {mission.type == "ar" && <MissionAr mission={mission} />}
        {mission.type == "walking" && <MissionWalking mission={mission} />}
        {mission.type == "painting" && <MissionPainting mission={mission} />}
        {mission.type == "matching" && <MissionMatchingGame mission={mission} />}
        {mission.type == "letter" && <MissionLetter mission={mission} />}
      </GpsGuard>
    </AuthContainer>
  );
}
