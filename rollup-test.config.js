export default {
  input: './test/test-mocha.js',
  output: [
    {
        file: './test/build/mocha/test.js',
        format: 'cjs',
        name: 'firestoreRefTest',
        sourcemap: true
    }
  ],
  external: ['firebase']
};