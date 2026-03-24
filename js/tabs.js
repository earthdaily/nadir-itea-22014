(function () {
  "use strict";

  function getIds(root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    var ids = tabs.map(function (t) {
      return t.getAttribute("aria-controls");
    });
    return { tabs: tabs, ids: ids };
  }

  function activate(panelId, opts) {
    opts = opts || {};
    var root = document.querySelector("[data-tabs-root]");
    if (!root) return;

    var data = getIds(root);
    var tabs = data.tabs;
    var panels = data.ids.map(function (id) {
      return document.getElementById(id);
    });

    var idx = data.ids.indexOf(panelId);
    if (idx === -1) idx = 0;
    var activeId = data.ids[idx];

    tabs.forEach(function (tab, i) {
      var on = i === idx;
      tab.setAttribute("aria-selected", on ? "true" : "false");
      tab.tabIndex = on ? 0 : -1;
    });

    panels.forEach(function (panel, i) {
      if (!panel) return;
      var on = i === idx;
      if (on) {
        panel.removeAttribute("hidden");
        panel.tabIndex = 0;
      } else {
        panel.setAttribute("hidden", "");
        panel.tabIndex = -1;
      }
    });

    var nav = document.querySelector("[data-tabs-nav]");
    if (nav) {
      Array.prototype.forEach.call(nav.querySelectorAll("a[data-tab]"), function (a) {
        var id = a.getAttribute("data-tab");
        if (id === activeId) a.classList.add("is-active");
        else a.classList.remove("is-active");
      });
    }

    if (opts.updateHash !== false) {
      var h = "#" + activeId;
      if (window.location.hash !== h) {
        if (opts.replace) window.history.replaceState(null, "", h);
        else window.history.pushState(null, "", h);
      }
    }
  }

  function panelIdFromHash() {
    var h = window.location.hash.replace(/^#/, "");
    return h || "about";
  }

  function onNavClick(e) {
    var a = e.target.closest("a[data-tab]");
    if (!a) return;
    var id = a.getAttribute("data-tab");
    if (!id) return;
    e.preventDefault();
    activate(id, { replace: false });
  }

  function onTablistKeydown(e) {
    var list = e.currentTarget;
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    var i = tabs.indexOf(document.activeElement);
    if (i === -1) return;

    var next = i;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      next = (i + 1) % tabs.length;
      e.preventDefault();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      next = (i - 1 + tabs.length) % tabs.length;
      e.preventDefault();
    } else if (e.key === "Home") {
      next = 0;
      e.preventDefault();
    } else if (e.key === "End") {
      next = tabs.length - 1;
      e.preventDefault();
    } else {
      return;
    }

    tabs[next].focus();
    var id = tabs[next].getAttribute("aria-controls");
    if (id) activate(id, { replace: true });
  }

  function init() {
    var root = document.querySelector("[data-tabs-root]");
    if (!root) return;

    var list = root.querySelector('[role="tablist"]');
    if (list) list.addEventListener("keydown", onTablistKeydown);

    root.querySelectorAll('[role="tab"]').forEach(function (tab) {
      tab.addEventListener("click", function () {
        var id = tab.getAttribute("aria-controls");
        if (id) activate(id, { replace: false });
      });
    });

    var nav = document.querySelector("[data-tabs-nav]");
    if (nav) nav.addEventListener("click", onNavClick);

    var initial = panelIdFromHash();
    activate(initial, { replace: true, updateHash: false });
    if (!window.location.hash) {
      window.history.replaceState(null, "", "#" + initial);
    }

    window.addEventListener("hashchange", function () {
      activate(panelIdFromHash(), { updateHash: false });
    });

    window.addEventListener("popstate", function () {
      activate(panelIdFromHash(), { updateHash: false });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
