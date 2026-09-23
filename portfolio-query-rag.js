(() => {
  const html = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const state = {
    lang: localStorage.getItem("portfolio-lang") || "en",
    lastSubject: "timur",
    lastIntent: "identity",
    lastProject: null,
    moreCursor: { timur:0, skills:0, tube:0, critic:0, gac:0, shorts:0, feed:0, hh:0 }
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
        status:"grounded local composer / curated knowledge base",
        intro:"Ask me about Timur, his work, projects, product approach or technical decisions.",
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
        tube:{kind:"Browser product",desc:"A zero-token Chrome extension that identifies movies on YouTube and shows ratings in the viewing context.",details:[["Problem","Checking ratings breaks the viewing flow."],["Built","MV3 extension, deterministic matching, Wikidata provider, caching and SPA handling."],["Proof","Typecheck, tests, production build checks and Chromium browser smoke."]],ask:"Ask deeper about TubeScore →"},
        critic:{kind:"AI system",desc:"An evidence-backed critic designed to catch material mistakes and contradictions without interrupting on every minor issue.",details:[["Problem","AI assistants can lose context or miss important contradictions."],["Built","Context, critic and verifier workflows plus a privacy-gated desktop bridge experiment."],["Status","Early-stage; implemented slices and security-flow checks are separated from host verification."]],ask:"Ask deeper about AI Critic →"},
        gac:{kind:"Agent infrastructure",desc:"A GitHub-native protocol that lets autonomous coding agents continue work safely across disposable sessions.",details:[["Problem","Agent sessions disappear, while ownership and unfinished work need to survive."],["Built","Issue lifecycle, atomic claim refs, work branches, leases, checkpoints and takeover rules."],["Proof","Adversarial live subset: 5 PASS, 0 FAIL, 0 not executed."]],ask:"Ask deeper about GAC →"},
        shorts:{kind:"Automation system",desc:"A local-first pipeline for generating short-form AI video from research and scripting through rendering and review.",details:[["Problem","Content production has many repetitive handoffs and failure points."],["Built","n8n workflows with local LLMs, FFmpeg rendering, TTS, captions and an operations control plane."],["Boundary","Publishing is kept separate from generation and requires explicit review/credentials."]],ask:"Ask deeper about the pipeline →"},
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
        shorts:[["Workflow","How is the AI video pipeline built?"],["Local stack","What runs locally in the pipeline?"],["Safety","Why is publishing separated?"]],
        feed:[["Architecture","How is FeedPulse built?"],["Hardest part","What was the hardest part of FeedPulse?"],["Portability","How does FeedPulse stay cross-platform?"]],
        hh:[["Contribution","What did Timur add to hh-applicant-tool?"],["Architecture","How was multi-account isolation implemented?"],["Testing","How was the contribution verified?"]]
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
        status:"grounded composer / модерируемая база знаний",
        intro:"Спроси о Тимуре, его работах, проектах, продуктовом подходе или технических решениях.",
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
        tube:{kind:"Браузерный продукт",desc:"Chrome-расширение без токенов, которое определяет фильмы на YouTube и показывает рейтинги прямо в контексте просмотра.",details:[["Проблема","Проверка рейтинга прерывает просмотр и требует отдельного поиска."],["Что сделал","MV3-расширение, детерминированный матчинг, Wikidata, кеширование и SPA-навигация."],["Проверка","Typecheck, тесты, production build checks и Chromium browser smoke."]],ask:"Спросить подробнее о TubeScore →"},
        critic:{kind:"AI-система",desc:"Evidence-backed критик, который ищет существенные ошибки и противоречия, но не вмешивается по мелочам.",details:[["Проблема","AI-ассистенты могут терять контекст и пропускать важные противоречия."],["Что сделал","Context/Critic/Verifier workflow и privacy-gated эксперимент с desktop bridge."],["Статус","Early-stage: реализованные части и security-flow проверки отделены от host verification."]],ask:"Спросить подробнее об AI Critic →"},
        gac:{kind:"Инфраструктура агентов",desc:"GitHub-native протокол, который позволяет автономным coding-агентам продолжать работу между независимыми сессиями.",details:[["Проблема","Сессия агента исчезает, а состояние, ownership и незавершённая работа должны сохраняться."],["Что сделал","Issue lifecycle, atomic claim refs, work branches, leases, checkpoints и takeover rules."],["Проверка","Adversarial live subset: 5 PASS, 0 FAIL, 0 not executed."]],ask:"Спросить подробнее о GAC →"},
        shorts:{kind:"Система автоматизации",desc:"Local-first pipeline для производства коротких AI-видео: от исследования и сценария до рендера и review.",details:[["Проблема","В производстве контента много повторяющихся handoff'ов и точек отказа."],["Что сделал","n8n workflow, локальные LLM, FFmpeg, TTS, субтитры и operations control plane."],["Граница","Публикация отделена от генерации и требует отдельного review/credentials."]],ask:"Спросить подробнее о pipeline →"},
        feed:{kind:"Инструмент для агентов",desc:"Небольшая утилита, которая приводит RSS/Atom-источники к предсказуемому контенту для AI-агентов.",details:[["Проблема","Агентам постоянно приходится нормализовать несовместимые форматы фидов."],["Что сделал","Компактная Node.js-утилита с focused XML parser и bounded content handling."],["Проверка","Рассчитана на Windows, macOS и Linux с небольшим числом зависимостей."]],ask:"Спросить подробнее о FeedPulse →"},
        hh:{kind:"Open-source вклад",desc:"Принятый upstream PR, который добавил управление несколькими профилями в desktop UI существующего проекта.",details:[["Проблема","CLI уже поддерживал изолированные профили, но UI не позволял ими управлять и переключаться."],["Что сделал","Profile CRUD, состояние авторизации, переключение, изоляция данных и runtime guards."],["Проверка","PR #84 merged; 116 regression tests и Chromium/Playwright UI E2E прошли."]],ask:"Спросить подробнее о вкладе →"}
      },
      about: {
        title:"Обо мне",
        note:"",
        statement:"Лучше всего я работаю там, где запутанный процесс нужно превратить в понятный продукт или систему.",
        body:["Мой бэкграунд — проекты, процессы и delivery в Skyeng, SPIKS и OpiniQ: от QA/CX и B2B CRM до автоматизации workflow.","Сейчас много делаю руками: AI-агенты, n8n, API, JavaScript/Node.js, Python, SQL, браузерные инструменты и проверяемые прототипы."]
      },
      footer:["Timur Dautov © 2026",""],
      deep:{
        tube:[["Архитектура","Как устроен TubeScore?"],["Самая сложная часть","Что было самым сложным в TubeScore?"],["Тестирование","Как ты тестировал TubeScore?"]],
        critic:[["Архитектура","Как устроен AI Critic?"],["Безопасность","Как AI Critic работает с privacy и permissions?"],["Статус","Что реально проверено в AI Critic?"]],
        gac:[["Протокол","Как работает GitHub Agent Continuity?"],["Конкуренция","Как GAC предотвращает конфликты между агентами?"],["Тестирование","Как тестировался GAC?"]],
        shorts:[["Workflow","Как устроен AI video pipeline?"],["Локальный стек","Что в pipeline работает локально?"],["Безопасность","Почему публикация отделена от генерации?"]],
        feed:[["Архитектура","Как устроен FeedPulse?"],["Самая сложная часть","Что было самым сложным в FeedPulse?"],["Переносимость","Как FeedPulse работает на разных ОС?"]],
        hh:[["Вклад","Что Тимур добавил в hh-applicant-tool?"],["Архитектура","Как реализована изоляция нескольких аккаунтов?"],["Тестирование","Как проверялся этот вклад?"]]
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
    experience:["где работал","компан","опыт","career","experience","worked","background"],
    companies:["компан","где работал","employer","company"],
    skills:["умеет","навык","компетенц","skills","can do","capabil"],
    strengths:["удив","сильн","преимущ","strength","differentiat","unique"],
    fit:["подойд","работ","роль","fit","role","job","suitable"],
    projects:["проект","делал","создал","built","project","portfolio"],
    product:["продукт","mvp","гипотез","product","prototype"],
    process:["процесс","операц","workflow","process"],
    ai:["ии","ai","llm","agent","агент"],
    technical:["стек","технолог","api","javascript","node","sql","technical","stack"],
    architecture:["архитект","как устро","how built","architecture"],
    testing:["тест","провер","testing","tested","verify"],
    tubescore:["tubescore","tube score"],
    critic:["ai critic","critic","критик"],
    gac:["github agent continuity","gac","continuity"],
    shorts:["video pipeline","shorts","youtube shorts","n8n","видео"],
    feedpulse:["feedpulse","feed pulse"],
    hh:["hh-applicant-tool","hh applicant","multi-account","мультиаккаунт"],
    booktranslator:["book translator","переводчик книг","перевод книг"],
    mindrail:["mindrail","control plane","контрольный слой"],
    pmo:["pm 0.1","pmo01","инженерия исполнения"]
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

    if(!found.length && /^(что еще|что ещё|а еще|а ещё|what else|tell me more)/.test(q)){
      return [...new Set(state.lastFacts.flatMap(id=>kb?.facts?.find(f=>f.id===id)?.topics||[]))];
    }
    return [...new Set(found)];
  }

  function scoreFact(fact,question,topics){
    const q=norm(question);
    let score=0;
    fact.topics.forEach(topic=>{if(topics.includes(topic)) score+=4;});
    const words=new Set(q.split(" ").filter(word=>word.length>3));
    const searchable=norm(fact.text.ru+" "+fact.text.en+" "+fact.id+" "+fact.topics.join(" "));
    words.forEach(word=>{if(searchable.includes(word)) score+=0.7;});
    if(state.lastFacts.includes(fact.id)) score-=0.6;
    return score;
  }

  function retrieve(question){
    if(!kb?.facts?.length) return [];
    let topics=detectTopics(question);
    const q=norm(question);

    if(/все что|всё что|everything|all you know/.test(q)){
      topics=["identity","experience","companies","skills","projects","strengths","product","ai","technical"];
    }
    if(/слаб/.test(q)||/weakness/.test(q)) topics=["fit","strengths"];

    const ranked=kb.facts
      .map(fact=>({fact,score:scoreFact(fact,question,topics)}))
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
    return facts.slice(0,5).map((fact,index)=>{
      let text=fact.text[lang]||fact.text.en||fact.text.ru;
      if(index>0) text=stripLead(text);
      return text.replace(/\\.$/,"");
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
    const meta=document.createElement("div");
    meta.className="rag-answer-meta";
    const chip=document.createElement("span");
    chip.className="rag-chip";
    chip.textContent=engine==="server"?"grounded LLM":"local composer";
    meta.appendChild(chip);

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
    bubble.append(meta,details);
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
    bubble.textContent=text;

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

    row.append(roleEl,bubble);
    chatLog.appendChild(row);
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

    const facts=retrieve(text);
    state.lastFacts=facts.map(f=>f.id);
    const local=composeLocal(text,facts,lang);
    const server=await serverAnswer(text,facts,lang);
    const answer=server||local;
    const project=facts.find(f=>f.context?.projectId)?.context?.projectId;
    const projectMap={tubescore:"tube","ai-critic":"critic","github-agent-continuity":"gac","n8n-youtube-shorts-workflow":"shorts",feedpulse:"feed","hh-applicant-tool":"hh"};
    const projectId=projectMap[project]||null;

    state.lastSubject=projectId||"timur";
    state.lastProject=projectId||state.lastProject;
    state.lastIntent=planType(text);
    state.history.push({role:"user",content:text},{role:"assistant",content:answer});

    appendMessage("bot",answer,projectId,[],true,lang,facts,server?"server":"local");
  }

  function openProjectQuestions(id){
    const lang=state.lang;
    const names={tube:"TubeScore",critic:"AI Critic",gac:"GitHub Agent Continuity",shorts:"AI Video Pipeline",feed:"FeedPulse",hh:"hh-applicant-tool"}; const name=names[id]||id;
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
    const pcopy={tube:t.work.tube,critic:t.work.critic,gac:t.work.gac,shorts:t.work.shorts,feed:t.work.feed,hh:t.work.hh};
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