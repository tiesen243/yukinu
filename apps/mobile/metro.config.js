const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')
const { withUniwindConfig } = require('uniwind/metro')
const path = require('node:path')

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  watchFolders: [
    path.resolve(__dirname, '../../node_modules'),
    path.resolve(__dirname, '../../packages'),
  ],
}

module.exports = withUniwindConfig(
  mergeConfig(getDefaultConfig(__dirname), config),
  {
    cssEntryFile: './src/globals.css',
    dtsFile: './src/uniwind-types.d.ts',
  },
)
