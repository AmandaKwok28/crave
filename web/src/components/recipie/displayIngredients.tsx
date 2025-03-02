import { List } from "@chakra-ui/react";

const DisplayIngredients = ({ ingredient_list }: { 
    ingredient_list: string[]; 
}) => {
    const ingredients = [];
    for (let i = 0; i < ingredient_list.length; i++) {
        ingredients.push(<List.Item key={i}> {i+1}. {ingredient_list[i]} </List.Item>);
      }

    return <List.Root> {ingredients} </List.Root>;
};

export default DisplayIngredients;