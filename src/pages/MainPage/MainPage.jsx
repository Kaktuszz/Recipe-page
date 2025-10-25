import { Box, Center, SimpleGrid, Spinner, Text, Tabs } from "@chakra-ui/react";
import { MealCard } from "../../components/Card/MealCard";

export const MainPage = ({
  meals,
  isLoading,
  error,
  category,
  title,
  isFavourites,
}) => {
  return (
    <>
      {isLoading ? (
        <Center py="10">
          <Spinner size="xl" />
        </Center>
      ) : error ? (
        <Center py="10">
          <Text fontSize="lg" color="gray.600">
            {error}
          </Text>
        </Center>
      ) : (
        <Box>
          {isFavourites ? (
            <Box p="13px" textStyle="2xl">
              Favourite recipes
            </Box>
          ) : (
            <Box p="13px" textStyle="2xl">
              {title.length > 0 ? `${title} meals` : "Random meals"}
            </Box>
          )}

          <SimpleGrid px="10px" columns="2">
            {meals.map((meal, index) => (
              <MealCard
                key={index}
                idMeal={meal.idMeal}
                image={meal.strMealThumb}
                mealName={meal.strMeal}
                description={
                  category.length > 0
                    ? category
                    : meal.strCategory || "No description"
                }
              />
            ))}
          </SimpleGrid>
        </Box>
      )}
    </>
  );
};
