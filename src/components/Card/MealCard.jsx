import { Card, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export const MealCard = ({ image, description, mealName, idMeal }) => {
  const navigate = useNavigate();
  return (
    <Card.Root
      maxW="sm"
      size="sm"
      overflow="hidden"
      mb="10px"
      mx="5px"
      onClick={() => navigate(`/meal/${idMeal}`)}
    >
      <Image src={image} alt="Green double couch with wooden legs" />
      <Card.Body gap="2">
        <Card.Title>{mealName}</Card.Title>
      </Card.Body>

      <Card.Footer gap="2">
        <Card.Description>{description}</Card.Description>
      </Card.Footer>
    </Card.Root>
  );
};
