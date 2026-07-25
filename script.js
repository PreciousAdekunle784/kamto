    /* =========================================================
       KAMTO FOODS — APPLICATION LOGIC (vanilla JS)
       Structured so a backend can replace the data + form
       handlers without touching the UI. Look for "BACKEND HOOK".
       ========================================================= */

    /* ---------- 20. CURRENCY ---------- */
    // BACKEND HOOK: replace with live FX rates from an API if desired.
    const CURRENCIES = {
      GBP: { symbol: 'Â£', rate: 1 },
      USD: { symbol: '$', rate: 1.27 },
      CAD: { symbol: 'C$', rate: 1.73 },
      NGN: { symbol: '₦', rate: 2050 }
    };
    let currentCurrency = 'GBP';

    function formatPrice(gbp) {
      const c = CURRENCIES[currentCurrency];
      const val = gbp * c.rate;
      // NGN shown as whole numbers, others to 2dp
      const num = currentCurrency === 'NGN'
        ? Math.round(val).toLocaleString('en-NG')
        : val.toFixed(2);
      return c.symbol + num;
    }

    /* ---------- 21. CATEGORY ART (SVG placeholder system) ----------
       Deterministic, always-renders "product photography" stand-in.
       Each category has its own warm palette + emblem. A real photo
       drops straight into .card__media / .modal__media later.
       BACKEND HOOK: swap svgFor(...) for <img src=product.image>.     */
    const CAT_ART = {
      /* light → mid → deep, three-stop for real depth; last colour = accent for detail */
      'Grains & Beans': { a: '#E9C56B', b: '#C79A3B', c: '#7c5e18', emblem: 'grain' },
      'Spices & Seasonings': { a: '#DA744B', b: '#BF522E', c: '#7c3016', emblem: 'chili' },
      'Dried & Smoked': { a: '#9d7852', b: '#6f5030', c: '#40301c', emblem: 'fish' },
      'Palm & Cooking Oils': { a: '#E59B72', b: '#C86A3E', c: '#8f3d1a', emblem: 'bottle' },
      'Snacks': { a: '#E7C561', b: '#C79A3B', c: '#8a6416', emblem: 'snack' },
      'Provisions': { a: '#3c6d56', b: '#24493B', c: '#0e241d', emblem: 'jar' }
    };

    /* Silhouette illustrations, drawn centred on (100,72) in a ~86px box.
       Cream body (L) with a deep-tone accent (D) and a soft ground shadow.  */
    function emblem(kind) {
      const L = 'rgba(251,246,236,.95)', L2 = 'rgba(251,246,236,.62)', D = 'rgba(18,38,28,.28)';
      switch (kind) {
        case 'grain': // heaped bowl of grains
          return `<ellipse cx="100" cy="99" rx="42" ry="8.5" fill="${D}"/>
        <g fill="${L}" stroke="${L2}" stroke-width="1.3">
          <ellipse cx="83" cy="68" rx="4.3" ry="8" transform="rotate(-20 83 68)"/>
          <ellipse cx="100" cy="63" rx="4.3" ry="8"/>
          <ellipse cx="117" cy="68" rx="4.3" ry="8" transform="rotate(20 117 68)"/>
          <ellipse cx="91" cy="73" rx="4.3" ry="8" transform="rotate(-9 91 73)"/>
          <ellipse cx="109" cy="73" rx="4.3" ry="8" transform="rotate(9 109 73)"/>
        </g>
        <path d="M62 80a38 20 0 0076 0z" fill="${L}"/>
        <path d="M62 80a38 20 0 0076 0" fill="none" stroke="${D}" stroke-width="2.2"/>
        <path d="M70 86q30 12 60 0" fill="none" stroke="${L2}" stroke-width="2" stroke-linecap="round"/>`;
        case 'chili': // pepper with curled stem + midline
          return `<ellipse cx="102" cy="106" rx="28" ry="6.5" fill="${D}"/>
        <path d="M84 44c4 8 3 14-1 19 14 3 25 16 27 34 1 12-7 20-18 18-18-3-30-22-28-42 1-12-4-22-9-27 10-6 22-8 29-2z" fill="${L}"/>
        <path d="M83 45c-3-6-9-7-15-4" fill="none" stroke="${L}" stroke-width="4.6" stroke-linecap="round"/>
        <path d="M95 66c6 7 10 19 9 31" fill="none" stroke="${D}" stroke-width="2.3" stroke-linecap="round"/>`;
        case 'fish': // smoked fish with tail, gill + eye
          return `<ellipse cx="100" cy="100" rx="42" ry="7.5" fill="${D}"/>
        <path d="M56 72c22-25 62-25 80 0-18 25-58 25-80 0z" fill="${L}"/>
        <path d="M136 72l19-15q2.6 15 0 30z" fill="${L}"/>
        <path d="M90 58c6 5 6 24 0 28" fill="none" stroke="${D}" stroke-width="2.1"/>
        <circle cx="76" cy="68" r="3.4" fill="${D}"/>
        <path d="M64 72q10 5 22 0" fill="none" stroke="${L2}" stroke-width="1.8" stroke-linecap="round"/>`;
        case 'bottle': // oil bottle w/ cork, fill line + highlight
          return `<ellipse cx="100" cy="110" rx="24" ry="6.5" fill="${D}"/>
        <rect x="94" y="32" width="12" height="12" rx="2.5" fill="${L}"/>
        <path d="M92 44h16l7 13v43a7 7 0 01-7 7H92a7 7 0 01-7-7V57z" fill="${L}"/>
        <path d="M85 73h30v27a7 7 0 01-7 7H92a7 7 0 01-7-7z" fill="${D}"/>
        <rect x="98.5" y="50" width="3" height="48" rx="1.5" fill="${L2}"/>`;
        case 'snack': // stacked chin-chin cubes
          return `<ellipse cx="100" cy="107" rx="34" ry="6.5" fill="${D}"/>
        <g stroke="${D}" stroke-width="1.5">
          <path d="M72 80l18-10 18 10-18 10z" fill="${L}"/>
          <path d="M72 80v13l18 10V90z" fill="${L}" opacity=".82"/>
          <path d="M108 80v13l-18 10V90z" fill="${L}" opacity=".6"/>
          <path d="M96 62l18-10 18 10-18 10z" fill="${L}"/>
          <path d="M96 62v13l18 10V72z" fill="${L}" opacity=".82"/>
          <path d="M132 62v13l-18 10V72z" fill="${L}" opacity=".6"/>
        </g>`;
        case 'jar': // labelled provision jar
          return `<ellipse cx="100" cy="114" rx="30" ry="6.5" fill="${D}"/>
        <rect x="82" y="38" width="36" height="12" rx="3" fill="${L}"/>
        <rect x="86" y="34" width="28" height="6" rx="3" fill="${L2}"/>
        <path d="M80 50h40v54a8 8 0 01-8 8H88a8 8 0 01-8-8z" fill="${L}"/>
        <rect x="86" y="70" width="28" height="24" rx="3" fill="${D}"/>
        <path d="M91 78h18M91 86h13" stroke="${L}" stroke-width="2.3" stroke-linecap="round"/>`;
        default: return '';
      }
    }

    /* Full illustrated scene. withLabel=true adds the manifest code band (product
       media); false adds a legibility scrim (category tiles have HTML text on top). */
    function foodScene(category, code, h, withLabel) {
      const c = CAT_ART[category] || CAT_ART['Provisions'];
      const id = String(code).replace(/[^A-Za-z0-9]/g, '') + 'x' + category.charCodeAt(0);
      const cy = (h - (withLabel ? 24 : 0)) / 2;
      const shadeY = Math.round(h * 0.72);
      const speckle = `<g fill="rgba(251,246,236,.5)"><circle cx="30" cy="30" r="1.5"/><circle cx="170" cy="42" r="1.2"/><circle cx="48" cy="64" r="1"/><circle cx="150" cy="94" r="1.3"/><circle cx="24" cy="104" r="1.1"/><circle cx="182" cy="118" r="1"/></g>`;
      const foot = withLabel
        ? `<rect x="0" y="${h - 24}" width="200" height="24" fill="rgba(12,26,20,.44)"/>
       <text x="12" y="${h - 9}" fill="rgba(251,246,236,.85)" font-family="'Space Mono',monospace" font-size="8.5" letter-spacing="1.2">KF-${code}</text>
       <text x="188" y="${h - 8.5}" text-anchor="end" fill="rgba(224,201,138,.95)" font-family="'Space Mono',monospace" font-size="10">★</text>`
        : `<rect x="0" y="${h - 88}" width="200" height="88" fill="url(#sc${id})"/>`;
      const scDef = withLabel ? '' :
        `<linearGradient id="sc${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(0,0,0,0)"/><stop offset="1" stop-color="rgba(9,20,15,.6)"/></linearGradient>`;
      return `<defs>
      <linearGradient id="bg${id}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${c.a}"/><stop offset=".55" stop-color="${c.b}"/><stop offset="1" stop-color="${c.c}"/>
      </linearGradient>
      <radialGradient id="lt${id}" cx="50%" cy="30%" r="62%">
        <stop offset="0" stop-color="rgba(255,255,255,.34)"/><stop offset="1" stop-color="rgba(255,255,255,0)"/>
      </radialGradient>${scDef}
    </defs>
    <rect width="200" height="${h}" fill="url(#bg${id})"/>
    <rect width="200" height="${h}" fill="url(#lt${id})"/>
    <circle cx="152" cy="${shadeY}" r="70" fill="rgba(0,0,0,.10)"/>
    <circle cx="34" cy="24" r="58" fill="rgba(251,246,236,.05)"/>
    ${speckle}
    <g transform="translate(0 ${Math.round(cy - 72)})">${emblem(c.emblem)}</g>
    ${foot}`;
    }

    function svgFor(category, code) {
      return `<svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">${foodScene(category, code, 150, true)}</svg>`;
    }

    /* ---------- 22. PRODUCT DATA ----------
       BACKEND HOOK: replace PRODUCTS with a fetch() from your API.
       Prices are base GBP; weight options carry their own gbp price. */
    const PRODUCTS = [
      {
        id: 'ofada', code: '0247', name: 'Ofada Rice', category: 'Grains & Beans', featured: true,
        desc: 'Heritage unpolished local rice with a deep, earthy aroma.',
        long: 'Short-grain heritage rice grown in the south-west, left unpolished to keep its nutrients and signature earthy aroma. Sorted by hand and stone-free — perfect with ayamase sauce.',
        weights: [{ label: '1kg', gbp: 12.50 }, { label: '2.5kg', gbp: 28.00 }, { label: '5kg', gbp: 52.00 }]
      },
      {
        id: 'honey-beans', code: '0312', name: 'Honey Beans (Oloyin)', category: 'Grains & Beans', featured: true,
        desc: 'Naturally sweet brown beans, sorted and stone-free.',
        long: 'Sweet, tender oloyin beans that cook down soft and creamy. Triple-sorted so there are no stones — ready for moi moi, ewa agoyin or porridge.',
        weights: [{ label: '1kg', gbp: 9.00 }, { label: '2.5kg', gbp: 20.00 }, { label: '5kg', gbp: 37.00 }]
      },
      {
        id: 'garri', code: '0158', name: 'Ijebu Garri', category: 'Grains & Beans', featured: false,
        desc: 'Fine, sour-fermented cassava garri for cold soaking.',
        long: 'Authentic Ijebu garri — finely grated, well-fermented and crisp. Ideal for soaking cold with groundnuts, or turning into a smooth eba.',
        weights: [{ label: '1kg', gbp: 7.50 }, { label: '3kg', gbp: 19.00 }]
      },
      {
        id: 'egusi', code: '0401', name: 'Ground Egusi', category: 'Spices & Seasonings', featured: true,
        desc: 'Melon seeds, cleaned and milled for rich, thick soups.',
        long: 'Premium melon seeds, shelled, cleaned and freshly milled — no fillers. Gives egusi soup its signature richness and body.',
        weights: [{ label: '500g', gbp: 10.50 }, { label: '1kg', gbp: 19.00 }]
      },
      {
        id: 'ogbono', code: '0402', name: 'Ground Ogbono', category: 'Spices & Seasonings', featured: false,
        desc: 'Wild mango seed, milled for silky, drawing soups.',
        long: 'Wild mango (ogbono) seeds ground fresh for that smooth, drawing texture. A little goes a long way — sealed to keep the oils fresh.',
        weights: [{ label: '250g', gbp: 11.00 }, { label: '500g', gbp: 20.00 }]
      },
      {
        id: 'crayfish', code: '0510', name: 'Ground Crayfish', category: 'Dried & Smoked', featured: true,
        desc: 'Sun-dried crayfish, finely milled for deep umami.',
        long: 'Whole crayfish, sun-dried and finely milled into a fragrant powder that adds deep, savoury umami to soups, stews and sauces.',
        weights: [{ label: '200g', gbp: 9.50 }, { label: '500g', gbp: 21.00 }]
      },
      {
        id: 'catfish', code: '0522', name: 'Dried Catfish', category: 'Dried & Smoked', featured: false,
        desc: 'Smoked catfish, cleaned and ready for pepper soup.',
        long: 'Whole catfish, gutted, cleaned and gently smoked until firm. Ready to drop straight into pepper soup, banga or stew.',
        weights: [{ label: '2 pieces', gbp: 14.00 }, { label: '4 pieces', gbp: 26.00 }]
      },
      {
        id: 'pepper-soup', code: '0405', name: 'Pepper Soup Spice', category: 'Spices & Seasonings', featured: false,
        desc: 'Hand-blended aromatic mix for classic pepper soup.',
        long: 'A warming, aromatic blend of traditional pepper soup spices — uda, uziza, calabash nutmeg and more. Balanced so you just add and simmer.',
        weights: [{ label: '100g', gbp: 6.50 }, { label: '250g', gbp: 14.00 }]
      },
      {
        id: 'suya', code: '0408', name: 'Suya Spice (Yaji)', category: 'Spices & Seasonings', featured: true,
        desc: 'Smoky-peppery groundnut spice blend for suya.',
        long: 'The real yaji — roasted groundnut, chilli, ginger and secret spices blended for that unmistakable smoky suya kick. Great on meat, chips and more.',
        weights: [{ label: '100g', gbp: 6.00 }, { label: '250g', gbp: 13.00 }]
      },
      {
        id: 'palm-oil', code: '0601', name: 'Red Palm Oil (Zomi)', category: 'Palm & Cooking Oils', featured: true,
        desc: 'Rich, unadulterated red palm oil, cold-clarified.',
        long: 'Pure, unadulterated red palm oil with a deep colour and clean taste. Cold-clarified and bottled for shipping — no additives, no dilution.',
        weights: [{ label: '500ml', gbp: 8.00 }, { label: '1L', gbp: 13.00 }, { label: '2L', gbp: 24.00 }]
      },
      {
        id: 'groundnut-oil', code: '0602', name: 'Groundnut Oil', category: 'Palm & Cooking Oils', featured: false,
        desc: 'Pure cold-pressed groundnut oil for frying.',
        long: 'Cold-pressed groundnut oil with a light, nutty flavour and high smoke point — ideal for frying akara, chin chin and everyday cooking.',
        weights: [{ label: '1L', gbp: 11.50 }, { label: '2L', gbp: 21.00 }]
      },
      {
        id: 'chin-chin', code: '0701', name: 'Chin Chin', category: 'Snacks', featured: false,
        desc: 'Crunchy fried pastry bites, lightly sweet.',
        long: 'Golden, crunchy chin chin fried in small batches and lightly sweetened. Sealed fresh so it stays crisp all the way to your door.',
        weights: [{ label: '250g', gbp: 5.50 }, { label: '500g', gbp: 10.00 }]
      },
      {
        id: 'plantain-chips', code: '0702', name: 'Plantain Chips', category: 'Snacks', featured: true,
        desc: 'Thin, crisp plantain chips — salted or peppered.',
        long: 'Green plantains sliced thin and fried crisp. Naturally sweet with a savoury edge — the perfect anytime snack.',
        weights: [{ label: '150g', gbp: 4.50 }, { label: '400g', gbp: 10.00 }]
      },
      {
        id: 'plantain-flour', code: '0210', name: 'Plantain Flour (Elubo)', category: 'Provisions', featured: false,
        desc: 'Smooth unripe plantain flour for amala.',
        long: 'Unripe plantains dried and milled into a fine flour for smooth, satisfying amala. Sifted for a lump-free swallow every time.',
        weights: [{ label: '1kg', gbp: 8.00 }, { label: '2kg', gbp: 15.00 }]
      },
      {
        id: 'iru', code: '0215', name: 'Locust Beans (Iru)', category: 'Provisions', featured: false,
        desc: 'Fermented locust beans for authentic soup depth.',
        long: 'Traditional fermented locust beans (iru) that bring a deep, savoury base to efo riro, ewedu and native soups. Cleaned and sealed for freshness.',
        weights: [{ label: '150g', gbp: 6.00 }, { label: '300g', gbp: 11.00 }]
      },
      {
        id: 'bitter-leaf', code: '0218', name: 'Dried Bitter Leaf', category: 'Provisions', featured: false,
        desc: 'Washed and dried bitter leaf for efo & soups.',
        long: 'Bitter leaf, thoroughly washed to balance the bitterness, then dried and packed. Rehydrate and drop into your soup — no lengthy prep.',
        weights: [{ label: '100g', gbp: 5.00 }, { label: '250g', gbp: 11.00 }]
      }
    ];

    const CATEGORIES = ['Grains & Beans', 'Spices & Seasonings', 'Dried & Smoked', 'Palm & Cooking Oils', 'Snacks', 'Provisions'];

    /* Testimonials data */
    const TESTIMONIALS = [
      { stars: 5, text: 'The egusi tasted exactly like my mum&rsquo;s. I actually teared up cooking it in my London flat.', name: 'Amara O.', loc: 'London, UK' },
      { stars: 5, text: 'Ordered ofada and palm oil to Toronto. Sealed perfectly, arrived fast, no fake oil nonsense.', name: 'Tunde A.', loc: 'Toronto, CA' },
      { stars: 5, text: 'Their market run saved me. Sent a list, got everything cleaned and packed. Stress-free.', name: 'Ngozi E.', loc: 'Houston, US' }
    ];

    /* ---------- 23. CART STATE (in-memory, session only) ----------
       BACKEND HOOK: persist cart to server / localStorage as needed. */
    let cart = []; // {id, weightLabel, qty, gbp}

    function cartQtyTotal() { return cart.reduce((n, l) => n + l.qty, 0); }
    function cartSubtotalGBP() { return cart.reduce((s, l) => s + l.gbp * l.qty, 0); }

    function addToCart(id, weightLabel, qty) {
      const product = PRODUCTS.find(p => p.id === id);
      const w = product.weights.find(w => w.label === weightLabel) || product.weights[0];
      const existing = cart.find(l => l.id === id && l.weightLabel === w.label);
      if (existing) { existing.qty += qty; }
      else { cart.push({ id, weightLabel: w.label, qty, gbp: w.gbp }); }
      updateCartUI(true);
      showToast(`${product.name} added to cart`);
    }
    function setLineQty(index, qty) {
      if (qty <= 0) { cart.splice(index, 1); } else { cart[index].qty = qty; }
      updateCartUI();
    }
    function removeLine(index) { cart.splice(index, 1); updateCartUI(); }

    /* ---------- 24. RENDER: product cards ---------- */
    function productCardHTML(p) {
      const from = Math.min(...p.weights.map(w => w.gbp));
      return `<article class="card" data-id="${p.id}">
    <div class="card__media" data-open="${p.id}" tabindex="0" role="button" aria-label="View ${p.name}">
      ${svgFor(p.category, p.code)}
      <span class="card__cat">${p.category}</span>
      <span class="card__ship" title="Ships to UK, US, Canada" aria-hidden="true">ðŸ‡¬ðŸ‡§ðŸ‡ºðŸ‡¸ðŸ‡¨ðŸ‡¦</span>
    </div>
    <div class="card__body">
      <h3 class="card__name" data-open="${p.id}">${p.name}</h3>
      <p class="card__desc">${p.desc}</p>
      <div class="card__foot">
        <div class="card__price"><small>from</small>${formatPrice(from)}</div>
        <button class="add-btn" data-add="${p.id}" aria-label="Add ${p.name} to cart">
          <svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
        </button>
      </div>
    </div>
  </article>`;
    }

    function renderFeatured() {
      document.getElementById('featuredGrid').innerHTML =
        PRODUCTS.filter(p => p.featured).map(productCardHTML).join('');
    }

    /* ---------- 25. RENDER: shop grid with filter/sort/search ---------- */
    let activeFilter = 'All';
    function renderShop() {
      const q = (document.getElementById('searchInput').value || '').toLowerCase().trim();
      const sort = document.getElementById('sortSelect').value;
      let list = PRODUCTS.filter(p => {
        const matchCat = activeFilter === 'All' || p.category === activeFilter;
        const matchQ = !q || p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
        return matchCat && matchQ;
      });
      const priceOf = p => Math.min(...p.weights.map(w => w.gbp));
      if (sort === 'price-asc') list.sort((a, b) => priceOf(a) - priceOf(b));
      else if (sort === 'price-desc') list.sort((a, b) => priceOf(b) - priceOf(a));
      else if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));

      const grid = document.getElementById('shopGrid');
      const empty = document.getElementById('emptyState');
      const count = document.getElementById('resultCount');
      grid.innerHTML = list.map(productCardHTML).join('');
      empty.style.display = list.length ? 'none' : 'block';
      count.textContent = `${list.length} ${list.length === 1 ? 'product' : 'products'}` + (activeFilter !== 'All' ? ` · ${activeFilter}` : '');
    }

    function renderFilters() {
      const bar = document.getElementById('filterBar');
      const cats = ['All', ...CATEGORIES];
      bar.innerHTML = cats.map(c => `<button class="filter${c === activeFilter ? ' active' : ''}" data-filter="${c}">${c}</button>`).join('');
    }

    /* ---------- 26. RENDER: categories, quotes, footer, currency ---------- */
    function renderCategories() {
      const counts = {};
      CATEGORIES.forEach(c => counts[c] = PRODUCTS.filter(p => p.category === c).length);
      document.getElementById('catGrid').innerHTML = CATEGORIES.map(c => {
        return `<button class="cat-tile" data-cat="${c}">
      <svg class="cat-bg" viewBox="0 0 200 210" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${foodScene(c, 'CAT' + CATEGORIES.indexOf(c), 210, false)}</svg>
      <span class="cat-tile__name">${c}</span>
      <span class="cat-tile__count">${counts[c]} item${counts[c] !== 1 ? 's' : ''}</span>
    </button>`;
      }).join('');
    }

    function renderQuotes() {
      document.getElementById('quotesGrid').innerHTML = TESTIMONIALS.map(t => `
    <figure class="quote">
      <div class="quote__stars" aria-label="${t.stars} out of 5 stars">${'★'.repeat(t.stars)}</div>
      <blockquote><p>&ldquo;${t.text}&rdquo;</p></blockquote>
      <figcaption class="quote__who">
        <span class="avatar" aria-hidden="true">${t.name.charAt(0)}</span>
        <span><b>${t.name}</b><span>${t.loc}</span></span>
      </figcaption>
    </figure>`).join('');
    }

    function renderFooterCats() {
      document.getElementById('footerCats').innerHTML = CATEGORIES.map(c =>
        `<li><a href="#shop" data-cat-link="${c}">${c}</a></li>`).join('');
    }

    function renderCurrencyToggle() {
      document.getElementById('curToggle').innerHTML = Object.keys(CURRENCIES).map(c =>
        `<button data-cur="${c}" class="${c === currentCurrency ? 'active' : ''}">${c}</button>`).join('');
    }

    /* ---------- 27. RENDER: cart drawer ---------- */
    function updateCartUI(justAdded) {
      const total = cartQtyTotal();
      const countEl = document.getElementById('cartCount');
      countEl.textContent = total;
      countEl.classList.toggle('show', total > 0);
      if (justAdded) { countEl.classList.remove('bump'); void countEl.offsetWidth; countEl.classList.add('bump'); }
      document.getElementById('drawerCount').textContent = `${total} item${total !== 1 ? 's' : ''}`;

      const itemsEl = document.getElementById('drawerItems');
      const foot = document.getElementById('drawerFoot');
      if (!cart.length) {
        itemsEl.innerHTML = `<div class="cart-empty">
      <svg viewBox="0 0 24 24" fill="none"><path d="M3 3h2l.4 2M7 13h10l3.5-8H6.4M7 13L5.4 5M7 13l-2 4h12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <h3 style="color:var(--forest)">Your cart is empty</h3>
      <p>Add some taste of home to get started.</p></div>`;
        foot.style.display = 'none';
        return;
      }
      itemsEl.innerHTML = cart.map((l, i) => {
        const p = PRODUCTS.find(x => x.id === l.id);
        return `<div class="cart-line">
      <div class="cart-line__media">${svgFor(p.category, p.code)}</div>
      <div class="cart-line__info">
        <h4>${p.name}</h4>
        <div class="cart-line__meta">${l.weightLabel} · ${formatPrice(l.gbp)} each</div>
        <div class="cart-line__ctrl">
          <div class="mini-qty">
            <button data-dec="${i}" aria-label="Decrease quantity">−</button>
            <span>${l.qty}</span>
            <button data-inc="${i}" aria-label="Increase quantity">+</button>
          </div>
          <div class="cart-line__price">${formatPrice(l.gbp * l.qty)}</div>
        </div>
        <button class="cart-line__remove" data-remove="${i}">Remove</button>
      </div>
    </div>`;
      }).join('');
      foot.style.display = 'block';
      document.getElementById('drawerSubtotal').textContent = formatPrice(cartSubtotalGBP());
    }

    /* ---------- 28. PRODUCT MODAL ---------- */
    let modalState = { id: null, weight: null, qty: 1 };
    function openProduct(id) {
      const p = PRODUCTS.find(x => x.id === id);
      modalState = { id, weight: p.weights[0].label, qty: 1 };
      renderModal();
      const overlay = document.getElementById('productOverlay');
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      document.getElementById('productModal').querySelector('.modal__close').focus();
    }
    function closeProduct() {
      const overlay = document.getElementById('productOverlay');
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
    function currentModalPrice() {
      const p = PRODUCTS.find(x => x.id === modalState.id);
      const w = p.weights.find(w => w.label === modalState.weight);
      return w.gbp * modalState.qty;
    }
    function renderModal() {
      const p = PRODUCTS.find(x => x.id === modalState.id);
      document.getElementById('productModal').innerHTML = `
    <button class="modal__close" id="modalClose" aria-label="Close">
      <svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
    </button>
    <div class="modal__media">${svgFor(p.category, p.code)}</div>
    <div class="modal__body">
      <span class="modal__cat">${p.category}</span>
      <h2 id="modalTitle">${p.name}</h2>
      <p>${p.long}</p>
      <div class="modal__price" id="modalPrice">${formatPrice(currentModalPrice())}</div>
      <p class="opt-label">Choose size</p>
      <div class="weights" id="modalWeights">
        ${p.weights.map(w => `<button class="weight${w.label === modalState.weight ? ' active' : ''}" data-weight="${w.label}">${w.label} · ${formatPrice(w.gbp)}</button>`).join('')}
      </div>
      <p class="opt-label">Quantity</p>
      <div class="qty">
        <button id="mQtyMinus" aria-label="Decrease">−</button>
        <input type="number" id="mQty" value="${modalState.qty}" min="1" aria-label="Quantity">
        <button id="mQtyPlus" aria-label="Increase">+</button>
      </div>
      <button class="btn btn--primary btn--block btn--lg" id="modalAdd">
        Add to cart · <span id="modalAddPrice">${formatPrice(currentModalPrice())}</span>
      </button>
      <div class="ship-note">
        <svg viewBox="0 0 24 24" fill="none"><path d="M2 12h13V7h3l3 4v3h-2M4 12v4h2m9-4v4h-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="8" cy="17" r="1.6" stroke="currentColor" stroke-width="1.3"/><circle cx="17" cy="17" r="1.6" stroke="currentColor" stroke-width="1.3"/></svg>
        <span>Vacuum-sealed &amp; hygienically packed. Ships to the UK, USA, Canada &amp; worldwide with tracking.</span>
      </div>
    </div>`;
      // wire modal controls
      document.getElementById('modalClose').onclick = closeProduct;
      document.getElementById('modalWeights').querySelectorAll('.weight').forEach(b => {
        b.onclick = () => {
          modalState.weight = b.dataset.weight; refreshModalPrice();
          document.querySelectorAll('#modalWeights .weight').forEach(x => x.classList.remove('active')); b.classList.add('active');
        };
      });
      const qtyInput = document.getElementById('mQty');
      document.getElementById('mQtyMinus').onclick = () => { modalState.qty = Math.max(1, modalState.qty - 1); qtyInput.value = modalState.qty; refreshModalPrice(); };
      document.getElementById('mQtyPlus').onclick = () => { modalState.qty++; qtyInput.value = modalState.qty; refreshModalPrice(); };
      qtyInput.oninput = () => { modalState.qty = Math.max(1, parseInt(qtyInput.value) || 1); refreshModalPrice(); };
      document.getElementById('modalAdd').onclick = () => { addToCart(modalState.id, modalState.weight, modalState.qty); closeProduct(); };
    }
    function refreshModalPrice() {
      document.getElementById('modalPrice').textContent = formatPrice(currentModalPrice());
      document.getElementById('modalAddPrice').textContent = formatPrice(currentModalPrice());
    }

    /* ---------- 29. CHECKOUT SUMMARY ---------- */
    function renderCheckoutSummary() {
      const lines = document.getElementById('summaryLines');
      if (!cart.length) {
        lines.innerHTML = `<p style="color:var(--muted);font-size:.92rem">Your cart is empty. <a href="#shop" data-nav="shop" style="color:var(--terracotta);font-weight:700">Add items</a></p>`;
      } else {
        lines.innerHTML = cart.map(l => {
          const p = PRODUCTS.find(x => x.id === l.id);
          return `<div class="summary__line"><span>${p.name} · ${l.weightLabel} Ã— ${l.qty}</span><span class="manifest">${formatPrice(l.gbp * l.qty)}</span></div>`;
        }).join('');
      }
      document.getElementById('summaryTotal').textContent = formatPrice(cartSubtotalGBP());
    }

    /* ---------- 30. ROUTING ---------- */
    const PAGES = ['home', 'shop', 'about', 'runs', 'contact', 'checkout', 'success'];
    function showPage(name, push) {
      if (!PAGES.includes(name)) name = 'home';
      PAGES.forEach(p => document.getElementById('page-' + p).classList.toggle('active', p === name));
      document.querySelectorAll('.nav a').forEach(a => a.classList.toggle('active', a.dataset.nav === name));
      window.scrollTo({ top: 0, behavior: 'auto' });
      if (name === 'checkout') renderCheckoutSummary();
      if (name === 'shop') { renderShop(); }
      // close mobile menu
      document.getElementById('nav').classList.remove('open');
      document.getElementById('menuToggle').setAttribute('aria-expanded', 'false');
      if (push !== false && location.hash !== '#' + name) { history.pushState({}, '', '#' + name); }
      document.getElementById('main').focus?.();
    }

    /* ---------- 31. FORM VALIDATION HELPERS ---------- */
    function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
    function validateField(field) {
      const input = field.querySelector('input,select,textarea');
      let ok = input.value.trim() !== '';
      if (ok && input.type === 'email') ok = validEmail(input.value.trim());
      field.classList.toggle('show-err', !ok);
      input.classList.toggle('invalid', !ok);
      return ok;
    }
    function validateForm(form) {
      let ok = true;
      form.querySelectorAll('.field').forEach(f => {
        const input = f.querySelector('input,select,textarea');
        if (input && input.hasAttribute('required')) { if (!validateField(f)) ok = false; }
      });
      return ok;
    }
    function flash(el, msg, type) {
      el.textContent = msg; el.className = 'form-msg ' + type;
    }

    /* ---------- 32. TOAST ---------- */
    let toastTimer;
    function showToast(msg) {
      const t = document.getElementById('toast');
      document.getElementById('toastText').textContent = msg;
      t.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
    }

    /* ---------- 33. CART DRAWER open/close ---------- */
    function openCart() {
      document.getElementById('cartDrawer').classList.add('open');
      document.getElementById('cartDrawer').setAttribute('aria-hidden', 'false');
      document.getElementById('drawerScrim').classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeCart() {
      document.getElementById('cartDrawer').classList.remove('open');
      document.getElementById('cartDrawer').setAttribute('aria-hidden', 'true');
      document.getElementById('drawerScrim').classList.remove('open');
      document.body.style.overflow = '';
    }

    /* ---------- 34. INIT + EVENT WIRING ---------- */
    function rerenderPrices() {
      // re-render everything that shows a price when currency changes
      renderFeatured(); renderShop(); updateCartUI(); renderCheckoutSummary();
      if (document.getElementById('productOverlay').classList.contains('open')) renderModal();
      renderCurrencyToggle();
    }

    document.addEventListener('DOMContentLoaded', () => {
      document.getElementById('year').textContent = new Date().getFullYear();

      // Set up scroll animations
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

      document.querySelectorAll('.section, .page-hero, .footer').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
      });

      renderFeatured(); renderCategories(); renderQuotes();
      renderFilters(); renderShop(); renderFooterCats(); renderCurrencyToggle();
      updateCartUI();

      // About page visual
      document.getElementById('aboutVisual').innerHTML = svgFor('Provisions', 'STELLA');

      // Global click delegation
      document.addEventListener('click', (e) => {
        // nav links
        const nav = e.target.closest('[data-nav]');
        if (nav) { e.preventDefault(); showPage(nav.dataset.nav); return; }
        // category tile / footer cat link -> shop filtered
        const cat = e.target.closest('[data-cat]');
        if (cat) { activeFilter = cat.dataset.cat; renderFilters(); showPage('shop'); renderShop(); return; }
        const catLink = e.target.closest('[data-cat-link]');
        if (catLink) { e.preventDefault(); activeFilter = catLink.dataset.catLink; renderFilters(); showPage('shop'); renderShop(); return; }
        // open product modal
        const open = e.target.closest('[data-open]');
        if (open) { openProduct(open.dataset.open); return; }
        // quick add
        const add = e.target.closest('[data-add]');
        if (add) {
          const p = PRODUCTS.find(x => x.id === add.dataset.add);
          addToCart(p.id, p.weights[0].label, 1);
          add.classList.add('added'); setTimeout(() => add.classList.remove('added'), 900);
          return;
        }
        // filter buttons
        const f = e.target.closest('[data-filter]');
        if (f) { activeFilter = f.dataset.filter; renderFilters(); renderShop(); return; }
        // currency
        const cur = e.target.closest('[data-cur]');
        if (cur) { currentCurrency = cur.dataset.cur; rerenderPrices(); return; }
        // cart line controls
        const inc = e.target.closest('[data-inc]'); if (inc) { setLineQty(+inc.dataset.inc, cart[+inc.dataset.inc].qty + 1); return; }
        const dec = e.target.closest('[data-dec]'); if (dec) { setLineQty(+dec.dataset.dec, cart[+dec.dataset.dec].qty - 1); return; }
        const rm = e.target.closest('[data-remove]'); if (rm) { removeLine(+rm.dataset.remove); return; }
      });

      // keyboard: open product on Enter/Space for card media
      document.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-open]')) { e.preventDefault(); openProduct(e.target.dataset.open); }
        if (e.key === 'Escape') { closeProduct(); closeCart(); }
      });

      // header shadow on scroll + sticky
      const header = document.getElementById('header');
      window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 10));

      // mobile menu
      document.getElementById('menuToggle').addEventListener('click', () => {
        const nav = document.getElementById('nav');
        const open = nav.classList.toggle('open');
        document.getElementById('menuToggle').setAttribute('aria-expanded', open);
      });

      // cart open/close
      document.getElementById('cartBtn').addEventListener('click', openCart);
      document.getElementById('closeCart').addEventListener('click', closeCart);
      document.getElementById('drawerScrim').addEventListener('click', closeCart);
      document.getElementById('checkoutBtn').addEventListener('click', () => { closeCart(); showPage('checkout'); });

      // product overlay backdrop click
      document.getElementById('productOverlay').addEventListener('click', (e) => { if (e.target.id === 'productOverlay') closeProduct(); });

      // shop controls
      document.getElementById('searchInput').addEventListener('input', renderShop);
      document.getElementById('sortSelect').addEventListener('change', renderShop);

      // live-validate on blur
      document.querySelectorAll('form .field input,form .field select,form .field textarea').forEach(inp => {
        inp.addEventListener('blur', () => { const field = inp.closest('.field'); if (inp.hasAttribute('required')) validateField(field); });
      });

      /* ----- FORMS (simulate submit only) -----
         BACKEND HOOK: replace each handler body with a fetch() POST. */
      document.getElementById('newsForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('newsEmail');
        const msg = document.getElementById('newsMsg');
        if (!validEmail(email.value.trim())) { flash(msg, 'Please enter a valid email address.', 'err'); return; }
        flash(msg, 'You&rsquo;re on the list! Watch your inbox for fresh stock. ✓', 'ok');
        email.value = '';
      });

      document.getElementById('runForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target, msg = document.getElementById('runMsg');
        if (!validateForm(form)) { flash(msg, 'Please complete the highlighted fields.', 'err'); return; }
        flash(msg, 'Request received! We&rsquo;ll reply with a quote shortly. ✓', 'ok');
        form.reset();
      });

      document.getElementById('contactForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target, msg = document.getElementById('contactMsg');
        if (!validateForm(form)) { flash(msg, 'Please complete the highlighted fields.', 'err'); return; }
        flash(msg, 'Message sent! We usually reply within a few hours. ✓', 'ok');
        form.reset();
      });

      document.getElementById('checkoutForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target, msg = document.getElementById('checkoutMsg');
        if (!cart.length) { flash(msg, 'Your cart is empty — add items before checking out.', 'err'); return; }
        if (!validateForm(form)) { flash(msg, 'Please complete the highlighted fields.', 'err'); return; }
        // simulate order placement
        const ref = 'KF-' + Math.floor(100000 + Math.random() * 900000);
        document.getElementById('orderRef').textContent = 'ORDER #' + ref;
        cart = []; updateCartUI();
        form.reset();
        flash(msg, '', 'ok');
        showPage('success');
      });

      // routing from hash (deep-link + back button)
      window.addEventListener('popstate', () => showPage((location.hash || '#home').slice(1), false));
      const initial = (location.hash || '#home').slice(1);
      showPage(PAGES.includes(initial) ? initial : 'home', false);
    });
