/* ============================================================================
   Remio Nocturne — shared animation engine (extracted from index.html)
   Every behavior is opt-in via data-attribute or element id and guards each
   getElementById / querySelector, so pages without a given element skip that
   block silently. Include with `defer`. dt-based; fully disabled under
   prefers-reduced-motion. Hero-only fx (rcursor waypoints, orbitMoon, phoneA
   glint, .cl/#tilt parallax, #nativeMac tilt) live inline in index.html —
   the guards below make those ids optional here too.
   ========================================================================== */
(function () {
  "use strict";
  var RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var FINE = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ── Nav scroll state + progress + scrollspy ─────────────────── */
  var nav = document.getElementById("nav");
  if (nav) {
    function navState() {
      nav.classList.toggle("scrolled", window.scrollY > 40);
      var max = document.documentElement.scrollHeight - window.innerHeight;
      nav.style.setProperty("--sp", max > 0 ? Math.min(1, window.scrollY / max) : 0);
    }
    window.addEventListener("scroll", navState, { passive: true });
    window.addEventListener("resize", navState);
    navState();
  }

  /* ── Mobile nav sheet (≤900px): the link row folds behind a burger ── */
  var navLinks = nav && nav.querySelector(".nav-links");
  var navIn = nav && nav.querySelector(".nav-in");
  if (navLinks && navIn) {
    var vi = (document.documentElement.lang || "").indexOf("vi") === 0;
    var burger = document.createElement("button");
    burger.type = "button";
    burger.className = "nav-burger";
    burger.setAttribute("aria-label", vi ? "Mở menu" : "Open menu");
    burger.setAttribute("aria-expanded", "false");
    if (!navLinks.id) navLinks.id = "navLinks";
    burger.setAttribute("aria-controls", navLinks.id);
    burger.innerHTML = "<span></span><span></span><span></span>";
    navIn.appendChild(burger);
    var topCta = navIn.querySelector(":scope > .btn");
    if (topCta) {
      var cta = document.createElement("a");
      cta.className = "nav-cta-m";
      cta.href = topCta.getAttribute("href");
      cta.textContent = topCta.textContent.trim();
      navLinks.appendChild(cta);
    }
    var setOpen = function (o) {
      nav.classList.toggle("open", o);
      burger.setAttribute("aria-expanded", o ? "true" : "false");
      burger.setAttribute("aria-label", o ? (vi ? "Đóng menu" : "Close menu") : (vi ? "Mở menu" : "Open menu"));
    };
    burger.addEventListener("click", function () { setOpen(!nav.classList.contains("open")); });
    navLinks.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
    window.addEventListener("resize", function () { if (window.innerWidth > 900) setOpen(false); });
  }

  var spyLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  if (spyLinks.length && "IntersectionObserver" in window) {
    var spyMap = {};
    spyLinks.forEach(function (a) {
      var sec = document.getElementById(a.getAttribute("href").slice(1));
      if (sec) spyMap[sec.id] = a;
    });
    var spio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        spyLinks.forEach(function (a) { a.classList.remove("active"); });
        var a = spyMap[e.target.id];
        if (a) a.classList.add("active");
      });
    }, { rootMargin: "-30% 0px -55% 0px" });
    Object.keys(spyMap).forEach(function (id) { spio.observe(document.getElementById(id)); });
    var heroSec = document.getElementById("hero");
    if (heroSec) spio.observe(heroSec); /* entering hero clears all */
  }

  /* ── Hero title word rise ─────────────────────────────────────── */
  var h1 = document.getElementById("heroTitle");
  if (h1) {
    var idx = 0;
    function splitWords(root) {
      Array.prototype.slice.call(root.childNodes).forEach(function (node) {
        if (node.nodeType === 1) { splitWords(node); return; }
        if (node.nodeType !== 3 || !node.nodeValue.trim()) return;
        var frag = document.createDocumentFragment();
        node.nodeValue.split(/\s+/).forEach(function (word, i) {
          if (!word) return;
          if (frag.childNodes.length || i > 0) frag.appendChild(document.createTextNode(" "));
          var w = document.createElement("span"); w.className = "hw";
          var wi = document.createElement("span"); wi.className = "hwi";
          wi.textContent = word;
          wi.style.transitionDelay = (idx++ * 90) + "ms";
          w.appendChild(wi); frag.appendChild(w);
        });
        root.replaceChild(frag, node);
      });
    }
    splitWords(h1);
    if (RM) { h1.classList.add("on"); }
    else { requestAnimationFrame(function () { requestAnimationFrame(function () { h1.classList.add("on"); }); }); }
  }

  /* ── Reveal on scroll ─────────────────────────────────────────── */
  var reveals = document.querySelectorAll("[data-reveal]");
  if (RM || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var onReveal = function (entries, obs) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var d = parseInt(el.getAttribute("data-reveal-delay") || "0", 10);
        el.style.transitionDelay = d + "ms";
        el.classList.add("in");
        /* one-time glare sweep on any device inside */
        setTimeout(function () {
          el.querySelectorAll(".dev").forEach(function (dv) { dv.classList.add("glare"); });
        }, d + 750);
        obs.unobserve(el);
      });
    };
    var io = new IntersectionObserver(onReveal, { threshold: 0.12, rootMargin: "0px 0px 60px 0px" });
    /* Elements taller than half the viewport can never reach the 0.12 ratio
       (a 13000px article on a 900px screen tops out at ~0.07 visible), so they
       would stay opacity-0 forever — reveal those on first intersection instead. */
    var ioTall = new IntersectionObserver(onReveal, { threshold: 0, rootMargin: "0px 0px 60px 0px" });
    reveals.forEach(function (el) {
      (el.offsetHeight > window.innerHeight * 0.5 ? ioTall : io).observe(el);
    });
  }

  /* ── Steps connector line ─────────────────────────────────────── */
  var stepsWrap = document.getElementById("stepsWrap");
  if (stepsWrap && "IntersectionObserver" in window && !RM) {
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { stepsWrap.classList.add("in"); sio.disconnect(); }
      });
    }, { threshold: 0.3 });
    sio.observe(stepsWrap);
  } else if (stepsWrap) { stepsWrap.classList.add("in"); }

  /* ── Fit-scaled stages ────────────────────────────────────────── */
  var fits = Array.prototype.slice.call(document.querySelectorAll(".fit"));
  if (fits.length) {
    function fitAll() {
      fits.forEach(function (f) {
        var spec = (f.getAttribute("data-fit") || "").split("x");
        var dw = parseFloat(spec[0]) || 1, dh = parseFloat(spec[1]) || 1;
        var avail = f.clientWidth || dw;
        var s = Math.min(1, avail / dw);
        var stage = f.firstElementChild;
        stage.style.transform = "scale(" + s + ")";
        stage.style.marginLeft = Math.max(0, (avail - dw * s) / 2) + "px";
        f.style.height = (dh * s) + "px";
      });
    }
    window.addEventListener("resize", fitAll);
    fitAll();
    /* refit once fonts/layout settle */
    window.addEventListener("load", fitAll);
  }

  /* ── Pointer + scroll parallax on hero cluster ────────────────── */
  var tilt = document.getElementById("tilt");
  var layers = Array.prototype.slice.call(document.querySelectorAll(".cl"));
  if (!RM && layers.length) {
    var pmx = 0, pmy = 0, tmx = 0, tmy = 0, sy = window.scrollY;
    if (FINE) {
      window.addEventListener("mousemove", function (e) {
        tmx = (e.clientX / window.innerWidth) * 2 - 1;
        tmy = (e.clientY / window.innerHeight) * 2 - 1;
      }, { passive: true });
    }
    window.addEventListener("scroll", function () { sy = window.scrollY; }, { passive: true });
    var lastPar = 0;
    (function parLoop(now) {
      now = now || 0;
      var pdt = lastPar ? Math.min(now - lastPar, 100) : 16.7;
      lastPar = now;
      var k = 1 - Math.pow(0.945, pdt / 16.7);
      pmx += (tmx - pmx) * k;
      pmy += (tmy - pmy) * k;
      if (tilt && FINE) {
        tilt.style.transform = "rotateX(" + (-pmy * 2.2) + "deg) rotateY(" + (pmx * 2.6) + "deg)";
      }
      var syc = Math.min(sy, 900);
      layers.forEach(function (l) {
        var px = parseFloat(l.getAttribute("data-px") || "0");
        var ss = parseFloat(l.getAttribute("data-sy") || "0");
        l.style.transform = "translate3d(" + (pmx * px) + "px," + (pmy * px * 0.7 - syc * ss) + "px,0)";
      });
      requestAnimationFrame(parLoop);
    })();
  }

  /* ── Native MacBook rises to face you on scroll ───────────────── */
  var nm = document.getElementById("nativeMac");
  if (nm && !RM) {
    var nmTick = false;
    function nmUpdate() {
      nmTick = false;
      var r = nm.getBoundingClientRect();
      var vh = window.innerHeight;
      if (r.top > vh || r.bottom < 0) return;
      var p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.72)));
      var mb = nm.firstElementChild;
      mb.style.setProperty("--rx", (16 * (1 - p)) + "deg");
    }
    window.addEventListener("scroll", function () {
      if (!nmTick) { nmTick = true; requestAnimationFrame(nmUpdate); }
    }, { passive: true });
    nmUpdate();
  } else if (nm) {
    nm.firstElementChild.style.setProperty("--rx", "0deg");
  }

  /* ── Hero FX loop — remote cursor works the Mac, phone glints ──
     (the connection lines themselves run on pure CSS) */
  var orbitMoon = document.getElementById("orbitMoon");
  var rc = document.getElementById("rcursor");
  var phoneA = document.getElementById("phoneA");
  if (rc || phoneA || orbitMoon) {
    var WPS = [[62, 62], [34, 30], [57, 46], [24, 64], [72, 28], [45, 56]];
    var easeIO = function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
    var clamp01 = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
    if (!RM) {
      var T = 4.2, CUR_S = 0.5, CUR_E = 1.5, GLINT = 2.6;
      var lastClickCyc = -1, lastGlintCyc = -1;
      if (rc) { rc.style.left = WPS[0][0] + "%"; rc.style.top = WPS[0][1] + "%"; }
      (function fxLoop(now) {
        var t = (now || 0) / 1000;
        var cyc = Math.floor(t / T), tt = t - cyc * T;
        if (rc) {
          var from = WPS[cyc % WPS.length], to = WPS[(cyc + 1) % WPS.length];
          var e = easeIO(clamp01((tt - CUR_S) / (CUR_E - CUR_S)));
          rc.style.left = (from[0] + (to[0] - from[0]) * e) + "%";
          rc.style.top = (from[1] + (to[1] - from[1]) * e) + "%";
          if (tt >= CUR_E && lastClickCyc !== cyc) {
            lastClickCyc = cyc;
            var rip = document.createElement("div");
            rip.className = "rclick";
            rip.style.left = to[0] + "%"; rip.style.top = to[1] + "%";
            rc.parentElement.appendChild(rip);
            setTimeout(function () { rip.remove(); }, 800);
          }
        }
        if (phoneA && tt >= GLINT && lastGlintCyc !== cyc) {
          lastGlintCyc = cyc;
          phoneA.classList.add("glint");
          setTimeout(function () { phoneA.classList.remove("glint"); }, 900);
        }
        if (orbitMoon) {
          var a = t * 0.13;
          orbitMoon.setAttribute("cx", 330 + 315 * Math.cos(a));
          orbitMoon.setAttribute("cy", 368 + 150 * Math.sin(a));
        }
        requestAnimationFrame(fxLoop);
      })(0);
    } else {
      if (orbitMoon) { orbitMoon.setAttribute("cx", 15); orbitMoon.setAttribute("cy", 368); }
      if (rc) { rc.style.display = "none"; }
    }
  }

  /* ── Count-up ─────────────────────────────────────────────────── */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && !RM && "IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        obs.unobserve(e.target);
        var el = e.target, target = parseInt(el.getAttribute("data-count"), 10);
        var t0 = performance.now(), dur = 1400;
        (function stepFn(now) {
          var t = Math.min(1, (now - t0) / dur);
          el.textContent = String(Math.round(target * (1 - Math.pow(1 - t, 3))));
          if (t < 1) requestAnimationFrame(stepFn);
        })(t0);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ── Magnetic buttons (CSS `translate`, composes with hover) ──── */
  if (FINE && !RM && "translate" in document.documentElement.style) {
    document.querySelectorAll("[data-mag]").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
        var dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
        btn.style.translate = (dx * 3.5) + "px " + (dy * 2.5) + "px";
      }, { passive: true });
      btn.addEventListener("mouseleave", function () { btn.style.translate = "0px 0px"; });
    });
  }

  /* ── Card sheen tracking ──────────────────────────────────────── */
  if (FINE) {
    document.querySelectorAll(".card, .bx").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
        card.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
      }, { passive: true });
    });
  }

  /* ── Starfield ────────────────────────────────────────────────── */
  var cv = document.getElementById("stars");
  if (cv) {
    var ctx = cv.getContext("2d");
    var W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);
    var stars = [], shoot = null, nextShoot = 4000;

    var sprite = document.createElement("canvas");
    sprite.width = 64; sprite.height = 64;
    (function () {
      var sc = sprite.getContext("2d");
      var g = sc.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, "rgba(238,243,255,1)");
      g.addColorStop(0.22, "rgba(200,215,255,0.85)");
      g.addColorStop(0.55, "rgba(150,175,255,0.28)");
      g.addColorStop(1, "rgba(150,175,255,0)");
      sc.fillStyle = g; sc.fillRect(0, 0, 64, 64);
    })();

    function seed() {
      var N = Math.max(70, Math.min(230, Math.round(W * H / 9500)));
      stars = [];
      for (var i = 0; i < N; i++) {
        var depth = Math.random();
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: 0.5 + Math.pow(depth, 1.8) * 1.9,
          depth: depth,
          base: 0.16 + depth * 0.5,
          phase: Math.random() * Math.PI * 2,
          freq: 0.25 + Math.random() * 0.85,
          drift: 1.5 + Math.random() * 3
        });
      }
    }
    var lastW = 0, lastH = 0;
    function sizeCv() {
      W = window.innerWidth; H = window.innerHeight;
      cv.width = W * DPR; cv.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      /* don't reseed on trivial resizes (mobile URL bar show/hide) — stars would visibly jump */
      if (!stars.length || Math.abs(W - lastW) > 80 || Math.abs(H - lastH) > 180) {
        seed(); lastW = W; lastH = H;
      }
      if (RM) drawStatic();
    }
    function drawStatic() {
      ctx.clearRect(0, 0, W, H);
      stars.forEach(function (s) {
        ctx.globalAlpha = s.base;
        var d = s.r * 6;
        ctx.drawImage(sprite, s.x - d / 2, s.y - d / 2, d, d);
      });
      ctx.globalAlpha = 1;
    }
    window.addEventListener("resize", sizeCv);
    sizeCv();

    if (!RM) {
      var st0 = performance.now();
      var stPrev = st0;
      (function starLoop(now) {
        var t = (now - st0) / 1000;
        var dt = Math.min(now - stPrev, 100) / 16.7; /* frames worth of time, refresh-rate independent */
        stPrev = now;
        var scr = window.scrollY;
        ctx.clearRect(0, 0, W, H);
        for (var i = 0; i < stars.length; i++) {
          var s = stars[i];
          var tw = 0.55 + 0.45 * Math.sin(t * s.freq + s.phase);
          var y = s.y - ((scr * 0.055 * s.depth) % (H + 40));
          if (y < -20) y += H + 40;
          var x = s.x + Math.sin(t * 0.12 + s.phase) * s.drift;
          ctx.globalAlpha = s.base * tw;
          var d = s.r * 6;
          ctx.drawImage(sprite, x - d / 2, y - d / 2, d, d);
        }
        /* shooting star */
        nextShoot -= dt * 16.7;
        if (!shoot && nextShoot <= 0 && document.visibilityState === "visible") {
          var fromLeft = Math.random() < 0.5;
          shoot = {
            x: fromLeft ? -60 : W * (0.3 + Math.random() * 0.7),
            y: Math.random() * H * 0.4,
            vx: (fromLeft ? 1 : -1) * (9 + Math.random() * 5),
            vy: 4.5 + Math.random() * 2.5,
            life: 1
          };
          nextShoot = 6000 + Math.random() * 9000;
        }
        if (shoot) {
          shoot.x += shoot.vx * dt; shoot.y += shoot.vy * dt;
          shoot.life -= 0.011 * dt;
          if (shoot.life <= 0 || shoot.x < -80 || shoot.x > W + 80 || shoot.y > H + 40) { shoot = null; }
          else {
            var a = Math.sin(Math.min(1, shoot.life) * Math.PI);
            var tx = shoot.x - shoot.vx * 9, ty = shoot.y - shoot.vy * 9;
            var lg = ctx.createLinearGradient(shoot.x, shoot.y, tx, ty);
            lg.addColorStop(0, "rgba(238,243,255," + (0.9 * a).toFixed(3) + ")");
            lg.addColorStop(1, "rgba(160,185,255,0)");
            ctx.strokeStyle = lg;
            ctx.lineWidth = 1.6;
            ctx.globalAlpha = 1;
            ctx.beginPath();
            ctx.moveTo(shoot.x, shoot.y);
            ctx.lineTo(tx, ty);
            ctx.stroke();
            ctx.globalAlpha = a;
            ctx.drawImage(sprite, shoot.x - 7, shoot.y - 7, 14, 14);
          }
        }
        ctx.globalAlpha = 1;
        requestAnimationFrame(starLoop);
      })(st0);
    }
  }
})();
