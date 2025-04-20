import { Field } from "@/components/ui/field";
import { useState } from "react";
import { Button, IconButton, Separator, VStack } from '@chakra-ui/react'
import { PartyType, Difficulty, Cuisine, Price } from "@/data/types";
import { ButtonGroup, Flex, Input, Text, RadioGroup } from "@chakra-ui/react";
import { InputGroup } from "@/components/ui/input-group";
import { Trash } from "lucide-react";
import CancelJoinPartyButton from "@/components/party/cancelJoinPartyButton";
import JoinPartyButton from "@/components/party/joinPartyButton";

const AddPartyPrefrencesForm = ({ party }: { 
  party: PartyType;
}) => {
  const [ alergens, setAlergens ] = useState<string>('');
  const [ ingredients, setIngredients ] = useState<string[]>(['']);
  const [ cookTime, setCookTime ] = useState<string>("");
  const [ selectedPrice, setSelectedPrice ] = useState<string>("$");
  const [ diff, setDiff ] = useState("1");
  const [ cuisine, setCuisine ] = useState("1");
  const [ currIndex, setCurrindex ] = useState<number>(0);
  const [ empty, setEmpty ] = useState<boolean>(false);

  const handleDiff = (option: string) => {
    setDiff(option);
  }

  const handleClearDiff = () => {
    setDiff("1");
  }

  const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // for the cuisine
  const handleCuisine = (option: string) => {
    setCuisine(option);
  }

  const handleClear = () => {
    setCuisine("1");
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

  return (
    <Flex gap='4' flexDir='column' minW='100vw' align='center' justify='center'>
        <Flex pos='fixed' zIndex="100" top='0' left='0' w='100vw' h='10' bg="cyan.700" align='center' justify='center'>
            <Text color='bg' fontWeight='bold' fontSize='2xl'>
                {party.name + " Collaborative Cooking Intake Form"}
            </Text>
        </Flex>

        <Flex my='24' gap='4' flexDir='column' px='4' align='center'>

            <Flex direction="column" gap="8">
                {/* Ingredients */}
                <Field label='What Ingredients can you contribute to the collaborative cooking session?' required></Field>
                <Flex gap='3' justify='flex-end' flexWrap='wrap' w='100%'>
                    {ingredients.map((ingredient, i) => (
                    <InputGroup key={i} w='100%' endElement={(
                        <IconButton variant='ghost' color='red.400' me='-1' size='xs' onClick={() => handleIngDelete(i)}>
                            <Trash />
                        </IconButton>
                        )}
                    >
                        <Input placeholder='Enter an ingredient...' value={ingredient} onChange={(e) => handleIngInput(i, e)}/>
                    </InputGroup>
                    ))}
                </Flex>
                    
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

                <Separator w='50rem' maxW='80%' size="sm" mt="2"/>

                {/* Allergens */}
                <Field label='Please list any alergens you would like to avoid for this session' required w='50rem' maxW='80%'>
                <Input
                    value={alergens}
                    onChange={(e) => setAlergens(e.target.value)}
                    placeholder='Enter alergens here...'
                />
                </Field>

                <Separator w='50rem' maxW='80%' size="sm" mt="2"/>

                {/* Cook Time */}
                <Field label='How Much time would you like to spend cooking during this group session?' required w='50rem' maxW='80%'></Field>
                <Field required w='20rem' >
                    <Input
                        placeholder="Enter time in minutes"
                        value={cookTime} // Bind input value to state
                        onChange={handleChange} // Track changes in input
                    />
                </Field>

                <Separator w='50rem' maxW='80%' size="sm" mt="2"/>

                {/* Price */}
                <Field label='What is your prefered recipe Price Bucket?' required w='50rem' maxW='80%' ></Field>
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

                <Separator w='50rem' maxW='80%' size="sm" mt="2"/>
                    
                {/* Cuisine */}
                <Flex flexDirection="column" gap={2}> 
                    <Field label='What is your prefered recipe Cuisine?' required w='50rem' maxW='80%' ></Field>    
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

                <Separator w='50rem' maxW='80%' size="sm" mt="2"/>

                {/* Difficulty */}
                <Flex flexDirection="column" gap={2}> 
                    <Field label='What is your preffered Recipe Difficulty?' required w='50rem' maxW='80%' ></Field>
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
        
            <Flex mt="16">
                <ButtonGroup>
                    <CancelJoinPartyButton />
                    <JoinPartyButton party={party} 
                    availableTime={Number(cookTime)} 
                    preferredCuisine={Cuisine[cuisine as keyof typeof Cuisine]} 
                    ingredients={ingredients} 
                    excludedAllergens={alergens} 
                    preferredDifficulty={Difficulty[diff as keyof typeof Difficulty]}
                    preferredPrice={Price[priceValue as keyof typeof Price]} />
                </ButtonGroup>
            </Flex>

        </Flex>
    </Flex>
  )
}

export default AddPartyPrefrencesForm;