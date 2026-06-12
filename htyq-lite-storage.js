// htyq-lite-storage.js — 统一存储层接口
// ★ v3.0.0: 抽象 StorageAdapter，默认接 localStorage
// ============================================================

window.HTYQ_LITE_STORAGE = (function() {
  'use strict';

  // ==================== StorageAdapter ====================
  function createLocalStorageAdapter() {
    return {
      getItem: function(key) {
        try { return localStorage.getItem(key); } catch(e) { return null; }
      },
      setItem: function(key, value) {
        try { localStorage.setItem(key, value); return true; } catch(e) { return false; }
      },
      removeItem: function(key) {
        try { localStorage.removeItem(key); return true; } catch(e) { return false; }
      },
      clear: function() {
        try { localStorage.clear(); return true; } catch(e) { return false; }
      },
      keys: function() {
        try { return Object.keys(localStorage).filter(function(k) { return k.indexOf('htyq_') === 0; }); } catch(e) { return []; }
      }
    };
  }

  // ==================== 当前适配器 ====================
  var _adapter = createLocalStorageAdapter();

  function getAdapter() {
    return _adapter;
  }

  function setAdapter(adapter) {
    if (adapter && typeof adapter.getItem === 'function' && typeof adapter.setItem === 'function') {
      _adapter = adapter;
      return true;
    }
    return false;
  }

  // ==================== 便捷方法 ====================
  function getJSON(key) {
    var raw = _adapter.getItem(key);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch(e) { return null; }
  }

  function setJSON(key, data) {
    return _adapter.setItem(key, JSON.stringify(data));
  }

  function remove(key) {
    return _adapter.removeItem(key);
  }

  function getKeys() {
    return _adapter.keys();
  }

  function getKey(prefix, chatId, suffix) {
    var parts = ['htyq'];
    if (prefix) parts.push(prefix);
    if (chatId) parts.push(chatId);
    if (suffix) parts.push(suffix);
    return parts.join('_');
  }

  return {
    getAdapter: getAdapter,
    setAdapter: setAdapter,
    getItem: function(key) { return _adapter.getItem(key); },
    setItem: function(key, value) { return _adapter.setItem(key, value); },
    removeItem: function(key) { return _adapter.removeItem(key); },
    clear: function() { return _adapter.clear(); },
    getJSON: getJSON,
    setJSON: setJSON,
    remove: remove,
    getKeys: getKeys,
    getKey: getKey,
  };
})();
