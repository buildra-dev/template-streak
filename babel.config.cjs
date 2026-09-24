module.exports = function configure(api) {
  api.cache(true)
  // SDK 57's preset enables the Worklets transform when its dependency is installed.
  // Uniwind's stylesheet transform is configured in metro.config.cjs.
  return { presets: ['babel-preset-expo'] }
}
