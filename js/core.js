/* StephFood — données, panier, réservations, commandes.
   La clé Supabase ci-dessous est la clé publique (anon) déjà utilisée par le site. */
(function () {
  const KEY = "stephfood.v2";
  const SUPABASE_URL = "https://hmofudgrocrchbjjtcwl.supabase.co";
  const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhtb2Z1ZGdyb2NyY2hiamp0Y3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2MzIzNjAsImV4cCI6MjA5ODIwODM2MH0.bMZnP5QV6OhcwYoIt4jH8JTiwULTauLXPAUFRCB-5TA";
  const DEFAULT_PASSWORD = "StephFood@2026";
  const DAY_NAMES = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

  const seedMenu = [
    { id: "veyi", name: "Véyi de Nagan", desc: "Poisson frais, légumes locaux et épices togolaises. Le plat que l'on partage sans compter.", price: 5000, category: "Plats", image: "Image/photo5.jpg", badge: "Populaire", available: true, featured: true, spicy: 2, minutes: 25 },
    { id: "spagho", name: "Spagho de Steph", desc: "Spaghetti, sauce tomate maison et épices togolaises. La recette secrète de la maison.", price: 3500, category: "Signatures", image: "Image/photo11.jpg", badge: "", available: true, featured: true, spicy: 1, minutes: 15 },
    { id: "cantone", name: "Cantoné de Tassi", desc: "Légumes frais mijotés longuement, une spécialité qui réveille les papilles.", price: 4000, category: "Plats", image: "Image/photo1.jpg", badge: "", available: true, featured: true, spicy: 1, minutes: 30 },
    { id: "attieke", name: "Attiéké de Youpougon", desc: "Attiéké traditionnel, poisson grillé et sauce aux légumes. Léger, franc, généreux.", price: 3000, category: "Plats", image: "Image/photo4.jpg", badge: "Plat léger", available: true, featured: true, spicy: 1, minutes: 20 },
    { id: "pokoume", name: "Pokoumè de Navi", desc: "Pokoumè servi avec une sauce tomate fraîche et des épices locales.", price: 4500, category: "Plats", image: "Image/photo6.jpg", badge: "", available: true, featured: true, spicy: 2, minutes: 25 },
    { id: "ayimolou", name: "Ayimolou VIP", desc: "Notre plat signature revisité avec des ingrédients nobles. L'expérience StephFood.", price: 6000, category: "Signatures", image: "Image/photo13.jpg", badge: "Signature", available: true, featured: true, spicy: 2, minutes: 30 },
    { id: "decouverte", name: "Assiette Découverte", desc: "Une sélection de plusieurs plats pour goûter la richesse de la cuisine togolaise.", price: 7500, category: "Signatures", image: "Image/photo3.jpg", badge: "À partager", available: true, featured: false, spicy: 1, minutes: 25 },
    { id: "dessert", name: "Dessert togolais", desc: "Fruits locaux, miel et noix de coco. La note douce après les épices.", price: 2500, category: "Desserts", image: "Image/photo14.jpg", badge: "", available: true, featured: false, spicy: 0, minutes: 10 },
    { id: "bissap", name: "Bissap maison", desc: "Infusion d'hibiscus, légèrement sucrée, servie bien fraîche.", price: 1000, category: "Boissons", image: "", available: true, featured: false, spicy: 0, minutes: 5 },
    { id: "gingembre", name: "Jus de gingembre", desc: "Gingembre frais pressé, citron et une pointe de miel.", price: 1500, category: "Boissons", image: "", available: true, featured: false, spicy: 1, minutes: 5 },
    { id: "cocktail", name: "Cocktail des îles", desc: "Fruits de saison, menthe et glace pilée. Sans alcool.", price: 2000, category: "Boissons", image: "", available: true, featured: false, spicy: 0, minutes: 5 },
    { id: "eau", name: "Eau minérale", desc: "50 cl, bien fraîche.", price: 500, category: "Boissons", image: "", available: true, featured: false, spicy: 0, minutes: 1 }
  ];

  const seedReviews = [
    { id: "r1", name: "SAKO Yaya", text: "Famille, venez chez StephFood ! Il y a de bons plats locaux ici, un accueil chaleureux et des saveurs authentiques.", stars: 5, photo: "Image/photo34.jpg", published: true },
    { id: "r2", name: "LAMINE Yamal", text: "C'est ma première fois que je goûte à la nourriture togolaise et franchement, venez chez StephFood ! Une expérience inoubliable.", stars: 5, photo: "Image/photo32.jpg", published: true },
    { id: "r3", name: "Tiakola", text: "On ne connaît ni l'heure ni la date quand on mange ici, donc venez et régalez-vous !", stars: 5, photo: "Image/photo33.jpg", published: true }
  ];

  const defaultPrizes = [
    { label: "Dessert offert", win: true },
    { label: "Pas cette fois", win: false },
    { label: "Boisson offerte", win: true },
    { label: "Pas cette fois", win: false },
    { label: "Remise de 5 %", win: true },
    { label: "Pas cette fois", win: false },
    { label: "Pas cette fois", win: false },
    { label: "Pas cette fois", win: false }
  ];

  function defaultState() {
    return {
      v: 2,
      menu: seedMenu,
      reviews: seedReviews,
      reservations: [],
      orders: [],
      messages: [],
      cart: [],
      settings: {
        address: "Lomé, Togo",
        phone: "+228 99 14 53 69",
        phoneRaw: "22899145369",
        email: "stephaneakomagbe@gmail.com",
        instagram: "https://instagram.com/stephaneakomagbe",
        capacity: 24,
        wheelEnabled: true,
        prizes: defaultPrizes,
        passHash: "",
        passwordChanged: false,
        week: {
          0: ["12:00", "20:00"],
          1: ["10:00", "22:00"],
          2: ["10:00", "22:00"],
          3: ["10:00", "22:00"],
          4: ["10:00", "22:00"],
          5: ["10:00", "22:00"],
          6: ["10:00", "23:00"]
        }
      }
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.v !== 2 || !Array.isArray(parsed.menu)) return defaultState();
      const base = defaultState();
      parsed.settings = Object.assign(base.settings, parsed.settings || {});
      parsed.settings.week = Object.assign(base.settings.week, parsed.settings.week || {});
      parsed.cart = Array.isArray(parsed.cart) ? parsed.cart : [];
      parsed.reservations = Array.isArray(parsed.reservations) ? parsed.reservations : [];
      parsed.orders = Array.isArray(parsed.orders) ? parsed.orders : [];
      parsed.messages = Array.isArray(parsed.messages) ? parsed.messages : [];
      parsed.reviews = Array.isArray(parsed.reviews) && parsed.reviews.length ? parsed.reviews : base.reviews;
      if (!Array.isArray(parsed.settings.prizes) || parsed.settings.prizes.length < 4) parsed.settings.prizes = defaultPrizes;
      return parsed;
    } catch (err) {
      return defaultState();
    }
  }

  function save(state) {
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  function update(mutator) {
    const state = load();
    mutator(state);
    save(state);
    return state;
  }

  function uid(prefix) {
    const n = Math.floor(1000 + Math.random() * 9000);
    return prefix + "-" + n.toString(36).toUpperCase() + Date.now().toString(36).slice(-3).toUpperCase();
  }

  function money(value) {
    return new Intl.NumberFormat("fr-FR").format(Number(value) || 0) + " FCFA";
  }

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function toMinutes(hhmm) {
    const parts = String(hhmm || "00:00").split(":");
    return Number(parts[0]) * 60 + Number(parts[1] || 0);
  }

  function isOpen(date) {
    const d = date || new Date();
    const state = load();
    const range = state.settings.week[d.getDay()];
    if (!range) return false;
    const now = d.getHours() * 60 + d.getMinutes();
    return now >= toMinutes(range[0]) && now < toMinutes(range[1]);
  }

  function slotOk(dateStr, timeStr) {
    if (!dateStr || !timeStr) return { ok: false, message: "Choisissez une date et une heure." };
    const day = new Date(dateStr + "T12:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (day < today) return { ok: false, message: "Cette date est déjà passée." };
    const range = load().settings.week[day.getDay()];
    if (!range) return { ok: false, message: "Le restaurant est fermé ce jour-là." };
    const t = toMinutes(timeStr);
    if (t < toMinutes(range[0]) || t >= toMinutes(range[1])) {
      return { ok: false, message: "Nous sommes ouverts de " + range[0] + " à " + range[1] + " ce jour-là." };
    }
    return { ok: true };
  }

  function coversAt(dateStr, timeStr, ignoreId) {
    return load().reservations.reduce(function (sum, item) {
      if (item.id === ignoreId) return sum;
      if (item.status === "annulee") return sum;
      if (item.date === dateStr && item.time === timeStr) return sum + Number(item.people || 0);
      return sum;
    }, 0);
  }

  function groupHours(week) {
    const order = [1, 2, 3, 4, 5, 6, 0];
    const groups = [];
    order.forEach(function (day) {
      const range = week[day] || week[String(day)];
      const key = range ? range.join("-") : "";
      const last = groups[groups.length - 1];
      if (last && last.key === key) last.days.push(day);
      else groups.push({ key: key, range: range, days: [day] });
    });
    return groups.filter(function (g) { return g.range; }).map(function (g) {
      const a = DAY_NAMES[g.days[0]];
      const b = DAY_NAMES[g.days[g.days.length - 1]];
      return { label: g.days.length > 1 ? a + " – " + b : a, open: g.range[0], close: g.range[1] };
    });
  }

  function client() {
    if (!window.supabase || !window.supabase.createClient) return null;
    return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
  }

  async function pushReservation(record) {
    const db = client();
    if (!db) return { ok: false, reason: "Supabase indisponible" };
    const message = [record.code, record.occasion, record.email, record.note].filter(Boolean).join(" · ");
    const { error } = await db.from("reservations").insert({
      nom: record.name,
      telephone: record.phone,
      date: record.date,
      heure: record.time,
      nb_personnes: Number(record.people),
      message: message
    });
    return error ? { ok: false, reason: error.message } : { ok: true };
  }

  async function pullReservations() {
    const db = client();
    if (!db) return { ok: false, reason: "Supabase indisponible" };
    const { data, error } = await db.from("reservations").select("*").limit(300);
    if (error) return { ok: false, reason: error.message };
    update(function (state) {
      (data || []).forEach(function (row) {
        const name = row.nom || "";
        const phone = row.telephone || "";
        const date = row.date || "";
        const time = String(row.heure || "").slice(0, 5);
        const exists = state.reservations.some(function (item) {
          return item.date === date && item.time === time && item.phone === phone && item.name === name;
        });
        if (exists) return;
        state.reservations.push({
          id: row.id ? "RS-" + row.id : uid("RS"),
          code: "TABLE",
          name: name,
          phone: phone,
          email: "",
          date: date,
          time: time,
          people: Number(row.nb_personnes) || 1,
          occasion: "Service",
          note: row.message || "",
          status: "en_attente",
          createdAt: row.created_at || new Date().toISOString(),
          synced: true
        });
      });
    });
    return { ok: true, count: (data || []).length };
  }

  async function sha256(text) {
    const encoded = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest("SHA-256", encoded);
    return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
  }

  async function checkPassword(password) {
    const settings = load().settings;
    if (settings.passHash) return (await sha256(password)) === settings.passHash;
    return password === DEFAULT_PASSWORD;
  }

  async function setPassword(password) {
    const hash = await sha256(password);
    update(function (state) {
      state.settings.passHash = hash;
      state.settings.passwordChanged = true;
    });
  }

  function cartDetailed(state) {
    const current = state || load();
    return current.cart.map(function (line) {
      const dish = current.menu.find(function (item) { return item.id === line.id; });
      if (!dish) return null;
      return { dish: dish, qty: line.qty, line: dish.price * line.qty };
    }).filter(Boolean);
  }

  window.SF = {
    KEY: KEY,
    DEFAULT_PASSWORD: DEFAULT_PASSWORD,
    DAY_NAMES: DAY_NAMES,
    load: load,
    save: save,
    update: update,
    uid: uid,
    money: money,
    esc: esc,
    isOpen: isOpen,
    slotOk: slotOk,
    coversAt: coversAt,
    groupHours: groupHours,
    pushReservation: pushReservation,
    pullReservations: pullReservations,
    checkPassword: checkPassword,
    setPassword: setPassword,
    cartDetailed: cartDetailed,
    reset: function () {
      localStorage.removeItem(KEY);
      return defaultState();
    },
    importState: function (incoming) {
      if (!incoming || incoming.v !== 2 || !Array.isArray(incoming.menu)) throw new Error("Fichier invalide");
      save(incoming);
      return load();
    }
  };
})();
