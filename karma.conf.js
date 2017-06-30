/* eslint-disable import/no-extraneous-dependencies */
const rollupPluginBuble = require('rollup-plugin-buble')();

module.exports = (config) => {
    config.set({
        frameworks: ['mocha', 'chai'],
        files: [
            // library
            './index.js',
            // tests
            './test/**/*.js',
            // fixtures
            'test/**/*.html',
        ],
        reporters: ['progress', 'coverage'],
        preprocessors: {
            '**/*.html': ['html2js'],
            './index.js': ['rollup', 'coverage'],
        },
        rollupPreprocessor: {
            plugins: [rollupPluginBuble],
            format: 'iife',
            moduleName: 'Rover',
            sourceMap: 'inline',
        },
        coverageReporter: {
            type: 'html',
            dir: 'coverage/',
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['Chrome'],
        autoWatch: true,
        singleRun: false,
        concurrency: Infinity,
    });
};
