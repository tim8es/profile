(() => {
  const html = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const state = {
    lang: localStorage.getItem("portfolio-lang") || "en",
    lastSubject: "timur",
    lastIntent: "identity",
    lastProject: null,
    moreCursor: { timur: 0, skills: 0, tube: 0, feed: 0 }
  };

  const ui = {
    en: {
      demo: "04 / Hybrid candidate",
      nav: { work:"Work", query:"Query", about:"About" },
      hero: {
        eyebrow:"Product builder / process thinker",
        title:"Build.<br><span>Automate.</span><br>Simplify.",
        lede:"I turn vague problems and awkward processes into small working products — with AI, automation and code.",
        meta:["Product → prototype","AI-native workflow","Hands-on builder"]
      },
      field: { title:"Capability field", hint:"drag / move / click", buttons:["AI","Automation","Product","Agents"] },
      query: {
        title:"Portfolio Query",
        status:"contextual local engine / 0 MB model download",
        intro:"Ask me about Timur, his work, projects, product approach or technical decisions.",
        suggestions:[
          ["Who is Timur?","Who is Timur?"],
          ["What can he do?","What can Timur do?"],
          ["AI work","Show me AI work"],
          ["Background","What's your background?"]
        ],
        placeholder:"Ask the portfolio…",
        hint:'Runs entirely in your browser. No model download, API or server. It keeps conversational context and answers from a local knowledge base. Press <kbd>/</kbd> to focus.',
        rolePortfolio:"portfolio",
        roleYou:"you",
        showProject:"Show related project ↓",
        deeper:"Choose what you want to dig into about"
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
      footer:["Timur Dautov © 2026","Built as a static page. Query and 3D field run locally in your browser."],
      deep:{
        tube:[["Architecture","How is TubeScore built?"],["Hardest part","What was the hardest part of TubeScore?"],["Testing","How did you test TubeScore?"]],
        feed:[["Architecture","How is FeedPulse built?"],["Hardest part","What was the hardest part of FeedPulse?"],["Why Node.js","Why Node for FeedPulse?"]]
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
      field: { title:"Карта компетенций", hint:"двигай / тяни / нажимай", buttons:["ИИ","Автоматизация","Продукт","Агенты"] },
      query: {
        title:"Portfolio Query",
        status:"контекстный локальный движок / 0 МБ модели",
        intro:"Спроси о Тимуре, его работах, проектах, продуктовом подходе или технических решениях.",
        suggestions:[
          ["Кто такой Тимур?","Кто такой Тимур?"],
          ["Что он умеет?","Что умеет Тимур?"],
          ["Работа с ИИ","Покажи работу с ИИ"],
          ["Опыт","Какой у Тимура опыт?"]
        ],
        placeholder:"Спроси портфолио…",
        hint:'Работает полностью в браузере: без скачивания модели, API и сервера. Помнит контекст диалога и отвечает из локальной базы знаний. Нажми <kbd>/</kbd>, чтобы перейти к строке.',
        rolePortfolio:"портфолио",
        roleYou:"вы",
        showProject:"Показать связанный проект ↓",
        deeper:"Выбери, что хочется узнать подробнее про"
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
      footer:["Timur Dautov © 2026","Статическая страница: Query и 3D-поле работают локально в браузере."],
      deep:{
        tube:[["Архитектура","Как устроен TubeScore?"],["Самая сложная часть","Что было самым сложным в TubeScore?"],["Тестирование","Как ты тестировал TubeScore?"]],
        feed:[["Архитектура","Как устроен FeedPulse?"],["Самая сложная часть","Что было самым сложным в FeedPulse?"],["Почему Node.js","Почему для FeedPulse выбран Node.js?"]]
      }
    }
  };

  const answers = {
    en: {
      greeting:"Hi. You can ask about Timur, what he can do, his projects, technical decisions or how he approaches products.",
      thanks:"You're welcome. You can keep going — for example, ask what Timur can do, how TubeScore is built, or what kind of problems he likes to automate.",
      identity:"Timur Dautov is a product and process manager moving increasingly into hands-on product building. He combines product thinking with AI tooling, automation, APIs and lightweight software development.",
      identityMore:[
        "His management background matters because he usually starts with the workflow and the user problem rather than with a preferred technology.",
        "He is strongest at the intersection of product, process and implementation: defining the problem, reducing scope and getting a working version into reality.",
        "He prefers practical, inspectable systems — small products, browser tools, automations and AI workflows — over technology added only for presentation."
      ],
      skills:[
        "Timur can frame product problems, design and improve processes, build small MVPs, connect APIs and webhooks, automate workflows and work with AI agents and LLM-based tooling.",
        "On the technical side, he works with JavaScript / Node.js, browser APIs, REST APIs, webhooks, SQL, GitHub, automation tools and testing workflows.",
        "He is also comfortable taking an unfamiliar existing codebase, tracing how it behaves, making a bounded change and verifying the result."
      ],
      background:"His main background is project and process management, including team leadership, metrics, hiring, process design and operational improvement. More recently he has shifted toward hands-on product and automation work.",
      ai:"He uses LLMs as components inside products and workflows — for reasoning, classification, content processing and tool orchestration. The surrounding system, validation and failure handling matter more to him than the chat interface itself.",
      automation:"His automation approach starts with repeated decisions and handoffs: define inputs and success criteria, connect tools or APIs, then add validation and observability so the workflow is repeatable.",
      stack:"The recurring stack includes JavaScript / Node.js, browser APIs, REST APIs, webhooks, SQL, GitHub, automation tools and LLM tooling. The stack is chosen around the problem rather than treated as the product.",
      product:"His product loop is: understand the problem, cut scope hard, build the smallest useful version, test it against reality, then keep, change or kill the hypothesis based on evidence.",
      tube:{
        overview:"TubeScore is a Chrome extension that puts movie ratings directly on YouTube trailers, removing the extra search step.",
        architecture:"TubeScore uses a Manifest V3 extension architecture with a content-script UI, service-worker orchestration and a separate provider layer for metadata. Matching is deterministic and caching keeps lookups lightweight.",
        hard:"The hard part was not the visual badge. It was reliably identifying the correct film from messy YouTube context and keeping the overlay working across SPA navigation without relying on an LLM.",
        testing:"TubeScore is checked with deterministic tests plus an isolated Chromium/Playwright smoke flow covering initial rendering and SPA navigation."
      },
      feed:{
        overview:"FeedPulse is a lightweight ingestion utility for AI agents. It reads RSS/Atom sources and normalizes them into predictable structured content.",
        architecture:"FeedPulse intentionally uses a small Node.js implementation with a focused XML parser instead of a heavy framework. The goal is portability and a narrow dependency surface.",
        hard:"The main problem is inconsistency between feeds: namespaces, content fields, dates and embedded markup vary even when the formats look similar.",
        testing:"The important verification target is deterministic parsing across representative feed variants and consistent normalized output on Windows, macOS and Linux."
      },
      unknown:"I don't have a reliable answer to that in the portfolio knowledge base yet. Try asking about Timur, his skills, background, TubeScore, FeedPulse, AI, automation, product thinking or technical stack."
    },
    ru: {
      greeting:"Привет. Можно спросить о Тимуре, его навыках, проектах, технических решениях или о том, как он подходит к продуктам.",
      thanks:"Пожалуйста. Можно продолжить — например, спросить, что умеет Тимур, как устроен TubeScore или какие процессы он автоматизирует.",
      identity:"Тимур Даутов — менеджер проектов и процессов, который всё больше работает как hands-on product builder. Он сочетает продуктовое мышление с AI-инструментами, автоматизацией, API и разработкой небольших программных продуктов.",
      identityMore:[
        "Его управленческий бэкграунд влияет на подход к разработке: обычно он начинает с рабочего процесса и проблемы пользователя, а не с любимой технологии.",
        "Сильнее всего он работает на стыке продукта, процессов и реализации: формулирует проблему, сокращает scope и доводит идею до работающей версии.",
        "Ему ближе небольшие понятные системы — браузерные инструменты, автоматизации и AI-workflow — чем технологии, добавленные только ради эффекта."
      ],
      skills:[
        "Тимур умеет формулировать продуктовые задачи, проектировать и улучшать процессы, собирать небольшие MVP, соединять API и webhooks, автоматизировать workflow и работать с AI-агентами и LLM-инструментами.",
        "Из технического: JavaScript / Node.js, browser API, REST API, webhooks, SQL, GitHub, инструменты автоматизации и тестирования.",
        "Он также умеет разбираться в чужой кодовой базе: проследить текущее поведение, локализовать проблему, внести ограниченное изменение и проверить результат."
      ],
      background:"Основной бэкграунд Тимура — управление проектами и процессами: команды, метрики, найм, проектирование процессов и операционные улучшения. В последние годы он всё больше смещается в hands-on разработку продуктов и автоматизаций.",
      ai:"LLM он использует как компонент продукта или процесса: для reasoning, классификации, обработки контента и оркестрации инструментов. При этом система вокруг модели — входы, проверки и обработка ошибок — для него важнее самого чат-интерфейса.",
      automation:"Подход к автоматизации начинается с повторяющихся решений и handoff'ов: определить входы и критерии успеха, связать инструменты или API, а затем добавить валидацию и наблюдаемость.",
      stack:"Регулярный стек: JavaScript / Node.js, browser API, REST API, webhooks, SQL, GitHub, инструменты автоматизации и LLM-tooling. Стек выбирается под задачу, а не становится самоцелью.",
      product:"Продуктовый цикл для него выглядит так: понять проблему, жёстко сократить scope, собрать минимальную полезную версию, проверить её в реальности и затем оставить, изменить или закрыть гипотезу по фактам.",
      tube:{
        overview:"TubeScore — Chrome-расширение, которое показывает рейтинги фильмов прямо на YouTube-трейлерах и убирает лишний поиск на другом сайте.",
        architecture:"TubeScore построен как Manifest V3 extension: интерфейс через content script, оркестрация через service worker, метаданные — через отдельный provider-слой. Матчинг детерминированный, а кеширование уменьшает число запросов.",
        hard:"Самая сложная часть — не нарисовать бейдж, а надёжно определить нужный фильм из неоднозначного контекста YouTube и сохранить корректную работу overlay при SPA-навигации без LLM.",
        testing:"TubeScore проверяется детерминированными тестами и изолированным Chromium/Playwright smoke-flow, который покрывает первоначальный рендер и SPA-навигацию."
      },
      feed:{
        overview:"FeedPulse — лёгкая утилита для AI-агентов, которая читает RSS/Atom и приводит материалы к предсказуемой структуре.",
        architecture:"FeedPulse намеренно сделан как небольшая Node.js-утилита с узкоспециализированным XML-парсером вместо тяжёлого фреймворка. Цель — переносимость и минимум зависимостей.",
        hard:"Главная сложность — неоднородность фидов: namespaces, поля контента, даты и встроенная разметка различаются даже в формально похожих источниках.",
        testing:"Главная проверка — детерминированный парсинг разных вариантов фидов и одинаковый нормализованный результат на Windows, macOS и Linux."
      },
      unknown:"В локальной базе портфолио пока нет надёжного ответа на этот вопрос. Можно спросить о Тимуре, его навыках, опыте, TubeScore, FeedPulse, ИИ, автоматизации, продуктовом подходе или техническом стеке."
    }
  };

  function qlang(text) {
    const c=(text.match(/[А-Яа-яЁё]/g)||[]).length;
    const l=(text.match(/[A-Za-zА-Яа-яЁё]/g)||[]).length;
    return l && c/l>.25 ? "ru" : state.lang;
  }
  function norm(v){return String(v||"").toLowerCase().replace(/ё/g,"е").replace(/[^a-zа-я0-9\s-]/gi," ").replace(/\s+/g," ").trim();}
  function hasAny(q,arr){return arr.some((x)=>q.includes(x));}
  function startsWithPhrase(q, phrases){return phrases.some((p)=>q===p||q.startsWith(p+" "));}
  function looksLikeGreeting(q){return startsWithPhrase(q,["привет","здравствуй","здравствуйте","добрый день","добрый вечер","hello","hi","hey"]);}
  function looksLikeThanks(q){return startsWithPhrase(q,["спасибо","благодарю","thanks","thank you"]);}
  function hasTimur(q){return hasAny(q,["тимур","даутов","timur","dautov"]);}
  function hasTube(q){return q.includes("tubescore")||q.includes("tube score");}
  function hasFeed(q){return q.includes("feedpulse")||q.includes("feed pulse");}
  function isPronounFollowup(q){return hasAny(q,["он ","его ","о нем","о нём","ему ","he ","him ","his "]) || /^(он|его|ему|he|him)$/.test(q);}
  function isMore(q){return hasAny(q,["что еще","что ещё","расскажи еще","расскажи ещё","а еще","а ещё","что еще можешь","what else","tell me more","anything else","more about"]);}

  function rotate(key,values){
    const idx=state.moreCursor[key]||0;
    state.moreCursor[key]=(idx+1)%values.length;
    return values[idx];
  }

  function resolveSubject(q){
    if(hasTube(q))return "tube";
    if(hasFeed(q))return "feed";
    if(hasTimur(q))return "timur";
    if(isPronounFollowup(q)||isMore(q))return state.lastSubject||"timur";
    return state.lastSubject||"timur";
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
        if(state.lastIntent==="skills") return{lang,intent:"skills",text:rotate("skills",a.skills),subject};
        return{lang,intent:"identity-more",text:rotate("timur",a.identityMore),subject};
      }
      if(subject==="tube") return{lang,intent:"project-more",text:rotate("tube",[a.tube.architecture,a.tube.hard,a.tube.testing]),subject,project:"tube"};
      if(subject==="feed") return{lang,intent:"project-more",text:rotate("feed",[a.feed.architecture,a.feed.hard,a.feed.testing]),subject,project:"feed"};
    }

    const skillsQ=hasAny(q,["что умеет","что он умеет","навык","навыки","компетенц","skills","what can","can timur","capabilities","умеешь"]);
    if(skillsQ) return{lang,intent:"skills",text:rotate("skills",a.skills),subject:"timur"};

    const identityQ=hasAny(q,["кто такой","кто тимур","who is","tell me about timur","расскажи про тимура"]);
    if(identityQ) return{lang,intent:"identity",text:a.identity,subject:"timur"};

    const backgroundQ=hasAny(q,["опыт","карьер","background","experience","career","где работал"]);
    if(backgroundQ) return{lang,intent:"background",text:a.background,subject:"timur"};

    const stackQ=hasAny(q,["стек","технолог","tools","stack","technology","javascript","node","sql","api","webhook"]);
    if(stackQ && subject==="timur") return{lang,intent:"stack",text:a.stack,subject:"timur"};

    const aiQ=hasAny(q,["ии","нейросет","llm"," ai ","ai ","агент","agent"]);
    if(aiQ && subject==="timur") return{lang,intent:"ai",text:a.ai,subject:"timur"};

    const automationQ=hasAny(q,["автоматиз","автоматизац","automation","automate","workflow","процесс"]);
    if(automationQ && subject==="timur") return{lang,intent:"automation",text:a.automation,subject:"timur"};

    const productQ=hasAny(q,["продукт","mvp","гипотез","product","prototype","прототип"]);
    if(productQ && subject==="timur") return{lang,intent:"product",text:a.product,subject:"timur"};

    const hardQ=hasAny(q,["самым слож","что было слож","сложност","hardest","difficult","challenge"]);
    const archQ=hasAny(q,["как устро","архитект","как сделан","architecture","how is","how built","built"]);
    const testQ=hasAny(q,["как тест","тестир","провер","testing","tested","verify"]);
    if(subject==="tube"){
      if(hardQ)return{lang,intent:"project-hard",text:a.tube.hard,subject,project:"tube"};
      if(testQ)return{lang,intent:"project-testing",text:a.tube.testing,subject,project:"tube"};
      if(archQ)return{lang,intent:"project-architecture",text:a.tube.architecture,subject,project:"tube"};
      return{lang,intent:"project-overview",text:a.tube.overview,subject,project:"tube"};
    }
    if(subject==="feed"){
      if(hardQ)return{lang,intent:"project-hard",text:a.feed.hard,subject,project:"feed"};
      if(testQ)return{lang,intent:"project-testing",text:a.feed.testing,subject,project:"feed"};
      if(archQ||q.includes("node"))return{lang,intent:"project-architecture",text:a.feed.architecture,subject,project:"feed"};
      return{lang,intent:"project-overview",text:a.feed.overview,subject,project:"feed"};
    }

    if(hasAny(q,["что дела","что стро","какие проект","what do you build","what have you built","projects","portfolio"])) {
      return{lang,intent:"overview",text:lang==="ru"?"Тимур делает небольшие продукты и автоматизации на стыке product thinking, AI и разработки. Сейчас в выбранных работах — TubeScore и FeedPulse; список проектов ещё будет расширяться.":"Timur builds small products and automations at the intersection of product thinking, AI and software. The current selected work includes TubeScore and FeedPulse; the project list is still being curated.",subject:"timur"};
    }

    if(isPronounFollowup(q)&&subject==="timur"){
      return{lang,intent:"identity-more",text:rotate("timur",a.identityMore),subject};
    }

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
    const name=id==="tube"?"TubeScore":"FeedPulse";
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
    if(event.key==="/"&&!editing&&input){event.preventDefault();input.focus();}
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

    setText("[data-demo-label]",t.demo);
    setText('.nav-links a[href="#work"]',t.nav.work);
    setText('.nav-links a[href="#query"]',t.nav.query);
    setText('.nav-links a[href="#about"]',t.nav.about);
    setText(".hero .eyebrow",t.hero.eyebrow);
    setHTML(".hero h1",t.hero.title);
    setText(".hero-lede",t.hero.lede);
    document.querySelectorAll(".hero-meta span").forEach((el,i)=>{if(t.hero.meta[i])el.textContent=t.hero.meta[i];});
    const fh=document.querySelectorAll(".field-head span");if(fh[0])fh[0].textContent=t.field.title;if(fh[1])fh[1].textContent=t.field.hint;
    document.querySelectorAll(".field-fallback button").forEach((el,i)=>{if(t.field.buttons[i])el.textContent=t.field.buttons[i];});

    const qLabels=document.querySelectorAll("#query > .section-label span");if(qLabels[0])qLabels[0].textContent=t.query.title;if(qLabels[1])qLabels[1].textContent=t.query.status;
    document.querySelectorAll(".suggestions button").forEach((button,i)=>{const pair=t.query.suggestions[i];if(pair){button.textContent=pair[0];button.dataset.suggestion=pair[1];}});
    if(input)input.placeholder=t.query.placeholder;setHTML(".query-hint",t.query.hint);

    const wLabels=document.querySelectorAll("#work > .section-label span");if(wLabels[0])wLabels[0].textContent=t.work.title;if(wLabels[1])wLabels[1].textContent=t.work.note;
    const pcopy={tube:t.work.tube,feed:t.work.feed};
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