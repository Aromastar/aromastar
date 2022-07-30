import fs from 'fs'
import fg from 'fast-glob'
import path from 'path'
import { resolve } from 'path'
import { defineConfig, HmrContext, Plugin, IndexHtmlTransformResult, UserConfig } from 'vite'
import nunjucks from 'vite-plugin-nunjucks'
import { minify, Options as MinifierOptions } from 'html-minifier-terser'

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

/** Plugin for copy static files */
const copyFiles = (filesToCopy: IFileToCopy[] = []): Plugin => {
  let config: Omit<UserConfig, "plugins" | "assetsInclude" | "optimizeDeps" | "worker">
  // const isFileExists =
  return {
    name: 'copy-files',
    apply: 'build',
    configResolved: (resolvedConfig: Readonly<Omit<UserConfig, "plugins" | "assetsInclude" | "optimizeDeps" | "worker">>): void => {
      config = resolvedConfig
    },
    closeBundle: () => {},
    writeBundle: async () => {
      for (const { from, to } of filesToCopy) {
        // Copy file by filename
        if (typeof from === 'string' && fs.existsSync(resolve(config.root, from))){
          await fs.promises.copyFile(resolve(config.root, from), resolve(config.build.outDir, to))
          continue
        }

        // Copy files by pattern
        const pathNames: string[] = await fg(typeof from === 'string' ? resolve(config.root, from) : from.map(f => resolve(config.root, f)))
        await fs.promises.mkdir(resolve(config.build.outDir, to))
        for (const pathName of pathNames) {
          console.log(pathName)
          await fs.promises.copyFile(resolve(config.root, pathName), resolve(config.build.outDir, to, path.basename(pathName)))
        }
      }
    }
  }
}

export default defineConfig({
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
  plugins: [
    reloadOnFileChange('njk'),
    // @ts-ignore: Unreachable code error
    nunjucks(),
    minifyHTML({
      collapseWhitespace: true
    })
  ]
})
