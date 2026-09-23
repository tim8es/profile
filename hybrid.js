(() => {
  const html = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const state = {
    lang: localStorage.getItem("portfolio-lang") || "en",
    lastSubject: "timur",
    lastIntent: "identity",
    lastProject: null,
    moreCursor: { timur:0, skills:0, tube:0, critic:0, gac:0, market:0, shorts:0, feed:0, hh:0 }
  };

  const ui = {
    en: {
      nav: { work:"Work", query:"Query", about:"About" },
      hero: {
        eyebrow:"Product builder / AI automation",
        title:"Build.<br><span>Automate.</span><br>Simplify.",
        lede:"I turn messy workflows into working products and automation — from process design to AI agents, APIs and code.",
        meta:["Problem → prototype","Process → system","AI → automation"]
      },
      field: { title:"Capability field", buttons:["AI","Automation","Product","Agents"] },
      query: {
        title:"Portfolio Query",
        intro:"Ask about Timur’s experience, projects, AI/automation work or technical decisions.",
        suggestions:[
          ["Who is Timur?","Who is Timur?"],
          ["What has he built?","What projects has Timur built?"],
          ["AI & agents","What has Timur built with AI agents?"],
          ["Background","What's your background?"]
        ],
        placeholder:"Ask the portfolio…",
        hint:'Press <kbd>/</kbd> to focus.',
        rolePortfolio:"portfolio",
        roleYou:"you",
        showProject:"Show related project ↓",
        deeper:"Choose what you want to dig into about"
      },
      work: {
        title:"Selected work",
        note:"",
        tube:{kind:"Browser product",desc:"A Chrome extension that identifies movies on YouTube and shows ratings in context — without API keys or a backend.",details:[["Problem","Checking ratings breaks the viewing flow."],["Built","MV3 extension, deterministic matching, Wikidata provider, caching and SPA handling."],["Proof","Typecheck, tests, production build checks and Chromium browser smoke."]],ask:"Ask deeper about TubeScore →"},
        critic:{kind:"AI system",desc:"An evidence-backed critic designed to catch material mistakes and contradictions without interrupting on every minor issue.",details:[["Problem","AI assistants can lose context or miss important contradictions."],["Built","Context, critic and verifier workflows plus a privacy-gated desktop bridge experiment."],["Status","Early-stage; implemented slices and security-flow checks are separated from host verification."]],ask:"Ask deeper about AI Critic →"},
        gac:{kind:"Agent infrastructure",desc:"A GitHub-native protocol that lets autonomous coding agents continue work safely across disposable sessions.",details:[["Problem","Agent sessions disappear, while ownership and unfinished work need to survive."],["Built","Issue lifecycle, atomic claim refs, work branches, leases, checkpoints and takeover rules."],["Proof","Adversarial live subset: 5 PASS, 0 FAIL, 0 not executed."]],ask:"Ask deeper about GAC →"},
        market:{kind:"Data product",desc:"A labor-market data product with a resumable MV3 collector, versioned contracts and a validated Next.js publishing path.",details:[["Problem","Scraped market data can be stale, partial or silently wrong."],["Built","MV3 collector, canonical snapshot/batch contracts, persistence boundary and Next.js web app."],["Proof","Deterministic fixtures plus repository-wide lint, test and production-build verification."]],ask:"Ask deeper about HH Market Scanner →"},\n        shorts:{kind:"Automation system",desc:"A local-first pipeline for generating short-form AI video from research and scripting through rendering and review.",details:[["Problem","Content production has many repetitive handoffs and failure points."],["Built","n8n workflows with local LLMs, FFmpeg rendering, TTS, captions and an operations control plane."],["Boundary","Publishing is kept separate from generation and requires explicit review/credentials."]],ask:"Ask deeper about the pipeline →"},
        feed:{kind:"Agent utility",desc:"A lightweight feed ingestion utility that gives AI agents predictable content from RSS and Atom sources.",details:[["Problem","Agents repeatedly need to normalize inconsistent feed formats."],["Built","Small Node.js utility with a focused XML parser and bounded content handling."],["Proof","Designed to run across Windows, macOS and Linux with a small dependency surface."]],ask:"Ask deeper about FeedPulse →"},
        hh:{kind:"Open-source contribution",desc:"A merged upstream contribution that exposed existing multi-profile support in the project's desktop UI.",details:[["Problem","The CLI supported isolated profiles, but the UI could not manage or switch them."],["Built","Profile CRUD, auth state, switching, isolated data and safe runtime guards."],["Proof","Merged PR #84; 116 regression tests and Chromium/Playwright UI E2E passed."]],ask:"Ask deeper about the contribution →"}
      },
      about: {
        title:"About",
        note:"",
        statement:"I work best where a messy process needs to become a clear product or system.",
        body:["My background spans project, process and delivery work at Skyeng, SPIKS and OpiniQ — from QA/CX operations and B2B CRM to workflow automation.","Now I work hands-on with AI agents, n8n, APIs, JavaScript/Node.js, Python, SQL, browser tooling and testable prototypes."]
      },
      footer:["Timur Dautov © 2026",""],
      deep:{
        tube:[["Architecture","How is TubeScore built?"],["Hardest part","What was the hardest part of TubeScore?"],["Testing","How did you test TubeScore?"]],
        critic:[["Architecture","How is AI Critic built?"],["Safety","How does AI Critic handle privacy and permissions?"],["Status","What is actually verified in AI Critic?"]],
        gac:[["Protocol","How does GitHub Agent Continuity work?"],["Concurrency","How does GAC prevent conflicting agents?"],["Testing","How was GAC tested?"]],
        market:[["Architecture","How is HH Market Scanner built?"],["Data quality","How does HH Market Scanner avoid bad data?"],["Testing","How is HH Market Scanner verified?"]],\n        shorts:[["Workflow","How is the AI video pipeline built?"],["Local stack","What runs locally in the pipeline?"],["Safety","Why is publishing separated?"]],
        feed:[["Architecture","How is FeedPulse built?"],["Hardest part","What was the hardest part of FeedPulse?"],["Portability","How does FeedPulse stay cross-platform?"]],
        hh:[["Contribution","What did Timur add to hh-applicant-tool?"],["Architecture","How was multi-account isolation implemented?"],["Testing","How was the contribution verified?"]]
      }
    },
    ru: {
      nav: { work:"Работы", query:"Спросить", about:"Обо мне" },
      hero: {
        eyebrow:"Product builder / AI-автоматизация",
        title:"Создаю.<br><span>Автоматизирую.</span><br>Упрощаю.",
        lede:"Превращаю сложные процессы в работающие продукты и автоматизации — от проектирования процессов до AI-агентов, API и кода.",
        meta:["Задача → прототип","Процесс → система","AI → автоматизация"]
      },
      field: { title:"Карта компетенций", buttons:["ИИ","Автоматизация","Продукт","Агенты"] },
      query: {
        title:"Portfolio Query",
        intro:"Спроси про опыт Тимура, проекты, AI/автоматизацию или технические решения.",
        suggestions:[
          ["Кто такой Тимур?","Кто такой Тимур?"],
          ["Что он сделал?","Какие проекты сделал Тимур?"],
          ["AI и агенты","Что Тимур делал с AI-агентами?"],
          ["Опыт","Где работал Тимур и что изменил?"]
        ],
        placeholder:"Спроси портфолио…",
        hint:'Нажми <kbd>/</kbd>, чтобы перейти к вопросу.',
        rolePortfolio:"портфолио",
        roleYou:"вы",
        showProject:"Показать связанный проект ↓",
        deeper:"Выбери, что хочется узнать подробнее про"
      },
      work: {
        title:"Избранные работы",
        note:"",
        tube:{kind:"Браузерный продукт",desc:"Chrome-расширение, которое определяет фильмы на YouTube и показывает рейтинги прямо в контексте просмотра — без API-ключей и backend.",details:[["Проблема","Проверка рейтинга прерывает просмотр и требует отдельного поиска."],["Что сделал","MV3-расширение, детерминированный матчинг, Wikidata, кеширование и SPA-навигация."],["Проверка","Typecheck, тесты, production build checks и Chromium browser smoke."]],ask:"Спросить подробнее о TubeScore →"},
        critic:{kind:"AI-система",desc:"Система критики, которая ищет существенные ошибки и противоречия по проверяемым данным, но не вмешивается по мелочам.",details:[["Проблема","AI-ассистенты могут терять контекст и пропускать важные противоречия."],["Что сделал","Context/Critic/Verifier workflow и эксперимент с desktop bridge с privacy-gates."],["Статус","Early-stage: реализованные части и security-проверки отделены от проверки на реальном host."]],ask:"Спросить подробнее об AI Critic →"},
        gac:{kind:"Инфраструктура агентов",desc:"Протокол на базе GitHub, который позволяет автономным coding-агентам продолжать работу между независимыми сессиями.",details:[["Проблема","Сессия агента исчезает, а состояние, ownership и незавершённая работа должны сохраняться."],["Что сделал","Issue lifecycle, atomic claim refs, work branches, leases, checkpoints и takeover rules."],["Проверка","Adversarial live subset: 5 PASS, 0 FAIL, 0 not executed."]],ask:"Спросить подробнее о GAC →"},
        market:{kind:"Продукт данных",desc:"Продукт для анализа рынка труда: возобновляемый MV3-сборщик, версионированные контракты данных и проверяемая публикация через Next.js.",details:[["Проблема","Данные со страниц могут быть устаревшими, неполными или ошибочно интерпретироваться как ноль."],["Что сделал","MV3-сборщик, canonical snapshot/batch contracts, слой хранения и Next.js-приложение."],["Проверка","Детерминированные fixtures и общий gate: lint, tests и production build."]],ask:"Спросить подробнее о HH Market Scanner →"},\n        shorts:{kind:"Система автоматизации",desc:"Локальный pipeline для производства коротких AI-видео: от исследования и сценария до рендера и review.",details:[["Проблема","В производстве контента много повторяющихся ручных переходов и точек отказа."],["Что сделал","n8n workflow, локальные LLM, FFmpeg, TTS, субтитры и отдельная панель контроля."],["Граница","Публикация отделена от генерации и требует отдельного review и credentials."]],ask:"Спросить подробнее о pipeline →"},
        feed:{kind:"Инструмент для агентов",desc:"Небольшая утилита, которая приводит RSS/Atom-источники к предсказуемому контенту для AI-агентов.",details:[["Проблема","Агентам постоянно приходится нормализовать несовместимые форматы фидов."],["Что сделал","Компактная Node.js-утилита с узким XML-парсером и ограничением объёма контента."],["Проверка","Рассчитана на Windows, macOS и Linux с небольшим числом зависимостей."]],ask:"Спросить подробнее о FeedPulse →"},
        hh:{kind:"Open-source вклад",desc:"Принятый upstream PR, который добавил управление несколькими профилями в desktop UI существующего проекта.",details:[["Проблема","CLI уже поддерживал изолированные профили, но UI не позволял ими управлять и переключаться."],["Что сделал","Создание, удаление и переключение профилей, auth-state, изоляция данных и runtime guards."],["Проверка","PR #84 принят upstream; 116 regression tests и Chromium/Playwright UI E2E прошли."]],ask:"Спросить подробнее о вкладе →"}
      },
      about: {
        title:"Обо мне",
        note:"",
        statement:"Лучше всего я работаю там, где запутанный процесс нужно превратить в понятный продукт или систему.",
        body:["Мой бэкграунд — проекты, процессы и delivery в Skyeng, SPIKS и OpiniQ: от QA/CX и B2B CRM до автоматизации процессов.","Сейчас много делаю руками: AI-агенты, n8n, API, JavaScript/Node.js, Python, SQL, браузерные инструменты и проверяемые прототипы."]
      },
      footer:["Timur Dautov © 2026",""],
      deep:{
        tube:[["Архитектура","Как устроен TubeScore?"],["Самая сложная часть","Что было самым сложным в TubeScore?"],["Тестирование","Как ты тестировал TubeScore?"]],
        critic:[["Архитектура","Как устроен AI Critic?"],["Безопасность","Как AI Critic работает с privacy и permissions?"],["Статус","Что реально проверено в AI Critic?"]],
        gac:[["Протокол","Как работает GitHub Agent Continuity?"],["Конкуренция","Как GAC предотвращает конфликты между агентами?"],["Тестирование","Как тестировался GAC?"]],
        market:[["Архитектура","Как устроен HH Market Scanner?"],["Качество данных","Как HH Market Scanner защищается от плохих данных?"],["Тестирование","Как проверяется HH Market Scanner?"]],\n        shorts:[["Workflow","Как устроен AI video pipeline?"],["Локальный стек","Что в pipeline работает локально?"],["Безопасность","Почему публикация отделена от генерации?"]],
        feed:[["Архитектура","Как устроен FeedPulse?"],["Самая сложная часть","Что было самым сложным в FeedPulse?"],["Переносимость","Как FeedPulse работает на разных ОС?"]],
        hh:[["Вклад","Что Тимур добавил в hh-applicant-tool?"],["Архитектура","Как реализована изоляция нескольких аккаунтов?"],["Тестирование","Как проверялся этот вклад?"]]
      }
    }
  };

  const answers = {
    en: {
      greeting:"Hi. Ask about Timur's experience, projects, AI/automation work, technical decisions or product approach.",
      thanks:"You're welcome. You can ask about a specific project, work experience, measurable results, stack or role fit.",
      identity:"Timur Dautov is a product/process manager and hands-on product builder. He works where product thinking, operations, AI automation and implementation meet.",
      identityMore:[
        "He usually starts with the workflow and the user or business problem, then narrows the scope until there is something concrete to build and verify.",
        "His background spans Skyeng, SPIKS and OpiniQ, while his current hands-on work includes AI agents, browser products, automation pipelines and agent infrastructure.",
        "A recurring pattern in his work is evidence over presentation: explicit constraints, tests, measurable process changes and clear boundaries between what is implemented and what is still experimental."
      ],
      skills:[
        "Timur can map and redesign processes, frame product problems, coordinate delivery, build small MVPs, integrate APIs/webhooks and automate workflows with AI or deterministic tooling.",
        "His practical stack includes JavaScript/Node.js, Python, SQL, REST APIs, webhooks, browser APIs, GitHub, Playwright and n8n.",
        "He is comfortable entering an existing codebase or operating process, tracing actual behavior, making a bounded change and verifying it with regression or E2E checks."
      ],
      background:"Timur has worked across project, process and delivery roles. At Skyeng he led a remote assessment team and worked on QA/CX process automation; at SPIKS he managed a B2B Loyalty CRM ecosystem; at OpiniQ he worked on process automation, Jira workflows and AI research/PoCs.",
      impact:"Examples of measured impact include a SQL + DataLens BI dashboard for 20 products that reduced reporting time by 70%, an audit-automation initiative covering 95%+ of transactions and improving audit efficiency by 44%, CRM process migration that increased processing speed by 20%, and crisis-process redesign that reduced critical-incident resolution time by 25%.",
      companies:"Recent relevant experience includes Skyeng, SPIKS and OpiniQ. The work ranges from team leadership and process redesign to B2B CRM delivery, automation and AI-related process research.",
      ai:"He works with AI agents and LLM workflows as systems rather than just chat prompts: tool orchestration, memory, permissions, validation, reliability and failure handling. Projects such as AI Critic, GitHub Agent Continuity, MindRail and Book Translator explore those concerns from different angles.",
      automation:"His automation work ranges from n8n/JavaScript invoice generation to QA/CX workflows and a local AI-video pipeline. The common pattern is to define inputs and boundaries, automate repeatable steps, then add validation and observable failure states.",
      stack:"The recurring stack is JavaScript/Node.js, Python, SQL, REST APIs, webhooks, browser APIs, GitHub, Playwright and n8n, plus Google/Yandex APIs and cloud tooling where needed.",
      product:"His product loop is simple: understand the real workflow, reduce scope, build the smallest useful version, verify behavior, then keep, change or stop based on evidence.",
      strengths:"The strongest differentiator is the combination of process/product work and hands-on implementation. He can move between metrics, user workflow, API behavior, code and verification without treating any one of them as the whole product.",
      weakness:"The portfolio does not infer personality weaknesses. The visible trade-off is that Timur's profile is broader than a narrow specialist engineering track: it is strongest where product/process understanding and implementation need to meet.",
      fit:"The clearest fit is Product Builder, AI/Automation, Project/Process or technical-product work where the role needs both workflow understanding and the ability to prototype or implement.",
      projectsOverview:"Selected work includes TubeScore, AI Critic, GitHub Agent Continuity, HH Market Scanner, an AI Video Pipeline, FeedPulse and a merged hh-applicant-tool contribution. Other public work includes Book Translator, MindRail, PM 0.1, open-screen-pipe, agent policy plugins and ARC Whitebox research.",
      broad:"Timur combines project/process experience at Skyeng, SPIKS and OpiniQ with hands-on product building and AI automation. His work spans team and process leadership, B2B product delivery, measurable operational improvements, AI-agent systems, browser tooling and automation. Selected public work includes TubeScore, AI Critic, GitHub Agent Continuity, HH Market Scanner, AI Video Pipeline, FeedPulse and a merged hh-applicant-tool contribution.",
      projects: {
        tube:{
          overview:"TubeScore is a zero-token Chrome/Chromium MV3 extension that identifies movies or TV series on YouTube and shows ratings in the viewing context.",
          architecture:"Its production path uses YouTube page metadata, deterministic scoring and the official Wikidata Action API. It does not require an API key, backend, LLM or computer vision.",
          hard:"The hard part is reliable matching and SPA lifecycle behavior, not drawing the rating card. The system deliberately prefers false negatives over confident false positives.",
          testing:"Verification includes strict TypeScript typecheck, Vitest, production-build isolation checks and browser acceptance smoke in Chromium."
        },
        critic:{
          overview:"AI Critic is an evidence-backed system intended to remember relevant work context, catch material mistakes or contradictions and stay silent when intervention is not worth it.",
          architecture:"It separates Context/Critic/Verifier workflows, a local-first Ambient architecture and a narrow privacy-gated Lite Bridge experiment.",
          safety:"Privacy admission happens before screenshot transfer; automatic analysis uses a restricted safe root and failures default to silence. Autonomous click/type/send is outside the product scope.",
          testing:"Strict TypeScript and targeted security-flow PASS evidence exist for the new safe-root/Codex modules. Real Windows/Codex host verification remains a separate gate."
        },
        gac:{
          overview:"GitHub Agent Continuity is a GitHub-native coordination protocol for autonomous coding agents that need to continue work across disposable or scheduled sessions.",
          architecture:"It uses GitHub Issues, immutable generation claim refs, separate work branches, leases, checkpoints and takeover rules so durable state lives outside any one chat session.",
          hard:"The difficult part is concurrency and recovery: exactly one current owner, safe takeover after expiry, and stale-writer isolation without a separate database or daemon.",
          testing:"Its adversarial live subset completed 5 PASS, 0 FAIL and 0 NOT EXECUTED, including claim serialization, takeover and stale-writer isolation."
        },
        market:{
          overview:"HH Market Scanner is a labor-market data product that combines a resumable Chrome MV3 collector with validated snapshots and a Next.js web application.",
          architecture:"The collector exports canonical versioned market snapshot/batch contracts into a file-backed repository boundary; the web app reads only validated data and keeps freshness tied to collection provenance.",
          hard:"The key data-quality problem is distinguishing a real zero from selector failure, blocking, wrong-page or navigation failure. Unknown observations are not silently converted to zero.",
          testing:"Repository verification covers deterministic collector fixtures plus lint, tests and a production Next.js build; live hh.ru behavior remains a separate operational smoke check."
        },
        shorts:{
          overview:"AI Video Pipeline is a local-first n8n workflow for producing Shorts/Reels from scripting through rendering and review.",
          architecture:"The verified local base uses n8n Community Edition, Ollama, FFmpeg and Windows System.Speech, with a separate localhost control plane for health and explicit actions.",
          safety:"Publishing is intentionally separated from generation. The workflow can stop at review-ready state, while OAuth and upload live in a separate path.",
          testing:"The repository documents a verified local base and operational recovery/control procedures rather than presenting publishing as an unattended black box."
        },
        feed:{
          overview:"FeedPulse is a lightweight utility for AI agents that reads RSS/Atom feeds and normalizes them into predictable bounded content.",
          architecture:"It is a small Node.js utility inside tim8skills, intentionally keeping a focused XML parser and a small dependency surface.",
          hard:"The main issue is feed inconsistency: namespaces, content fields, dates and markup vary across sources that nominally use the same formats.",
          testing:"The design targets the same normalized behavior across Windows, macOS and Linux."
        },
        hh:{
          overview:"Timur's hh-applicant-tool contribution added multi-account/profile management to the existing desktop UI and was merged upstream as PR #84.",
          architecture:"The change exposes the project's existing isolated-profile model: profile CRUD, auth state, switching, separate tokens/cookies/SQLite/settings and guards against switching during active operations.",
          hard:"The important part was integrating with an unfamiliar existing codebase without breaking CLI profile behavior or leaking profile-scoped state.",
          testing:"Validation included Ruff, Python compileall, JavaScript syntax checks, 116 regression tests and Chromium/Playwright UI E2E, all reported as passing in the merged PR."
        },
        book:{
          overview:"Book Translator is an agent-agnostic workflow for long-form book translation with durable progress, terminology/style state and separate review.",
          architecture:"Per-book workspace files store source units, translations, progress, glossary, style guide and source-manifest state so another session can resume without relying on chat history.",
          testing:"The repository treats source integrity, review state and persistence as explicit workflow contracts rather than assuming a web chat session is permanent."
        },
        mindrail:{
          overview:"MindRail is an early-stage vendor-neutral control plane for autonomous AI agents, keeping tasks, policy and coordination outside any single model runtime.",
          architecture:"The current verified slice covers Goal → Task → Lease → Checkpoint → completion with deterministic in-memory runtime behavior.",
          testing:"Durable persistence, deployed transports and real agent integrations are explicitly still in development; the repository distinguishes implemented and planned state."
        },
        pmo:{
          overview:"PM 0.1 is a reference prototype for practical Project Management training organized around seven flows of project execution rather than one framework.",
          architecture:"Its first validation slice separates learning-domain scoring/state logic, validation content, UI and browser persistence.",
          testing:"CI checks scoring/promotion state, content structure, integration/accessibility contracts and JavaScript syntax."
        },
        screenpipe:{
          overview:"open-screen-pipe is an early-stage privacy-first desktop UI for a local Screenpipe installation.",
          architecture:"The product direction separates capture, history, context, memory and automation while keeping local-only operation explicit and requiring deliberate confirmation for networked, destructive or code-executing actions.",
          testing:"The current repository is an early structural bootstrap; frontend build/tests are available, while native Tauri integration and final visual QA are still planned."
        },
        plugins:{
          overview:"tim8plugins contains small policy plugins for AI-agent gateways.",
          architecture:"One plugin requires human approval for selected tools and out-of-workspace exec paths; another bounds tool-call attempts and forces a checkpoint when the budget is exhausted.",
          testing:"The packages are intentionally dependency-light and focused on deterministic policy behavior rather than model reasoning."
        },
        arc:{
          overview:"ARC Whitebox is a research repository for the ARC White-Box Estimation Challenge 2026 Phase 2 under CPU/FLOP constraints.",
          architecture:"The research process is organized around hypotheses, reproducible experiments, a ledger and explicit compute budgets.",
          testing:"Its operating rule is hypothesis → implementation → benchmark → compare → ablate → keep/drop; theoretical plausibility alone is not enough to promote a method."
        }
      },
      unknown:"I don't have a reliable answer to that in the local portfolio knowledge base. Try asking about experience, measurable results, stack, AI/automation, role fit or a named project."
    },
    ru: {
      greeting:"Привет. Можно спросить про опыт Тимура, проекты, AI/автоматизацию, технические решения или продуктовый подход.",
      thanks:"Пожалуйста. Можно продолжить: спросить про конкретный проект, опыт работы, измеримые результаты, стек или подходящие роли.",
      identity:"Тимур Даутов — менеджер проектов и процессов и hands-on product builder. Он работает на стыке продукта, операционных процессов, AI-автоматизации и реализации.",
      identityMore:[
        "Обычно он начинает с реального workflow и проблемы пользователя или бизнеса, а затем сокращает scope до конкретного решения, которое можно собрать и проверить.",
        "Бэкграунд включает Skyeng, SPIKS и OpiniQ, а текущая hands-on работа — AI-агенты, браузерные продукты, automation pipeline и agent infrastructure.",
        "Повторяющийся принцип — evidence over presentation: явные ограничения, тесты, измеримые изменения процессов и честное разделение реализованного и экспериментального."
      ],
      skills:[
        "Тимур умеет разбирать и перестраивать процессы, формулировать продуктовые задачи, вести delivery, собирать небольшие MVP, интегрировать API/webhooks и автоматизировать workflow.",
        "Практический стек: JavaScript/Node.js, Python, SQL, REST API, webhooks, browser API, GitHub, Playwright и n8n.",
        "Он умеет входить в существующую codebase или операционный процесс, прослеживать фактическое поведение, делать ограниченное изменение и проверять его regression/E2E тестами."
      ],
      background:"Тимур работал в project/process/delivery ролях. В Skyeng руководил удалённой командой и занимался QA/CX и автоматизацией процессов; в SPIKS управлял B2B Loyalty CRM; в OpiniQ работал с автоматизацией, Jira workflow и AI research/PoC.",
      impact:"Примеры измеримого эффекта: BI на SQL + DataLens для 20 продуктов сократил время на отчётность на 70%; автоматизация аудита охватывала 95%+ транзакций и повысила эффективность аудита на 44%; перенос ручных процессов в CRM повысил скорость обработки на 20%; перестройка кризисного процесса сократила время решения критических инцидентов на 25%.",
      companies:"Последний релевантный опыт — Skyeng, SPIKS и OpiniQ: от team leadership и redesign процессов до B2B CRM delivery, автоматизации и AI-related исследований.",
      ai:"С AI-агентами и LLM Тимур работает как с системами, а не только с промптами: tool orchestration, memory, permissions, validation, reliability и failure handling. Это видно в AI Critic, GitHub Agent Continuity, MindRail и Book Translator.",
      automation:"Автоматизация включает n8n/JavaScript генерацию инвойсов, QA/CX workflow и local-first AI video pipeline. Общий подход: определить входы и границы, автоматизировать повторяемые шаги и добавить валидацию и наблюдаемые failure states.",
      stack:"Регулярный стек: JavaScript/Node.js, Python, SQL, REST API, webhooks, browser API, GitHub, Playwright и n8n; при необходимости — Google/Yandex APIs и cloud tooling.",
      product:"Продуктовый цикл простой: понять реальный workflow, сократить scope, собрать минимально полезную версию, проверить поведение и по фактам оставить, изменить или остановить гипотезу.",
      strengths:"Главное отличие — сочетание process/product опыта и hands-on реализации. Тимур может работать одновременно с метрикой, пользовательским workflow, API, кодом и проверкой результата.",
      weakness:"Портфолио не должно придумывать личные слабые стороны. Видимый trade-off — профиль шире узкой инженерной специализации; он сильнее там, где понимание продукта/процесса нужно соединять с реализацией.",
      fit:"Наиболее подтверждённый fit — Product Builder, AI/Automation, Project/Process или technical product роли, где нужно соединять понимание процесса с прототипированием и delivery.",
      projectsOverview:"В Selected work: TubeScore, AI Critic, GitHub Agent Continuity, AI Video Pipeline, FeedPulse и принятый upstream-вклад в hh-applicant-tool. Среди других публичных работ — Book Translator, MindRail, PM 0.1, open-screen-pipe, agent policy plugins и ARC Whitebox research.",
      broad:"Тимур сочетает project/process опыт в Skyeng, SPIKS и OpiniQ с hands-on разработкой продуктов и AI-автоматизацией. В опыте — управление командами и процессами, B2B product delivery, измеримые операционные улучшения, AI-agent systems, браузерные инструменты и автоматизация. В Selected work — TubeScore, AI Critic, GitHub Agent Continuity, AI Video Pipeline, FeedPulse и принятый вклад в hh-applicant-tool.",
      projects: {
        tube:{
          overview:"TubeScore — Chrome/Chromium MV3 extension без токенов, который определяет фильм или сериал на YouTube и показывает рейтинги прямо в контексте просмотра.",
          architecture:"Production path использует metadata страницы YouTube, детерминированный scoring и официальный Wikidata Action API. API key, backend, LLM и computer vision не нужны.",
          hard:"Сложная часть — надёжный matching и SPA lifecycle, а не отрисовка карточки. Система намеренно предпочитает false negative уверенному false positive.",
          testing:"Проверка включает strict TypeScript typecheck, Vitest, production-build isolation checks и browser acceptance smoke в Chromium."
        },
        critic:{
          overview:"AI Critic — evidence-backed система, которая должна помнить релевантный контекст, находить существенные ошибки или противоречия и молчать, когда вмешательство не стоит того.",
          architecture:"Архитектура разделяет Context/Critic/Verifier workflow, local-first Ambient и узкий privacy-gated Lite Bridge experiment.",
          safety:"Privacy admission происходит до передачи screenshot; automatic analysis идёт через restricted safe root, а failures default to silence. Autonomous click/type/send не входит в scope.",
          testing:"Для новых safe-root/Codex модулей есть strict TypeScript и targeted security-flow PASS evidence. Реальная Windows/Codex host verification остаётся отдельным gate."
        },
        gac:{
          overview:"GitHub Agent Continuity — GitHub-native coordination protocol для autonomous coding agents, которым нужно продолжать работу между disposable или scheduled sessions.",
          architecture:"Он использует GitHub Issues, immutable generation claim refs, отдельные work branches, leases, checkpoints и takeover rules, поэтому durable state живёт вне одной chat session.",
          hard:"Сложная часть — concurrency и recovery: один текущий owner, безопасный takeover после expiry и stale-writer isolation без отдельной базы или daemon.",
          testing:"Adversarial live subset завершился с 5 PASS, 0 FAIL и 0 NOT EXECUTED, включая claim serialization, takeover и stale-writer isolation."
        },
        market:{
          overview:"HH Market Scanner — продукт данных о рынке труда: возобновляемый Chrome MV3 collector, валидируемые snapshots и Next.js web-приложение.",
          architecture:"Collector приводит данные к versioned snapshot/batch contracts и сохраняет их через file-backed repository boundary; UI читает только валидированные данные, а freshness определяется временем сбора, а не деплоя.",
          hard:"Ключевая задача качества данных — отличить настоящий ноль от selector failure, блокировки, неверной страницы или navigation failure. Неизвестное наблюдение не превращается в ноль.",
          testing:"Проверка репозитория включает детерминированные fixtures collector'а, lint, tests и production Next.js build; живое поведение hh.ru остаётся отдельным operational smoke."
        },
        shorts:{
          overview:"AI Video Pipeline — local-first n8n workflow для производства Shorts/Reels от сценария до рендера и review.",
          architecture:"Проверенная локальная база использует n8n Community Edition, Ollama, FFmpeg и Windows System.Speech; отдельный localhost control plane собирает health и explicit actions.",
          safety:"Публикация намеренно отделена от генерации. Workflow может остановиться на review-ready состоянии, а OAuth и upload живут отдельным path.",
          testing:"Репозиторий фиксирует verified local base и operational recovery/control процедуры, а не выдаёт публикацию за полностью unattended black box."
        },
        feed:{
          overview:"FeedPulse — лёгкая утилита для AI-агентов, которая читает RSS/Atom и приводит материалы к предсказуемому bounded content.",
          architecture:"Это небольшая Node.js-утилита внутри tim8skills с focused XML parser и малым dependency surface.",
          hard:"Основная сложность — неоднородность feed: namespaces, content fields, dates и markup различаются даже у формально одинаковых форматов.",
          testing:"Дизайн рассчитан на одинаковый нормализованный результат в Windows, macOS и Linux."
        },
        hh:{
          overview:"Вклад Тимура в hh-applicant-tool добавил управление несколькими профилями/аккаунтами в существующий desktop UI и был принят upstream как PR #84.",
          architecture:"Изменение раскрывает существующую модель изолированных профилей: CRUD, auth state, switching, отдельные tokens/cookies/SQLite/settings и guards от переключения во время активных операций.",
          hard:"Ключевая задача — встроиться в незнакомую codebase, не сломав CLI profile behavior и не смешав profile-scoped state.",
          testing:"Проверка включала Ruff, Python compileall, JavaScript syntax, 116 regression tests и Chromium/Playwright UI E2E; в merged PR всё отмечено как PASS."
        },
        book:{
          overview:"Book Translator — agent-agnostic workflow для длинного перевода книг с durable progress, terminology/style state и отдельным review.",
          architecture:"Per-book workspace хранит source units, translations, progress, glossary, style guide и source manifest, поэтому следующая сессия может продолжить работу без истории чата.",
          testing:"В workflow source integrity, review state и persistence оформлены как явные контракты, а не как предположение о вечной web-chat session."
        },
        mindrail:{
          overview:"MindRail — early-stage vendor-neutral control plane для автономных AI-агентов, где tasks, policy и coordination вынесены из конкретной model runtime.",
          architecture:"Текущий verified slice покрывает Goal → Task → Lease → Checkpoint → completion с deterministic in-memory runtime.",
          testing:"Durable persistence, deployed transports и реальные agent integrations явно остаются в разработке; репозиторий разделяет implemented и planned state."
        },
        pmo:{
          overview:"PM 0.1 — reference prototype практической программы по Project Management вокруг семи потоков исполнения проекта, а не одного framework.",
          architecture:"Первый validation slice разделяет learning-domain scoring/state, validation content, UI и browser persistence.",
          testing:"CI проверяет scoring/promotion state, структуру контента, integration/accessibility contracts и JavaScript syntax."
        },
        screenpipe:{
          overview:"open-screen-pipe — early-stage privacy-first desktop UI для локального Screenpipe.",
          architecture:"Продукт разделяет capture, history, context, memory и automation, сохраняет local-only режим явным и требует осознанного подтверждения для сетевых, destructive или code-executing действий.",
          testing:"Сейчас это ранний structural bootstrap: frontend build/tests есть, а native Tauri integration и финальная visual QA ещё запланированы."
        },
        plugins:{
          overview:"tim8plugins — небольшие policy plugins для gateway'ев AI-агентов.",
          architecture:"Один plugin требует human approval для выбранных tools и exec вне workspace; второй ограничивает число tool-call попыток и требует checkpoint после исчерпания бюджета.",
          testing:"Пакеты намеренно dependency-light и опираются на детерминированную policy-логику, а не на model reasoning."
        },
        arc:{
          overview:"ARC Whitebox — research-репозиторий для ARC White-Box Estimation Challenge 2026 Phase 2 с CPU/FLOP ограничениями.",
          architecture:"Исследовательский процесс организован вокруг hypotheses, воспроизводимых экспериментов, ledger и явного compute budget.",
          testing:"Рабочее правило: hypothesis → implementation → benchmark → compare → ablate → keep/drop; теоретической правдоподобности недостаточно для продвижения метода."
        }
      },
      unknown:"В локальной базе портфолио нет надёжного ответа на этот вопрос. Можно спросить про опыт, измеримые результаты, стек, AI/автоматизацию, role fit или конкретный проект."
    }
  };

  function qlang(text){
    const c=(text.match(/[А-Яа-яЁё]/g)||[]).length;
    const l=(text.match(/[A-Za-zА-Яа-яЁё]/g)||[]).length;
    return l&&c/l>.25?"ru":state.lang;
  }
  function norm(v){return String(v||"").toLowerCase().replace(/ё/g,"е").replace(/[^a-zа-я0-9\s.-]/gi," ").replace(/\s+/g," ").trim();}
  function hasAny(q,arr){return arr.some(x=>q.includes(x));}
  function startsWithPhrase(q,phrases){return phrases.some(p=>q===p||q.startsWith(p+" "));}
  function looksLikeGreeting(q){return startsWithPhrase(q,["привет","здравствуй","здравствуйте","добрый день","добрый вечер","hello","hi","hey"]);}
  function looksLikeThanks(q){return startsWithPhrase(q,["спасибо","благодарю","thanks","thank you"]);}
  function isPronounFollowup(q){return hasAny(q,["он ","его ","о нем","о нём","ему ","he ","him ","his "])||/^(он|его|ему|he|him)$/.test(q);}
  function isMore(q){return hasAny(q,["что еще","что ещё","расскажи еще","расскажи ещё","а еще","а ещё","what else","tell me more","anything else"]);}

  const projectTerms={
    tube:["tubescore","tube score"],
    critic:["ai critic"],
    gac:["github agent continuity","gac"],
    market:["hh market scanner","market scanner","professions statistics","рынок труда"],\n    shorts:["ai video pipeline","video pipeline","youtube shorts","shorts pipeline"],
    feed:["feedpulse","feed pulse"],
    hh:["hh-applicant-tool","hh applicant"],
    book:["book translator"],
    mindrail:["mindrail"],
    pmo:["pm 0.1","pmo01"],\n    screenpipe:["open-screen-pipe","screenpipe"],\n    plugins:["tim8plugins","policy plugins","policy plugin"],\n    arc:["arc-whitebox","arc whitebox"]
  };
  const selectedProjects=new Set(["tube","critic","gac","market","shorts","feed","hh"]);

  function resolveSubject(q){
    for(const [id,terms] of Object.entries(projectTerms)){
      if(terms.some(term=>q.includes(term))) return id;
    }
    if(hasAny(q,["тимур","даутов","timur","dautov"])) return "timur";
    if(isPronounFollowup(q)||isMore(q)) return state.lastSubject||"timur";
    return state.lastSubject||"timur";
  }

  function rotate(key,values){
    const usable=values.filter(Boolean);
    if(!usable.length)return"";
    const idx=state.moreCursor[key]||0;
    state.moreCursor[key]=(idx+1)%usable.length;
    return usable[idx];
  }

  function projectResult(lang,subject,query){
    const p=answers[lang].projects[subject];
    if(!p)return null;
    let text=p.overview;
    if(hasAny(query,["архитект","как устро","как сделан","architecture","how built","how is"])) text=p.architecture||p.overview;
    else if(hasAny(query,["безопас","privacy","permission","safety","security"])) text=p.safety||p.architecture||p.overview;
    else if(hasAny(query,["тест","провер","proof","status","verified","testing","tested"])) text=p.testing||p.status||p.overview;
    else if(hasAny(query,["слож","hardest","difficult","challenge"])) text=p.hard||p.architecture||p.overview;
    return {lang,intent:"project",text,subject,project:selectedProjects.has(subject)?subject:null};
  }

  function classify(raw){
    const q=norm(raw);
    const lang=qlang(raw);
    const a=answers[lang];
    if(!q)return{lang,intent:"empty",text:"",subject:state.lastSubject};
    if(looksLikeGreeting(q))return{lang,intent:"greeting",text:a.greeting,subject:"timur"};
    if(looksLikeThanks(q))return{lang,intent:"thanks",text:a.thanks,subject:state.lastSubject};

    const subject=resolveSubject(q);

    if(isMore(q)){
      if(subject==="timur"){
        if(state.lastIntent==="skills")return{lang,intent:"skills",text:rotate("skills",a.skills),subject};
        return{lang,intent:"identity-more",text:rotate("timur",a.identityMore),subject};
      }
      const p=a.projects[subject];
      if(p)return{lang,intent:"project-more",text:rotate(subject,[p.architecture,p.hard,p.testing,p.safety]),subject,project:selectedProjects.has(subject)?subject:null};
    }

    if(subject!=="timur"){
      const result=projectResult(lang,subject,q);
      if(result)return result;
    }

    if(hasAny(q,["расскажи все","расскажи всё","все что знаешь","всё что знаешь","everything","all you know"]))return{lang,intent:"broad",text:a.broad,subject:"timur"};
    if(hasAny(q,["слаб","weakness"]))return{lang,intent:"weakness",text:a.weakness,subject:"timur"};
    if(hasAny(q,["сильн","преимущ","удив","strength","differentiat","unique"]))return{lang,intent:"strengths",text:a.strengths,subject:"timur"};
    if(hasAny(q,["подойд","роль","ваканс","role fit","suitable","what role","job fit"]))return{lang,intent:"fit",text:a.fit,subject:"timur"};
    if(hasAny(q,["результат","метрик","цифр","эффект","impact","results","metrics"]))return{lang,intent:"impact",text:a.impact,subject:"timur"};
    if(hasAny(q,["где работал","компан","employer","companies","where worked"]))return{lang,intent:"companies",text:a.companies,subject:"timur"};
    if(hasAny(q,["что умеет","навык","компетенц","skills","what can","capabilities"]))return{lang,intent:"skills",text:rotate("skills",a.skills),subject:"timur"};
    if(hasAny(q,["кто такой","кто тимур","who is","tell me about timur","расскажи про тимура"]))return{lang,intent:"identity",text:a.identity,subject:"timur"};
    if(hasAny(q,["опыт","карьер","background","experience","career"]))return{lang,intent:"background",text:a.background,subject:"timur"};
    if(hasAny(q,["стек","технолог","tools","stack","technology","javascript","node","python","sql","api","webhook"]))return{lang,intent:"stack",text:a.stack,subject:"timur"};
    if(hasAny(q,["ии","нейросет","llm"," ai ","ai ","агент","agent"]))return{lang,intent:"ai",text:a.ai,subject:"timur"};
    if(hasAny(q,["автоматиз","automation","automate","workflow","процесс"]))return{lang,intent:"automation",text:a.automation,subject:"timur"};
    if(hasAny(q,["продукт","mvp","гипотез","product","prototype","прототип"]))return{lang,intent:"product",text:a.product,subject:"timur"};
    if(hasAny(q,["что дела","что стро","какие проект","проекты","what do you build","what has he built","projects","portfolio"]))return{lang,intent:"overview",text:a.projectsOverview,subject:"timur"};
    if(isPronounFollowup(q))return{lang,intent:"identity-more",text:rotate("timur",a.identityMore),subject:"timur"};
    return{lang,intent:"unknown",text:a.unknown,subject};
  }

  const chatLog=document.querySelector("[data-chat-log]");
  const form=document.querySelector("[data-query-form]");
  const input=document.querySelector("[data-query-input]");
  const suggestions=[...document.querySelectorAll("[data-suggestion]")];
  const askProjectButtons=[...document.querySelectorAll("[data-ask-project]")];

  function appendMessage(role,text,projectId,actions=[],scroll=true,lang=state.lang){
    if(!chatLog)return;
    const row=document.createElement("div");
    row.className=`chat-message chat-message--${role}`;
    const roleEl=document.createElement("span");
    roleEl.className="chat-role";
    roleEl.textContent=role==="user"?(lang==="ru"?"вы":"you"):(lang==="ru"?"портфолио":"portfolio");
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
      const br=document.createElement("br");
      const link=document.createElement("button");link.type="button";link.className="chat-project-link";
      link.textContent=lang==="ru"?"Показать связанный проект ↓":"Show related project ↓";
      link.addEventListener("click",()=>{
        activateProject(projectId,true);
        document.getElementById("work")?.scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"});
      });
      bubble.append(br,link);
    }
    row.append(roleEl,bubble);chatLog.appendChild(row);
    if(scroll)chatLog.scrollTo({top:chatLog.scrollHeight,behavior:reduced?"auto":"smooth"});
  }

  function resetChatLog(){
    if(!chatLog)return;
    chatLog.innerHTML="";
    appendMessage("bot",ui[state.lang].query.intro,null,[],false,state.lang);
    state.lastSubject="timur";state.lastIntent="identity";state.lastProject=null;
  }

  function askPortfolio(query){
    const text=String(query||"").trim();
    if(!text)return;
    const lang=qlang(text);
    appendMessage("user",text,null,[],true,lang);
    const result=classify(text);
    if(result.intent!=="greeting"&&result.intent!=="thanks"&&result.intent!=="unknown"){
      state.lastSubject=result.subject||state.lastSubject;
      state.lastIntent=result.intent;
      state.lastProject=result.project||state.lastProject;
    }
    window.setTimeout(()=>appendMessage("bot",result.text,result.project,[],true,result.lang),reduced?0:70);
  }

  function openProjectQuestions(id){
    const lang=state.lang;
    const names={tube:"TubeScore",critic:"AI Critic",gac:"GitHub Agent Continuity",market:"HH Market Scanner",shorts:"AI Video Pipeline",feed:"FeedPulse",hh:"hh-applicant-tool"}; const name=names[id]||id;
    state.lastSubject=id;state.lastProject=id;state.lastIntent="project-overview";
    const deep=ui[lang].deep[id].map(([label,query])=>({label,query}));
    appendMessage("user",lang==="ru"?`Спросить подробнее про ${name}`:`Ask deeper about ${name}`,null,[],true,lang);
    appendMessage("bot",`${ui[lang].query.deeper} ${name}:`,null,deep,true,lang);
    document.getElementById("query")?.scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"});
  }

  form?.addEventListener("submit",(event)=>{event.preventDefault();askPortfolio(input?.value);if(input)input.value="";});
  suggestions.forEach((button)=>button.addEventListener("click",()=>askPortfolio(button.dataset.suggestion)));
  askProjectButtons.forEach((button)=>button.addEventListener("click",()=>openProjectQuestions(button.dataset.askProject)));
  document.addEventListener("keydown",(event)=>{
    const tag=document.activeElement?.tagName?.toLowerCase();
    const editing=tag==="input"||tag==="textarea"||document.activeElement?.isContentEditable;
    if((event.key==="/"||event.code==="Slash")&&!editing&&input){event.preventDefault();input.focus();}
  });

  // Theme
  const themeToggle=document.querySelector("[data-theme-toggle]");
  const savedTheme=localStorage.getItem("portfolio-theme");
  const preferredTheme=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";
  function setTheme(theme){
    html.dataset.theme=theme;localStorage.setItem("portfolio-theme",theme);
    themeToggle?.setAttribute("aria-label",theme==="dark"?"Switch to light theme":"Switch to dark theme");
  }
  setTheme(savedTheme||preferredTheme);
  themeToggle?.addEventListener("click",()=>setTheme(html.dataset.theme==="dark"?"light":"dark"));

  // Language
  const langToggle=document.querySelector("[data-lang-toggle]");
  const langLabel=document.querySelector("[data-lang-label]");
  function setText(selector,value){const el=document.querySelector(selector);if(el&&value!=null)el.textContent=value;}
  function setHTML(selector,value){const el=document.querySelector(selector);if(el&&value!=null)el.innerHTML=value;}

  function applyLanguage(lang,reset=true){
    state.lang=lang;html.lang=lang;localStorage.setItem("portfolio-lang",lang);
    if(langLabel)langLabel.textContent=lang.toUpperCase();
    langToggle?.setAttribute("aria-label",lang==="en"?"Переключить на русский":"Switch to English");
    const t=ui[lang];

    setText('.nav-links a[href="#work"]',t.nav.work);
    setText('.nav-links a[href="#query"]',t.nav.query);
    setText('.nav-links a[href="#about"]',t.nav.about);
    setText(".hero .eyebrow",t.hero.eyebrow);
    setHTML(".hero h1",t.hero.title);
    setText(".hero-lede",t.hero.lede);
    document.querySelectorAll(".hero-meta span").forEach((el,i)=>{if(t.hero.meta[i])el.textContent=t.hero.meta[i];});
    const fh=document.querySelectorAll(".field-head span");if(fh[0])fh[0].textContent=t.field.title;
    document.querySelectorAll(".field-fallback button").forEach((el,i)=>{if(t.field.buttons[i])el.textContent=t.field.buttons[i];});

    const qLabels=document.querySelectorAll("#query > .section-label span");if(qLabels[0])qLabels[0].textContent=t.query.title;if(qLabels[1])qLabels[1].textContent=t.query.status;
    document.querySelectorAll(".suggestions button").forEach((button,i)=>{const pair=t.query.suggestions[i];if(pair){button.textContent=pair[0];button.dataset.suggestion=pair[1];}});
    if(input)input.placeholder=t.query.placeholder;setHTML(".query-hint",t.query.hint);

    const wLabels=document.querySelectorAll("#work > .section-label span");if(wLabels[0])wLabels[0].textContent=t.work.title;if(wLabels[1])wLabels[1].textContent=t.work.note;
    const pcopy={tube:t.work.tube,critic:t.work.critic,gac:t.work.gac,market:t.work.market,shorts:t.work.shorts,feed:t.work.feed,hh:t.work.hh};
    projects.forEach((item)=>{
      const p=pcopy[item.dataset.project];if(!p)return;
      item.querySelector(".project-main small").textContent=p.kind;
      item.querySelector(".project-reveal p").textContent=p.desc;
      item.querySelectorAll(".project-reveal dl > div").forEach((block,i)=>{if(p.details[i]){block.querySelector("dt").textContent=p.details[i][0];block.querySelector("dd").textContent=p.details[i][1];}});
      const ask=item.querySelector("[data-ask-project]");if(ask)ask.textContent=p.ask;
    });

    const aLabels=document.querySelectorAll("#about > .section-label span");if(aLabels[0])aLabels[0].textContent=t.about.title;if(aLabels[1])aLabels[1].textContent=t.about.note;
    setText(".about-statement",t.about.statement);
    document.querySelectorAll(".about-copy p").forEach((el,i)=>{if(t.about.body[i])el.textContent=t.about.body[i];});
    document.querySelectorAll(".footer span").forEach((el,i)=>{if(t.footer[i])el.textContent=t.footer[i];});
    if(reset)resetChatLog();
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
    if(expand){state.lastSubject=id;state.lastProject=id;state.lastIntent="project-overview";}
  }
  projects.forEach((item)=>{
    const trigger=item.querySelector(".project-trigger");
    trigger?.addEventListener("click",()=>activateProject(item.dataset.project,!item.classList.contains("is-active")));
    if(window.matchMedia("(hover:hover) and (pointer:fine)").matches)item.addEventListener("mouseenter",()=>activateProject(item.dataset.project,true));
  });

  // Capability field
  const canvas=document.querySelector("[data-field-canvas]");
  const fieldButtons=[...document.querySelectorAll("[data-field-query]")];
  fieldButtons.forEach((button)=>button.addEventListener("click",()=>{
    const map={
      AI:{en:"Show me AI work",ru:"Покажи работу с ИИ"},
      automation:{en:"How do you automate processes?",ru:"Как ты автоматизируешь процессы?"},
      product:{en:"Tell me about product thinking",ru:"Расскажи про продуктовый подход"},
      agents:{en:"Tell me about AI agents",ru:"Расскажи про AI-агентов"}
    };
    askPortfolio(map[button.dataset.fieldQuery]?.[state.lang]||button.dataset.fieldQuery);
    document.getElementById("query")?.scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"});
  }));

  const labels={en:["AI","Agents","APIs","Automation","Product","Data","QA","Open source"],ru:["ИИ","Агенты","API","Автоматизация","Продукт","Данные","QA","Open source"]};
  if(canvas){
    const ctx=canvas.getContext("2d");
    if(ctx){
      const caps=[
        {x:-.62,y:-.5,q:{en:"Show me AI work",ru:"Покажи работу с ИИ"}},
        {x:-.12,y:-.68,q:{en:"Tell me about AI agents",ru:"Расскажи про AI-агентов"}},
        {x:.56,y:-.48,q:{en:"What stack do you use?",ru:"Какой стек ты используешь?"}},
        {x:-.58,y:.16,q:{en:"How do you automate processes?",ru:"Как ты автоматизируешь процессы?"}},
        {x:.06,y:.04,q:{en:"Tell me about product thinking",ru:"Расскажи про продуктовый подход"}},
        {x:.62,y:.22,q:{en:"What stack do you use?",ru:"Какие технологии ты используешь?"}},
        {x:-.18,y:.58,q:{en:"How did you test TubeScore?",ru:"Как ты тестировал TubeScore?"}},
        {x:.48,y:.66,q:{en:"What's your background?",ru:"Какой у тебя опыт?"}}
      ];
      let dpr=Math.min(window.devicePixelRatio||1,2),width=1,height=1,rotX=-.78,rotZ=-.18,targetRotX=rotX,targetRotZ=rotZ;
      let pointer={x:0,y:0,inside:false,down:false,lastX:0,lastY:0},hover=-1,nodeScreens=[],time=0;
      function resize(){const r=canvas.getBoundingClientRect();width=Math.max(1,r.width);height=Math.max(1,r.height);dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);}
      function colors(){const s=getComputedStyle(html);return{text:s.getPropertyValue("--text").trim(),muted:s.getPropertyValue("--muted").trim(),line:s.getPropertyValue("--line-strong").trim(),accent:s.getPropertyValue("--accent").trim()};}
      function baseH(x,y){return .13*Math.sin(x*4.1+time*.8)*Math.cos(y*3.4-time*.55);}
      function project(x,y,z){let yy=y*Math.cos(rotX)-z*Math.sin(rotX),zz=y*Math.sin(rotX)+z*Math.cos(rotX),xx=x*Math.cos(rotZ)-yy*Math.sin(rotZ),y2=x*Math.sin(rotZ)+yy*Math.cos(rotZ);const p=1/(1.55-zz*.32),scale=Math.min(width,height)*.72;return{x:width/2+xx*scale*p,y:height/2+y2*scale*.78*p};}
      function hAt(x,y){const base=baseH(x,y);if(!pointer.inside)return base;const s=project(x,y,base),dist=Math.hypot(s.x-pointer.x,s.y-pointer.y),radius=Math.max(95,Math.min(width,height)*.28),d=dist/radius;if(d>1.35)return base;return base+Math.sin(d*9-time*3.2)*Math.exp(-d*2.9)*.22;}
      function draw(){const c=colors();ctx.clearRect(0,0,width,height);rotX+=(targetRotX-rotX)*.07;rotZ+=(targetRotZ-rotZ)*.07;if(!pointer.down&&!reduced)targetRotZ+=.0012;time+=reduced?0:.016;const n=18;ctx.lineWidth=1;
        for(let axis=0;axis<2;axis++)for(let i=0;i<n;i++){ctx.beginPath();for(let k=0;k<n;k++){const a=-1+(2*i)/(n-1),b=-1+(2*k)/(n-1),x=axis===0?a:b,y=axis===0?b:a,p=project(x,y,hAt(x,y));if(k===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);}ctx.strokeStyle=c.line;ctx.globalAlpha=.42;ctx.stroke();}
        ctx.globalAlpha=1;nodeScreens=caps.map((cap,index)=>{const p=project(cap.x,cap.y,hAt(cap.x,cap.y)+.03),active=index===hover;ctx.beginPath();ctx.arc(p.x,p.y,active?5.5:3.5,0,Math.PI*2);ctx.fillStyle=active?c.accent:c.text;ctx.fill();ctx.font=`${active?600:500} 10px ui-monospace, SFMono-Regular, Menlo, monospace`;ctx.fillStyle=active?c.accent:c.muted;ctx.fillText(labels[state.lang][index],p.x+9,p.y+3);return{x:p.x,y:p.y};});requestAnimationFrame(draw);}
      function update(e){const r=canvas.getBoundingClientRect();pointer.x=e.clientX-r.left;pointer.y=e.clientY-r.top;let best=-1,dist=30;nodeScreens.forEach((n,i)=>{const d=Math.hypot(pointer.x-n.x,pointer.y-n.y);if(d<dist){dist=d;best=i;}});hover=best;canvas.style.cursor=best>=0?"pointer":(pointer.down?"grabbing":"grab");}
      canvas.addEventListener("pointerenter",e=>{pointer.inside=true;update(e);});
      canvas.addEventListener("pointerleave",()=>{pointer.inside=false;pointer.down=false;hover=-1;});
      canvas.addEventListener("pointermove",e=>{update(e);if(pointer.down){const dx=e.clientX-pointer.lastX,dy=e.clientY-pointer.lastY;targetRotZ+=dx*.006;targetRotX=Math.max(-1.15,Math.min(-.25,targetRotX+dy*.004));pointer.lastX=e.clientX;pointer.lastY=e.clientY;}});
      canvas.addEventListener("pointerdown",e=>{pointer.down=true;pointer.lastX=e.clientX;pointer.lastY=e.clientY;canvas.setPointerCapture?.(e.pointerId);});
      canvas.addEventListener("pointerup",e=>{const clicked=hover;pointer.down=false;if(canvas.hasPointerCapture?.(e.pointerId))canvas.releasePointerCapture(e.pointerId);if(clicked>=0){askPortfolio(caps[clicked].q[state.lang]);document.getElementById("query")?.scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"});}});
      new ResizeObserver(resize).observe(canvas);resize();draw();
    }
  }

  applyLanguage(state.lang,false);
  resetChatLog();
})();