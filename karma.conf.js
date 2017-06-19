module.exports = (config) => {
    config.set({
        frameworks: ['mocha', 'chai', 'fixture'],
        files: [
            'dist/focus-rover.min.js',
            'test/**/*.js',
            'test/**/*.html',
        ],
        reporters: ['progress'],
        // coverageReporter: {
        //     reporters: [
        //         // generates ./coverage/lcov.info
        //         { type: 'lcovonly', subdir: '.' },
        //         // generates ./coverage/coverage-final.json
        //         { type: 'json', subdir: '.' },
        //     ],
        // },
        preprocessors: {
            '**/*.html': ['html2js'],
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
