import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box,
  Image,
  Text,
  Spinner,
  Center,
  Checkbox,
  IconButton,
} from "@chakra-ui/react";
import { receiptById } from "../../../data/recipesFetcher";
import { FaRegStar, FaStar } from "react-icons/fa";
import {
  setRecipeToLocalStorage,
  removeRecipeFromLocalStorage,
} from "../../../data/localDataFunctions.js";

export const MealPage = () => {
  const { idMeal } = useParams();
  const [meal, setMeal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavourite, setIsFavourite] = useState(false);

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

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("meals")) || [];
    const exists = items.some((item) => item.idMeal === idMeal);
    setIsFavourite(exists);
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

  const toggleFavourite = () => {
    if (isFavourite) {
      removeRecipeFromLocalStorage(idMeal);
      setIsFavourite(false);
    } else {
      setRecipeToLocalStorage(
        idMeal,
        meal.strMealThumb,
        meal.strMeal,
        meal.strCategory,
        ingredients,
        meal.strInstructions
      );
      setIsFavourite(true);
    }
  };

  return (
    <Box p="13px">
      <Image src={meal.strMealThumb} rounded="md" />
      <Text textStyle="4xl">
        {meal.strMeal}{" "}
        <IconButton
          aria-label="Add to favourites"
          size="lg"
          rounded="full"
          variant="outline"
          onClick={toggleFavourite}
        >
          {isFavourite ? (
            <FaStar style={{ color: "gold" }} />
          ) : (
            <FaRegStar style={{ color: "gold" }} />
          )}
        </IconButton>
      </Text>
      <Text textStyle="md">{meal.strCategory}</Text>

      <Checkbox.Group p="15px" sx={{ columnCount: [1, 2], columnGap: "2rem" }}>
        {ingredients.map((ing, index) => (
          <Checkbox.Root key={index} my="1">
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>{ing}</Checkbox.Label>
          </Checkbox.Root>
        ))}
      </Checkbox.Group>
      <Text textStyle="xl">Instructions</Text>
      <Text textStyle="lg" py="15px">
        {meal.strInstructions}
      </Text>
    </Box>
  );
};
