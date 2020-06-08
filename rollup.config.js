import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export default {
    input: 'index.js',
    output: [
        {
            file: './dist/typeFactory.js',
            format: 'umd',
            name: 'typeFactory'
        },
        {
            file: './dist/typeFactory.min.js',
            format: 'umd',
            name: 'typeFactory',
            plugins: [terser()]
        }
    ],
    plugins: [commonjs()]
};
