import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:8000/graphql/',
  documents: 'src/**/*.{ts,tsx}',
  generates: {
    'src/generated/': {
      preset: 'client',
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo'
      ],
      config: {
        withHooks: true,
        withComponent: false,
        withHOC: false,
      }
    }
  }
};

export default config;

