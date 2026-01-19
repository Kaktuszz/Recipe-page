import {
  Box,
  Card,
  IconButton,
  Image,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import {
  removeRecipeFromLocalStorage,
  setRecipeToLocalStorage,
} from "../../../data/localDataFunctions";

export const MealListItem = ({ image, description, mealName, idMeal, category }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isFavourite, setIsFavourite] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const toggleFavourite = (e) => {
    e.stopPropagation();
    if (isFavourite) {
      removeRecipeFromLocalStorage(idMeal);
      setIsFavourite(false);
    } else {
      setRecipeToLocalStorage(idMeal, image, mealName, description);
      setIsFavourite(true);
    }
  };

  const handleNavigate = () => {
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
    });
  };

  return (
    <Card.Root
      flexDirection="row"
      overflow="hidden"
      mb="4"
      variant="outline"
      width="100%"
      cursor="pointer"
      onClick={handleNavigate}
      _hover={{ shadow: "md" }}
    >
      <Box width="150px" height="auto">
        <Skeleton loading={!isImageLoaded} height="100%">
          <Image
            objectFit="cover"
            maxW="100%"
            h="100%"
            src={image}
            alt="Meal image"
            display={isImageLoaded ? "block" : "none"}
            onLoad={() => setIsImageLoaded(true)}
            onError={() => setIsImageLoaded(true)}
          />
        </Skeleton>
      </Box>

      <Card.Body p="4" flexDirection="column" display="flex" width="100%">
        <Stack direction="row" justify="space-between" align="start" w="100%">
          <Box>
            <Card.Title mb="2" fontSize="xl">
              {mealName}
            </Card.Title>
            <Card.Description noOfLines={2}>
              {description === undefined ? category : description}
            </Card.Description>
          </Box>

          {location.pathname === "/favourites" && (
            <IconButton
              aria-label="Add to favourites"
              size="md"
              rounded="full"
              variant="outline"
              onClick={toggleFavourite}
              ml="4"
            >
              {isFavourite ? (
                <FaStar style={{ color: "gold" }} />
              ) : (
                <FaRegStar style={{ color: "gold" }} />
              )}
            </IconButton>
          )}
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};
