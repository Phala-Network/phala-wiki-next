import hljs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import ini from 'highlight.js/lib/languages/ini'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import markdown from 'highlight.js/lib/languages/markdown'
import rust from 'highlight.js/lib/languages/rust'
import xml from 'highlight.js/lib/languages/xml'
import yaml from 'highlight.js/lib/languages/yaml'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('json', json)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('ini', ini)
hljs.registerLanguage('toml', ini)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('md', markdown)
hljs.registerLanguage('rust', rust)

document.addEventListener('DOMContentLoaded', () => {
  document
    .querySelectorAll('pre code:not(.language-mermaid)')
    .forEach((block) => {
      hljs.highlightElement(block)
    })
})
