// Target 1 页面构建
function buildT1() {
  const list = document.getElementById("list-t1");
  if (!list) return;
  
  list.innerHTML = "";
  subjects.forEach((s, idx) => {
    const id = s.id;
    const key = makeKey("t1", id);
    const stored = load(key, "");
    const grade = stored !== "" ? getGrade(stored) : "";
    const gradeClass = getGradeClass(grade);
    
    const row = document.createElement("div");
    row.className = "grid row-item";
    row.innerHTML = `
      <div class="cell">${idx+1}</div>
      <div class="cell"><div class="subject-name"><span class="${s.cls}">${s.name}</span></div></div>
      <div class="cell badge-current">${s.current}</div>
      <div class="cell">${s.t1}</div>
      <div class="cell"><input type="number" id="input_t1_${id}" min="0" max="100" placeholder="Score" value="${stored !== "" ? stored : ""}"></div>
      <div class="cell" id="res_t1_${id}"></div>
      <div class="cell" id="grade_t1_${id}">
        ${grade ? `<span class="grade-badge ${gradeClass}">${grade}</span>` : ""}
      </div>
    `;
    list.appendChild(row);

    const inp = row.querySelector(`#input_t1_${id}`);
    const res = row.querySelector(`#res_t1_${id}`);
    const gradeCell = row.querySelector(`#grade_t1_${id}`);
    
    // 处理输入确认（按Enter键）
    function handleInput(event) {
      if (event.key === 'Enter') {
        const v = inp.value.trim();
        if(v===""){ 
          res.innerHTML=""; 
          gradeCell.innerHTML="";
          save(key,""); 
          buildT2PrevDisplay(); 
          renderStats("t1", "stats-t1");
          calculateReward();
          return; 
        }
        
        save(key, Number(v));
        
        if(pass(v, s.t1)) {
          res.innerHTML = `<span class="result"><span class="ok">✓</span></span>`;
        } else {
          res.innerHTML = `<span class="result"><span class="no">✗</span></span>`;
        }
        
        // 触发特效
        checkScoreEffects(id, v, s.current, s.t1, s.t2, inp, "t1");
        
        const newGrade = getGrade(v);
        const newGradeClass = getGradeClass(newGrade);
        gradeCell.innerHTML = newGrade ? `<span class="grade-badge ${newGradeClass}">${newGrade}</span>` : "";
        
        buildT2PrevDisplay();
        renderStats("t1", "stats-t1");
        calculateReward();
        // 修复：重新构建Trial页面
        buildTrial();
      }
    }
    
    inp.addEventListener("keypress", handleInput);
    
    // 初始化显示
    if (stored !== "") {
      if(pass(stored, s.t1)) {
        res.innerHTML = `<span class="result"><span class="ok">✓</span></span>`;
      } else {
        res.innerHTML = `<span class="result"><span class="no">✗</span></span>`;
      }
    }
  });
  
  renderStats("t1", "stats-t1");
}

