(function() {
  'use strict';

  var script = document.currentScript;
  var closerId = script.getAttribute('data-closer-id');
  if (!closerId) {
    console.warn('[OkDigiCloser] Falta el atributo data-closer-id en el script.');
    return;
  }

  var origin = new URL(script.src).origin;
  var iframeSrc = origin + '/closer/' + closerId;

  // --- Inject scoped styles ---
  var styleId = 'okdigicloser-widget-styles';
  if (!document.getElementById(styleId)) {
    var style = document.createElement('style');
    style.id = styleId;
    style.textContent = [
      '#okdc-chat-button {',
      '  position: fixed;',
      '  bottom: 24px;',
      '  right: 24px;',
      '  width: 60px;',
      '  height: 60px;',
      '  border-radius: 50%;',
      '  background: #2563eb;',
      '  border: none;',
      '  cursor: pointer;',
      '  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '  z-index: 2147483646;',
      '  transition: transform 0.2s ease, box-shadow 0.2s ease;',
      '  padding: 0;',
      '}',
      '#okdc-chat-button:hover {',
      '  transform: scale(1.08);',
      '  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.55);',
      '}',
      '#okdc-chat-button svg {',
      '  width: 28px;',
      '  height: 28px;',
      '  fill: #ffffff;',
      '  pointer-events: none;',
      '}',
      '#okdc-chat-container {',
      '  position: fixed;',
      '  bottom: 100px;',
      '  right: 24px;',
      '  width: 400px;',
      '  height: 600px;',
      '  border-radius: 16px;',
      '  overflow: hidden;',
      '  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);',
      '  z-index: 2147483647;',
      '  display: none;',
      '  flex-direction: column;',
      '  background: #ffffff;',
      '}',
      '#okdc-chat-container.okdc-open {',
      '  display: flex;',
      '}',
      '#okdc-chat-header {',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: space-between;',
      '  padding: 12px 16px;',
      '  background: #2563eb;',
      '  color: #ffffff;',
      '  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;',
      '  font-size: 15px;',
      '  font-weight: 600;',
      '  line-height: 1;',
      '  user-select: none;',
      '}',
      '#okdc-chat-header span {',
      '  flex: 1;',
      '}',
      '#okdc-close-button {',
      '  background: none;',
      '  border: none;',
      '  color: #ffffff;',
      '  font-size: 20px;',
      '  cursor: pointer;',
      '  padding: 0 0 0 12px;',
      '  line-height: 1;',
      '  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;',
      '}',
      '#okdc-close-button:hover {',
      '  opacity: 0.75;',
      '}',
      '#okdc-chat-iframe {',
      '  flex: 1;',
      '  width: 100%;',
      '  height: 100%;',
      '  border: none;',
      '  background: #ffffff;',
      '}',
      '@media (max-width: 767px) {',
      '  #okdc-chat-container {',
      '    top: 0;',
      '    left: 0;',
      '    right: 0;',
      '    bottom: 0;',
      '    width: 100%;',
      '    height: 100%;',
      '    border-radius: 0;',
      '  }',
      '  #okdc-chat-container.okdc-open {',
      '    display: flex;',
      '  }',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  // --- Chat button ---
  var button = document.createElement('button');
  button.id = 'okdc-chat-button';
  button.setAttribute('aria-label', 'Abrir chat');
  button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
    '<path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/>' +
    '<path d="M7 9h10v2H7zm0-3h10v2H7z"/>' +
    '</svg>';

  // --- Chat container ---
  var container = document.createElement('div');
  container.id = 'okdc-chat-container';

  var header = document.createElement('div');
  header.id = 'okdc-chat-header';

  var headerTitle = document.createElement('span');
  headerTitle.textContent = 'OkDigiCloser';

  var closeBtn = document.createElement('button');
  closeBtn.id = 'okdc-close-button';
  closeBtn.setAttribute('aria-label', 'Cerrar chat');
  closeBtn.innerHTML = '&#10005;';

  header.appendChild(headerTitle);
  header.appendChild(closeBtn);

  var iframe = document.createElement('iframe');
  iframe.id = 'okdc-chat-iframe';
  iframe.setAttribute('allow', 'microphone; camera');
  iframe.setAttribute('title', 'OkDigiCloser Chat');

  container.appendChild(header);
  container.appendChild(iframe);

  // --- Append to DOM ---
  document.body.appendChild(button);
  document.body.appendChild(container);

  // --- State ---
  var isOpen = false;
  var iframeLoaded = false;

  function openChat() {
    if (!iframeLoaded) {
      iframe.src = iframeSrc;
      iframeLoaded = true;
    }
    container.classList.add('okdc-open');
    isOpen = true;
  }

  function closeChat() {
    container.classList.remove('okdc-open');
    isOpen = false;
  }

  button.addEventListener('click', function() {
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  });

  closeBtn.addEventListener('click', function() {
    closeChat();
  });

  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isOpen) {
      closeChat();
    }
  });
})();
