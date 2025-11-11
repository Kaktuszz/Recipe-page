import {
  Box,
  Center,
  SimpleGrid,
  Spinner,
  Text,
  Pagination,
  ButtonGroup,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { MealCard } from "../../components/Card/MealCard";
import { useEffect, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

export const MainPage = ({
  meals,
  isLoading,
  error,
  category,
  title,
  isFavourites,
}) => {
  const [page, setPage] = useState(1);
  const pageSize = useBreakpointValue({
    base: 10,
    lg: 12,
  });
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const currentMeals = meals.slice(start, end);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

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
        <Center>
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
            {meals.length > 0 ? (
              <>
                <SimpleGrid px="10px" columns={[2, 3]}>
                  {currentMeals.map((meal, index) => (
                    <MealCard
                      key={index}
                      idMeal={meal.idMeal}
                      image={meal.strMealThumb}
                      mealName={meal.strMeal}
                      description={
                        category.length > 0
                          ? meal.strCategory
                          : meal.strCategory || "No description"
                      }
                    />
                  ))}
                </SimpleGrid>
                {meals.length > 10 ? (
                  <Center my="3">
                    <Pagination.Root
                      count={meals.length}
                      pageSize={10}
                      page={page}
                      onPageChange={(e) => setPage(e.page)}
                    >
                      <ButtonGroup variant="ghost" size="sm">
                        <Pagination.PrevTrigger asChild>
                          <IconButton>
                            <HiChevronLeft />
                          </IconButton>
                        </Pagination.PrevTrigger>

                        <Pagination.Items
                          render={(page) => (
                            <IconButton
                              variant={{ base: "ghost", _selected: "outline" }}
                            >
                              {page.value}
                            </IconButton>
                          )}
                        />

                        <Pagination.NextTrigger asChild>
                          <IconButton>
                            <HiChevronRight />
                          </IconButton>
                        </Pagination.NextTrigger>
                      </ButtonGroup>
                    </Pagination.Root>
                  </Center>
                ) : (
                  " "
                )}
              </>
            ) : (
              <Center py="10">
                <Text fontSize="lg" color="gray.600">
                  No meals found for your selection.
                </Text>
              </Center>
            )}
          </Box>
        </Center>
      )}
    </>
  );
};
