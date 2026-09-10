(() => {
  "use strict";

  const CHUNK_SIZE = 50;

  const personalProfile =
    window.HANDWRITING_PROFILE || null;

  const groups = [
    {
      c: "hebrew",
      s: [
        ..."אבגדהוזחטיכלמנסעפצקרשת",
        ..."ךםןףץ"
      ]
    },
    {
      c: "latinUpper",
      s: [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"]
    },
    {
      c: "latinLower",
      s: [..."abcdefghijklmnopqrstuvwxyz"]
    },
    {
      c: "digits",
      s: [..."0123456789"]
    },
    {
      c: "greekLower",
      s: [
        "α","β","γ","δ","ε","ζ","η","θ","ι","κ","λ","μ",
        "ν","ξ","ο","π","ρ","σ","τ","υ","φ","χ","ψ","ω"
      ]
    },
    {
      c: "greekUpper",
      s: ["Γ","Δ","Θ","Λ","Ξ","Π","Σ","Φ","Ψ","Ω"]
    },
    {
      c: "arithmetic",
      s: ["+","−","×","÷","=","≠","≈","<",">","≤","≥","±"]
    },
    {
      c: "analysis",
      s: ["√","∫","∑","∞","∂","∇","lim"]
    },
    {
      c: "logic",
      s: ["∈","∉","⊂","⊆","∪","∩","∅","∀","∃","⇒","⇔"]
    },
    {
      c: "geometry",
      s: ["→","←","↔","∠","⊥","∥","△","○"]
    },
    {
      c: "punctuation",
      s: ["(",")","[","]","{","}","|",",",".",":",";"]
    }
  ];

  function selectedProfileSet() {
    if (!personalProfile?.categorySelectorId) {
      return null;
    }

    return document.getElementById(
      personalProfile.categorySelectorId
    )?.value || null;
  }

  function activeGroups() {
    const selectedSet = selectedProfileSet();
    const categories = selectedSet
      ? personalProfile?.categorySets?.[selectedSet]
      : personalProfile?.categories;

    return categories?.length
      ? groups.filter(group =>
          categories.includes(group.c)
        )
      : groups;
  }

  const tr = {
    ru: {
      wTitle: "Спасибо за помощь",
      wText: "Пишите столько символов, сколько сможете. Ограничения нет.",
      anon: "Имена, телефоны, почта и оценки не собираются.",
      device: "Лучше писать стилусом. Можно пальцем.",
      voluntary: "Участие добровольное. Можно закончить в любой момент.",
      consentText: "Я согласен анонимно передать образцы для исследования распознавания рукописной математики.",
      repLabel: "Повторений каждого символа",
      start: "Начать",
      instruction: "Напишите символ",
      undo: "Отменить штрих",
      clear: "Очистить",
      skip: "Пропустить",
      save: "Сохранить и дальше",
      finish: "Завершить и отправить",
      reviewTitle: "Образцы готовы",
      continue: "Продолжить писать",
      submit: "Отправить данные",
      thanksTitle: "Спасибо!",
      thanksText: "Данные успешно отправлены.",
      empty: "Сначала напишите символ",
      count: "Сохранено",
      rep: "Повтор",
      ready: n => `Подготовлено образцов: ${n}. Можно продолжить или отправить.`,
      noCloud: "База ещё не настроена. При завершении скачается резервный JSON-файл.",
      sending: "Отправка",
      error: "Не удалось отправить. Резервный JSON-файл скачан.",
      receipt: "Код подтверждения",
      input: {
        pen: "Ввод: стилус",
        touch: "Ввод: палец",
        mouse: "Ввод: мышь",
        unknown: "Тип ввода пока не определён"
      }
    },

    he: {
      wTitle: "תודה על העזרה",
      wText: "כתבו כמה שיותר סמלים. אין הגבלה.",
      anon: "לא נאספים שמות, טלפונים, דוא״ל או ציונים.",
      device: "מומלץ לכתוב בעט דיגיטלי. אפשר גם באצבע.",
      voluntary: "ההשתתפות מרצון ואפשר לסיים בכל עת.",
      consentText: "אני מסכים/ה להעביר באופן אנונימי דוגמאות למחקר בזיהוי מתמטיקה בכתב יד.",
      repLabel: "מספר חזרות לכל סימן",
      start: "התחלה",
      instruction: "כתבו את הסימן",
      undo: "ביטול קו",
      clear: "ניקוי",
      skip: "דילוג",
      save: "שמירה והמשך",
      finish: "סיום ושליחה",
      reviewTitle: "הדוגמאות מוכנות",
      continue: "להמשיך לכתוב",
      submit: "שליחת הנתונים",
      thanksTitle: "תודה!",
      thanksText: "הנתונים נשלחו בהצלחה.",
      empty: "יש לכתוב תחילה",
      count: "נשמרו",
      rep: "חזרה",
      ready: n => `הוכנו ${n} דוגמאות. אפשר להמשיך או לשלוח.`,
      noCloud: "מסד הנתונים עדיין לא הוגדר. בסיום יורד קובץ JSON.",
      sending: "שולח",
      error: "השליחה נכשלה. קובץ גיבוי הורד.",
      receipt: "קוד אישור",
      input: {
        pen: "קלט: עט",
        touch: "קלט: אצבע",
        mouse: "קלט: עכבר",
        unknown: "סוג הקלט עדיין לא זוהה"
      }
    },

    en: {
      wTitle: "Thank you for helping",
      wText: "Write as many symbols as you can. There is no limit.",
      anon: "Names, phone numbers, email addresses, and grades are not collected.",
      device: "A stylus is preferred. A finger can also be used.",
      voluntary: "Participation is voluntary. You may finish at any time.",
      consentText: "I agree to anonymously contribute samples to handwritten mathematics recognition research.",
      repLabel: "Repetitions per symbol",
      start: "Begin",
      instruction: "Write this symbol",
      undo: "Undo stroke",
      clear: "Clear",
      skip: "Skip",
      save: "Save and continue",
      finish: "Finish and submit",
      reviewTitle: "Samples are ready",
      continue: "Continue writing",
      submit: "Submit data",
      thanksTitle: "Thank you!",
      thanksText: "The data was submitted successfully.",
      empty: "Write the symbol first",
      count: "Saved",
      rep: "Repetition",
      ready: n => `${n} samples are ready. You may continue or submit.`,
      noCloud: "The database is not configured. A backup JSON file will be downloaded.",
      sending: "Sending",
      error: "Submission failed. A backup JSON file was downloaded.",
      receipt: "Confirmation code",
      input: {
        pen: "Input: stylus",
        touch: "Input: finger",
        mouse: "Input: mouse",
        unknown: "Input type not detected"
      }
    }
  };

  const $ = id => document.getElementById(id);

  const ui = {
    lang: $("lang"),
    welcome: $("welcome"),
    work: $("work"),
    review: $("review"),
    thanks: $("thanks"),
    consent: $("consent"),
    start: $("start"),
    reps: $("reps"),
    hint: $("cloudHint"),
    code: $("code"),
    count: $("count"),
    time: $("time"),
    instruction: $("instruction"),
    target: $("target"),
    repeat: $("repeat"),
    canvas: $("canvas"),
    empty: $("empty"),
    undo: $("undo"),
    clear: $("clear"),
    skip: $("skip"),
    save: $("save"),
    finish: $("finish"),
    input: $("inputType"),
    reviewTitle: $("reviewTitle"),
    summary: $("summary"),
    cont: $("continue"),
    submit: $("submit"),
    status: $("status"),
    thanksTitle: $("thanksTitle"),
    thanksText: $("thanksText"),
    receipt: $("receipt")
  };

  let lang =
    localStorage.getItem("hwlang") ||
    (
      navigator.language.startsWith("he")
        ? "he"
        : navigator.language.startsWith("ru")
          ? "ru"
          : "en"
    );

  let session = null;
  let strokes = [];
  let active = null;
  let drawing = false;
  let inputType = "unknown";
  let timer = null;

  const progressStorageKey = personalProfile?.id
    ? `handwriting-progress:${personalProfile.id}`
    : null;

  function progressItemKey(category, symbol) {
    return `${category}\u001f${symbol}`;
  }

  function loadSubmittedProgress() {
    if (!progressStorageKey) return {};

    try {
      const raw = localStorage.getItem(progressStorageKey);
      const data = raw ? JSON.parse(raw) : {};

      return data && typeof data === "object"
        ? data
        : {};
    }
    catch (e) {
      console.warn(
        "Could not read handwriting progress",
        e
      );

      return {};
    }
  }

  function commitSubmittedSamples(samples) {
    if (!progressStorageKey || !samples?.length) {
      return;
    }

    const progress = loadSubmittedProgress();

    for (const sample of samples) {
      const key = progressItemKey(
        sample.category,
        sample.label
      );

      progress[key] =
        Number(progress[key] || 0) + 1;
    }

    localStorage.setItem(
      progressStorageKey,
      JSON.stringify(progress)
    );
  }

  function allDoneMessage() {
    if (lang === "he") {
      return "כל האותיות או הסמלים שנבחרו כבר נאספו.";
    }

    if (lang === "ru") {
      return "Все выбранные буквы или символы уже собраны.";
    }

    return "All selected letters or symbols have already been collected.";
  }

  const ctx = ui.canvas.getContext("2d");

  function T() {
    return {
      ...tr[lang],
      ...(personalProfile?.translations?.[lang] || {})
    };
  }

  function show(x) {
    [ui.welcome, ui.work, ui.review, ui.thanks].forEach(e =>
      e.classList.add("hidden")
    );
    x.classList.remove("hidden");
  }

  function apply() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
    ui.lang.value = lang;

    const x = T();

    for (const [id, key] of [
      ["wTitle", "wTitle"],
      ["wText", "wText"],
      ["anon", "anon"],
      ["device", "device"],
      ["voluntary", "voluntary"],
      ["consentText", "consentText"],
      ["repLabel", "repLabel"]
    ]) {
      $(id).textContent = x[key];
    }

    ui.start.textContent = x.start;
    ui.instruction.textContent = x.instruction;
    ui.undo.textContent = x.undo;
    ui.clear.textContent = x.clear;
    ui.skip.textContent = x.skip;
    ui.save.textContent = x.save;
    ui.finish.textContent = x.finish;
    ui.reviewTitle.textContent = x.reviewTitle;
    ui.cont.textContent = x.continue;
    ui.submit.textContent = x.submit;
    ui.thanksTitle.textContent = x.thanksTitle;
    ui.thanksText.textContent = x.thanksText;
    ui.empty.textContent = x.empty;

    hint();
    render();
  }

  function hint() {
    const c = window.HANDWRITING_CONFIG || {};

    const ok =
      c.SUPABASE_URL &&
      !c.SUPABASE_URL.includes("PASTE_") &&
      c.SUPABASE_ANON_KEY &&
      !c.SUPABASE_ANON_KEY.includes("PASTE_");

    ui.hint.textContent = ok ? "" : T().noCloud;
  }

  function id() {
    return crypto.randomUUID
      ? crypto.randomUUID()
      : Date.now() + "-" + Math.random().toString(36).slice(2);
  }

  function code() {
    return (
      "P-" +
      new Date()
        .toISOString()
        .slice(2, 10)
        .replaceAll("-", "") +
      "-" +
      Math.random()
        .toString(36)
        .slice(2, 8)
        .toUpperCase()
    );
  }

  function shuffle(a) {
    a = [...a];

    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }

    return a;
  }

  function queue() {
    const b = {};
    const targetReps = +ui.reps.value;
    const progress = personalProfile
      ? loadSubmittedProgress()
      : {};

    for (const g of activeGroups()) {
      b[g.c] = shuffle(
        g.s
          .map(symbol => {
            const key = progressItemKey(
              g.c,
              symbol
            );

            return {
              symbol,
              category: g.c,
              done: personalProfile
                ? Number(progress[key] || 0)
                : 0
            };
          })
          .filter(item =>
            !personalProfile ||
            item.done < targetReps
          )
      );
    }

    const cats = shuffle(Object.keys(b));
    const q = [];

    let more = true;

    while (more) {
      more = false;

      for (const c of cats) {
        if (b[c].length) {
          q.push(b[c].shift());
          more = true;
        }
      }
    }

    return q;
  }

  function task() {
    if (session.i >= session.q.length) {
      if (personalProfile) {
        return null;
      }

      session.round++;
      session.q = queue();
      session.i = 0;
    }

    return session.q[session.i] || null;
  }

  function start() {
    const initialQueue = queue();

    if (personalProfile && !initialQueue.length) {
      alert(allDoneMessage());
      return;
    }

    session = {
      submissionId: id(),
      participantCode: personalProfile
        ? `${personalProfile.participantPrefix || "PERSONAL"}-${code().slice(2)}`
        : code(),
      startedAt: new Date().toISOString(),
      reps: +ui.reps.value,
      r: personalProfile
        ? Number(initialQueue[0]?.done || 0)
        : 0,
      q: initialQueue,
      i: 0,
      round: 1,
      samples: [],
      skipped: [],
      language: lang,
      profileId: personalProfile?.id || null,
      datasetScope: personalProfile ? "personal" : "general",
      profileSet: selectedProfileSet()
    };

    strokes = [];

    show(ui.work);
    resize();
    render();

    timer = setInterval(renderTime, 1000);
  }

  function renderTime() {
    if (!session) return;

    const s = Math.floor(
      (Date.now() - new Date(session.startedAt)) / 1000
    );

    ui.time.textContent =
      `${String(Math.floor(s / 60)).padStart(2, "0")}:` +
      `${String(s % 60).padStart(2, "0")}`;
  }

  function p(e) {
    const r = ui.canvas.getBoundingClientRect();

    return {
      x: e.clientX - r.left,
      y: e.clientY - r.top,
      pressure: Number.isFinite(e.pressure)
        ? e.pressure
        : 0.5,
      tiltX: e.tiltX || 0,
      tiltY: e.tiltY || 0,
      pointerType: e.pointerType || "unknown",
      time: Date.now()
    };
  }

  function draw(s) {
    if (!s.points.length) return;

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#111827";
    ctx.beginPath();

    ctx.moveTo(
      s.points[0].x,
      s.points[0].y
    );

    for (let i = 1; i < s.points.length; i++) {
      const a = s.points[i];
      const b = s.points[i - 1];

      ctx.lineWidth =
        Math.max(
          2,
          3.5 * (0.8 + (a.pressure || 0.5))
        );

      ctx.quadraticCurveTo(
        b.x,
        b.y,
        (b.x + a.x) / 2,
        (b.y + a.y) / 2
      );
    }

    ctx.stroke();
    ctx.restore();
  }

  function redraw() {
    const r = ui.canvas.getBoundingClientRect();

    ctx.clearRect(
      0,
      0,
      r.width,
      r.height
    );

    strokes.forEach(draw);
  }

  function resize() {
    const r = ui.canvas.getBoundingClientRect();
    const d = devicePixelRatio || 1;

    ui.canvas.width = r.width * d;
    ui.canvas.height = r.height * d;

    ctx.setTransform(
      d,
      0,
      0,
      d,
      0,
      0
    );

    redraw();
  }

  function save() {
    if (!strokes.some(s => s.points.length > 1)) {
      ui.empty.classList.remove("hidden");

      setTimeout(
        () => ui.empty.classList.add("hidden"),
        1000
      );

      return;
    }

    const z = task();

    if (!z) {
      review();
      return;
    }

    session.samples.push({
      id: id(),
      label: z.symbol,
      category: z.category,
      repeatNumber: session.r + 1,
      savedAt: new Date().toISOString(),
      pointerType: inputType,

      canvas: {
        width: ui.canvas.clientWidth,
        height: ui.canvas.clientHeight
      },

      strokes: JSON.parse(
        JSON.stringify(strokes)
      ),

      imagePng: ui.canvas.toDataURL("image/png")
    });

    session.r++;

    if (session.r >= session.reps) {
      session.i++;

      session.r =
        personalProfile &&
        session.i < session.q.length
          ? Number(session.q[session.i].done || 0)
          : 0;
    }

    strokes = [];
    redraw();

    if (
      personalProfile &&
      session.i >= session.q.length
    ) {
      review();
      return;
    }

    render();
  }

  function skip() {
    const z = task();

    if (!z) {
      review();
      return;
    }

    session.skipped.push({
      symbol: z.symbol,
      category: z.category,
      at: new Date().toISOString()
    });

    session.i++;

    session.r =
      personalProfile &&
      session.i < session.q.length
        ? Number(session.q[session.i].done || 0)
        : 0;

    strokes = [];
    redraw();

    if (
      personalProfile &&
      session.i >= session.q.length
    ) {
      review();
      return;
    }

    render();
  }

  function review() {
    if (!session.samples.length) {
      alert(T().empty);
      return;
    }

    clearInterval(timer);

    show(ui.review);

    ui.summary.textContent =
      T().ready(session.samples.length);

    ui.cont.classList.toggle(
      "hidden",
      Boolean(
        personalProfile &&
        session.i >= session.q.length
      )
    );
  }

  function cont() {
    show(ui.work);
    resize();

    timer = setInterval(
      renderTime,
      1000
    );
  }

  function payload() {
    return {
      format: "handwriting-web-unlimited",
      version: 2,

      projectVersion:
        (window.HANDWRITING_CONFIG || {})
          .PROJECT_VERSION,

      submissionId: session.submissionId,
      participantCode: session.participantCode,
      startedAt: session.startedAt,
      completedAt: new Date().toISOString(),
      language: session.language,
      profileId: session.profileId,
      datasetScope: session.datasetScope,
      profileSet: session.profileSet,
      repetitionsPerSymbol: session.reps,
      sampleCount: session.samples.length,
      skipped: session.skipped,
      userAgent: navigator.userAgent,
      samples: session.samples
    };
  }

  function download(d) {
    const b = new Blob(
      [JSON.stringify(d, null, 2)],
      {
        type: "application/json"
      }
    );

    const u = URL.createObjectURL(b);
    const a = document.createElement("a");

    a.href = u;

    a.download =
      `handwriting-${session.participantCode}.json`;

    a.click();

    setTimeout(
      () => URL.revokeObjectURL(u),
      1000
    );
  }

  function makeChunks(samples, size) {
    const chunks = [];

    for (let i = 0; i < samples.length; i += size) {
      chunks.push(
        samples.slice(i, i + size)
      );
    }

    return chunks;
  }

  async function submit() {
    ui.submit.disabled = true;

    const fullData = payload();

    const c =
      window.HANDWRITING_CONFIG || {};

    const ok =
      c.SUPABASE_URL &&
      !c.SUPABASE_URL.includes("PASTE_") &&
      c.SUPABASE_ANON_KEY &&
      !c.SUPABASE_ANON_KEY.includes("PASTE_");

    if (!ok || !window.supabase) {
      download(fullData);
      ui.status.textContent = T().error;
      ui.submit.disabled = false;
      return;
    }

    try {
      const sb =
        window.supabase.createClient(
          c.SUPABASE_URL,
          c.SUPABASE_ANON_KEY
        );

      const chunks =
        makeChunks(
          session.samples,
          CHUNK_SIZE
        );

      const totalChunks =
        chunks.length;

      for (
        let i = 0;
        i < totalChunks;
        i++
      ) {
        ui.status.textContent =
          `${T().sending} ${i + 1}/${totalChunks}…`;

        const chunkSamples =
          chunks[i];

        const chunkPayload = {
          format: "handwriting-web-chunked",
          version: 2,

          projectVersion:
            (window.HANDWRITING_CONFIG || {})
              .PROJECT_VERSION,

          originalSubmissionId:
            session.submissionId,

          participantCode:
            session.participantCode,

          startedAt:
            session.startedAt,

          completedAt:
            fullData.completedAt,

          language:
            session.language,

          profileId:
            session.profileId,

          datasetScope:
            session.datasetScope,

          profileSet:
            session.profileSet,

          repetitionsPerSymbol:
            session.reps,

          totalSampleCount:
            session.samples.length,

          chunkIndex:
            i + 1,

          chunkCount:
            totalChunks,

          chunkSampleCount:
            chunkSamples.length,

          skipped:
            session.skipped,

          userAgent:
            navigator.userAgent,

          samples:
            chunkSamples
        };

        const {
          error
        } = await sb
          .from(c.TABLE_NAME)
          .insert({
            submission_id: id(),

            participant_code:
              session.participantCode,

            started_at:
              session.startedAt,

            completed_at:
              fullData.completedAt,

            language:
              session.language,

            sample_count:
              chunkSamples.length,

            payload:
              chunkPayload
          });

        if (error) {
          throw error;
        }
      }

      if (personalProfile) {
        commitSubmittedSamples(
          session.samples
        );
      }

      show(ui.thanks);

      ui.receipt.textContent =
        T().receipt +
        ": " +
        session.participantCode;
    }

    catch (e) {
      console.error(e);

      download(fullData);

      ui.status.textContent =
        T().error;

      ui.submit.disabled =
        false;
    }
  }

  function render() {
    if (!session) return;

    const z = task();

    if (!z) return;

    ui.code.textContent =
      session.participantCode;

    ui.count.textContent =
      T().count +
      ": " +
      session.samples.length;

    ui.target.textContent =
      z.symbol;

    ui.repeat.textContent =
      T().rep +
      `: ${session.r + 1}/${session.reps}`;

    ui.input.textContent =
      T().input[inputType] ||
      T().input.unknown;

    renderTime();
  }

  ui.lang.onchange = () => {
    lang = ui.lang.value;

    localStorage.setItem(
      "hwlang",
      lang
    );

    apply();
  };

  ui.consent.onchange = () => {
    ui.start.disabled =
      !ui.consent.checked;
  };

  ui.start.onclick =
    start;

  ui.save.onclick =
    save;

  ui.clear.onclick = () => {
    strokes = [];
    redraw();
  };

  ui.undo.onclick = () => {
    strokes.pop();
    redraw();
  };

  ui.skip.onclick =
    skip;

  ui.finish.onclick =
    review;

  ui.cont.onclick =
    cont;

  ui.submit.onclick =
    submit;

  ui.canvas.addEventListener(
    "pointerdown",
    e => {
      e.preventDefault();

      drawing = true;

      inputType =
        e.pointerType ||
        "unknown";

      ui.canvas.setPointerCapture(
        e.pointerId
      );

      active = {
        points: [p(e)]
      };

      render();
    }
  );

  ui.canvas.addEventListener(
    "pointermove",
    e => {
      if (!drawing || !active) {
        return;
      }

      e.preventDefault();

      active.points.push(
        p(e)
      );

      redraw();
      draw(active);
    }
  );

  function end(e) {
    if (!drawing || !active) {
      return;
    }

    e.preventDefault();

    active.points.push(
      p(e)
    );

    strokes.push(
      active
    );

    active = null;
    drawing = false;

    redraw();
  }

  ui.canvas.addEventListener(
    "pointerup",
    end
  );

  ui.canvas.addEventListener(
    "pointercancel",
    end
  );

  window.addEventListener(
    "resize",
    resize
  );

  apply();
})();
