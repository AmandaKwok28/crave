
import CancelCreateRecipeButton from "@/components/recipie/cancelButton";
import DraftButton from "@/components/recipie/draftButton";
import PublishRecipeButton from "@/components/recipie/publishButton";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import useQueryRecipes from "@/hooks/use-query-recipes";
import { $router } from "@/lib/router";
import { Button, ButtonGroup, Flex, IconButton, Input, Text, Textarea } from "@chakra-ui/react";
import { redirectPage } from "@nanostores/router";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";

// If draft_id is set, this will be autopopulated on page load
// Also, "publishing" simply edits the draft and sets published = true
export default function RecipeForm({ draft_id }: { draft_id?: number }) {
  const { drafts } = useQueryRecipes();
  const draft = draft_id ? drafts.find((draft) => draft.id === draft_id) : null;
  
  const [ title, setTitle ] = useState<string>('');
  const [ description, setDescription ] = useState<string>('');
  const [ instructions, setInstructions ] = useState<string[]>(['']);
  const [ ingredients, setIngredients ] = useState<string[]>(['']);

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
    setIngredients(() => list);
  };

  return (
    <Flex gap='4' flexDir='column' minW='100vw' align='center' justify='center'>
      <Flex pos='fixed' zIndex="100" top='0' left='0' w='100vw' h='10' bgGradient="to-r" gradientFrom="cyan.300" gradientTo="blue.400" align='center' justify='center'>
        <Text color='bg' fontWeight='bold' fontSize='3xl'>
          {draft ? 'Edit an Existing Recipe' : 'Create a New Recipe'}
        </Text>
      </Flex>

      <Flex my='24' gap='4' flexDir='column' px='4' align='center'>
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
            
            <Button bgGradient="to-r" gradientFrom="cyan.300" gradientTo="blue.400" onClick={() => setIngredients((l) => [...l, ''])}>
              Add Ingredient
            </Button>
          </Flex>
        </Field>

        <Field label='Instructions' required w='50rem' maxW='80%'>
          <Textarea
            value={instructions[0]}
            onChange={(e) => setInstructions([ e.target.value ])}
            placeholder='Enter recipe instructions...'
            h='12lh'
          />
        </Field>

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