// Target 2 页面构建
function buildT2() {
  const list = document.getElementById("list-t2");
  if (!list) return;
  
  list.innerHTML = "";
  subjects.forEach((s, idx) => {
    const id = s.id;
    const keyPrev = makeKey("t1", id);
    const key = makeKey("t2", id);
    const prev = load(keyPrev, "");
    const stored = load(key, "");
    const grade = stored !== "" ? getGrade(stored) : "";
    const gradeClass = getGradeClass(grade);
    const prevGrade = prev !== "" ? getGrade(prev) : "";
    const prevGradeClass = getGradeClass(prevGrade);
    
    const row = document.createElement("div");
    row.className = "grid row-item";
    row.innerHTML = `
      <div class="cell">${idx+1}</div>
      <div class="cell"><div class="subject-name"><span class="${s.cls}">${s.name}</span></div></div>
      <div class="cell">
        ${prev === "" ? '<span class="muted small">—</span>' : `<div><strong>${prev}</strong><br><span class="grade-badge ${prevGradeClass}" style="font-size:11px;">${prevGrade}</span></div>`}
      </div>
      <div class="cell">${s.t2}</div>
      <div class="cell"><input type="number" id="input_t2_${id}" min="0" max="100" placeholder="Score" value="${stored !== "" ? stored : ""}"></div>
      <div class="cell" id="res_t2_${id}"></div>
      <div class="cell" id="grade_t2_${id}">
        ${grade ? `<span class="grade-badge ${gradeClass}">${grade}</span>` : ""}
      </div>
    `;
    list.appendChild(row);

    const inp = row.querySelector(`#input_t2_${id}`);
    const res = row.querySelector(`#res_t2_${id}`);
    const gradeCell = row.querySelector(`#grade_t2_${id}`);
    
    // 处理输入确认（按Enter键）
    function handleInput(event) {
      if (event.key === 'Enter') {
        const v = inp.value.trim();
        if(v===""){ 
          res.innerHTML=""; 
          gradeCell.innerHTML="";
          save(key,""); 
          renderStats("t2", "stats-t2");
          calculateReward();
          return; 
        }
        
        save(key, Number(v));
        
        let out = "";
        if(pass(v, s.t2)) {
          out += `<span class="result"><span class="ok">✓</span></span>`;
        } else {
          out += `<span class="result"><span class="no">✗</span></span>`;
        }

        if(prev !== ""){
          const pv = Number(prev);
          const nv = Number(v);
          if(nv > pv) out += `<div class="compare"><span class="up">▲ ${currentLang === 'en' ? 'Improved' : '进步'}</span></div>`;
          else if(nv < pv) out += `<div class="compare"><span class="down">▼ ${currentLang === 'en' ? 'Decreased' : '退步'}</span></div>`;
          else out += `<div class="compare"><span class="same">— ${currentLang === 'en' ? 'Same' : '相同'}</span></div>`;
        } else {
          out += `<div class="muted small">${currentLang === 'en' ? 'No previous record' : '无之前记录'}</div>`;
        }

        res.innerHTML = out;
        
        // 触发特效（在Target 2页面，将Target 1作为current比较）
        const prevScore = prev !== "" ? Number(prev) : s.current;
        checkScoreEffects(id, v, prevScore, s.t2, s.trial, inp, "t2");
        
        const newGrade = getGrade(v);
        const newGradeClass = getGradeClass(newGrade);
        gradeCell.innerHTML = newGrade ? `<span class="grade-badge ${newGradeClass}">${newGrade}</span>` : "";
        
        renderStats("t2", "stats-t2");
        calculateReward();
        // 修复：强制重新构建Trial页面
        buildTrial();
      }
    }
    
    inp.addEventListener("keypress", handleInput);
    
    // 初始化显示
    if (stored !== "") {
      let out = "";
      if(pass(stored, s.t2)) {
        out += `<span class="result"><span class="ok">✓</span></span>`;
      } else {
        out += `<span class="result"><span class="no">✗</span></span>`;
      }

      if(prev !== ""){
        const pv = Number(prev);
        const nv = Number(stored);
        if(nv > pv) out += `<div class="compare"><span class="up">▲ ${currentLang === 'en' ? 'Improved' : '进步'}</span></div>`;
        else if(nv < pv) out += `<div class="compare"><span class="down">▼ ${currentLang === 'en' ? 'Decreased' : '退步'}</span></div>`;
        else out += `<div class="compare"><span class="same">— ${currentLang === 'en' ? 'Same' : '相同'}</span></div>`;
      } else {
        out += `<div class="muted small">${currentLang === 'en' ? 'No previous record' : '无之前记录'}</div>`;
      }

      res.innerHTML = out;
    }
  });
  
  renderStats("t2", "stats-t2");
}

