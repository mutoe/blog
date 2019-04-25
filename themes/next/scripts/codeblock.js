var languageMap = {
  js: 'javascript',
  ts: 'typescritp',
}

hexo.extend.filter.register('after_post_render', function (data) {
  const regex = /<figure class="highlight ([a-zA-Z]+)">.*?<\/figure>/
  while (regex.test(data.content)) {
    data.content = data.content.replace(regex, function () {
      var language = RegExp.$1 || 'plain'
      if (languageMap[language]) language = languageMap[language]
      var lastMatch = RegExp.lastMatch
      lastMatch = lastMatch.replace(/<figure class="highlight /, '<figure class="iseeu highlight /')
      return `<div class="highlight-wrap" data-rel="${language.toUpperCase()}">${lastMatch}</div>`
    })
  }
  return data
})
