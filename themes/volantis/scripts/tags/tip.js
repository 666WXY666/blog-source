'use strict';

// {% tip icon gradient, content %}
// gradient可选: [gradient1,gradient2,gradient3]
function postTip(args) {
  args = args.join(' ').split(', ')
  if (args.length > 1) {
    let cls = args[0].trim()
    let text = args[1].trim()
    return `<div class="tip ${cls}">${hexo.render.renderSync({text: text, engine: 'markdown'}).split('\n').join('')}</div>`;
  } else if (args.length > 0) {
    let text = args[0].trim()
    return `<div class="tip">${hexo.render.renderSync({text: text, engine: 'markdown'}).split('\n').join('')}</div>`;
  }
}

hexo.extend.tag.register('tip', postTip);
