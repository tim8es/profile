(() => {
  const html = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const state = {
    lang: localStorage.getItem("portfolio-lang") || "en",
    lastSubject: "timur",
    lastIntent: "identity",
    lastProject: null,
    moreCursor: { timur:0, skills:0, audit:0, crm:0, bi:0, invoice:0, book:0, video:0, tube:0, lightning:0, market:0, feed:0 }
  };

  const ui = {
    en: {
      demo: "04 / Hybrid candidate",
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
        status:"local composer",
        intro:"Ask me about Timur, his work, projects, product approach or technical decisions.",
        suggestions:[
          ["Projects","What projects are in the portfolio?"],
          ["Experience","What's Timur's background?"],
          ["Results","What measurable results does Timur have?"],
          ["AI & automation","Show me AI and automation work"]
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
      demo: "04 / Гибридный вариант",
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
        status:"local composer",
        intro:"Спроси о Тимуре, его работах, проектах, продуктовом подходе или технических решениях.",
        suggestions:[
          ["Проекты","Какие проекты в портфолио?"],
          ["Опыт","Какой у Тимура опыт?"],
          ["Результаты","Какие измеримые результаты у Тимура?"],
          ["AI и автоматизация","Покажи работу с AI и автоматизацией"]
        ],
        placeholder:"Спроси портфолио…",
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

  let kb = null;
  const kbReady = fetch("./generated/portfolio-data.json?v=20260923-3", { cache: "no-store" })
    .then(async (response) => {
      if (!response.ok) throw new Error(`portfolio-data.json: HTTP ${response.status}`);
      const data = await response.json();
      if (!data || !Array.isArray(data.facts)) throw new Error("Invalid portfolio runtime data");
      kb = data;
      return data;
    })
    .catch((error) => {
      console.error("Portfolio knowledge base failed to load", error);
      return null;
    });

  state.history = [];
  state.lastFacts = [];

  const topicLexicon = {
    identity:["кто","тимур","who","person","profile","профиль"],
    experience:["где работал","компан","опыт","карьер","лет","чем занимался","career","experience","worked","background","years"],
    companies:["компан","где","контекст","employer","company","where"],
    role:["роль","отвечал","responsib","role"],
    results:["результат","метрик","цифр","эффект","масштаб","достижен","деньги","сэконом","заработ","impact","result","metric","scale","achievement","money","saved","revenue"],
    skills:["умеет","навык","компетенц","skills","can do","capabil"],
    strengths:["сильн","преимущ","strength","differentiat"],
    fit:["подойд","работ","роль","fit","role","job","suitable"],
    projects:["проект","проекты","портфолио","работы","делал","создал","built","project","projects","portfolio"],
    product:["продукт","mvp","product","prototype"],
    process:["процесс","операц","workflow","process"],
    ai:["ии","ai","llm","agent","агент"],
    technical:["стек","технолог","api","javascript","node","sql","technical","stack"],
    architecture:["архитект","как устро","how built","architecture"],
    testing:["тест","провер","testing","tested","verify"],
    limitations:["огранич","не было","реально","фактически","boundary","constraint","limitation"],
    quality:["качество","плох","ошиб","quality","bad data","reliability","freshness"],
    audit:["audit process","audit consulting","аудит процесс","аудит процессов","контроль качества"],
    crm:["crm product","crm product development","loyalty crm","crm система","crm-система"],
    bi:["operations bi","bi dashboards","дашборд","datalens","операционная аналитика"],
    invoice:["invoice automation","invoice","инвойс","инвойсов"],
    book:["book translator","перевод книг","переводчик книг"],
    video:["ai video pipeline","video pipeline","youtube shorts","shorts pipeline","видео pipeline"],
    tube:["tubescore","tube score"],
    lightning:["hh lightning","headhunter lightning"],
    market:["job market scanner","market scanner","professions statistics","сканер рынка"],
    feed:["feedpulse","feed pulse"]
  };

  function norm(value){
    return String(value||"").toLowerCase().replace(/ё/g,"е").replace(/[^a-zа-я0-9\\s-]/gi," ").replace(/\\s+/g," ").trim();
  }

  function qlang(value){
    const text=String(value||"");
    const cyr=(text.match(/[А-Яа-яЁё]/g)||[]).length;
    const letters=(text.match(/[A-Za-zА-Яа-яЁё]/g)||[]).length;
    return letters&&cyr/letters>.25?"ru":state.lang;
  }

  function detectTopics(question){
    const q=norm(question), found=[];
    Object.entries(topicLexicon).forEach(([topic,terms])=>{
      if(terms.some(term=>q.includes(norm(term)))) found.push(topic);
    });

    const globalPerson=/\b(тимур|ты|тебя|твой|твои|timur|you|your)\b/.test(q);
    const projectTopics=["audit","crm","bi","invoice","book","video","tube","lightning","market","feed"];
    const hasProject=found.some(topic=>projectTopics.includes(topic));
    const followupTopics=["companies","role","results","technical","architecture","testing","limitations","quality"];

    if(!found.length && /^(что еще|что ещё|а еще|а ещё|подробнее|больше|what else|tell me more|more)/.test(q)){
      const previous=[...new Set(state.lastFacts.flatMap(id=>kb?.facts?.find(f=>f.id===id)?.topics||[]))];
      return previous.length?previous:["identity","experience","skills"];
    }

    if(!globalPerson && !hasProject && projectTopics.includes(state.lastSubject) && found.some(topic=>followupTopics.includes(topic))){
      found.push(state.lastSubject);
    }
    return [...new Set(found)];
  }

  function scoreFact(fact,question,topics){
    const q=norm(question);
    let score=0;
    fact.topics.forEach(topic=>{if(topics.includes(topic)) score+=4;});
    const projectTopics=["audit","crm","bi","invoice","book","video","tube","lightning","market","feed"];
    const specificProject=projectTopics.find(topic=>topics.includes(topic));
    if(specificProject && fact.context?.projectId===specificProject) score+=12;
    if(topics.includes("role") && fact.topics.includes("role")) score+=8;
    if(topics.includes("results") && (fact.topics.includes("results")||fact.topics.includes("metrics")||fact.topics.includes("scale"))) score+=8;
    if(topics.includes("technical") && fact.topics.includes("technical")) score+=6;
    if(topics.includes("architecture") && (fact.topics.includes("architecture")||fact.topics.includes("technical")||fact.topics.includes("backend"))) score+=6;
    if(topics.includes("quality") && (fact.topics.includes("quality")||fact.topics.includes("reliability"))) score+=10;
    if(topics.includes("limitations") && fact.topics.includes("limitations")) score+=8;
    if(topics.includes("companies") && fact.context?.company) score+=5;
    const words=new Set(q.split(" ").filter(word=>word.length>3));
    const searchable=norm(fact.text.ru+" "+fact.text.en+" "+fact.id+" "+fact.topics.join(" ")+" "+(fact.context?.company||""));
    words.forEach(word=>{if(searchable.includes(word)) score+=0.7;});
    if(state.lastFacts.includes(fact.id)) score-=0.6;
    return score;
  }

  function retrieve(question){
    if(!kb?.facts?.length) return [];
    let topics=detectTopics(question);
    const q=norm(question);
    const wantsMore=/^(что еще|что ещё|а еще|а ещё|подробнее|больше|what else|tell me more|more)/.test(q);

    if(/все что|всё что|everything|all you know/.test(q)){
      topics=["identity","experience","companies","skills","projects","strengths","product","ai","technical"];
    }
    if(/слаб/.test(q)||/weakness/.test(q)) topics=["fit","strengths"];

    const ranked=kb.facts
      .map(fact=>({fact,score:scoreFact(fact,question,topics)-(wantsMore&&state.lastFacts.includes(fact.id)?50:0)}))
      .sort((a,b)=>b.score-a.score);

    const limit=topics.length>3?9:6;
    const selected=ranked.filter(item=>item.score>0).slice(0,limit).map(item=>item.fact);
    return selected.length?selected:kb.facts.filter(f=>f.topics.includes("identity")).slice(0,3);
  }

  function planType(question){
    const q=norm(question);
    if(/все что|всё что|everything|all you know/.test(q)) return "broad";
    if(/удив|сильн|преимущ|differentiat|strength|unique/.test(q)) return "strengths";
    if(/подойд|fit|role|job|работу|роль/.test(q)) return "fit";
    if(/слаб|weakness/.test(q)) return "weakness";
    if(/кто|who is/.test(q)) return "identity";
    return "default";
  }

  function stripLead(text){
    return text
      .replace(/^Тимур Даутов —\\s*/,"")
      .replace(/^Timur Dautov\\s+/,"")
      .replace(/^He\\s+/,"")
      .replace(/^Он\\s+/,"");
  }

  function joinFacts(facts,lang){
    return facts.slice(0,6).map((fact,index)=>{
      let text=fact.text[lang]||fact.text.en||fact.text.ru;
      if(index>0) text=stripLead(text);
      return text.replace(/\.+$/,"");
    }).join(". ")+".";
  }

  function composeLocal(question,facts,lang){
    const kind=planType(question);
    const body=joinFacts(facts,lang);
    const lead={
      ru:{
        identity:"Тимур Даутов — ",
        broad:"Если собрать главное: ",
        strengths:"Если смотреть на профиль целиком, его отличие в сочетании нескольких вещей: ",
        fit:"По подтверждённым фактам наиболее естественный fit выглядит так: ",
        weakness:"Портфолио не должно придумывать слабые стороны. Из подтверждённых данных можно осторожно сказать следующее: ",
        default:""
      },
      en:{
        identity:"Timur Dautov — ",
        broad:"The main picture is: ",
        strengths:"Looking across the profile, the differentiator is the combination of several things: ",
        fit:"Based on verified portfolio facts, the clearest fit is: ",
        weakness:"The portfolio should not invent weaknesses. From the available evidence, the most careful statement is: ",
        default:""
      }
    };
    return (lead[lang]?.[kind]??"")+body;
  }

  const chatLog=document.querySelector("[data-chat-log]");
  const form=document.querySelector("[data-query-form]");
  const input=document.querySelector("[data-query-input]");
  const suggestions=[...document.querySelectorAll("[data-suggestion]")];
  const askProjectButtons=[...document.querySelectorAll("[data-ask-project]")];

  function appendSources(bubble,facts,lang,engine){
    if(!facts?.length) return;
    const details=document.createElement("details");
    details.className="rag-sources";
    const summary=document.createElement("summary");
    summary.textContent=(lang==="ru"?"Источники":"Sources")+" · "+facts.length;
    const list=document.createElement("div");
    list.className="rag-source-list";

    facts.forEach((fact,index)=>{
      const item=document.createElement("div");
      item.className="rag-source";
      const num=document.createElement("b");
      num.textContent=String(index+1).padStart(2,"0");
      const body=document.createElement("span");
      body.appendChild(document.createTextNode((fact.text[lang]||fact.text.en||fact.text.ru)+" — "));
      if(fact.source?.url){
        const link=document.createElement("a");
        link.href=fact.source.url;
        link.target="_blank";
        link.rel="noreferrer";
        link.textContent=fact.source.label;
        body.appendChild(link);
      }else{
        body.appendChild(document.createTextNode(fact.source?.label||"Portfolio"));
      }
      item.append(num,body);
      list.appendChild(item);
    });

    details.append(summary,list);
    bubble.append(details);
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

  function appendMessage(role,text,projectId,actions=[],scroll=true,lang=state.lang,facts=[],engine="local"){
    if(!chatLog)return null;
    const row=document.createElement("div");
    row.className=`chat-message chat-message--${role}`;
    const roleEl=document.createElement("span");
    roleEl.className="chat-role";
    roleEl.textContent=role==="user"?(lang==="ru"?"вы":"you"):(lang==="ru"?"портфолио":"portfolio");
    const bubble=document.createElement("div");
    bubble.className="chat-bubble";

    const appendExtras=()=>{
      if(actions.length){
        const wrap=document.createElement("div");
        wrap.className="chat-actions";
        actions.forEach(action=>{
          const button=document.createElement("button");
          button.type="button";
          button.textContent=action.label;
          button.addEventListener("click",()=>askPortfolio(action.query));
          wrap.appendChild(button);
        });
        bubble.appendChild(wrap);
      }

      if(projectId){
        const br=document.createElement("br");
        const link=document.createElement("button");
        link.type="button";
        link.className="chat-project-link";
        link.textContent=lang==="ru"?"Показать связанный проект ↓":"Show related project ↓";
        link.addEventListener("click",()=>{
          activateProject(projectId,true);
          document.getElementById("work")?.scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"});
        });
        bubble.append(br,link);
      }

      if(role==="bot"&&facts.length) appendSources(bubble,facts,lang,engine);
    };

    row.append(roleEl,bubble);
    chatLog.appendChild(row);
    if(role==="bot") typeBotText(bubble,text,scroll,appendExtras);
    else{bubble.textContent=text;appendExtras();}
    if(scroll) chatLog.scrollTo({top:chatLog.scrollHeight,behavior:reduced?"auto":"smooth"});
    return bubble;
  }

  function resetChatLog(){
    if(!chatLog)return;
    chatLog.innerHTML="";
    appendMessage("bot",ui[state.lang].query.intro,null,[],false,state.lang);
    state.lastSubject="timur";
    state.lastIntent="identity";
    state.lastProject=null;
    state.lastFacts=[];
    state.history=[];
  }

  async function serverAnswer(question,facts,lang){
    try{
      const response=await fetch("/api/ask",{
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({
          question,
          locale:lang,
          history:state.history.slice(-6),
          facts:facts.map(f=>({id:f.id,text:f.text[lang]||f.text.en||f.text.ru,source:f.source}))
        })
      });
      if(!response.ok)return null;
      const data=await response.json();
      return typeof data.answer==="string"&&data.answer.trim()?data.answer.trim():null;
    }catch{
      return null;
    }
  }

  async function askPortfolio(query){
    const text=String(query||"").trim();
    if(!text)return;
    const lang=qlang(text);
    appendMessage("user",text,null,[],true,lang);

    if(!kb) await kbReady;
    if(!kb?.facts?.length){
      appendMessage(
        "bot",
        lang==="ru"
          ?"База знаний не загрузилась. Остальные интерактивные элементы страницы продолжают работать."
          :"The knowledge base failed to load. The rest of the page remains interactive.",
        null,[],true,lang
      );
      return;
    }

    const q=norm(text);
    let normalizedQuestion=text;

    if(q==="лет"||/сколько (лет )?опыта|years of experience|how many years/.test(q)){
      normalizedQuestion=lang==="ru"?"опыт лет карьера":"experience years career";
    }else if(/подробнее про проекты|больше про проекты|проекты подробнее|more about projects/.test(q)){
      normalizedQuestion=lang==="ru"?"проекты портфолио product automation":"projects portfolio product automation";
    }else if(/больше результатов|еще результаты|ещё результаты|другие результаты|more results|more impact/.test(q)){
      normalizedQuestion=lang==="ru"?"результаты метрики эффект масштаб":"results metrics impact scale";
    }else if(/чем еще занимался|чем ещё занимался|что еще делал|что ещё делал|what else did he do/.test(q)){
      normalizedQuestion=lang==="ru"?"опыт карьера процессы product delivery":"experience career process product delivery";
    }

    const facts=retrieve(normalizedQuestion);
    state.lastFacts=facts.map(f=>f.id);
    const local=composeLocal(text,facts,lang);
    const server=await serverAnswer(text,facts,lang);
    const answer=server||local;
    const project=facts.find(f=>f.context?.projectId)?.context?.projectId;
    const projectTermsInQuery=["audit process","crm product","operations bi","invoice automation","book translator","ai video pipeline","tubescore","tube score","hh lightning","job market scanner","feedpulse","аудит процесс","crm система","дашборд","инвойс","перевод книг"];
    const explicitProject=projectTermsInQuery.some(term=>norm(text).includes(norm(term)));
    const contextualProject=["audit","crm","bi","invoice","book","video","tube","lightning","market","feed"].includes(state.lastSubject)
      && /^(что еще|что ещё|а еще|а ещё|подробнее|больше|what else|tell me more|more)/.test(norm(text));
    const projectId=(explicitProject||contextualProject)&&["audit","crm","bi","invoice","book","video","tube","lightning","market","feed"].includes(project)?project:null;

    const globalPerson=/\b(тимур|ты|тебя|твой|твои|timur|you|your)\b/.test(norm(text));
    state.lastSubject=projectId&&!globalPerson?projectId:"timur";
    state.lastProject=projectId||state.lastProject;
    state.lastIntent=planType(normalizedQuestion);
    state.history.push({role:"user",content:text},{role:"assistant",content:answer});

    appendMessage("bot",answer,projectId,[],true,lang,facts,server?"server":"local");
  }

  function openProjectQuestions(id){
    const lang=state.lang;
    const names={audit:"Audit Process Consulting",crm:"CRM Product Development",bi:"Operations & BI Dashboards",invoice:"Invoice Automation",book:"Book Translator",video:"AI Video Pipeline",tube:"TubeScore",lightning:"HH Lightning",market:"Job Market Scanner",feed:"FeedPulse"}; const name=names[id]||id;
    state.lastSubject=id;
    state.lastProject=id;
    state.lastIntent="project-overview";
    const deep=ui[lang].deep[id].map(([label,query])=>({label,query}));
    appendMessage("user",lang==="ru"?`Спросить подробнее про ${name}`:`Ask deeper about ${name}`,null,[],true,lang);
    appendMessage("bot",`${ui[lang].query.deeper} ${name}:`,null,deep,true,lang);
    document.getElementById("query")?.scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"});
  }

  form?.addEventListener("submit",(event)=>{
    event.preventDefault();
    askPortfolio(input?.value);
    if(input)input.value="";
  });
  suggestions.forEach(button=>button.addEventListener("click",()=>askPortfolio(button.dataset.suggestion)));
  askProjectButtons.forEach(button=>button.addEventListener("click",()=>openProjectQuestions(button.dataset.askProject)));
  document.addEventListener("keydown",(event)=>{
    const tag=document.activeElement?.tagName?.toLowerCase();
    const editing=tag==="input"||tag==="textarea"||document.activeElement?.isContentEditable;
    if((event.key==="/"||event.code==="Slash")&&!editing&&input){
      event.preventDefault();
      input.focus();
    }
  });

  // Theme
  const themeToggle=document.querySelector("[data-theme-toggle]");
  const systemTheme=window.matchMedia("(prefers-color-scheme: light)");
  const savedTheme=localStorage.getItem("portfolio-theme");

  function effectiveTheme(){
    return html.dataset.theme || (systemTheme.matches?"light":"dark");
  }

  function updateThemeToggle(){
    const theme=effectiveTheme();
    themeToggle?.setAttribute("aria-label",theme==="dark"?"Switch to light theme":"Switch to dark theme");
  }

  if(savedTheme==="light"||savedTheme==="dark") html.dataset.theme=savedTheme;
  else delete html.dataset.theme;
  updateThemeToggle();

  systemTheme.addEventListener?.("change",()=>{
    if(!localStorage.getItem("portfolio-theme")){
      delete html.dataset.theme;
      updateThemeToggle();
    }
  });

  themeToggle?.addEventListener("click",()=>{
    const next=effectiveTheme()==="dark"?"light":"dark";
    html.dataset.theme=next;
    localStorage.setItem("portfolio-theme",next);
    updateThemeToggle();
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
    const t=ui[lang];

    setText("[data-demo-label]",t.demo);
    setText('.nav-links a[href="#work"]',t.nav.work);
    setText('.nav-links a[href="#query"]',t.nav.query);
    setText('.nav-links a[href="#about"]',t.nav.about);
    setText(".hero .eyebrow",t.hero.eyebrow);
    setHTML(".hero h1",t.hero.title);
    setText(".hero-lede",t.hero.lede);
    document.querySelectorAll(".hero-meta span").forEach((el,i)=>{if(t.hero.meta[i])el.textContent=t.hero.meta[i];});
    const fh=document.querySelectorAll(".field-head span");if(fh[0])fh[0].textContent=t.field.title;if(fh[1])fh[1].textContent=t.field.hint;

    const qLabels=document.querySelectorAll("#query > .section-label span");if(qLabels[0])qLabels[0].textContent=t.query.title;if(qLabels[1])qLabels[1].textContent=t.query.status;
    document.querySelectorAll(".suggestions button").forEach((button,i)=>{const pair=t.query.suggestions[i];if(pair){button.textContent=pair[0];button.dataset.suggestion=pair[1];}});
    if(input)input.placeholder=t.query.placeholder;setHTML(".query-hint",t.query.hint);

    const wLabels=document.querySelectorAll("#work > .section-label span");if(wLabels[0])wLabels[0].textContent=t.work.title;if(wLabels[1])wLabels[1].textContent=t.work.note;
    const pcopy={audit:t.work.audit,crm:t.work.crm,bi:t.work.bi,invoice:t.work.invoice,book:t.work.book,video:t.work.video,tube:t.work.tube,lightning:t.work.lightning,market:t.work.market,feed:t.work.feed};
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
      let pointer={x:0,y:0,inside:false,down:false,lastX:0,lastY:0},hover=-1,nodeScreens=[],time=0;
      function resize(){const r=canvas.getBoundingClientRect();width=Math.max(1,r.width);height=Math.max(1,r.height);dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);}
      function colors(){const s=getComputedStyle(html);return{text:s.getPropertyValue("--text").trim(),muted:s.getPropertyValue("--muted").trim(),line:s.getPropertyValue("--line-strong").trim(),accent:s.getPropertyValue("--accent").trim()};}
      function baseH(x,y){return .13*Math.sin(x*4.1+time*.8)*Math.cos(y*3.4-time*.55);}
      function project(x,y,z){let yy=y*Math.cos(rotX)-z*Math.sin(rotX),zz=y*Math.sin(rotX)+z*Math.cos(rotX),xx=x*Math.cos(rotZ)-yy*Math.sin(rotZ),y2=x*Math.sin(rotZ)+yy*Math.cos(rotZ);const p=1/(1.55-zz*.32),scale=Math.min(width,height)*.72;return{x:width/2+xx*scale*p,y:height/2+y2*scale*.78*p};}
      function hAt(x,y){const base=baseH(x,y);if(!pointer.inside)return base;const s=project(x,y,base),dist=Math.hypot(s.x-pointer.x,s.y-pointer.y),radius=Math.max(95,Math.min(width,height)*.28),d=dist/radius;if(d>1.35)return base;return base+Math.sin(d*9-time*3.2)*Math.exp(-d*2.9)*.22;}
      function draw(){const c=colors();ctx.clearRect(0,0,width,height);rotX+=(targetRotX-rotX)*.07;rotZ+=(targetRotZ-rotZ)*.07;if(!pointer.down&&!reduced)targetRotZ+=.0012;time+=reduced?0:.016;const n=18;ctx.lineWidth=1;
        for(let axis=0;axis<2;axis++)for(let i=0;i<n;i++){ctx.beginPath();for(let k=0;k<n;k++){const a=-1+(2*i)/(n-1),b=-1+(2*k)/(n-1),x=axis===0?a:b,y=axis===0?b:a,p=project(x,y,hAt(x,y));if(k===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);}ctx.strokeStyle=c.line;ctx.globalAlpha=.42;ctx.stroke();}
        ctx.globalAlpha=1;nodeScreens=caps.map((cap,index)=>{const p=project(cap.x,cap.y,hAt(cap.x,cap.y)+.03),active=index===hover;ctx.beginPath();if(active){const r=7;ctx.moveTo(p.x-r*.48,p.y-r);ctx.lineTo(p.x+r,p.y);ctx.lineTo(p.x-r*.48,p.y+r);ctx.closePath();}else{ctx.arc(p.x,p.y,3.5,0,Math.PI*2);}ctx.fillStyle=active?c.accent:c.text;ctx.fill();ctx.font=`${active?600:500} 10px ui-monospace, SFMono-Regular, Menlo, monospace`;ctx.fillStyle=active?c.accent:c.muted;ctx.fillText(labels[state.lang][index],p.x+(active?13:9),p.y+3);return{x:p.x,y:p.y};});requestAnimationFrame(draw);}
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