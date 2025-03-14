import { List } from "@chakra-ui/react";

export default function DisplayIngredients({
  ingredients 
}: { 
  ingredients: string[]; 
}) {
  return (
    <List.Root>
      {ingredients.map((ingredient, index) => (
        <List.Item key={index}>
          {ingredient}
        </List.Item>
      ))}
    </List.Root>
  );
};
