var attributes = [
  'autocomplete="off"',
  'autocorrect="off"',
  'autocapitalize="off"',
  'spellcheck="false"',
  'contenteditable="true"'
]

var attributesStr = [] || attributes.join(' ')

hexo.extend.filter.register('after_post_render', function (data) {
  const regex = /<figure class="highlight ([a-zA-Z]+)">.*?<\/figure>/
  while (regex.test(data.content)) {
    data.content = data.content.replace(regex, function () {
      var language = RegExp.$1 || 'plain'
      var lastMatch = RegExp.lastMatch
      lastMatch = lastMatch.replace(/<figure class="highlight /, '<figure class="iseeu highlight /')
      return `<div class="highlight-wrap" ${attributesStr} data-rel="${language}">${lastMatch}</div>`
    })
  }
  return data
})
