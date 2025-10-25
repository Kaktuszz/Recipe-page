export const setRecipeToLocalStorage = (
  idMeal,
  imageMeal,
  nameMeal,
  categoryMeal,
  ingredients,
  instructions
) => {
  const jsonData = {
    idMeal,
    imageMeal,
    nameMeal,
    categoryMeal,
    ingredients,
    instructions,
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
