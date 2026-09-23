(() => {
  const root = document.documentElement;
  if (root.dataset.portfolioReady) return;
  root.dataset.portfolioReady = "1";

  // Editorial: expandable project rows + contextual visual preview.
  const editorialRows = [...document.querySelectorAll("[data-editorial-project]")];
  const previewEmpty = document.querySelector("[data-preview-empty]");
  const previews = [...document.querySelectorAll("[data-preview-panel]")];

  function activateEditorial(row, open = true) {
    const key = row.dataset.editorialProject;
    editorialRows.forEach((item) => {
      const active = item === row && open;
      item.setAttribute("aria-expanded", String(active));
    });
    previews.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.previewPanel === key && open);
    });
    if (previewEmpty) previewEmpty.style.opacity = open ? "0" : "1";
  }

  editorialRows.forEach((row) => {
    row.addEventListener("click", () => {
      const isOpen = row.getAttribute("aria-expanded") === "true";
      activateEditorial(row, !isOpen);
    });

    if (window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
      row.addEventListener("mouseenter", () => activateEditorial(row, true));
    }
  });

  // Playful: one small object follows selected work.
  const orbit = document.querySelector("[data-orbit]");
  const playRows = [...document.querySelectorAll("[data-play-project]")];
  const playZone = document.querySelector("[data-play-zone]");

  function selectPlayRow(row) {
    playRows.forEach((item) => item.classList.toggle("is-selected", item === row));
    if (!orbit || !playZone) return;
    const zoneRect = playZone.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    const targetY = rowRect.top - zoneRect.top + rowRect.height / 2 - orbit.offsetHeight / 2;
    const targetX = Math.max(0, Math.min(zoneRect.clientWidth - orbit.offsetWidth, zoneRect.clientWidth * 0.76));
    orbit.classList.add("is-awake");
    orbit.style.transform = `translate(${targetX - (zoneRect.clientWidth - orbit.offsetWidth)}px, ${targetY - zoneRect.clientHeight * 0.06}px)`;
  }

  playRows.forEach((row) => {
    row.addEventListener("click", () => {
      const selected = row.classList.contains("is-selected");
      playRows.forEach((item) => item.classList.remove("is-selected"));
      if (!selected) selectPlayRow(row);
    });
    if (window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
      row.addEventListener("mouseenter", () => selectPlayRow(row));
    }
  });

  // A small physical toy. Decorative, but fully interactive by click and drag.
  const toyBox = document.querySelector("[data-toy-box]");
  const toyDot = document.querySelector("[data-toy-dot]");

  if (toyBox && toyDot) {
    let dragging = false;

    const moveToy = (clientX, clientY) => {
      const rect = toyBox.getBoundingClientRect();
      const size = toyDot.offsetWidth;
      const x = Math.max(0, Math.min(rect.width - size, clientX - rect.left - size / 2));
      const y = Math.max(0, Math.min(rect.height - size, clientY - rect.top - size / 2));
      toyDot.style.left = `${x}px`;
      toyDot.style.top = `${y}px`;
    };

    toyBox.addEventListener("click", (event) => {
      if (event.target === toyDot) return;
      moveToy(event.clientX, event.clientY);
    });

    toyDot.addEventListener("pointerdown", (event) => {
      dragging = true;
      toyDot.setPointerCapture?.(event.pointerId);
    });

    toyDot.addEventListener("pointermove", (event) => {
      if (dragging) moveToy(event.clientX, event.clientY);
    });

    const stopDragging = (event) => {
      dragging = false;
      if (toyDot.hasPointerCapture?.(event.pointerId)) toyDot.releasePointerCapture(event.pointerId);
    };

    toyDot.addEventListener("pointerup", stopDragging);
    toyDot.addEventListener("pointercancel", stopDragging);
  }

  // Command: tiny local search over portfolio content.
  const search = document.querySelector("[data-command-input]");
  const commandItems = [...document.querySelectorAll("[data-command-item]")];
  const status = document.querySelector("[data-command-status]");
  const clear = document.querySelector("[data-command-clear]");
  const chips = [...document.querySelectorAll("[data-command-query]")];

  function runCommandSearch(value) {
    if (!search || !status) return;
    const raw = String(value || "").trim();
    const q = raw.toLowerCase();
    const tokens = q.split(/\s+/).filter(Boolean);
    let matches = 0;

    commandItems.forEach((item) => {
      const haystack = `${item.dataset.keywords || ""} ${item.textContent || ""}`.toLowerCase();
      const visible = tokens.length === 0 || tokens.every((token) => haystack.includes(token));
      item.classList.toggle("is-hidden", !visible);
      if (visible) matches += 1;
    });

    if (!raw) {
      status.textContent = "ready / showing all work";
    } else if (matches === 0) {
      status.textContent = `0 matches for “${raw}” — try: AI, browser, automation, open source`;
    } else {
      status.textContent = `${matches} match${matches === 1 ? "" : "es"} for “${raw}”`;
    }
  }

  if (search) {
    search.addEventListener("input", () => runCommandSearch(search.value));
    document.addEventListener("keydown", (event) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      const editing = tag === "input" || tag === "textarea" || document.activeElement?.isContentEditable;
      if (event.key === "/" && !editing) {
        event.preventDefault();
        search.focus();
      }
      if (event.key === "Escape" && document.activeElement === search) {
        search.value = "";
        runCommandSearch("");
        search.blur();
      }
    });
  }

  clear?.addEventListener("click", () => {
    search.value = "";
    runCommandSearch("");
    search.focus();
  });

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      search.value = chip.dataset.commandQuery || "";
      runCommandSearch(search.value);
      search.focus();
    });
  });
})();