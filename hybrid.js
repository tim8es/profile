(() => {
  const html = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Theme
  const toggle = document.querySelector("[data-theme-toggle]");
  const icon = document.querySelector("[data-theme-icon]");
  const saved = localStorage.getItem("portfolio-theme");
  const preferred = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  setTheme(saved || preferred);

  function setTheme(theme) {
    html.dataset.theme = theme;
    localStorage.setItem("portfolio-theme", theme);
    if (icon) icon.textContent = theme === "dark" ? "☼" : "●";
    if (toggle) toggle.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
  }

  toggle?.addEventListener("click", () => {
    setTheme(html.dataset.theme === "dark" ? "light" : "dark");
  });

  // Projects
  const projects = [...document.querySelectorAll("[data-project]")];
  const previews = [...document.querySelectorAll("[data-preview]")];
  const previewIndex = document.querySelector("[data-preview-index]");
  const previewKind = document.querySelector("[data-preview-kind]");
  const previewProblem = document.querySelector("[data-preview-problem]");
  const previewQuery = document.querySelector("[data-preview-query]");

  const projectMeta = {
    tube: { index: "01 / TubeScore", kind: "Browser product", problem: "Remove a needless context switch.", query: "Tell me about TubeScore" },
    feed: { index: "02 / FeedPulse", kind: "Agent utility", problem: "Give agents predictable input.", query: "Tell me about FeedPulse" },
    automation: { index: "03 / AI workflow", kind: "Process automation", problem: "Turn repeated decisions into a traceable system.", query: "How do you automate processes?" },
    oss: { index: "04 / Open-source work", kind: "Existing codebases", problem: "Change real systems without rewriting them.", query: "Tell me about your open source work" }
  };

  let activeProject = "tube";

  function activateProject(id, expand = true) {
    if (!projectMeta[id]) return;
    activeProject = id;
    projects.forEach((item) => {
      const active = item.dataset.project === id;
      item.classList.toggle("is-active", active && expand);
      item.querySelector(".project-trigger")?.setAttribute("aria-expanded", String(active && expand));
    });
    previews.forEach((panel) => panel.classList.toggle("is-visible", panel.dataset.preview === id));
    const meta = projectMeta[id];
    if (previewIndex) previewIndex.textContent = meta.index;
    if (previewKind) previewKind.textContent = meta.kind;
    if (previewProblem) previewProblem.textContent = meta.problem;
  }

  projects.forEach((item) => {
    const trigger = item.querySelector(".project-trigger");
    trigger?.addEventListener("click", () => {
      const id = item.dataset.project;
      const already = item.classList.contains("is-active");
      activateProject(id, !already);
      if (already) {
        item.classList.remove("is-active");
        trigger.setAttribute("aria-expanded", "false");
      }
    });
    if (window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
      item.addEventListener("mouseenter", () => activateProject(item.dataset.project, true));
    }
  });

  // Local portfolio chat
  const chatLog = document.querySelector("[data-chat-log]");
  const form = document.querySelector("[data-query-form]");
  const input = document.querySelector("[data-query-input]");
  const suggestions = [...document.querySelectorAll("[data-suggestion]")];

  const knowledge = [
    {
      id: "overview",
      keywords: ["what build", "what do you build", "work", "portfolio", "products", "projects", "make", "делаешь", "проекты"],
      answer: "I build small products and automations that remove friction from a workflow. Typical work includes browser tools, AI-agent utilities, API integrations and process automation.",
      project: null
    },
    {
      id: "tube",
      keywords: ["tubescore", "browser", "chrome", "youtube", "movie", "rating", "extension", "расширение"],
      answer: "TubeScore is a Chrome extension that puts movie ratings directly on YouTube trailers. I worked on the product logic, MV3 extension architecture, data retrieval, caching, SPA navigation and automated browser verification.",
      project: "tube"
    },
    {
      id: "feed",
      keywords: ["feedpulse", "rss", "atom", "feed", "content", "agent", "agents", "агент"],
      answer: "FeedPulse is a lightweight ingestion utility for agents. It reads RSS/Atom sources, normalizes the material and returns predictable structured content, with a small Node.js dependency footprint and cross-platform use.",
      project: "feed"
    },
    {
      id: "automation",
      keywords: ["automation", "automate", "process", "workflow", "n8n", "webhook", "api", "manual", "автоматизация", "процесс"],
      answer: "My automation approach starts with the process, not the tool: identify repeated decisions and handoffs, define inputs and success criteria, connect APIs or tools, then add validation so the workflow is observable and repeatable.",
      project: "automation"
    },
    {
      id: "ai",
      keywords: ["ai", "llm", "agent", "agents", "model", "нейросеть", "ии"],
      answer: "I use LLMs mainly as components inside products and workflows: reasoning, classification, content processing and tool orchestration. I care more about the surrounding system — inputs, tools, checks and failure handling — than about a chat box by itself.",
      project: "automation"
    },
    {
      id: "opensource",
      keywords: ["open source", "opensource", "github", "pull request", "pr", "existing code", "codebase", "опенсорс"],
      answer: "I also work inside existing codebases: trace current behavior, isolate the change, modify the smallest useful surface, test regressions and prepare a clean pull request instead of rebuilding everything from scratch.",
      project: "oss"
    },
    {
      id: "background",
      keywords: ["background", "experience", "who are you", "about", "manager", "career", "опыт", "кто ты"],
      answer: "My background is in project and process management. That shapes how I build: I start from the user problem, workflow and constraint, then choose the smallest technical solution that can be tested quickly.",
      project: null
    },
    {
      id: "stack",
      keywords: ["stack", "technology", "technologies", "javascript", "node", "sql", "api", "tools", "стек", "технологии"],
      answer: "The recurring stack is JavaScript / Node.js, browser APIs, REST APIs and webhooks, SQL, automation tools, LLM tooling and GitHub. I deliberately avoid making the stack the center of the portfolio — the product outcome comes first.",
      project: null
    },
    {
      id: "testing",
      keywords: ["test", "testing", "quality", "verify", "validation", "qa", "тест", "качество"],
      answer: "Verification is part of the build, not a final checkbox. Depending on the project that means browser smoke tests, deterministic checks, regression tests, logging or explicit success criteria for an automated workflow.",
      project: "tube"
    },
    {
      id: "product",
      keywords: ["product", "product thinking", "mvp", "prototype", "problem", "user", "продукт", "mvp"],
      answer: "I prefer a product-builder loop: understand the problem, cut scope hard, build the smallest useful version, put it in front of reality, then keep or kill the hypothesis based on evidence.",
      project: null
    }
  ];

  const synonymGroups = [
    ["build","make","create","develop"],
    ["automation","automate","workflow","process"],
    ["ai","llm","model","agent","agents"],
    ["browser","chrome","extension"],
    ["test","testing","verify","validation","qa"]
  ];

  function norm(value) {
    return value.toLowerCase().replace(/[^a-zа-яё0-9\s-]/gi, " ").replace(/\s+/g, " ").trim();
  }

  function expandedTokens(value) {
    const base = new Set(norm(value).split(" ").filter(Boolean));
    synonymGroups.forEach((group) => {
      if (group.some((word) => base.has(word))) group.forEach((word) => base.add(word));
    });
    return base;
  }

  function scoreEntry(query, entry) {
    const q = norm(query);
    const tokens = expandedTokens(query);
    let score = 0;
    entry.keywords.forEach((keyword) => {
      const k = norm(keyword);
      if (q.includes(k)) score += k.includes(" ") ? 5 : 3;
      k.split(" ").forEach((token) => {
        if (tokens.has(token)) score += 1;
      });
    });
    return score;
  }

  function chooseAnswer(query) {
    const ranked = knowledge
      .map((entry) => ({ entry, score: scoreEntry(query, entry) }))
      .sort((a, b) => b.score - a.score);
    if (!ranked[0] || ranked[0].score < 2) {
      return {
        answer: "I don't have a good local answer for that yet. Try asking about AI, automation, browser work, FeedPulse, TubeScore, testing, product thinking or my background.",
        project: null
      };
    }
    return ranked[0].entry;
  }

  function appendMessage(role, text, projectId) {
    if (!chatLog) return;
    const row = document.createElement("div");
    row.className = `chat-message chat-message--${role}`;
    const roleEl = document.createElement("span");
    roleEl.className = "chat-role";
    roleEl.textContent = role === "user" ? "you" : "portfolio";
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble";
    bubble.textContent = text;
    if (projectId) {
      const link = document.createElement("button");
      link.type = "button";
      link.className = "chat-project-link";
      link.textContent = "Show related project ↓";
      link.addEventListener("click", () => {
        activateProject(projectId, true);
        document.getElementById("work")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      });
      bubble.appendChild(document.createElement("br"));
      bubble.appendChild(link);
    }
    row.append(roleEl, bubble);
    chatLog.appendChild(row);
    chatLog.scrollTo({ top: chatLog.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }

  function askPortfolio(query) {
    const text = String(query || "").trim();
    if (!text) return;
    appendMessage("user", text);
    const result = chooseAnswer(text);
    window.setTimeout(() => {
      appendMessage("bot", result.answer, result.project);
      if (result.project) activateProject(result.project, true);
    }, reduced ? 0 : 140);
  }

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    askPortfolio(input?.value);
    if (input) input.value = "";
  });

  suggestions.forEach((button) => button.addEventListener("click", () => askPortfolio(button.dataset.suggestion)));
  previewQuery?.addEventListener("click", () => {
    askPortfolio(projectMeta[activeProject].query);
    document.getElementById("query")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  });

  document.addEventListener("keydown", (event) => {
    const tag = document.activeElement?.tagName?.toLowerCase();
    const editing = tag === "input" || tag === "textarea" || document.activeElement?.isContentEditable;
    if (event.key === "/" && !editing && input) {
      event.preventDefault();
      input.focus();
    }
  });

  // Capability field: small pseudo-3D wave map, entirely local.
  const canvas = document.querySelector("[data-field-canvas]");
  const fieldButtons = [...document.querySelectorAll("[data-field-query]")];

  fieldButtons.forEach((button) => button.addEventListener("click", () => {
    askPortfolio(`Show me ${button.dataset.fieldQuery} work`);
    document.getElementById("query")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }));

  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const capabilities = [
    { label:"AI", x:-.62, y:-.5, query:"Show me AI work" },
    { label:"Agents", x:-.12, y:-.68, query:"Tell me about agents" },
    { label:"APIs", x:.56, y:-.48, query:"Tell me about API work" },
    { label:"Automation", x:-.58, y:.16, query:"How do you automate processes?" },
    { label:"Product", x:.06, y:.04, query:"Tell me about product thinking" },
    { label:"Data", x:.62, y:.22, query:"What data tools do you use?" },
    { label:"QA", x:-.18, y:.58, query:"How do you test your work?" },
    { label:"Open source", x:.48, y:.66, query:"Tell me about open source work" }
  ];

  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width = 1, height = 1;
  let rotX = -.78, rotZ = -.18;
  let targetRotX = rotX, targetRotZ = rotZ;
  let pointer = { x:0, y:0, nx:0, ny:0, inside:false, down:false, lastX:0, lastY:0 };
  let hoverNode = -1;
  let nodeScreens = [];
  let time = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  function colors() {
    const s = getComputedStyle(html);
    return {
      text:s.getPropertyValue("--text").trim(),
      muted:s.getPropertyValue("--muted").trim(),
      line:s.getPropertyValue("--line-strong").trim(),
      accent:s.getPropertyValue("--accent").trim(),
      surface:s.getPropertyValue("--surface").trim()
    };
  }

  function heightAt(x,y) {
    const base = .13 * Math.sin(x*4.1 + time*.8) * Math.cos(y*3.4 - time*.55);
    if (!pointer.inside) return base;
    const dx = x - pointer.nx;
    const dy = y - pointer.ny;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const ripple = Math.sin(dist*10 - time*3.3) * Math.exp(-dist*3.1) * .18;
    return base + ripple;
  }

  function project(x,y,z) {
    // rotate around X
    let yy = y*Math.cos(rotX) - z*Math.sin(rotX);
    let zz = y*Math.sin(rotX) + z*Math.cos(rotX);
    // rotate around Z
    let xx = x*Math.cos(rotZ) - yy*Math.sin(rotZ);
    const y2 = x*Math.sin(rotZ) + yy*Math.cos(rotZ);
    const perspective = 1/(1.55 - zz*.32);
    const scale = Math.min(width,height) * .72;
    return {
      x:width/2 + xx*scale*perspective,
      y:height/2 + y2*scale*.78*perspective,
      z:zz,
      scale:perspective
    };
  }

  function draw() {
    const c = colors();
    ctx.clearRect(0,0,width,height);
    rotX += (targetRotX - rotX) * .07;
    rotZ += (targetRotZ - rotZ) * .07;
    if (!pointer.down && !reduced) targetRotZ += .0012;
    time += reduced ? 0 : .016;

    const n = 18;
    ctx.lineWidth = 1;
    for (let axis=0; axis<2; axis++) {
      for (let i=0; i<n; i++) {
        ctx.beginPath();
        for (let j=0; j<n; j++) {
          const a = -1 + (2*i)/(n-1);
          const b = -1 + (2*j)/(n-1);
          const x = axis===0 ? a : b;
          const y = axis===0 ? b : a;
          const p = project(x,y,heightAt(x,y));
          if (j===0) ctx.moveTo(p.x,p.y); else ctx.lineTo(p.x,p.y);
        }
        ctx.strokeStyle = c.line;
        ctx.globalAlpha = .42;
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;

    nodeScreens = capabilities.map((cap,index) => {
      const p = project(cap.x,cap.y,heightAt(cap.x,cap.y)+.03);
      const active = index === hoverNode;
      ctx.beginPath();
      ctx.arc(p.x,p.y,active?5.5:3.5,0,Math.PI*2);
      ctx.fillStyle = active ? c.accent : c.text;
      ctx.fill();
      ctx.font = `${active ? 600 : 500} 10px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.fillStyle = active ? c.accent : c.muted;
      ctx.fillText(cap.label,p.x+9,p.y+3);
      return { x:p.x,y:p.y,cap,index };
    });

    requestAnimationFrame(draw);
  }

  function updatePointer(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.nx = Math.max(-1,Math.min(1,(pointer.x/rect.width)*2-1));
    pointer.ny = Math.max(-1,Math.min(1,(pointer.y/rect.height)*2-1));
    let best=-1, dist=28;
    nodeScreens.forEach((node,index) => {
      const d=Math.hypot(pointer.x-node.x,pointer.y-node.y);
      if(d<dist){dist=d;best=index;}
    });
    hoverNode=best;
    canvas.style.cursor = best>=0 ? "pointer" : (pointer.down ? "grabbing" : "grab");
  }

  canvas.addEventListener("pointerenter",(event)=>{pointer.inside=true;updatePointer(event);});
  canvas.addEventListener("pointerleave",()=>{pointer.inside=false;pointer.down=false;hoverNode=-1;});
  canvas.addEventListener("pointermove",(event)=>{
    updatePointer(event);
    if(pointer.down){
      const dx=event.clientX-pointer.lastX;
      const dy=event.clientY-pointer.lastY;
      targetRotZ += dx*.006;
      targetRotX = Math.max(-1.15,Math.min(-.25,targetRotX+dy*.004));
      pointer.lastX=event.clientX;pointer.lastY=event.clientY;
    }
  });
  canvas.addEventListener("pointerdown",(event)=>{
    pointer.down=true;pointer.lastX=event.clientX;pointer.lastY=event.clientY;
    canvas.setPointerCapture?.(event.pointerId);
  });
  canvas.addEventListener("pointerup",(event)=>{
    const clicked = hoverNode;
    pointer.down=false;
    if(canvas.hasPointerCapture?.(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    if(clicked>=0){
      askPortfolio(capabilities[clicked].query);
      document.getElementById("query")?.scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"});
    }
  });

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();
  draw();
})();