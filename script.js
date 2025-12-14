// 主初始化函数
function initAll() {
  applyLanguage();
  applyTheme();
  buildT1();
  buildT2();
  buildTrial();
  buildSPM();
  calculateReward();
  
  // 绑定标签页切换事件
  document.querySelectorAll(".tab").forEach(t => {
    t.addEventListener("click", (e) => {
      document.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
      t.classList.add("active");
      const tab = t.getAttribute("data-tab");
      
      document.querySelectorAll("#page-t1, #page-t2, #page-trial, #page-spm").forEach(p => p.style.display = "none");
      
      if (tab === "t1") document.getElementById("page-t1").style.display = "block";
      if (tab === "t2") document.getElementById("page-t2").style.display = "block";
      if (tab === "trial") document.getElementById("page-trial").style.display = "block";
      if (tab === "spm") document.getElementById("page-spm").style.display = "block";
    });
  });
}

// 统计数据渲染
function renderStats(round, containerId) {
  const stats = calculateStats(round);
  const container = document.getElementById(containerId);
  const t = translations[currentLang];
  
  if (!container) return;
  
  let html = `
    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-label">${t.totalScore}</div>
        <div class="stat-value">${stats.totalScore}</div>
        <div class="stat-subtitle">${t.target}: ${stats.totalTarget}</div>
      </div>
      
      <div class="stat-item">
        <div class="stat-label">${t.targetsAchieved}</div>
        <div class="stat-value">${stats.achievedCount}/${stats.totalSubjects}</div>
        <div class="stat-subtitle">${t.subject}</div>
      </div>
      
      <div class="stat-item">
        <div class="stat-label">${t.averageScore}</div>
        <div class="stat-value">${stats.averageScore}</div>
        <div class="stat-subtitle">Entered Subjects</div>
      </div>
    </div>
  `;
  
  html += `
    <div class="grade-counts">
      <div class="stat-label" style="text-align:center; margin-bottom:15px; font-size:14px;">Grade Distribution</div>
      <div class="grade-container">
  `;
  
  const allGrades = ["A+", "A", "A-", "B+", "B", "C+", "C", "D", "E", "F"];
  allGrades.forEach(grade => {
    const count = stats.gradeCounts[grade] || 0;
    const gradeClass = getGradeClass(grade);
    html += `
      <div class="grade-item">
        <div class="grade-count ${gradeClass}" style="font-size: ${grade === "A+" || grade === "A-" ? "20px" : "22px"};">${count}</div>
        <div class="grade-name">${grade}</div>
      </div>
    `;
  });
  
  html += `
      </div>
    </div>
  `;
  
  container.innerHTML = html;
  
  setTimeout(() => {
    createChart(round, `chart-${round}`);
    calculateReward();
  }, 100);
}

