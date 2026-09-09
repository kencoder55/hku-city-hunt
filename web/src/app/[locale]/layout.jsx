import ApplicationProvider from "@/components/provider/ApplicationProvider";
import { routing } from "@/i18n/routing";

const metaContent = {
  en: {
    title: "330Day2026︳Citywide Five Sense Journey",
    description:
      "330 Day 2026 “Citywide Five-Senses Journey” invites you to join interactive city missions via our mission website. Explore sight, sound, smell, taste and touch, strengthen sensory awareness, reconnect with the community, and complete missions to win exciting prizes.",
  },
  "zh-HK": {
    title: "330Day 2026︳感‧生活—城市五感之旅",
    description:
      "330 Day 2026「城市五感旅程」以視、聽、嗅、味、觸為主題，透過任務網站參與城市互動任務，訓練五感覺察，重新連結自己與社區，完成任務更可贏取豐富獎品。",
  },
};

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const content = metaContent[locale] ?? metaContent["zh-HK"];

  return {
    title: content.title,
    description: content.description,
    openGraph: {
      title: content.title,
      description: content.description,
      images: ["https://330day2026.nlpra.org.hk/assets/images/og-image.png"],
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function RootLayout({ children, params }) {
  return <ApplicationProvider params={params}>{children}</ApplicationProvider>;
}
