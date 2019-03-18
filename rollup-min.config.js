import banner from 'rollup-plugin-banner';
import { uglify } from "rollup-plugin-uglify";

export default {
  input: './src/index.js',
  output: [
    {
        file: './build/firestore-ref.min.js',
        format: 'iife',
        name: 'firestoreRef'
    },
  ],
  plugins: [
    uglify(),
    banner('firestore-ref v<%= pkg.version %> by <%= pkg.author %>'),
  ],
  external: ['firebase']
};