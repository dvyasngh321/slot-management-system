const validateCountersForSide = (counterSide, counterNos) => {
  const max = counterSide === "A" ? 13 : 21;

  for (const no of counterNos) {
    if (typeof no !== "number" || no < 1 || no > max) {
      throw new Error(
        `invalid counternos ${no} for side ${counterSide} (1...${max})`
      );
    }
  }
};

module.exports = { validateCountersForSide };
