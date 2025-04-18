import { Box, Heading, Spinner, Center, Button } from "@chakra-ui/react";
import { RecipeType } from "@/data/types";
import RecipeCard from "../layout/recipeCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Suspense, useRef, useState } from "react";
import { Global, css } from '@emotion/react';
import Slider from 'react-slick';

interface SimilarRecipesSliderProps {
  recipes: RecipeType[];
  currentRecipeId?: number; 
  title?: string; // Add optional title prop
}

const SlickCarouselStyles = () => (
  <Global
    styles={css`
      .slick-slider {
        width: 100%;
        position: relative;
      }

      .slick-list {
        max-width: 100%;
        overflow: hidden;
        padding: 0 !important;
      }

      .slick-dots {
        transform: translateY(1em);
        bottom: -35px;
      }

      .slick-dots li button:before {
        font-size: 10px;
        color: #319795;
      }

      .slick-dots li.slick-active button:before {
        color: #2c7a7b;
      }

      .slick-track {
        display: flex;
        margin-left: 0;
        margin-right: 0;
        align-items: stretch;
      }

      .slick-slide {
        padding: 0 !important;
        height: auto;
      }

      .slick-slide > div {
        height: 100%;
      }
    `}
  />
);

const SimilarRecipesSlider = ({ recipes, title = "Similar Recipes" }: SimilarRecipesSliderProps) => {
  const sliderRef = useRef<any>(null);
  const [isDebounced, setIsDebounced] = useState(false);  // For debounce handling
  
  const similarRecipes = recipes;

  if (similarRecipes.length === 0) return null;

  // Debounced goToPrev function
  const goToPrev = () => {
    if (!isDebounced && sliderRef.current) {
      setIsDebounced(true);
      sliderRef.current.slickPrev();
      setTimeout(() => setIsDebounced(false), 500); // Delay time to prevent too many clicks
    }
  };

  // Debounced goToNext function
  const goToNext = () => {
    if (!isDebounced && sliderRef.current) {
      setIsDebounced(true);
      sliderRef.current.slickNext();
      setTimeout(() => setIsDebounced(false), 500); // Delay time to prevent too many clicks
    }
  };

  const slickSettings = {
    dots: true,
    infinite: true, // Always loop the slides
    speed: 500, // Reduced transition speed for better responsiveness
    slidesToShow: 3, // Show 3 recipes at a time
    slidesToScroll: 1,
    autoplay: false, // Disable autoplay for testing
    pauseOnHover: true,
    pauseOnFocus: true,
    swipeToSlide: true,
    arrows: false, // Keep this false if you’re testing default arrows
    draggable: true,
    cssEase: "ease-in-out", // Smooth transition easing
    centerMode: true, // This centers the slides
    centerPadding: '0', // Reduced padding for better centering
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2, // Show 2 slides on tablets
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1, // Show 1 slide on mobile
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <Box width="100%" maxWidth="100vw" my={8} px={16} position="relative">
      <SlickCarouselStyles /> 
      {title && <Heading size="lg" ml={4} mb={4}>{title}</Heading>}
      
      <Box
        width="100%"
        position="relative"
        maxWidth="100%"
        mx="auto"
        px={10}
      >
        {/* Custom Previous Button */}
        {similarRecipes.length > 3 && (
          <Button
            position="absolute"
            left="-30px"
            top="50%"
            transform="translateY(-50%)"
            zIndex={2}
            onClick={goToPrev}
            borderRadius="full"
            colorScheme="teal"
            size="md"
            boxShadow="0px 2px 10px rgba(0, 0, 0, 0.2)"
            _hover={{ boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)" }}
            w="40px"
            h="40px"
            minW="40px"
            p={0}
          >
            ←
          </Button>
        )}
        
        {/* Custom Next Button */}
        {similarRecipes.length > 3 && (
          <Button
            position="absolute"
            right="20px"
            top="50%"
            transform="translateY(-50%)"
            zIndex={2}
            onClick={goToNext}
            borderRadius="full"
            colorScheme="teal"
            size="md"
            boxShadow="0px 2px 10px rgba(0, 0, 0, 0.2)"
            _hover={{ boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)" }}
            w="40px"
            h="40px"
            minW="40px"
            p={0}
          >
            →
          </Button>
        )}

        <Suspense fallback={
          <Center py={8}>
            <Spinner size="xl" color="teal.500" />
          </Center>
        }>
          <Slider ref={sliderRef} {...slickSettings}>
            {similarRecipes.map((card: RecipeType) => (
              <RecipeCard key={card.id} recipe={card} />
            ))}
          </Slider>
        </Suspense>
      </Box>
    </Box>
  );
};

export default SimilarRecipesSlider;
