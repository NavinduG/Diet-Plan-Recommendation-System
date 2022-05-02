module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 10,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: ["eslint:recommended", "google"],
  rules: {
    "linebreak-style": 0,
    "global-require": 0,
    "require-jsdoc": 0,
    "eslint linebreak-style": [0, "error", "windows"],
    "quotes": ["error", "double"],
    "indent": "off",
    "react/jsx-indent": "off",
    "react/jsx-indent-props": "off",
    "max-len": ["error", {"code": 350}],
    "camelcase": ["error", {"allow": ["goal_weight", "diet_data", "daily_calorie_intake", "protein_snack", "taste_enhancer", "activity_level", "daily_calorie_burn_by_workout", "daily_calorie_intake_by_protein", "daily_calorie_intake_by_fat", "daily_calorie_intake_by_carb", "daily_calorie_burn_by_cardio"]}],
    "prefer-const": "off",
  },
};
