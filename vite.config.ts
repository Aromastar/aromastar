import { access, constants, promises } from 'node:fs'
import { basename, resolve } from 'node:path'
import { defineConfig, HmrContext, IndexHtmlTransformResult, LogType, Plugin, ResolvedConfig } from 'vite'
import { minify, Options as MinifierOptions } from 'html-minifier-terser'
import fg from 'fast-glob'
import nunjucks from 'vite-plugin-nunjucks'
import enData from './src/data/en.json'
import ruData from './src/data/ru.json'

const SRC_DIR = 'src'
const OUT_DIR = 'dist'

const root = resolve(__dirname, SRC_DIR)
const outDir = resolve(__dirname, OUT_DIR)

/** Plugin to reload the page when changing files */
const reloadOnFileChange = (ext: string): Plugin => ({
  name: 'reload-on-file-change',
  handleHotUpdate: ({ file, server }: HmrContext): void => {
    file.endsWith(ext) && server.ws.send({ type: 'full-reload' })
  }
})

/** Plugin for minimizing html files */
const minifyHTML = (options: MinifierOptions = {}): Plugin => ({
  name: 'minify-html',
  apply: 'build',
  transformIndexHtml: async (html: string): Promise<IndexHtmlTransformResult | void> =>
    await minify(html, options)
})

interface IFileToCopy {
  from: string | string[]
  to: string
}

// interface ICopyFileLog {
//   type: LogType
//   path: string
//   message: string
// }

/** Plugin for copy static files */
const copyFiles = (filesToCopy: IFileToCopy[] = []): Plugin => {
  let config: ResolvedConfig
  // const logs: ICopyFileLog[] = []

  const pathExists: (pathToCheck: string) => Promise<boolean> = (pathToCheck: string) => new Promise((resolve) =>
    access(pathToCheck, constants.F_OK, error => error ? resolve(false) : resolve(true)))

  const copyFile: (from: string, to: string) => Promise<void> = /** ToDo: fix async callback  */ async (from, to) => {
    if (await pathExists(to)) {
      // logs.push({ path: from, message: `File '${ basename(from) }' already exists`, type: 'warn' })
      return
    }

    return await promises.copyFile(from, to)
  }

  return {
    name: 'copy-files',
    apply: 'build',
    configResolved: resolvedConfig => {
      config = resolvedConfig
    },
    closeBundle: () => { /** ToDo: output logs */ },
    writeBundle: async () => {
      for (const { from, to } of filesToCopy) {
        // Copy file by filename
        if (typeof from === 'string' && await pathExists(resolve(config.root, from))) {
          await copyFile(resolve(config.root, from), resolve(config.build.outDir, to))
          continue
        }

        // Copy files by pattern
        const pathNames: string[] = await fg(typeof from === 'string' ? resolve(config.root, from) : from.map(f => resolve(config.root, f)))

        if (!await pathExists(resolve(config.build.outDir, to))) {
          await promises.mkdir(resolve(config.build.outDir, to))
        }

        for (const pathName of pathNames) {
          await copyFile(resolve(config.root, pathName), resolve(config.build.outDir, to, basename(pathName)))
        }
      }
    }
  }
}

export default defineConfig(({ mode }) => {
  const isDev: boolean = mode === 'development'

  return {
    root,
    build: {
      outDir,
      emptyOutDir: true,
      rollupOptions: {
        input: {
          ru: resolve(root, 'index.html'),
          en: resolve(root, 'en.html')
        }
      }
    },
    css: {
      preprocessorOptions: {
        sass: {
          additionalData: `$isDev: ${isDev}`
        }
      }
    },
    plugins: [
      reloadOnFileChange('njk'),
      // @ts-ignore: Unreachable code error
      nunjucks({
        variables: {
          '*': { isDev },
          'index.html': ruData,
          'en.html': enData
        }
      }) as Plugin,
      minifyHTML({
        collapseWhitespace: true
      }),
      copyFiles([
        {
          from: '../README.md',
          to: './README.md'
        }
      ])
    ]
  }
})
