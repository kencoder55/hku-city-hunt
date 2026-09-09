import { Box, Container, Fade } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useEffect, useRef, useState } from "react";

/**
 * Reusable layout component for mission pages
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to be displayed
 * @param {number} [props.py=8] - Vertical padding
 * @param {number} [props.gap=4] - Gap between elements
 * @param {Object} [props.sx] - Additional sx props to merge with default styles
 */
export default function MissionPageLayout({ children, sx = {} }) {
  const containerRef = useRef(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  useEffect(() => {
    const checkScrollable = () => {
      if (containerRef.current) {
        const { scrollHeight, clientHeight, scrollTop } = containerRef.current;
        const isScrollable = scrollHeight > clientHeight;
        const isAtTop = scrollTop < 10;
        setShowScrollIndicator(isScrollable && isAtTop);
      }
    };

    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop } = containerRef.current;
        if (scrollTop > 10) {
          setShowScrollIndicator(false);
        }
      }
    };

    // Check initially and on resize
    checkScrollable();
    window.addEventListener("resize", checkScrollable);

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("resize", checkScrollable);
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [children]);

  return (
    <Box sx={{ position: "relative" }}>
      <Container
        ref={containerRef}
        maxWidth={false}
        sx={{
          pt: 4,
          pb: 4,
          gap: 2,
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          flexDirection: "column",
          /* Keep a single height declaration (use dynamic viewport height). The previous
             `100vh` line was duplicated and overwritten; keep `100dvh` for more
             consistent behavior on mobile. */
          height: "calc(100dvh - 52px - 56px)", // 52px = AppBar height, 56px = approx HeaderBanner height
          boxSizing: "border-box",
          overflowX: "hidden",
          overflowY: "auto",
          ...sx,
        }}
      >
        {children}
      </Container>

      {/* Scroll Indicator */}
      <Fade in={showScrollIndicator}>
        <Box
          sx={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pointerEvents: "none",
            zIndex: 10,
            borderRadius: "50%",
            p: 1,
          }}
        >
          <Box
            sx={{
              animation: "bounce 2s infinite",
              "@keyframes bounce": {
                "0%, 20%, 50%, 80%, 100%": {
                  transform: "translateY(0)",
                },
                "40%": {
                  transform: "translateY(-10px)",
                },
                "60%": {
                  transform: "translateY(-5px)",
                },
              },
            }}
          >
            <KeyboardArrowDownIcon
              sx={{
                fontSize: 40,
                color: "primary.main",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: "50%",
              }}
            />
          </Box>
        </Box>
      </Fade>
    </Box>
  );
}
