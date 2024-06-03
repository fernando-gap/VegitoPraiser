// @ts-check

import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  {
    ignores: ["build", "src/database/migrations/*", "src/database/seeders/*"],
    rules: {
      '@typescript-eslint/no-explicit-any': "off",
      "@typescript-eslint/consistent-indexed-object-style": "off",
      "@typescript-eslint/no-namespace": "off",
      '@typescript-eslint/ban-ts-comment': ["warn", { 'ts-ignore': 'allow-with-description'}]
    }
  },
);