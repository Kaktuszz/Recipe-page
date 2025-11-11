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
  Link,
  SimpleGrid,
  Separator,
} from "@chakra-ui/react";
import { receiptById } from "../../../data/recipesFetcher";
import { FaRegStar, FaStar } from "react-icons/fa";
import {
  setRecipeToLocalStorage,
  removeRecipeFromLocalStorage,
} from "../../../data/localDataFunctions.js";
import { useNavigate, useLocation } from "react-router-dom";

export const MealPage = ({ setFavouritesUpdate, favouritesUpdate }) => {
  const { idMeal } = useParams();
  const [meal, setMeal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavourite, setIsFavourite] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const breadcrumbsForConverter = location.state?.breadcrumbs ?? [
    {
      name: location.state?.fromLabel ?? "Main Page",
      path: location.state?.fromPath ?? "/",
    },
    { name: location.state?.mealName ?? "Meal", path: location.pathname },
  ];

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

  const measurements = Object.keys(meal)
    .filter((key) => key.startsWith("strMeasure") && meal[key])
    .map((key) => meal[key]);

  const toggleFavourite = () => {
    if (isFavourite) {
      removeRecipeFromLocalStorage(idMeal);
      setIsFavourite(false);
      setFavouritesUpdate(!favouritesUpdate);
    } else {
      setRecipeToLocalStorage(
        idMeal,
        meal.strMealThumb,
        meal.strMeal,
        meal.strCategory
      );
      setIsFavourite(true);
    }
  };

  return (
    <Box w="100%">
      <Center w="100%" px="20px">
        <Box w="100%" maxW="1202px">
          <SimpleGrid p="13px" columns={[1, 2]} spacing="20px">
            <Image src={meal.strMealThumb} rounded="md" />

            <Box mx={[0, "10px"]}>
              <Text
                textStyle="4xl"
                display="flex"
                alignItems="center"
                gap="10px"
              >
                {meal.strMeal}
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

              <Text textStyle="md" mb="10px">
                {meal.strCategory}
              </Text>

              <Checkbox.Group
                p="15px"
                sx={{ columnCount: [1, 1, , 1, 2], columnGap: "2rem" }}
              >
                {ingredients.map((ing, index) => (
                  <Checkbox.Root key={index} my="1">
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                    <Checkbox.Label>
                      {ing}{" "}
                      {measurements[index] ? `- ${measurements[index]}` : ""}
                    </Checkbox.Label>
                  </Checkbox.Root>
                ))}
              </Checkbox.Group>

              <Text textStyle="sm">
                Try our units converter!{" "}
                <span role="img" aria-label="Emoji finger points to link">
                  👉
                </span>{" "}
                <Link
                  onClick={() =>
                    navigate("/converter", {
                      state: {
                        breadcrumbs: breadcrumbsForConverter,
                        fromLabel: location.state?.fromLabel ?? "Main Page",
                        fromPath: location.state?.fromPath ?? "/",
                        mealName: meal.strMeal,
                        mealPath: location.pathname,
                      },
                    })
                  }
                  variant="underline"
                >
                  Click
                </Link>
              </Text>
            </Box>

            <Box pt="10px">
              <Separator />
              <Text textStyle="xl">Instructions</Text>
              <Text textStyle="lg" py="15px">
                {meal.strInstructions}
              </Text>
            </Box>
          </SimpleGrid>
        </Box>
      </Center>
    </Box>
  );
};
