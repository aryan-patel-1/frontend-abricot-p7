const w3cCssValidatorFixes = {
  postcssPlugin: "w3c-css-validator-fixes",
  OnceExit(root) {
    // nettoie les règles propriétaires après l'optimisation de Tailwind
    root.walkRules((rule) => {
      if (
        rule.selector === ":-moz-focusring" ||
        rule.selector === "::-webkit-search-decoration"
      ) {
        rule.remove();
      }

      // garde le rendu des abréviations avec des propriétés standards
      if (rule.selector === "abbr:where([title])") {
        rule.walkDecls("text-decoration", (declaration) => {
          declaration.replaceWith(
            declaration.clone({
              prop: "text-decoration-line",
              value: "underline",
            }),
            declaration.clone({
              prop: "text-decoration-style",
              value: "dotted",
            })
          );
        });
      }

      // évite que Next.js ajoute un préfixe pour la valeur inherit
      if (rule.selector === "a") {
        rule.walkDecls("text-decoration", (declaration) => {
          declaration.prop = "text-decoration-line";
          declaration.value = "none";
        });
      }
    });

    root.walkAtRules("supports", (rule) => {
      if (
        rule.params.includes("-webkit-hyphens:none") &&
        rule.params.includes("-moz-orient:inline")
      ) {
        // rend les valeurs initiales de Tailwind disponibles dans Chromium
        rule.replaceWith(...(rule.nodes ?? []).map((node) => node.clone()));
        return;
      }

      if (rule.params.includes("-webkit-appearance")) {
        rule.params = "(contain-intrinsic-size:1px)";
      }
    });

    root.walkDecls("-webkit-text-decoration", (declaration) => {
      declaration.remove();
    });
  },
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
