"use client";
import { MissionApi } from "@/data/MissionApi";
import ReactSwal from "@/helper/AlertHelper";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useState, useEffect } from "react";
import MissionPageLayout from "./MissionPageLayout";
import HeaderBanner from "../common/HeaderBanner";
import palette from "@/styles/theme/palette";
import { missionTypeStyles } from "@/helper/GlobalValueHelper";
import BottomColorBar from "../common/BottomColorBar";
import { sendButtonClick } from "@/helper/GAHelper";

export default function MissionMatchingGame({ mission }) {
  const router = useRouter();
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  // Initialize the game
  useEffect(() => {
    initializeGame();
    setStartTime(Date.now());
  }, []);

  const initializeGame = () => {
    // Get cards from mission parameter
    const cardPairs = mission.parameter?.cards || [];

    // Create pairs (each card appears twice)
    const gameCards = [...cardPairs, ...cardPairs].map((card, index) => ({
      id: index,
      content: card.content || "",
      image: card.image,
      pairId: card.id,
      isFlipped: false,
      isMatched: false,
    }));

    // Shuffle the cards
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
  };

  const handleCardClick = cardId => {
    // Ignore if game is completed or currently checking a pair
    if (gameCompleted || isChecking) return;

    const card = cards.find(c => c.id === cardId);
    if (card.isFlipped || card.isMatched) return;

    // If we already have 2 flipped cards, reset them first
    if (flippedCards.length === 2) {
      setCards(currentCards =>
        currentCards.map(c =>
          flippedCards.includes(c.id) && !c.isMatched ? { ...c, isFlipped: false } : c,
        ),
      );
      setFlippedCards([]);
    }

    const newFlippedCards = flippedCards.length === 2 ? [cardId] : [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Update card state to flipped
    setCards(cards.map(c => (c.id === cardId ? { ...c, isFlipped: true } : c)));

    // Check for match when two cards are flipped
    if (newFlippedCards.length === 2) {
      setIsChecking(true);
      setMoves(m => m + 1);

      const [firstCardId, secondCardId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstCardId);
      const secondCard = cards.find(c => c.id === secondCardId);

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        // Match found
        setTimeout(() => {
          setCards(currentCards =>
            currentCards.map(c =>
              c.id === firstCardId || c.id === secondCardId ? { ...c, isMatched: true } : c,
            ),
          );

          setMatchedCards(prev => {
            const newMatched = [...prev, firstCard.pairId];
            if (newMatched.length === mission.parameter?.cards?.length) {
              setGameCompleted(true);
            }
            return newMatched;
          });

          setFlippedCards([]);
          setIsChecking(false);
        }, 500);
      } else {
        // No match - flip cards back
        setTimeout(() => {
          setCards(currentCards =>
            currentCards.map(c =>
              c.id === firstCardId || c.id === secondCardId ? { ...c, isFlipped: false } : c,
            ),
          );
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  const finishMission = async () => {
    try {
      setIsLoading(true);
      const endTime = Date.now();
      const timeTaken = Math.floor((endTime - startTime) / 1000); // in seconds

      const result = {
        moves: moves,
        time_taken: timeTaken,
        completed: true,
        message_zh: mission.parameter?.message_zh,
        message_en: mission.parameter?.message_en,
      };

      const response = await MissionApi.finishMission(mission.slug, result);

      if (!response) {
        ReactSwal.fire({
          icon: "error",
          title: t("error.title"),
          text: t("error.unable_to_complete_mission"),
        });
        return;
      }

      sendButtonClick("mission_complete", { mission_slug: mission.slug });
      router.push(`/mission-records/${response.slug}`);
    } catch (error) {
      console.error("Error completing mission:", error);
      ReactSwal.fire({
        icon: "error",
        title: t("error.title"),
        text: t(error.message || "error.unknown_error"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        backgroundImage: 'url("/assets/images/mission-bg/matching.png")',
        backgroundSize: "cover",
        backgroundPosition: "bottom",
      }}
    >
      <HeaderBanner
        title={mission.name}
        leftIcon={missionTypeStyles(mission.type).leftIcon}
        rightIcon={missionTypeStyles(mission.type).rightIcon}
        backgroundColor={missionTypeStyles(mission.type).color}
        fullWidth
      />
      <MissionPageLayout>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 2,
            alignItems: "center",
            flex: 1,
            flexDirection: "column",
          }}
        >
          {/* Game Stats */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              px: 2,
            }}
          >
            <Typography variant="h6">
              {t("mission.matching_game.moves")}: {moves}
            </Typography>
            <Typography variant="h6">
              {t("mission.matching_game.matched")}: {matchedCards.length}/
              {mission.parameter?.cards?.length || 0}
            </Typography>
          </Box>

          {/* Game Board - 4x4 Grid */}
          <Box
            sx={{
              width: "100%",
              maxWidth: "500px",
              px: 2,
            }}
          >
            <Grid container spacing={1.5}>
              {cards.map(card => (
                <Grid size={3} key={card.id}>
                  <Box
                    onClick={() => handleCardClick(card.id)}
                    sx={{
                      aspectRatio: "1",
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: card.isMatched ? "default" : "pointer",
                      transition: "all 0.3s ease",
                      position: "relative",
                      overflow: "hidden",
                      "&:hover": {
                        transform: card.isMatched ? "none" : "scale(1.05)",
                      },
                    }}
                  >
                    {card.isFlipped || card.isMatched ? (
                      card.image ? (
                        <Box
                          component="img"
                          src={card.image}
                          alt={card.content}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        <Typography
                          variant="h5"
                          sx={{
                            color: palette.text.primary,
                            textAlign: "center",
                            px: 0.5,
                            fontSize: { xs: "1.2rem", sm: "1.5rem" },
                            wordBreak: "break-word",
                          }}
                        >
                          {card.content}
                        </Typography>
                      )
                    ) : (
                      <Box
                        component="img"
                        src="/assets/images/matching/cover.svg"
                        alt="cover"
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>

        <Button variant="contained" disabled={!gameCompleted || isLoading} onClick={finishMission}>
          {t("mission.complete")}
        </Button>

        <BottomColorBar color={missionTypeStyles(mission.type).color} />
      </MissionPageLayout>
    </Box>
  );
}
