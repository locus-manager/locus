const CopyPlugin = require('copy-webpack-plugin');
const GeneratePackageJsonPlugin = require('generate-package-json-webpack-plugin');
const path = require('path');
const packageJson = require('./package.json');
const swaggerPlugin = require('@nestjs/swagger/plugin')
const webpack = require('webpack')

/**
 * Extend the default Webpack configuration from nx / ng.
 */
module.exports = (config, context) => {
  // Extract output path from context
  const {
    options: { outputPath },
  } = context;

  installNestSwaggerPlugin(config);

  // Install additional plugins
  config.plugins = config.plugins || [];
  config.plugins.push(...extractRelevantNodeModules(outputPath));
  config.plugins.push(new webpack.ProvidePlugin({
    'openapi': '@nestjs/swagger',
  }));

  return config;
};

/**
 * Add NestJS Swagger plugin.
 *  - NestJS Swagger: https://docs.nestjs.com/recipes/swagger#plugin
 *  - ts-loader: https://github.com/Igorbek/typescript-plugin-styled-components#ts-loader
 *  - getCustomTransformers: https://github.com/TypeStrong/ts-loader#getcustomtransformers
 *  - Someone else has done this: https://github.com/nrwl/nx/issues/2147
 */
const installNestSwaggerPlugin = config => {
  const rule = config.module.rules.find(rule => rule.loader === 'ts-loader');
  if (!rule) {
    throw new Error('Could not install NestJS Swagger plugin: no ts-loader rule found!');
  }
  const decorated = rule.options && rule.options.getCustomTransformers;
  const decorator = program => {
    const customTransformers = (decorated && decorated(...args)) || {};
    const before = customTransformers.before || [];
    before.push(swaggerPlugin.before({
      classValidatorShim: true,
    }, program));
    customTransformers.before = before;
    return customTransformers;
  };
  rule.options = rule.options || {};
  rule.options.getCustomTransformers = decorator;
};

/**
 * This repository only contains one single package.json file that lists the dependencies
 * of all its frontend and backend applications. When a frontend application is built,
 * its external dependencies (aka Node modules) are bundled in the resulting artifact.
 * However, it is not the case for a backend application (for various valid reasons).
 * Installing all the production dependencies would dramatically increase the size of the
 * artifact. Instead, we need to extract the dependencies which are actually used by the
 * backend application. We have implemented this behavior by complementing the default
 * Webpack configuration with additional plugins.
 *
 * @param {String} outputPath The path to the bundle being built
 * @returns {Array} An array of Webpack plugins
 */
function extractRelevantNodeModules(outputPath) {
  return [copyPackageLockFile(outputPath), generatePackageJson()];
}

/**
 * Copy the NPM package lock file to the bundle to make sure that the right dependencies are
 * installed when running `npm install`.
 *
 * @param {String} outputPath The path to the bundle being built
 * @returns {*} A Webpack plugin
 */
function copyPackageLockFile(outputPath) {
  return new CopyPlugin({
    patterns: [
      {
        from: './package-lock.json',
        to: path.join(outputPath, 'package-lock.json'),
      },
    ],
  });
}

function getCustomTransformers(program) {
  return {
    before: [require('@nestjs/swagger/plugin').before({}, program)]
  }
}


/**
 * Generate a package.json file that contains only the dependencies which are actually
 * used in the code.
 *
 * @returns {*} A Webpack plugin
 */
function generatePackageJson() {
  const implicitDeps = [
    'class-transformer',
    'class-validator',
    '@nestjs/platform-express',
    'reflect-metadata',
    'rxjs',
    'tslib',
    'swagger-ui-express',
  ];
  const dependencies = implicitDeps.reduce((acc, dep) => {
    acc[dep] = packageJson.dependencies[dep];
    return acc;
  }, {});
  const basePackageJson = {
    dependencies,
  };
  const pathToPackageJson = path.join(__dirname, 'package.json');
  return new GeneratePackageJsonPlugin(basePackageJson, pathToPackageJson);
}

const user = {
  user: '8da39afd-6510-4041-8fea-b009856737a0',
  password: 'b8f5631a-7ab9-48d2-b95d-39333442a3f6'
}
