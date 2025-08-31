import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Image, List, Text, Spinner, Center } from "@chakra-ui/react";
import { receiptById } from "../../../data/recipesFetcher";

export const MealPage = () => {
  const { idMeal } = useParams();
  const [meal, setMeal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMeal = async () => {
      setIsLoading(true);
      try {
        const data = await receiptById(idMeal);
        if (data && data.length > 0) {
          setMeal(data[0]);
        } else {
          setMeal(null);
        }
      } catch (err) {
        console.error(err);
        setMeal(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeal();
  }, [idMeal]);

  if (isLoading)
    return (
      <Center py="10">
        <Spinner size="xl" />
      </Center>
    );

  if (!meal)
    return (
      <Center py="10">
        <Text>Meal not found</Text>
      </Center>
    );

  const ingredients = Object.keys(meal)
    .filter((key) => key.startsWith("strIngredient") && meal[key])
    .map((key) => meal[key]);

  return (
    <Box p="13px">
      <Image src={meal.strMealThumb} rounded="md" />
      <Text textStyle="4xl">{meal.strMeal}</Text>
      <Text textStyle="md">{meal.strCategory}</Text>
      <List.Root p="15px" sx={{ columnCount: [1, 2], columnGap: "2rem" }}>
        {ingredients.map((ing, index) => (
          <List.Item key={index}>{ing}</List.Item>
        ))}
      </List.Root>
      <Text textStyle="xl">Instructions</Text>
      <Text textStyle="lg" py="15px">
        {meal.strInstructions}
      </Text>
    </Box>
  );
};
