// oxlint-disable unicorn/prefer-module

const { exec: _exec } = require('node:child_process')
const fs = require('node:fs/promises')
const path = require('node:path')
const { promisify } = require('node:util')

const exec = promisify(_exec)

async function main() {
  const androidPath = path.join(process.cwd(), 'android')
  const iosPath = path.join(process.cwd(), 'ios')
  const opts = { recursive: true, force: true }

  await Promise.allSettled([
    exec('./gradlew clean', { cwd: androidPath }),
    fs.rm(path.join(androidPath, '.kotlin'), opts),
    fs.rm(path.join(androidPath, 'app/.cxx'), opts),
    fs.rm(path.join(androidPath, 'app/build'), opts),
  ])
  await Promise.allSettled([
    fs.rm(path.join(androidPath, '.gradle'), opts),
    fs.rm(path.join(androidPath, 'build'), opts),
  ])

  await Promise.allSettled([
    exec(
      'xcodebuild clean -project ios/Runner.xcodeproj -scheme Runner -configuration Debug',
      { cwd: iosPath },
    ),
    fs.rm(path.join(iosPath, 'Pods'), opts),
    fs.rm(path.join(iosPath, 'Runner.xcworkspace'), opts),
    fs.rm(path.join(iosPath, 'build'), opts),
  ])

  console.log('Cleaned Android and iOS build artifacts.')

  await Promise.allSettled([
    fs.rm(path.join(process.cwd(), '.cache'), opts),
    fs.rm(path.join(process.cwd(), 'node_modules'), opts),
  ])

  console.log('Cleaned project cache and node_modules.')
}

main()