// 提交所有分数
function submitAllScores(round) {
  let submittedCount = 0;
  let totalEffects = 0;
  
  subjects.forEach(s => {
    const id = s.id;
    const input = document.getElementById(`input_${round}_${id}`);
    if (input) {
      const v = input.value.trim();
      if (v !== "") {
        const key = makeKey(round, id);
        // 修复：确保保存的是数字
        const numValue = Number(v);
        save(key, numValue);
        
        // 处理Target 1的显示
        if (round === "t1") {
          const res = document.getElementById(`res_t1_${id}`);
          const gradeCell = document.getElementById(`grade_t1_${id}`);
          
          if (pass(v, s.t1)) {
            res.innerHTML = `<span class="result"><span class="ok">✓</span></span>`;
          } else {
            res.innerHTML = `<span class="result"><span class="no">✗</span></span>`;
          }
          
          const newGrade = getGrade(v);
          const newGradeClass = getGradeClass(newGrade);
          gradeCell.innerHTML = newGrade ? `<span class="grade-badge ${newGradeClass}">${newGrade}</span>` : "";
          
          // 触发特效
          checkScoreEffects(id, v, s.current, s.t1, s.t2, input, round);
          totalEffects++;
        }
        
        // 处理Target 2的显示
        if (round === "t2") {
          const res = document.getElementById(`res_t2_${id}`);
          const gradeCell = document.getElementById(`grade_t2_${id}`);
          const keyPrev = makeKey("t1", id);
          const prev = load(keyPrev, "");
          
          let out = "";
          if (pass(v, s.t2)) {
            out += `<span class="result"><span class="ok">✓</span></span>`;
          } else {
            out += `<span class="result"><span class="no">✗</span></span>`;
          }

          if (prev !== "") {
            const pv = Number(prev);
            const nv = Number(v);
            if (nv > pv) out += `<div class="compare"><span class="up">▲ ${currentLang === 'en' ? 'Improved' : '进步'}</span></div>`;
            else if (nv < pv) out += `<div class="compare"><span class="down">▼ ${currentLang === 'en' ? 'Decreased' : '退步'}</span></div>`;
            else out += `<div class="compare"><span class="same">— ${currentLang === 'en' ? 'Same' : '相同'}</span></div>`;
          } else {
            out += `<div class="muted small">${currentLang === 'en' ? 'No previous record' : '无之前记录'}</div>`;
          }

          res.innerHTML = out;
          
          const newGrade = getGrade(v);
          const newGradeClass = getGradeClass(newGrade);
          gradeCell.innerHTML = newGrade ? `<span class="grade-badge ${newGradeClass}">${newGrade}</span>` : "";
          
          // 触发特效
          const prevScore = prev !== "" ? Number(prev) : s.current;
          checkScoreEffects(id, v, prevScore, s.t2, s.trial, input, round);
          totalEffects++;
          
          // 修复：强制重新构建Trial页面以显示Target 2分数
          buildTrial();
        }
        
        // 处理Trial的显示
        if (round === "trial") {
          const res = document.getElementById(`res_trial_${id}`);
          const gradeCell = document.getElementById(`grade_trial_${id}`);
          const keyPrev = makeKey("t2", id);
          const prev = load(keyPrev, "");
          
          let out = "";
          if (pass(v, s.trial)) {
            out += `<span class="result"><span class="ok">✓</span></span>`;
          } else {
            out += `<span class="result"><span class="no">✗</span></span>`;
          }

          if (prev !== "") {
            const pv = Number(prev);
            const nv = Number(v);
            if (nv > pv) out += `<div class="compare"><span class="up">▲ ${currentLang === 'en' ? 'Improved' : '进步'}</span></div>`;
            else if (nv < pv) out += `<div class="compare"><span class="down">▼ ${currentLang === 'en' ? 'Decreased' : '退步'}</span></div>`;
            else out += `<div class="compare"><span class="same">— ${currentLang === 'en' ? 'Same' : '相同'}</span></div>`;
          } else {
            out += `<div class="muted small">${currentLang === 'en' ? 'No previous record' : '无之前记录'}</div>`;
          }

          res.innerHTML = out;
          
          const newGrade = getGrade(v);
          const newGradeClass = getGradeClass(newGrade);
          gradeCell.innerHTML = newGrade ? `<span class="grade-badge ${newGradeClass}">${newGrade}</span>` : "";
          
          // 触发特效
          const prevScore = prev !== "" ? Number(prev) : s.current;
          checkScoreEffects(id, v, prevScore, s.trial, s.spm, input, round);
          totalEffects++;
        }
        
        // 处理SPM的显示
        if (round === "spm") {
          const res = document.getElementById(`res_spm_${id}`);
          const gradeCell = document.getElementById(`grade_spm_${id}`);
          const keyPrev = makeKey("trial", id);
          const prev = load(keyPrev, "");
          
          let out = "";
          if (pass(v, s.spm)) {
            out += `<span class="result"><span class="ok">✓</span></span>`;
          } else {
            out += `<span class="result"><span class="no">✗</span></span>`;
          }

          if (prev !== "") {
            const pv = Number(prev);
            const nv = Number(v);
            if (nv > pv) out += `<div class="compare"><span class="up">▲ ${currentLang === 'en' ? 'Improved' : '进步'}</span></div>`;
            else if (nv < pv) out += `<div class="compare"><span class="down">▼ ${currentLang === 'en' ? 'Decreased' : '退步'}</span></div>`;
            else out += `<div class="compare"><span class="same">— ${currentLang === 'en' ? 'Same' : '相同'}</span></div>`;
          } else {
            out += `<div class="muted small">${currentLang === 'en' ? 'No previous record' : '无之前记录'}</div>`;
          }

          res.innerHTML = out;
          
          const newGrade = getGrade(v);
          const newGradeClass = getGradeClass(newGrade);
          gradeCell.innerHTML = newGrade ? `<span class="grade-badge ${newGradeClass}">${newGrade}</span>` : "";
          
          // 触发特效
          const prevScore = prev !== "" ? Number(prev) : s.current;
          checkScoreEffects(id, v, prevScore, s.spm, s.spm, input, round);
          totalEffects++;
        }
        
        submittedCount++;
      }
    }
  });
  
  // 更新统计数据
  if (round === "t1") {
    buildT2PrevDisplay();
    renderStats("t1", "stats-t1");
    // 强制重新构建Trial页面
    buildTrial();
  } else if (round === "t2") {
    renderStats("t2", "stats-t2");
    // 强制重新构建Trial页面以显示Target 2分数
    buildTrial();
  } else if (round === "trial") {
    renderStats("trial", "stats-trial");
    buildSPM();
  } else if (round === "spm") {
    renderStats("spm", "stats-spm");
  }
  
  // 更新奖励
  calculateReward();
  
  // 显示成功消息
  const t = translations[currentLang];
  if (submittedCount > 0) {
    alert(`✅ ${t.submittedSuccess}\nSubmitted ${submittedCount} scores.${totalEffects > 0 ? ` Triggered ${totalEffects} effects.` : ''}`);
  } else {
    alert("⚠ No scores to submit. Please enter some scores first.");
  }
}

