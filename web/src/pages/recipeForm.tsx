
import CancelCreateRecipeButton from "@/components/recipie/cancelButton";
import DraftButton from "@/components/recipie/draftButton";
import PublishRecipeButton from "@/components/recipie/publishButton";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import useQueryRecipes from "@/hooks/use-query-recipes";
import { $router } from "@/lib/router";
import { 
  Button, 
  ButtonGroup, 
  Flex, IconButton, 
  Input, 
  Text, 
  Textarea, 
  Image, 
  VStack, 
  RadioGroup, 
  Spinner, 
} from "@chakra-ui/react";
// import {
//   FileUploadList,
//   FileUploadRoot,
//   FileUploadTrigger,
// } from "@/components/ui/file-upload"
import { redirectPage } from "@nanostores/router";
import { Trash } from "lucide-react";
import { KeyboardEvent, useEffect, useState } from "react";
// import { HiUpload } from "react-icons/hi";
// import { FileAcceptDetails } from "node_modules/@chakra-ui/react/dist/types/components/file-upload/namespace";
import { Cuisine, Difficulty, PdfResponse, Price } from "@/data/types";
import TagInput from "@/components/recipie/tagInput";
import { Separator } from '@chakra-ui/react'
import { fetchTags } from "@/data/api";
import AutoAllergens from "@/components/search/autoAllergens";
import pluralize from "pluralize";
import { $allergenTable } from "@/lib/store";
import { useStore } from "@nanostores/react";
import PDFUploadBtn from "@/components/recipie/pdfUploadBtn";


