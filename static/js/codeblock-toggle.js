(function() {
  var initialized = false;

  function init() {
    if (initialized) return;
    initialized = true;

    var codeBlocks = document.querySelectorAll('[class*="codeBlockContainer"]');
    codeBlocks.forEach(function(block) {
      if (!block.hasAttribute('data-collapsed')) {
        block.setAttribute('data-collapsed', 'true');
      }
    });
  }

  function handleClick(e) {
    var title = e.target.closest('[class*="codeBlockTitle"]');
    if (title) {
      var container = title.closest('[class*="codeBlockContainer"]');
      if (container) {
        var isCollapsed = container.getAttribute('data-collapsed') === 'true';
        container.setAttribute('data-collapsed', isCollapsed ? 'false' : 'true');
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      init();
      document.addEventListener('click', handleClick);
    });
  } else {
    init();
    document.addEventListener('click', handleClick);
  }
})();
