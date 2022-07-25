import { resolve } from 'path'
import { defineConfig, HmrContext, Plugin, IndexHtmlTransformResult } from 'vite'
import nunjucks from 'vite-plugin-nunjucks'
import { minify, Options as MinifierOptions } from 'html-minifier-terser'

const root = resolve(__dirname, 'src')
const outDir = resolve(__dirname, 'dist')

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
  transformIndexHtml: async (html: string): Promise<IndexHtmlTransformResult | void> =>
    await minify(html, options)
})

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
