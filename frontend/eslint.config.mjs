import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "plugin:testing-library/react",
  "plugin:jest-dom/recommended"),

  // Ignore components/ui folder
  {
    ignores: ["src/components/ui/**/*"]
  }
];

export default eslintConfig;
