const path = require('node:path')
const { getDefaultConfig } = require('expo/metro-config')
const { withUniwindConfig } = require('uniwind/metro')

const projectRoot = path.resolve(__dirname)
const config = getDefaultConfig(projectRoot)
const separator = String.raw`[/\\]`
const rootPattern = projectRoot.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const belowRoot = `${rootPattern}${separator}`
const transientArtifacts = [
  new RegExp(`${belowRoot}.*\\.tmp$`),
  new RegExp(`${belowRoot}(?:.*${separator})?\\.[^/\\\\]+\\.sw[a-z]$`),
  new RegExp(`${belowRoot}.*~$`),
  new RegExp(`${belowRoot}(?:.*${separator})?(?:\\.tmp|tmp)(?:${separator}|$)`),
]

// Preserve Expo's exclusions and add only workspace-local transient artifacts
// that can disappear between Metro's directory scan and watcher registration.
const defaultBlockList = config.resolver.blockList
config.resolver.blockList = [
  ...Array.isArray(defaultBlockList)
    ? defaultBlockList
    : defaultBlockList === undefined ? [] : [defaultBlockList],
  ...transientArtifacts,
]

module.exports = withUniwindConfig(config, {
  cssEntryFile: './components/ui/global.css',
  dtsFile: './uniwind-types.d.ts',
})
