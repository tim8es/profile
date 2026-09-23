(() => {
  const html = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const state = {
    lang: localStorage.getItem("portfolio-lang") || "en",
    llm: null,
    llmState: "idle",
    llmProgress: 0,
    llmQueue: Promise.resolve(),
  };

  const copy = {
    en: {
      demo: "04 / Hybrid candidate",
      nav: { work:"Work", query:"Query", about:"About" },
      hero: {
        eyebrow:"Product builder / process thinker",
        title:"Build.<br><span>Automate.</span><br>Simplify.",
        lede:"I turn vague problems and awkward processes into small working products — with AI, automation and code.",
        meta:["Product → prototype","AI-native workflow","Hands-on builder"]
      },
      field: {
        title:"Capability field",
        hint:"drag / move / click",
        buttons:["AI","Automation","Product","Agents"]
      },
      query: {
        title:"Portfolio Query",
        intro:"Ask me about Timur, his work, projects, product approach or technical decisions.",
        suggestions:[
          ["Who is Timur?","Who is Timur?"],
          ["What do you build?","What do you build?"],
          ["AI work","Show me AI work"],
          ["Background","What's your background?"]
        ],
        placeholder:"Ask the portfolio…",
        hint:'Runs in your browser. Retrieval always works locally; on compatible desktops a micro-LLM is loaded in the background. Press <kbd>/</kbd> to focus.',
        unknown:"I don't have a confident local answer for that yet. Try asking about Timur, TubeScore, FeedPulse, AI, automation, product thinking, stack or background.",
        rolePortfolio:"portfolio",
        roleYou:"you",
        showProject:"Show related project ↓",
        deeper:"Choose what you want to dig into about"
      },
      ai: {
        loading:"micro-LLM loading",
        ready:"micro-LLM ready / on-device",
        fallback:"local retrieval / WebGPU unavailable",
        saving:"local retrieval / data saver",
        failed:"local retrieval / AI unavailable"
      },
      work: {
        title:"Selected work",
        note:"current shortlist / more projects will be curated later",
        tube:{
          kind:"Browser product",
          desc:"A Chrome extension that places movie ratings directly on YouTube trailers, removing the extra search step.",
          details:[["Problem","Ratings live outside the viewing context."],["Built","Extension, data layer, caching and SPA handling."],["Proof","Working MVP with automated browser tests."]],
          ask:"Ask deeper about TubeScore →"
        },
        feed:{
          kind:"Agent utility",
          desc:"A small ingestion layer for AI agents that normalizes RSS/Atom sources into predictable content.",
          details:[["Problem","Agents repeatedly need to parse inconsistent feeds."],["Built","Portable Node.js parser with a small dependency footprint."],["Proof","Cross-platform workflow for Windows, macOS and Linux."]],
          ask:"Ask deeper about FeedPulse →"
        }
      },
      about: {
        title:"About",
        note:"less biography / more operating principle",
        statement:"I like software that removes friction instead of adding another system people have to manage.",
        body:[
          "My background is in project and process management, so I usually start from the workflow, constraint or user problem — not from the technology.",
          "Now I work hands-on: prototypes, AI agents, APIs, browser tools, automation and small products that can be tested quickly."
        ]
      },
      footer:["Timur Dautov © 2026","Built as a static page. Query, micro-LLM and 3D field run locally in your browser."],
      deep:{
        tube:[
          ["Architecture","How is TubeScore built?"],
          ["Hardest part","What was the hardest part of TubeScore?"],
          ["Testing","How did you test TubeScore?"]
        ],
        feed:[
          ["Architecture","How is FeedPulse built?"],
          ["Hardest part","What was the hardest part of FeedPulse?"],
          ["Why Node.js","Why Node for FeedPulse?"]
        ]
      }
    },
    ru: {
      demo: "04 / Гибридный вариант",
      nav: { work:"Работы", query:"Спросить", about:"Обо мне" },
      hero: {
        eyebrow:"Product builder / системное мышление",
        title:"Создаю.<br><span>Автоматизирую.</span><br>Упрощаю.",
        lede:"Превращаю размытые задачи и неудобные процессы в небольшие работающие продукты — с помощью AI, автоматизации и кода.",
        meta:["От задачи → к прототипу","AI-native подход","Делаю руками"]
      },
      field: {
        title:"Карта компетенций",
        hint:"двигай / тяни / нажимай",
        buttons:["ИИ","Автоматизация","Продукт","Агенты"]
      },
      query: {
        title:"Portfolio Query",
        intro:"Спроси о Тимуре, его работах, проектах, продуктовом подходе или технических решениях.",
        suggestions:[
          ["Кто такой Тимур?","Кто такой Тимур?"],
          ["Что ты делаешь?","Что ты делаешь?"],
          ["Работа с ИИ","Покажи работу с ИИ"],
          ["Опыт","Какой у тебя опыт?"]
        ],
        placeholder:"Спроси портфолио…",
        hint:'Работает в браузере. Локальный поиск доступен всегда; на совместимых ПК в фоне загружается микро-LLM. Нажми <kbd>/</kbd>, чтобы перейти к строке.',
        unknown:"У меня пока нет уверенного локального ответа на этот вопрос. Попробуй спросить про Тимура, TubeScore, FeedPulse, ИИ, автоматизацию, продуктовый подход, стек или опыт.",
        rolePortfolio:"портфолио",
        roleYou:"вы",
        showProject:"Показать связанный проект ↓",
        deeper:"Выбери, что хочется узнать подробнее про"
      },
      ai: {
        loading:"микро-LLM загружается",
        ready:"микро-LLM готова / на устройстве",
        fallback:"локальный поиск / WebGPU недоступен",
        saving:"локальный поиск / экономия трафика",
        failed:"локальный поиск / AI недоступен"
      },
      work: {
        title:"Избранные работы",
        note:"текущий список / проекты ещё будем отбирать",
        tube:{
          kind:"Браузерный продукт",
          desc:"Chrome-расширение, которое показывает рейтинги фильмов прямо на YouTube-трейлерах и убирает лишний переход на другой сайт.",
          details:[["Проблема","Рейтинг находится вне контекста просмотра."],["Что сделал","Расширение, слой данных, кеширование и обработка SPA-навигации."],["Подтверждение","Рабочий MVP с автоматизированными браузерными тестами."]],
          ask:"Спросить подробнее о TubeScore →"
        },
        feed:{
          kind:"Инструмент для агентов",
          desc:"Небольшой слой загрузки контента для AI-агентов, который приводит RSS/Atom-источники к предсказуемой структуре.",
          details:[["Проблема","Агентам снова и снова приходится разбирать несовместимые фиды."],["Что сделал","Переносимый Node.js-парсер с небольшим числом зависимостей."],["Подтверждение","Работает на Windows, macOS и Linux."]],
          ask:"Спросить подробнее о FeedPulse →"
        }
      },
      about: {
        title:"Обо мне",
        note:"меньше биографии / больше принципов работы",
        statement:"Мне нравится софт, который убирает трение, а не создаёт ещё одну систему, которой нужно управлять.",
        body:[
          "Мой основной бэкграунд — управление проектами и процессами, поэтому я обычно начинаю с рабочего процесса, ограничений и проблемы пользователя, а не с выбора технологии.",
          "Сейчас я много делаю руками: прототипы, AI-агенты, API, браузерные инструменты, автоматизацию и небольшие продукты, которые можно быстро проверить."
        ]
      },
      footer:["Timur Dautov © 2026","Статическая страница: Query, микро-LLM и 3D-поле работают локально в браузере."],
      deep:{
        tube:[
          ["Архитектура","Как устроен TubeScore?"],
          ["Самая сложная часть","Что было самым сложным в TubeScore?"],
          ["Тестирование","Как ты тестировал TubeScore?"]
        ],
        feed:[
          ["Архитектура","Как устроен FeedPulse?"],
          ["Самая сложная часть","Что было самым сложным в FeedPulse?"],
          ["Почему Node.js","Почему для FeedPulse выбран Node.js?"]
        ]
      }
    }
  };

  // Theme
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const savedTheme = localStorage.getItem("portfolio-theme");
  const preferredTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";

  function setTheme(theme) {
    html.dataset.theme = theme;
    localStorage.setItem("portfolio-theme", theme);
    themeToggle?.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
  }
  setTheme(savedTheme || preferredTheme);
  themeToggle?.addEventListener("click", () => setTheme(html.dataset.theme === "dark" ? "light" : "dark"));

  // Language
  const langToggle = document.querySelector("[data-lang-toggle]");
  const langLabel = document.querySelector("[data-lang-label]");

  function setText(selector, value) {
    const el = document.querySelector(selector);
    if (el && value != null) el.textContent = value;
  }
  function setHTML(selector, value) {
    const el = document.querySelector(selector);
    if (el && value != null) el.innerHTML = value;
  }

  function updateAiStatus() {
    const el = document.querySelector("[data-ai-status]");
    if (!el) return;
    const t = copy[state.lang].ai;
    el.classList.remove("ai-status-ready","ai-status-loading","ai-status-fallback");
    if (state.llmState === "ready") {
      el.textContent = t.ready;
      el.classList.add("ai-status-ready");
    } else if (state.llmState === "loading") {
      el.textContent = `${t.loading} ${Math.max(0,Math.min(100,Math.round(state.llmProgress)))}%`;
      el.classList.add("ai-status-loading");
    } else if (state.llmState === "save-data") {
      el.textContent = t.saving;
      el.classList.add("ai-status-fallback");
    } else if (state.llmState === "unsupported") {
      el.textContent = t.fallback;
      el.classList.add("ai-status-fallback");
    } else if (state.llmState === "failed") {
      el.textContent = t.failed;
      el.classList.add("ai-status-fallback");
    } else {
      el.textContent = state.lang === "ru" ? "локальный поиск / AI готовится…" : "local retrieval / preparing on-device AI…";
      el.classList.add("ai-status-loading");
    }
  }

  function applyLanguage(lang, resetChat = true) {
    state.lang = lang;
    html.lang = lang;
    localStorage.setItem("portfolio-lang", lang);
    if (langLabel) langLabel.textContent = lang.toUpperCase();
    langToggle?.setAttribute("aria-label", lang === "en" ? "Переключить на русский" : "Switch to English");
    const t = copy[lang];

    setText("[data-demo-label]", t.demo);
    setText('.nav-links a[href="#work"]', t.nav.work);
    setText('.nav-links a[href="#query"]', t.nav.query);
    setText('.nav-links a[href="#about"]', t.nav.about);

    setText(".hero .eyebrow", t.hero.eyebrow);
    setHTML(".hero h1", t.hero.title);
    setText(".hero-lede", t.hero.lede);
    document.querySelectorAll(".hero-meta span").forEach((el,i)=>{ if(t.hero.meta[i]) el.textContent=t.hero.meta[i]; });

    const fieldHeads = document.querySelectorAll(".field-head span");
    if (fieldHeads[0]) fieldHeads[0].textContent=t.field.title;
    if (fieldHeads[1]) fieldHeads[1].textContent=t.field.hint;
    document.querySelectorAll(".field-fallback button").forEach((el,i)=>{ if(t.field.buttons[i]) el.textContent=t.field.buttons[i]; });

    const querySection = document.getElementById("query");
    const queryLabels = querySection?.querySelectorAll(".section-label span");
    if (queryLabels?.[0]) queryLabels[0].textContent=t.query.title;
    document.querySelectorAll(".suggestions button").forEach((button,i)=>{
      const pair=t.query.suggestions[i];
      if(pair){button.textContent=pair[0];button.dataset.suggestion=pair[1];}
    });
    const qInput=document.querySelector("[data-query-input]");
    if(qInput) qInput.placeholder=t.query.placeholder;
    setHTML(".query-hint",t.query.hint);

    const workLabels=document.querySelectorAll("#work > .section-label span");
    if(workLabels[0]) workLabels[0].textContent=t.work.title;
    if(workLabels[1]) workLabels[1].textContent=t.work.note;

    const projectEls=[...document.querySelectorAll("[data-project]")];
    const projectCopies={tube:t.work.tube,feed:t.work.feed};
    projectEls.forEach((item)=>{
      const id=item.dataset.project;
      const p=projectCopies[id];
      if(!p)return;
      item.querySelector(".project-main small").textContent=p.kind;
      item.querySelector(".project-reveal p").textContent=p.desc;
      item.querySelectorAll(".project-reveal dl > div").forEach((block,i)=>{
        if(!p.details[i])return;
        block.querySelector("dt").textContent=p.details[i][0];
        block.querySelector("dd").textContent=p.details[i][1];
      });
      const ask=item.querySelector("[data-ask-project]");
      if(ask)ask.textContent=p.ask;
    });

    const aboutLabels=document.querySelectorAll("#about > .section-label span");
    if(aboutLabels[0])aboutLabels[0].textContent=t.about.title;
    if(aboutLabels[1])aboutLabels[1].textContent=t.about.note;
    setText(".about-statement",t.about.statement);
    document.querySelectorAll(".about-copy p").forEach((el,i)=>{if(t.about.body[i])el.textContent=t.about.body[i];});
    document.querySelectorAll(".footer span").forEach((el,i)=>{if(t.footer[i])el.textContent=t.footer[i];});

    document.title = lang === "ru" ? "Timur Dautov — Product Builder" : "Timur Dautov — Product Builder";
    updateAiStatus();

    if(resetChat) resetChatLog();
  }

  langToggle?.addEventListener("click",()=>applyLanguage(state.lang==="en"?"ru":"en",true));

  // Projects
  const projects=[...document.querySelectorAll("[data-project]")];
  function activateProject(id,expand=true){
    projects.forEach((item)=>{
      const active=item.dataset.project===id&&expand;
      item.classList.toggle("is-active",active);
      item.querySelector(".project-trigger")?.setAttribute("aria-expanded",String(active));
    });
  }
  projects.forEach((item)=>{
    const trigger=item.querySelector(".project-trigger");
    trigger?.addEventListener("click",()=>activateProject(item.dataset.project,!item.classList.contains("is-active")));
    if(window.matchMedia("(hover:hover) and (pointer:fine)").matches){
      item.addEventListener("mouseenter",()=>activateProject(item.dataset.project,true));
    }
  });

  // Local knowledge base
  const knowledge=[
    {
      id:"identity",
      aliases:["who is timur","who is timur dautov","tell me about timur","about timur","кто такой тимур","расскажи про тимура","кто такой тимур даутов","кто ты"],
      keywords:["timur","dautov","identity","person","тимур","даутов"],
      answer:{
        en:"Timur Dautov is a product and process manager who has moved increasingly into hands-on product building. He combines product thinking with AI tooling, automation, APIs and lightweight software development, usually starting from a concrete workflow or user problem rather than from a technology.",
        ru:"Тимур Даутов — менеджер проектов и процессов, который всё больше работает как hands-on product builder. Он сочетает продуктовое мышление с AI-инструментами, автоматизацией, API и разработкой небольших программных продуктов, обычно начиная не с технологии, а с конкретного процесса или проблемы пользователя."
      },project:null
    },
    {
      id:"overview",
      aliases:["what do you build","what does timur build","show work","what have you built","что ты делаешь","что строишь","что сделал"],
      keywords:["build","make","create","work","portfolio","products","projects","делаешь","проекты"],
      answer:{
        en:"I build small products and automations that remove friction from a workflow. The current shortlist includes browser tooling, agent utilities and AI-assisted process automation.",
        ru:"Я делаю небольшие продукты и автоматизации, которые убирают лишние действия из рабочих процессов. Сейчас в портфолио есть браузерные инструменты, утилиты для AI-агентов и решения для автоматизации."
      },project:null
    },
    {
      id:"tube-overview",
      aliases:["what is tubescore","tell me about tubescore","tubescore","что такое tubescore","расскажи про tubescore"],
      keywords:["tubescore","browser","chrome","youtube","movie","rating","extension","расширение"],
      answer:{
        en:"TubeScore is a Chrome extension that puts movie ratings directly on YouTube trailers. The goal is simple: remove the context switch to a separate ratings site while keeping the matching deterministic and the runtime lightweight.",
        ru:"TubeScore — Chrome-расширение, которое показывает рейтинг фильма прямо на странице YouTube с трейлером. Идея простая: убрать лишний переход на сайт с рейтингами, сохранив детерминированный матчинг и лёгкий runtime."
      },project:"tube"
    },
    {
      id:"tube-architecture",
      aliases:["tubescore architecture","how is tubescore built","why this architecture","architecture of tubescore","как устроен tubescore","архитектура tubescore"],
      keywords:["tubescore","architecture","mv3","wikidata","cache","spa","архитектура"],
      answer:{
        en:"TubeScore uses a Manifest V3 extension architecture with a content-script UI, service-worker orchestration and a provider seam for metadata. Matching is deterministic, ratings come from a policy-safe source, and caching plus concurrency controls keep lookups cheap.",
        ru:"TubeScore построен как Manifest V3 extension: UI работает через content script, оркестрация — через service worker, а источники метаданных подключаются через отдельный provider-слой. Матчинг детерминированный; кеширование и ограничение параллелизма уменьшают число запросов."
      },project:"tube"
    },
    {
      id:"tube-hard",
      aliases:["hardest part of tubescore","tubescore challenge","what was difficult in tubescore","что было самым сложным в tubescore","сложность tubescore"],
      keywords:["tubescore","hard","hardest","challenge","difficult","matching","youtube","spa","сложно"],
      answer:{
        en:"The difficult part was not drawing the badge — it was reliably identifying the right title from messy YouTube context and keeping the overlay correct across YouTube's SPA navigation without introducing an LLM or secret-bearing backend.",
        ru:"Сложность была не в том, чтобы нарисовать бейдж рейтинга, а в надёжном определении нужного фильма из неоднозначного контекста YouTube и в сохранении корректной работы overlay при SPA-навигации — без LLM и без backend с секретами."
      },project:"tube"
    },
    {
      id:"tube-test",
      aliases:["how did you test tubescore","tubescore testing","how is tubescore verified","как тестировал tubescore","тестирование tubescore"],
      keywords:["tubescore","test","testing","verify","playwright","smoke","qa","тест"],
      answer:{
        en:"TubeScore is verified with deterministic unit coverage plus an isolated Chromium/Playwright smoke flow that checks both initial overlay rendering and SPA navigation. That matters because a browser extension can look correct in code while failing in the actual page lifecycle.",
        ru:"TubeScore проверяется детерминированными тестами и изолированным Chromium/Playwright smoke-тестом, который покрывает первоначальное появление overlay и переходы внутри SPA. Для расширения это критично: код может выглядеть корректно, но ломаться в реальном lifecycle страницы."
      },project:"tube"
    },
    {
      id:"feed-overview",
      aliases:["what is feedpulse","tell me about feedpulse","feedpulse","что такое feedpulse","расскажи про feedpulse"],
      keywords:["feedpulse","rss","atom","feed","content","agent","agents","фид"],
      answer:{
        en:"FeedPulse is a lightweight ingestion utility for AI agents. It reads RSS/Atom sources, normalizes the material and returns predictable structured content so each agent does not need its own parser.",
        ru:"FeedPulse — лёгкая утилита для загрузки контента AI-агентами. Она читает RSS/Atom-источники, нормализует материалы и отдаёт предсказуемую структуру, чтобы каждому агенту не требовался собственный парсер."
      },project:"feed"
    },
    {
      id:"feed-architecture",
      aliases:["feedpulse architecture","how is feedpulse built","why node for feedpulse","как устроен feedpulse","почему node feedpulse"],
      keywords:["feedpulse","architecture","node","parser","xml","dependency","cross platform","архитектура"],
      answer:{
        en:"FeedPulse deliberately uses a small Node.js implementation with a focused XML parser instead of a heavy framework. The design goal is portability and a narrow dependency surface: easy to run on Windows, macOS or Linux and easy for another agent to invoke.",
        ru:"FeedPulse намеренно сделан как небольшая Node.js-утилита с узкоспециализированным XML-парсером вместо тяжёлого фреймворка. Цель — переносимость и минимум зависимостей: одинаковый запуск на Windows, macOS и Linux и простой вызов из другого агента."
      },project:"feed"
    },
    {
      id:"feed-hard",
      aliases:["hardest part of feedpulse","feedpulse challenge","what was difficult in feedpulse","что было самым сложным в feedpulse","сложность feedpulse"],
      keywords:["feedpulse","hard","challenge","inconsistent","rss","atom","normalize","сложно"],
      answer:{
        en:"The main design problem is inconsistency: feeds that are nominally similar often differ in namespaces, content fields, dates and embedded markup. The useful work is normalizing those differences without turning a tiny utility into a giant feed platform.",
        ru:"Главная проблема — неоднородность: формально похожие фиды различаются namespace, полями контента, датами и встроенной разметкой. Задача — нормализовать эти различия, не превращая маленькую утилиту в огромную feed-платформу."
      },project:"feed"
    },
    {
      id:"automation",
      aliases:["how do you automate processes","automation approach","tell me about automation","как автоматизируешь процессы","как ты автоматизируешь"],
      keywords:["automation","automate","process","workflow","n8n","webhook","api","manual","автоматизация","процесс"],
      answer:{
        en:"My automation approach starts with the process, not the tool: identify repeated decisions and handoffs, define inputs and success criteria, connect APIs or tools, then add validation and observability so the workflow is repeatable rather than merely automatic.",
        ru:"Мой подход к автоматизации начинается с процесса, а не с инструмента: найти повторяющиеся решения и handoff'ы, определить входы и критерии успеха, подключить API или инструменты, а затем добавить валидацию и наблюдаемость."
      },project:null
    },
    {
      id:"ai",
      aliases:["show me ai work","how do you use ai","ai work","tell me about ai","покажи работу с ии","как используешь ии","работа с ии"],
      keywords:["ai","llm","agent","agents","model","нейросеть","ии"],
      answer:{
        en:"I use LLMs mainly as components inside products and workflows: reasoning, classification, content processing and tool orchestration. I care more about the surrounding system — inputs, tools, checks and failure handling — than about a chat box by itself.",
        ru:"Я использую LLM в первую очередь как компонент продукта или процесса: для reasoning, классификации, обработки контента и оркестрации инструментов. Для меня важнее окружающая система — входы, инструменты, проверки и обработка ошибок, — чем сам по себе чат."
      },project:null
    },
    {
      id:"background",
      aliases:["what is your background","what's your background","tell me about your background","experience","career","какой у тебя опыт","расскажи про опыт","опыт"],
      keywords:["background","experience","manager","career","process","project","опыт","карьера"],
      answer:{
        en:"My background is in project and process management. That shapes how I build: I start from the user problem, workflow and constraint, then choose the smallest technical solution that can be tested quickly.",
        ru:"Мой основной бэкграунд — управление проектами и процессами. Поэтому я начинаю с проблемы пользователя, рабочего процесса и ограничений, а затем выбираю минимальное техническое решение, которое можно быстро проверить."
      },project:null
    },
    {
      id:"stack",
      aliases:["what stack do you use","technologies","technical stack","what tools do you use","стек","технологии","какие технологии"],
      keywords:["stack","technology","javascript","node","sql","api","webhook","github","tools","стек"],
      answer:{
        en:"The recurring stack is JavaScript / Node.js, browser APIs, REST APIs and webhooks, SQL, automation tooling, LLM tooling and GitHub. The stack is secondary to the product outcome, so it changes when a smaller solution is available.",
        ru:"Регулярно использую JavaScript / Node.js, browser API, REST API и webhooks, SQL, инструменты автоматизации, LLM-инструменты и GitHub. Стек вторичен по отношению к продуктовой задаче и меняется, если есть более простое решение."
      },project:null
    },
    {
      id:"product",
      aliases:["product thinking","how do you build products","mvp approach","product approach","продуктовый подход","как делаешь продукты"],
      keywords:["product","mvp","prototype","problem","user","hypothesis","продукт","гипотеза"],
      answer:{
        en:"I prefer a product-builder loop: understand the problem, cut scope hard, build the smallest useful version, expose it to reality, then keep, change or kill the hypothesis based on evidence.",
        ru:"Мне близок product-builder цикл: понять проблему, жёстко сократить scope, собрать минимальную полезную версию, столкнуть её с реальностью и затем оставить, изменить или закрыть гипотезу по данным."
      },project:null
    }
  ];

  const stopwords=new Set(["the","a","an","is","are","do","does","you","your","me","my","about","tell","show","what","how","who","of","to","and","or","in","на","про","что","как","кто","такой","мне","ты","у","тебя"]);
  const synonymGroups=[
    ["build","make","create","develop"],
    ["automation","automate","workflow","process"],
    ["ai","llm","model","agent","agents"],
    ["browser","chrome","extension"],
    ["test","testing","verify","validation","qa"],
    ["background","experience","career"]
  ];

  function norm(value){
    return String(value||"").toLowerCase().replace(/ё/g,"е").replace(/[^a-zа-я0-9\s-]/gi," ").replace(/\s+/g," ").trim();
  }
  function tokens(value){
    const out=new Set(norm(value).split(" ").filter((x)=>x&&!stopwords.has(x)));
    synonymGroups.forEach((group)=>{if(group.some((word)=>out.has(word)))group.forEach((word)=>out.add(word));});
    return out;
  }
  function trigrams(value){
    const s="  "+norm(value)+"  ",set=new Set();
    for(let i=0;i<s.length-2;i++)set.add(s.slice(i,i+3));
    return set;
  }
  function similarity(a,b){
    const A=trigrams(a),B=trigrams(b);
    if(!A.size||!B.size)return 0;
    let hit=0;A.forEach((x)=>{if(B.has(x))hit++;});
    return hit/(A.size+B.size-hit);
  }
  function scoreEntry(query,entry){
    const q=norm(query),qt=tokens(query);
    let score=0;
    entry.aliases.forEach((alias)=>{
      const a=norm(alias);
      if(q===a)score=Math.max(score,30);
      else if(q.includes(a)||a.includes(q))score=Math.max(score,16);
      score=Math.max(score,similarity(q,a)*12);
    });
    entry.keywords.forEach((keyword)=>{
      const k=norm(keyword);
      if(q.includes(k))score+=k.includes(" ")?5:3;
      tokens(k).forEach((token)=>{if(qt.has(token))score+=1.4;});
    });
    return score;
  }
  function rankKnowledge(query){
    return knowledge.map((entry)=>({entry,score:scoreEntry(query,entry)})).sort((a,b)=>b.score-a.score);
  }
  function fallbackAnswer(query){
    const ranked=rankKnowledge(query);
    if(!ranked[0]||ranked[0].score<3.1)return{answer:copy[state.lang].query.unknown,project:null,ranked};
    return{answer:ranked[0].entry.answer[state.lang],project:ranked[0].entry.project,ranked};
  }

  // Chat UI
  const chatLog=document.querySelector("[data-chat-log]");
  const form=document.querySelector("[data-query-form]");
  const input=document.querySelector("[data-query-input]");
  const suggestions=[...document.querySelectorAll("[data-suggestion]")];
  const askProjectButtons=[...document.querySelectorAll("[data-ask-project]")];

  function resetChatLog(){
    if(!chatLog)return;
    chatLog.innerHTML="";
    appendMessage("bot",copy[state.lang].query.intro,null,[],false);
  }

  function appendMessage(role,text,projectId,actions=[],scroll=true){
    if(!chatLog)return null;
    const row=document.createElement("div");
    row.className=`chat-message chat-message--${role}`;
    const roleEl=document.createElement("span");
    roleEl.className="chat-role";
    roleEl.textContent=role==="user"?copy[state.lang].query.roleYou:copy[state.lang].query.rolePortfolio;
    const bubble=document.createElement("div");
    bubble.className="chat-bubble";
    bubble.textContent=text;
    if(actions.length){
      const wrap=document.createElement("div");wrap.className="chat-actions";
      actions.forEach((action)=>{
        const button=document.createElement("button");button.type="button";button.textContent=action.label;
        button.addEventListener("click",()=>askPortfolio(action.query));
        wrap.appendChild(button);
      });
      bubble.appendChild(wrap);
    }
    if(projectId){
      const link=document.createElement("button");link.type="button";link.className="chat-project-link";link.textContent=copy[state.lang].query.showProject;
      link.addEventListener("click",()=>{
        activateProject(projectId,true);
        document.getElementById("work")?.scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"});
      });
      bubble.appendChild(document.createElement("br"));bubble.appendChild(link);
    }
    row.append(roleEl,bubble);chatLog.appendChild(row);
    if(scroll)chatLog.scrollTo({top:chatLog.scrollHeight,behavior:reduced?"auto":"smooth"});
    return{row,bubble};
  }

  function cyrillicRatio(text){
    const letters=(text.match(/[A-Za-zА-Яа-яЁё]/g)||[]).length;
    if(!letters)return 0;
    return (text.match(/[А-Яа-яЁё]/g)||[]).length/letters;
  }

  async function generateWithLLM(question,ranked){
    if(!state.llm||state.llmState!=="ready")return null;
    const useful=ranked.filter((x)=>x.score>=2.2).slice(0,4);
    if(!useful.length)return null;
    const facts=useful.map((x,i)=>`${i+1}. ${x.entry.answer[state.lang]}`).join("\n");
    const language=state.lang==="ru"?"Russian":"English";
    const system=`You are a tiny portfolio assistant for Timur Dautov. Answer ONLY from the FACTS below. Never invent projects, employers, metrics, dates, skills or claims. If the facts do not answer the question, say you do not have that information. Answer in ${language}. Keep it concise: 2-4 sentences, max 90 words.\n\nFACTS:\n${facts}`;
    try{
      const out=await state.llm([
        {role:"system",content:system},
        {role:"user",content:question}
      ],{max_new_tokens:110,do_sample:false,repetition_penalty:1.08});
      const generated=out?.[0]?.generated_text;
      let text="";
      if(Array.isArray(generated))text=generated.at(-1)?.content||"";
      else if(typeof generated==="string")text=generated;
      text=String(text||"").trim();
      if(!text||text.length<8)return null;
      if(state.lang==="ru"&&cyrillicRatio(text)<0.18)return null;
      return text;
    }catch(error){
      console.warn("Local LLM generation failed",error);
      return null;
    }
  }

  async function askPortfolio(query){
    const text=String(query||"").trim();
    if(!text)return;
    appendMessage("user",text);
    const local=fallbackAnswer(text);

    if(state.llmState!=="ready"||!local.ranked?.[0]||local.ranked[0].score<3.1){
      window.setTimeout(()=>appendMessage("bot",local.answer,local.project),reduced?0:80);
      return;
    }

    const pending=appendMessage("bot",state.lang==="ru"?"Формулирую ответ локально…":"Thinking locally…",null,[],true);
    state.llmQueue=state.llmQueue.then(async()=>{
      const llmAnswer=await generateWithLLM(text,local.ranked);
      if(!pending?.bubble)return;
      pending.bubble.textContent=llmAnswer||local.answer;
      if(local.project){
        const br=document.createElement("br");
        const link=document.createElement("button");link.type="button";link.className="chat-project-link";link.textContent=copy[state.lang].query.showProject;
        link.addEventListener("click",()=>{
          activateProject(local.project,true);
          document.getElementById("work")?.scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"});
        });
        pending.bubble.append(br,link);
      }
      chatLog?.scrollTo({top:chatLog.scrollHeight,behavior:reduced?"auto":"smooth"});
    }).catch(()=>{if(pending?.bubble)pending.bubble.textContent=local.answer;});
  }

  const deepQuestions=()=>{
    const d=copy[state.lang].deep;
    return{
      tube:d.tube.map(([label,query])=>({label,query})),
      feed:d.feed.map(([label,query])=>({label,query}))
    };
  };

  function openProjectQuestions(id){
    const name=id==="tube"?"TubeScore":"FeedPulse";
    appendMessage("user",state.lang==="ru"?`Спросить подробнее про ${name}`:`Ask deeper about ${name}`);
    appendMessage("bot",`${copy[state.lang].query.deeper} ${name}:`,null,deepQuestions()[id]||[]);
    document.getElementById("query")?.scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"});
  }

  form?.addEventListener("submit",(event)=>{
    event.preventDefault();askPortfolio(input?.value);if(input)input.value="";
  });
  suggestions.forEach((button)=>button.addEventListener("click",()=>askPortfolio(button.dataset.suggestion)));
  askProjectButtons.forEach((button)=>button.addEventListener("click",()=>openProjectQuestions(button.dataset.askProject)));
  document.addEventListener("keydown",(event)=>{
    const tag=document.activeElement?.tagName?.toLowerCase();
    const editing=tag==="input"||tag==="textarea"||document.activeElement?.isContentEditable;
    if(event.key==="/"&&!editing&&input){event.preventDefault();input.focus();}
  });

  // Background micro-LLM: progressive enhancement only.
  async function initMicroLLM(){
    if(!("gpu" in navigator)){
      state.llmState="unsupported";updateAiStatus();return;
    }
    if(navigator.connection?.saveData){
      state.llmState="save-data";updateAiStatus();return;
    }
    state.llmState="loading";state.llmProgress=0;updateAiStatus();
    try{
      const mod=await import("https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.0");
      mod.env.allowLocalModels=false;
      mod.env.useBrowserCache=true;
      state.llm=await mod.pipeline("text-generation","onnx-community/SmolLM2-135M-Instruct-ONNX",{
        device:"webgpu",
        dtype:"q4f16",
        progress_callback:(info)=>{
          if(info.status==="progress_total"&&Number.isFinite(info.progress)){
            state.llmProgress=info.progress;updateAiStatus();
          }
          if(info.status==="ready"){
            state.llmProgress=100;
          }
        }
      });
      state.llmState="ready";state.llmProgress=100;updateAiStatus();
    }catch(error){
      console.warn("Micro-LLM unavailable",error);
      state.llm=null;state.llmState="failed";updateAiStatus();
    }
  }

  // Capability field
  const canvas=document.querySelector("[data-field-canvas]");
  const fieldButtons=[...document.querySelectorAll("[data-field-query]")];
  fieldButtons.forEach((button)=>button.addEventListener("click",()=>{
    const q=button.dataset.fieldQuery;
    const mapping={
      AI:state.lang==="ru"?"Покажи работу с ИИ":"Show me AI work",
      automation:state.lang==="ru"?"Как ты автоматизируешь процессы?":"How do you automate processes?",
      product:state.lang==="ru"?"Расскажи про продуктовый подход":"Tell me about product thinking",
      agents:state.lang==="ru"?"Расскажи про AI-агентов":"Tell me about agents"
    };
    askPortfolio(mapping[q]||q);
    document.getElementById("query")?.scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"});
  }));

  const capabilityLabels={
    en:["AI","Agents","APIs","Automation","Product","Data","QA","Open source"],
    ru:["ИИ","Агенты","API","Автоматизация","Продукт","Данные","QA","Open source"]
  };

  if(canvas){
    const ctx=canvas.getContext("2d");
    if(ctx){
      const capabilities=[
        {x:-.62,y:-.5,query:{en:"Show me AI work",ru:"Покажи работу с ИИ"}},
        {x:-.12,y:-.68,query:{en:"Tell me about agents",ru:"Расскажи про AI-агентов"}},
        {x:.56,y:-.48,query:{en:"What stack do you use?",ru:"Какой стек ты используешь?"}},
        {x:-.58,y:.16,query:{en:"How do you automate processes?",ru:"Как ты автоматизируешь процессы?"}},
        {x:.06,y:.04,query:{en:"Tell me about product thinking",ru:"Расскажи про продуктовый подход"}},
        {x:.62,y:.22,query:{en:"What stack do you use?",ru:"Какие технологии ты используешь?"}},
        {x:-.18,y:.58,query:{en:"How did you test TubeScore?",ru:"Как ты тестировал TubeScore?"}},
        {x:.48,y:.66,query:{en:"What's your background?",ru:"Какой у тебя опыт?"}}
      ];
      let dpr=Math.min(window.devicePixelRatio||1,2),width=1,height=1;
      let rotX=-.78,rotZ=-.18,targetRotX=rotX,targetRotZ=rotZ;
      let pointer={x:0,y:0,inside:false,down:false,lastX:0,lastY:0};
      let hoverNode=-1,nodeScreens=[],time=0;

      function resize(){
        const rect=canvas.getBoundingClientRect();width=Math.max(1,rect.width);height=Math.max(1,rect.height);
        dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
        ctx.setTransform(dpr,0,0,dpr,0,0);
      }
      function colors(){
        const s=getComputedStyle(html);
        return{text:s.getPropertyValue("--text").trim(),muted:s.getPropertyValue("--muted").trim(),line:s.getPropertyValue("--line-strong").trim(),accent:s.getPropertyValue("--accent").trim()};
      }
      function baseHeight(x,y){return .13*Math.sin(x*4.1+time*.8)*Math.cos(y*3.4-time*.55);}
      function project(x,y,z){
        let yy=y*Math.cos(rotX)-z*Math.sin(rotX),zz=y*Math.sin(rotX)+z*Math.cos(rotX);
        let xx=x*Math.cos(rotZ)-yy*Math.sin(rotZ);const y2=x*Math.sin(rotZ)+yy*Math.cos(rotZ);
        const perspective=1/(1.55-zz*.32),scale=Math.min(width,height)*.72;
        return{x:width/2+xx*scale*perspective,y:height/2+y2*scale*.78*perspective,z:zz};
      }
      function interactiveHeight(x,y){
        const base=baseHeight(x,y);
        if(!pointer.inside)return base;
        const screen=project(x,y,base),dist=Math.hypot(screen.x-pointer.x,screen.y-pointer.y);
        const radius=Math.max(95,Math.min(width,height)*.28),d=dist/radius;
        if(d>1.35)return base;
        return base+Math.sin(d*9-time*3.2)*Math.exp(-d*2.9)*.22;
      }
      function draw(){
        const c=colors();ctx.clearRect(0,0,width,height);
        rotX+=(targetRotX-rotX)*.07;rotZ+=(targetRotZ-rotZ)*.07;
        if(!pointer.down&&!reduced)targetRotZ+=.0012;
        time+=reduced?0:.016;
        const n=18;ctx.lineWidth=1;
        for(let axis=0;axis<2;axis++){
          for(let i=0;i<n;i++){
            ctx.beginPath();
            for(let k=0;k<n;k++){
              const a=-1+(2*i)/(n-1),b=-1+(2*k)/(n-1),x=axis===0?a:b,y=axis===0?b:a,p=project(x,y,interactiveHeight(x,y));
              if(k===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);
            }
            ctx.strokeStyle=c.line;ctx.globalAlpha=.42;ctx.stroke();
          }
        }
        ctx.globalAlpha=1;
        nodeScreens=capabilities.map((cap,index)=>{
          const p=project(cap.x,cap.y,interactiveHeight(cap.x,cap.y)+.03),active=index===hoverNode;
          ctx.beginPath();ctx.arc(p.x,p.y,active?5.5:3.5,0,Math.PI*2);ctx.fillStyle=active?c.accent:c.text;ctx.fill();
          ctx.font=`${active?600:500} 10px ui-monospace, SFMono-Regular, Menlo, monospace`;
          ctx.fillStyle=active?c.accent:c.muted;ctx.fillText(capabilityLabels[state.lang][index],p.x+9,p.y+3);
          return{x:p.x,y:p.y,index};
        });
        requestAnimationFrame(draw);
      }
      function updatePointer(event){
        const rect=canvas.getBoundingClientRect();pointer.x=event.clientX-rect.left;pointer.y=event.clientY-rect.top;
        let best=-1,dist=30;nodeScreens.forEach((node,index)=>{const d=Math.hypot(pointer.x-node.x,pointer.y-node.y);if(d<dist){dist=d;best=index;}});
        hoverNode=best;canvas.style.cursor=best>=0?"pointer":(pointer.down?"grabbing":"grab");
      }
      canvas.addEventListener("pointerenter",(e)=>{pointer.inside=true;updatePointer(e);});
      canvas.addEventListener("pointerleave",()=>{pointer.inside=false;pointer.down=false;hoverNode=-1;});
      canvas.addEventListener("pointermove",(e)=>{
        updatePointer(e);
        if(pointer.down){
          const dx=e.clientX-pointer.lastX,dy=e.clientY-pointer.lastY;
          targetRotZ+=dx*.006;targetRotX=Math.max(-1.15,Math.min(-.25,targetRotX+dy*.004));
          pointer.lastX=e.clientX;pointer.lastY=e.clientY;
        }
      });
      canvas.addEventListener("pointerdown",(e)=>{pointer.down=true;pointer.lastX=e.clientX;pointer.lastY=e.clientY;canvas.setPointerCapture?.(e.pointerId);});
      canvas.addEventListener("pointerup",(e)=>{
        const clicked=hoverNode;pointer.down=false;
        if(canvas.hasPointerCapture?.(e.pointerId))canvas.releasePointerCapture(e.pointerId);
        if(clicked>=0){
          askPortfolio(capabilities[clicked].query[state.lang]);
          document.getElementById("query")?.scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"});
        }
      });
      new ResizeObserver(resize).observe(canvas);resize();draw();
    }
  }

  applyLanguage(state.lang,false);
  resetChatLog();
  updateAiStatus();

  const startAI=()=>initMicroLLM();
  if("requestIdleCallback" in window)window.requestIdleCallback(startAI,{timeout:2500});
  else window.setTimeout(startAI,1200);
})();