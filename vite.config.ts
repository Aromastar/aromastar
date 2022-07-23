import nunjucks from 'vite-plugin-nunjucks'
import { HmrContext, Plugin } from 'vite'

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
  plugins: [
    reloadOnChange('njk'),
    nunjucks()
  ]
}
