import {
  Box,
  Card,
  IconButton,
  Image,
  Skeleton
} from "@chakra-ui/react";
import { useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import {
  removeRecipeFromLocalStorage,
  setRecipeToLocalStorage,
} from "../../../data/localDataFunctions";

export const MealCard = ({ image, description, mealName, idMeal, category }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isFavourite, setIsFavourite] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

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
        <Skeleton loading={!isImageLoaded} >
        <Image src={image} alt="Meal image" display={isImageLoaded ? "block" : "none"}
          onLoad={() => setIsImageLoaded(true)}
          onError={() => setIsImageLoaded(true)} />
          </Skeleton>
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
          <Card.Description>{description === undefined ? category : description}</Card.Description>

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
