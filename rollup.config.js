import buble from '@rollup/plugin-buble';
import { uglify } from 'rollup-plugin-uglify';

const config = (format, min) => {
    let suffix;
    switch (format) {
    case 'iife':
        suffix = '.min';
        break;
    case 'es':
        suffix = '';
        break;
    default:
        suffix = `.${format}`;
    }
    const plugins = [
        buble({
            objectAssign: 'Object.assign',
        }),
    ];
    if (min) plugins.push(uglify());

    return {
        input: 'index.js',
        output: {
            file: `dist/focus-rover${suffix}.js`,
            name: 'Rover',
            format,
        },
        plugins,
    };
};

export default [
    config('es'),
    config('iife', true),
    config('cjs', true),
    config('umd', true),
];
