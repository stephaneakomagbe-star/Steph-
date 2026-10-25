(function () {
  const SF = window.SF;
  const page = document.body.dataset.page;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let category = "Tout";

  function toast(message, type) {
    const wrap = document.getElementById("toasts");
    if (!wrap) return;
    const el = document.createElement("div");
    el.className = "toast" + (type === "error" ? " error" : "");
    el.textContent = message;
    wrap.appendChild(el);
    setTimeout(function () { el.remove(); }, 3800);
  }

  function openLayer(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.hidden = false;
  }
  function closeLayer(id) {
    const el = document.getElementById(id);
    if (el) el.hidden = true;
  }

  function showConfirm(title, text, code) {
    document.getElementById("confirmTitle").textContent = title;
    document.getElementById("confirmText").textContent = text;
    document.getElementById("confirmCode").textContent = code || "";
    openLayer("confirm");
  }

  function heat(n) {
    const level = Number(n) || 0;
    if (!level) return "Doux";
    return "🌶".repeat(level);
  }

  function media(dish) {
    if (dish.image) return '<img src="' + SF.esc(dish.image) + '" alt="' + SF.esc(dish.name) + '">';
    return '<div class="fallback" aria-hidden="true">' + SF.esc(dish.name.slice(0, 1)) + "</div>";
  }

  function dishCard(dish) {
    const off = dish.available ? "" : " is-off";
    const badge = !dish.available ? "Épuisé" : (dish.badge || "");
    return (
      '<article class="dish' + off + '">' +
        '<button class="dish-media" type="button" data-open-dish="' + SF.esc(dish.id) + '">' +
          media(dish) +
          (badge ? '<span class="badge">' + SF.esc(badge) + "</span>" : "") +
        "</button>" +
        '<div class="dish-body">' +
          '<div class="dish-top"><h3>' + SF.esc(dish.name) + '</h3><strong class="price">' + SF.money(dish.price) + "</strong></div>" +
          '<div class="dish-actions">' +
            '<button class="btn btn-ink" type="button" data-add="' + SF.esc(dish.id) + '"' + (dish.available ? "" : " disabled") + ">Ajouter</button>" +
            '<a class="btn btn-line" href="restauration.html?plat=' + encodeURIComponent(dish.id) + '">Table</a>' +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  function renderMenu() {
    const state = SF.load();
    const preview = document.getElementById("menuPreview");
    const grid = document.getElementById("menuGrid");
    if (preview) {
      const picks = state.menu.filter(function (d) { return d.available && d.image && d.featured; }).slice(0, 6);
      preview.innerHTML = picks.map(dishCard).join("");
    }
    if (!grid) return;
    const q = (document.getElementById("search").value || "").trim().toLowerCase();
    const sort = document.getElementById("sort").value;
    let list = state.menu.filter(function (d) {
      if (!d.image) return false;
      const inCat = category === "Tout" || d.category === category;
      const blob = (d.name + " " + d.category).toLowerCase();
      return inCat && (!q || blob.includes(q));
    });
    if (sort === "asc") list.sort(function (a, b) { return a.price - b.price; });
    if (sort === "desc") list.sort(function (a, b) { return b.price - a.price; });
    grid.innerHTML = list.length ? list.map(dishCard).join("") : '<p class="lede">Aucun plat ne correspond. Essayez un autre mot.</p>';
    const count = document.getElementById("resultCount");
    if (count) count.textContent = list.length + " proposition" + (list.length > 1 ? "s" : "");
  }

  function renderChips() {
    const holder = document.getElementById("chips");
    if (!holder) return;
    const cats = ["Tout"].concat(Array.from(new Set(SF.load().menu.map(function (d) { return d.category; }))));
    holder.innerHTML = cats.map(function (cat) {
      return '<button class="chip' + (cat === category ? " is-on" : "") + '" type="button" data-cat="' + SF.esc(cat) + '">' + SF.esc(cat) + "</button>";
    }).join("");
  }

  function renderReviews() {
    const grid = document.getElementById("reviewGrid");
    if (!grid) return;
    const originals = [
      { name: "SAKO Yaya", photo: "Image/photo34.jpg", text: "Famille, venez chez StephFood ! Il y a de bons plats locaux ici, un accueil chaleureux et des saveurs authentiques." },
      { name: "LAMINE Yamal", photo: "Image/photo32.jpg", text: "C'est ma première fois que je goûte à la nourriture togolaise et franchement, venez chez StephFood ! Une expérience inoubliable." },
      { name: "Tiakola", photo: "Image/photo33.jpg", text: "On ne connaît ni l'heure ni la date quand on mange ici, donc venez et régalez-vous !" }
    ];
    grid.innerHTML = originals.map(function (r) {
      return (
        '<article class="quote reveal in">' +
          '<img src="' + SF.esc(r.photo) + '" alt="' + SF.esc(r.name) + '">' +
          '<div class="stars">★★★★★</div>' +
          "<p>“" + SF.esc(r.text) + "”</p><h3>" + SF.esc(r.name) + "</h3>" +
        "</article>"
      );
    }).join("");
  }

  function renderContactBits() {
    const state = SF.load();
    const s = state.settings;
    const info = document.getElementById("infoList");
    if (info) {
      info.innerHTML =
        '<div><i class="fas fa-location-dot"></i><div><strong>Adresse</strong><br>' + SF.esc(s.address) + "</div></div>" +
        '<div><i class="fas fa-phone"></i><div><strong>Téléphone</strong><br><a href="tel:+' + SF.esc(s.phoneRaw) + '">' + SF.esc(s.phone) + "</a></div></div>" +
        '<div><i class="fas fa-envelope"></i><div><strong>Email</strong><br><a href="mailto:' + SF.esc(s.email) + '">' + SF.esc(s.email) + "</a></div></div>";
    }
    const socials = document.getElementById("socials");
    if (socials) {
      socials.innerHTML =
        '<a href="https://wa.me/' + SF.esc(s.phoneRaw) + '" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>' +
        '<a href="' + SF.esc(s.instagram) + '" target="_blank" rel="noopener" aria-label="Instagram"><i class="fab fa-instagram"></i></a>' +
        '<a href="tel:+' + SF.esc(s.phoneRaw) + '" aria-label="Appeler"><i class="fas fa-phone"></i></a>';
    }
    const hours = document.getElementById("hoursList");
    if (hours) {
      hours.innerHTML = SF.groupHours(s.week).map(function (row) {
        return "<div><span>" + SF.esc(row.label) + "</span><strong>" + row.open + " – " + row.close + "</strong></div>";
      }).join("");
    }
    const open = SF.isOpen(new Date());
    const dot = document.getElementById("openDot");
    const label = document.getElementById("openLabel");
    if (dot) dot.classList.toggle("on", open);
    if (label) label.textContent = open ? "Ouvert maintenant" : "Fermé pour le moment";
    const year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());
    const count = document.querySelector("[data-count]");
    if (count && page === "home") {
      document.querySelectorAll("[data-count]").forEach(function (el, index) {
        if (index === 0) el.dataset.count = String(state.menu.filter(function (d) { return d.available; }).length);
      });
    }
  }

  function cartCount() {
    const n = SF.load().cart.reduce(function (sum, line) { return sum + line.qty; }, 0);
    document.querySelectorAll("[data-cart-count]").forEach(function (el) {
      el.textContent = String(n);
      el.hidden = n === 0;
    });
    return n;
  }

  function renderCart() {
    const lines = SF.cartDetailed();
    const box = document.getElementById("cartLines");
    const form = document.getElementById("checkoutForm");
    if (!box) return;
    if (!lines.length) {
      box.innerHTML = '<p class="lede">Le panier est vide. La carte attend votre curiosité.</p>';
      if (form) form.hidden = true;
      document.getElementById("cartTotal").textContent = SF.money(0);
      return;
    }
    if (form) form.hidden = false;
    box.innerHTML = lines.map(function (line) {
      const img = line.dish.image
        ? '<img src="' + SF.esc(line.dish.image) + '" alt="">'
        : '<div class="thumb fallback">' + SF.esc(line.dish.name.slice(0, 1)) + "</div>";
      return (
        '<div class="cart-line">' + img +
          "<div><strong>" + SF.esc(line.dish.name) + "</strong><div class=\"price\">" + SF.money(line.line) + "</div>" +
            '<div class="qty"><button type="button" data-qty="' + SF.esc(line.dish.id) + '" data-dir="-1">−</button><span>' + line.qty + '</span><button type="button" data-qty="' + SF.esc(line.dish.id) + '" data-dir="1">+</button></div>' +
          "</div>" +
          '<button class="btn btn-line" type="button" data-remove="' + SF.esc(line.dish.id) + '">Retirer</button>' +
        "</div>"
      );
    }).join("");
    const total = lines.reduce(function (sum, line) { return sum + line.line; }, 0);
    document.getElementById("cartTotal").textContent = SF.money(total);
  }

  function addToCart(id) {
    const dish = SF.load().menu.find(function (item) { return item.id === id; });
    if (!dish || !dish.available) return toast("Ce plat n'est plus disponible.", "error");
    SF.update(function (state) {
      const line = state.cart.find(function (item) { return item.id === id; });
      if (line) line.qty += 1;
      else state.cart.push({ id: id, qty: 1 });
    });
    cartCount();
    renderCart();
    toast(dish.name + " ajouté au panier.");
  }

  function changeQty(id, dir) {
    SF.update(function (state) {
      const line = state.cart.find(function (item) { return item.id === id; });
      if (!line) return;
      line.qty += dir;
      state.cart = state.cart.filter(function (item) { return item.qty > 0; });
    });
    cartCount();
    renderCart();
  }

  function openDish(id) {
    const dish = SF.load().menu.find(function (item) { return item.id === id; });
    const card = document.getElementById("dishModalCard");
    if (!dish || !card) return;
    card.innerHTML =
      '<div class="modal-photo">' + media(dish) + "</div>" +
      '<div class="modal-copy"><h2 class="serif" style="font-size:2.4rem;margin:8px 0">' + SF.esc(dish.name) + "</h2>" +
      "<p>" + SF.esc(dish.desc) + "</p><p class=\"price\" style=\"font-size:1.4rem\">" + SF.money(dish.price) + "</p>" +
      '<p class="meta"><span>' + dish.minutes + " min</span><span>" + heat(dish.spicy) + "</span></p>" +
      '<div class="dish-actions"><button class="btn btn-ember" type="button" data-add="' + SF.esc(dish.id) + '">Ajouter</button>' +
      '<a class="btn btn-line" href="restauration.html?plat=' + encodeURIComponent(dish.id) + '">Réserver</a></div></div>';
    openLayer("dishModal");
  }

  function renderWheel() {
    const rotor = document.getElementById("wheelRotor");
    if (!rotor) return;
    const settings = SF.load().settings;
    const section = document.getElementById("roue");
    if (!settings.wheelEnabled && section) {
      section.hidden = true;
      return;
    }
    const prizes = settings.prizes;
    const slice = 360 / prizes.length;
    const reach = Math.max(90, (rotor.clientWidth || 320) / 2 - 78);
    const colors = ["#fb911f", "#2a211c"];
    const stops = prizes.map(function (prize, i) {
      return colors[i % 2] + " " + (i * slice) + "deg " + ((i + 1) * slice) + "deg";
    }).join(", ");
    rotor.style.background = "conic-gradient(" + stops + ")";
    rotor.innerHTML = prizes.map(function (prize, i) {
      const angle = i * slice + slice / 2;
      return '<span class="wheel-label" style="transform: translate(-50%, -50%) rotate(' + angle + 'deg) translateY(-' + reach + 'px)">' + SF.esc(prize.label) + "</span>";
    }).join("") + '<div class="wheel-hub"><i class="fas fa-utensils"></i></div>';
    const last = Number(localStorage.getItem("stephfood-wheel-last-spin") || 0);
    const btn = document.getElementById("spinWheel");
    if (last && Date.now() - last < 86400000 && btn) {
      btn.disabled = true;
      document.getElementById("wheelResult").textContent = "Vous avez déjà joué aujourd'hui. Revenez demain.";
    }
  }

  function spinWheel() {
    const btn = document.getElementById("spinWheel");
    const rotor = document.getElementById("wheelRotor");
    const result = document.getElementById("wheelResult");
    if (!btn || btn.disabled) return;
    const prizes = SF.load().settings.prizes;
    const index = Math.floor(Math.random() * prizes.length);
    const prize = prizes[index];
    const slice = 360 / prizes.length;
    const center = index * slice + slice / 2;
    const turns = 360 * 7;
    btn.disabled = true;
    result.className = "wheel-result";
    result.textContent = "La roue tourne…";
    localStorage.setItem("stephfood-wheel-last-spin", String(Date.now()));
    rotor.style.transform = "rotate(" + (turns - center) + "deg)";
    window.setTimeout(function () {
      result.textContent = prize.win ? "Bravo, vous repartez avec : " + prize.label + "." : "Pas de gain cette fois. La maison vous garde quand même une place.";
      result.classList.add(prize.win ? "is-win" : "is-loss");
    }, reduced ? 0 : 4900);
  }

  function typeHero() {
    const title = document.getElementById("heroTitle");
    if (!title) return;
    if (reduced) {
      title.innerHTML = "L'authentique<br>cuisine <em>togolaise</em>";
      return;
    }
    const sequence = [
      { text: "L'authentique", br: true },
      { text: "cuisine " },
      { text: "togolaise", em: true }
    ];
    title.innerHTML = '<span class="caret"></span>';
    let part = 0;
    let index = 0;
    function step() {
      if (part >= sequence.length) return;
      const current = sequence[part];
      const caret = title.querySelector(".caret");
      if (index === 0) {
        current.node = document.createElement(current.em ? "em" : "span");
        title.insertBefore(current.node, caret);
      }
      index += 1;
      current.node.textContent = current.text.slice(0, index);
      if (index < current.text.length) {
        setTimeout(step, 46);
        return;
      }
      if (current.br) title.insertBefore(document.createElement("br"), caret);
      part += 1;
      index = 0;
      setTimeout(step, 90);
    }
    step();
  }

  function playLogo(done) {
    const word = document.querySelector(".loader-word");
    if (!word || reduced) {
      if (word) word.innerHTML = "Steph<em>Food</em>";
      done();
      return;
    }
    const letters = ["S", "t", "e", "p", "h", "F", "o", "o", "d"];
    word.innerHTML = "";
    letters.forEach(function (letter, index) {
      const node = document.createElement(index >= 5 ? "em" : "span");
      node.className = "ch";
      node.textContent = letter;
      word.appendChild(node);
      setTimeout(function () { node.classList.add("in"); }, 160 + index * 110);
    });
    setTimeout(done, 160 + letters.length * 110 + 700);
  }

  function bootLoader() {
    const loader = document.getElementById("loader");
    let pageReady = document.readyState === "complete";
    let logoReady = false;
    function openSite() {
      if (!pageReady || !logoReady) return;
      document.body.classList.remove("is-intro");
      if (loader) loader.classList.add("is-done");
      const hero = document.querySelector(".hero");
      if (hero) hero.classList.add("is-in");
      typeHero();
    }
    if (reduced) {
      pageReady = true;
      logoReady = true;
      openSite();
      return;
    }
    window.addEventListener("load", function () {
      pageReady = true;
      openSite();
    });
    playLogo(function () {
      logoReady = true;
      openSite();
    });
  }

  function bootMotion() {
    const header = document.getElementById("header");
    const progress = document.getElementById("progress");
    const onScroll = function () {
      if (header && page === "home") header.classList.toggle("scrolled", window.scrollY > 40);
      if (progress) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        entry.target.querySelectorAll("[data-count]").forEach(function (el) {
          if (el.dataset.done) return;
          el.dataset.done = "1";
          const target = Number(el.dataset.count) || 0;
          if (reduced) { el.textContent = String(target); return; }
          const start = performance.now();
          function frame(now) {
            const t = Math.min(1, (now - start) / 900);
            el.textContent = String(Math.round(target * (1 - Math.pow(1 - t, 3))));
            if (t < 1) requestAnimationFrame(frame);
          }
          requestAnimationFrame(frame);
        });
      });
    }, { threshold: 0.2 });
    document.querySelectorAll(".reveal").forEach(function (el) { observer.observe(el); });

    const glow = document.getElementById("glow");
    if (glow && !reduced && window.matchMedia("(pointer:fine)").matches) {
      glow.hidden = false;
      window.addEventListener("pointermove", function (event) {
        glow.style.transform = "translate(" + event.clientX + "px," + event.clientY + "px)";
      });
    }
    const hero = document.querySelector(".hero");
    const card = document.getElementById("heroCard");
    if (hero && card && !reduced) {
      hero.addEventListener("pointermove", function (event) {
        const rect = hero.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = "translate(" + (x * 18) + "px," + (y * 12) + "px)";
      });
    }
  }

  function prefillReservation() {
    const note = document.getElementById("r-note");
    const date = document.getElementById("r-date");
    if (date) date.min = new Date().toISOString().slice(0, 10);
    if (!note) return;
    const id = new URLSearchParams(location.search).get("plat");
    if (!id) return;
    const dish = SF.load().menu.find(function (item) { return item.id === id; });
    if (dish) note.value = "Intéressé par : " + dish.name + ".";
  }

  document.addEventListener("click", function (event) {
    const toggle = event.target.closest("#navToggle");
    if (toggle) {
      document.getElementById("nav").classList.toggle("is-open");
      toggle.classList.toggle("is-open");
      document.body.classList.toggle("nav-lock");
    }
    if (event.target.closest("#nav a")) {
      document.getElementById("nav").classList.remove("is-open");
      const burger = document.getElementById("navToggle");
      if (burger) burger.classList.remove("is-open");
      document.body.classList.remove("nav-lock");
    }
    if (event.target.closest("#openCart")) { renderCart(); openLayer("drawer"); }
    if (event.target.closest("[data-close-cart]")) closeLayer("drawer");
    if (event.target.closest("[data-close-modal]")) closeLayer("dishModal");
    if (event.target.closest("[data-close-confirm]")) closeLayer("confirm");
    if (event.target.closest("[data-close-light]")) closeLayer("lightbox");
    const cat = event.target.closest("[data-cat]");
    if (cat) { category = cat.getAttribute("data-cat"); renderChips(); renderMenu(); }
    const add = event.target.closest("[data-add]");
    if (add) addToCart(add.getAttribute("data-add"));
    const open = event.target.closest("[data-open-dish]");
    if (open && !event.target.closest("[data-add]")) openDish(open.getAttribute("data-open-dish"));
    const qty = event.target.closest("[data-qty]");
    if (qty) changeQty(qty.getAttribute("data-qty"), Number(qty.dataset.dir));
    const remove = event.target.closest("[data-remove]");
    if (remove) {
      SF.update(function (state) { state.cart = state.cart.filter(function (item) { return item.id !== remove.getAttribute("data-remove"); }); });
      cartCount();
      renderCart();
    }
    const shot = event.target.closest("[data-lightbox]");
    if (shot) {
      document.getElementById("lightImg").src = shot.getAttribute("data-lightbox");
      document.getElementById("lightCap").textContent = shot.getAttribute("data-caption") || "";
      openLayer("lightbox");
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    ["drawer", "dishModal", "confirm", "lightbox"].forEach(closeLayer);
  });

  const search = document.getElementById("search");
  const sort = document.getElementById("sort");
  if (search) search.addEventListener("input", renderMenu);
  if (sort) sort.addEventListener("change", renderMenu);
  const spin = document.getElementById("spinWheel");
  if (spin) spin.addEventListener("click", spinWheel);

  document.querySelectorAll(".js-contact-form").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const topic = String(data.get("topic") || "").trim();
      const message = String(data.get("message") || "").trim();
      if (!name || !email.includes("@") || !topic || !message) return toast("Complétez tous les champs.", "error");
      SF.update(function (state) {
        state.messages.unshift({ id: SF.uid("MSG"), name: name, email: email, topic: topic, message: message, read: false, createdAt: new Date().toISOString() });
      });
      form.reset();
      showConfirm("Message reçu", "L'équipe StephFood vous répondra très vite.", "");
    });
  });

  document.querySelectorAll(".js-reserve-form").forEach(function (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      const data = new FormData(form);
      const record = {
        id: SF.uid("RS"),
        code: SF.uid("TABLE"),
        name: String(data.get("name") || "").trim(),
        phone: String(data.get("phone") || "").trim(),
        email: String(data.get("email") || "").trim(),
        people: Number(data.get("people")),
        date: String(data.get("date") || ""),
        time: String(data.get("time") || ""),
        occasion: String(data.get("occasion") || "Service"),
        note: String(data.get("note") || "").trim(),
        status: "en_attente",
        createdAt: new Date().toISOString(),
        synced: false
      };
      if (!record.name || !record.phone || !record.people || record.people < 1) return toast("Le nom, le téléphone et le nombre de personnes sont indispensables.", "error");
      const slot = SF.slotOk(record.date, record.time);
      if (!slot.ok) return toast(slot.message, "error");
      const capacity = SF.load().settings.capacity;
      if (SF.coversAt(record.date, record.time) + record.people > capacity) {
        return toast("Ce créneau est complet. Choisissez une autre heure.", "error");
      }
      const btn = document.getElementById("reserveBtn");
      if (btn) btn.disabled = true;
      const remote = await SF.pushReservation(record);
      record.synced = remote.ok;
      SF.update(function (state) { state.reservations.unshift(record); });
      if (btn) btn.disabled = false;
      form.reset();
      prefillReservation();
      if (!remote.ok) {
        showConfirm("Demande gardée sur cet appareil", "La synchronisation en ligne a échoué. Appelez le restaurant pour confirmer. " + remote.reason, record.code);
        return;
      }
      showConfirm("Table demandée", "Nous vous appelons pour confirmer. Présentez ce code si besoin.", record.code);
    });
  });

  const checkout = document.getElementById("checkoutForm");
  if (checkout) {
    checkout.addEventListener("submit", function (event) {
      event.preventDefault();
      const lines = SF.cartDetailed();
      if (!lines.length) return toast("Ajoutez un plat avant d'envoyer.", "error");
      const name = document.getElementById("o-name").value.trim();
      const phone = document.getElementById("o-phone").value.trim();
      const mode = document.getElementById("o-mode").value;
      const note = document.getElementById("o-note").value.trim();
      if (!name || phone.replace(/\D/g, "").length < 8) return toast("Nom et téléphone valides, s'il vous plaît.", "error");
      const total = lines.reduce(function (sum, line) { return sum + line.line; }, 0);
      const order = {
        id: SF.uid("CMD"),
        name: name,
        phone: phone,
        mode: mode,
        note: note,
        items: lines.map(function (line) { return { id: line.dish.id, name: line.dish.name, qty: line.qty, price: line.dish.price }; }),
        total: total,
        status: "nouvelle",
        createdAt: new Date().toISOString()
      };
      SF.update(function (state) {
        state.orders.unshift(order);
        state.cart = [];
      });
      cartCount();
      renderCart();
      closeLayer("drawer");
      const text = [
        "Bonjour StephFood, nouvelle commande " + order.id,
        name + " · " + phone + " · " + mode,
        lines.map(function (line) { return line.qty + " × " + line.dish.name; }).join("\n"),
        "Total " + SF.money(total),
        note
      ].filter(Boolean).join("\n");
      const raw = SF.load().settings.phoneRaw;
      window.open("https://wa.me/" + raw + "?text=" + encodeURIComponent(text), "_blank", "noopener");
      showConfirm("Commande préparée", "WhatsApp s'ouvre avec le récapitulatif. L'équipe confirme le délai.", order.id);
      checkout.reset();
    });
  }

  renderChips();
  renderMenu();
  renderReviews();
  renderContactBits();
  renderWheel();
  cartCount();
  prefillReservation();
  bootLoader();
  bootMotion();
})();
