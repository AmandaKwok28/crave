
import CancelCreateRecipeButton from "@/components/recipie/cancelButton";
import DraftButton from "@/components/recipie/draftButton";
import PublishRecipeButton from "@/components/recipie/publishButton";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import useQueryRecipes from "@/hooks/use-query-recipes";
import { $router } from "@/lib/router";
import { Button, ButtonGroup, Flex, IconButton, Input, Text, Textarea, Image, VStack, RadioGroup, Spinner } from "@chakra-ui/react";
import {
  FileUploadList,
  FileUploadRoot,
  FileUploadTrigger,
} from "@/components/ui/file-upload"
import { redirectPage } from "@nanostores/router";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { HiUpload } from "react-icons/hi";
import { FileAcceptDetails } from "node_modules/@chakra-ui/react/dist/types/components/file-upload/namespace";
import { Cuisine, Difficulty, Price } from "@/data/types";
import TagInput from "@/components/recipie/tagInput";
import { Separator } from '@chakra-ui/react'
import { fetchTags } from "@/data/api";

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
  const [ img, setImage ] = useState<string>("img_placeholder.jpg");
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenerateTags = async () => {
    setLoading(true);
    try {
      const response = await fetchTags(title, description, instructions);
      console.log(response)
      response.response.cuisine && setCuisine(response.response.cuisine);
      response.response.difficulty && setDiff(response.response.difficulty);
      response.response.prepTime && setCookTime(response.response.prepTime.toString());
      response.response.price && setSelectedPrice(response.response.price);
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

  const handleImageFile = (e: FileAcceptDetails) => {
    if (e.files.length > 0) {
      const file = e.files[0];
      const imageUrl = URL.createObjectURL(file); // Generate temporary URL
      setImage(imageUrl); // Store the image URL in state
    }
  }

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


  // handle the tags for allergens

  return (
    <Flex gap='4' flexDir='column' minW='100vw' align='center' justify='center'>
      <Flex pos='fixed' zIndex="100" top='0' left='0' w='100vw' h='10' bgGradient="to-r" gradientFrom="cyan.300" gradientTo="blue.400" align='center' justify='center'>
        <Text color='bg' fontWeight='bold' fontSize='3xl'>
          {draft ? 'Edit an Existing Recipe' : 'Create a New Recipe'}
        </Text>
      </Flex>

      <Flex my='24' gap='4' flexDir='column' px='4' align='center'>

        <Flex direction="row" gap="8">

          {/* Column 1 */}
          <Flex direction="column" gap="4">

            {/* Image Upload */}
            <Image rounded="md" src={img} w="30vw"/>

            <FileUploadRoot accept={["image/png"]} onFileAccept={handleImageFile}>
              <FileUploadTrigger asChild>
                <Button variant="outline" size="sm">
                  <HiUpload /> Upload file
                </Button>
              </FileUploadTrigger>
              <FileUploadList />
            </FileUploadRoot>

            {/* Instructions */}
            <Field label='Instructions' required >
              <Textarea
                value={instructions[0]}
                onChange={(e) => setInstructions([ e.target.value ])}
                placeholder='Enter recipe instructions...'
                h='12lh'
              />
            </Field>

            {/* Ingredients */}
            <Field label='Ingredients' required>
              <Flex gap='3' justify='flex-end' flexWrap='wrap' w='100%'>
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
                  <Button bgGradient="to-r" gradientFrom="cyan.300" gradientTo="blue.400" onClick={handleAddIngredient}>
                    Add Ingredient
                  </Button>
                </Flex>
              </Flex>
            </Field>
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
                h='10lh'
              />
            </Field>

            <Separator w='50rem' maxW='80%' size="sm" mt="2"/>

            {!showAdditionalInfo && (
              <Button 
                w='50rem' 
                maxW="80%"
                bg="cyan.500"
                onClick={handleGenerateTags}
                > 
                {loading ? <Spinner size="lg" color="white" /> : "Auto Generate Tags"}
              </Button>
            )}

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
                  <TagInput 
                    title="Allergens" 
                    placeholder="Peanuts"
                    width="20rem"
                    tags={allergens} 
                    setTags={setAllergens}/>

                  {/* Sources */}
                  <TagInput 
                    title="Sources" 
                    placeholder="CharMar" 
                    width="20rem"
                    tags={sources} 
                    setTags={setSources}/>
                </Flex>
                
                {/* Ingredients & Cuisine */}
                <Flex direction="row" mt="2">      
                    <Flex flexDirection="column" gap={2}> 
                    <Text
                        fontSize="sm"
                        mb="5px"
                        fontWeight="bold"
                    >
                        {"Cuisine"}
                    </Text>

                    <RadioGroup.Root value={cuisine} onValueChange={(e) => handleCuisine(e.value)} flexWrap="nowrap">
                    <VStack align="start">
                        {Object.values(Cuisine).map((item) => (
                        <RadioGroup.Item key={item} value={item}>
                            <RadioGroup.ItemHiddenInput />
                            <RadioGroup.ItemIndicator />
                            <RadioGroup.ItemText>{item}</RadioGroup.ItemText>
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

                    <RadioGroup.Root value={diff} onValueChange={(e) => handleDiff(e.value)} flexWrap="nowrap">
                    <VStack align="start">
                        {Object.values(Difficulty).map((item) => (
                        <RadioGroup.Item key={item} value={item}>
                            <RadioGroup.ItemHiddenInput />
                            <RadioGroup.ItemIndicator />
                            <RadioGroup.ItemText>{item}</RadioGroup.ItemText>
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
            <DraftButton
              title={title}
              description={description}
              ingredients={ingredients}
              instructions={instructions}
              price={Price[priceValue as keyof typeof Price]}
              prepTime={Number(cookTime)}
              cuisine={Cuisine[cuisine as keyof typeof Cuisine]}
              difficulty={Difficulty[diff as keyof typeof Difficulty]}
              allergens={allergens}
              sources={sources}
            />

            <PublishRecipeButton
              title={title}
              description={description}
              ingredients={ingredients}
              instructions={instructions}
              draft_id={draft?.id}
              price={Price[priceValue as keyof typeof Price]}
              prepTime={Number(cookTime)}
              cuisine={Cuisine[cuisine as keyof typeof Cuisine]}
              difficulty={Difficulty[diff as keyof typeof Difficulty]}
              allergens={allergens}
              sources={sources}
            />
          </ButtonGroup>
        </Flex>
      </Flex>
    </Flex>
  );
}
