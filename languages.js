// 多语言支持
const translations = {
  en: {
    title: "SPM TARGET TRACKER",
    name: "NAME: IVY YAW",
    saveAll: "Save All",
    resetAll: "Reset All",
    generateReport: "Generate Report",
    pdf: "Save as PDF",
    print: "Print Report",
    language: "EN/中文",
    theme: "Theme",
    target1: "Target 1",
    target2: "Target 2",
    trial: "Trial",
    spm: "Final SPM",
    t1Title: "Target 1 — Enter Your First Scores",
    t2Title: "Target 2 — Compare with Target 1 and Enter Second Scores",
    trialTitle: "Trial — Compare with Target 2 and Enter Trial Scores",
    spmTitle: "Final SPM — Compare with Trial and Enter Final SPM Scores",
    no: "No",
    subject: "Subject",
    current: "Current",
    target: "Target",
    yourScore: "Your Score",
    result: "Result",
    grade: "Grade",
    target1Score: "Target 1",
    currentTarget: "Current Target",
    resultCompare: "Result / Compare",
    target2Score: "Target 2",
    trialScore: "Trial",
    chartT1: "Target 1 Performance Chart",
    chartT2: "Target 2 Performance Chart",
    chartTrial: "Trial Performance Chart",
    chartSPM: "Final SPM Performance Chart",
    totalScore: "Total Score",
    targetsAchieved: "Targets Achieved",
    averageScore: "Average Score",
    gradeScale: "SPM Grade Scale",
    scoreRange: "Score Range",
    gradeHeader: "Grade",
    rewardSystem: "Form 5 First Exam Reward System",
    bonusRewards: "Bonus Rewards",
    bonus1: "All subjects pass: RM30",
    bonus2: "All subjects pass with improvement: RM50",
    bonus3: "Directly achieve Target 2: RM15 per subject",
    bonus4: "Decreased scores: Consolation reward only",
    totalRewardTitle: "Total Reward Calculation",
    dictationBonus: "Dictation 100% bonus: +0.5% per perfect dictation<br>Example: Total reward RM300 + 10 perfect dictations (5%) = RM315",
    dictationLabel: "Number of perfect dictations:",
    calculate: "Calculate",
    copyright: "SPM Target Tracker © 2026",
    signature: "BY: KH@ONLY GIVE TO IVY YAW ZI XUAN",
    reportOptions: "Select Report Type",
    reportT1: "Target 1 Report",
    reportT2: "Target 2 Report",
    reportTrial: "Trial Report",
    reportSPM: "Final SPM Report",
    reportFull: "Full Progress Report",
    reportGenerated: "Report Generated Successfully!",
    submitT1: "Submit All Target 1 Scores",
    submitT2: "Submit All Target 2 Scores",
    submitTrial: "Submit All Trial Scores",
    submitSPM: "Submit All Final SPM Scores",
    submittedSuccess: "All scores submitted successfully!"
  },
  zh: {
    title: "SPM目标追踪器",
    name: "姓名: 姚子萱",
    saveAll: "保存所有",
    resetAll: "重置所有",
    generateReport: "生成报告",
    pdf: "保存为PDF",
    print: "打印报告",
    language: "中/EN",
    theme: "主题",
    target1: "目标1",
    target2: "目标2",
    trial: "模拟考",
    spm: "最终SPM",
    t1Title: "目标1 — 输入您的首次分数",
    t2Title: "目标2 — 与目标1比较并输入第二次分数",
    trialTitle: "模拟考 — 与目标2比较并输入模拟考分数",
    spmTitle: "最终SPM — 与模拟考比较并输入最终SPM分数",
    no: "编号",
    subject: "科目",
    current: "当前",
    target: "目标",
    yourScore: "您的分数",
    result: "结果",
    grade: "等级",
    target1Score: "目标1",
    currentTarget: "当前目标",
    resultCompare: "结果 / 比较",
    target2Score: "目标2",
    trialScore: "模拟考",
    chartT1: "目标1表现图表",
    chartT2: "目标2表现图表",
    chartTrial: "模拟考表现图表",
    chartSPM: "最终SPM表现图表",
    totalScore: "总分",
    targetsAchieved: "达标科目",
    averageScore: "平均分",
    gradeScale: "SPM等级标准",
    scoreRange: "分数范围",
    gradeHeader: "等级",
    rewardSystem: "中五首次考试奖励制度",
    bonusRewards: "额外奖励",
    bonus1: "全部科目及格: RM30",
    bonus2: "全部科目及格且有进步: RM50",
    bonus3: "直接达到目标2: 每科目RM15",
    bonus4: "分数下降: 仅安慰奖励",
    totalRewardTitle: "总奖励计算",
    dictationBonus: "听写100%奖励: 每个完美听写+0.5%<br>示例: 总奖励RM300 + 10个完美听写(5%) = RM315",
    dictationLabel: "完美听写次数:",
    calculate: "计算",
    copyright: "SPM目标追踪器 © 2026",
    signature: "作者: KH@仅限姚子萱使用",
    reportOptions: "选择报告类型",
    reportT1: "目标1报告",
    reportT2: "目标2报告",
    reportTrial: "模拟考报告",
    reportSPM: "最终SPM报告",
    reportFull: "完整进度报告",
    reportGenerated: "报告生成成功!",
    submitT1: "提交所有目标1分数",
    submitT2: "提交所有目标2分数",
    submitTrial: "提交所有模拟考分数",
    submitSPM: "提交所有最终SPM分数",
    submittedSuccess: "所有分数已成功提交!"
  }
};

