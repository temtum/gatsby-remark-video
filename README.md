# gatsby-remark-video

The intent of this plugin is to aid in the embedding of looping 'html5 gifv'
like videos from markdown.

## Install

```bash
npm install --save https://github.com/temtum/gatsby-remark-video.git
```

## Usage

Currently it only detects files with the extensions `mp4`, `ogg`, `webm`.

### Configuration

Make sure this plugin comes before `gatsby-remark-images` otherwise it might complain about unknown image file formats.

```javascript
// In your gatsby-config.js
plugins: [
  ...
  {
    resolve: `gatsby-remark-video`
  },
  ...
]
```

Also make sure you have a plugin that copies the files you are referencing, for example `gatsby-remark-copy-linked-files`.

```
...
{
  resolve: `gatsby-remark-copy-linked-files`,
  options: {},
},
...
```

### Markdown Syntax

Markdown image syntax is used:

```
Video:
![{"options": ["controls", "preload", "width=300"]}](video.mp4)
```

Creates roughly this:

```html
<video controls preload width="300">
  <source src="/static/video.mp4" type="video/mp4" />
</video>
```
