<div class="external-link">
  <a href="/sponsor">拥抱开源</a>
</div>

<div class="copyright" >
  {% set current = date(Date.now(), "YYYY") %}
  &copy; {% if theme.since and theme.since != current %} {{ theme.since }} - {% endif %}
  <span itemprop="copyrightYear">{{ current }}</span>
  <span class="with-love">
    <i class="fa fa-{{ theme.authoricon }}"></i>
  </span>
  <span class="author" itemprop="copyrightHolder">{{ config.author }}</span>
  {% if theme.copyright %}
  <span class="inline-block">
    {{ __('footer.powered', '<a class="theme-link" href="https://hexo.io">Hexo</a>') }}

    <span class="theme-info">
      {{ __('footer.theme') }} -
      <a class="theme-link" href="https://github.com/iissnan/hexo-theme-next">
        NexT.{{ theme.scheme }}
      </a>
    </span>
  </span>

  <script>
  (function(){
    var bp = document.createElement('script');
    var curProtocol = window.location.protocol.split(':')[0];
    if (curProtocol === 'https') {
        bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
    } else {
        bp.src = 'http://push.zhanzhang.baidu.com/push.js';
    }
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);
  })();
  </script>

  {% endif %}
</div>