// Trial 页面构建
function buildTrial() {
  const list = document.getElementById("list-trial");
  if (!list) return;
  
  list.innerHTML = "";
  subjects.forEach((s, idx) => {
    const id = s.id;
    // 修复：确保正确读取Target 2分数
    const keyPrev = makeKey("t2", id);
    const prevScore = load(keyPrev, "");
    
    const key = makeKey("trial", id);
    const stored = load(key, "");
    const grade = stored !== "" ? getGrade(stored) : "";
    const gradeClass = getGradeClass(grade);
    const prevGrade = prevScore !== "" ? getGrade(prevScore) : "";
    const prevGradeClass = getGradeClass(prevGrade);
    
    const row = document.createElement("div");
    row.className = "grid row-item";
    
    // 修复：正确显示Target 2分数
    const prevDisplay = prevScore !== "" ? 
      `<div><strong>${prevScore}</strong><br><span class="grade-badge ${prevGradeClass}" style="font-size:11px;">${prevGrade}</span></div>` :
      `<span class="muted small">—</span>`;
    
    row.innerHTML = `
      <div class="cell">${idx+1}</div>
      <div class="cell"><div class="subject-name"><span class="${s.cls}">${s.name}</span></div></div>
      <div class="cell">
        ${prevDisplay}
      </div>
      <div class="cell">${s.trial}</div>
      <div class="cell"><input type="number" id="input_trial_${id}" min="0" max="100" placeholder="Score" value="${stored !== "" ? stored : ""}"></div>
      <div class="cell" id="res_trial_${id}"></div>
      <div class="cell" id="grade_trial_${id}">
        ${grade ? `<span class="grade-badge ${gradeClass}">${grade}</span>` : ""}
      </div>
    `;
    list.appendChild(row);

    const inp = row.querySelector(`#input_trial_${id}`);
    const res = row.querySelector(`#res_trial_${id}`);
    const gradeCell = row.querySelector(`#grade_trial_${id}`);
    
    // 修复：初始化时也显示比较结果
    function updateTrialDisplay() {
      const v = inp.value.trim();
      let out = "";
      
      if (v !== "") {
        if(pass(v, s.trial)) {
          out += `<span class="result"><span class="ok">✓</span></span>`;
        } else {
          out += `<span class="result"><span class="no">✗</span></span>`;
        }

        if(prevScore !== ""){
          const pv = Number(prevScore);
          const nv = Number(v);
          if(nv > pv) out += `<div class="compare"><span class="up">▲ ${currentLang === 'en' ? 'Improved' : '进步'}</span></div>`;
          else if(nv < pv) out += `<div class="compare"><span class="down">▼ ${currentLang === 'en' ? 'Decreased' : '退步'}</span></div>`;
          else out += `<div class="compare"><span class="same">— ${currentLang === 'en' ? 'Same' : '相同'}</span></div>`;
        } else {
          out += `<div class="muted small">${currentLang === 'en' ? 'No previous record' : '无之前记录'}</div>`;
        }
      }
      
      res.innerHTML = out;
    }
    
    // 处理输入确认（按Enter键）
    function handleInput(event) {
      if (event.key === 'Enter') {
        const v = inp.value.trim();
        if(v===""){ 
          res.innerHTML=""; 
          gradeCell.innerHTML="";
          save(key,""); 
          renderStats("trial", "stats-trial");
          calculateReward();
          return; 
        }
        
        save(key, Number(v));
        
        updateTrialDisplay();
        
        // 触发特效
        const prevScoreNum = prevScore !== "" ? Number(prevScore) : s.current;
        checkScoreEffects(id, v, prevScoreNum, s.trial, s.spm, inp, "trial");
        
        const newGrade = getGrade(v);
        const newGradeClass = getGradeClass(newGrade);
        gradeCell.innerHTML = newGrade ? `<span class="grade-badge ${newGradeClass}">${newGrade}</span>` : "";
        
        renderStats("trial", "stats-trial");
        calculateReward();
      }
    }
    
    inp.addEventListener("keypress", handleInput);
    // 初始化显示
    updateTrialDisplay();
  });
  
  renderStats("trial", "stats-trial");
}

