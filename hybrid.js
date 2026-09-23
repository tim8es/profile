(() => {
  const html = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Theme
  const toggle = document.querySelector("[data-theme-toggle]");
  const icon = document.querySelector("[data-theme-icon]");
  const saved = localStorage.getItem("portfolio-theme");
  const preferred = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";

  function setTheme(theme) {
    html.dataset.theme = theme;
    localStorage.setItem("portfolio-theme", theme);
    if (icon) icon.textContent = theme === "dark" ? "☼" : "●";
    toggle?.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
  }
  setTheme(saved || preferred);
  toggle?.addEventListener("click", () => setTheme(html.dataset.theme === "dark" ? "light" : "dark"));

  // Projects
  const projects = [...document.querySelectorAll("[data-project]")];
  let activeProject = "tube";

  function activateProject(id, expand = true) {
    activeProject = id;
    projects.forEach((item) => {
      const active = item.dataset.project === id && expand;
      item.classList.toggle("is-active", active);
      item.querySelector(".project-trigger")?.setAttribute("aria-expanded", String(active));
    });
  }

  projects.forEach((item) => {
    const trigger = item.querySelector(".project-trigger");
    trigger?.addEventListener("click", () => {
      const already = item.classList.contains("is-active");
      activateProject(item.dataset.project, !already);
    });
    if (window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
      item.addEventListener("mouseenter", () => activateProject(item.dataset.project, true));
    }
  });

  // Compact local portfolio chat.
  const chatLog = document.querySelector("[data-chat-log]");
  const form = document.querySelector("[data-query-form]");
  const input = document.querySelector("[data-query-input]");
  const suggestions = [...document.querySelectorAll("[data-suggestion]")];
  const askProjectButtons = [...document.querySelectorAll("[data-ask-project]")];

  const knowledge = [
    {
      id:"identity",
      aliases:["who is timur","who is timur dautov","tell me about timur","about timur","кто такой тимур","расскажи про тимура","кто такой тимур даутов","кто ты"],
      keywords:["timur","dautov","identity","person","тимур","даутов"],
      answer:"Timur Dautov is a product and process manager who has moved increasingly into hands-on product building. He combines product thinking with AI tooling, automation, APIs and lightweight software development, usually starting from a concrete workflow or user problem rather than from a technology.",
      project:null
    },
    {
      id:"overview",
      aliases:["what do you build","what does timur build","show work","what have you built","что ты делаешь","что строишь","что сделал"],
      keywords:["build","make","create","work","portfolio","products","projects","делаешь","проекты"],
      answer:"I build small products and automations that remove friction from a workflow. The current shortlist includes browser tooling, agent utilities and AI-assisted process automation.",
      project:null
    },
    {
      id:"tube-overview",
      aliases:["what is tubescore","tell me about tubescore","tubescore"],
      keywords:["tubescore","browser","chrome","youtube","movie","rating","extension","расширение"],
      answer:"TubeScore is a Chrome extension that puts movie ratings directly on YouTube trailers. The goal is simple: remove the context switch to a separate ratings site while keeping the matching deterministic and the runtime lightweight.",
      project:"tube"
    },
    {
      id:"tube-architecture",
      aliases:["tubescore architecture","how is tubescore built","why this architecture","architecture of tubescore"],
      keywords:["tubescore","architecture","mv3","wikidata","cache","spa"],
      answer:"TubeScore uses a Manifest V3 extension architecture with a content-script UI, a service-worker orchestration layer and a provider seam for metadata. Matching is deterministic, ratings come from a policy-safe source, and caching plus concurrency controls keep lookups cheap.",
      project:"tube"
    },
    {
      id:"tube-hard",
      aliases:["hardest part of tubescore","tubescore challenge","what was difficult in tubescore"],
      keywords:["tubescore","hard","hardest","challenge","difficult","matching","youtube","spa"],
      answer:"The difficult part was not drawing the badge — it was reliably identifying the right title from messy YouTube context and keeping the overlay correct across YouTube's SPA navigation without introducing an LLM or secret-bearing backend.",
      project:"tube"
    },
    {
      id:"tube-test",
      aliases:["how did you test tubescore","tubescore testing","how is tubescore verified"],
      keywords:["tubescore","test","testing","verify","playwright","smoke","qa"],
      answer:"TubeScore is verified with deterministic unit coverage plus an isolated Chromium/Playwright smoke flow that checks both initial overlay rendering and SPA navigation. That matters because a browser extension can look correct in code while failing in the actual page lifecycle.",
      project:"tube"
    },
    {
      id:"feed-overview",
      aliases:["what is feedpulse","tell me about feedpulse","feedpulse"],
      keywords:["feedpulse","rss","atom","feed","content","agent","agents"],
      answer:"FeedPulse is a small ingestion utility for AI agents. It reads RSS/Atom-style sources and normalizes them into predictable structured content so each agent does not need its own parser.",
      project:"feed"
    },
    {
      id:"feed-architecture",
      aliases:["feedpulse architecture","how is feedpulse built","why node for feedpulse"],
      keywords:["feedpulse","architecture","node","parser","xml","dependency","cross platform"],
      answer:"FeedPulse deliberately uses a small Node.js implementation with a focused XML parser instead of a heavy framework. The design goal is portability and a narrow dependency surface: easy to run on Windows, macOS or Linux and easy for another agent to invoke.",
      project:"feed"
    },
    {
      id:"feed-hard",
      aliases:["hardest part of feedpulse","feedpulse challenge","what was difficult in feedpulse"],
      keywords:["feedpulse","hard","challenge","inconsistent","rss","atom","normalize"],
      answer:"The main design problem is inconsistency: feeds that are nominally similar often differ in namespaces, content fields, dates and embedded markup. The useful work is normalizing those differences without turning a tiny utility into a giant feed platform.",
      project:"feed"
    },
    {
      id:"automation",
      aliases:["how do you automate processes","automation approach","tell me about automation","как автоматизируешь процессы"],
      keywords:["automation","automate","process","workflow","n8n","webhook","api","manual","автоматизация","процесс"],
      answer:"My automation approach starts with the process, not the tool: identify repeated decisions and handoffs, define inputs and success criteria, connect APIs or tools, then add validation and observability so the workflow is repeatable rather than merely automatic.",
      project:null
    },
    {
      id:"ai",
      aliases:["show me ai work","how do you use ai","ai work","tell me about ai"],
      keywords:["ai","llm","agent","agents","model","нейросеть","ии"],
      answer:"I use LLMs mainly as components inside products and workflows: reasoning, classification, content processing and tool orchestration. I care more about the surrounding system — inputs, tools, checks and failure handling — than about a chat box by itself.",
      project:null
    },
    {
      id:"background",
      aliases:["what is your background","what's your background","tell me about your background","experience","career","опыт"],
      keywords:["background","experience","manager","career","process","project","опыт","карьера"],
      answer:"My background is in project and process management. That shapes how I build: I start from the user problem, workflow and constraint, then choose the smallest technical solution that can be tested quickly.",
      project:null
    },
    {
      id:"stack",
      aliases:["what stack do you use","technologies","technical stack","what tools do you use","стек","технологии"],
      keywords:["stack","technology","javascript","node","sql","api","webhook","github","tools","стек"],
      answer:"The recurring stack is JavaScript / Node.js, browser APIs, REST APIs and webhooks, SQL, automation tooling, LLM tooling and GitHub. The stack is secondary to the product outcome, so it changes when a smaller solution is available.",
      project:null
    },
    {
      id:"product",
      aliases:["product thinking","how do you build products","mvp approach","product approach","продуктовый подход"],
      keywords:["product","mvp","prototype","problem","user","hypothesis","продукт","гипотеза"],
      answer:"I prefer a product-builder loop: understand the problem, cut scope hard, build the smallest useful version, expose it to reality, then keep, change or kill the hypothesis based on evidence.",
      project:null
    }
  ];

  const stopwords = new Set(["the","a","an","is","are","do","does","you","your","me","my","about","tell","show","what","how","who","of","to","and","or","in","на","про","что","как","кто","такой","мне"]);
  const synonymGroups = [
    ["build","make","create","develop"],
    ["automation","automate","workflow","process"],
    ["ai","llm","model","agent","agents"],
    ["browser","chrome","extension"],
    ["test","testing","verify","validation","qa"],
    ["background","experience","career"]
  ];

  function norm(value) {
    return String(value || "").toLowerCase().replace(/ё/g,"е").replace(/[^a-zа-я0-9\s-]/gi," ").replace(/\s+/g," ").trim();
  }

  function tokens(value) {
    const out = new Set(norm(value).split(" ").filter((x) => x && !stopwords.has(x)));
    synonymGroups.forEach((group) => {
      if (group.some((word) => out.has(word))) group.forEach((word) => out.add(word));
    });
    return out;
  }

  function trigrams(value) {
    const s = "  " + norm(value) + "  ";
    const set = new Set();
    for (let i=0;i<s.length-2;i++) set.add(s.slice(i,i+3));
    return set;
  }

  function similarity(a,b) {
    const A=trigrams(a), B=trigrams(b);
    if (!A.size || !B.size) return 0;
    let hit=0;
    A.forEach((x)=>{if(B.has(x)) hit++;});
    return hit / (A.size + B.size - hit);
  }

  function scoreEntry(query, entry) {
    const q = norm(query);
    const qt = tokens(query);
    let score = 0;

    entry.aliases.forEach((alias) => {
      const a = norm(alias);
      if (q === a) score = Math.max(score, 30);
      else if (q.includes(a) || a.includes(q)) score = Math.max(score, 16);
      score = Math.max(score, similarity(q,a) * 12);
    });

    entry.keywords.forEach((keyword) => {
      const k = norm(keyword);
      if (q.includes(k)) score += k.includes(" ") ? 5 : 3;
      tokens(k).forEach((token) => { if (qt.has(token)) score += 1.4; });
    });

    // Small explicit identity signal so natural forms like “who is Timur?” are robust.
    if (entry.id === "identity" && (q.includes("timur") || q.includes("тимур")) && (q.includes("who") || q.includes("кто") || q.includes("about") || q.includes("про"))) score += 12;

    return score;
  }

  function chooseAnswer(query) {
    const ranked = knowledge
      .map((entry) => ({entry,score:scoreEntry(query,entry)}))
      .sort((a,b)=>b.score-a.score);
    if (!ranked[0] || ranked[0].score < 3.1) {
      return {
        answer:"I don't have a confident local answer for that yet. Try asking about Timur, TubeScore, FeedPulse, AI, automation, product thinking, stack or background.",
        project:null
      };
    }
    return ranked[0].entry;
  }

  function appendMessage(role, text, projectId, actions=[]) {
    if (!chatLog) return;
    const row=document.createElement("div");
    row.className=`chat-message chat-message--${role}`;
    const roleEl=document.createElement("span");
    roleEl.className="chat-role";
    roleEl.textContent=role==="user"?"you":"portfolio";
    const bubble=document.createElement("div");
    bubble.className="chat-bubble";
    bubble.textContent=text;

    if (actions.length) {
      const wrap=document.createElement("div");
      wrap.className="chat-actions";
      actions.forEach((action)=>{
        const button=document.createElement("button");
        button.type="button";
        button.textContent=action.label;
        button.addEventListener("click",()=>askPortfolio(action.query));
        wrap.appendChild(button);
      });
      bubble.appendChild(wrap);
    }

    if (projectId) {
      const link=document.createElement("button");
      link.type="button";
      link.className="chat-project-link";
      link.textContent="Show related project ↓";
      link.addEventListener("click",()=>{
        activateProject(projectId,true);
        document.getElementById("work")?.scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"});
      });
      bubble.appendChild(document.createElement("br"));
      bubble.appendChild(link);
    }
    row.append(roleEl,bubble);
    chatLog.appendChild(row);
    chatLog.scrollTo({top:chatLog.scrollHeight,behavior:reduced?"auto":"smooth"});
  }

  function askPortfolio(query) {
    const text=String(query||"").trim();
    if (!text) return;
    appendMessage("user",text);
    const result=chooseAnswer(text);
    window.setTimeout(()=>appendMessage("bot",result.answer,result.project),reduced?0:100);
  }

  const deepQuestions = {
    tube:[
      {label:"Architecture",query:"How is TubeScore built?"},
      {label:"Hardest part",query:"What was the hardest part of TubeScore?"},
      {label:"Testing",query:"How did you test TubeScore?"}
    ],
    feed:[
      {label:"Architecture",query:"How is FeedPulse built?"},
      {label:"Hardest part",query:"What was the hardest part of FeedPulse?"},
      {label:"Why Node.js",query:"Why Node for FeedPulse?"}
    ]
  };

  function openProjectQuestions(id) {
    const name=id==="tube"?"TubeScore":"FeedPulse";
    appendMessage("user",`Ask deeper about ${name}`);
    appendMessage("bot",`Choose what you want to dig into about ${name}:`,null,deepQuestions[id]||[]);
    document.getElementById("query")?.scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"});
  }

  form?.addEventListener("submit",(event)=>{
    event.preventDefault();
    askPortfolio(input?.value);
    if(input) input.value="";
  });
  suggestions.forEach((button)=>button.addEventListener("click",()=>askPortfolio(button.dataset.suggestion)));
  askProjectButtons.forEach((button)=>button.addEventListener("click",()=>openProjectQuestions(button.dataset.askProject)));

  document.addEventListener("keydown",(event)=>{
    const tag=document.activeElement?.tagName?.toLowerCase();
    const editing=tag==="input"||tag==="textarea"||document.activeElement?.isContentEditable;
    if(event.key==="/"&&!editing&&input){event.preventDefault();input.focus();}
  });

  // Capability field: screen-space pointer deformation so the wave follows the cursor exactly.
  const canvas=document.querySelector("[data-field-canvas]");
  const fieldButtons=[...document.querySelectorAll("[data-field-query]")];
  fieldButtons.forEach((button)=>button.addEventListener("click",()=>{
    askPortfolio(`Show me ${button.dataset.fieldQuery} work`);
    document.getElementById("query")?.scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"});
  }));
  if(!canvas) return;
  const ctx=canvas.getContext("2d");
  if(!ctx) return;

  const capabilities=[
    {label:"AI",x:-.62,y:-.5,query:"Show me AI work"},
    {label:"Agents",x:-.12,y:-.68,query:"Tell me about agents"},
    {label:"APIs",x:.56,y:-.48,query:"What stack do you use?"},
    {label:"Automation",x:-.58,y:.16,query:"How do you automate processes?"},
    {label:"Product",x:.06,y:.04,query:"Tell me about product thinking"},
    {label:"Data",x:.62,y:.22,query:"What stack do you use?"},
    {label:"QA",x:-.18,y:.58,query:"How did you test TubeScore?"},
    {label:"Open source",x:.48,y:.66,query:"What's your background?"}
  ];

  let dpr=Math.min(window.devicePixelRatio||1,2),width=1,height=1;
  let rotX=-.78,rotZ=-.18,targetRotX=rotX,targetRotZ=rotZ;
  let pointer={x:0,y:0,inside:false,down:false,lastX:0,lastY:0};
  let hoverNode=-1,nodeScreens=[],time=0;

  function resize(){
    const rect=canvas.getBoundingClientRect();
    width=Math.max(1,rect.width);height=Math.max(1,rect.height);
    dpr=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  function colors(){
    const s=getComputedStyle(html);
    return {text:s.getPropertyValue("--text").trim(),muted:s.getPropertyValue("--muted").trim(),line:s.getPropertyValue("--line-strong").trim(),accent:s.getPropertyValue("--accent").trim()};
  }

  function baseHeight(x,y){return .13*Math.sin(x*4.1+time*.8)*Math.cos(y*3.4-time*.55);}

  function project(x,y,z){
    let yy=y*Math.cos(rotX)-z*Math.sin(rotX);
    let zz=y*Math.sin(rotX)+z*Math.cos(rotX);
    let xx=x*Math.cos(rotZ)-yy*Math.sin(rotZ);
    const y2=x*Math.sin(rotZ)+yy*Math.cos(rotZ);
    const perspective=1/(1.55-zz*.32);
    const scale=Math.min(width,height)*.72;
    return {x:width/2+xx*scale*perspective,y:height/2+y2*scale*.78*perspective,z:zz,scale:perspective};
  }

  function interactiveHeight(x,y){
    const base=baseHeight(x,y);
    if(!pointer.inside) return base;
    const screen=project(x,y,base);
    const dist=Math.hypot(screen.x-pointer.x,screen.y-pointer.y);
    const radius=Math.max(95,Math.min(width,height)*.28);
    const d=dist/radius;
    if(d>1.35) return base;
    const ripple=Math.sin(d*9-time*3.2)*Math.exp(-d*2.9)*.22;
    return base+ripple;
  }

  function draw(){
    const c=colors();
    ctx.clearRect(0,0,width,height);
    rotX+=(targetRotX-rotX)*.07;rotZ+=(targetRotZ-rotZ)*.07;
    if(!pointer.down&&!reduced) targetRotZ+=.0012;
    time+=reduced?0:.016;
    const n=18;ctx.lineWidth=1;
    for(let axis=0;axis<2;axis++){
      for(let i=0;i<n;i++){
        ctx.beginPath();
        for(let j=0;j<n;j++){
          const a=-1+(2*i)/(n-1),b=-1+(2*j)/(n-1);
          const x=axis===0?a:b,y=axis===0?b:a;
          const p=project(x,y,interactiveHeight(x,y));
          if(j===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);
        }
        ctx.strokeStyle=c.line;ctx.globalAlpha=.42;ctx.stroke();
      }
    }
    ctx.globalAlpha=1;
    nodeScreens=capabilities.map((cap,index)=>{
      const p=project(cap.x,cap.y,interactiveHeight(cap.x,cap.y)+.03);
      const active=index===hoverNode;
      ctx.beginPath();ctx.arc(p.x,p.y,active?5.5:3.5,0,Math.PI*2);
      ctx.fillStyle=active?c.accent:c.text;ctx.fill();
      ctx.font=`${active?600:500} 10px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.fillStyle=active?c.accent:c.muted;ctx.fillText(cap.label,p.x+9,p.y+3);
      return{x:p.x,y:p.y,index};
    });
    requestAnimationFrame(draw);
  }

  function updatePointer(event){
    const rect=canvas.getBoundingClientRect();
    pointer.x=event.clientX-rect.left;pointer.y=event.clientY-rect.top;
    let best=-1,dist=28;
    nodeScreens.forEach((node,index)=>{
      const d=Math.hypot(pointer.x-node.x,pointer.y-node.y);
      if(d<dist){dist=d;best=index;}
    });
    hoverNode=best;
    canvas.style.cursor=best>=0?"pointer":(pointer.down?"grabbing":"grab");
  }

  canvas.addEventListener("pointerenter",(event)=>{pointer.inside=true;updatePointer(event);});
  canvas.addEventListener("pointerleave",()=>{pointer.inside=false;pointer.down=false;hoverNode=-1;});
  canvas.addEventListener("pointermove",(event)=>{
    updatePointer(event);
    if(pointer.down){
      const dx=event.clientX-pointer.lastX,dy=event.clientY-pointer.lastY;
      targetRotZ+=dx*.006;
      targetRotX=Math.max(-1.15,Math.min(-.25,targetRotX+dy*.004));
      pointer.lastX=event.clientX;pointer.lastY=event.clientY;
    }
  });
  canvas.addEventListener("pointerdown",(event)=>{
    pointer.down=true;pointer.lastX=event.clientX;pointer.lastY=event.clientY;
    canvas.setPointerCapture?.(event.pointerId);
  });
  canvas.addEventListener("pointerup",(event)=>{
    const clicked=hoverNode;pointer.down=false;
    if(canvas.hasPointerCapture?.(event.pointerId))canvas.releasePointerCapture(event.pointerId);
    if(clicked>=0){
      askPortfolio(capabilities[clicked].query);
      document.getElementById("query")?.scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"});
    }
  });

  const ro=new ResizeObserver(resize);ro.observe(canvas);resize();draw();
})();