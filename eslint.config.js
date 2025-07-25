// 根目錄：eslint.config.js
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

// 用来兼容舊式 shareable config
const compat = new FlatCompat({
  baseDirectory: import.meta.url,
});

export default [
  // 先引入 JS 推荐規則
  ...compat.extends("eslint:recommended"),

  // 全域目通用设置
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
    },
    plugins: {
      import: require("eslint-plugin-import"),
    },
    rules: {
      indent: ["error", 2],
      quotes: ["error", "single", { avoidEscape: true }],
      semi: ["error", "always"],
      "comma-dangle": ["error", "always-multiline"],
      "import/order": ["error", { "newlines-between": "always" }],
    },
  },

  // Web 子項目
  {
    files: ["apps/web/**/*.{ts,tsx,js,jsx}"],
    ignores: ["dist"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: globals.browser,
      parser: "@typescript-eslint/parser",
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
    },
    rules: {
      // 可以在這里加入 web 特有的 override
    },
  },

  // Server 子项目或其它 packages，如有需要可新增更多
  {
    files: ["apps/server/**/*.{js,ts}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: globals.node,
      parser: "@typescript-eslint/parser",
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
    },
    env: { node: true },
    rules: {
      "no-console": "off",
    },
  },
];
