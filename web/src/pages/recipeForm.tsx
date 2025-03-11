
import CancelCreateRecipeButton from "@/components/recipie/cancelButton";
import DraftButton from "@/components/recipie/draftButton";
import PublishRecipeButton from "@/components/recipie/publishButton";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import useQueryRecipes from "@/hooks/use-query-recipes";
import { $router } from "@/lib/router";
import { Button, ButtonGroup, Flex, IconButton, Input, Text, Textarea, Image } from "@chakra-ui/react";
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
import VerticalCheckBoxes from "@/components/search/DifficultyButtons";
import { Cuisine, Difficulty } from "@/data/types";

// If draft_id is set, this will be autopopulated on page load
// Also, "publishing" simply edits the draft and sets published = true
export default function RecipeForm({ draft_id }: { draft_id?: number }) {
  const { drafts } = useQueryRecipes();
  const draft = draft_id ? drafts.find((draft) => draft.id === draft_id) : null;
  
  const [ title, setTitle ] = useState<string>('');
  const [ description, setDescription ] = useState<string>('');
  const [ instructions, setInstructions ] = useState<string[]>(['']);
  const [ ingredients, setIngredients ] = useState<string[]>(['']);
  const [ currIndex, setCurrindex ] = useState<number>(0);
  const [ empty, setEmpty ] = useState<boolean>(false);
  const [ img, setImage ] = useState<string>("img_placeholder.jpg");

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

  const mealType = ['Breakfast', 'Lunch', 'Dinner'];

  return (
    <Flex gap='4' flexDir='column' minW='100vw' align='center' justify='center'>
      <Flex pos='fixed' zIndex="100" top='0' left='0' w='100vw' h='10' bgGradient="to-r" gradientFrom="cyan.300" gradientTo="blue.400" align='center' justify='center'>
        <Text color='bg' fontWeight='bold' fontSize='3xl'>
          {draft ? 'Edit an Existing Recipe' : 'Create a New Recipe'}
        </Text>
      </Flex>

      <Flex my='24' gap='4' flexDir='column' px='4' align='center'>

        <Flex direction="row" gap="8">

          {/* Column 1: image, cooking instructions, preferences */}
          <Flex direction="column" gap="4">
            {/* Add an image upload option... */}
            <Image rounded="md" src={img} w="30vw"/>

            <FileUploadRoot accept={["image/png"]} onFileAccept={handleImageFile}>
              <FileUploadTrigger asChild>
                <Button variant="outline" size="sm">
                  <HiUpload /> Upload file
                </Button>
              </FileUploadTrigger>
              <FileUploadList />
            </FileUploadRoot>

            <Field label='Instructions' required >
              <Textarea
                value={instructions[0]}
                onChange={(e) => setInstructions([ e.target.value ])}
                placeholder='Enter recipe instructions...'
                h='12lh'
              />
            </Field>

            {/* Tags */}
            Additional Information (optional)
            <Flex direction="row" w="full" gap="2" alignItems="center" justifyContent="space-between">
              {/* Price */}
              <Field label='Price' required >
                <Flex direction="row" gap="2">
                    <Button size="sm" borderRadius="10px" bg="white" color="black" variant="outline">
                        $
                    </Button>
                    <Button size="sm" borderRadius="10px" bg="white" color="black" variant="outline">
                        $$
                    </Button>
                    <Button size="sm" borderRadius="10px" bg="white" color="black" variant="outline">
                        $$$
                    </Button>
                    <Button size="sm" borderRadius="10px" bg="white" color="black" variant="outline">
                        $$$$
                    </Button>
                </Flex>
              </Field>
            </Flex>

            {/* Cook time */}
            <Field label='Cook Time' required >
              <Input placeholder="Enter time in minutes"/>
            </Field>

            <Flex direction="row" gap="20" mt="2">      
                <VerticalCheckBoxes 
                    title={"Cuisine"} 
                    options={Object.values(Cuisine)} 
                    color="black"
                />
                
                {/* Difficulty: Dropdown */}
                <VerticalCheckBoxes 
                    title={"Difficulty"} 
                    options={Object.values(Difficulty)} 
                    color="black"
                />

                {/* Meal Type: Checkbox */}
                <VerticalCheckBoxes 
                    title={"Meal Type"} 
                    options={mealType} 
                    color="black"
                />

            </Flex>

          </Flex>
          

          {/* Title, description, ingredients */}
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

            <Field label='Ingredients' required w='50rem' maxW='80%'>
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
          
        </Flex>
       

        <ButtonGroup>
          <CancelCreateRecipeButton />
          <DraftButton
            title={title}
            description={description}
            ingredients={ingredients}
            instructions={instructions}
          />
          <PublishRecipeButton
            title={title}
            description={description}
            ingredients={ingredients}
            instructions={instructions}
            draft_id={draft?.id}
          />
        </ButtonGroup>
      </Flex>
    </Flex>
  );
}
