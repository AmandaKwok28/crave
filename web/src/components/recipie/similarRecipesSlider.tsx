import { Box, Heading, Spinner, Center, Button } from "@chakra-ui/react";
import { RecipeType } from "@/data/types";
import RecipeCard from "../layout/recipeCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Suspense, useRef, useState } from "react";
import { Global, css } from '@emotion/react';
import Slider from 'react-slick';
import { useStore } from "@nanostores/react";
import { $isMobile } from "@/lib/store";
import useQueryRecipes from "@/hooks/use-query-recipes";

interface SimilarRecipesSliderProps {
  recipes: RecipeType[];
  currentRecipeId?: number; 
  title?: string;
}

const SlickCarouselStyles = () => (
  <Global
    styles={css`
      .slick-slider {
        width: 100%;
        margin: 0 auto;
      }

      .slick-list {
        overflow: hidden;
        padding: 10px 0 !important; /* Add vertical padding */
      }

      .slick-track {
        display: flex !important;
        align-items: center;
        justify-content: center !important;
      }

      .slick-slide {
        display: flex !important;
        justify-content: center !important;
        height: auto;
        padding: 0 8px; /* Horizontal spacing between slides */
      }

      .slick-slide > div {
        width: 100%;
      }

      .slick-dots {
        bottom: -25px;
      }

      .slick-dots li button:before {
        font-size: 10px;
        color: #319795;
      }

      .slick-dots li.slick-active button:before {
        color: #2c7a7b;
      }
    `}
  />
);

const SimilarRecipesSlider = ({ recipes, title = "Similar Recipes" }: SimilarRecipesSliderProps) => {
  const sliderRef = useRef<any>(null);
  const [isDebounced, setIsDebounced] = useState(false);
  const isMobile = useStore($isMobile);
  const { loadRecipes } = useQueryRecipes();

  const similarRecipes = recipes;

  if (similarRecipes.length === 0) return null;

  const goToPrev = () => {
    if (!isDebounced && sliderRef.current) {
      setIsDebounced(true);
      sliderRef.current.slickPrev();
      setTimeout(() => setIsDebounced(false), 500);
    }
  };

  const goToNext = () => {
    if (!isDebounced && sliderRef.current) {
      setIsDebounced(true);
      sliderRef.current.slickNext();
      setTimeout(() => setIsDebounced(false), 500);
    }
  };

  const slickSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 1 : 3,
    slidesToScroll: 1,
    autoplay: false,
    pauseOnHover: true,
    arrows: false,
    draggable: true,
    cssEase: "ease-in-out",
    centerMode: false, // Disabled for better control
    variableWidth: false, // Ensure consistent slide widths
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <Box width="100%" my={8} px={isMobile ? 12 : 8} alignContent='center'>
      <SlickCarouselStyles />
      {title && <Heading size="lg" mb={6} textAlign="center">{title}</Heading>}
      
      <Box position="relative" width="100%" maxWidth="1200px" mx="auto">
        {similarRecipes.length > 3 && (
          <>
            <Button
              position="absolute"
              left={isMobile ? "-15px" : "-30px"}
              top="50%"
              transform="translateY(-50%)"
              zIndex={2}
              onClick={goToPrev}
              borderRadius="full"
              colorScheme="teal"
              size={isMobile ? "sm" : "md"}
              boxShadow="md"
              _hover={{ boxShadow: "lg" }}
              w={isMobile ? "30px" : "40px"}
              h={isMobile ? "30px" : "40px"}
            >
              ←
            </Button>
            <Button
              position="absolute"
              right={isMobile ? "-15px" : "-30px"}
              top="50%"
              transform="translateY(-50%)"
              zIndex={2}
              onClick={goToNext}
              borderRadius="full"
              colorScheme="teal"
              size={isMobile ? "sm" : "md"}
              boxShadow="md"
              _hover={{ boxShadow: "lg" }}
              w={isMobile ? "30px" : "40px"}
              h={isMobile ? "30px" : "40px"}
            >
              →
            </Button>
          </>
        )}

        <Suspense fallback={
          <Center py={8}>
            <Spinner size="xl" color="teal.500" />
          </Center>
        }>
          <Slider ref={sliderRef} {...slickSettings}>
            {similarRecipes.map((card: RecipeType) => (
              <Box key={card.id} px={2} maxW="350px" w="100%" mx="auto">
                <RecipeCard recipe={card} loadRecipes={loadRecipes}/>
              </Box>
            ))}
          </Slider>
        </Suspense>
      </Box>
    </Box>
  );
};

export default SimilarRecipesSlider;