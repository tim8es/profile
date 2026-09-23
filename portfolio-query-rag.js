(() => {
  const html = document.documentElement;
  let kb = null;
  let kbError = null;

  const kbReady = fetch("./generated/portfolio-data.json", { cache: "no-cache" })
    .then(async (response) => {
      if (!response.ok) throw new Error(`portfolio-data.json: HTTP ${response.status}`);
      const data = await response.json();
      if (!data || !Array.isArray(data.facts)) throw new Error("Invalid portfolio runtime data");
      kb = data;
      return data;
    })
    .catch((error) => {
      kbError = error;
      console.error("Portfolio knowledge base failed to load", error);
      return null;
    });

  const state = {
    lang: localStorage.getItem("portfolio-lang") || "ru",
    history: [],
    subject: "timur",
    lastFacts: []
  };

  const chatLog = document.querySelector("[data-chat-log]");
  const form = document.querySelector("[data-query-form]");
  const input = document.querySelector("[data-query-input]");
  const mode = document.querySelector("[data-query-mode]");

  const topicLexicon = {
    identity:["кто","тимур","who","person","профиль"],
    experience:["где работал","компан","опыт","career","experience","worked"],
    companies:["компан","где работал","employer","company"],
    skills:["умеет","навык","компетенц","skills","can do","capabil"],
    strengths:["удив","сильн","преимущ","strength","differentiat","unique"],
    fit:["подойд","работ","роль","проект","fit","role","job","suitable"],
    projects:["проект","делал","создал","built","project","portfolio"],
    product:["продукт","mvp","гипотез","product","prototype"],
    process:["процесс","операц","workflow","process"],
    ai:["ии","ai","llm","agent","агент"],
    technical:["стек","технолог","api","javascript","node","sql","technical","stack"],
    tubescore:["tubescore","tube score"],
    feedpulse:["feedpulse","feed pulse"]
  };

  function norm(v){return String(v||"").toLowerCase().replace(/ё/g,"е").replace(/[^a-zа-я0-9\s-]/gi," ").replace(/\s+/g," ").trim();}
  function detectLang(q){const c=(q.match(/[А-Яа-яЁё]/g)||[]).length;const l=(q.match(/[A-Za-zА-Яа-яЁё]/g)||[]).length;return l&&c/l>.25?"ru":state.lang;}
  function detectTopics(q){
    const n=norm(q), found=[];
    Object.entries(topicLexicon).forEach(([topic,terms])=>{if(terms.some(t=>n.includes(norm(t))))found.push(topic);});
    if (!found.length && /^(что еще|что ещё|а еще|а ещё|what else|tell me more)/.test(n)) {
      return state.lastFacts.flatMap(id => kb?.facts?.find(f=>f.id===id)?.topics||[]);
    }
    return [...new Set(found)];
  }
  function scoreFact(fact, q, topics){
    const n=norm(q); let score=0;
    fact.topics.forEach(t=>{if(topics.includes(t))score+=4;});
    const words=new Set(n.split(" ").filter(Boolean));
    const text=norm(fact.text.ru+" "+fact.text.en);
    words.forEach(w=>{if(w.length>3&&text.includes(w))score+=0.6;});
    if(state.lastFacts.includes(fact.id))score-=0.7;
    return score;
  }
  function retrieve(q){
    if (!kb?.facts?.length) return [];
    let topics=detectTopics(q);
    const n=norm(q);
    if(/все что|всё что|everything|all you know/.test(n))topics=["identity","experience","companies","skills","projects","strengths","product","ai","technical"];
    if(/слаб/.test(n)||/weakness/.test(n))topics=["fit","strengths"];
    const ranked=kb.facts.map(f=>({fact:f,score:scoreFact(f,q,topics)})).sort((a,b)=>b.score-a.score);
    const selected=ranked.filter(x=>x.score>0).slice(0, topics.length>3?9:6).map(x=>x.fact);
    return selected.length?selected:kb.facts.filter(f=>f.topics.includes("identity")).slice(0,3);
  }

  const planners = {
    ru: {
      identity:f=>"Тимур Даутов — "+joinFacts(f),
      default:f=>joinFacts(f),
      broad:f=>"Если собрать главное: "+joinFacts(f),
      strengths:f=>"Если смотреть на профиль целиком, его отличие в сочетании нескольких вещей: "+joinFacts(f),
      fit:f=>"По фактам из портфолио, наиболее естественный fit выглядит так: "+joinFacts(f),
      weakness:f=>"Портфолио не должно придумывать слабые стороны. Из подтверждённых данных можно осторожно сказать следующее: "+joinFacts(f)
    },
    en: {
      identity:f=>"Timur Dautov — "+joinFacts(f),
      default:f=>joinFacts(f),
      broad:f=>"The main picture is: "+joinFacts(f),
      strengths:f=>"Looking across the profile, the differentiator is the combination of several things: "+joinFacts(f),
      fit:f=>"Based on the portfolio evidence, the clearest fit is: "+joinFacts(f),
      weakness:f=>"The portfolio should not invent weaknesses. From the available evidence, the most careful statement is: "+joinFacts(f)
    }
  };
  function stripLead(s){return s.replace(/^Тимур Даутов —\s*/,"").replace(/^Timur Dautov\s+/,"").replace(/^He\s+/,"").replace(/^Он\s+/,"");}
  function joinFacts(facts){
    return facts.slice(0,5).map((f,i)=> {
      let s=f.text[state.lang];
      if(i>0)s=stripLead(s);
      return s.replace(/\.$/,"");
    }).join(". ")+".";
  }
  function planType(q){
    const n=norm(q);
    if(/все что|всё что|everything|all you know/.test(n))return"broad";
    if(/удив|сильн|преимущ|differentiat|strength|unique/.test(n))return"strengths";
    if(/подойд|fit|role|job|работу|роль/.test(n))return"fit";
    if(/слаб|weakness/.test(n))return"weakness";
    if(/кто|who is/.test(n))return"identity";
    return"default";
  }

  function append(role,text,facts=[],engine="local"){
    const row=document.createElement("div");row.className=`chat-message chat-message--${role}`;
    const roleEl=document.createElement("span");roleEl.className="chat-role";roleEl.textContent=role==="user"?(state.lang==="ru"?"вы":"you"):(state.lang==="ru"?"портфолио":"portfolio");
    const bubble=document.createElement("div");bubble.className="chat-bubble";bubble.textContent=text;
    if(role==="bot"){
      const meta=document.createElement("div");meta.className="rag-answer-meta";
      const chip=document.createElement("span");chip.className="rag-chip";chip.textContent=engine==="server"?"grounded LLM":"local composer";meta.appendChild(chip);bubble.appendChild(meta);
      if(facts.length){
        const details=document.createElement("details");details.className="rag-sources";
        const summary=document.createElement("summary");summary.textContent=(state.lang==="ru"?"Источники":"Sources")+" · "+facts.length;
        const list=document.createElement("div");list.className="rag-source-list";
        facts.forEach((f,i)=>{
          const item=document.createElement("div");item.className="rag-source";
          const num=document.createElement("b");num.textContent=String(i+1).padStart(2,"0");
          const body=document.createElement("span");body.textContent=f.text[state.lang]+" — ";
          if(f.source?.url){const a=document.createElement("a");a.href=f.source.url;a.target="_blank";a.rel="noreferrer";a.textContent=f.source.label;body.appendChild(a);}
          else body.appendChild(document.createTextNode(f.source?.label||"Portfolio"));
          item.append(num,body);list.appendChild(item);
        });
        details.append(summary,list);bubble.appendChild(details);
      }
    }
    row.append(roleEl,bubble);chatLog.appendChild(row);chatLog.scrollTop=chatLog.scrollHeight;
    return bubble;
  }

  async function serverAnswer(question,facts){
    try{
      const res=await fetch("/api/ask",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({
        question,
        locale:state.lang,
        history:state.history.slice(-6),
        facts:facts.map(f=>({id:f.id,text:f.text[state.lang],source:f.source}))
      })});
      if(!res.ok)return null;
      const data=await res.json();
      return typeof data.answer==="string"&&data.answer.trim()?data.answer.trim():null;
    }catch{return null;}
  }

  async function ask(question){
    const q=String(question||"").trim();if(!q)return;
    state.lang=detectLang(q);
    append("user",q);

    if (!kb) await kbReady;
    if (!kb?.facts?.length) {
      append(
        "bot",
        state.lang==="ru"
          ? "База знаний не загрузилась. Остальная интерактивность страницы продолжает работать; попробуйте обновить страницу."
          : "The knowledge base failed to load. The rest of the page remains interactive; try refreshing the page."
      );
      if (mode) {
        mode.textContent="knowledge base unavailable";
        mode.className="rag-mode-local";
      }
      return;
    }

    const facts=retrieve(q);
    state.lastFacts=facts.map(f=>f.id);
    const type=planType(q);
    const local=(planners[state.lang][type]||planners[state.lang].default)(facts);
    const pending=append("bot",state.lang==="ru"?"Собираю ответ из подтверждённых фактов…":"Composing from verified facts…",facts,"local");
    const answer=await serverAnswer(q,facts);
    pending.firstChild ? null : null;
    // Rebuild the pending bubble so sources remain consistent.
    pending.textContent=answer||local;
    const meta=document.createElement("div");meta.className="rag-answer-meta";
    const chip=document.createElement("span");chip.className="rag-chip";chip.textContent=answer?"grounded LLM":"local composer";meta.appendChild(chip);pending.appendChild(meta);
    const details=document.createElement("details");details.className="rag-sources";
    const summary=document.createElement("summary");summary.textContent=(state.lang==="ru"?"Источники":"Sources")+" · "+facts.length;
    const list=document.createElement("div");list.className="rag-source-list";
    facts.forEach((f,i)=>{
      const item=document.createElement("div");item.className="rag-source";
      const num=document.createElement("b");num.textContent=String(i+1).padStart(2,"0");
      const body=document.createElement("span");body.appendChild(document.createTextNode(f.text[state.lang]+" — "));
      if(f.source?.url){const a=document.createElement("a");a.href=f.source.url;a.target="_blank";a.rel="noreferrer";a.textContent=f.source.label;body.appendChild(a);}
      else body.appendChild(document.createTextNode(f.source?.label||"Portfolio"));
      item.append(num,body);list.appendChild(item);
    });
    details.append(summary,list);pending.appendChild(details);
    if(mode){mode.textContent=answer?"grounded LLM":"local composer";mode.className=answer?"rag-mode-server":"rag-mode-local";}
    state.history.push({role:"user",content:q},{role:"assistant",content:answer||local});
  }

  form?.addEventListener("submit",e=>{e.preventDefault();ask(input.value);input.value="";});
  document.addEventListener("keydown",(event)=>{
    const tag=document.activeElement?.tagName?.toLowerCase();
    const editing=tag==="input"||tag==="textarea"||document.activeElement?.isContentEditable;
    if(event.key==="/"&&!editing&&input){event.preventDefault();input.focus();}
  });
  document.querySelectorAll("[data-suggestion]").forEach(b=>b.addEventListener("click",()=>ask(b.dataset.suggestion)));
  document.querySelectorAll("[data-project-question]").forEach(b=>b.addEventListener("click",()=>{ask(b.dataset.projectQuestion);document.getElementById("query").scrollIntoView({behavior:"smooth"});}));
  const projectItems=[...document.querySelectorAll(".project-item")];
  function activateProject(item, open=true){
    projectItems.forEach(x=>{
      const active=x===item&&open;
      x.classList.toggle("is-active",active);
      x.querySelector(".project-trigger")?.setAttribute("aria-expanded",String(active));
    });
  }
  projectItems.forEach(item=>{
    const trigger=item.querySelector(".project-trigger");
    trigger?.addEventListener("click",()=>activateProject(item,!item.classList.contains("is-active")));
    if(window.matchMedia("(hover:hover) and (pointer:fine)").matches){
      item.addEventListener("mouseenter",()=>activateProject(item,true));
    }
  });

  const langToggle=document.querySelector("[data-lang-toggle]"),langLabel=document.querySelector("[data-lang-label]");
  if(langLabel)langLabel.textContent=state.lang.toUpperCase();
  langToggle?.addEventListener("click",()=>{state.lang=state.lang==="ru"?"en":"ru";localStorage.setItem("portfolio-lang",state.lang);langLabel.textContent=state.lang.toUpperCase();});
  const themeToggle=document.querySelector("[data-theme-toggle]");
  const saved=localStorage.getItem("portfolio-theme")||"dark";html.dataset.theme=saved;
  themeToggle?.addEventListener("click",()=>{html.dataset.theme=html.dataset.theme==="dark"?"light":"dark";localStorage.setItem("portfolio-theme",html.dataset.theme);});

  append("bot", state.lang==="ru" ? "Спроси что угодно о Тимуре. Ответ строится из модерируемых фактов; под ним можно раскрыть источники." : "Ask anything about Timur. The answer is built from curated facts, with expandable sources.");
})();