// 主题切换
const themes = ['default', 'light-blue', 'dark'];
let currentLang = localStorage.getItem('spm_lang') || 'en';
let currentTheme = localStorage.getItem('spm_theme') || 'default';

// 语言切换
function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'zh' : 'en';
  localStorage.setItem('spm_lang', currentLang);
  applyLanguage();
}

function applyLanguage() {
  const t = translations[currentLang];
  
  // 更新标题和按钮
  document.getElementById('main-title').textContent = t.title;
  document.getElementById('student-name').textContent = t.name;
  document.getElementById('save-text').textContent = t.saveAll;
  document.getElementById('reset-text').textContent = t.resetAll;
  document.getElementById('report-text').textContent = t.generateReport;
  document.getElementById('pdf-text').textContent = t.pdf;
  document.getElementById('print-text').textContent = t.print;
  document.getElementById('language-text').textContent = t.language;
  document.getElementById('theme-text').textContent = t.theme;
  
  // 更新标签页
  document.getElementById('tab-t1').textContent = t.target1;
  document.getElementById('tab-t2').textContent = t.target2;
  document.getElementById('tab-trial').textContent = t.trial;
  document.getElementById('tab-spm').textContent = t.spm;
  
  // 更新标题
  document.getElementById('t1-title').textContent = t.t1Title;
  document.getElementById('t2-title').textContent = t.t2Title;
  document.getElementById('trial-title').textContent = t.trialTitle;
  document.getElementById('spm-title').textContent = t.spmTitle;
  
  // 更新表头
  const headers = [
    ['header-no', 'no'], ['header-subject', 'subject'], ['header-current', 'current'],
    ['header-target', 'target'], ['header-yourscore', 'yourScore'], ['header-result', 'result'], ['header-grade', 'grade'],
    ['header-no2', 'no'], ['header-subject2', 'subject'], ['header-target1', 'target1Score'],
    ['header-current-target', 'currentTarget'], ['header-yourscore2', 'yourScore'], ['header-result-compare', 'resultCompare'],
    ['header-grade2', 'grade'], ['header-no3', 'no'], ['header-subject3', 'subject'], ['header-target2', 'target2Score'],
    ['header-current-target2', 'currentTarget'], ['header-yourscore3', 'yourScore'], ['header-result-compare2', 'resultCompare'],
    ['header-grade3', 'grade'], ['header-no4', 'no'], ['header-subject4', 'subject'], ['header-trial', 'trialScore'],
    ['header-current-target3', 'currentTarget'], ['header-yourscore4', 'yourScore'], ['header-result-compare3', 'resultCompare'],
    ['header-grade4', 'grade']
  ];
  
  headers.forEach(([id, key]) => {
    if (document.getElementById(id)) {
      document.getElementById(id).textContent = t[key];
    }
  });
  
  // 更新图表标题
  document.getElementById('chart-t1-title').textContent = t.chartT1;
  document.getElementById('chart-t2-title').textContent = t.chartT2;
  document.getElementById('chart-trial-title').textContent = t.chartTrial;
  document.getElementById('chart-spm-title').textContent = t.chartSPM;
  
  // 更新等级表
  document.getElementById('grade-scale-title').textContent = t.gradeScale;
  document.getElementById('score-range').textContent = t.scoreRange;
  document.getElementById('grade-header').textContent = t.gradeHeader;
  
  // 更新奖励部分
  document.getElementById('reward-system-title').textContent = t.rewardSystem;
  document.getElementById('bonus-rewards-title').textContent = t.bonusRewards;
  document.getElementById('bonus1').textContent = t.bonus1;
  document.getElementById('bonus2').textContent = t.bonus2;
  document.getElementById('bonus3').textContent = t.bonus3;
  document.getElementById('bonus4').textContent = t.bonus4;
  document.getElementById('total-reward-title').textContent = t.totalRewardTitle;
  document.getElementById('dictation-bonus-text').innerHTML = t.dictationBonus;
  document.getElementById('dictation-label').textContent = t.dictationLabel;
  document.getElementById('calculate-btn').textContent = t.calculate;
  
  // 更新页脚
  document.getElementById('copyright').textContent = t.copyright;
  document.getElementById('signature-text').textContent = t.signature;
  
  // 更新提交按钮文本
  document.getElementById('submit-t1-text').textContent = t.submitT1;
  document.getElementById('submit-t2-text').textContent = t.submitT2;
  document.getElementById('submit-trial-text').textContent = t.submitTrial;
  document.getElementById('submit-spm-text').textContent = t.submitSPM;
}

// 主题切换
function toggleTheme() {
  const currentIndex = themes.indexOf(currentTheme);
  const nextIndex = (currentIndex + 1) % themes.length;
  currentTheme = themes[nextIndex];
  localStorage.setItem('spm_theme', currentTheme);
  applyTheme();
}

function applyTheme() {
  document.body.className = '';
  if (currentTheme !== 'default') {
    document.body.classList.add(`theme-${currentTheme}`);
  }
}
