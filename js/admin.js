(function () {
  const SF = window.SF;
  const app = document.getElementById("app");
  let view = "dash";
  let filter = "tous";
  let query = "";
  let editing = null;
  let fails = 0;
  let lockedUntil = 0;

  function toast(message) {
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, 2800);
  }

  function pill(status) {
    const map = {
      en_attente: ["En attente", ""],
      confirmee: ["Confirmée", "ok"],
      terminee: ["Terminée", "info"],
      annulee: ["Annulée", "bad"],
      nouvelle: ["Nouvelle", ""],
      en_preparation: ["En préparation", "info"],
      prete: ["Prête", "ok"],
      servie: ["Servie", "info"]
    };
    const item = map[status] || [status, ""];
    return '<span class="pill ' + item[1] + '">' + item[0] + "</span>";
  }

  function when(iso) {
    if (!iso) return "";
    const d = new Date(iso.length === 10 ? iso + "T12:00:00" : iso);
    return d.toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  }

  function match(text) {
    return !query || String(text || "").toLowerCase().includes(query);
  }

  async function loginScreen() {
    const changed = SF.load().settings.passwordChanged;
    app.innerHTML =
      '<section class="gate">' +
        '<div class="gate-visual"><div class="brand" style="font-family:Fraunces,serif;font-size:1.8rem">Steph<span style="color:#fb911f;font-style:italic">Food</span></div>' +
        "<div><p>Espace équipe</p><h1>La salle,<br><em>vue d'en haut.</em></h1></div></div>" +
        '<div class="gate-panel"><form class="login-card" id="loginForm">' +
          "<h2>Connexion</h2>" +
          '<p class="hint">' + (changed ? "Mot de passe de l'équipe." : "Mot de passe initial : <strong>" + SF.DEFAULT_PASSWORD + "</strong>. Changez-le dans Réglages.") + "</p>" +
          '<label for="password">Mot de passe</label><input id="password" type="password" autocomplete="current-password" required>' +
          '<p class="error" id="loginError"></p>' +
          '<button class="btn ember full" type="submit">Entrer</button>' +
          '<p class="hint"><a href="index.html">Retour au site</a></p>' +
        "</form></div></section>";
    document.getElementById("loginForm").addEventListener("submit", async function (event) {
      event.preventDefault();
      const error = document.getElementById("loginError");
      if (Date.now() < lockedUntil) {
        error.textContent = "Trop d'essais. Patientez quelques secondes.";
        return;
      }
      const ok = await SF.checkPassword(document.getElementById("password").value);
      if (!ok) {
        fails += 1;
        error.textContent = "Mot de passe incorrect.";
        if (fails >= 5) { lockedUntil = Date.now() + 30000; fails = 0; }
        return;
      }
      sessionStorage.setItem("stephfood.auth", "1");
      shell();
    });
  }

  function shell() {
    const titles = { dash: "Tableau de bord", reservations: "Réservations", orders: "Commandes", menu: "La carte", messages: "Messages", settings: "Réglages" };
    app.innerHTML =
      '<div class="shell"><aside class="side">' +
        '<div class="brand">Steph<span>Food</span></div>' +
        navBtn("dash", "Tableau de bord") +
        navBtn("reservations", "Réservations") +
        navBtn("orders", "Commandes") +
        navBtn("menu", "La carte") +
        navBtn("messages", "Messages") +
        navBtn("settings", "Réglages") +
        '<div class="spacer"></div>' +
        '<a href="index.html" style="padding:12px;color:rgba(255,255,255,.7)">Voir le site</a>' +
        '<button type="button" id="logout">Se déconnecter</button>' +
      '</aside><main class="main"><div class="top"><div><p class="muted">Espace équipe</p><h1>' + titles[view] + '</h1></div><div id="topActions"></div></div><div id="view"></div></main></div>';
    app.querySelectorAll("[data-view]").forEach(function (btn) {
      btn.addEventListener("click", function () { view = btn.getAttribute("data-view"); filter = "tous"; query = ""; editing = null; shell(); });
    });
    document.getElementById("logout").addEventListener("click", function () {
      sessionStorage.removeItem("stephfood.auth");
      loginScreen();
    });
    const root = document.getElementById("view");
    if (view === "dash") renderDash(root);
    if (view === "reservations") renderReservations(root);
    if (view === "orders") renderOrders(root);
    if (view === "menu") renderMenu(root);
    if (view === "messages") renderMessages(root);
    if (view === "settings") renderSettings(root);
  }

  function navBtn(id, label) {
    return '<button type="button" data-view="' + id + '" class="' + (view === id ? "is-on" : "") + '">' + label + "</button>";
  }

  function renderDash(root) {
    const state = SF.load();
    const today = new Date().toISOString().slice(0, 10);
    const reservationsToday = state.reservations.filter(function (r) { return r.date === today && r.status !== "annulee"; });
    const openOrders = state.orders.filter(function (o) { return o.status === "nouvelle" || o.status === "en_preparation"; });
    const revenue = state.orders.filter(function (o) { return o.status !== "annulee"; }).reduce(function (sum, o) { return sum + Number(o.total || 0); }, 0);
    const unread = state.messages.filter(function (m) { return !m.read; }).length;
    const days = [];
    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const count = state.reservations.filter(function (r) { return r.date === key; }).length + state.orders.filter(function (o) { return String(o.createdAt).slice(0, 10) === key; }).length;
      days.push({ label: d.toLocaleDateString("fr-FR", { weekday: "short" }), count: count });
    }
    const max = Math.max.apply(null, days.map(function (d) { return d.count; }).concat([1]));
    root.innerHTML =
      '<div class="kpis">' +
        kpi("Couverts aujourd'hui", reservationsToday.reduce(function (s, r) { return s + Number(r.people || 0); }, 0)) +
        kpi("Commandes en cours", openOrders.length) +
        kpi("Encaissé (commandes)", SF.money(revenue)) +
        kpi("Messages non lus", unread) +
      "</div>" +
      '<div class="split"><section class="card"><h3>7 derniers jours</h3><div class="bars" style="margin-top:24px">' +
        days.map(function (d) { return '<div class="bar" style="height:' + Math.max(8, (d.count / max) * 150) + 'px" title="' + d.count + '"><small>' + d.label + "</small></div>"; }).join("") +
      '</div></section><section class="card"><h3>À traiter</h3>' +
        (reservationsToday.slice(0, 4).map(function (r) { return "<p><strong>" + SF.esc(r.time) + "</strong> · " + SF.esc(r.name) + " · " + r.people + " pers.</p>"; }).join("") || "<p class='muted'>Aucune table aujourd'hui.</p>") +
        '<button class="btn ghost" id="syncBtn" type="button">Synchroniser les réservations</button><p class="muted" id="syncMsg"></p></section></div>';
    document.getElementById("syncBtn").addEventListener("click", syncNow);
  }

  function kpi(label, value) {
    return '<article class="card"><span>' + label + "</span><b>" + value + "</b></article>";
  }

  async function syncNow() {
    const msg = document.getElementById("syncMsg");
    if (msg) msg.textContent = "Connexion…";
    const result = await SF.pullReservations();
    const reason = /permission denied/i.test(result.reason || "")
      ? "Supabase protège la lecture des tables. Les demandes faites sur cet appareil restent visibles ici."
      : (result.reason || "réseau indisponible");
    if (msg) msg.textContent = result.ok ? "Réservations en ligne récupérées." : reason;
    if (result.ok) shell();
  }

  function tools(kinds) {
    return '<div class="tools"><input id="q" placeholder="Rechercher" value="' + SF.esc(query) + '"><select id="f">' +
      kinds.map(function (item) { return '<option value="' + item[0] + '"' + (filter === item[0] ? " selected" : "") + ">" + item[1] + "</option>"; }).join("") +
      "</select></div>";
  }

  function bindTools() {
    const q = document.getElementById("q");
    const f = document.getElementById("f");
    if (q) q.addEventListener("input", function () { query = q.value.trim().toLowerCase(); shell(); q.focus(); });
    if (f) f.addEventListener("change", function () { filter = f.value; shell(); });
  }

  function renderReservations(root) {
    const rows = SF.load().reservations.filter(function (r) {
      return (filter === "tous" || r.status === filter) && match(r.name + " " + r.phone + " " + r.code + " " + r.note);
    });
    root.innerHTML = tools([["tous", "Toutes"], ["en_attente", "En attente"], ["confirmee", "Confirmées"], ["terminee", "Terminées"], ["annulee", "Annulées"]]) +
      table(["Client", "Créneau", "Pers.", "Statut", ""], rows.map(function (r) {
        return "<tr><td><strong>" + SF.esc(r.name) + "</strong><br><span class='muted'>" + SF.esc(r.phone) + (r.synced ? "" : " · non synchronisée") + "</span><br>" + SF.esc(r.note || "") + "</td>" +
          "<td>" + SF.esc(r.date) + "<br>" + SF.esc(r.time) + "<br>" + SF.esc(r.occasion || "") + "</td><td>" + r.people + "</td><td>" + pill(r.status) + "</td><td>" +
          statusButtons("reservation", r.id, ["confirmee", "terminee", "annulee"], ["Confirmer", "Terminer", "Annuler"]) + "</td></tr>";
      }).join(""), "Aucune réservation pour ce filtre.");
    bindTools();
    bindStatus();
  }

  function renderOrders(root) {
    const rows = SF.load().orders.filter(function (o) {
      return (filter === "tous" || o.status === filter) && match(o.name + " " + o.phone + " " + o.id);
    });
    root.innerHTML = tools([["tous", "Toutes"], ["nouvelle", "Nouvelles"], ["en_preparation", "En préparation"], ["prete", "Prêtes"], ["servie", "Servies"], ["annulee", "Annulées"]]) +
      table(["Commande", "Détail", "Total", "Statut", ""], rows.map(function (o) {
        const items = (o.items || []).map(function (item) { return item.qty + " × " + SF.esc(item.name); }).join("<br>");
        return "<tr><td><strong>" + SF.esc(o.name) + "</strong><br>" + SF.esc(o.phone) + "<br><span class='muted'>" + SF.esc(o.mode) + " · " + when(o.createdAt) + "</span></td>" +
          "<td>" + items + (o.note ? "<br><em>" + SF.esc(o.note) + "</em>" : "") + "</td><td>" + SF.money(o.total) + "</td><td>" + pill(o.status) + "</td><td>" +
          statusButtons("order", o.id, ["en_preparation", "prete", "servie", "annulee"], ["Préparer", "Prête", "Servie", "Annuler"]) + "</td></tr>";
      }).join(""), "Aucune commande pour le moment.");
    bindTools();
    bindStatus();
  }

  function statusButtons(kind, id, values, labels) {
    return '<div class="row-actions">' + values.map(function (value, i) {
      return '<button type="button" data-kind="' + kind + '" data-id="' + SF.esc(id) + '" data-status="' + value + '">' + labels[i] + "</button>";
    }).join("") + "</div>";
  }

  function bindStatus() {
    document.querySelectorAll("[data-status]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const kind = btn.getAttribute("data-kind");
        const id = btn.getAttribute("data-id");
        const status = btn.getAttribute("data-status");
        SF.update(function (state) {
          const list = kind === "order" ? state.orders : state.reservations;
          const item = list.find(function (row) { return row.id === id; });
          if (item) item.status = status;
        });
        toast("Statut mis à jour sur cet appareil.");
        shell();
      });
    });
  }

  function table(heads, body, empty) {
    if (!body) return '<p class="muted">' + empty + "</p>";
    return '<div style="overflow:auto"><table><thead><tr>' + heads.map(function (h) { return "<th>" + h + "</th>"; }).join("") + "</tr></thead><tbody>" + body + "</tbody></table></div>";
  }

  function renderMenu(root) {
    const state = SF.load();
    const dish = editing ? state.menu.find(function (item) { return item.id === editing; }) : null;
    root.innerHTML =
      '<div class="dish-edit"><div>' + table(["Plat", "Prix", "État", ""], state.menu.map(function (item) {
        return "<tr><td><strong>" + SF.esc(item.name) + "</strong><br><span class='muted'>" + SF.esc(item.category) + "</span></td><td>" + SF.money(item.price) + "</td><td>" +
          (item.available ? "<span class='pill ok'>En carte</span>" : "<span class='pill bad'>Épuisé</span>") + "</td><td class='row-actions'>" +
          '<button type="button" data-edit="' + SF.esc(item.id) + '">Modifier</button>' +
          '<button type="button" data-toggle="' + SF.esc(item.id) + '">' + (item.available ? "Épuiser" : "Remettre") + "</button></td></tr>";
      }).join(""), "") +
      '</div><form class="card" id="dishForm"><h3>' + (dish ? "Modifier" : "Nouveau plat") + "</h3>" +
        hidden("id", dish ? dish.id : "") +
        field("Nom", "name", dish ? dish.name : "", "text") +
        field("Description", "desc", dish ? dish.desc : "", "textarea") +
        field("Prix FCFA", "price", dish ? dish.price : "", "number") +
        field("Catégorie", "category", dish ? dish.category : "Plats", "text") +
        field("Badge", "badge", dish ? dish.badge : "", "text") +
        field("Image (Image/photo.jpg)", "image", dish ? dish.image : "", "text") +
        field("Minutes", "minutes", dish ? dish.minutes : 20, "number") +
        field("Piment 0-3", "spicy", dish ? dish.spicy : 0, "number") +
        '<div class="checks"><label><input type="checkbox" name="available" ' + (!dish || dish.available ? "checked" : "") + "> Disponible</label>" +
        '<label><input type="checkbox" name="featured" ' + (dish && dish.featured ? "checked" : "") + "> En avant</label></div>" +
        '<button class="btn ember" type="submit" style="margin-top:12px">Enregistrer</button> ' +
        (dish ? '<button class="btn bad" type="button" id="deleteDish">Supprimer</button>' : "") +
      "</form></div>";
    document.querySelectorAll("[data-edit]").forEach(function (btn) {
      btn.addEventListener("click", function () { editing = btn.getAttribute("data-edit"); shell(); });
    });
    document.querySelectorAll("[data-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const id = btn.getAttribute("data-toggle");
        SF.update(function (state) {
          const item = state.menu.find(function (dishItem) { return dishItem.id === id; });
          if (item) item.available = !item.available;
        });
        shell();
      });
    });
    document.getElementById("dishForm").addEventListener("submit", function (event) {
      event.preventDefault();
      const data = new FormData(event.target);
      const id = String(data.get("id") || "").trim() || slug(data.get("name"));
      const record = {
        id: id,
        name: String(data.get("name") || "").trim(),
        desc: String(data.get("desc") || "").trim(),
        price: Number(data.get("price")) || 0,
        category: String(data.get("category") || "Plats").trim(),
        badge: String(data.get("badge") || "").trim(),
        image: String(data.get("image") || "").trim(),
        minutes: Number(data.get("minutes")) || 15,
        spicy: Math.max(0, Math.min(3, Number(data.get("spicy")) || 0)),
        available: data.get("available") === "on",
        featured: data.get("featured") === "on"
      };
      if (!record.name) return toast("Le nom est obligatoire.");
      SF.update(function (state) {
        const index = state.menu.findIndex(function (item) { return item.id === id; });
        if (index >= 0) state.menu[index] = record;
        else state.menu.push(record);
      });
      editing = id;
      toast("Carte mise à jour.");
      shell();
    });
    const del = document.getElementById("deleteDish");
    if (del) del.addEventListener("click", function () {
      if (!confirm("Retirer ce plat de la carte ?")) return;
      SF.update(function (state) { state.menu = state.menu.filter(function (item) { return item.id !== editing; }); });
      editing = null;
      shell();
    });
  }

  function field(label, name, value, type) {
    if (type === "textarea") return "<label>" + label + "</label><textarea name=\"" + name + "\" rows=\"3\">" + SF.esc(value) + "</textarea>";
    return "<label>" + label + "</label><input name=\"" + name + "\" type=\"" + type + "\" value=\"" + SF.esc(value) + "\">";
  }
  function hidden(name, value) { return '<input type="hidden" name="' + name + '" value="' + SF.esc(value) + '">'; }
  function slug(value) {
    return String(value || "plat").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || SF.uid("plat");
  }

  function renderMessages(root) {
    const rows = SF.load().messages.filter(function (m) { return match(m.name + " " + m.topic + " " + m.message); });
    root.innerHTML = '<div class="tools"><input id="q" placeholder="Rechercher" value="' + SF.esc(query) + '"></div>' +
      table(["De", "Message", ""], rows.map(function (m) {
        return "<tr><td><strong>" + SF.esc(m.name) + "</strong><br>" + SF.esc(m.email) + "<br><span class='muted'>" + when(m.createdAt) + "</span></td>" +
          "<td><strong>" + SF.esc(m.topic) + "</strong><br>" + SF.esc(m.message) + "</td><td>" +
          (m.read ? "<span class='pill ok'>Lu</span>" : '<button class="mini" type="button" data-read="' + SF.esc(m.id) + '">Marquer lu</button>') + "</td></tr>";
      }).join(""), "Aucun message.");
    bindTools();
    document.querySelectorAll("[data-read]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const id = btn.getAttribute("data-read");
        SF.update(function (state) {
          const item = state.messages.find(function (m) { return m.id === id; });
          if (item) item.read = true;
        });
        shell();
      });
    });
  }

  function renderSettings(root) {
    const s = SF.load().settings;
    const days = SF.DAY_NAMES.map(function (name, index) {
      const range = s.week[index] || ["10:00", "22:00"];
      return "<div class='tools'><strong style='width:110px'>" + name + "</strong><input type='time' data-day='" + index + "' data-edge='0' value='" + range[0] + "'><input type='time' data-day='" + index + "' data-edge='1' value='" + range[1] + "'></div>";
    }).join("");
    const prizes = (s.prizes || []).map(function (p) { return (p.win ? "* " : "") + p.label; }).join("\n");
    root.innerHTML =
      '<form id="settingsForm" class="split"><div class="card"><h3>Maison</h3>' +
        field("Adresse", "address", s.address, "text") +
        field("Téléphone affiché", "phone", s.phone, "text") +
        field("Téléphone WhatsApp (indicatif, sans +)", "phoneRaw", s.phoneRaw, "text") +
        field("Email", "email", s.email, "text") +
        field("Instagram", "instagram", s.instagram, "text") +
        field("Couverts max / créneau", "capacity", s.capacity, "number") +
        '<label><input type="checkbox" name="wheelEnabled" ' + (s.wheelEnabled ? "checked" : "") + "> Roue active</label>" +
        "<label>Lots de la roue, un par ligne. * devant = lot gagnant</label><textarea name='prizes' rows='8'>" + SF.esc(prizes) + "</textarea>" +
        '<button class="btn ember" style="margin-top:12px" type="submit">Enregistrer</button></div>' +
        '<div class="card"><h3>Horaires</h3>' + days + "</div></form>" +
      '<div class="split" style="margin-top:14px"><form id="passForm" class="card"><h3>Mot de passe</h3>' +
        field("Mot de passe actuel", "current", "", "password") +
        field("Nouveau", "next", "", "password") +
        field("Confirmation", "again", "", "password") +
        '<button class="btn" type="submit" style="margin-top:12px">Changer</button></form>' +
        '<div class="card"><h3>Sauvegarde</h3><p class="muted">Les commandes, messages et statuts vivent dans ce navigateur. Exportez-les avant de changer d\'ordinateur. Les réservations en ligne restent aussi dans Supabase.</p>' +
        '<button class="btn" type="button" id="exportBtn">Exporter</button> ' +
        '<button class="btn ghost" type="button" id="importBtn">Importer</button> ' +
        '<button class="btn bad" type="button" id="resetBtn">Réinitialiser</button><input id="importFile" type="file" accept="application/json" hidden></div></div>';

    document.getElementById("settingsForm").addEventListener("submit", function (event) {
      event.preventDefault();
      const data = new FormData(event.target);
      const prizes = String(data.get("prizes") || "").split("\n").map(function (line) { return line.trim(); }).filter(Boolean).map(function (line) {
        const win = line.startsWith("*");
        return { win: win, label: line.replace(/^\*\s?/, "") };
      });
      SF.update(function (state) {
        state.settings.address = String(data.get("address") || "").trim();
        state.settings.phone = String(data.get("phone") || "").trim();
        state.settings.phoneRaw = String(data.get("phoneRaw") || "").replace(/\D/g, "");
        state.settings.email = String(data.get("email") || "").trim();
        state.settings.instagram = String(data.get("instagram") || "").trim();
        state.settings.capacity = Number(data.get("capacity")) || 24;
        state.settings.wheelEnabled = data.get("wheelEnabled") === "on";
        if (prizes.length >= 4) state.settings.prizes = prizes;
        document.querySelectorAll("[data-day]").forEach(function (input) {
          const day = input.getAttribute("data-day");
          const edge = Number(input.getAttribute("data-edge"));
          state.settings.week[day] = state.settings.week[day] || ["10:00", "22:00"];
          state.settings.week[day][edge] = input.value;
        });
      });
      toast("Réglages enregistrés.");
    });

    document.getElementById("passForm").addEventListener("submit", async function (event) {
      event.preventDefault();
      const data = new FormData(event.target);
      const current = String(data.get("current") || "");
      const next = String(data.get("next") || "");
      const again = String(data.get("again") || "");
      if (next.length < 8) return toast("8 caractères minimum.");
      if (next !== again) return toast("La confirmation ne correspond pas.");
      if (!(await SF.checkPassword(current))) return toast("Mot de passe actuel incorrect.");
      await SF.setPassword(next);
      event.target.reset();
      toast("Mot de passe mis à jour.");
    });

    document.getElementById("exportBtn").addEventListener("click", function () {
      const blob = new Blob([JSON.stringify(SF.load(), null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "stephfood-sauvegarde.json";
      a.click();
      URL.revokeObjectURL(a.href);
    });
    document.getElementById("importBtn").addEventListener("click", function () { document.getElementById("importFile").click(); });
    document.getElementById("importFile").addEventListener("change", async function (event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      try {
        SF.importState(JSON.parse(await file.text()));
        toast("Sauvegarde importée.");
        shell();
      } catch (err) {
        toast("Fichier impossible à lire.");
      }
    });
    document.getElementById("resetBtn").addEventListener("click", function () {
      if (!confirm("Effacer les données locales de cet appareil ?")) return;
      SF.reset();
      toast("Données locales réinitialisées.");
      shell();
    });
  }

  if (sessionStorage.getItem("stephfood.auth") === "1") shell();
  else loginScreen();
})();
