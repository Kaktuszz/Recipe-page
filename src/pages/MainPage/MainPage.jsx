import { useEffect, useState } from "react";
import { Box, Center, SimpleGrid, Spinner } from "@chakra-ui/react";
import { randomTenMeals } from "../../../data/recipesFetcher";
import { MealCard } from "../../components/Card/MealCard";

export const MainPage = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeals = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await randomTenMeals();
        setMeals(data);
      } catch (err) {
        setError("Failed to load meals");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeals();
  }, []);

  return (
    <>
      {isLoading ? (
        <Center py="10">
          <Spinner size="xl" />
        </Center>
      ) : error ? (
        <Center py="10">
          <Text color="red.500">{error}</Text>
        </Center>
      ) : (
        <Box>
          <Box p="13px" textStyle="2xl">Random meals</Box>
          <SimpleGrid px="10px" columns="2">
            {meals.map((meal, index) => (
              <MealCard
                key={index}
                idMeal={meal.idMeal}
                image={meal.strMealThumb}
                mealName={meal.strMeal}
                description={meal.strCategory || "No description"}
              />
            ))}
          </SimpleGrid>
        </Box>
      )}
    </>
  );
};
