import { spawn } from 'node:child_process'
import { join } from 'node:path'

const port = process.env.PORT ?? '8081'
const host = process.env.HOST ?? '0.0.0.0'
const hostMode = host === '0.0.0.0' || host === '::' ? 'lan' : 'localhost'
const cli = join(process.cwd(), 'node_modules', 'expo', 'bin', 'cli')
// CI would turn Metro's file watcher off (Expo CLI's isWatchEnabled), and the runner's stdin is never a TTY so no prompt can appear.
const childEnv = {
  ...process.env,
  EXPO_NO_TELEMETRY: process.env.EXPO_NO_TELEMETRY ?? '1',
}
if (process.env.BUILDRA_PREVIEW_ORIGIN !== undefined) {
  childEnv.EXPO_PACKAGER_PROXY_URL = process.env.BUILDRA_PREVIEW_ORIGIN
}

// The host session verifies GET / with Accept: text/html serves the web index and
// GET / with expo-platform: ios serves manifest JSON whose launchAsset.url starts with EXPO_PACKAGER_PROXY_URL.
const child = spawn(process.execPath, [cli, 'start', '--port', port, '--host', hostMode], {
  env: childEnv,
  stdio: 'inherit',
})

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => child.kill(signal))
}
child.once('exit', (code, signal) => {
  if (signal !== null) process.kill(process.pid, signal)
  else process.exit(code ?? 1)
})
