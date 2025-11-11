import {
  Box,
  Card,
  IconButton,
  Image,
  useSafeLayoutEffect,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  removeRecipeFromLocalStorage,
  setRecipeToLocalStorage,
} from "../../../data/localDataFunctions";

export const MealCard = ({ image, description, mealName, idMeal }) => {
  const navigate = useNavigate();

  const [isFavourite, setIsFavourite] = useState(true);

  const toggleFavourite = () => {
    if (isFavourite) {
      removeRecipeFromLocalStorage(idMeal);
      setIsFavourite(false);
    } else {
      setRecipeToLocalStorage(idMeal, image, mealName, description);
      setIsFavourite(true);
    }
  };

  return (
    <Card.Root maxW="sm" size="sm" overflow="hidden" mb="10px" mx="5px">
      <Box
        flex="1"
        onClick={() =>
          navigate(`/meal/${idMeal}`, {
            state: {
              fromPath: location.pathname,
              fromLabel:
                location.pathname === "/favourites"
                  ? "Favourites"
                  : location.pathname === "/search"
                  ? "Search"
                  : "Main Page",
              mealName: mealName,
            },
          })
        }
      >
        <Image src={image} alt="Meal image" />
        <Card.Body gap="2">
          <Card.Title>{mealName}</Card.Title>
        </Card.Body>
      </Box>

      <Card.Footer gap="2" mt="auto">
        <Box
          justifyContent="space-between"
          alignItems="center"
          display="flex"
          w="100%"
        >
          <Card.Description>{description}</Card.Description>

          {location.pathname === "/favourites" && (
            <Card.Description>
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
            </Card.Description>
          )}
        </Box>
      </Card.Footer>
    </Card.Root>
  );
};
