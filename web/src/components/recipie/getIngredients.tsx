import { $currIngredientsList } from "@/lib/store";
import { Input, Stack } from "@chakra-ui/react";
import { useStore } from "@nanostores/react";

interface GetIngredientsProps {
    numIngredients: number;
}

const GetIngredients: React.FC<GetIngredientsProps> = ({ numIngredients }) => {
    const ingredientsList = useStore($currIngredientsList);
        
     const handleIngredientsListChange = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
        ingredientsList[i] = e.target.value;
    };

    const ingredients = [];
    for (let i = 0; i < numIngredients; i++) {
        const placeholdertext = `please enter ingredient number ${i+1} here`
        ingredients.push(<Input key={i} variant="subtle" type="text" name="ingredient" placeholder={placeholdertext} onChange={(e) => handleIngredientsListChange(e, i)}/>);
      }

    return <Stack>{ingredients}</Stack>;
};

export default GetIngredients;