import { useEffect, useState } from "react";
import { Box, NativeSelect, NumberInput } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import { convert } from "../../../data/converter";

export const ConverterPage = () => {
  const [ingredient, setIngredient] = useState("water");
  const [unitFrom, setUnitFrom] = useState("g");
  const [unitTo, setUnitTo] = useState("ml");
  const [unitFromValue, setUnitFromValue] = useState(1);
  const [unitToValue, setUnitToValue] = useState("");

  const [lastChanged, setLastChanged] = useState("from");

  const ingredientHandler = (e) => setIngredient(e.target.value);
  const unitFromHandler = (e) => setUnitFrom(e.target.value);
  const unitToHandler = (e) => setUnitTo(e.target.value);

  const unitFromValueHandler = (value) => {
    setUnitFromValue(value);
    setLastChanged("from");
  };

  const unitToValueHandler = (value) => {
    setUnitToValue(value);
    setLastChanged("to");
  };

  useEffect(() => {
    if (lastChanged === "from") {
      try {
        const result = convert(
          parseFloat(unitFromValue),
          unitFrom,
          unitTo,
          ingredient
        );
        setUnitToValue(Number(result.toFixed(4)));
      } catch (err) {
        console.error(err);
      }
    }
  }, [unitFromValue, unitFrom, unitTo, ingredient, lastChanged]);

  useEffect(() => {
    if (lastChanged === "to") {
      try {
        const result = convert(
          parseFloat(unitToValue),
          unitTo,
          unitFrom,
          ingredient
        );
        setUnitFromValue(Number(result.toFixed(4)));
      } catch (err) {
        console.error(err);
      }
    }
  }, [unitToValue, unitFrom, unitTo, ingredient, lastChanged]);

  return (
    <Box p="13px" display="flex" flexDirection="column" gap="12px">
      <Heading size="2xl">Convert ingredient measurments</Heading>
      <NativeSelect.Root>
        <NativeSelect.Field value={ingredient} onChange={ingredientHandler}>
          <option value="water">Water</option>
          <option value="milk">Milk</option>
          <option value="sugar">Sugar</option>
          <option value="flour">Flour</option>
          <option value="butter">Butter</option>
          <option value="oil">Oil</option>
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
      <Box display="flex" gap="8px" alignItems="center">
        <NumberInput.Root
          value={unitFromValue}
          min="0"
          onValueChange={(val) => unitFromValueHandler(val.value)}
        >
          <NumberInput.Control />
          <NumberInput.Input />
        </NumberInput.Root>
        <NativeSelect.Root>
          <NativeSelect.Field value={unitFrom} onChange={unitFromHandler}>
            <option value="g">Gram</option>
            <option value="kg">Kilogram</option>
            <option value="oz">Ounce</option>
            <option value="lb">Pound</option>
            <option value="ml">Milliliter</option>
            <option value="l">Liter</option>
            <option value="tsp">Teaspoon</option>
            <option value="tbsp">Tablespoon</option>
            <option value="cup">Cup</option>
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </Box>
      <Box display="flex" gap="8px" alignItems="center">
        <NumberInput.Root
          value={unitToValue}
          min="0"
          onValueChange={(val) => unitToValueHandler(val.value)}
        >
          <NumberInput.Control />
          <NumberInput.Input />
        </NumberInput.Root>
        <NativeSelect.Root>
          <NativeSelect.Field value={unitTo} onChange={unitToHandler}>
            <option value="ml">Milliliter</option>
            <option value="l">Liter</option>
            <option value="tsp">Teaspoon</option>
            <option value="tbsp">Tablespoon</option>
            <option value="cup">Cup</option>
            <option value="g">Gram</option>
            <option value="kg">Kilogram</option>
            <option value="oz">Ounce</option>
            <option value="lb">Pound</option>
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </Box>
      <Box mt="20px" fontSize="sm" color="gray.600" >
        <strong>Cooking Unit Converter</strong> helps you convert between common
        <em> weight </em> and <em> volume </em> measurements for ingredients
        like water, milk, sugar, flour, butter, and oil. It supports both metric
        and imperial units and adjusts results automatically using ingredient
        density.
        <br />
        <br />
        Supported units: g, kg, oz, lb, ml, l, tsp, tbsp, cup.
      </Box>
    </Box>
  );
};
