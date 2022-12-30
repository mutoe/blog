/* global hexo */

hexo.extend.filter.register('after_post_render', data => {
    // before <h1 id="foo"><a class="headerlink"></a>title</h1>
    // after  <h1 id="foo"><a class="headerlink">title</a></h1>
    data.content = data.content.replace(/(<(h[1-6]) id=.*?>)(<\/a>)(.*?)(<\/\2>)/g, '$1$4$3$5')
});
