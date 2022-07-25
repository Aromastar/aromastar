import { resolve } from 'path'
import { defineConfig, HmrContext, Plugin } from 'vite'
import nunjucks from 'vite-plugin-nunjucks'

/** Plugin to reload the page when changing files */
const reloadOnChange = (ext: string): Plugin => {
  return {
    name: 'reload-on-change',
    handleHotUpdate({ file, server }: HmrContext): void {
      file.endsWith(ext) && server.ws.send({ type: 'full-reload' })
    }
  }
}

const root = resolve(__dirname, 'src')
const outDir = resolve(__dirname, 'dist')

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
    reloadOnChange('njk'),
    // @ts-ignore: Unreachable code error
    nunjucks()
  ]
})
