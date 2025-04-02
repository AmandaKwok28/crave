import { Box, Heading, Spinner, Center, Button } from "@chakra-ui/react";
import { RecipeType } from "@/data/types";
import RecipeCard from "@/components/layout/recipeCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Suspense, useRef } from "react";

import Slider from 'react-slick';

interface SimilarRecipesSliderProps {
  recipes: RecipeType[];
  currentRecipeId?: number; // Make it optional since it's not being used
}

const SimilarRecipesSlider = ({ recipes }: SimilarRecipesSliderProps) => {
  const sliderRef = useRef<any>(null);
  
  // recipes is a list of similar recipes
  const similarRecipes = recipes;

  // Don't show anything if no similar recipes
  if (similarRecipes.length === 0) return null;
  
  // Methods to control the slider
  const goToPrev = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const goToNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };
  
  // Slider settings
  const slickSettings = {
    dots: true,
    infinite: similarRecipes.length > 3,
    speed: 700,
    slidesToShow: Math.min(3, similarRecipes.length),
    slidesToScroll: 1,
    autoplay: true,
    pauseOnHover: true,
    pauseOnFocus: true,
    swipeToSlide: true,
    arrows: false, // Disable default arrows
    draggable: true,
    cssEase: "ease-out",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, similarRecipes.length),
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
    <Box width="100%" maxWidth="100vw" my={8} px={16} position="relative">
      <Heading size="lg" ml={4} mb={4}>Similar Recipes</Heading>
      
      <Box
        width="100%"
        position="relative"
        maxWidth="100%"
        mx="auto"
        px={10}
        css={{
          ".slick-slider": {
            width: "100%",
            maxWidth: "100%",
            position: "relative"
          },
          ".slick-list": {
            maxWidth: "100%",
            overflow: "hidden",
            padding: "0 !important"
          },
          ".slick-dots": {
            transform: "translateY(1em)",
            bottom: "-35px"
          },
          ".slick-dots li button:before": {
            fontSize: "10px",
            color: "#319795"
          },
          ".slick-dots li.slick-active button:before": {
            color: "#2C7A7B"
          },
          ".slick-track": {
            display: "flex",
            marginLeft: 0,
            marginRight: 0,
            alignItems: "stretch"
          },
          ".slick-slide": {
            padding: "0 8px",
            height: "auto",
            "& > div": {
              height: "100%"
            }
          }
        }}
      >
        {/* Custom Previous Button */}
        {similarRecipes.length > 3 && (
          <Button
            position="absolute"
            left="-30px" // Fixed distance from the left edge of the slider container
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

            {similarRecipes.map((recipe:RecipeType) => (
              <Box key={recipe.id} padding={2} maxWidth="100%" height="100%">
                <RecipeCard recipe={recipe} />
              </Box>
            ))}
          </Slider>
        </Suspense>
      </Box>
    </Box>
  );
};

export default SimilarRecipesSlider;