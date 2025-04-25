import { faker } from '@faker-js/faker';

faker.seed(41)


const num_base_recipies = 2;
const num_variations = 4;
const change_arr = [0, 0, 1, 1, 1, 2, 2, 4, 5, 8];
const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];
const priceTypes = ["CHEAP", "MODERATE", "PRICEY", "EXPENSIVE"];
const cuisineTypes = ["ITALIAN", "MEXICAN", "ChINESE", "INDIAN", "JAPANESE", "FRENCH", "MEDITERRANEAN"];
const difficultyTypes = ["EASY", "MEDIUM", "HARD"];
const sourcesTypes = ["Safeway", "CharMar", "Giant", "WholeFoods", "Costco", "SamsClub", "Streets Market"];

//generating a random ingredient list of length 3-15
function get_ingredient_list(seed: number): string[] {
  faker.seed(seed)
  const ingredients = [""]
  const num_ingredients = faker.number.bigInt({ min: 3, max: 15 })
  for (let i = 0; i < num_ingredients; i++) {
    ingredients[i] = faker.food.ingredient()
  }
  return ingredients
}

//add random nouns to list
function add_noun(num: number, ingredients_list: string[]): string[] {
  const new_list = ingredients_list
  for (let i = 0; i < num; i++) {
    new_list.push(faker.food.ingredient())
  }
  return new_list
}

//remove random nouns form list
function remove_noun(num: number, ingredients_list: string[]): string[] {
  var new_list = ingredients_list
  for (let i = 0; i < num; i++) {
    if (ingredients_list.length > 1) {
      const indexToRemove = Number(faker.number.bigInt({ min: 0, max: ingredients_list.length-1 }))
      new_list = new_list.filter((_, index) => index !== indexToRemove);
    }
  }
  return new_list
}

// generating semi-random data for the 10 'base' recipe templetes
var testRecipesTextData = [ {
  title: "test",
  description: "test",
  ingredients: [ "test" ],
  instructions: [ "test" ],
  mealTypes: [ "test" ],
  price: "test",
  cuisine: "test",
  allergens: [ "test" ],
  difficulty: "test",
  sources: [ "test" ],
  prepTime: "test"
}]

for (let i = 0; i < num_base_recipies; i++) {
  const mtIndex = Number(faker.number.bigInt({ min: 0, max: mealTypes.length-1 }));
  const ptIndex = Number(faker.number.bigInt({ min: 0, max: mealTypes.length-1 }));
  const ctIndex = Number(faker.number.bigInt({ min: 0, max: mealTypes.length-1 }));
  const dtIndex = Number(faker.number.bigInt({ min: 0, max: mealTypes.length-1 }));
  const stIndex = Number(faker.number.bigInt({ min: 0, max: mealTypes.length-1 }));
  const ingred = get_ingredient_list(i+27)
  const pTime = String(Number(faker.number.bigInt({ min: 10, max: 120 })));
  
  testRecipesTextData[i] = {
    title: faker.food.dish(),
    description: faker.food.description(),
    ingredients: ingred,
    instructions: [ faker.lorem.paragraph(20)],
    mealTypes: [mealTypes[mtIndex]],
    price: priceTypes[ptIndex],
    cuisine: cuisineTypes[ctIndex],
    allergens: [ingred[0]],
    difficulty: difficultyTypes[dtIndex],
    sources: [sourcesTypes[stIndex]],
    prepTime: pTime
  }
}

// generating increasingly dissimilar recipes for each of the 'base' recipe templetes

for (let base_index = 0; base_index < num_base_recipies; base_index++) {
  const testRecipesSimilarTextData = [ testRecipesTextData[base_index] ]

  for (let i = 1; i < num_variations+1; i++) {
    testRecipesSimilarTextData[i-1] = {
      title: testRecipesTextData[base_index].title + " " + String(i),
      description: testRecipesTextData[base_index].description + " " + faker.lorem.paragraph(i),
      ingredients: add_noun(change_arr[i], remove_noun(change_arr[i], testRecipesTextData[base_index].ingredients)),
      instructions: testRecipesTextData[base_index].instructions,
      mealTypes: testRecipesTextData[base_index].mealTypes,
      price: testRecipesTextData[base_index].price,
      cuisine: testRecipesTextData[base_index].cuisine,
      allergens: testRecipesTextData[base_index].allergens,
      difficulty: testRecipesTextData[base_index].difficulty,
      sources: testRecipesTextData[base_index].sources,
      prepTime: testRecipesTextData[base_index].prepTime
    }
  }

  testRecipesTextData = [...testRecipesTextData, ...testRecipesSimilarTextData]
  
}

export default testRecipesTextData;