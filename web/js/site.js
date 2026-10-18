/* 藤氏蓝 · site behaviour. Progressive enhancement only. */
(function () {
  var body = document.body;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* header state */
  var head = document.querySelector("[data-head]");
  var progress = document.querySelector("[data-progress]");
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (head) head.classList.toggle("is-scrolled", y > 24);
    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.setProperty("--p", max > 0 ? Math.min(1, Math.max(0, y / max)).toFixed(4) : "0");
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  /* mobile menu */
  var toggle = document.querySelector("[data-nav-toggle]");
  var menu = document.getElementById("mobile-menu");
  var toggleLabel = toggle ? toggle.querySelector(".nav__toggle-label") : null;
  function setMenu(open) {
    body.setAttribute("data-menu", open ? "open" : "closed");
    if (toggle) toggle.setAttribute("aria-expanded", String(open));
    if (toggleLabel) toggleLabel.textContent = open ? "关闭" : "目录";
    if (menu) menu.setAttribute("aria-hidden", String(!open));
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      setMenu(body.getAttribute("data-menu") !== "open");
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });
  }

  /* scroll reveal */
  var reveals = document.querySelectorAll("[data-reveal]");
  if (reveals.length) {
    if (!("IntersectionObserver" in window) || reduced) {
      reveals.forEach(function (el) { el.classList.add("is-in"); });
    } else {
      document.querySelectorAll("[data-reveal-group]").forEach(function (group) {
        Array.prototype.forEach.call(group.children, function (child, i) {
          if (child.hasAttribute("data-reveal")) {
            child.style.setProperty("--d", ((i % 5) * 0.07).toFixed(2) + "s");
          }
        });
      });
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -10% 0px", threshold: 0.06 });
      reveals.forEach(function (el) { io.observe(el); });
    }
  }

  /* hero entrance stagger (CSS animation, set delays here) */
  document.querySelectorAll(".hero [data-reveal]").forEach(function (el, i) {
    el.style.setProperty("--d", (0.06 + i * 0.08).toFixed(2) + "s");
  });

  /* accordions */
  document.querySelectorAll("[data-panel-btn]").forEach(function (btn) {
    var item = btn.closest("[data-panel]");
    if (!item) return;
    if (btn.getAttribute("aria-expanded") === "true") item.classList.add("is-open");
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      var group = btn.getAttribute("data-group");
      if (group) {
        document.querySelectorAll('[data-panel-btn][data-group="' + group + '"]').forEach(function (other) {
          if (other === btn) return;
          other.setAttribute("aria-expanded", "false");
          var otherItem = other.closest("[data-panel]");
          if (otherItem) otherItem.classList.remove("is-open");
        });
      }
      btn.setAttribute("aria-expanded", String(!open));
      item.classList.toggle("is-open", !open);
    });
  });

  /* copy to clipboard */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    var src = document.querySelector(btn.getAttribute("data-copy"));
    if (!src) return;
    var label = btn.textContent;
    var settle = function (ok) {
      btn.textContent = ok ? "已复制" : "请手动复制";
      setTimeout(function () { btn.textContent = label; }, 2200);
    };
    btn.addEventListener("click", function () {
      var text = (src.textContent || "").trim();
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      if (ok) return settle(true);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        var done = false;
        var finish = function (v) { if (!done) { done = true; settle(v); } };
        navigator.clipboard.writeText(text).then(function () { finish(true); }, function () { finish(false); });
        setTimeout(function () { finish(false); }, 1200);
      } else {
        settle(false);
      }
    });
  });

  /* works filter */
  var filter = document.querySelector("[data-filter]");
  if (filter) {
    var items = Array.prototype.slice.call(document.querySelectorAll(filter.getAttribute("data-filter")));
    filter.querySelectorAll("[data-value]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        var value = chip.getAttribute("data-value");
        filter.querySelectorAll("[data-value]").forEach(function (other) {
          other.setAttribute("aria-pressed", String(other === chip));
        });
        items.forEach(function (item) {
          var themes = (item.getAttribute("data-theme") || "").split(/\s+/);
          item.hidden = value !== "all" && themes.indexOf(value) === -1;
        });
      });
    });
  }

  /* current year */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* 3D plate: poster first, scene only on request */
  document.querySelectorAll("[data-plate-stage]").forEach(function (stage) {
    var frame = stage.querySelector("[data-plate-frame]");
    var start = stage.querySelector("[data-plate-start]");
    var stop = stage.querySelector("[data-plate-stop]");
    var live = stage.querySelector(".issue-plate__live");
    var status = stage.querySelector("[data-plate-status]");
    if (!frame || !start) return;
    var announce = function (text) { if (status) status.textContent = text; };

    start.addEventListener("click", function (e) {
      if (frame.getAttribute("src")) return;
      e.preventDefault();
      stage.classList.add("is-loading");
      start.setAttribute("aria-expanded", "true");
      if (live) live.textContent = "Loading / WebGL";
      announce("正在载入三维场景");
      frame.src = frame.getAttribute("data-src");
    });

    frame.addEventListener("load", function () {
      if (!frame.getAttribute("src")) return;
      stage.classList.remove("is-loading");
      stage.classList.add("is-live");
      if (live) live.textContent = "Live / WebGL";
      announce("三维场景已载入。可以拖动旋转、滚轮缩放、右键平移；Tab 键可进入场景操作。");
    });

    if (stop) {
      stop.addEventListener("click", function () {
        frame.removeAttribute("src");
        stage.classList.remove("is-live", "is-loading");
        start.setAttribute("aria-expanded", "false");
        if (live) live.textContent = "Live / WebGL";
        announce("已退出三维场景，回到静态画面。");
        start.focus();
      });
    }
  });

  /* subtle cover drift */
  var cover = document.querySelector("[data-cover]");
  if (cover && !reduced && !window.matchMedia("(max-width:720px)").matches) {
    var ghost = cover.querySelector("[data-cover-ghost]");
    var portrait = cover.querySelector(".issue-cover__portrait");
    var ticking = false;
    var move = function () {
      var y = Math.min(window.scrollY, window.innerHeight);
      if (ghost) ghost.style.transform = "translate3d(0," + (y * 0.05).toFixed(1) + "px,0)";
      if (portrait) portrait.style.transform = "translate3d(0," + (y * -0.025).toFixed(1) + "px,0)";
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(move); ticking = true; }
    }, { passive: true });
  }

  /* subtle hero scroll shift (legacy pages) */
  var hero = document.querySelector("[data-hero]");
  if (hero && !reduced) {
    var heroGhost = hero.querySelector(".hero__ghost");
    var heroPortrait = hero.querySelector(".portrait");
    var heroTicking = false;
    var moveHero = function () {
      var y = Math.min(window.scrollY, window.innerHeight);
      if (heroGhost) heroGhost.style.transform = "translate3d(0," + (y * 0.06).toFixed(1) + "px,0)";
      if (heroPortrait) heroPortrait.style.transform = "translate3d(0," + (y * -0.035).toFixed(1) + "px,0)";
      heroTicking = false;
    };
    window.addEventListener("scroll", function () {
      if (!heroTicking) { window.requestAnimationFrame(moveHero); heroTicking = true; }
    }, { passive: true });
  }
})();
