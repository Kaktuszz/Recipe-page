export const receiptByName = async (name) => {
  let apiLink = "https://www.themealdb.com/api/json/v1/1/search.php?s=" + name;
  try {
    const response = await fetch(apiLink);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return json.meals;
  } catch (error) {
    console.error(error.message);
  }
};

export const receiptById = async (id) => {
  let apiLink = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id;

  try {
    const response = await fetch(apiLink);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return json.meals;
  } catch (error) {
    console.error(error.message);
  }
};

export const randomMeal = async () => {
  let apiLink = "https://www.themealdb.com/api/json/v1/1/random.php";

  try {
    const response = await fetch(apiLink);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return json.meals;
  } catch (error) {
    console.error(error.message);
  }
};

export const randomTenMeals = async () => {
  try {
    const mealPromises = Array.from({ length: 12 }, () => randomMeal());
    const results = await Promise.all(mealPromises);
    return results.flat();
  } catch (error) {
    console.error(error.message);
    return [];
  }
};

export const mealCategories = async () => {
  let apiLink = "https://www.themealdb.com/api/json/v1/1/categories.php";

  try {
    const response = await fetch(apiLink);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return json.categories;
  } catch (error) {
    console.error(error.message);
  }
};

export const mealsByCategory = async (category) => {
  let apiLink =
    "https://www.themealdb.com/api/json/v1/1/filter.php?c=" + category;

  try {
    const response = await fetch(apiLink);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return json.meals;
  } catch (error) {
    console.error(error.message);
  }
};

export const mealAreas = async () => {
  let apiLink = "https://www.themealdb.com/api/json/v1/1/list.php?a=list";

  try {
    const response = await fetch(apiLink);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    return json.meals;
  } catch (error) {
    console.error(error.message);
  }
};

export const mealsByArea = async (area) => {
  let apiLink = "https://www.themealdb.com/api/json/v1/1/filter.php?a=" + area;

  try {
    const response = await fetch(apiLink);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    return json.meals;
  } catch (error) {
    console.error(error.message);
  }
};

export const mealsByAreaAndCategory = async (area, category) => {
  try {
    const [mealsFromArea, mealsFromCategory] = await Promise.all([
      mealsByArea(area),
      mealsByCategory(category),
    ]);

    if (!mealsFromArea || !mealsFromCategory) {
      return [];
    }

    const areaMealIds = new Set(mealsFromArea.map((meal) => meal.idMeal));

    const filteredMeals = mealsFromCategory.filter((meal) =>
      areaMealIds.has(meal.idMeal)
    );

    return filteredMeals;
  } catch (error) {
    console.error("Error filtering by area and category:", error);
    return [];
  }
};

export const mealIngredients = async () => {
  let apiLink =
    "https://https://www.themealdb.com/api/json/v1/1/list.php?i=list";

  try {
    const response = await fetch(apiLink);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    return json.meals;
  } catch (error) {
    console.error(error.message);
  }
};