// 保存所有数据
function saveAllData() {
  const rounds = ['t1', 't2', 'trial', 'spm'];
  let savedCount = 0;
  
  rounds.forEach(round => {
    subjects.forEach(s => {
      const key = makeKey(round, s.id);
      const input = document.getElementById(`input_${round}_${s.id}`);
      if (input && input.value.trim() !== "") {
        save(key, Number(input.value));
        savedCount++;
      }
    });
  });
  
  alert(`✅ ${savedCount} scores saved!`);
  calculateReward();
  // 修复：重新构建所有页面以确保数据同步
  buildT1();
  buildT2();
  buildTrial();
  buildSPM();
}

// 重置所有数据
function resetAllData() {
  if (confirm("Reset ALL data? This cannot be undone.")) {
    const rounds = ['t1', 't2', 'trial', 'spm'];
    
    rounds.forEach(round => {
      subjects.forEach(s => {
        const key = makeKey(round, s.id);
        localStorage.removeItem(key);
        const input = document.getElementById(`input_${round}_${s.id}`);
        if (input) {
          input.value = "";
        }
      });
    });
    
    document.getElementById('dictation-count').value = 0;
    initAll();
    calculateReward();
    alert("All data reset!");
  }
}

// 生成网页报告
function generateReport() {
  const t = translations[currentLang];
  
  // 计算总奖励
  const dictationCount = parseInt(document.getElementById('dictation-count').value) || 0;
  let totalReward = 0;
  subjects.forEach(s => {
    const t1Score = load(makeKey("t1", s.id), "");
    totalReward += calculateSubjectReward(s.id, t1Score, s.t1, s.t2, s.current);
  });
  
  // 整体奖励
  let allPassed = true;
  let allImproved = true;
  subjects.forEach(s => {
    const t1Score = load(makeKey("t1", s.id), "");
    if (t1Score && Number(t1Score) < 40) allPassed = false;
    if (t1Score && Number(t1Score) <= s.current) allImproved = false;
  });
  
  if (allPassed) {
    totalReward += 30;
    if (allImproved) {
      totalReward += 50;
    }
  }
  
  const bonusMultiplier = 1 + (dictationCount * 0.005);
  const finalReward = totalReward * bonusMultiplier;
  
  // 创建报告HTML
  let reportHTML = `
    <div style="background: white; padding: 30px; border-radius: 12px; max-width: 1000px; margin: 20px auto; box-shadow: 0 8px 25px rgba(0,0,0,0.1);">
      <h1 style="color: #7c3aed; text-align: center; margin-bottom: 10px;">SPM TARGET TRACKER REPORT</h1>
      <h3 style="color: #a855f7; text-align: center; margin-bottom: 20px;">Student: IVY YAW ZI XUAN</h3>
      <p style="color: #666; text-align: center; margin-bottom: 30px;">Report Generated: ${new Date().toLocaleDateString()}</p>
      
      <div style="border-bottom: 2px solid #f472b6; margin-bottom: 30px;"></div>
      
      <h2 style="color: #ec4899; margin-bottom: 20px;">TARGET 1 SCORES AND REWARDS</h2>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <thead>
          <tr style="background: linear-gradient(135deg, #fce7f3, #ffffff);">
            <th style="padding: 12px; text-align: center; border: 1px solid #fbcfe8;">No.</th>
            <th style="padding: 12px; text-align: left; border: 1px solid #fbcfe8;">Subject</th>
            <th style="padding: 12px; text-align: center; border: 1px solid #fbcfe8;">Current</th>
            <th style="padding: 12px; text-align: center; border: 1px solid #fbcfe8;">Target</th>
            <th style="padding: 12px; text-align: center; border: 1px solid #fbcfe8;">Score</th>
            <th style="padding: 12px; text-align: center; border: 1px solid #fbcfe8;">Achieves</th>
            <th style="padding: 12px; text-align: center; border: 1px solid #fbcfe8;">Reward</th>
          </tr>
        </thead>
        <tbody>
  `;
  
  // 添加科目数据
  subjects.forEach((s, index) => {
    const t1Score = load(makeKey("t1", s.id), "");
    const scoreNum = t1Score ? Number(t1Score) : 0;
    const reward = calculateSubjectReward(s.id, t1Score, s.t1, s.t2, s.current);
    
    let achievesText = "-";
    let achievesColor = "#666";
    if (t1Score !== "" && !isNaN(scoreNum)) {
      if (scoreNum >= s.t2) {
        achievesText = "Target 2 ✓";
        achievesColor = "#10b981";
      } else if (scoreNum >= s.t1) {
        achievesText = "Target 1 ✓";
        achievesColor = "#10b981";
      } else if (scoreNum >= 40) {
        achievesText = "Pass";
        achievesColor = "#3b82f6";
      } else {
        achievesText = "Fail";
        achievesColor = "#ef4444";
      }
    }
    
    reportHTML += `
      <tr style="${index % 2 === 0 ? 'background-color: #fdf2f8;' : ''}">
        <td style="padding: 10px; border: 1px solid #fbcfe8; text-align: center;">${index + 1}</td>
        <td style="padding: 10px; border: 1px solid #fbcfe8; font-weight: 600; color: ${s.cls === 'c-bm' ? '#e11d48' : s.cls === 'c-sej' ? '#be123c' : s.cls === 'c-mt' ? '#be185d' : s.cls === 'c-sains' ? '#db2777' : s.cls === 'c-moral' ? '#f472b6' : s.cls === 'c-eng' ? '#ec4899' : s.cls === 'c-cn' ? '#f472b6' : '#a855f7'}">${s.name}</td>
        <td style="padding: 10px; border: 1px solid #fbcfe8; text-align: center;">${s.current}</td>
        <td style="padding: 10px; border: 1px solid #fbcfe8; text-align: center;">${s.t1}</td>
        <td style="padding: 10px; border: 1px solid #fbcfe8; text-align: center; font-weight: ${t1Score ? 'bold' : 'normal'}">${t1Score || "-"}</td>
        <td style="padding: 10px; border: 1px solid #fbcfe8; text-align: center; color: ${achievesColor}; font-weight: 600;">${achievesText}</td>
        <td style="padding: 10px; border: 1px solid #fbcfe8; text-align: center; font-weight: 600; color: #059669;">RM${reward}</td>
      </tr>
    `;
  });
  
  reportHTML += `
        </tbody>
      </table>
      
      <div style="background: linear-gradient(135deg, #f0fdf4, #dcfce7); padding: 25px; border-radius: 12px; border: 2px solid #86efac; margin-bottom: 30px;">
        <h3 style="color: #166534; margin-bottom: 15px; text-align: center;">TOTAL REWARD CALCULATION</h3>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <div>
            <div style="color: #666; font-size: 14px; margin-bottom: 5px;">Base Reward</div>
            <div style="font-size: 18px; font-weight: 600; color: #059669;">RM${totalReward.toFixed(2)}</div>
          </div>
  `;
  
  if (dictationCount > 0) {
    reportHTML += `
          <div>
            <div style="color: #666; font-size: 14px; margin-bottom: 5px;">Perfect Dictations</div>
            <div style="font-size: 18px; font-weight: 600; color: #7c3aed;">${dictationCount} (+${(dictationCount * 0.5).toFixed(1)}%)</div>
          </div>
    `;
  }
  
  reportHTML += `
        </div>
        
        <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 2px dashed #86efac;">
          <div style="color: #666; font-size: 16px; margin-bottom: 10px;">TOTAL REWARD</div>
          <div style="font-size: 48px; font-weight: 800; color: #ec4899; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);">RM${finalReward.toFixed(2)}</div>
        </div>
      </div>
      
      <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
        <h4 style="color: #475569; margin-bottom: 10px;">Reward Calculation Formula</h4>
        <ul style="color: #64748b; margin: 0; padding-left: 20px;">
          <li>RM2 per point improvement (RM1 for Mathematics)</li>
          <li>RM20 bonus if achieve Target 1 (RM40 for Mathematics)</li>
          <li>RM15 bonus if directly achieve Target 2</li>
          <li>+0.5% per perfect dictation</li>
          <li>All subjects pass: RM30 bonus</li>
          <li>All subjects pass with improvement: RM50 bonus</li>
        </ul>
      </div>
      
      <div style="text-align: center; color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
        <div>Generated by SPM Target Tracker © 2026</div>
        <div style="margin-top: 5px;">BY: KH@ONLY GIVE TO IVY YAW ZI XUAN</div>
      </div>
    </div>
  `;
  
  // 在新窗口中显示报告
  const reportWindow = window.open('', '_blank');
  reportWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>SPM Target Tracker Report</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body {
          font-family: 'Poppins', Arial, Helvetica, sans-serif;
          margin: 0;
          padding: 20px;
          background: linear-gradient(135deg, #fdf2f8 0%, #fff5f7 50%, #fce7f3 100%);
          color: #7c3aed;
        }
      </style>
    </head>
    <body>
      ${reportHTML}
      <div style="text-align: center; margin-top: 20px;">
        <button onclick="window.print()" style="padding: 10px 20px; background: linear-gradient(135deg, #f472b6, #ec4899); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">Print Report</button>
      </div>
    </body>
    </html>
  `);
  reportWindow.document.close();
  
  alert(t.reportGenerated);
}

// 打印报告
function printReport() {
  const currentTab = document.querySelector('.tab.active').getAttribute('data-tab');
  
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  document.querySelectorAll('#page-t1, #page-t2, #page-trial, #page-spm').forEach(page => {
    page.style.display = 'block';
  });
  
  document.querySelector('.action-buttons').style.display = 'none';
  
  window.print();
  
  setTimeout(() => {
    document.querySelector('.action-buttons').style.display = 'flex';
    
    document.querySelectorAll('#page-t1, #page-t2, #page-trial, #page-spm').forEach(page => {
      page.style.display = 'none';
    });
    
    document.querySelector(`.tab[data-tab="${currentTab}"]`).classList.add('active');
    document.getElementById(`page-${currentTab}`).style.display = 'block';
  }, 100);
}

// 页面构建函数 (buildT1, buildT2, buildTrial, buildSPM) 由于字符限制，需要额外文件
// 但这些函数依赖于 subjects.js 中的基础数据

// 页面加载时初始化
window.addEventListener('load', function() {
  initAll();
});

// 全局导出
window.SPM = {
  subjects, save, load, initAll, getGrade, calculateStats,
  saveAllData, resetAllData, saveAsPDF, printReport, generateReport,
  toggleLanguage, toggleTheme, submitAllScores, calculateSubjectReward
};
