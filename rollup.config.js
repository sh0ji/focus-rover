import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import uglify from 'rollup-plugin-uglify';

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
        eslint(),
        babel({
            exclude: 'node_modules/**',
            presets: 'es2015-rollup',
        }),
    ];
    if (min) plugins.push(uglify());

    return {
        entry: 'index.js',
        dest: `dist/focus-rover${suffix}.js`,
        format,
        moduleName: 'Rover',
        plugins,
    };
};

export default [
    config('es'),
    config('iife', true),
    config('cjs', true),
    config('umd', true),
];
