(() => {
  const html = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const state = {
    lang: localStorage.getItem("portfolio-lang") || "en",
    lastSubject: "timur",
    lastIntent: "identity",
    lastProject: null,
    llmConfigured: false,
    runtimeMode: "checking",
    history: [],
    moreCursor: { timur:0, skills:0, audit:0, crm:0, bi:0, invoice:0, book:0, video:0, tube:0, lightning:0, market:0, feed:0 }
  };

  const ui = {
    en: {
      nav: { work:"Work", query:"Query", about:"About" },
      hero: {
        eyebrow:"Product builder / Delivery Driver",
        title:"Build.<br><span>Automate.</span><br>Simplify.",
        lede:"I turn vague problems and awkward processes into small working products — with AI, automation and code.",
        meta:["Product → prototype","AI-native workflow"]
      },
      field: { title:"Capability field", hint:"drag / move / click" },
      query: {
        title:"Portfolio Query",
        status:"Checking…",
        intro:"Ask me about Timur, his work, projects, product approach or technical decisions.",
        suggestions:[
          ["Projects","What projects are in the portfolio?"],
          ["Experience","What's Timur's background?"],
          ["Results","What measurable results does Timur have?"],
          ["AI & automation","Show me AI and automation work"],
          ["Skills","What skills does Timur have?"],
          ["Stack","What stack do you use?"],
          ["Delivery","Tell me about Timur's delivery experience"],
          ["Product approach","Tell me about Timur's product approach"]
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
        audit:{kind:"Process consulting",desc:"A consulting and process-redesign project for a manual communication-quality audit workflow.",details:[["What","Mapped the workflow and moved manual Google Workspace steps into an internal CRM."],["Why","Reduce fragmented tracking and create a cleaner base for future automation."],["Detail","Researched external audit-automation solutions and evaluated options for further development of the process."]],ask:"Ask deeper about the audit project →"},
        crm:{kind:"B2B product / Delivery",desc:"Development of a B2B loyalty CRM product spanning web, mobile, backend and external integrations.",details:[["What","Requirements, backlog, planning and delivery across a multi-application CRM ecosystem."],["Why","Give business customers one system for managing loyalty programs and connected workflows."],["Detail","SaaS and on-premise product with four web apps, two mobile apps, PostgreSQL and integrations."]],ask:"Ask deeper about the CRM product →"},
        bi:{kind:"Analytics / Operations",desc:"Operational dashboards that turned fragmented process data into a shared view of performance and bottlenecks.",details:[["What","Built SQL + BI reporting for operational and product metrics across 20 products."],["Why","Replace repetitive manual reporting and make deviations visible earlier."],["Detail","Reduced the time spent preparing regular reporting by about 70%."]],ask:"Ask deeper about the dashboards →"},
        invoice:{kind:"Workflow automation",desc:"An n8n/JavaScript workflow that automates invoice preparation for remote employees.",details:[["What","Validated source data and generated ready-to-use invoice documents from a repeatable workflow."],["Why","Remove repetitive manual preparation and reduce the risk of document errors."],["Detail","One invoice was generated in under 15 seconds and the workflow was used in real monthly cycles."]],ask:"Ask deeper about Invoice Automation →"},
        book:{kind:"AI product / Telegram",desc:"An AI-assisted book-translation system with durable progress and a Telegram interface.",details:[["What","Stores translation progress, terminology, style and review state outside a single chat session."],["Why","Long-form translation needs consistency and the ability to continue across multiple sessions."],["Detail","The Telegram bot is the user-facing layer of the same translation workflow."]],ask:"Ask deeper about Book Translator →"},
        video:{kind:"AI automation / Content production",desc:"An automated pipeline for producing short-form video from research and scripting through rendering and review.",details:[["What","Connected n8n, LLM steps, TTS, subtitles and FFmpeg rendering into one workflow."],["Why","Reduce repetitive handoffs and make content production more repeatable."],["Detail","Generation is separated from publishing so the final output remains reviewable before release."]],ask:"Ask deeper about the video pipeline →"},
        tube:{kind:"Consumer product / Browser extension",desc:"A Chrome extension that shows movie and series ratings directly in the YouTube viewing context.",details:[["What","Identifies the title, matches it deterministically and renders the rating next to video metadata."],["Why","Remove the extra search step when deciding whether a film or series is worth watching."],["Detail","Runs without its own backend, LLM or required API key; browser behavior is covered by automated smoke tests."]],ask:"Ask deeper about TubeScore →"},
        lightning:{kind:"AI product / Browser automation",desc:"A browser product for automating repetitive parts of the job-search workflow on hh.ru.",details:[["What","Combines AI-assisted vacancy handling, cover letters, automated responses and resume-performance analytics."],["Why","Reduce manual job-search work while keeping the process measurable."],["Detail","The product also has its own backend layer for tariffs, licensing and payments."]],ask:"Ask deeper about HH Lightning →"},
        market:{kind:"Data product / Market analytics",desc:"A data product for collecting and comparing labor-market signals across professions.",details:[["What","Combines a browser collector, validated snapshots, history and a web interface for analysis."],["Why","Make profession and competition research reproducible instead of relying on one-off manual checks."],["Detail","The system flags incomplete or invalid observations and keeps the actual collection date so market results can be compared correctly over time."]],ask:"Ask deeper about Job Market Scanner →"},
        feed:{kind:"Agent utility / Content ingestion",desc:"A lightweight ingestion utility that turns RSS/Atom sources into predictable content for AI agents.",details:[["What","Normalizes inconsistent feed formats into a stable structure for downstream processing."],["Why","Agents should not need to reimplement feed parsing every time they consume a new source."],["Detail","Designed to stay small, dependency-light and portable across Windows, macOS and Linux."]],ask:"Ask deeper about FeedPulse →"}
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
      footer:["Timur Dautov © 2026","Built as a static page. Query and 3D field run locally in your browser."],
      deep:{
        audit:[["Context","Where was this project done?"],["Work","What exactly changed in the audit process?"],["Automation","What automation was actually implemented?"]],
        crm:[["Scope","How large was the CRM product?"],["Role","What was Timur responsible for?"],["Architecture","What was inside the CRM ecosystem?"]],
        bi:[["Metrics","What did the dashboards change?"],["Stack","What was used to build the dashboards?"],["Context","Where was this project done?"]],
        invoice:[["Workflow","How did Invoice Automation work?"],["Result","What was the measured result?"],["Context","Where was this project done?"]],
        book:[["Architecture","How does Book Translator preserve context?"],["Telegram","How does the Telegram bot fit into the product?"],["Workflow","How does translation continue between sessions?"]],
        video:[["Workflow","How is the AI Video Pipeline built?"],["Stack","What runs locally?"],["Review","Why is publishing separated from generation?"]],
        tube:[["Architecture","How is TubeScore built?"],["Matching","How does TubeScore identify the right movie?"],["Testing","How did you test TubeScore?"]],
        lightning:[["Product","What can HH Lightning do?"],["Backend","How does the license and payment backend work?"],["AI","How is AI used in HH Lightning?"]],
        market:[["Architecture","How is Job Market Scanner built?"],["Data quality","How does it avoid bad market data?"],["Collector","How does collection resume after interruption?"]],
        feed:[["Architecture","How is FeedPulse built?"],["Formats","What does FeedPulse normalize?"],["Portability","How does it stay cross-platform?"]]
      }
    },
    ru: {
      nav: { work:"Работы", query:"Спросить", about:"Обо мне" },
      hero: {
        eyebrow:"Product builder / Delivery Driver",
        title:"Создаю.<br><span>Автоматизирую.</span><br>Упрощаю.",
        lede:"Превращаю размытые задачи и неудобные процессы в небольшие работающие продукты — с помощью AI, автоматизации и кода.",
        meta:["От задачи → к прототипу","AI-native подход"]
      },
      field: { title:"Карта компетенций", hint:"двигай / тяни / нажимай" },
      query: {
        title:"Portfolio Query",
        status:"Проверка…",
        intro:"Спроси о Тимуре, его работах, проектах, продуктовом подходе или технических решениях.",
        suggestions:[
          ["Проекты","Какие проекты в портфолио?"],
          ["Опыт","Какой у Тимура опыт?"],
          ["Результаты","Какие измеримые результаты у Тимура?"],
          ["AI и автоматизация","Покажи работу с AI и автоматизацией"],
          ["Навыки","Какие навыки у Тимура?"],
          ["Стек","Какой стек ты используешь?"],
          ["Delivery","Расскажи про delivery-опыт Тимура"],
          ["Продуктовый подход","Расскажи про продуктовый подход Тимура"]
        ],
        placeholder:"Спроси обо мне…",
        hint:'Нажми <kbd>/</kbd>, чтобы перейти к вопросу.',
        rolePortfolio:"портфолио",
        roleYou:"вы",
        showProject:"Показать связанный проект ↓",
        deeper:"Выбери, что хочется узнать подробнее про"
      },
      work: {
        title:"Проекты",
        note:"",
        audit:{kind:"Консалтинг процессов",desc:"Проект по анализу и переработке ручного процесса контроля качества коммуникаций.",details:[["Что","Разобрал текущий процесс и перенёс ручные шаги из Google Workspace во внутреннюю CRM."],["Зачем","Собрать работу в одном процессе, сделать её прозрачнее и подготовить основу для дальнейшей автоматизации."],["Особенность","Провёл исследование внешних решений для автоматизации аудита и оценил варианты дальнейшего развития процесса."]],ask:"Спросить подробнее про аудит процессов →"},
        crm:{kind:"B2B-продукт / Delivery",desc:"Развитие B2B CRM-продукта для управления программами лояльности.",details:[["Что","Требования, backlog, планирование и delivery экосистемы из нескольких приложений."],["Зачем","Объединить управление программами лояльности и связанными процессами в одном продукте."],["Особенность","SaaS и on-premise: четыре web-приложения, два mobile-приложения, PostgreSQL и внешние интеграции."]],ask:"Спросить подробнее про CRM-продукт →"},
        bi:{kind:"Аналитика / Operations",desc:"Операционные дашборды, которые собрали разрозненные данные о процессах и показателях в единую систему.",details:[["Что","Построил SQL + BI-отчётность по операционным и продуктовым метрикам для 20 продуктов."],["Зачем","Сократить ручную подготовку отчётов и быстрее замечать отклонения."],["Особенность","Время на регулярную отчётность сократилось примерно на 70%."]],ask:"Спросить подробнее про BI-дашборды →"},
        invoice:{kind:"Автоматизация workflow",desc:"n8n/JavaScript workflow для автоматической подготовки инвойсов удалённым сотрудникам.",details:[["Что","Проверка исходных данных и генерация готового документа по повторяемому сценарию."],["Зачем","Убрать ручную подготовку и снизить риск ошибок в документах."],["Особенность","Один инвойс формировался менее чем за 15 секунд; workflow использовался в реальных ежемесячных циклах."]],ask:"Спросить подробнее про Invoice Automation →"},
        book:{kind:"AI-продукт / Telegram",desc:"Система AI-перевода книг с сохранением прогресса и интерфейсом в Telegram.",details:[["Что","Хранит прогресс перевода, терминологию, стиль и review-state вне одной chat-сессии."],["Зачем","Длинный перевод должен сохранять единый стиль и продолжаться между сессиями."],["Особенность","Telegram-бот — пользовательский интерфейс того же translation workflow."]],ask:"Спросить подробнее про Book Translator →"},
        video:{kind:"AI-автоматизация / Контент",desc:"Автоматизированный pipeline производства коротких видео — от исследования и сценария до рендера и review.",details:[["Что","Объединил n8n, LLM-шаги, TTS, субтитры и FFmpeg-рендер в один workflow."],["Зачем","Сократить повторяющиеся ручные переходы и сделать производство контента воспроизводимым."],["Особенность","Генерация отделена от публикации, поэтому результат можно проверить до выхода."]],ask:"Спросить подробнее про AI Video Pipeline →"},
        tube:{kind:"Consumer product / Browser extension",desc:"Chrome-расширение, которое показывает рейтинги фильмов и сериалов прямо в интерфейсе YouTube.",details:[["Что","Определяет название, детерминированно сопоставляет фильм и показывает рейтинг рядом с metadata видео."],["Зачем","Убрать отдельный поиск рейтинга при выборе фильма или сериала."],["Особенность","Работает без собственного backend, LLM и обязательного API-ключа; browser-flow покрыт smoke-тестами."]],ask:"Спросить подробнее про TubeScore →"},
        lightning:{kind:"AI-продукт / Browser automation",desc:"Браузерный продукт для автоматизации повторяющихся этапов поиска работы на hh.ru.",details:[["Что","AI-обработка вакансий, сопроводительные письма, автоотклики и аналитика эффективности резюме."],["Зачем","Сократить ручную работу при поиске вакансий и при этом измерять результат."],["Особенность","У продукта есть отдельный backend для тарифов, лицензирования и платежей."]],ask:"Спросить подробнее про HH Lightning →"},
        market:{kind:"Data product / Аналитика рынка",desc:"Система сбора и сравнения данных рынка труда по профессиям.",details:[["Что","Browser collector, валидируемые snapshots, история наблюдений и web-интерфейс для анализа."],["Зачем","Сделать исследование профессий и конкуренции воспроизводимым, а не набором разовых ручных проверок."],["Особенность","Система отдельно отмечает неполные или ошибочные данные и хранит фактическую дату сбора, чтобы результаты можно было корректно сравнивать во времени."]],ask:"Спросить подробнее про Job Market Scanner →"},
        feed:{kind:"Agent utility / Content ingestion",desc:"Лёгкая утилита, которая превращает RSS/Atom-источники в предсказуемый контент для AI-агентов.",details:[["Что","Нормализует разные форматы feed в стабильную структуру для дальнейшей обработки."],["Зачем","Чтобы агентам не приходилось заново реализовывать парсинг для каждого источника."],["Особенность","Небольшой набор зависимостей и работа на Windows, macOS и Linux."]],ask:"Спросить подробнее про FeedPulse →"}
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
      footer:["Timur Dautov © 2026","Статическая страница: Query и 3D-поле работают локально в браузере."],
      deep:{
        audit:[["Контекст","Где выполнялся этот проект?"],["Изменения","Что именно изменилось в процессе аудита?"],["Автоматизация","Что из автоматизации реально было внедрено?"]],
        crm:[["Масштаб","Насколько большим был CRM-продукт?"],["Роль","За что отвечал Тимур?"],["Архитектура","Что входило в CRM-экосистему?"]],
        bi:[["Результат","Что изменили BI-дашборды?"],["Стек","На чём были построены дашборды?"],["Контекст","Где выполнялся этот проект?"]],
        invoice:[["Workflow","Как работала автоматизация инвойсов?"],["Результат","Какой был измеримый результат?"],["Контекст","Где выполнялся этот проект?"]],
        book:[["Архитектура","Как Book Translator сохраняет контекст?"],["Telegram","Как Telegram-бот связан с продуктом?"],["Workflow","Как перевод продолжается между сессиями?"]],
        video:[["Workflow","Как устроен AI Video Pipeline?"],["Стек","Что работает локально?"],["Review","Почему публикация отделена от генерации?"]],
        tube:[["Архитектура","Как устроен TubeScore?"],["Matching","Как TubeScore определяет правильный фильм?"],["Тестирование","Как тестировался TubeScore?"]],
        lightning:[["Продукт","Что умеет HH Lightning?"],["Backend","Как устроены лицензии и платежи?"],["AI","Как AI используется в HH Lightning?"]],
        market:[["Архитектура","Как устроен Job Market Scanner?"],["Качество данных","Как он защищается от плохих данных?"],["Сбор","Как сбор продолжается после прерывания?"]],
        feed:[["Архитектура","Как устроен FeedPulse?"],["Форматы","Что нормализует FeedPulse?"],["Переносимость","Как он работает на разных ОС?"]]
      }
    }
  };

  const answers = {
    en:{
      greeting:"Hi. Ask about Timur's projects, work experience, roles, results, technical decisions or product approach.",
      thanks:"You're welcome. You can ask about any project, its context, role, result or technical details.",
      identity:"Timur Dautov is a Product Builder / Delivery Driver with more than 10 years of professional experience. His background combines operations and process leadership, B2B product delivery, analytics, automation and increasingly hands-on software and AI product building.",
      identityMore:"His career did not start as a Product Builder. It evolved from support operations and people management into project/delivery work, B2B product development, analytics and then increasingly hands-on automation, AI and software products. He has led a remote team of 23 assessors plus a trainer, managed delivery of a multi-application B2B CRM and now builds his own browser products and agent-oriented tools.",
      background:"Timur has more than 10 years of total professional experience. At Skyeng he worked in support operations, people/process leadership and analytics; at SPIKS he managed delivery of a B2B Loyalty CRM; at OpiniQ he worked on workflow automation and AI/agentic proof-of-concepts. His recent work is increasingly hands-on: small products, browser tools, integrations and AI workflows.",
      backgroundMore:"The scope is broader than a single PM track: people leadership, KPI systems, process redesign, requirements, backlog and delivery, SQL/BI analytics, CRM migrations, n8n automation, browser extensions, integrations and AI-assisted products. Public resume evidence includes 200+ redesigned processes at Skyeng, 17 full-cycle projects at SPIKS and research of 40+ AI use cases at OpiniQ.",
      years:"More than 10 years of total professional experience. That does not mean 10+ years as a Product Builder: the trajectory moves from support/operations and people management through project/delivery roles into increasingly hands-on automation, AI and product development.",
      tenYearsClarification:"No — the 10+ years refers to total professional experience, not 10 years in the same role. Timur's path moved from support operations and people management into process/project delivery, B2B products and analytics, and later into hands-on automation, AI tooling and software products.",
      assistantIdentity:"You're talking to the portfolio's local assistant, not to Timur personally. It runs in the browser and answers from a curated knowledge base about Timur's experience and projects; when the evidence is insufficient, it should say so rather than invent an answer.",
      hire:"A practical reason to work with Timur is the combination of delivery discipline and hands-on implementation. He can clarify a vague workflow, turn it into requirements and priorities, coordinate people when needed, and also build or automate the first working version himself. Evidence includes leading a 23-person team, managing a B2B CRM program above RUB 20M, cutting reporting work by about 70%, and shipping automation/product prototypes.",
      strengths:"His strongest pattern is working across boundaries that are often split between roles: process discovery, product framing, delivery, analytics and implementation. He is especially useful when a problem is ambiguous, involves several systems or teams, and needs to become a small testable solution rather than a long specification.",
      management:"Timur has direct people-management experience: he led a remote assessment team of 23 specialists plus a trainer, with planning, KPIs, 1:1s, reporting, hiring/onboarding, payroll/bonus processes and process improvement. In project roles he also coordinated cross-functional web, mobile and backend work with teams of up to roughly 30 people.",
      leadership:"His management approach is process- and evidence-oriented: make ownership explicit, define success criteria, surface risks early and reduce unnecessary handoffs. He tends to prefer autonomy and clear responsibility over micromanagement or meeting-heavy coordination.",
      b2b:"His main B2B product example is a Loyalty CRM at SPIKS: a SaaS/on-premise ecosystem with four web applications, two mobile applications, backend, PostgreSQL, payments and external integrations. Timur handled requirements, backlog, planning, priorities, risks, client communication and delivery, with development/support budget above RUB 20M.",
      opensource:"The portfolio includes open-source and public engineering work. FeedPulse is a small cross-platform ingestion utility for AI agents, and Timur has also contributed to hh-applicant-tool with an upstream pull request. His public projects are used to show implementation details rather than only describe management experience.",
      reliability:"A recurring engineering preference is deterministic behavior around AI and automation: explicit state, validation, retries or resumability where needed, observable outputs and human review at risky boundaries. TubeScore uses deterministic matching and browser smoke tests; Job Market Scanner validates snapshots; the video pipeline separates generation from publishing.",
      currentFocus:"The recent focus is on AI-native product building: browser tools, agent utilities, workflow automation, small web products and experiments in reliable agent orchestration. The emphasis is not on adding an LLM everywhere, but on finding where AI actually removes work or enables a new product loop.",
      workStyle:"Timur is most effective in a hands-on role with enough autonomy to investigate the problem, make trade-offs and produce something testable. His preferred balance is closer to building and problem-solving than pure coordination, while still using management skills when a project needs structure.",
      technicalDepth:"He is not positioning himself as a narrow senior software engineer. His technical strength is product-oriented implementation: JavaScript/Node.js, Python, SQL, REST APIs, webhooks, browser APIs, n8n, PostgreSQL, Playwright and web tooling — enough to prototype, integrate, debug and automate real workflows.",
      english:"His English is functional for technical work: he reads documentation in English and uses it in projects. The portfolio does not claim native or fluent spoken English.",
      scope:"Useful scale markers: 23 assessors plus a trainer in direct team leadership; cross-functional teams up to about 30 people; 17 full-cycle projects at SPIKS; BI reporting across 20 products; more than 200 process redesigns at Skyeng; and a B2B CRM development/support budget above RUB 20M.",
      interesting:"A few less obvious facts: Timur has worked both as a people manager and as a hands-on builder; he researched 40+ AI use cases at OpiniQ; he deliberately builds some products without LLMs when deterministic logic is better; and several current projects are designed to run locally or with minimal infrastructure.",
      decisionMaking:"He generally starts with the workflow, constraint and evidence rather than the technology. The pattern is to reduce scope, define a falsifiable success criterion, build the smallest useful version, observe what breaks and only then add complexity.",
      collaboration:"He has worked between business users, operations, developers, technical leads, CTO-level stakeholders and clients. That makes translation between operational language and implementation details one of the more reusable parts of his experience.",
      whatProblems:"The best-fit problems are messy operational or product workflows with repeated manual work, fragmented tools, unclear ownership or a need for a fast MVP. He tends to look for the smallest intervention that removes friction and can be measured.",
      careerPath:"The trajectory is from support and operations into management and process ownership, then project/delivery management for technical and B2B products, and now toward hands-on AI/product building. The shift is evolutionary: the same process and delivery skills are being used closer to the implementation layer.",
      skills:"He works across product discovery, process redesign, delivery, analytics, automation, APIs and lightweight software development. He is comfortable moving from requirements and process mapping to a working prototype or production workflow.",
      skillsMore:"The profile is deliberately cross-functional: product and project management, process consulting, SQL/BI analytics, API integrations, browser automation, JavaScript/Node.js, n8n and AI-assisted workflows.",
      stack:"His practical toolkit includes JavaScript/Node.js, Python, SQL, REST APIs, webhooks, browser APIs, n8n, GitHub, Playwright, PostgreSQL and BI tooling such as Yandex DataLens.",
      stackMore:"Depending on the project he also works with Chrome Manifest V3, service workers and content scripts, Next.js, FFmpeg, TTS, Telegram integrations, YDB, JWT and payment/licensing infrastructure.",
      impact:"Verified results include roughly 70% less time spent on regular reporting, invoice generation in under 15 seconds, about 20% faster processing after moving a manual workflow into CRM, dashboards covering 20 products, and delivery responsibility for a B2B CRM ecosystem with a development/support budget above RUB 20M.",
      impactMore:"Other evidence is less about a single KPI and more about scope: leading a 23-person assessment team plus a trainer, coordinating web/mobile/backend delivery, moving fragmented workflows into CRM, and building reusable automation instead of repeating manual operations.",
      financialImpact:"There is no verified portfolio figure for revenue generated or money saved that can be attributed directly to Timur. The defensible evidence is operational: about 70% less reporting time, about 20% faster processing in a migrated workflow, invoice generation under 15 seconds, and responsibility for a CRM program with a budget above RUB 20M.",
      ai:"AI is used inside working systems rather than as a standalone chat layer. Examples include HH Lightning for AI-assisted vacancy handling and cover letters, Book Translator for long-form translation with persistent state, and AI Video Pipeline for scripted content production.",
      aiMore:"Other AI/agent work includes FeedPulse as an ingestion utility for agents and experiments around controlled workflows, validation and resumability. The recurring pattern is to put deterministic process, state and checks around the model.",
      automation:"Automation starts from a real workflow: identify repetitive handoffs, define inputs and success criteria, automate the repeatable part and keep validation observable. Examples include Invoice Automation, BI/reporting workflows and migration of manual process steps into CRM.",
      product:"His usual product loop is: understand the workflow and user problem, reduce scope, build the smallest useful version, verify it against reality and iterate from evidence rather than adding complexity first.",
      projectsOverview:"The portfolio combines four business cases and six hands-on products. Business cases: Audit Process Consulting, CRM Product Development, Operations & BI Dashboards and Invoice Automation. Product work: Book Translator, AI Video Pipeline, TubeScore, HH Lightning, Job Market Scanner and FeedPulse.",
      projectsMore:"The projects cover different layers of the same profile: process consulting and delivery, analytics and workflow automation, consumer/browser products, AI-assisted workflows and small infrastructure utilities. Each project card stays concise; the Query can expose role, company context, result, architecture and stack.",
      project:{
        audit:{
          overview:"Audit Process Consulting was a process-analysis and redesign project around a manual communication-quality audit workflow.",
          company:"This work was done at Skyeng.",
          role:"Timur worked between operations and IT: mapped the current workflow, clarified requirements and helped move manual quality-control steps into the internal CRM.",
          result:"The implemented part was the migration of manual process steps from Google Workspace into the internal CRM, improving processing speed by about 20% and making metric tracking more transparent.",
          detail:"Researched external solutions for audit automation and evaluated options for further development of the process.",
          stack:"The work involved Google Workspace, the internal CRM, process mapping, requirements analysis and evaluation of external automation approaches."
        },
        crm:{
          overview:"CRM Product Development was the development and delivery of a B2B Loyalty CRM product across web, mobile, backend and integrations.",
          company:"This project was at SPIKS.",
          role:"Timur worked as an IT Project Manager with end-to-end responsibility for requirements, backlog, planning, priorities, risks, resources, client communication and delivery to release.",
          result:"The product was a SaaS/on-premise ecosystem with four web apps, two mobile apps, a shared backend, PostgreSQL, payments and external integrations. The development/support budget exceeded RUB 20M.",
          detail:"He also coordinated full development packages with CTO, technical leads and clients and worked across product behavior, integrations and release support.",
          stack:"Web and mobile applications, backend, PostgreSQL, payment integrations, external APIs, monitoring and on-premise deployment."
        },
        bi:{
          overview:"Operations & BI Dashboards was an analytics initiative that consolidated operational and product metrics into reusable dashboards.",
          company:"This work was done at Skyeng.",
          role:"Timur designed the reporting approach around operational needs and built the dashboard layer using SQL and DataLens.",
          result:"The dashboards covered 20 products and reduced the time spent preparing regular reporting by about 70%.",
          detail:"The goal was not just visualization: it replaced repeated manual reporting and made process deviations easier to notice.",
          stack:"SQL, Yandex DataLens and operational data sources."
        },
        invoice:{
          overview:"Invoice Automation is an n8n/JavaScript workflow for preparing invoices for remote employees.",
          company:"This project was implemented at OpiniQ.",
          role:"Timur independently designed and implemented the workflow from requirements and data validation through testing, documentation and production use.",
          result:"One invoice was generated in under 15 seconds, and the workflow was used by accounting across real monthly cycles.",
          detail:"Email sending was technically implemented during development, but production email distribution was not launched; the verified production result is automated invoice generation.",
          stack:"n8n, JavaScript, data validation, document generation and workflow automation."
        },
        book:{
          overview:"Book Translator is an AI-assisted long-form translation system combined with a Telegram bot as the user-facing layer.",
          company:"This is Timur's own project.",
          role:"He designed the workflow so translation state survives individual AI sessions instead of depending on chat history.",
          result:"The system stores progress, translated units, glossary, style guide and review state so work can continue consistently across sessions.",
          detail:"The Telegram bot and the translation workflow are treated as one product rather than separate portfolio projects.",
          stack:"Agent workflow, persistent workspace state, terminology/style management and Telegram interface."
        },
        video:{
          overview:"AI Video Pipeline automates short-form content production from research and scripting through voice, subtitles, rendering and review.",
          company:"This is Timur's own automation project.",
          role:"He designed the workflow and control boundaries around the content-production process.",
          result:"The pipeline connects repeatable generation steps into one flow while keeping publishing as a separate, reviewable action.",
          detail:"The system intentionally does not treat publishing as an invisible unattended step; generation can stop at review-ready output.",
          stack:"n8n, local LLMs, FFmpeg, TTS, subtitles and local control tooling."
        },
        tube:{
          overview:"TubeScore is a Chrome/Chromium extension that identifies a movie or series on YouTube and shows its rating in the viewing context.",
          company:"This is Timur's own product project.",
          role:"He designed and built the MVP with deterministic matching and a zero-secret production runtime.",
          result:"The extension works without its own backend, LLM or required API key and has automated browser checks for rendering and YouTube SPA navigation.",
          detail:"The main engineering challenge was reliable title matching and lifecycle behavior on YouTube, not the visual rating badge.",
          stack:"Manifest V3, JavaScript/TypeScript, content scripts, service worker, Wikidata, caching and Playwright/Chromium smoke tests."
        },
        lightning:{
          overview:"HH Lightning is a browser product for automating repetitive parts of the job-search workflow on hh.ru.",
          company:"This is Timur's own product project.",
          role:"He develops both the Chrome extension and the product infrastructure around access, tariffs and payments.",
          result:"The extension combines AI-assisted vacancy handling, cover-letter generation, automated responses and resume analytics.",
          detail:"The same product includes a separate license/payment backend with tariffs, entitlement logic and payment handling.",
          stack:"Chrome Manifest V3, JavaScript, browser APIs, AI integration, Node.js backend, YooKassa, YDB, JWT and licensing logic."
        },
        market:{
          overview:"Job Market Scanner is a data product for collecting and comparing labor-market signals across professions.",
          company:"This is Timur's own product project.",
          role:"He designed the collection, data-contract and web-application flow with an emphasis on reliable market snapshots.",
          result:"The system combines a resumable browser collector, validated snapshots, history and a Next.js interface for analysis.",
          detail:"The system flags incomplete or invalid observations and keeps the actual collection date so market results can be compared correctly over time.",
          stack:"Chrome Manifest V3, versioned data contracts, file-backed persistence, Next.js, deterministic fixtures and production-build verification."
        },
        feed:{
          overview:"FeedPulse is a lightweight content-ingestion utility for AI agents.",
          company:"This is Timur's own open-source utility inside tim8skills.",
          role:"He designed it as a small reusable layer rather than making every agent reimplement feed parsing.",
          result:"It normalizes RSS/Atom-style sources into predictable bounded content for downstream processing.",
          detail:"The implementation intentionally keeps the dependency surface small and targets Windows, macOS and Linux.",
          stack:"Node.js, XML/feed parsing and cross-platform CLI-style workflow."
        }
      },
      unknown:"I don't have a reliable local answer to that. Try asking about a named project, company/context, role, result, stack or Timur's background."
    },
    ru:{
      greeting:"Привет. Можно спросить про проекты Тимура, опыт, роль, результат, технические решения или продуктовый подход.",
      thanks:"Пожалуйста. Можно спросить подробнее про любой проект: контекст, компанию, роль, результат или технологии.",
      identity:"Тимур Даутов — Product Builder / Delivery Driver с более чем 10 годами профессионального опыта. Профиль сочетает управление процессами и delivery, B2B-продукты, аналитику, автоматизацию и всё более hands-on разработку software/AI-продуктов.",
      identityMore:"Карьера Тимура начиналась не с Product Builder. Она развивалась от поддержки, operations и people management к управлению проектами и delivery, B2B-продуктам, аналитике, а затем — ко всё более hands-on автоматизации, AI и разработке software-продуктов. Он руководил удалённой командой из 23 асессоров и тренера, управлял delivery сложной B2B CRM и сейчас строит собственные browser-продукты и agent-инструменты.",
      background:"У Тимура более 10 лет общего профессионального опыта. В Skyeng он прошёл через support operations, управление людьми/процессами и аналитику; в SPIKS управлял delivery B2B Loyalty CRM; в OpiniQ занимался workflow-автоматизацией и AI/agentic PoC. Последние проекты всё более hands-on: небольшие продукты, browser tools, интеграции и AI-workflow.",
      backgroundMore:"Опыт шире одного PM-трека: people management, KPI-системы, process redesign, требования, backlog и delivery, SQL/BI-аналитика, CRM-миграции, n8n-автоматизация, browser extensions, интеграции и AI-продукты. В публичном резюме есть масштаб: 200+ переработанных процессов в Skyeng, 17 full-cycle проектов в SPIKS и исследование 40+ AI-кейсов в OpiniQ.",
      years:"Более 10 лет общего профессионального опыта. Это не означает 10+ лет именно как Product Builder: траектория идёт от поддержки/operations и people management через project/delivery роли к всё более hands-on автоматизации, AI и разработке продуктов.",
      tenYearsClarification:"Нет. 10+ лет — это общий профессиональный опыт, а не десять лет в одной роли. Тимур прошёл путь от поддержки, operations и управления людьми к процессам и project/delivery, B2B-продуктам и аналитике, а затем — к hands-on автоматизации, AI-инструментам и software-продуктам.",
      assistantIdentity:"Сейчас отвечает локальный ассистент портфолио, а не сам Тимур. Он работает в браузере и отвечает из curated knowledge base о проектах и опыте Тимура; если подтверждённых данных недостаточно, он должен прямо это сказать, а не придумывать.",
      hire:"Практическая причина работать с Тимуром — сочетание delivery-дисциплины и hands-on реализации. Он может разобрать неясный workflow, превратить его в требования и приоритеты, организовать людей, если это нужно, и сам собрать или автоматизировать первую работающую версию. Из подтверждённых примеров: команда 23+1, B2B CRM с бюджетом разработки/поддержки свыше 20 млн ₽, сокращение времени отчётности примерно на 70% и собственные automation/product-прототипы.",
      strengths:"Сильный паттерн Тимура — работа на стыке ролей, которые часто разделены: исследование процесса, продуктовое формулирование, delivery, аналитика и реализация. Особенно полезен там, где задача неоднозначная, затрагивает несколько систем или команд и её нужно быстро превратить в небольшое проверяемое решение, а не только в длинное ТЗ.",
      management:"У Тимура есть прямой people-management опыт: он руководил удалённой командой из 23 асессоров и тренера — планирование, KPI, 1:1, отчётность, найм/onboarding, расчёт бонусов и улучшение процессов. В проектных ролях также координировал cross-functional web/mobile/backend работу с командами примерно до 30 человек.",
      leadership:"Подход к управлению — через процесс и доказательства: явно фиксировать владельцев, критерии результата и риски, сокращать лишние handoff'ы. Тимуру ближе автономия и понятная ответственность, чем микроменеджмент и большое количество встреч.",
      b2b:"Главный B2B-пример — Loyalty CRM в SPIKS: SaaS/on-premise экосистема из четырёх web-приложений, двух mobile-приложений, backend, PostgreSQL, платежей и внешних интеграций. Тимур отвечал за требования, backlog, планирование, приоритеты, риски, коммуникацию с клиентом и delivery; бюджет разработки/поддержки превышал 20 млн ₽.",
      opensource:"В портфолио есть open-source и публичная инженерная работа. FeedPulse — небольшая cross-platform ingestion-утилита для AI-агентов; также Тимур делал вклад в hh-applicant-tool через upstream pull request. Публичные проекты нужны не только как описание опыта, но и как проверяемые примеры реализации.",
      reliability:"В автоматизации и AI повторяется инженерный принцип: детерминированное поведение вокруг модели, явное состояние, валидация, retries/resumability где это нужно, наблюдаемые результаты и human review на рискованных границах. TubeScore использует deterministic matching и browser smoke tests; Job Market Scanner валидирует snapshots; video pipeline отделяет генерацию от публикации.",
      currentFocus:"Текущий фокус — AI-native product building: browser tools, agent utilities, workflow automation, небольшие web-продукты и эксперименты с надёжной оркестрацией агентов. Идея не в том, чтобы добавлять LLM везде, а в том, чтобы находить места, где AI реально убирает работу или создаёт новый полезный product loop.",
      workStyle:"Тимур наиболее эффективен в hands-on роли с достаточной автономией, чтобы самому исследовать проблему, принимать trade-off'ы и доводить её до тестируемого результата. Ему ближе баланс с большей долей построения и problem solving, чем чистая координация, но management-навыки используются там, где проекту нужна структура.",
      technicalDepth:"Тимур не позиционирует себя как узкого senior software engineer. Его техническая сила — product-oriented implementation: JavaScript/Node.js, Python, SQL, REST API, webhooks, browser APIs, n8n, PostgreSQL, Playwright и web tooling — достаточно, чтобы прототипировать, интегрировать, отлаживать и автоматизировать реальные workflow.",
      english:"Английский функционален для технической работы: Тимур читает документацию на английском и использует её в проектах. Портфолио не заявляет native или свободный разговорный уровень.",
      scope:"Несколько маркеров масштаба: 23 асессора + тренер в прямом управлении; cross-functional команды примерно до 30 человек; 17 full-cycle проектов в SPIKS; BI-отчётность для 20 продуктов; 200+ переработанных процессов в Skyeng; бюджет разработки/поддержки B2B CRM свыше 20 млн ₽.",
      interesting:"Несколько менее очевидных фактов: Тимур успел побыть и people manager, и hands-on builder; исследовал 40+ AI-кейсов в OpiniQ; осознанно строит часть продуктов без LLM, когда детерминированная логика лучше; несколько текущих проектов рассчитаны на локальную работу или минимальную инфраструктуру.",
      decisionMaking:"Обычно Тимур начинает с workflow, ограничения и доказательств, а не с технологии. Паттерн такой: сузить scope, определить проверяемый критерий успеха, собрать минимально полезную версию, посмотреть, что ломается, и только потом добавлять сложность.",
      collaboration:"Он работал между бизнес-пользователями, operations, разработчиками, техническими лидами, CTO-level стейкхолдерами и клиентами. Поэтому перевод операционной задачи в понятные требования и implementation details — одна из наиболее повторяемых частей его опыта.",
      whatProblems:"Лучше всего подходят неструктурированные операционные или продуктовые задачи: много ручной работы, разрозненные инструменты, неясное ownership или необходимость быстро собрать MVP. Обычно Тимур ищет минимальное вмешательство, которое снимает friction и позволяет измерить эффект.",
      careerPath:"Траектория: support и operations → управление людьми и процессами → project/delivery management технических и B2B-продуктов → hands-on AI/product building. Это не резкая смена профессии, а постепенное приближение тех же process/delivery навыков к уровню реализации.",
      skills:"Работает на стыке product discovery, process redesign, delivery, аналитики, автоматизации, API и lightweight-разработки. Может пройти путь от требований и карты процесса до работающего прототипа или production-workflow.",
      skillsMore:"Профиль намеренно кросс-функциональный: product/project management, process consulting, SQL/BI, API-интеграции, browser automation, JavaScript/Node.js, n8n и AI-workflow.",
      stack:"Практический стек: JavaScript/Node.js, Python, SQL, REST API, webhooks, browser API, n8n, GitHub, Playwright, PostgreSQL и BI-инструменты, включая Yandex DataLens.",
      stackMore:"В отдельных проектах также используются Chrome Manifest V3, service workers/content scripts, Next.js, FFmpeg, TTS, Telegram-интеграции, YDB, JWT и инфраструктура лицензирования/платежей.",
      impact:"Подтверждённые результаты: примерно −70% времени на регулярную отчётность, генерация инвойса менее чем за 15 секунд, около +20% к скорости обработки после переноса процесса в CRM, дашборды для 20 продуктов и delivery B2B CRM с бюджетом разработки/поддержки более 20 млн ₽.",
      impactMore:"Есть и результаты, которые лучше описываются масштабом ответственности: руководство командой из 23 асессоров и тренера, координация web/mobile/backend delivery, перенос разрозненных процессов в CRM и создание переиспользуемых автоматизаций вместо повторяющейся ручной работы.",
      financialImpact:"Подтверждённой суммы выручки или экономии денег, которую корректно напрямую приписать Тимуру, в портфолио нет. Есть измеримые операционные результаты: около −70% времени на отчётность, около +20% скорости обработки процесса, инвойс менее чем за 15 секунд и ответственность за CRM-программу с бюджетом более 20 млн ₽.",
      ai:"AI используется внутри рабочих систем, а не только как чат. Примеры: HH Lightning — AI-обработка вакансий и сопроводительных писем; Book Translator — длинный перевод с сохранением состояния; AI Video Pipeline — производство короткого контента по управляемому pipeline.",
      aiMore:"Дополнительно есть FeedPulse как ingestion-утилита для AI-агентов и эксперименты с контролируемыми workflow, validation и resumability. Повторяющийся принцип — окружать модель детерминированным процессом, состоянием и проверками.",
      automation:"Автоматизация начинается с реального workflow: найти повторяющиеся handoff'ы, определить входы и критерии результата, автоматизировать повторяемую часть и оставить проверки наблюдаемыми. Примеры — Invoice Automation, BI/reporting и перенос ручных шагов процесса в CRM.",
      product:"Обычный продуктовый цикл: понять workflow и пользовательскую проблему, жёстко сократить scope, собрать минимально полезную версию, проверить её на реальности и только затем усложнять.",
      projectsOverview:"Портфолио объединяет четыре бизнес-кейса и шесть hands-on продуктов. Бизнес-кейсы: Audit Process Consulting, CRM Product Development, Operations & BI Dashboards и Invoice Automation. Продукты: Book Translator, AI Video Pipeline, TubeScore, HH Lightning, Job Market Scanner и FeedPulse.",
      projectsMore:"Проекты показывают разные стороны одного профиля: process consulting и delivery, аналитику и workflow automation, browser/consumer продукты, AI-workflow и небольшие инфраструктурные утилиты. В карточках оставлен минимум, а через Query можно раскрыть роль, компанию, результат, архитектуру и стек.",
      project:{
        audit:{
          overview:"Audit Process Consulting — анализ и переработка ручного процесса контроля качества коммуникаций.",
          company:"Этот проект выполнялся в Skyeng.",
          role:"Тимур работал на стыке operations и IT: разобрал текущий workflow, уточнял требования и участвовал в переносе ручных шагов контроля качества во внутреннюю CRM.",
          result:"Реально внедрённая часть — перенос ручных процессов из Google Workspace во внутреннюю CRM. Это повысило скорость обработки примерно на 20% и сделало отслеживание метрик прозрачнее.",
          detail:"Провёл исследование внешних решений для автоматизации аудита и оценил варианты дальнейшего развития процесса.",
          stack:"Google Workspace, внутренняя CRM, process mapping, требования и исследование решений автоматизации."
        },
        crm:{
          overview:"CRM Product Development — развитие B2B Loyalty CRM с web-, mobile-, backend-частью и внешними интеграциями.",
          company:"Проект выполнялся в SPIKS.",
          role:"Тимур работал IT Project Manager и отвечал за требования, backlog, планирование, приоритеты, риски, ресурсы, коммуникацию с клиентом и delivery до релиза.",
          result:"Продукт представлял собой SaaS/on-premise экосистему из четырёх web-приложений, двух mobile-приложений, общего backend, PostgreSQL, платежей и внешних интеграций. Бюджет разработки и поддержки превышал 20 млн ₽.",
          detail:"Также Тимур координировал полные пакеты разработки вместе с CTO, tech leads и клиентами и сопровождал изменения до релиза.",
          stack:"Web/mobile приложения, backend, PostgreSQL, платежные интеграции, внешние API, monitoring и on-premise."
        },
        bi:{
          overview:"Operations & BI Dashboards — система операционной аналитики, которая объединила показатели процессов и продуктов в повторно используемые дашборды.",
          company:"Этот проект выполнялся в Skyeng.",
          role:"Тимур спроектировал подход к отчётности под операционные задачи и собрал dashboard-слой на SQL + DataLens.",
          result:"Дашборды покрывали 20 продуктов и сократили время на регулярную подготовку отчётности примерно на 70%.",
          detail:"Задача была не только в визуализации: решение заменяло повторяющуюся ручную отчётность и помогало раньше замечать отклонения.",
          stack:"SQL, Yandex DataLens и операционные источники данных."
        },
        invoice:{
          overview:"Invoice Automation — n8n/JavaScript workflow для автоматической подготовки инвойсов удалённым сотрудникам.",
          company:"Проект был реализован в OpiniQ.",
          role:"Тимур самостоятельно спроектировал и реализовал workflow: от требований и проверки данных до тестирования, документации и production-use.",
          result:"Один инвойс формировался менее чем за 15 секунд; workflow использовался бухгалтерией в реальных ежемесячных циклах.",
          detail:"Email-отправка была технически реализована в разработке, но production-рассылка не запускалась. Подтверждённый production-результат — автоматическая генерация инвойсов.",
          stack:"n8n, JavaScript, проверка данных, генерация документов и workflow automation."
        },
        book:{
          overview:"Book Translator — система AI-перевода длинных книг, объединённая с Telegram-ботом как пользовательским интерфейсом.",
          company:"Это собственный проект Тимура.",
          role:"Workflow спроектирован так, чтобы состояние перевода сохранялось между AI-сессиями и не зависело только от истории чата.",
          result:"Система хранит прогресс, переведённые блоки, glossary, style guide и review-state, поэтому работу можно продолжать последовательно между сессиями.",
          detail:"Telegram-бот и translation workflow рассматриваются как один продукт, а не как два отдельных проекта.",
          stack:"Agent workflow, persistent workspace state, terminology/style management и Telegram interface."
        },
        video:{
          overview:"AI Video Pipeline автоматизирует производство коротких видео от исследования и сценария до озвучки, субтитров, рендера и review.",
          company:"Это собственный automation-проект Тимура.",
          role:"Тимур спроектировал workflow и контрольные границы процесса производства контента.",
          result:"Повторяющиеся этапы объединены в один pipeline, при этом публикация остаётся отдельным проверяемым действием.",
          detail:"Система намеренно может остановиться на review-ready результате и не превращает публикацию в невидимый полностью unattended шаг.",
          stack:"n8n, локальные LLM, FFmpeg, TTS, субтитры и локальные control-инструменты."
        },
        tube:{
          overview:"TubeScore — Chrome/Chromium extension, который определяет фильм или сериал на YouTube и показывает рейтинг прямо в контексте просмотра.",
          company:"Это собственный продуктовый проект Тимура.",
          role:"Тимур спроектировал и собрал MVP с детерминированным matching и production runtime без секретов.",
          result:"Расширение работает без собственного backend, LLM и обязательного API-ключа; browser-flow проверяется автоматизированными smoke-тестами.",
          detail:"Основная инженерная сложность — корректный matching названия и lifecycle на YouTube SPA, а не сама визуальная карточка рейтинга.",
          stack:"Manifest V3, JavaScript/TypeScript, content scripts, service worker, Wikidata, caching и Playwright/Chromium smoke tests."
        },
        lightning:{
          overview:"HH Lightning — браузерный продукт для автоматизации повторяющихся этапов поиска работы на hh.ru.",
          company:"Это собственный продукт Тимура.",
          role:"Он развивает Chrome extension и инфраструктуру продукта вокруг доступа, тарифов и платежей.",
          result:"Расширение объединяет AI-обработку вакансий, генерацию сопроводительных писем, автоотклики и аналитику эффективности резюме.",
          detail:"В состав того же продукта входит отдельный license/payment backend с тарифами, entitlement-логикой и обработкой платежей.",
          stack:"Chrome Manifest V3, JavaScript, browser API, AI integration, Node.js backend, YooKassa, YDB, JWT и licensing logic."
        },
        market:{
          overview:"Job Market Scanner — data product для сбора и сравнения сигналов рынка труда по профессиям.",
          company:"Это собственный продукт Тимура.",
          role:"Тимур спроектировал сбор данных, data contracts и web-приложение с акцентом на надёжные market snapshots.",
          result:"Система объединяет resumable browser collector, валидируемые snapshots, историю и Next.js-интерфейс анализа.",
          detail:"Система отдельно отмечает неполные или ошибочные данные и хранит фактическую дату сбора, чтобы результаты можно было корректно сравнивать во времени.",
          stack:"Chrome Manifest V3, versioned data contracts, file-backed persistence, Next.js, deterministic fixtures и production-build verification."
        },
        feed:{
          overview:"FeedPulse — лёгкая утилита ingestion контента для AI-агентов.",
          company:"Это собственная open-source утилита Тимура внутри tim8skills.",
          role:"Она спроектирована как небольшой переиспользуемый слой, чтобы агентам не приходилось заново реализовывать feed parsing.",
          result:"FeedPulse нормализует RSS/Atom-источники в предсказуемый bounded content для последующей обработки.",
          detail:"Реализация намеренно сохраняет небольшой dependency surface и рассчитана на Windows, macOS и Linux.",
          stack:"Node.js, XML/feed parsing и cross-platform workflow."
        }
      },
      unknown:"В локальной базе нет надёжного ответа на этот вопрос. Можно спросить про конкретный проект, компанию/контекст, роль, результат, стек или опыт Тимура."
    }
  };

  function qlang(text){
    const c=(text.match(/[А-Яа-яЁё]/g)||[]).length;
    const l=(text.match(/[A-Za-zА-Яа-яЁё]/g)||[]).length;
    return l&&c/l>.25?"ru":state.lang;
  }
  function norm(v){return String(v||"").toLowerCase().replace(/ё/g,"е").replace(/[^a-zа-я0-9\s.&/-]/gi," ").replace(/\s+/g," ").trim();}
  function hasAny(q,arr){return arr.some(x=>q.includes(norm(x)));}
  function startsWithPhrase(q,phrases){return phrases.some(p=>q===norm(p)||q.startsWith(norm(p)+" "));}
  function looksLikeGreeting(q){return startsWithPhrase(q,["привет","здравствуй","здравствуйте","добрый день","добрый вечер","hello","hi","hey"]);}
  function looksLikeThanks(q){return startsWithPhrase(q,["спасибо","благодарю","thanks","thank you"]);}
  function isMore(q){return hasAny(q,["что еще","что ещё","расскажи еще","расскажи ещё","а еще","а ещё","это все","это всё","и это все","и это всё","больше ничего","what else","tell me more","anything else","is that all","that's all"]);}

  const projectTerms={
    audit:["audit process","audit consulting","аудит процесс","аудит процессов","контроль качества"],
    crm:["crm product","crm product development","loyalty crm","crm система","crm-система"],
    bi:["operations & bi","bi dashboards","дашборд","datalens","операционная аналитика"],
    invoice:["invoice automation","invoice","инвойс","инвойсов"],
    book:["book translator","перевод книг","переводчик книг"],
    video:["ai video pipeline","video pipeline","youtube shorts","shorts pipeline","видео pipeline"],
    tube:["tubescore","tube score"],
    lightning:["hh lightning","headhunter lightning"],
    market:["job market scanner","market scanner","professions statistics","сканер рынка"],
    feed:["feedpulse","feed pulse"]
  };
  const selectedProjects=new Set(Object.keys(projectTerms));

  function mentionsGlobalPerson(q){
    return hasAny(q,["тимур","ты ","тебя","твой","твои","your ","you ","timur"]);
  }

  function projectFollowup(q){
    return hasAny(q,["этот проект","этого проекта","в проекте","по проекту","в нем","в нём","там","его архитект","его стек","this project","the project","in it","its stack","its architecture"]);
  }

  function resolveSubject(q){
    for(const [id,terms] of Object.entries(projectTerms)){
      if(terms.some(term=>q.includes(norm(term)))) return id;
    }
    if(mentionsGlobalPerson(q)) return "timur";
    if(selectedProjects.has(state.lastSubject) && (isMore(q)||projectFollowup(q))) return state.lastSubject;
    return "timur";
  }

  function projectResult(lang,id,q){
    const p=answers[lang].project[id];
    if(!p)return null;

    let text;
    let intent="project-overview";
    if(hasAny(q,["где","компан","контекст","where","company","employer"])){
      text=p.company;intent="project-company";
    }else if(hasAny(q,["роль","отвечал","responsib","role","what did timur do"])){
      text=p.role+" "+p.result;intent="project-role";
    }else if(hasAny(q,["результат","метрик","цифр","эффект","result","impact","metric","scale","масштаб"])){
      text=p.result+" "+p.detail;intent="project-result";
    }else if(hasAny(q,["стек","технолог","архитект","как устро","stack","technology","architecture","how built"])){
      text=p.stack+" "+p.detail;intent="project-stack";
    }else if(isMore(q)||hasAny(q,["подробнее","больше","more detail","more about"])){
      text=p.role+" "+p.detail+" "+p.stack;intent="project-more";
    }else if(hasAny(q,["нюанс","огранич","почему","реально","фактически","качество","плох","ошиб","detail","constraint","why","hard","quality","bad data","freshness"])){
      text=p.detail+" "+p.result;intent="project-detail";
    }else{
      text=p.overview+" "+p.result+" "+p.detail;
    }
    return {lang,intent,text,subject:id,project:id};
  }

  function followupResult(lang,q){
    const a=answers[lang];
    const intent=state.lastIntent;
    if(selectedProjects.has(state.lastSubject)) return projectResult(lang,state.lastSubject,q);

    if(intent==="projects"||intent==="projects-more") return {lang,intent:"projects-more",text:a.projectsMore,subject:"timur"};
    if(intent==="impact"||intent==="impact-more") return {lang,intent:"impact-more",text:a.impactMore,subject:"timur"};
    if(intent==="ai"||intent==="ai-more"||intent==="current-focus") return {lang,intent:"ai-more",text:a.aiMore+" "+a.currentFocus,subject:"timur"};
    if(intent==="background"||intent==="background-more"||intent==="years"||intent==="years-clarification"||intent==="career-path") return {lang,intent:"background-more",text:a.backgroundMore+" "+a.careerPath,subject:"timur"};
    if(intent==="identity"||intent==="identity-more"||intent==="assistant-identity") return {lang,intent:"identity-more",text:a.identityMore+" "+a.interesting,subject:"timur"};
    if(intent==="skills"||intent==="skills-more"||intent==="strengths"||intent==="technical-depth") return {lang,intent:"skills-more",text:a.skillsMore+" "+a.strengths,subject:"timur"};
    if(intent==="stack"||intent==="stack-more") return {lang,intent:"stack-more",text:a.stackMore,subject:"timur"};
    if(intent==="management"||intent==="leadership") return {lang,intent:"leadership",text:a.management+" "+a.leadership,subject:"timur"};
    if(intent==="hire"||intent==="work-style") return {lang,intent:"hire",text:a.hire+" "+a.workStyle,subject:"timur"};
    if(intent==="scope"||intent==="interesting") return {lang,intent:"scope",text:a.scope+" "+a.interesting,subject:"timur"};
    if(intent==="automation"||intent==="reliability") return {lang,intent:"reliability",text:a.reliability+" "+a.automation,subject:"timur"};
    return {lang,intent:"identity-more",text:a.identityMore+" "+a.interesting,subject:"timur"};
  }

  function classify(raw){
    const q=norm(raw), lang=qlang(raw), a=answers[lang];
    if(!q)return{lang,intent:"empty",text:"",subject:state.lastSubject};
    if(looksLikeGreeting(q))return{lang,intent:"greeting",text:a.greeting,subject:"timur"};
    if(looksLikeThanks(q))return{lang,intent:"thanks",text:a.thanks,subject:state.lastSubject};

    const subject=resolveSubject(q);
    if(subject!=="timur") return projectResult(lang,subject,q);

    if(hasAny(q,["кто мне отвечает","кто отвечает","ты кто","кто ты","что ты такое","who are you","who is answering","who am i talking to"]))return{lang,intent:"assistant-identity",text:a.assistantIdentity,subject:"timur"};
    if(hasAny(q,["все 10 лет","всё 10 лет","все десять лет","всё десять лет","10 лет этим","10 лет так","all 10 years","the whole 10 years"]))return{lang,intent:"years-clarification",text:a.tenYearsClarification,subject:"timur"};
    if(hasAny(q,["почему я должен нанять","почему нанять","зачем нанимать","почему я должен работать с тимур","почему работать с тимур","почему стоит работать","чем полезен тимур","зачем работать с тимур","why hire","why should i hire","why work with timur","why should we work with"]))return{lang,intent:"hire",text:a.hire,subject:"timur"};
    if(hasAny(q,["сильные стороны","в чем силен","в чём силен","главная сила","strengths","strong at","what is he good at"]))return{lang,intent:"strengths",text:a.strengths,subject:"timur"};
    if(hasAny(q,["управлял команд","руководил команд","people management","управление людьми","менеджмент команды","team management","managed a team"]))return{lang,intent:"management",text:a.management,subject:"timur"};
    if(hasAny(q,["стиль управления","как руководит","как управляет","leadership style","management style"]))return{lang,intent:"leadership",text:a.leadership,subject:"timur"};
    if(hasAny(q,["b2b","б2б","loyalty crm"]))return{lang,intent:"b2b",text:a.b2b,subject:"timur"};
    if(hasAny(q,["open source","opensource","опенсорс","open-source","вклад в github","contribution"]))return{lang,intent:"opensource",text:a.opensource,subject:"timur"};
    if(hasAny(q,["надежност","надёжност","тестир","валидац","качество автоматизац","reliability","testing","validation"]))return{lang,intent:"reliability",text:a.reliability,subject:"timur"};
    if(hasAny(q,["сейчас занимается","сейчас делает","текущий фокус","над чем работает","current focus","working on now","currently building"]))return{lang,intent:"current-focus",text:a.currentFocus,subject:"timur"};
    if(hasAny(q,["как работает","стиль работы","формат работы","work style","way of working"]))return{lang,intent:"work-style",text:a.workStyle,subject:"timur"};
    if(hasAny(q,["насколько техничес","технический уровень","умеет программировать","кодит","technical depth","how technical","can he code"]))return{lang,intent:"technical-depth",text:a.technicalDepth,subject:"timur"};
    if(hasAny(q,["английский","english level","english"]))return{lang,intent:"english",text:a.english,subject:"timur"};
    if(hasAny(q,["масштаб опыта","сколько проектов","сколько процессов","размер команды","масштаб","scope","how many projects","team size"]))return{lang,intent:"scope",text:a.scope,subject:"timur"};
    if(hasAny(q,["интересные факты","что необычного","что интересного","interesting facts","fun facts","something interesting"]))return{lang,intent:"interesting",text:a.interesting,subject:"timur"};
    if(hasAny(q,["как принимает решения","как думает","подход к решениям","decision making","how does he decide"]))return{lang,intent:"decision-making",text:a.decisionMaking,subject:"timur"};
    if(hasAny(q,["с кем работал","стейкхолдер","взаимодейств","коммуникац","collaboration","stakeholders"]))return{lang,intent:"collaboration",text:a.collaboration,subject:"timur"};
    if(hasAny(q,["какие задачи","какие проблемы","лучше всего подходит","best fit","what problems","what kind of problems"]))return{lang,intent:"best-fit",text:a.whatProblems,subject:"timur"};
    if(hasAny(q,["карьерный путь","как развивалась карьера","как пришел","как пришёл","career path","career trajectory"]))return{lang,intent:"career-path",text:a.careerPath,subject:"timur"};

    if(hasAny(q,["сколько денег","сколько заработ","сколько сэконом","деньги помог","заработал","сэкономил","revenue generated","money saved","how much money"]))return{lang,intent:"financial-impact",text:a.financialImpact,subject:"timur"};
    if(q==="лет"||hasAny(q,["сколько лет опыта","сколько опыта","лет опыта","years of experience","how many years"]))return{lang,intent:"years",text:a.years,subject:"timur"};

    if(hasAny(q,["подробнее про проекты","больше про проекты","проекты подробнее","more about projects"]))return{lang,intent:"projects-more",text:a.projectsOverview+" "+a.projectsMore,subject:"timur"};
    if(hasAny(q,["больше результатов","еще результаты","ещё результаты","другие результаты","more results","more impact"]))return{lang,intent:"impact-more",text:a.impactMore,subject:"timur"};
    if(hasAny(q,["чем еще занимался","чем ещё занимался","что еще делал","что ещё делал","what else did he do"]))return{lang,intent:"background-more",text:a.backgroundMore,subject:"timur"};
    if(hasAny(q,["что еще о тимуре","что ещё о тимуре","more about timur"]))return{lang,intent:"identity-more",text:a.identityMore,subject:"timur"};
    if(isMore(q)||q==="подробнее"||q==="больше") return followupResult(lang,q);

    if(hasAny(q,["проект","проекты","портфолио","работы","projects","portfolio","what did he build"]))return{lang,intent:"projects",text:a.projectsOverview,subject:"timur"};
    if(hasAny(q,["результат","метрик","цифр","эффект","достижен","impact","results","metrics","achievement"]))return{lang,intent:"impact",text:a.impact,subject:"timur"};
    if(hasAny(q,["где работал","компан","опыт","карьер","чем занимался","career","experience","background","where worked"]))return{lang,intent:"background",text:a.background,subject:"timur"};
    if(hasAny(q,["стек","технолог","tools","stack","technology","javascript","node","python","sql","api","webhook"]))return{lang,intent:"stack",text:a.stack,subject:"timur"};
    if(hasAny(q,["ии","ai","llm","агент","agent"]))return{lang,intent:"ai",text:a.ai,subject:"timur"};
    if(hasAny(q,["автоматиз","automation","workflow","процесс"]))return{lang,intent:"automation",text:a.automation,subject:"timur"};
    if(hasAny(q,["продукт","product","mvp","prototype"]))return{lang,intent:"product",text:a.product,subject:"timur"};
    if(hasAny(q,["кто","тимур","who is","tell me about timur"]))return{lang,intent:"identity",text:a.identity,subject:"timur"};
    if(hasAny(q,["умеет","навык","skills","capabil"]))return{lang,intent:"skills",text:a.skills,subject:"timur"};
    return{lang,intent:"unknown",text:a.unknown,subject:"timur"};
  }

  const chatLog=document.querySelector("[data-chat-log]");
  const form=document.querySelector("[data-query-form]");
  const input=document.querySelector("[data-query-input]");
  const statusEl=document.querySelector("#query > .section-label span:nth-child(2)");
  const suggestions=[...document.querySelectorAll("[data-suggestion]")];
  const askProjectButtons=[...document.querySelectorAll("[data-ask-project]")];

  function renderRuntimeStatus(mode=state.runtimeMode){
    state.runtimeMode=mode;
    if(!statusEl)return;
    const ru=state.lang==="ru";
    const labels={
      checking:ru?"● Проверка…":"● Checking…",
      llm:"● LLM composer",
      local:"● Local composer",
      fallback:"● Local fallback"
    };
    const titles={
      checking:ru?"Проверяю доступный режим ответа.":"Checking the available answer mode.",
      llm:ru?"Содержательные ответы формируются LLM на основе данных портфолио.":"Substantive answers are composed by an LLM grounded in the portfolio knowledge base.",
      local:ru?"Ответ формируется локально в браузере из встроенной базы знаний без LLM-запроса.":"The answer is composed locally in the browser from the built-in knowledge base, with no LLM request.",
      fallback:ru?"LLM был выбран, но этот запрос не прошёл. Использован локальный ответ.":"LLM was selected, but this request failed. The local answer was used instead."
    };
    statusEl.textContent=labels[mode]||labels.local;
    statusEl.title=titles[mode]||titles.local;
    statusEl.dataset.mode=mode;
  }

  async function checkRuntimeMode(){
    renderRuntimeStatus("checking");
    try{
      const controller=new AbortController();
      const timer=window.setTimeout(()=>controller.abort(),4000);
      const response=await fetch("/api/status",{cache:"no-store",signal:controller.signal});
      window.clearTimeout(timer);
      if(!response.ok)throw new Error("status unavailable");
      const data=await response.json();
      state.llmConfigured=Boolean(data?.llmConfigured);
      renderRuntimeStatus(state.llmConfigured?"llm":"local");
    }catch{
      state.llmConfigured=false;
      renderRuntimeStatus("local");
    }
  }

  function collectFacts(result,lang){
    const a=answers[lang];
    const facts=[];
    const seen=new Set();
    const add=(value)=>{
      const text=String(value||"").trim();
      if(!text||seen.has(text))return;
      seen.add(text);facts.push({text});
    };

    add(result?.text);

    if(result?.project&&a.project?.[result.project]){
      const p=a.project[result.project];
      add(p.overview);add(p.company);add(p.role);add(p.result);add(p.detail);add(p.stack);
      add(a.identity);add(a.background);add(a.impact);
    }else{
      [
        a.identity,a.background,a.backgroundMore,a.skills,a.impact,
        a.currentFocus,a.workStyle,a.technicalDepth,a.scope,a.interesting,
        a.management,a.hire
      ].forEach(add);
    }
    return facts.slice(0,10);
  }

  async function requestLLM(question,lang,result,history){
    const controller=new AbortController();
    const timer=window.setTimeout(()=>controller.abort(),8000);
    try{
      const response=await fetch("/api/ask",{
        method:"POST",
        headers:{"content-type":"application/json"},
        cache:"no-store",
        signal:controller.signal,
        body:JSON.stringify({
          question,
          locale:lang,
          history:history.slice(-6),
          facts:collectFacts(result,lang)
        })
      });
      if(!response.ok)throw new Error(`LLM request failed: ${response.status}`);
      const data=await response.json();
      if(!data?.answer||typeof data.answer!=="string")throw new Error("LLM returned no answer");
      return data.answer.trim();
    }finally{
      window.clearTimeout(timer);
    }
  }

  function showThinkingMessage(lang){
    if(!chatLog)return null;
    const row=document.createElement("div");
    row.className="chat-message chat-message--bot chat-message--thinking";
    const roleEl=document.createElement("span");
    roleEl.className="chat-role";
    roleEl.textContent=lang==="ru"?"портфолио":"portfolio";
    const bubble=document.createElement("div");
    bubble.className="chat-bubble chat-bubble--thinking";
    const label=document.createElement("span");
    label.className="thinking-label";
    label.textContent=lang==="ru"?"Собираю контекст":"Gathering context";
    const dots=document.createElement("span");
    dots.className="thinking-dots";
    dots.setAttribute("aria-hidden","true");
    dots.textContent="…";
    bubble.append(label,dots);
    row.append(roleEl,bubble);
    chatLog.appendChild(row);
    chatLog.scrollTo({top:chatLog.scrollHeight,behavior:reduced?"auto":"smooth"});

    const started=performance.now();
    const swap=window.setTimeout(()=>{
      if(row.isConnected) label.textContent=lang==="ru"?"Формирую ответ":"Composing answer";
    },850);

    return {
      row,
      started,
      async finish(minimum=340){
        const elapsed=performance.now()-started;
        if(elapsed<minimum) await new Promise(resolve=>window.setTimeout(resolve,minimum-elapsed));
        window.clearTimeout(swap);
        row.remove();
      }
    };
  }

  function typeBotText(bubble,text,scroll,onDone){
    const value=String(text||"");
    if(reduced||!scroll||value.length<2){
      bubble.textContent=value;
      onDone?.();
      return;
    }

    const duration=Math.min(1150,Math.max(380,value.length*2.2));
    const start=performance.now();
    let shown=0;
    bubble.classList.add("is-typing");

    const frame=(now)=>{
      const progress=Math.min(1,(now-start)/duration);
      const next=Math.max(shown,Math.floor(value.length*progress));
      if(next!==shown){
        bubble.textContent=value.slice(0,next);
        shown=next;
        const nearBottom=chatLog.scrollHeight-chatLog.scrollTop-chatLog.clientHeight<96;
        if(scroll&&nearBottom) chatLog.scrollTop=chatLog.scrollHeight;
      }
      if(progress<1){
        requestAnimationFrame(frame);
      }else{
        bubble.textContent=value;
        bubble.classList.remove("is-typing");
        onDone?.();
        if(scroll) chatLog.scrollTo({top:chatLog.scrollHeight,behavior:"smooth"});
      }
    };
    requestAnimationFrame(frame);
  }

  function appendMessage(role,text,projectId,actions=[],scroll=true,lang=state.lang){
    if(!chatLog)return;
    const row=document.createElement("div");
    row.className=`chat-message chat-message--${role}`;
    const roleEl=document.createElement("span");
    roleEl.className="chat-role";
    roleEl.textContent=role==="user"?(lang==="ru"?"вы":"you"):(lang==="ru"?"портфолио":"portfolio");
    const bubble=document.createElement("div");
    bubble.className="chat-bubble";

    const appendExtras=()=>{
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
    };

    row.append(roleEl,bubble);chatLog.appendChild(row);
    if(role==="bot") typeBotText(bubble,text,scroll,appendExtras);
    else{bubble.textContent=text;appendExtras();}
    if(scroll)chatLog.scrollTo({top:chatLog.scrollHeight,behavior:reduced?"auto":"smooth"});
  }

  function resetChatLog(){
    if(!chatLog)return;
    chatLog.innerHTML="";
    appendMessage("bot",ui[state.lang].query.intro,null,[],false,state.lang);
    state.lastSubject="timur";state.lastIntent="identity";state.lastProject=null;state.history=[];
  }

  async function askPortfolio(query){
    const text=String(query||"").trim();
    if(!text)return;
    const lang=qlang(text);
    const history=state.history.slice(-6);
    appendMessage("user",text,null,[],true,lang);
    const thinking=showThinkingMessage(lang);
    const result=classify(text);

    if(result.intent!=="greeting"&&result.intent!=="thanks"&&result.intent!=="unknown"){
      state.lastSubject=result.subject||state.lastSubject;
      state.lastIntent=result.intent;
      state.lastProject=result.project||state.lastProject;
    }

    let answer=result.text;
    const useLLM=state.llmConfigured&&result.intent!=="greeting"&&result.intent!=="thanks";

    if(useLLM){
      try{
        answer=await requestLLM(text,lang,result,history);
        renderRuntimeStatus("llm");
      }catch{
        answer=result.text;
        renderRuntimeStatus("fallback");
      }
    }else{
      renderRuntimeStatus("local");
    }

    state.history.push(
      {role:"user",content:text},
      {role:"assistant",content:answer}
    );
    if(state.history.length>12)state.history=state.history.slice(-12);

    if(thinking) await thinking.finish(reduced?0:340);
    appendMessage("bot",answer,result.project,[],true,result.lang);
  }

  function openProjectQuestions(id){
    const lang=state.lang;
    const names={audit:"Audit Process Consulting",crm:"CRM Product Development",bi:"Operations & BI Dashboards",invoice:"Invoice Automation",book:"Book Translator",video:"AI Video Pipeline",tube:"TubeScore",lightning:"HH Lightning",market:"Job Market Scanner",feed:"FeedPulse"}; const name=names[id]||id;
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
  const systemTheme=window.matchMedia("(prefers-color-scheme: light)");
  const savedTheme=localStorage.getItem("portfolio-theme");
  let themeMode=savedTheme==="light"||savedTheme==="dark"?savedTheme:"system";

  function effectiveTheme(){
    return themeMode==="system"?(systemTheme.matches?"light":"dark"):themeMode;
  }

  function updateThemeToggle(){
    if(!themeToggle)return;
    const ru=state.lang==="ru";
    const labels=ru
      ?{
          system:"Тема: системная. Следующая: светлая.",
          light:"Тема: светлая. Следующая: тёмная.",
          dark:"Тема: тёмная. Следующая: системная."
        }
      :{
          system:"Theme: system. Next: light.",
          light:"Theme: light. Next: dark.",
          dark:"Theme: dark. Next: system."
        };
    themeToggle.setAttribute("aria-label",labels[themeMode]);
    themeToggle.title=labels[themeMode];
    themeToggle.dataset.themeMode=themeMode;
  }

  function applyThemeMode(mode,{persist=true}={}){
    themeMode=["system","light","dark"].includes(mode)?mode:"system";
    html.dataset.themeMode=themeMode;

    if(themeMode==="system"){
      delete html.dataset.theme;
      if(persist)localStorage.removeItem("portfolio-theme");
    }else{
      html.dataset.theme=themeMode;
      if(persist)localStorage.setItem("portfolio-theme",themeMode);
    }

    updateThemeToggle();
  }

  applyThemeMode(themeMode,{persist:false});

  systemTheme.addEventListener?.("change",()=>{
    if(themeMode==="system"){
      delete html.dataset.theme;
      updateThemeToggle();
    }
  });

  themeToggle?.addEventListener("click",()=>{
    const next={system:"light",light:"dark",dark:"system"}[themeMode]||"system";
    applyThemeMode(next);
  });

  // Language
  const langToggle=document.querySelector("[data-lang-toggle]");
  const langLabel=document.querySelector("[data-lang-label]");
  function setText(selector,value){const el=document.querySelector(selector);if(el&&value!=null)el.textContent=value;}
  function setHTML(selector,value){const el=document.querySelector(selector);if(el&&value!=null)el.innerHTML=value;}

  function applyLanguage(lang,reset=true){
    state.lang=lang;html.lang=lang;localStorage.setItem("portfolio-lang",lang);
    if(langLabel)langLabel.textContent=lang.toUpperCase();
    langToggle?.setAttribute("aria-label",lang==="en"?"Переключить на русский":"Switch to English");
    updateThemeToggle();
    const t=ui[lang];

    setText('.nav-links a[href="#work"]',t.nav.work);
    setText('.nav-links a[href="#query"]',t.nav.query);
    setText('.nav-links a[href="#about"]',t.nav.about);
    setText(".hero .eyebrow",t.hero.eyebrow);
    setHTML(".hero h1",t.hero.title);
    setText(".hero-lede",t.hero.lede);
    document.querySelectorAll(".hero-meta span").forEach((el,i)=>{if(t.hero.meta[i])el.textContent=t.hero.meta[i];});
    const fh=document.querySelectorAll(".field-head span");if(fh[0])fh[0].textContent=t.field.title;if(fh[1])fh[1].textContent=t.field.hint;

    const qLabels=document.querySelectorAll("#query > .section-label span");if(qLabels[0])qLabels[0].textContent=t.query.title;if(qLabels[1])qLabels[1].textContent=t.query.status;renderRuntimeStatus();
    document.querySelectorAll(".suggestions button").forEach((button,i)=>{const pair=t.query.suggestions[i];if(pair){button.textContent=pair[0];button.dataset.suggestion=pair[1];}});
    if(input)input.placeholder=t.query.placeholder;setHTML(".query-hint",t.query.hint);

    const wLabels=document.querySelectorAll("#work > .section-label span");if(wLabels[0])wLabels[0].textContent=t.work.title;if(wLabels[1])wLabels[1].textContent=t.work.note;
    const pcopy={audit:t.work.audit,crm:t.work.crm,bi:t.work.bi,invoice:t.work.invoice,book:t.work.book,video:t.work.video,tube:t.work.tube,lightning:t.work.lightning,market:t.work.market,feed:t.work.feed};
    projects.forEach((item)=>{
      const p=pcopy[item.dataset.project];if(!p)return;
      item.querySelector(".project-main small").textContent=p.kind;
      item.querySelector(".project-reveal p").textContent=p.desc;
      item.querySelectorAll(".project-reveal dl > div").forEach((block,i)=>{if(p.details[i]){block.querySelector("dt").textContent=p.details[i][0];block.querySelector("dd").textContent=p.details[i][1];}});
      const ask=item.querySelector("[data-ask-project]");const askLabel=ask?.querySelector("[data-ask-label]");if(askLabel)askLabel.textContent=p.ask.replace(/\s*→\s*$/,"");
    });
    document.querySelectorAll("[data-project-external]").forEach((link)=>{
      const type=link.dataset.projectExternal;
      const labels=lang==="ru"
        ?{live:"Открыть сайт ↗",store:"Chrome Web Store ↗",github:"GitHub ↗"}
        :{live:"Live site ↗",store:"Chrome Web Store ↗",github:"GitHub ↗"};
      if(labels[type])link.textContent=labels[type];
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
  const labels={en:["AI","Automation","Product","Projects","Process","Analytics / BI","APIs","Delivery","Browser","Agents","SQL / Data","JS / Node","n8n"],ru:["ИИ","Автоматизация","Продукт","Проекты","Процессы","Аналитика / BI","API","Delivery","Browser","Агенты","SQL / Данные","JS / Node","n8n"]};
  if(canvas){
    const ctx=canvas.getContext("2d");
    if(ctx){
      const caps=[
        {x:-.74,y:-.58,q:{en:"Show me AI and automation work",ru:"Покажи работу с AI и автоматизацией"}},
        {x:-.28,y:-.72,q:{en:"How do you automate processes?",ru:"Как ты автоматизируешь процессы?"}},
        {x:.24,y:-.68,q:{en:"Tell me about CRM Product Development",ru:"Расскажи про CRM Product Development"}},
        {x:.72,y:-.62,q:{en:"What projects are in the portfolio?",ru:"Какие проекты в портфолио?"}},
        {x:.70,y:-.34,q:{en:"Tell me about Audit Process Consulting",ru:"Расскажи про Audit Process Consulting"}},
        {x:-.72,y:-.08,q:{en:"Tell me about Operations & BI Dashboards",ru:"Расскажи про Operations & BI Dashboards"}},
        {x:.70,y:-.02,q:{en:"What stack do you use?",ru:"Какой стек ты используешь?"}},
        {x:-.56,y:.34,q:{en:"What was Timur responsible for in CRM Product Development?",ru:"За что Тимур отвечал в CRM Product Development?"}},
        {x:-.02,y:.24,q:{en:"Tell me about HH Lightning",ru:"Расскажи про HH Lightning"}},
        {x:.58,y:.32,q:{en:"Tell me about AI agents",ru:"Расскажи про AI-агентов"}},
        {x:-.38,y:.72,q:{en:"What stack do you use?",ru:"Какой стек ты используешь?"}},
        {x:.16,y:.68,q:{en:"What stack do you use?",ru:"Какой стек ты используешь?"}},
        {x:.68,y:.70,q:{en:"Tell me about Invoice Automation",ru:"Расскажи про Invoice Automation"}}
      ];
      let dpr=Math.min(window.devicePixelRatio||1,2),width=1,height=1,rotX=-.78,rotZ=-.18,targetRotX=rotX,targetRotZ=rotZ;
      let pointer={x:0,y:0,fx:0,fy:0,inside:false,down:false,lastX:0,lastY:0},hover=-1,nodeScreens=[],time=0,nodeMorph=Array(caps.length).fill(0);
      function resize(){const r=canvas.getBoundingClientRect();width=Math.max(1,r.width);height=Math.max(1,r.height);dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);}
      function colors(){const s=getComputedStyle(html);return{text:s.getPropertyValue("--text").trim(),muted:s.getPropertyValue("--muted").trim(),line:s.getPropertyValue("--line-strong").trim(),accent:s.getPropertyValue("--accent").trim()};}
      function baseH(x,y){return .13*Math.sin(x*4.1+time*.8)*Math.cos(y*3.4-time*.55);}
      function project(x,y,z){let yy=y*Math.cos(rotX)-z*Math.sin(rotX),zz=y*Math.sin(rotX)+z*Math.cos(rotX),xx=x*Math.cos(rotZ)-yy*Math.sin(rotZ),y2=x*Math.sin(rotZ)+yy*Math.cos(rotZ);const p=1/(1.55-zz*.32),scale=Math.min(width,height)*.72;return{x:width/2+xx*scale*p,y:height/2+y2*scale*.78*p};}
      function hAt(x,y){const base=baseH(x,y);if(!pointer.inside)return base;const s=project(x,y,base),dist=Math.hypot(s.x-pointer.fx,s.y-pointer.fy),radius=Math.max(95,Math.min(width,height)*.28),d=dist/radius;if(d>1.35)return base;return base+Math.sin(d*9-time*3.2)*Math.exp(-d*2.9)*.22;}
      function draw(){const c=colors();ctx.clearRect(0,0,width,height);rotX+=(targetRotX-rotX)*.07;rotZ+=(targetRotZ-rotZ)*.07;if(pointer.inside&&!reduced){pointer.fx+=(pointer.x-pointer.fx)*.2;pointer.fy+=(pointer.y-pointer.fy)*.2;}else{pointer.fx=pointer.x;pointer.fy=pointer.y;}if(!pointer.down&&!reduced)targetRotZ+=.0012;time+=reduced?0:.016;const n=20;ctx.lineWidth=1;
        for(let axis=0;axis<2;axis++)for(let i=0;i<n;i++){ctx.beginPath();for(let k=0;k<n;k++){const a=-1+(2*i)/(n-1),b=-1+(2*k)/(n-1),x=axis===0?a:b,y=axis===0?b:a,p=project(x,y,hAt(x,y));if(k===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);}ctx.strokeStyle=c.line;ctx.globalAlpha=.42;ctx.stroke();}
        ctx.globalAlpha=1;nodeScreens=caps.map((cap,index)=>{const p=project(cap.x,cap.y,hAt(cap.x,cap.y)+.03),active=index===hover,target=active?1:0;if(reduced)nodeMorph[index]=target;else nodeMorph[index]+=(target-nodeMorph[index])*.24;const morph=nodeMorph[index],circleR=3.5,triangleR=7,steps=36,sector=Math.PI*2/3,sideNormal=Math.PI/3;ctx.beginPath();for(let step=0;step<steps;step++){const angle=step/steps*Math.PI*2;let delta=((angle-sideNormal+Math.PI/3)%sector+sector)%sector-Math.PI/3;const triR=(triangleR*.5)/Math.cos(delta);const radius=circleR+(triR-circleR)*morph;const x=p.x+Math.cos(angle)*radius,y=p.y+Math.sin(angle)*radius;if(step===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.closePath();ctx.fillStyle=morph>.05?c.accent:c.text;ctx.fill();ctx.font=`${morph>.35?600:500} 10px ui-monospace, SFMono-Regular, Menlo, monospace`;ctx.fillStyle=morph>.05?c.accent:c.muted;ctx.fillText(labels[state.lang][index],p.x+9+morph*4,p.y+3);return{x:p.x,y:p.y};});requestAnimationFrame(draw);}
      function update(e){const r=canvas.getBoundingClientRect();pointer.x=e.clientX-r.left;pointer.y=e.clientY-r.top;let best=-1,dist=30;nodeScreens.forEach((n,i)=>{const d=Math.hypot(pointer.x-n.x,pointer.y-n.y);if(d<dist){dist=d;best=i;}});hover=best;canvas.style.cursor=best>=0?"pointer":(pointer.down?"grabbing":"grab");}
      canvas.addEventListener("pointerenter",e=>{pointer.inside=true;update(e);pointer.fx=pointer.x;pointer.fy=pointer.y;});
      canvas.addEventListener("pointerleave",()=>{pointer.inside=false;pointer.down=false;hover=-1;});
      canvas.addEventListener("pointermove",e=>{update(e);if(pointer.down){const dx=e.clientX-pointer.lastX,dy=e.clientY-pointer.lastY;targetRotZ+=dx*.006;targetRotX=Math.max(-1.15,Math.min(-.25,targetRotX+dy*.004));pointer.lastX=e.clientX;pointer.lastY=e.clientY;}});
      canvas.addEventListener("pointerdown",e=>{pointer.down=true;pointer.lastX=e.clientX;pointer.lastY=e.clientY;canvas.setPointerCapture?.(e.pointerId);});
      canvas.addEventListener("pointerup",e=>{const clicked=hover;pointer.down=false;if(canvas.hasPointerCapture?.(e.pointerId))canvas.releasePointerCapture(e.pointerId);if(clicked>=0){askPortfolio(caps[clicked].q[state.lang]);document.getElementById("query")?.scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"});}});
      new ResizeObserver(resize).observe(canvas);resize();draw();
    }
  }

  applyLanguage(state.lang,false);
  resetChatLog();
  checkRuntimeMode();
})();