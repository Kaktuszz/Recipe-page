const ingredientDensity = {
  water: 1.0,
  milk: 1.03,
  sugar: 0.83,
  flour: 1.25,
  butter: 1.07,
  oil: 0.92,
};

const weightUnits = {
  g: 1,
  kg: 1000,
  oz: 28.35,
  lb: 453.6,
};

const volumeUnits = {
  ml: 1,
  l: 1000,
  tsp: 5,
  tbsp: 15,
  cup: 240,
};

export const convert = (value, from, to, ingredient = "water") => {
  from = from.toLowerCase();
  to = to.toLowerCase();
  ingredient = ingredient.toLowerCase();

  const isFromWeight = from in weightUnits;
  const isToWeight = to in weightUnits;
  const isFromVolume = from in volumeUnits;
  const isToVolume = to in volumeUnits;

  let baseValue;
  if (isFromWeight) baseValue = value * weightUnits[from];
  else if (isFromVolume) baseValue = value * volumeUnits[from];
  else throw new Error(`Unknown unit: ${from}`);

  if (isFromWeight && isToVolume) {
    baseValue *= ingredientDensity[ingredient] || 1;
  } else if (isFromVolume && isToWeight) {
    baseValue /= ingredientDensity[ingredient] || 1;
  }

  if (isToWeight) return baseValue / weightUnits[to];
  if (isToVolume) return baseValue / volumeUnits[to];

  throw new Error(`Unknown target unit: ${to}`);
};
