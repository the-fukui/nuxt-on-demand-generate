import fs from 'fs-extra'
import path from 'path'

let isRebuild = false
const incremental_paths = process.env.INCOMING_HOOK_BODY ? process.env.INCOMING_HOOK_BODY.split(',') : [] //settings for netlify. ...should be more abstractive

export default function({ incremental = false } = {}) {

  if(process.env.NODE_ENV !== 'production') return

  if (!this.options.generate.incremental && !incremental) return

  if (incremental_paths.length === 0) return console.log('[info] No incremental paths. Disabled incremental build.')

  this.nuxt.hook('build:compiled', () => {
    console.log('[info] This is rebuild or initial build. Disabled incremental build.')
    isRebuild = true
  })

  this.nuxt.hook('generate:distCopied', (generator) => {

    //when it has to rebuild, merge designated incremental paths and original routes, then rebuild all.
    generator.options.generate.routes = generator.options.generate.routes.concat(incremental_paths)

    if (!isRebuild) {

      console.log('[info] Enabled incremental build.')

      const dist_path = generator.options.generate.dir
      const cache_path = path.join(process.cwd(), 'node_modules/.cache', 'nuxt-incremental')

      //exit if cache folder not exists
      try {
        fs.statSync(cache_path)
        fs.statSync(path.join(cache_path, 'pages'))
        fs.statSync(path.join(cache_path, 'static'))
      } catch (err) {
        console.log('[info] No cache files found')
        return
      }

      //copy pages from cache
      fs.copySync(path.join(cache_path, 'pages'), dist_path)

      //copy static folder from cache
      fs.copySync(path.join(cache_path, 'static'), path.join(generator.distNuxtPath, 'static'))

      //set routes for increment
      generator.options.generate.crawler = false
      generator.options.generate.routes = incremental_paths
    }
  })

  this.nuxt.hook('generate:done', (generator) => {
    const dist_path = generator.options.generate.dir
    const cache_path = path.join(process.cwd(), 'node_modules/.cache', 'nuxt-incremental')

    //clear cache
    fs.emptyDirSync(cache_path);

    fs.readdirSync(dist_path).forEach(file => {
      //list of folders/files in dist folder
      const file_path = path.join(dist_path, file)

      //pick only folders
      if (fs.lstatSync(file_path).isDirectory()) {

        if (file_path + '/' === generator.distNuxtPath) {
          //when it's _nuxt folder, cache static folder
          fs.copySync(path.join(file_path, 'static'), path.join(cache_path, 'static'))

        } else {
          //when it's page folder cache all
          fs.copySync(file_path, path.join(cache_path, 'pages', file))
        }
      }
    })

  })
}
