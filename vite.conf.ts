import { HmrContext, Plugin } from 'vite'
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

export default {
  root: 'src',
  build: {
    outDir: '../dist'
  },
  plugins: [
    reloadOnChange('njk'),
    nunjucks()
  ]
}
