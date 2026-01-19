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
  Flex,
  Stack,
} from "@chakra-ui/react";
import { MealCard } from "../../components/Card/MealCard";
import { MealListItem } from "../../components/Card/MealListItem";
import { useEffect, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { FaList, FaTh } from "react-icons/fa";

export const MainPage = ({
  meals,
  isLoading,
  error,
  category,
  title,
  isFavourites,
  setCookingMode,
}) => {
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");

  const pageSize = useBreakpointValue({
    base: 10,
    lg: 12,
  });
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const currentMeals = meals.slice(start, end);

  useEffect(() => {
    setCookingMode(false);
  }, []);

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
          <Box w="100%" maxW="1200px">
            
            <Flex
              p="13px"
              justify="space-between"
              align="center"
              mb="2"
            >
              <Box textStyle="2xl" fontWeight="bold">
                {isFavourites
                  ? "Favourite recipes"
                  : title.length > 0
                  ? `${title} meals`
                  : "Random meals"}
              </Box>
              
              <IconButton
                aria-label="Toggle view"
                variant="ghost"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              >
                {viewMode === "grid" ? <FaList /> : <FaTh />}
              </IconButton>
            </Flex>

            {meals.length > 0 ? (
              <>
                {viewMode === "grid" ? (
                  <SimpleGrid px="10px" columns={[2, 3]} spacing={4}>
                    {currentMeals.map((meal, index) => (
                      <MealCard
                        key={index}
                        idMeal={meal.idMeal}
                        image={meal.strMealThumb}
                        mealName={meal.strMeal}
                        description={
                          category.length > 0
                            ? meal.strCategory
                            : meal.strCategory || category || "No description"
                        }
                        category={category}
                      />
                    ))}
                  </SimpleGrid>
                ) : (
                  <Stack px="10px" spacing={4}>
                    {currentMeals.map((meal, index) => (
                      <MealListItem
                        key={index}
                        idMeal={meal.idMeal}
                        image={meal.strMealThumb}
                        mealName={meal.strMeal}
                        description={
                          category.length > 0
                            ? meal.strCategory
                            : meal.strCategory || category || "No description"
                        }
                        category={category}
                      />
                    ))}
                  </Stack>
                )}

                {/* Pagination */}
                {meals.length > 10 ? (
                  <Center my="3">
                    <Pagination.Root
                      count={meals.length}
                      pageSize={pageSize}
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