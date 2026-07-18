const w3cCssValidatorFixes = {
  postcssPlugin: "w3c-css-validator-fixes",
  AtRule(rule) {
    if (rule.name === "property") {
      rule.remove();
      return;
    }

    if (rule.name === "supports") {
      rule.params = rule.params.replace(" and (not (margin-trim:inline))", "");
    }
  },
  Declaration(declaration) {
    if (declaration.prop === "margin-trim" && declaration.value === "inline") {
      declaration.remove();
      return;
    }

    if (declaration.prop === "transition-property") {
      const validTransitionProperties = declaration.value
        .split(",")
        .map((property) => property.trim())
        .filter((property) => !property.startsWith("--tw-gradient-"));

      declaration.value = validTransitionProperties.join(",");
    }
  },
};

const config = {
  plugins: ["@tailwindcss/postcss", w3cCssValidatorFixes],
};

export default config;
