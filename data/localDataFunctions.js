export const setRecipeToLocalStorage = (
  idMeal,
  strMealThumb,
  strMeal,
  strCategory,
) => {
  const jsonData = {
    idMeal,
    strMealThumb,
    strMeal,
    strCategory,
  };

  let items = JSON.parse(localStorage.getItem("meals")) || [];

  if (items.some((item) => item.idMeal === idMeal)) {
    console.warn("Meal already saved!");
    return;
  }

  items.push(jsonData);
  localStorage.setItem("meals", JSON.stringify(items));
};

export const removeRecipeFromLocalStorage = (idMeal) => {
  let items = JSON.parse(localStorage.getItem("meals")) || [];

  const exists = items.some((item) => item.idMeal === idMeal);
  if (!exists) {
    console.warn("Meal not found:", idMeal);
    return;
  }

  const updatedItems = items.filter((item) => item.idMeal !== idMeal);

  localStorage.setItem("meals", JSON.stringify(updatedItems));
};


export const getMealsFromLocalStorage = () => {
    try {
      return JSON.parse(localStorage.getItem("meals")) || [];
    } catch (e) {
      console.error("Failed to parse meals from localStorage", e);
      return [];
    }
  };