<<<<<<< HEAD
import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["node_modules/**", "dist/**", "coverage/**", "prisma/migrations/**"] },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node
      }
    },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }]
    }
  }
=======
/**
 * ESLint configuration (Flat Config).
 *
 * This config is intentionally strict but practical for a student template:
 * - React recommended rules
 * - Hooks rules
 * - React Refresh safety rules (prevents common HMR issues)
 */
import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  {
    ignores: ["dist/**"],
  },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      // React
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "error",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",

      // Hooks
      ...reactHooks.configs.recommended.rules,

      // React Refresh
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

      // General quality
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-unused-vars": ["off", { argsIgnorePattern: "^_" }]
    },
  },
  {
    files: ["tests/**/*.{js,jsx}"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.vitest
      }
    },
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
>>>>>>> 0fb4755c9471fc70812e6e87f4e4075c461f7ab8
];
