/* ==========================================================
   DATA — edit this file, not the markup.
   ========================================================== */
window.SITE = {
  profile: {
    name: 'Julia Arena',
    role: 'Product Designer',
    location: 'Buenos Aires, AR',
    email: 'juliaarena@hotmail.com',
    phone: '+54 9 11 6231 0873',
    domain: 'tu-usuario.github.io',
    availability: 'Open for select projects',

    /* copia web del retrato (el .jpg original de 1.2MB se usa para exportar,
       la página usa este webp de ~300KB con los mismos píxeles) */
    portrait: '/images/portrait-web.webp',
    /* el cilindro del hero (al lado de "I CREATE"): la primera entrada es la
       imagen que va adentro. Va el retrato, recortado al pill con la cara
       centrada (ver `.chip img` en el CSS: object-position). */
    heroChips: ['/images/portrait-web.webp', '/images/shiro-ai/2.jpg'],

    /* Watermark text. It is painted ONLY on the copy that the browser's own
       right-click → "Open image in a new tab" hands over (and the same goes for
       "Save image as" and "Copy image"): the drum gallery, the detail panel and
       the files on disk all keep showing the artwork clean. Leave it empty ('')
       and the browser hands over the untouched file. */
    watermark: '© Julia Arena',

    socials: {
      linkedin: 'https://www.linkedin.com/in/julia-arena/',
    },
  },

  /* The detail panel shows this instead of the old Category/Material/Colour
     block. One body of text, eight lines, body typography, left aligned.
     Any single gallery piece can override it with its own `body` field. */
  galleryBody:
    'Painted slowly, in layers, with the grain\n' +
    'of the canvas left visible. The colour is\n' +
    'built up rather than mixed, so the surface\n' +
    'keeps changing as you move past it.\n' +
    'What reads as one field up close is a\n' +
    'hundred small decisions. Nothing here was\n' +
    'planned to look finished — it was left\n' +
    'where it felt honest.',

  projects: [
    {
      id: 'zeigo-eac',
      name: 'Zeigo EAC',
      title: ['Zeigo EAC'],
      featured: true,
      category: 'Product Design',
      tags: ['Product design', 'UX & UI', 'Design systems'],
      year: '2025',
      /* sector pills, shown in the meta sheet next to the year */
      metaTags: ['B2B', 'E-commerce', 'Energy tech', 'Sustainability'],
      client: 'Schneider Electric',
      role: 'Lead Product Designer',
      services: 'Product Design, UX/UI Design, Design Systems',
      imgs: [
        '/images/zeigo-eac/cover-zeigo-eac.jpg',
        /* the order-placement pair, shown as the duo under "The problem" */
        '/images/zeigo-eac/order-placement-path-zeigo-eac.png',
        '/images/zeigo-eac/order-placement-path-2-zeigo-eac.png',
        '/images/zeigo-eac/3.jpg',
        /* el mockup que va debajo de "The outcome": el original es un PNG de
           16MB a 4000x3000, asi que la copia web es un webp de 1.1MB con los
           mismos pixeles a tamano de pantalla (SSIM 0.99). El PNG y el .psd
           quedan en el respaldo del Desktop, no se suben al sitio */
        '/images/zeigo-eac/mockup-zeigo-eac.webp',
        '/images/zeigo-eac/5.jpg',
      ],
      /* el par de "The problem" va SIN recorte: así se ven las dos capturas
         completas, sin el zoom del parallax que les comía los bordes. */
      duoNoCrop: true,
      /* the image right under "the brief" — falls back to imgs[3] when absent.
         `?v=` busts the cache: the file keeps its name when it is replaced */
      briefImg: '/images/zeigo-eac/purchase-opportunity-zeigo-eac.png?v=2',
      intro:
        'Making clean energy certificates affordable and accessible to small businesses worldwide.',
      challenge:
        '<b>Renewable energy shouldn’t be a privilege reserved for big corporations.</b>\n\n' +
        'Not every business can install solar panels or generate its own clean power. So companies buy <b>Energy Attribute Certificates</b> (EACs). Buying them is how a business backs renewable energy and meets its <b>sustainability goals.</b>\n\n' +
        'But the market was built for big players. EACs were sold in huge multi-MWh volumes, at prices small businesses couldn’t reach, and deals happened through direct contact with suppliers, often by phone. Large corporations had dedicated teams for this. <b>Smaller businesses were left out.</b>',
      approach:
        "I led the product design of Zeigo EAC end to end, from the initial concept to post-launch iterations. Here's what I created: a <b>simple marketplace</b> where any <b>business can purchase any amount of MWh,</b> no matter how small or large.\n\n" +
        'I translated complex energy information into clear charts and summaries, helping buyers make <b>quick,</b> confident decisions without requiring technical knowledge.\n\n' +
        'A flow built on trust. Users enter their bank details to make high-value purchases, so I paid close attention to <b>clarity</b> and every pixel to make the experience feel safe and reliable.\n\n' +
        'Last but not least, I created a design system and established a structured handoff process. I made Figma the single source of truth for documentation, <b>reducing implementation errors and maintaining design quality</b> across large teams.',
      /* the video under "the move": it starts on its own as soon as the section
         comes into view (see bindVideos), keeps looping, and carries the native
         controls (pause, scrub, fullscreen). The poster is the video's own FIRST
         FRAME (a still at 1216x1080), so nothing jumps when playback begins;
         bump `?v=` when the file is replaced under the same name */
      moveVideo: {
        src: '/images/zeigo-eac/Schneider-Electric-Zeigo-EAC-video.mp4?v=2',
        poster: '/images/zeigo-eac/poster-zeigo-eac.webp',
      },
      outcome:
        '<b>Zeigo EAC launched as a global platform where any small business can buy renewable energy certificates:</b> no phone calls, no minimum volume, no dedicated team. Many small buyers add up to complete each Purchase Opportunity, so even the smallest company can take part in the clean energy transition.',
      takeaway:
        "This project taught me that <b>great product design is about making complex things feel simple and trustworthy.</b> In a high-value marketplace, every interaction matters: users need to understand what they're buying, feel confident sharing sensitive information, and trust the process from start to finish. It also showed me the importance of design ownership, clear collaboration and systems that maintain quality as a product grows.",
      stats: [
        ['250+', 'Businesses onboarded'],
        ['1,000,000+', 'MWh purchased'],
        ['85%', 'Purchase opportunities completed'],
      ],
    },
    {
      id: 'zeigo-network',
      name: 'Zeigo Network',
      title: ['Zeigo Network'],
      featured: false,
      category: 'Product Design',
      tags: ['Web design', 'Design system', 'Sustainability'],
      year: '2025',
      /* sector pills, shown in the meta sheet next to the year */
      metaTags: ['B2B', 'SaaS', 'Energy tech', 'Enterprise'],
      client: 'Schneider Electric',
      role: 'Product Designer',
      services: 'Product Design, UX/UI Design, Design Systems',
      imgs: [
        '/images/zeigo-network/cover-zeigo-network.jpg',
        /* el par que se ve debajo de "The problem": 1194x1492 = exactamente 4:5,
           que es la proporción del marco, así que no se recorta nada */
        '/images/zeigo-network/decarbonization-feature-zeigo-network-2.png',
        '/images/zeigo-network/decarbonization-feature-zeigo-network-3.png',
        '/images/zeigo-network/1.jpg',
        /* el mockup que va debajo de "The outcome", igual que en Zeigo EAC: tu
           PNG original (16MB, 4000x3000) no se toca, la web usa la copia .webp
           que se genera al lado con los mismos pixeles y el mismo tamaño */
        '/images/zeigo-network/mockup-zeigo-network.webp',
        '/images/zeigo-network/5.jpg',
      ],
      /* el par de "The problem" va SIN recorte: así se ven las dos capturas
         completas, sin el zoom del parallax que les comía los bordes. */
      duoNoCrop: true,
      /* la imagen que va justo debajo de "The brief" — si no está, cae en
         imgs[3]. Mismo patrón EXACTO que la de Zeigo EAC: mismo bloque, mismo
         tamaño (full-bleed 16:9) y mismo parallax. `?v=` rompe la caché cuando
         se reemplaza el archivo manteniendo el mismo nombre. Acá el archivo se
         reemplazó (478KB -> 397KB), por eso lleva `?v=2`. */
      briefImg: '/images/zeigo-network/decarbonization-feature-zeigo-network.png?v=2',
      intro:
        'Turning scattered sustainability goals into one clear plan of action.',
      challenge:
        'Zeigo Network helps companies on their decarbonization journey with learning resources, a community and a marketplace of renewable energy and green technology providers.\n\n' +
        '<b>But learning isn’t the same as doing.</b> Companies’ sustainability efforts lived in spreadsheets, emails and internal systems. <b>Without one place to see them, it was hard to track projects, measure their impact and decide what to do next.</b>',
      approach:
        '<b>I designed Decarbonization Initiatives,</b> a feature that gives companies one place to <b>define, track and manage every current and planned sustainability project.</b>\n\n' +
        'I created a <b>clear visual dashboard</b> where teams can see each project’s status, assign owners and measure progress toward their carbon reduction targets.\n\n' +
        'Behind the screens, I defined the data structure: the fields, initiative types and tracking states that turn scattered goals into an actionable plan.\n\n' +
        'Zeigo Network was already a large, mature platform, so I designed everything with its existing components and patterns. <b>The new feature feels like it was always part of the product.</b>',
      /* El video de "The move": usa EXACTAMENTE el mismo reproductor que Zeigo
         EAC (misma clase .case__vid, mismos controles, loop, mudo y arranque
         automático al entrar en pantalla). Todo video nuevo se agrega con esta
         misma forma: `moveVideo: { src }` y, si se quiere un póster propio, `poster`.
         El póster es el PRIMER FRAME del video, así no queda un rectángulo negro
         mientras carga. El archivo original de 72MB quedó en el respaldo; la web
         usa esta copia liviana de 18MB (los originales nunca se tocan). */
      moveVideo: {
        src: '/images/zeigo-network/Schneider-electric-zeigo-network-video-web.mp4',
        poster: '/images/zeigo-network/poster-zeigo-network.webp',
      },
      outcome:
        '<b>Zeigo Network users now have a single command center to move from learning to doing:</b> every initiative, its status, its owner and its impact in one view. Scattered ambition became measurable action.',
      takeaway:
        '<b>This project taught me that great features don’t just add something new: they fit.</b> Designing inside a large, mature product means respecting its patterns while still solving a real problem. It also showed me that a clear data structure is what <b>turns a dashboard into action.</b>',
      stats: [
        ['120+', 'Initiatives tracked'],
        ['35%', 'Less time spent on reporting'],
        ['100%', 'Initiative visibility'],
      ],
    },
    {
      id: 'shiro-ai',
      name: 'Shiro AI',
      title: ['Shiro AI'],
      featured: true,
      category: 'Software Design',
      tags: ['Software', 'Artificial intelligence', 'Product design'],
      year: '2026',
      /* sector pills, shown in the meta sheet next to the year */
      metaTags: ['B2B (SMB)', 'SaaS', 'Retail tech', 'AI-powered'],
      client: 'Personal — Julia Arena',
      role: 'Founder & Lead Product Designer',
      services: 'Product Design, UX/UI Design, AI Product, Vibe Coding',
      imgs: [
        '/images/shiro-ai/cover-shiro-ai.jpg',
        /* el par que se ve debajo de "The problem". `?v=` en el segundo porque
           ese archivo se reemplazó manteniendo el nombre: sin eso, el navegador
           seguiría mostrando el viejo desde la caché. */
        '/images/shiro-ai/dashboard-shiro-ai-3.jpg',
        '/images/shiro-ai/agregar-producto-shiro-ai.jpg?v=2',
        '/images/shiro-ai/2.jpg',
        /* el mockup que va debajo de "The outcome", igual que en Zeigo EAC y
           Zeigo Network: tu PNG original (16.9MB, 4000x3000) no se toca, la web
           usa la copia .webp que se genera al lado con los mismos pixeles */
        '/images/shiro-ai/mockup-shiro-ai.webp',
        '/images/shiro-ai/5.jpg',
      ],
      /* el par de "The problem" va SIN recorte: esas dos capturas son altas
         (1194x1979) y el marco estándar del par es 4:5, así que se veían cortadas
         a lo largo. Con esto se muestran enteras, con su proporción real. */
      duoNoCrop: true,
      /* La imagen que va justo debajo de "The brief". Si el campo no está, el
         caso cae en imgs[3]. Mismo patrón que Zeigo EAC y Zeigo Network: si algún
         día se reemplaza el archivo manteniendo el mismo nombre, hay que subir el
         ?v= de la ruta para romper la caché del navegador.
         (Dato: este archivo se llama .jpg pero por dentro es un PNG; todos los
         navegadores lo decodifican igual, no hay nada que arreglar.) */
      briefImg: '/images/shiro-ai/dashboard-shiro-ai-2-web.webp',
      intro:
        'An AI that runs the corner store for you, so small shops in Argentina sell more and lose less.',
      challenge:
        '<b>Argentina’s neighborhood shops,</b> from kioscos to small supermarkets known as “chinos”, are the heart of every barrio. But most run on basic software that only scans barcodes and charges.\n\n' +
        '<b>Owners have no clear view of what sells, what sits on the shelf, or what is about to expire.</b> They restock by memory and by phone. Every expired, unsold or missing product is money lost. Big chains have tools for this. Small shops don’t.',
      approach:
        'I created this product with a developer partner. <b>We are the founders, the owners.</b> I was the Lead Product Designer, and he was the Lead Developer. We used vibe coding to go from idea to a working product fast.\n\n' +
        '<b>We built it for the market we know best.</b> We are loyal customers of these shops, so we saw what they needed every day.\n\n' +
        'First, the platform replaces the barcode software. Shop owners scan products and charge directly in it, so <b>every sale feeds their data automatically.</b>\n\n' +
        'Then I designed a live dashboard that shows how sales are going, how much the business has improved, plus best sellers and products that don’t move.\n\n' +
        '<b>This is where the AI comes in.</b> For slow products and items close to expiring, it analyzes the shop and suggests what to do, like a 2x1 or 70% off the second unit. It also watches stock levels, and when something runs low, it contacts the registered suppliers and places the order for you.',
      /* El video de "The move": usa EXACTAMENTE el mismo reproductor que Zeigo
         EAC (clase .case__vid, controles, loop, mudo, y arranque automático al
         entrar en pantalla). Todo video nuevo se agrega con esta misma forma:
         `moveVideo: { src }` y, si se quiere un póster propio, `poster`. */
      moveVideo: {
        src: '/images/shiro-ai/Shiro_AI-web.mp4',
        poster: '/images/shiro-ai/poster-shiro-ai.webp',
      },
      outcome:
        '<b>A shop that practically runs itself.</b> Owners see sales, profits and losses in one place, cut waste from unsold and expired products, and never run out of what sells.',
      takeaway:
        'Building this from zero taught me to own a product from the first idea to the last pixel. Designing for people I actually know made every decision sharper. And I learned that <b>the best AI doesn’t just show data: it takes action for the user.</b>',
      stats: [
        ['24/7', 'AI-powered business monitoring'],
        ['100%', 'Automated sales tracking'],
        ['3-in-1', 'Sales, inventory & AI recommendations'],
      ],
    },
    {
      id: 'luna-care',
      name: 'Luna Care',
      title: ['Luna Care'],
      featured: true,
      category: 'App Design',
      tags: ['App', 'Product design', 'Design system'],
      year: '2025',
      /* sector pills, shown in the meta sheet next to the year */
      metaTags: ['B2C', 'Healthtech', 'Mobile apps', 'Digital health'],
      client: 'Luna Care Inc.',
      role: 'Product Designer',
      services: 'Product Design, UX/UI Design',
      imgs: [
        '/images/luna-care/cover-luna-care.jpg',
        '/images/luna-care/1.jpg',
        '/images/luna-care/2.jpg',
        '/images/luna-care/3.jpg',
        '/images/luna-care/4.jpg',
        '/images/luna-care/5.jpg',
      ],
      /* La foto grande de abajo de "The brief": 1920x1080, así que entra exacta en
         el marco 16/9 que ya usaba la imagen de antes (sin recortar nada). */
      briefImg: '/images/luna-care/luna-physical-therapy-appointment-web.webp',
      /* Los dos premios Indigo de Luna Care: van debajo del texto del brief, uno
         abajo del otro, dorado y plateado, con un trofeo simple al costado. `tier`
         elige el color (ver --gold / --silver en el CSS). Los dos llevan a la ficha
         pública del premio, que abre en pestaña aparte. */
      awards: [
        {
          tier: 'gold',
          label: 'Gold Winner in Mobile App',
          href: 'https://www.indigoaward.com/winners/2639',
        },
        {
          tier: 'silver',
          label: 'Silver Winner in UX, Interface & Navigation',
          href: 'https://www.indigoaward.com/winners/2639',
        },
      ],
      intro:
        'Making at-home physical therapy work seamlessly for patients and therapists.',
      challenge:
        'Physical therapy has traditionally meant going to a clinic. Traffic, distance and waiting lists <b>made it difficult for patients to stay consistent</b> with their treatment, <b>with 70% never completing it.</b> Therapists faced challenges of their own: long working days, constant travel and administrative tasks, while over 50% experienced work-related pain.\n\n' +
        '<b>Luna set out to change this model by bringing physical therapy directly to patients’ homes.</b> But making that work required more than connecting two sides of a service. <b>Most patients were seniors,</b> which meant designing an accessible, intuitive experience that accommodated their needs and made technology easier to navigate. At the same time, therapists needed a completely different set of tools to manage their schedules, patients and daily work.',
      /* Debajo de "The problem": las DOS capturas de ejercicios, una AL LADO de la
         otra (cada una entera, con su proporción 16:9 y sin recortes, así que se ven
         más chicas que las fotos a todo el ancho). */
      problemImgs: [
        '/images/luna-care/luna-physical-therapy-exercises-1-web.webp',
        '/images/luna-care/luna-physical-therapy-exercises-2-web.webp',
      ],
      /* the extra section: a block like "the problem" plus two shots under it.
         Put the two image paths in `shots` when they are ready — while they are
         empty the page shows a placeholder box so nothing breaks. */
      apps: {
        title: 'The two apps',
        /* Las frases en bold de este texto llevan al App Store (en pestaña
           aparte): pacientes y terapeutas. Solo esas frases son link; el texto
           que va debajo de cada imagen, no. */
        body: '<a href="https://apps.apple.com/us/app/luna-physical-therapy/id1434554640#information" target="_blank" rel="noopener"><b>Luna Physical Therapy is for patients.</b></a> They book at-home sessions, message their therapist, follow their treatment plan, do personalized exercises (Luna Exercises) and track their recovery.\n\n' +
          '<a href="https://apps.apple.com/us/app/luna-therapist/id1426058220" target="_blank" rel="noopener"><b>Luna Therapist is for physical therapists.</b></a> They set their availability, receive patients, plan their routes, complete clinical documentation and manage their visits and earnings.\n\n' +
          '<b>Two apps, two types of users, one connected service.</b>',
        /* Las dos apps: íconos de 200x200 (el tamaño lo fija el CSS), cada uno es
           un link al App Store que abre en pestaña aparte, y debajo va su título
           (que NO es link). OJO: los archivos que estaban en disco se llaman
           igual pero SIN extensión, y un servidor no sabe servirlos como imagen
           (GitHub Pages los bloquearía). Por eso se apunta a las copias idénticas
           con `.webp` que están al lado; los originales quedaron intactos. */
        shots: [
          {
            src: '/images/luna-care/luna-physical-therapy-app.webp',
            caption: 'Luna Physical Therapy App for Patients',
            link: 'https://apps.apple.com/us/app/luna-physical-therapy/id1434554640#information',
          },
          {
            src: '/images/luna-care/luna-therapist-app.webp',
            caption: 'Luna Therapist App for Therapists',
            link: 'https://apps.apple.com/us/app/luna-therapist/id1426058220',
          },
        ],
      },
      approach:
        'I joined Luna mid-project as a Product Designer, replacing the designer who had originally started it. I took ownership of both apps, improving existing experiences and designing new features while keeping the products moving forward.\n\n' +
        '<b>I worked across both apps,</b> refining individual screens, flows and interactions as new needs and usability issues came up. I redesigned the exercise screens to make following and completing prescribed routines clearer and easier, <b>especially for an older audience.</b> I redesigned the scheduling experience, improving how therapists viewed and managed their calendars and appointments.\n\n' +
        '<b>The real challenge was understanding both apps as parts of one service.</b> When a patient books a session, the therapist needs to receive it, organize their schedule, make the visit and document the treatment. I approached each improvement with both sides of that experience in mind.',
      /* El video de "The move": EXACTAMENTE el mismo reproductor y las mismas
         condiciones que el de Zeigo EAC (la clase .case__vid, controles, mudo, en
         loop y arranque automático al entrar en pantalla — ver `bindVideos`), y
         también arranca a bufferizar solo un rato después de cargar la página.
         El póster es el PRIMER FRAME del propio video, así no salta nada cuando
         empieza a reproducirse (igual que en Zeigo EAC).
         OJO: el archivo original se llama "FINAL Luna Video.mp4" (con espacios y
         57 MB, 2860x1602 a 60fps): la web usa la copia liviana
         `luna-care-video-web.mp4` que está al lado (1920 de ancho, 60fps como los
         otros videos del sitio, con faststart para que arranque sin bajar el
         archivo entero). Pesa 2,9 MB contra 57 MB del original, con SSIM 0.997.
         El original queda intacto, no se toca ni se renombra. */
      moveVideo: {
        src: '/images/luna-care/luna-care-video-web.mp4',
        poster: '/images/luna-care/poster-luna-care.webp',
      },
      outcome:
        'Improved key patient and therapist workflows, making exercise routines easier to follow and appointment management more intuitive. <b>Contributed to a more accessible and consistent experience across both apps.</b>',
      /* Debajo de "The outcome": UNA sola foto grande, como estaba antes de las dos
         capturas del App Store (1920x1080, en el marco 16/9 de siempre): el
         calendario del terapeuta. */
      outcomeImg: '/images/luna-care/luna-therapist-calendar-web.webp',
      takeaway:
        'Joining a project halfway taught me to respect what’s already built, <b>understand the reasons behind past decisions, and improve it without breaking the experience.</b> Designing two apps for one service also taught me to think in systems: every screen on one side shapes the other.',
      stats: [
        ['85,000+', 'patients'],
        ['3,000+', 'therapists'],
        ['1.2M+', 'in-home visits'],
        ['99.7%', 'patient satisfaction'],
        ['88', 'NPS'],
      ],
    },
    {
      id: 'zeigo-eac-landing',
      name: 'Zeigo EAC Landing',
      title: ['Zeigo EAC Landing'],
      category: 'Web Design',
      tags: ['Landing page', 'Web design', 'AI product'],
      year: '2025',
      /* sector pills, shown in the meta sheet next to the year */
      metaTags: ['B2B', 'Energy tech', 'Web design', 'Conversion'],
      client: 'Schneider Electric',
      role: 'Lead Product Designer',
      services: 'Product Design, UX/UI Design',
      imgs: [
        '/images/zeigo-eac-landing/cover-zeigo-eac-landing.jpg',
        /* el par que se ve debajo de "The problem" */
        '/images/zeigo-eac-landing/zeigo-eac-landing-complete-web.webp',
        '/images/zeigo-eac-landing/faq-zeigo-eac-landing-web.webp',
        '/images/zeigo-eac-landing/3.jpg',
        /* el mockup que va debajo de "The outcome", igual que en los otros
           proyectos: tu PNG original (16.3MB, 4000x3000) no se toca, la web usa
           la copia .webp que se genera al lado */
        '/images/zeigo-eac-landing/mockup-zeigo-eac-landing.webp',
        '/images/zeigo-eac-landing/5.jpg',
      ],
      /* el par de "The problem" va SIN recorte: esas dos capturas son muy altas
         (1194x3320 y 1194x2098) y el marco estándar del par es 4:5, así que se
         verían cortadas a lo largo. Con esto se muestran enteras. */
      duoNoCrop: true,
      /* la imagen que va justo debajo de "The brief" — si no está, cae en imgs[3].
         Mismo patrón que los otros proyectos: si se reemplaza el archivo
         manteniendo el nombre, subir `?v=` para romper la caché. (Ojo: ese archivo
         se llama .jpg pero por dentro es un PNG; los navegadores lo decodifican
         igual, no hay nada que arreglar.) */
      briefImg: '/images/zeigo-eac-landing/zeigo-eac-landing-web.webp',
      intro:
        'Turning a complex energy marketplace into a first impression anyone understands.',
      challenge:
        'Zeigo EAC is a marketplace where small and medium businesses can buy renewable energy certificates (EACs), in any quantity. <b>A great product, but a hard one to explain.</b>\n\n' +
        'EACs are a complex, unfamiliar concept, and buying them is a high-stakes decision. Visitors had to understand what the product is, why it matters to them and why they could trust it, all in their first few seconds on the page. <b>We made the product, now we had to sell it!</b>',
      approach:
        'I designed the landing page to do one thing well: <b>make the idea click.</b>\n\n' +
        'I started by simplifying the core value proposition, so any small business can understand in seconds how it can access renewable energy certificates. To go deeper, I designed an extensive FAQ section that addressed common questions, clarified how the product works and <b>helped visitors understand the details before getting started.</b>',
      /* El video de "The move": usa EXACTAMENTE el mismo reproductor que Zeigo
         EAC (clase .case__vid, controles, loop, mudo, y arranque automático al
         entrar en pantalla). Todo video nuevo se agrega con esta misma forma:
         `moveVideo: { src }` y, si se quiere un póster propio, `poster`. */
      moveVideo: {
        src: '/images/zeigo-eac-landing/Schneider-Electric-Zeigo-EAC-landing-video-web.mp4',
        poster: '/images/zeigo-eac-landing/poster-zeigo-eac-landing.webp',
      },
      outcome:
        'Zeigo EAC now has a landing page that explains a complex marketplace clearly and builds trust from the first scroll, giving small businesses a <b>simple way into the platform.</b>',
      takeaway:
        '<b>A landing page is a first impression: if people don’t understand it in seconds, nothing else matters.</b> This project taught me to cut everything until only what matters is left, to design trust as carefully as clarity, and to build structures that can grow with the product.',
      stats: [
        ['1', 'Clear proposition'],
        ['EACs', 'Made understandable'],
        ['Trust', 'Built into every step'],
      ],
    },
    {
      id: 'beyond-web-design',
      /* `name` is how the project is listed everywhere outside the case (work
         index, home, meta, JSON-LD); `title` is what the case page itself is
         called. They differ here on purpose. */
      name: 'Beyond Web Design...',
      title: ['My Art'],
      featured: false,
      category: 'Art',
      tags: ['Art', 'Experiments', 'Personal work'],
      year: '∞',
      /* sector pills, shown in the meta sheet next to the year */
      metaTags: ['Oil painting', 'Acrylic painting', 'Artist', 'Hand-painted'],
      client: 'Personal — Julia Arena',
      role: 'Artist',
      services: 'Traditional Painting',
      imgs: [
        '/images/beyond-web-design/cover-beyond-web-design.jpg',
        '/images/beyond-web-design/1.jpg',
        '/images/beyond-web-design/2.jpg',
        '/images/beyond-web-design/3.jpg',
        '/images/beyond-web-design/4.jpg',
        '/images/beyond-web-design/5.jpg',
      ],
      intro:
        "A little different from the rest — this isn't a Product Design or UX/UI project, but a reflection of something much more personal: my passion for painting and my way of expressing myself beyond design. A collection of personal explorations through paint, texture, color and symbolism — from oil portraits and expressive acrylics to mixed-media experiments, playful compositions and pieces that each hold a story of their own.",
      /* barrel gallery — the piece list for this case study. Having this array
         is what makes the gallery render instead of the single brief image.
         `thumb` is the light copy the drum draws (a card is only ~330px wide);
         `shots` holds the full-size files, which is what the detail panel opens.
         Regenerating a thumb under the same name needs a `?v=` bump here. */
      gallery: [
        {
          title: 'Sumergida',
          code: 'oil painting',
          thumb: '/images/beyond-web-design/sumergida-oil-painting-1-thumb.webp',
          shots: [
            '/images/beyond-web-design/sumergida-oil-painting-1.jpg',
            '/images/beyond-web-design/sumergida-oil-painting-2.jpg',
          ],
          body: `Sumergida was the first oil painting I ever created. Painted on a 60 × 50 cm canvas, it marked my <b>first experience working with oils and my first attempt at realistically portraying the human figure</b>.

Learning to work with this medium while developing the skills to capture a realistic human form was a challenging but rewarding process. It took me an entire year to complete, and to this day, it remains <b>my favorite painting</b>.`,
        },
        {
          title: 'Three of swords',
          code: 'acrylic painting',
          thumb: '/images/beyond-web-design/three-of-swords-acrylic-painting-1-thumb.webp',
          shots: [
            '/images/beyond-web-design/three-of-swords-acrylic-painting-1.jpg',
            '/images/beyond-web-design/three-of-swords-acrylic-painting-2.jpg',
          ],
          body: `Three of Swords was my first exploration of texture in painting. I had developed a particularly intense surface and wanted to make that texture the focal point of the piece. To do so, I chose a tarot card I consider <b>deeply powerful and emotionally charged</b>: the Three of Swords.

The card held a very personal meaning for me at the time. I felt it reflected exactly what I was experiencing and the emotions I was going through. In tarot, the Three of Swords represents an encounter with <b>pain, crisis, or a confronting truth</b> — an experience that disrupts and reshapes the emotional landscape.

Through this painting, I wanted to translate that <b>intensity</b> into a tangible visual experience.`,
        },
        {
          title: 'Kai',
          code: 'acrylic painting',
          thumb: '/images/beyond-web-design/kai-acrylic-painting-1-thumb.webp',
          shots: [
            '/images/beyond-web-design/kai-acrylic-painting-1.jpg',
            '/images/beyond-web-design/kai-acrylic-painting-2.jpg',
          ],
          body: `Kai was a gift for some very dear friends of mine. I decided to paint their Doberman, Kaia, who, as you can imagine, holds a very special place in their family. The painting was created to celebrate their new home and give them a little piece of myself through something they truly love: their dog.

Working with acrylics, <b>I explored texture through a two-dimensional approach</b>, experimenting with layers and brushstrokes to bring the painting to life. Their home has a particularly warm atmosphere, so I wanted the piece to feel naturally at home within that environment. One of the biggest challenges was <b>achieving the right balance of colors</b>, as warm lighting tends to give paintings a yellowish cast and can alter how colors are perceived.`,
        },
        {
          title: 'Derby',
          code: 'oil painting',
          /* lienzo circular: se muestra redondo en la galeria y en el detalle */
          shape: 'circle',
          /* el lienzo original es un PNG de 2.5MB: el mismo cuadro en webp pesa
             476KB y conserva la transparencia (alfa) del lienzo circular */
          thumb: '/images/beyond-web-design/derby-acrylic-painting-1-thumb.webp',
          shots: ['/images/beyond-web-design/derby-acrylic-painting-1.webp'],
          body: `Derby was another one of my early explorations with oil paints, this time on a 20 cm diameter circular canvas. I never quite finished it, but I find something special in its unfinished state. It holds a certain essence: <b>detailed yet incomplete</b>, with an almost geometric quality that gives it a beauty of its own.

<b>Will I ever finish it? Maybe yes, maybe not.</b> Either way, I love this piece, and I particularly enjoy working on circular canvases. There's something about their shape that makes the painting process feel different.`,
        },
        {
          title: 'As above so below',
          code: 'acrylic painting',
          thumb: '/images/beyond-web-design/As-above-so-below-acrylic-painting-1-thumb.webp',
          shots: [
            '/images/beyond-web-design/As-above-so-below-acrylic-painting-1.jpg',
            '/images/beyond-web-design/As-above-so-below-acrylic-painting-2.jpg',
            '/images/beyond-web-design/As-above-so-below-acrylic-painting-3.jpg',
          ],
          body: `As Above, So Below is a <b>collage-style painting</b> that I absolutely love. It took me quite a long time to complete because of the level of detail and the sheer number of individual drawings that make up the piece.

My intention was to create something you could <b>spend a long time looking at, always discovering something new</b>: a hidden detail, an unexpected drawing, or a small element that sparks curiosity and keeps you entertained. Even I sometimes forget about certain details and rediscover them, which is one of my favorite things about this piece.

I combined several techniques and materials, including acrylic paint, POSCA markers, spray paint, tarot card cutouts, and pieces of shiny paper. The composition is filled with <b>symbolic references</b>, particularly to tarot and pop art.

It's one of my favorite pieces, and I love how much there is to explore within it.`,
        },
        {
          title: 'Lindsay',
          code: 'oil pastels',
          thumb: '/images/beyond-web-design/lindsay-oil-pastels-1-thumb.webp',
          shots: ['/images/beyond-web-design/lindsay-oil-pastels-1.jpg'],
          body: `Lindsay is an oil pastel drawing I made as a gift for one of my closest friends, portraying her beloved dog, Lindsay.

I love working with <b>oil pastels</b> for their versatility and how easily they blend and soften, allowing me to create <b> smooth transitions and expressive textures</b>. I feel I was able to capture Lindsay's personality and likeness beautifully.

It's a piece that holds a very special place in my heart.`,
        },
        {
          title: 'Rodeo',
          code: 'acrylic painting',
          /* lienzo rectangular: se respeta la proporcion real, no el 3/4 */
          shape: 'rect',
          thumb: '/images/beyond-web-design/rodeo-acrylic-painting-thumb.webp',
          shots: ['/images/beyond-web-design/rodeo-acrylic-painting.jpg'],
          body: `Rodeo is a large-scale acrylic painting on a 92 × 88 cm canvas. Texture was once again part of my exploration, but this time I approached it differently: I cut pieces of fabric from an old canvas and incorporated them directly into the painting, <b>creating a layered, tactile surface</b>.

I wanted to make a piece for my home that was <b>unapologetically pink, bold, and impossible to overlook</b>. At the same time, I wanted the central character to remain relatively small within the composition, creating an interesting contrast between the scale of the canvas and the figure itself.

Maybe I painted myself into this one. Who knows? All I knew was that I wanted a very pink painting.

<i>I'm just a girl.</i>`,
        },
        {
          title: 'L.A.',
          code: 'acrylic painting',
          /* rectangular, como el lienzo real */
          shape: 'rect',
          thumb: '/images/beyond-web-design/L-A-acrylic-painting-1-thumb.webp',
          /* una sola imagen: la galeria no dibuja puntos ni rota con una sola */
          shots: ['/images/beyond-web-design/L-A-acrylic-painting-1.jpg'],
          body: `L.A. is an acrylic painting on a 90 × 70 cm canvas. I wanted it to be bold and capture my own interpretation of the stereotypical Los Angeles girl — or at least the image of her I've built from the outside looking in.

This was my first time experimenting with <b>freehand negative painting</b>. Instead of painting the figure directly, I built her image by painting away the negative spaces, allowing her silhouette, features and details to emerge through the contrast. I paid particular attention to the shadows and, of course, to giving my character a little hyaluronic acid in her lips (haha).

To finish it off, I added <b>graffiti details to the background</b>, bringing another layer of personality to the composition. I absolutely love this painting. I could look at it all day.`,
        },
      ],
    },
  ],

  services: [
    {
      name: 'Product & UX',
      count: 'UX-01',
      desc: 'The thinking that happens before the pretty part: research, user flows, wireframes and prototypes. I like to get the plan right before anyone starts arguing about colours.',
      chips: [
        'User flows',
        'Wireframing',
        'Prototyping',
        'UX audits',
        'Information architecture',
      ],
    },
    {
      name: 'Interfaces & Systems',
      count: 'UI-02',
      desc: 'Interfaces built to last — proper design systems with reusable components and clear rules, so things still look right years (and several content editors) later.',
      chips: [
        'UI design',
        'Design systems',
        'Tokens',
        'Component libraries',
        'Accessibility',
      ],
    },
    {
      name: 'Motion & Interaction',
      count: 'MO-03',
      desc: "Movement with a point. Transitions that help you understand the page, hovers that feel good, scrolling that tells a story. If an animation isn't doing a job, it doesn't make the cut.",
      chips: [
        'Interaction design',
        'Micro-interactions',
        'GSAP direction',
        'Scroll choreography',
      ],
    },
    {
      name: 'Art Direction',
      count: 'AD-04',
      desc: 'The taste layer: typography, imagery and layout that make a brand feel like itself on every screen — bold where it counts, quiet where it should be.',
      chips: ['Typography', 'Layout systems', 'Image direction', 'Brand-in-UI'],
    },
    {
      name: 'Vibe Coding',
      count: 'VC-05',
      desc: 'Turning ideas into working prototypes with AI-powered tools — bridging design and code to bring digital experiences to life, faster and with creative control.',
      chips: ['AI-assisted development', 'Rapid prototyping', 'Front-end iteration', 'Design-to-code'],
    },
  ],

  principles: [
    {
      name: 'Motion should mean something',
      count: 'PR-01',
      desc: "Animation is a way of explaining things. Every movement should guide your eye or make something clearer. If it's only there to look nice, I cut it.",
      chips: ['Purposeful motion', 'Scroll choreography', 'Micro-reward'],
    },
    {
      name: 'Build things that last',
      count: 'PR-02',
      desc: 'A nice-looking page is a moment; a solid system lasts for years. I design components and rules that survive rebrands and new people joining the team.',
      chips: ['Design tokens', 'Components', 'Documentation'],
    },
    {
      name: 'Taste is a skill',
      count: 'PR-03',
      desc: 'Craft adds up. Typography, spacing, imagery — the details nobody points to are the ones everybody feels. I work on them every single day.',
      chips: ['Typography', 'Rhythm', 'Art direction'],
    },
    {
      name: 'Win the room, protect the user',
      count: 'PR-04',
      desc: 'Years of working with big organisations taught me the real trick: getting bold ideas approved without watering down the thing that made them good.',
      chips: ['Stakeholders', 'UX advocacy', 'Diplomacy'],
    },
  ],

};
