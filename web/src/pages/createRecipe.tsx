// import CancelCreateRecipeButton from "@/components/recipie/cancelButton";
// import GetIngredients from "@/components/recipie/getIngredients";
// import PublishRecipeButton from "@/components/recipie/publishButton";
// import { $currIngredientsList, $NumIngredientsCR, removeRowsIngredientsList, setNumIngredientsCR } from "@/lib/store";
// import { FormControl, FormLabel } from "@chakra-ui/form-control";
// import { NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper } from "@chakra-ui/number-input";
// import { Box, Button, ButtonGroup, Flex, Input, Stack, Text, Textarea, } from "@chakra-ui/react";
// import { useStore } from "@nanostores/react";
// import { useState } from "react";

// const CreateRecipe = () => {
//     const numIngredients = useStore($NumIngredientsCR);
//     const ingredientsList = useStore($currIngredientsList);

//     const [recipeTitle, setTitle] = useState<string>("");
//     const [recipeDescription, setDescription] = useState<string>("");
//     const [recipeInstructions, setInstructions] = useState<string>("");

//     const handleNumIngredientChange = (val: number) => {
//         setNumIngredientsCR(val)
//         if (ingredientsList.length > numIngredients) {
//             removeRowsIngredientsList(numIngredients)
//         }
//     };

//     const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setTitle(e.target.value);
//     };

//     const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//         setDescription(e.target.value);
//     };

//     const handleInstructionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//         setInstructions(e.target.value);
//     };
    
//     return (
//         <Flex className="flex flex-col">
//             <Flex zIndex="100" justify="center" as="header" position="fixed" w="100%" bgColor="cyan.600"> 
//                 <Text color="white" textStyle="3xl" fontWeight="bold" mb="3px"> Create a New Recipe </Text> 
//             </Flex>
//             <Box className="w-screen h-screen">
//                 <Stack>
//                     <FormControl isRequired mt="100px" mb="40px" ml="40px" mr="40px">
//                         <FormLabel mb="5px" fontSize="2rem">Title: </FormLabel>
//                         <Input variant="subtle" type="text" name="title" placeholder="please enter your recipe title here" onChange={handleTitleChange} />
//                     </FormControl>


//                     <FormControl mb="40px" ml="40px" mr="40px">
//                         <FormLabel mb="5px" fontSize="1.5rem" >Description: </FormLabel>
//                         <Textarea variant="subtle" name="description" placeholder="please enter your recipe description here" onChange={handleDescriptionChange}/>
//                     </FormControl>

//                     <FormControl mb="5px" ml="40px" mr="40px">
//                         <FormLabel mb="5px" fontSize="1.5rem">Number of Ingredients: </FormLabel>
//                         <NumberInput size='lg' maxW={50} defaultValue={5} min={1} max={35} onChange={(_, value) => handleNumIngredientChange(value)}>
//                             <NumberInputField />
//                             <NumberInputStepper>
//                                 <NumberIncrementStepper />
//                                 <NumberDecrementStepper />
//                             </NumberInputStepper>
//                         </NumberInput>
//                     </FormControl>

//                     <FormControl mb="40px" ml="40px" mr="40px">
//                         <FormLabel mb="5px" fontSize="1.5rem" >Ingredient Lists: </FormLabel>
//                         <GetIngredients numIngredients={numIngredients}/>
//                     </FormControl>
     
//                     <FormControl mb="40px" ml="40px" mr="40px">
//                         <FormLabel mb="5px" fontSize="1.5rem">Instructions: </FormLabel>
//                         <Textarea variant="subtle" name="title" placeholder="please enter your recipe instructions here" onChange={handleInstructionsChange}/>
//                     </FormControl>

//                     <Flex m="50px">
                        
//                     </Flex>

//                     <ButtonGroup m="8" position="fixed" bottom="0%" right="0%">
//                         <PublishRecipeButton title={recipeTitle} description={recipeDescription} instructions={recipeInstructions}/>
//                         <Button p="4" size="lg" bg="black" color="white">Save to Drafts</Button>
//                         <CancelCreateRecipeButton/>
//                     </ButtonGroup>
//                 </Stack>
                
//             </Box>
//         </Flex>
//     )
// }

// export default CreateRecipe;