// If draft_id is set, this will be autopopulated on page load
// Also, "publishing" simply edits the draft and sets published = true
export default function RecipeForm({ draft_id }: { draft_id?: number }) {
  const { drafts } = useQueryRecipes();
  const draft = draft_id ? drafts.find((draft) => draft.id === draft_id) : null;
  
  const [ title, setTitle ] = useState<string>('');
  const [ description, setDescription ] = useState<string>('');
  const [ instructions, setInstructions ] = useState<string[]>(['']);
  const [ ingredients, setIngredients ] = useState<string[]>(['']);
  const [ selectedPrice, setSelectedPrice ] = useState<string>("$");
  const [ cookTime, setCookTime ] = useState<string>("");
  const [ cuisine, setCuisine ] = useState("1")
  const [ diff, setDiff ] = useState("1")
  const [ allergens, setAllergens ] = useState<string[]>([]);  
  const [ sources, setSources ] = useState<string[]>([]);
  const [ currIndex, setCurrindex ] = useState<number>(0);
  const [ empty, setEmpty ] = useState<boolean>(false);
  const [ img, setImage ] = useState<string>("/img_placeholder.jpg");
  const [ showAdditionalInfo, setShowAdditionalInfo] = useState<boolean>(false);
  const [ loading, setLoading ] = useState<boolean>(false);
  const [ editableAllergen, setEditable] = useState<string[]>([]);
  const [ url, setUrl ] = useState<string>('');
  const [ mealType, setMealType ] = useState<string[]>([]);  

  const allergyTable = useStore($allergenTable);

  const allergyList = allergyTable.map(allergen => allergen.name);

  useEffect(() => {
    if (!draft) {
      return;
    }

    setTitle(draft.title);
    setDescription(draft.description);
    setInstructions(draft.instructions);
    setIngredients(draft?.ingredients);
  }, [draft]);

  // Undefined draft = not found
  // Null draft = we didn't want to look for one
  if (draft === undefined) {
    redirectPage($router, 'home');
    return null;
  }

  const handleIngInput = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const list = [ ...ingredients ];
    list[index] = e.target.value;
    setIngredients(() => list);
  };

  const handleIngDelete = (index: number) => {
    const list = [ ...ingredients ];
    list.splice(index, 1);
    setCurrindex(currIndex - 1);
    setIngredients(() => list);
    setEmpty(false);
  };

  const handleAddIngredient = () => {
    if (ingredients[currIndex].trim() === "") {
      console.log('Cannot add empty ingredient')
      setEmpty(true);
    } else {
      setCurrindex(currIndex + 1);
      setIngredients((l) => [...l, ''])
      setEmpty(false);
    }
  }

  // const handleImageFile = (e: FileAcceptDetails) => {
  //   if (e.files.length > 0) {
  //     const file = e.files[0];
  //     const imageUrl = URL.createObjectURL(file); // Generate temporary URL
  //     setImage(imageUrl); // Store the image URL in state
  //   }
  // }

  // tag input logic
  let priceValue = "CHEAP";
  const handleSelect = (price: string) => {
    setSelectedPrice(prev => (prev === price ? "$" : price)); // Toggle selection
    if (price === "$") {
      priceValue = "CHEAP";
    } else if (price === "$$") {
      priceValue = "MODERATE";
    } else if (price === "$$$") {
      priceValue = "PRICEY";
    } else if (price === "$$$$") {
      priceValue = "EXPENSIVE"
    }
  };

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCookTime(e.target.value); // Update state with new value
  };


  // for the cuisine
  const handleCuisine = (option: string) => {
    setCuisine(option);
  }

  const handleClear = () => {
    setCuisine("1");
  }

  const handleDiff = (option: string) => {
    setDiff(option);
  }

  const handleClearDiff = () => {
    setDiff("1");
  }

  const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleGenerateTags = async () => {
    setLoading(true);
    try {
      const response = await fetchTags(title, description, instructions);
      const { cuisine: gptCuisine, difficulty: gptDifficulty, prepTime: gptPrepTime, price: gptPrice, ingredients: gptIngredients, mealTypes: gptMealTypes } = response.response;

      gptCuisine && setCuisine(gptCuisine);
      gptDifficulty && setDiff(gptDifficulty);
      gptPrepTime && setCookTime(gptPrepTime.toString());
      gptPrice && setSelectedPrice(gptPrice);
      gptIngredients && setIngredients(gptIngredients);
      gptMealTypes && setMealType(gptMealTypes)
      matchAllergens(allergyList, gptIngredients);          // match allergies to ingredients list

      setTimeout(() => {
      }, 2000);
     
      setShowAdditionalInfo(true);
      
    } catch (error) {
      console.error("Error generating tags", error);
    } finally {
      setLoading(false);
      setShowAdditionalInfo(true);
    }
  };


  const matchAllergens = (allergenList: string[], textArray: string[]) => {
      // make sure these are all singular so that they match
      const singularAllergens:string[] = allergenList.map(allergen => pluralize.singular(allergen)); 
      const singularTextArray: string[] = textArray.map(allergen => pluralize.singular(allergen)); 
      const matchedAllergens = singularAllergens.filter(allergen =>
          singularTextArray.some(text => new RegExp(`\\b${allergen}\\b`, 'i').test(text))
      );
      setAllergens(matchedAllergens); // Update state with matched allergens
  };

  const handleImageFile = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setImage(url);
      setUrl(url);
    }
  }

  const handlePdfUpload = (response: PdfResponse) => {
    const { response : data } = response;
    setTitle(data.title)
    setDescription(data.description)
    setInstructions([data.instructions])
    setIngredients(data.ingredients)
    setSelectedPrice(data.price)
    setCookTime(String(data.prepTime))
    setCuisine(data.cuisine)
    setDiff(data.difficulty)
    setShowAdditionalInfo(true);
    setMealType(data.mealTypes)
    matchAllergens(allergyList, data.ingredients); 
  }


  return (
    <Flex gap='4' flexDir='column' minW='100vw' align='center' justify='center'>
      <Flex pos='fixed' zIndex="100" top='0' left='0' w='100vw' h='10' bg="cyan.700" align='center' justify='center'>
        <Text color='bg' fontWeight='bold' fontSize='2xl'>
          {draft ? 'Edit an Existing Recipe' : 'Create a New Recipe'}
        </Text>
      </Flex>

      <Flex my='24' gap='4' flexDir='column' px='4' align='center'>

        <Flex direction="row" gap="8">

          {/* Column 1 */}
          <Flex direction="column" gap="4" w="35vw">
            {/* Image Upload */}
            <Image rounded="md" src={img} maxW="100%"/>

            {/* <FileUploadRoot accept={["image/png"]} onFileAccept={handleImageFile}>
              <FileUploadTrigger asChild>
                <Button variant="outline" size="sm">
                  <HiUpload /> Upload file
                </Button>
              </FileUploadTrigger>
              <FileUploadList />
            </FileUploadRoot> */}
            <Field label="Image Url">
              <Input
                bg="white"
                color="black"
                placeholder="Enter an image url"
                onKeyDown={(e) => handleImageFile(e)}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              >
              </Input>
            </Field>


            {/* Allow them to input a pdf*/}
            {!showAdditionalInfo && (
              <Flex direction="column">
              <Text fontSize="sm" color="gray.600" maxW="80%" mt={5}>
                If you'd like to upload a PDF to auto-fill the recipe creation form, please upload it here:
              </Text>
              <PDFUploadBtn onComplete={handlePdfUpload}/>
              </Flex>
            )}
            

            {/* Ingredients */}
            {showAdditionalInfo && <Field label='Ingredients' required>
              <Flex gap='3' justify='flex-start' flexWrap='wrap' w='100%'>
                {ingredients.map((ingredient, i) => (
                  <InputGroup
                    key={i}
                    w='100%'
                    endElement={(
                      <IconButton
                        variant='ghost'
                        color='red.400'
                        me='-1'
                        size='xs'
                        onClick={() => handleIngDelete(i)}
                      >
                        <Trash />
                      </IconButton>
                    )}
                  >
                    <Input
                      placeholder='Enter an ingredient...'
                      value={ingredient}
                      onChange={(e) => handleIngInput(i, e)}
                    />
                  </InputGroup>
                ))}
                
                <Flex justifyContent={empty ? 'space-between' : 'end'} w="full" alignContent="center">
                  {empty && (
                    <Text color="red" fontSize="sm">
                      Cannot add an empty ingredient!
                    </Text>
                  )}
                  <Button bgGradient="to-r" bg="cyan.500" onClick={handleAddIngredient}>
                    Add Ingredient
                  </Button>
                </Flex>
              </Flex>
            </Field>}
          </Flex>
          

          {/* Column 2 */}
          <Flex direction="column" gap="4">

            <Field label='Title' required w='50rem' maxW='80%'>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Enter a recipe title...'
              />
            </Field>

            <Field label='Description' required w='50rem' maxW='80%'>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Enter a recipe description...'
                h='7lh'
              />
            </Field>

            {/* Instructions */}
            <Field label='Instructions' required w='50rem' maxW='80%' >
              <Textarea
                value={instructions[0]}
                onChange={(e) => setInstructions([ e.target.value ])}
                placeholder='Enter recipe instructions...'
                h='10lh'
              />
            </Field>

            <Separator w='50rem' maxW='80%' size="sm" mt="2"/>
            
            <Flex direction="column" gap="4" alignContent={"center"}>
              {!showAdditionalInfo && (
                <Text fontSize="sm" w='50rem' maxW="80%">
                  Enter the title, description, and instructions for your recipe
                  to auto-generate suggestions for your ingredients list, price range, and more!
                </Text>
              )}

              {!showAdditionalInfo && (
                <Button 
                  w='50rem' 
                  maxW="80%"
                  bg="cyan.500"
                  onClick={handleGenerateTags}
                  disabled={!(title && description && instructions[0])}
                  > 
                  {loading ? <Spinner size="lg" color="white" /> : "Auto-Generate Suggestions"}
                </Button>
              )}
            </Flex>

            {/* Additional Information Section */}
            {showAdditionalInfo && <Flex direction="column" gap="4">
              <Text fontWeight="bold" fontSize="sm">Additional Information</Text>
              
              {/* Price */}
              <Flex direction="row" gap='23.5rem' maxW="80%">
                <Text color="black" fontWeight="bold" fontSize="sm"> Price </Text>
                <Flex direction="row" gap="2">
                    {["$", "$$", "$$$", "$$$$"].map((price) => (
                        <Button
                            key={price}
                            size="sm"
                            borderRadius="10px"
                            bg={selectedPrice === price ? "purple.400" : ""}
                            color={selectedPrice === price ? 'white' : 'black'}
                            onClick={() => handleSelect(price)}
                            variant="outline"
                        >
                            {price}
                        </Button>
                    ))}
                </Flex>
              </Flex>
              <Flex direction="row" justify="space-between" w="41rem">  

                {/* Tag Inputs */}
                <Flex direction="column">
                {/* Cook time */}
                  <Field label='Cook Time' required w='20rem' >
                    <Input
                          placeholder="Enter time in minutes"
                          value={cookTime} // Bind input value to state
                          onChange={handleChange} // Track changes in input
                      />
                  </Field>

                  {/* Allergens */}
                  <AutoAllergens 
                    tags={allergens}
                    editableTags={editableAllergen}
                    setEditable={setEditable}
                  />

                  {/* Sources */}
                  <TagInput 
                    title="Sources" 
                    placeholder="CharMar" 
                    width="20rem"
                    tags={sources} 
                    setTags={setSources}/>

                  {/* Meal Type */}
                  <TagInput 
                      title="Meal Type"
                      placeholder="Snack, Lunch, Dinner"
                      width="20rem"
                      tags={mealType}
                      setTags={setMealType}
                    />
                </Flex>

                    
                
                {/* Difficulty & Cuisine */}
                <Flex direction="row" mt="2">      
                    <Flex flexDirection="column" gap={2}> 
                    <Text
                        fontSize="sm"
                        mb="5px"
                        fontWeight="bold"
                    >
                        {"Cuisine"}
                    </Text>

                    <RadioGroup.Root value={cuisine} onValueChange={(e) => handleCuisine(e.value)} flexWrap="nowrap" colorPalette="purple">
                    <VStack align="start">
                        {Object.values(Cuisine).map((item) => (
                        <RadioGroup.Item key={item} value={item}>
                            <RadioGroup.ItemHiddenInput />
                            <RadioGroup.ItemIndicator />
                            <RadioGroup.ItemText>{capitalizeFirstLetter(item)}</RadioGroup.ItemText>
                        </RadioGroup.Item>
                        ))}
                    </VStack>
                    </RadioGroup.Root>

                    <Button variant="outline" size="sm" borderRadius="12px" onClick={() => handleClear()}>
                        Clear
                    </Button>

                    </Flex>
                    
                    {/* Difficulty: Dropdown */}
                    <Flex flexDirection="column" gap={2}> 
                    <Text
                        fontSize="sm"
                        mb="5px"
                        fontWeight="bold"
                    >
                        {"Difficulty"}
                    </Text>

                    <RadioGroup.Root value={diff} onValueChange={(e) => handleDiff(e.value)} flexWrap="nowrap" colorPalette="purple">
                    <VStack align="start">
                        {Object.values(Difficulty).map((item) => (
                        <RadioGroup.Item key={item} value={item}>
                            <RadioGroup.ItemHiddenInput />
                            <RadioGroup.ItemIndicator />
                            <RadioGroup.ItemText>{capitalizeFirstLetter(item)}</RadioGroup.ItemText>
                        </RadioGroup.Item>
                        ))}
                    </VStack>
                    </RadioGroup.Root>

                    <Button variant="outline" size="sm" borderRadius="12px" onClick={() => handleClearDiff()}>
                        Clear
                    </Button>
                    </Flex>
                </Flex>
              </Flex>
            </Flex>}

          </Flex>
        </Flex>
       
      <Flex mt="16">
          <ButtonGroup>
            <CancelCreateRecipeButton />
            {showAdditionalInfo && <DraftButton
              title={title}
              description={description}
              ingredients={ingredients.map((item) => item.toLowerCase())}
              instructions={instructions}
              price={Price[priceValue as keyof typeof Price]}
              prepTime={Number(cookTime)}
              cuisine={Cuisine[cuisine as keyof typeof Cuisine]}
              difficulty={Difficulty[diff as keyof typeof Difficulty]}
              allergens={allergens.map((item) => item.toLowerCase())}
              sources={sources.map((item) => item.toLowerCase())}
              mealTypes={mealType.map((item) => item.toLowerCase())}
              image={url}
            />}

            {showAdditionalInfo && <PublishRecipeButton
              title={title}
              description={description}
              ingredients={ingredients.map((ing) => ing.toLowerCase())}
              instructions={instructions}
              draft_id={draft?.id}
              price={Price[priceValue as keyof typeof Price]}
              prepTime={Number(cookTime)}
              cuisine={Cuisine[cuisine as keyof typeof Cuisine]}
              difficulty={Difficulty[diff as keyof typeof Difficulty]}
              allergens={allergens.map((item) => item.toLowerCase())}
              sources={sources.map((item) => item.toLowerCase())}
              image={url}
              mealTypes={mealType.map((item) => item.toLowerCase())}
            />}
          </ButtonGroup>
      </Flex>

      </Flex>
    </Flex>
  );
}
