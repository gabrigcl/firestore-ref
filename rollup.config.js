import banner from 'rollup-plugin-banner';

export default {
  input: './src/ref.js',
  output: [
    {
        file: './build/firestore-ref.umd.js',
        format: 'umd',
        name: 'firestoreRef'
    },
    {
        file: './build/firestore-ref.es.js',
        format: 'esm',
        name: 'firestoreRef'
    },
  ],
  plugins: [
    banner('firestore-ref v<%= pkg.version %> by <%= pkg.author %>'),
  ],
  external: ['firebase']
};