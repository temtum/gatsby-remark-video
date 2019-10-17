const select = require(`unist-util-select`)
const path = require(`path`)
const isRelativeUrl = require(`is-relative-url`)
const _ = require(`lodash`)
const url = require(`url`)

const Promise = require(`bluebird`)

const allowedFiletypes = ['webm', 'mp4', 'ogg'];

module.exports = (
  { files, markdownNode, markdownAST, pathPrefix, getNode }
) => {
  // This will only work for markdown syntax image tags
  const markdownVideoNodes = select(markdownAST, `image`)

  // Takes a node and generates the needed videos and then returns
  // the needed HTML replacement for the video
  const generateVideosAndUpdateNode = async function(url, tagParams, resolve) {
    // Check if this markdownNode has a File parent. This plugin
    // won't work if the video isn't hosted locally.
    const parentNode = getNode(markdownNode.parent)

    if (!parentNode || !parentNode.dir) {
      return null
    }

    try {
      tagParams = JSON.parse(tagParams)
    } catch (e) {
      tagParams = {}
    }

    const videoNode = _.find(files, file => {
      if (file && allowedFiletypes.includes(file.extension) ) {
        return true;
      }
      return null
    })

    if (!videoNode || !videoNode.absolutePath) {
      return resolve()
    }

    const sourceTag = `<source src="${url}" type="video/${videoNode.extension}">`
    const propsStr = tagParams.options && tagParams.options.length ? `${tagParams.options.join(' ')} ` : ``

    return `
    <video ${propsStr}>
      ${sourceTag}
    </video>
    `
  }

  return Promise.all(
    // Simple because there is no nesting in markdown
    markdownVideoNodes.map(
      node =>
        new Promise(async (resolve) => {
          const parsedUrl = url.parse(node.url, true)
          const fileExt = path.extname(parsedUrl.pathname).substr(1)
                    
          if (isRelativeUrl(node.url) && allowedFiletypes.includes(fileExt)) {
            const rawHTML = await generateVideosAndUpdateNode(parsedUrl.pathname, node.alt, resolve)

            if (rawHTML) {
              // Replace the video node with an inline HTML node.
              node.type = `html`
              node.value = rawHTML
            }
            return resolve(node)
          } else {
            // Video isn't relative so there's nothing for us to do.
            return resolve()
          }
        })
    )
  ).then(markdownVideoNodes => markdownVideoNodes.filter(node => !!node))
}