// Final SPM 页面构建
function buildSPM() {
  const list = document.getElementById("list-spm");
  if (!list) return;
  
  list.innerHTML = "";
  subjects.forEach((s, idx) => {
    const id = s.id;
    const keyPrev = makeKey("trial", id);
    const key = makeKey("spm", id);
    const prev = load(keyPrev, "");
    const stored = load(key, "");
    const grade = stored !== "" ? getGrade(stored) : "";
    const gradeClass = getGradeClass(grade);
    const prevGrade = prev !== "" ? getGrade(prev) : "";
    const prevGradeClass = getGradeClass(prevGrade);
    
    const row = document.createElement("div");
    row.className = "grid row-item";
    row.innerHTML = `
      <div class="cell">${idx+1}</div>
      <div class="cell"><div class="subject-name"><span class="${s.cls}">${s.name}</span></div></div>
      <div class="cell">
        ${prev === "" ? '<span class="muted small">—</span>' : `<div><strong>${prev}</strong><br><span class="grade-badge ${prevGradeClass}" style="font-size:11px;">${prevGrade}</span></div>`}
      </div>
      <div class="cell">${s.spm}</div>
      <div class="cell"><input type="number" id="input_spm_${id}" min="0" max="100" placeholder="Score" value="${stored !== "" ? stored : ""}"></div>
      <div class="cell" id="res_spm_${id}"></div>
      <div class="cell" id="grade_spm_${id}">
        ${grade ? `<span class="grade-badge ${gradeClass}">${grade}</span>` : ""}
      </div>
    `;
    list.appendChild(row);

    const inp = row.querySelector(`#input_spm_${id}`);
    const res = row.querySelector(`#res_spm_${id}`);
    const gradeCell = row.querySelector(`#grade_spm_${id}`);
    
    // 处理输入确认（按Enter键）
    function handleInput(event) {
      if (event.key === 'Enter') {
        const v = inp.value.trim();
        if(v===""){ 
          res.innerHTML=""; 
          gradeCell.innerHTML="";
          save(key,""); 
          renderStats("spm", "stats-spm");
          calculateReward();
          return; 
        }
        
        save(key, Number(v));
        
        let out = "";
        if(pass(v, s.spm)) {
          out += `<span class="result"><span class="ok">✓</span></span>`;
        } else {
          out += `<span class="result"><span class="no">✗</span></span>`;
        }

        if(prev !== ""){
          const pv = Number(prev);
          const nv = Number(v);
          if(nv > pv) out += `<div class="compare"><span class="up">▲ ${currentLang === 'en' ? 'Improved' : '进步'}</span></div>`;
          else if(nv < pv) out += `<div class="compare"><span class="down">▼ ${currentLang === 'en' ? 'Decreased' : '退步'}</span></div>`;
          else out += `<div class="compare"><span class="same">— ${currentLang === 'en' ? 'Same' : '相同'}</span></div>`;
        } else {
          out += `<div class="muted small">${currentLang === 'en' ? 'No previous record' : '无之前记录'}</div>`;
        }

        res.innerHTML = out;
        
        // 触发特效
        const prevScore = prev !== "" ? Number(prev) : s.current;
        checkScoreEffects(id, v, prevScore, s.spm, s.spm, inp, "spm");
        
        const newGrade = getGrade(v);
        const newGradeClass = getGradeClass(newGrade);
        gradeCell.innerHTML = newGrade ? `<span class="grade-badge ${newGradeClass}">${newGrade}</span>` : "";
        
        renderStats("spm", "stats-spm");
        calculateReward();
      }
    }
    
    inp.addEventListener("keypress", handleInput);
    
    // 初始化显示
    if (stored !== "") {
      let out = "";
      if(pass(stored, s.spm)) {
        out += `<span class="result"><span class="ok">✓</span></span>`;
      } else {
        out += `<span class="result"><span class="no">✗</span></span>`;
      }

      if(prev !== ""){
        const pv = Number(prev);
        const nv = Number(stored);
        if(nv > pv) out += `<div class="compare"><span class="up">▲ ${currentLang === 'en' ? 'Improved' : '进步'}</span></div>`;
        else if(nv < pv) out += `<div class="compare"><span class="down">▼ ${currentLang === 'en' ? 'Decreased' : '退步'}</span></div>`;
        else out += `<div class="compare"><span class="same">— ${currentLang === 'en' ? 'Same' : '相同'}</span></div>`;
      } else {
        out += `<div class="muted small">${currentLang === 'en' ? 'No previous record' : '无之前记录'}</div>`;
      }

      res.innerHTML = out;
    }
  });
  
  renderStats("spm", "stats-spm");
}

// Target 2 页面显示Target 1数据
function buildT2PrevDisplay() {
  buildT2();
}
