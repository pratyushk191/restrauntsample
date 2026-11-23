(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const rupees = (n) => '₹' + n.toLocaleString('en-IN');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Small deterministic hash so "today's" data stays stable through the day.
  const hash = (str) => {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
    return h >>> 0;
  };
  const isoDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  /* ------------------------------------------------------------------ */
  /* Hero: dish switcher                                                 */
  /* ------------------------------------------------------------------ */
  const SHADOW = '<circle cx="210" cy="212" r="182" fill="#000" fill-opacity=".16"/>';

  const prawn = (x, y, rot) => `
    <g transform="translate(${x} ${y}) rotate(${rot})">
      <path d="M14 34l24-4-8 22z" fill="#E8623F"/>
      <path d="M-30 12a32 32 0 1 1 44 22" fill="none" stroke="#F9A68A" stroke-width="22" stroke-linecap="round"/>
      <path d="M-30 12a32 32 0 1 1 44 22" fill="none" stroke="#E8623F" stroke-width="22" stroke-dasharray="3 15" stroke-opacity=".55"/>
      <circle cx="-27" cy="6" r="2.6" fill="#4A0E27"/>
    </g>`;

  const leaf = (x, y, rot, s = 1) =>
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><ellipse rx="20" ry="8" fill="#2F6B3F"/><path d="M-18 0h36" stroke="#1F4D2B" stroke-width="1.6"/></g>`;

  const steak = (x, y, rot) => `
    <g transform="translate(${x} ${y}) rotate(${rot})">
      <ellipse rx="64" ry="42" fill="#B46A12"/>
      <ellipse rx="58" ry="36" fill="#E09A2B"/>
      <path d="M-34 0h68M0-22v44" stroke="#C97F1B" stroke-width="3" stroke-linecap="round"/>
      <circle r="8" fill="#FFF6E0"/>
      <g fill="#F7D48A"><circle cx="-38" cy="-12" r="2.5"/><circle cx="-20" cy="18" r="2.5"/><circle cx="24" cy="-20" r="2.5"/><circle cx="40" cy="10" r="2.5"/><circle cx="14" cy="24" r="2.5"/><circle cx="-12" cy="-26" r="2.5"/><circle cx="-46" cy="8" r="2.5"/></g>
    </g>`;

  const lemon = (x, y, rot) => `
    <g transform="translate(${x} ${y}) rotate(${rot})">
      <path d="M-34 0a34 34 0 0 1 68 0z" fill="#F7DC5A" stroke="#E0B400" stroke-width="5" stroke-linejoin="round"/>
      <path d="M0 0v-28M0 0l-20-20M0 0l20-20" stroke="#E0B400" stroke-width="2.5" stroke-linecap="round"/>
    </g>`;

  const katori = (x, y, fill) =>
    `<circle cx="${x}" cy="${y}" r="38" fill="#98A2A8"/><circle cx="${x}" cy="${y}" r="31" fill="${fill}"/><path d="M${x - 18} ${y - 8}q18-14 36 0" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="4" stroke-linecap="round"/>`;

  const DISHES = [
    {
      name: 'Rava-fried kingfish',
      note: 'Semolina crust, lime, raw onion. ₹520',
      bg: '#F4B41A',
      ink: '#4A0E27',
      svg: `${SHADOW}
        <circle cx="200" cy="200" r="182" fill="#FFF6E0"/>
        <circle cx="200" cy="200" r="152" fill="none" stroke="#E7D4A3" stroke-width="3"/>
        <path d="M84 250C92 138 222 78 326 112C338 222 246 310 116 296Z" fill="#2F6B3F"/>
        <path d="M104 276C170 220 250 160 318 122" fill="none" stroke="#3E8E4D" stroke-width="4" stroke-linecap="round"/>
        <path d="M150 240l-28-40M196 204l-30-46M244 170l-26-42M170 226l50 34M214 192l56 30M258 160l52 20" stroke="#3E8E4D" stroke-width="2" stroke-linecap="round"/>
        ${steak(168, 186, -24)}
        ${steak(246, 232, 14)}
        ${lemon(118, 306, -32)}
        <g fill="none" stroke="#B0497A" stroke-width="5"><circle cx="292" cy="148" r="22"/><circle cx="292" cy="148" r="12"/><circle cx="318" cy="176" r="15"/></g>
        <path d="M262 318q34 4 60-24" fill="none" stroke="#3E8E4D" stroke-width="10" stroke-linecap="round"/>`,
    },
    {
      name: 'Prawn hooman',
      note: 'Coconut and kokum curry with ukde rice. ₹490',
      bg: '#0E4A4F',
      ink: '#FFF6E0',
      svg: `${SHADOW}
        <circle cx="200" cy="200" r="182" fill="#D9A441"/>
        <circle cx="200" cy="200" r="168" fill="#3A1A28"/>
        <circle cx="200" cy="200" r="152" fill="#E8791C"/>
        <path d="M96 210c10-74 118-104 166-48s-14 124-74 100" fill="none" stroke="#F6B36A" stroke-width="16" stroke-linecap="round" stroke-opacity=".75"/>
        <g fill="#C8321F" fill-opacity=".55"><circle cx="120" cy="140" r="9"/><circle cx="290" cy="270" r="12"/><circle cx="150" cy="300" r="7"/><circle cx="300" cy="150" r="6"/><circle cx="230" cy="320" r="8"/></g>
        ${prawn(150, 170, -20)}
        ${prawn(258, 178, 95)}
        ${prawn(196, 268, 200)}
        ${leaf(110, 240, -40)}
        ${leaf(286, 112, 30)}
        ${leaf(280, 300, -65, 0.9)}
        ${leaf(190, 96, 10, 0.85)}
        <g fill="#2A0F1B"><circle cx="130" cy="200" r="3"/><circle cx="226" cy="130" r="3"/><circle cx="300" cy="216" r="3"/><circle cx="240" cy="296" r="3"/><circle cx="160" cy="118" r="3"/><circle cx="118" cy="276" r="3"/><circle cx="204" cy="208" r="3"/></g>`,
    },
    {
      name: 'Kinara fish thali',
      note: 'Fried fish, curry, kismur, sol kadhi, rice. ₹560',
      bg: '#C8321F',
      ink: '#FFF6E0',
      svg: `${SHADOW}
        <circle cx="200" cy="200" r="182" fill="#AEB7BC"/>
        <circle cx="200" cy="200" r="172" fill="#E2E7E9"/>
        <circle cx="200" cy="200" r="160" fill="#CDD4D7"/>
        ${katori(98, 168, '#E8791C')}
        ${katori(162, 104, '#F4C430')}
        ${katori(240, 104, '#E87DA0')}
        ${katori(302, 168, '#3E8E4D')}
        <ellipse cx="200" cy="236" rx="72" ry="56" fill="#FFFDF5"/>
        <g fill="#E9E2CC"><circle cx="170" cy="226" r="3"/><circle cx="196" cy="208" r="3"/><circle cx="226" cy="222" r="3"/><circle cx="182" cy="256" r="3"/><circle cx="214" cy="262" r="3"/><circle cx="240" cy="246" r="3"/><circle cx="200" cy="236" r="3"/><circle cx="158" cy="246" r="3"/></g>
        <g transform="translate(108 270) rotate(-50)"><ellipse rx="40" ry="22" fill="#B46A12"/><ellipse rx="35" ry="17" fill="#E09A2B"/><circle r="5" fill="#FFF6E0"/></g>
        <circle cx="298" cy="268" r="42" fill="#E9C77B"/>
        <g fill="#C9A452"><circle cx="284" cy="254" r="4"/><circle cx="310" cy="250" r="3"/><circle cx="318" cy="276" r="4"/><circle cx="292" cy="284" r="3"/><circle cx="300" cy="266" r="2.5"/><circle cx="276" cy="274" r="2.5"/></g>
        <circle cx="176" cy="322" r="15" fill="#8F1D12"/>
        <circle cx="172" cy="318" r="5" fill="#C8321F"/>
        ${lemon(232, 328, 160)}`,
    },
    {
      name: 'Sol kadhi',
      note: 'Kokum and coconut milk, served cold. ₹140',
      bg: '#F2A7B8',
      ink: '#4A0E27',
      svg: `${SHADOW}
        <circle cx="200" cy="200" r="182" fill="#D9A441"/>
        <circle cx="200" cy="200" r="166" fill="none" stroke="#B9852A" stroke-width="3"/>
        <g fill="none" stroke="#B9852A" stroke-width="2" stroke-dasharray="2 10" stroke-linecap="round"><circle cx="200" cy="200" r="174"/></g>
        <circle cx="200" cy="200" r="138" fill="#FFF6E0"/>
        <circle cx="200" cy="200" r="124" fill="#E87DA0"/>
        <path d="M118 214c4-66 96-96 140-48s-8 108-58 90-34-74 6-66" fill="none" stroke="#F8C6D6" stroke-width="14" stroke-linecap="round" stroke-opacity=".8"/>
        <g fill="#3E8E4D"><circle cx="228" cy="150" r="9"/><circle cx="242" cy="160" r="9"/><circle cx="228" cy="166" r="9"/><circle cx="150" cy="238" r="8"/><circle cx="162" cy="248" r="8"/><circle cx="148" cy="254" r="8"/><circle cx="246" cy="262" r="7"/><circle cx="256" cy="254" r="7"/></g>
        <g fill="#7A4A1E"><ellipse cx="176" cy="160" rx="5" ry="2" transform="rotate(30 176 160)"/><ellipse cx="262" cy="206" rx="5" ry="2" transform="rotate(-40 262 206)"/><ellipse cx="204" cy="282" rx="5" ry="2" transform="rotate(70 204 282)"/><ellipse cx="136" cy="196" rx="5" ry="2" transform="rotate(-10 136 196)"/><ellipse cx="214" cy="210" rx="5" ry="2" transform="rotate(50 214 210)"/></g>
        <g fill="#5B1230"><path d="M52 150q18-16 30 2q-8 22-28 14z"/><path d="M330 300q20-8 26 12q-14 16-30 6z"/><path d="M70 268q16-6 22 10q-12 14-24 4z"/></g>`,
    },
  ];

  const plate = $('#plate');
  const dishName = $('#dish-name');
  const dishNote = $('#dish-note');
  let dishIndex = 0;
  let switching = false;
  let autoplay = null;

  const paintDish = (dish) => {
    plate.innerHTML = `<svg viewBox="0 0 400 400">${dish.svg}</svg>`;
    dishName.textContent = dish.name;
    dishNote.textContent = dish.note;
    document.documentElement.style.setProperty('--theme-bg', dish.bg);
    document.documentElement.style.setProperty('--theme-ink', dish.ink);
  };

  const showDish = (index) => {
    if (switching) return;
    dishIndex = (index + DISHES.length) % DISHES.length;
    const dish = DISHES[dishIndex];
    if (reducedMotion) { paintDish(dish); return; }
    switching = true;
    plate.classList.add('is-out');
    setTimeout(() => {
      plate.classList.remove('is-out');
      plate.classList.add('is-pre');
      paintDish(dish);
      void plate.offsetWidth; // commit the starting position before animating in
      plate.classList.remove('is-pre');
      setTimeout(() => { switching = false; }, 750);
    }, 420);
  };

  const stopAutoplay = () => { clearInterval(autoplay); autoplay = null; };
  $('#dish-prev').addEventListener('click', () => { stopAutoplay(); showDish(dishIndex - 1); });
  $('#dish-next').addEventListener('click', () => { stopAutoplay(); showDish(dishIndex + 1); });

  // First paint: the plate spins in once.
  if (reducedMotion) {
    paintDish(DISHES[0]);
  } else {
    plate.classList.add('is-pre');
    paintDish(DISHES[0]);
    requestAnimationFrame(() => requestAnimationFrame(() => plate.classList.remove('is-pre')));
    autoplay = setInterval(() => { if (!document.hidden) showDish(dishIndex + 1); }, 6500);
  }

  /* ------------------------------------------------------------------ */
  /* Opening hours (restaurant time is IST, wherever the visitor is)     */
  /* ------------------------------------------------------------------ */
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const CLOSED_DAY = 1; // Monday
  const LUNCH = [12 * 60, 15 * 60 + 30];
  const DINNER = [19 * 60, 23 * 60];

  const istNow = () => {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata', weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: false,
    }).formatToParts(new Date());
    const get = (type) => parts.find((p) => p.type === type).value;
    return { day: DAYS.indexOf(get('weekday')), mins: (Number(get('hour')) % 24) * 60 + Number(get('minute')) };
  };

  const renderOpenStatus = () => {
    const { day, mins } = istNow();
    const el = $('#open-status');
    let open = false;
    let text;
    const nextDay = (day + 1) % 7 === CLOSED_DAY ? 'Tuesday' : 'tomorrow';
    if (day === CLOSED_DAY) text = 'Closed today. Opens tomorrow at 12 noon';
    else if (mins < LUNCH[0]) text = 'Opens today at 12 noon';
    else if (mins < LUNCH[1]) { open = true; text = 'Open now. Lunch until 3.30 pm'; }
    else if (mins < DINNER[0]) text = 'Opens again at 7 pm';
    else if (mins < DINNER[1]) { open = true; text = 'Open now. Dinner until 11 pm'; }
    else text = `Closed now. Opens ${nextDay} at 12 noon`;
    el.textContent = text;
    el.classList.toggle('is-open', open);
  };
  renderOpenStatus();
  setInterval(renderOpenStatus, 60 * 1000);

  const renderHours = () => {
    const today = istNow().day;
    const order = [1, 2, 3, 4, 5, 6, 0];
    $('#hours tbody').innerHTML = order.map((d) => `
      <tr class="${d === today ? 'is-today' : ''}">
        <th scope="row">${DAYS[d]}${d === today ? ' (today)' : ''}</th>
        <td>${d === CLOSED_DAY ? 'Closed' : '12 to 3.30 pm, 7 to 11 pm'}</td>
      </tr>`).join('');
  };
  renderHours();

  /* ------------------------------------------------------------------ */
  /* Today's catch                                                       */
  /* ------------------------------------------------------------------ */
  const CATCH = [
    { local: 'Visvon', what: 'Kingfish, line-caught off Aguada' },
    { local: 'Paplet', what: 'Silver pomfret, best as recheado' },
    { local: 'Bangdo', what: 'Mackerel, grilled over coconut husk' },
    { local: 'Sungta', what: 'Tiger prawns from the Chapora estuary' },
    { local: 'Kurlyo', what: 'Mud crab, for xec xec' },
    { local: 'Tisryo', what: 'Clams, cooked sukka with coconut' },
    { local: 'Mankyo', what: 'Squid, butter garlic or stuffed' },
    { local: 'Chonak', what: 'Giant sea perch, steaks on the tawa' },
  ];

  const renderCatch = () => {
    const now = new Date();
    const key = isoDate(now);
    $('#catch-date').textContent = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

    const closedToday = istNow().day === CLOSED_DAY;
    if (closedToday) {
      $('#catch-title').textContent = 'On order for Tuesday';
      $('.catch-foot').textContent = 'The kitchen is closed on Mondays. This is what we have asked the boats for when we open again at noon tomorrow.';
    }

    const picks = CATCH
      .map((fish) => ({ ...fish, rank: hash(key + fish.local) }))
      .sort((a, b) => a.rank - b.rank)
      .slice(0, 5);

    const STATES = [
      { cls: 'plenty', label: 'Plenty' },
      { cls: 'plenty', label: 'Plenty' },
      { cls: 'few', label: 'A few left' },
      { cls: 'gone', label: 'Sold out' },
    ];

    $('#catch-board').innerHTML = picks.map((fish, i) => {
      // Keep the first two in stock so the board never reads as empty.
      const state = closedToday
        ? { cls: 'few', label: 'Expected' }
        : i < 2 ? STATES[0] : STATES[fish.rank % STATES.length];
      return `
        <li class="${state.cls === 'gone' ? 'is-gone' : ''}">
          <span class="catch-local">${fish.local}</span>
          <span class="catch-what">${fish.what}</span>
          <span class="catch-state ${state.cls}">${state.label}</span>
        </li>`;
    }).join('');
  };
  renderCatch();

  /* ------------------------------------------------------------------ */
  /* Menu and order tray                                                 */
  /* ------------------------------------------------------------------ */
  const SECTIONS = ['Small plates', 'From the sea', 'Curries and rice', 'Sweets', 'Drinks'];
  const HEAT = ['Not spicy', 'Mild', 'Medium', 'Hot'];

  const MENU = [
    { id: 'rissois', sec: 0, name: 'Prawn rissois', price: 320, heat: 1, desc: 'Three crumbed half-moons filled with creamy prawn. Eat them hot.' },
    { id: 'mussels', sec: 0, name: 'Rava-fried mussels', price: 360, heat: 2, desc: 'Semolina crust, green coriander chutney.' },
    { id: 'chorizo', sec: 0, name: 'Chorizo pão', price: 290, heat: 2, desc: 'Goan sausage and onions in poee from the bakery down the road.' },
    { id: 'salad', sec: 0, name: 'Tender coconut and raw mango salad', price: 260, heat: 0, veg: true, desc: 'Lime, green chilli, roasted peanuts.' },
    { id: 'toast', sec: 0, name: 'Mushroom xacuti toast', price: 280, heat: 2, veg: true, desc: 'Roasted coconut masala on grilled poee.' },

    { id: 'kingfish', sec: 1, name: 'Rava-fried kingfish', price: 520, heat: 2, desc: 'Two thick steaks in a semolina crust, with lime and raw onion.' },
    { id: 'pomfret', sec: 1, name: 'Pomfret recheado', price: 680, heat: 3, desc: 'A whole pomfret stuffed with red chilli and toddy vinegar masala.' },
    { id: 'crab', sec: 1, name: 'Crab xec xec', price: 740, heat: 3, desc: 'Mud crab in a thick roasted coconut gravy. Comes with a bib.' },
    { id: 'squid', sec: 1, name: 'Butter garlic squid', price: 460, heat: 1, desc: 'Seared fast on the tawa with black pepper and lime.' },
    { id: 'clams', sec: 1, name: 'Tisryo sukka', price: 420, heat: 2, desc: 'Clams tossed dry with fresh coconut and curry leaves.' },

    { id: 'hooman', sec: 2, name: 'Prawn hooman', price: 490, heat: 2, desc: 'Coconut and kokum curry, served with ukde rice.' },
    { id: 'fcr', sec: 2, name: 'Fish curry rice', price: 380, heat: 2, desc: 'What most of Goa eats for lunch. Today\'s fish, red rice, pickle.' },
    { id: 'thali', sec: 2, name: 'Kinara fish thali', price: 560, heat: 2, desc: 'Fried fish, fish curry, kismur, a vegetable, sol kadhi and rice.' },
    { id: 'cafreal', sec: 2, name: 'Chicken cafreal', price: 440, heat: 3, desc: 'Green coriander and chilli masala, roasted on the bone.' },
    { id: 'vindaloo', sec: 2, name: 'Pork vindaloo', price: 470, heat: 3, desc: 'Sharp with vinegar and garlic. Better with sannas, so we send four.' },
    { id: 'khatkhate', sec: 2, name: 'Khatkhate', price: 340, heat: 1, veg: true, desc: 'Seasonal vegetables stewed with toor dal, coconut and teppal.' },
    { id: 'tonak', sec: 2, name: 'Alsande tonak', price: 310, heat: 2, veg: true, desc: 'Black-eyed beans in roasted masala, with two poee.' },

    { id: 'bebinca', sec: 3, name: 'Bebinca', price: 240, heat: 0, veg: true, desc: 'Seven layers of coconut milk and ghee, served warm with vanilla ice cream.' },
    { id: 'serradura', sec: 3, name: 'Serradura', price: 210, heat: 0, veg: true, desc: 'Whipped cream and biscuit crumb, chilled in a glass.' },
    { id: 'dodol', sec: 3, name: 'Dodol', price: 190, heat: 0, veg: true, desc: 'Dark palm jaggery and coconut, cooked down for four hours.' },

    { id: 'solkadhi', sec: 4, name: 'Sol kadhi', price: 140, heat: 1, veg: true, desc: 'Kokum and coconut milk with garlic and green chilli. Served cold.' },
    { id: 'spritz', sec: 4, name: 'Kokum spritz', price: 180, heat: 0, veg: true, desc: 'Kokum syrup, soda, salt on the rim.' },
    { id: 'feni', sec: 4, name: 'Feni sour', price: 360, heat: 0, veg: true, desc: 'Cashew feni, lime and jaggery.' },
    { id: 'limbu', sec: 4, name: 'Limbu soda', price: 110, heat: 0, veg: true, desc: 'Fresh lime, sweet, salted or both.' },
  ];
  const byId = Object.fromEntries(MENU.map((item) => [item.id, item]));

  const state = { section: 1, vegOnly: false, order: {}, placed: null };

  const tabsEl = $('#menu-tabs');
  const dishesEl = $('#dishes');
  const emptyEl = $('#menu-empty');

  const renderTabs = () => {
    tabsEl.innerHTML = SECTIONS.map((label, i) =>
      `<button type="button" data-sec="${i}" aria-pressed="${i === state.section}">${label}</button>`).join('');
  };

  const heatMarkup = (level) => {
    const dots = [1, 2, 3].map((n) => `<i class="${n <= level ? 'on' : ''}"></i>`).join('');
    return `<span><span class="heat" aria-hidden="true">${dots}</span><span class="heat-label">${HEAT[level]}</span></span>`;
  };

  const controlMarkup = (item) => {
    const qty = state.order[item.id] || 0;
    if (!qty) return `<button class="add" type="button" data-act="add" data-id="${item.id}" aria-label="Add ${item.name} to your order">Add</button>`;
    return `
      <span class="qty">
        <button type="button" data-act="dec" data-id="${item.id}" aria-label="Remove one ${item.name}">−</button>
        <span aria-label="${qty} in your order">${qty}</span>
        <button type="button" data-act="inc" data-id="${item.id}" aria-label="Add one more ${item.name}">+</button>
      </span>`;
  };

  const renderMenu = () => {
    const items = MENU.filter((item) => item.sec === state.section && (!state.vegOnly || item.veg));
    dishesEl.innerHTML = items.map((item) => `
      <li class="dish">
        <div class="dish-top">
          <span class="mark ${item.veg ? 'veg' : 'nonveg'}" role="img" aria-label="${item.veg ? 'Vegetarian' : 'Not vegetarian'}"></span>
          <h3>${item.name}</h3>
          <span class="dots" aria-hidden="true"></span>
          <span class="price">${rupees(item.price)}</span>
        </div>
        <p class="dish-desc">${item.desc}</p>
        <div class="dish-foot">${heatMarkup(item.heat)}<span data-control="${item.id}">${controlMarkup(item)}</span></div>
      </li>`).join('');

    emptyEl.hidden = items.length > 0;
    if (!items.length) {
      emptyEl.textContent = `Nothing vegetarian under ${SECTIONS[state.section].toLowerCase()}. Try Curries and rice, or turn off the vegetarian filter.`;
    }
  };

  const orderCount = () => Object.values(state.order).reduce((a, b) => a + b, 0);
  const orderTotal = () => Object.entries(state.order).reduce((sum, [id, qty]) => sum + byId[id].price * qty, 0);

  const trayBtn = $('#tray-btn');
  const tray = $('#tray');
  const trayBody = $('#tray-body');

  const renderTrayButton = (bump) => {
    const count = orderCount();
    trayBtn.hidden = count === 0;
    $('#tray-count').textContent = count;
    $('#tray-total').textContent = rupees(orderTotal());
    trayBtn.setAttribute('aria-label', `Your order: ${count} ${count === 1 ? 'item' : 'items'}, ${rupees(orderTotal())}`);
    if (bump && !reducedMotion) {
      trayBtn.classList.remove('bump');
      void trayBtn.offsetWidth;
      trayBtn.classList.add('bump');
    }
  };

  const renderTray = () => {
    if (state.placed) {
      trayBody.innerHTML = `
        <div class="tray-placed">
          <h3>Pickup order placed</h3>
          <p>Order ${state.placed.ref}, ${rupees(state.placed.total)}. Pay at the counter when you collect.</p>
          <p>It will be ready in about ${state.placed.mins} minutes at Rua de Ourém 14.</p>
          <button class="btn btn-dark" type="button" data-act="close">Back to the menu</button>
        </div>`;
      return;
    }
    const lines = Object.entries(state.order);
    if (!lines.length) {
      trayBody.innerHTML = `<p class="tray-empty">Your order is empty. Add a dish from the menu to start.</p>`;
      return;
    }
    trayBody.innerHTML = `
      <ul class="tray-lines">
        ${lines.map(([id, qty]) => `
          <li>
            <span class="line-name">${byId[id].name}</span>
            <span class="qty">
              <button type="button" data-act="dec" data-id="${id}" aria-label="Remove one ${byId[id].name}">−</button>
              <span>${qty}</span>
              <button type="button" data-act="inc" data-id="${id}" aria-label="Add one more ${byId[id].name}">+</button>
            </span>
            <span class="line-price">${rupees(byId[id].price * qty)}</span>
          </li>`).join('')}
      </ul>
      <p class="tray-sum"><span>Total</span><strong>${rupees(orderTotal())}</strong></p>
      <p class="tray-note">Pickup only, from Rua de Ourém 14. Pay when you collect.</p>
      <button class="btn btn-dark" type="button" data-act="place">Place pickup order</button>`;
  };

  const changeQty = (id, delta, origin) => {
    const next = (state.order[id] || 0) + delta;
    if (next <= 0) delete state.order[id]; else state.order[id] = Math.min(next, 20);
    state.placed = null;

    // Update only the control that changed so keyboard focus stays put.
    const control = dishesEl.querySelector(`[data-control="${id}"]`);
    if (control) control.innerHTML = controlMarkup(byId[id]);
    renderTrayButton(delta > 0);
    if (tray.open) renderTray();

    const scope = origin === 'tray' ? trayBody : control;
    if (!scope) return;
    const wanted = next <= 0 ? 'add' : delta > 0 ? 'inc' : 'dec';
    const target = scope.querySelector(`[data-id="${id}"][data-act="${wanted}"]`)
      || scope.querySelector(`[data-id="${id}"]`)
      || scope.querySelector('button');
    if (target) target.focus();
    else if (origin === 'tray') $('#tray-close').focus();
  };

  tabsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-sec]');
    if (!btn) return;
    state.section = Number(btn.dataset.sec);
    tabsEl.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    renderMenu();
  });

  $('#veg-only').addEventListener('change', (e) => { state.vegOnly = e.target.checked; renderMenu(); });

  dishesEl.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    changeQty(btn.dataset.id, btn.dataset.act === 'dec' ? -1 : 1, 'menu');
  });

  trayBody.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const act = btn.dataset.act;
    if (act === 'inc' || act === 'dec') return changeQty(btn.dataset.id, act === 'inc' ? 1 : -1, 'tray');
    if (act === 'close') return tray.close();
    if (act === 'place') {
      state.placed = {
        ref: 'K' + String(hash(JSON.stringify(state.order) + Date.now()) % 9000 + 1000),
        total: orderTotal(),
        mins: 20 + Math.min(orderCount(), 8) * 2,
      };
      state.order = {};
      renderMenu();
      renderTrayButton(false);
      renderTray();
      trayBody.querySelector('button').focus();
    }
  });

  trayBtn.addEventListener('click', () => { renderTray(); tray.showModal(); });
  $('#tray-close').addEventListener('click', () => tray.close());
  tray.addEventListener('click', (e) => { if (e.target === tray) tray.close(); }); // backdrop
  tray.addEventListener('close', () => { state.placed = null; });

  renderTabs();
  renderMenu();
  renderTrayButton(false);

  /* ------------------------------------------------------------------ */
  /* Booking                                                             */
  /* ------------------------------------------------------------------ */
  const form = $('#book-form');
  const dateInput = $('#book-date');
  const slotsEl = $('#slots');
  const slotsNote = $('#slots-note');
  const errorEl = $('#book-error');
  const doneEl = $('#book-done');
  const guestsOut = $('#guests-count');
  const booking = { guests: 2, slot: null };

  const SLOT_TIMES = [];
  for (let m = LUNCH[0]; m <= 14 * 60 + 30; m += 30) SLOT_TIMES.push(m);
  for (let m = DINNER[0]; m <= 22 * 60; m += 30) SLOT_TIMES.push(m);

  const clock = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h % 12 || 12}${m ? '.' + String(m).padStart(2, '0') : ''} ${h < 12 ? 'am' : 'pm'}`;
  };
  const parseDate = (value) => { const [y, m, d] = value.split('-').map(Number); return new Date(y, m - 1, d); };

  const slotsFor = (value) => {
    const today = isoDate(new Date());
    const nowMins = new Date().getHours() * 60 + new Date().getMinutes();
    return SLOT_TIMES.map((mins) => ({
      mins,
      past: value === today && mins <= nowMins + 30,
      full: hash(value + ':' + mins) % 4 === 0,
    }));
  };

  const renderSlots = () => {
    const value = dateInput.value;
    booking.slot = null;
    slotsEl.innerHTML = '';
    if (!value) { slotsNote.textContent = 'Pick a date to see free tables.'; return; }
    if (value < dateInput.min) { slotsNote.textContent = 'That date has passed. Pick today or later.'; return; }
    if (parseDate(value).getDay() === CLOSED_DAY) { slotsNote.textContent = 'We are closed on Mondays. Pick another day.'; return; }

    const slots = slotsFor(value);
    let html = '';
    slots.forEach((slot, i) => {
      if (i > 0 && slot.mins - slots[i - 1].mins > 30) html += '<span class="slots-gap"></span>';
      const off = slot.past || slot.full;
      html += `<button type="button" data-mins="${slot.mins}" aria-pressed="false"${off ? ` disabled aria-label="${clock(slot.mins)}, ${slot.past ? 'passed' : 'full'}"` : ''}>${clock(slot.mins)}</button>`;
    });
    slotsEl.innerHTML = html;
    const free = slots.filter((s) => !s.past && !s.full).length;
    slotsNote.textContent = free
      ? 'Crossed-out times are fully booked.'
      : 'No tables left on this date. Try the next day.';
  };

  const showError = (message, field) => {
    errorEl.textContent = message;
    errorEl.hidden = false;
    if (field) { field.setAttribute('aria-invalid', 'true'); field.focus(); }
  };
  const clearError = () => {
    errorEl.hidden = true;
    form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
  };

  const setGuests = (n) => {
    booking.guests = Math.max(1, Math.min(8, n));
    guestsOut.textContent = booking.guests;
    $('#guests-less').disabled = booking.guests === 1;
    $('#guests-more').disabled = booking.guests === 8;
  };
  $('#guests-less').addEventListener('click', () => setGuests(booking.guests - 1));
  $('#guests-more').addEventListener('click', () => setGuests(booking.guests + 1));

  slotsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-mins]');
    if (!btn || btn.disabled) return;
    booking.slot = Number(btn.dataset.mins);
    slotsEl.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    clearError();
  });

  dateInput.addEventListener('change', () => { clearError(); renderSlots(); });
  form.addEventListener('input', (e) => { if (e.target.matches('[aria-invalid]')) clearError(); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearError();
    const name = $('#book-name');
    const phone = $('#book-phone');
    if (!dateInput.value) return showError('Pick a date for your table.', dateInput);
    if (booking.slot === null) {
      showError('Pick a time for your table.');
      const firstFree = slotsEl.querySelector('button:not(:disabled)');
      return (firstFree || dateInput).focus();
    }
    if (name.value.trim().length < 2) return showError('Enter the name the table should be under.', name);
    if (phone.value.replace(/\D/g, '').length < 8) return showError('Enter a phone number with at least 8 digits, so we can reach you about the table.', phone);

    const when = parseDate(dateInput.value).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    const rows = [
      ['Name', name.value.trim()],
      ['When', `${when}, ${clock(booking.slot)}`],
      ['Guests', String(booking.guests)],
      ['Phone', phone.value.trim()],
    ];
    const summary = $('#book-summary');
    summary.innerHTML = '';
    rows.forEach(([term, detail]) => {
      const dt = document.createElement('dt');
      const dd = document.createElement('dd');
      dt.textContent = term;
      dd.textContent = detail; // user input: never inserted as HTML
      summary.append(dt, dd);
    });
    form.hidden = true;
    doneEl.hidden = false;
    doneEl.focus();
  });

  $('#book-again').addEventListener('click', () => {
    doneEl.hidden = true;
    form.hidden = false;
    dateInput.focus();
  });

  // Default to the first date that still has a free table.
  const initBooking = () => {
    const d = new Date();
    dateInput.min = isoDate(d);
    for (let i = 0; i < 10; i++) {
      const value = isoDate(d);
      if (d.getDay() !== CLOSED_DAY && slotsFor(value).some((s) => !s.past && !s.full)) {
        dateInput.value = value;
        break;
      }
      d.setDate(d.getDate() + 1);
    }
    setGuests(2);
    renderSlots();
  };
  initBooking();

  /* ------------------------------------------------------------------ */
  /* Mobile navigation                                                   */
  /* ------------------------------------------------------------------ */
  const navToggle = $('.nav-toggle');
  const nav = $('#site-nav');
  const setNav = (open) => {
    nav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.textContent = open ? 'Close' : 'Menu';
  };
  navToggle.addEventListener('click', () => setNav(!nav.classList.contains('is-open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setNav(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setNav(false); navToggle.focus(); }
  });
})();
