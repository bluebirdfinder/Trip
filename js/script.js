(function () {
  "use strict";

  // ---------- Mobile nav toggle ----------
  var toggle = document.getElementById("navToggle");
  var dayNav = document.getElementById("dayNav");
  if (toggle && dayNav) {
    toggle.addEventListener("click", function () {
      dayNav.classList.toggle("is-open");
      var expanded = dayNav.classList.contains("is-open");
      toggle.setAttribute("aria-expanded", String(expanded));
    });
  }

  // ---------- Scrollspy for day nav ----------
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".day-nav__link"));
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute("href").replace("#", "");
      return document.getElementById(id);
    })
    .filter(Boolean);

  function setActive(id) {
    navLinks.forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (section) { spy.observe(section); });
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      dayNav && dayNav.classList.remove("is-open");
    });
  });

  // ---------- Reveal on scroll ----------
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window && revealEls.length) {
    var reveal = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    revealEls.forEach(function (el) { reveal.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // ---------- Countdown ----------
  var countdownEl = document.getElementById("countdown");
  if (countdownEl) {
    var tripStart = new Date("2026-09-20T12:25:00+08:00");
    var tripEnd = new Date("2026-09-23T15:30:00+08:00");
    var now = new Date();
    if (now < tripStart) {
      var days = Math.ceil((tripStart - now) / (1000 * 60 * 60 * 24));
      countdownEl.textContent = "距離出發還有 " + days + " 天";
    } else if (now >= tripStart && now <= tripEnd) {
      countdownEl.textContent = "旅途進行中，玩得開心！";
    } else {
      countdownEl.textContent = "希望這趟首爾之旅玩得很盡興！";
    }
  }

  // ---------- Packing checklist ----------
  var checklistGrid = document.getElementById("checklistGrid");
  if (checklistGrid) {
    var STORAGE_KEY = "seoul-trip-packing-v1";
    var checkboxes = Array.prototype.slice.call(checklistGrid.querySelectorAll("input[type=checkbox]"));
    var countEl = document.getElementById("checklistCount");
    var barEl = document.getElementById("checklistBar");
    var resetBtn = document.getElementById("checklistReset");

    function loadChecked() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      } catch (e) {
        return {};
      }
    }

    function saveChecked(state) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        /* storage unavailable, ignore */
      }
    }

    function updateProgress() {
      var done = checkboxes.filter(function (cb) { return cb.checked; }).length;
      if (countEl) countEl.textContent = done + "/" + checkboxes.length + " 已準備";
      if (barEl) barEl.style.width = (checkboxes.length ? (done / checkboxes.length) * 100 : 0) + "%";
    }

    var saved = loadChecked();
    checkboxes.forEach(function (cb) {
      var key = cb.getAttribute("data-item");
      if (saved[key]) cb.checked = true;
      cb.addEventListener("change", function () {
        var state = loadChecked();
        state[key] = cb.checked;
        saveChecked(state);
        updateProgress();
      });
    });
    updateProgress();

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        checkboxes.forEach(function (cb) { cb.checked = false; });
        saveChecked({});
        updateProgress();
      });
    }
  }

  // ---------- Back to top ----------
  var toTop = document.getElementById("toTop");
  if (toTop) {
    window.addEventListener(
      "scroll",
      function () {
        toTop.classList.toggle("is-visible", window.scrollY > 600);
      },
      { passive: true }
    );
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
