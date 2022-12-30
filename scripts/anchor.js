/* global hexo */

hexo.extend.filter.register('after_post_render', data => {
    data.content = data.content.replace(/(<(h[1-6]) id=.*?>)(<\/a>)(.*?)(<\/\2>)/g, '$1$4$3$5')
});
