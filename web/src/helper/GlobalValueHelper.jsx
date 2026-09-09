import palette from "@/styles/theme/palette";

export const getAuthCookieName = () => {
  return "hku_city_hunt_web_auth";
};

export const getLandingPageName = () => {
  return "landing";
};

// quiz
// photo
// audio
// reflection
// eslite
// mtr
// painting
// matching
export const missionTypeStyles = type => {
  const styles = {
    quiz: {
      color: "#DBAD58",
      leftIcon: "/assets/icons/mission-banner/4.svg",
      rightIcon: "/assets/icons/mission-banner/3.svg",
    },
    photo: {
      color: "#C88FBB",
      leftIcon: "/assets/icons/mission-banner/5.svg",
      rightIcon: "/assets/icons/mission-banner/6.svg",
    },
    video: {
      color: "#A8D3C0",
      leftIcon: "/assets/icons/mission-banner/7.svg",
      rightIcon: "/assets/icons/mission-banner/8.svg",
    },
    ar: {
      color: "#D6C682",
      leftIcon: "/assets/icons/mission-banner/13.svg",
      rightIcon: "/assets/icons/mission-banner/14.svg",
    },
    walking: {
      color: "#93CE6D",
      leftIcon: "/assets/icons/mission-banner/15.svg",
      rightIcon: "/assets/icons/mission-banner/16.svg",
    },
    painting: {
      color: "#F6ADCD",
      leftIcon: "/assets/icons/mission-banner/9.svg",
      rightIcon: "/assets/icons/mission-banner/10.svg",
    },
    matching: {
      color: "#96BED8",
      leftIcon: "/assets/icons/mission-banner/11.svg",
      rightIcon: "/assets/icons/mission-banner/12.svg",
    },
    reflection: {
      color: "#DBAD58",
      leftIcon: "/assets/icons/mission-banner/1.svg",
      rightIcon: "/assets/icons/mission-banner/2.svg",
    },
    letter: {
      color: "#C88FBB",
      leftIcon: "/assets/icons/mission-banner/17.svg",
      rightIcon: "/assets/icons/mission-banner/18.svg",
    },
    tamjai: {
      color: "#BD634D",
      leftIcon: "/assets/icons/mission-banner/19.svg",
      rightIcon: "/assets/icons/mission-banner/20.svg",
    },
    samgor: {
      color: "#BD634D",
      leftIcon: "/assets/icons/mission-banner/19.svg",
      rightIcon: "/assets/icons/mission-banner/20.svg",
    },
  };

  return styles[type] || styles["quiz"];
};

export const getMissionColor = code => {
  if (code.startsWith("V")) {
    return "#93bfda";
  } else if (code.startsWith("A")) {
    return "#89a5e2";
  } else if (code.startsWith("T")) {
    return "#f7c798";
  } else if (code.startsWith("S")) {
    return "#f6accd";
  } else if (code.startsWith("G")) {
    return "#fdc8ad";
  } else {
    return "#93bfda";
  }
};
