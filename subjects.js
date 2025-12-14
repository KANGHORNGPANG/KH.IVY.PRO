// 科目数据
const subjects = [
  { id: "bm", name: "BAHASA MELAYU", cls: "c-bm", current:43, t1:50, t2:55, trial:65, spm:65 },
  { id: "sej", name: "SEJARAH", cls: "c-sej", current:40, t1:50, t2:60, trial:70, spm:70 },
  { id: "mt",  name: "MATEMATIK", cls: "c-mt", current:19, t1:40, t2:50, trial:60, spm:60 },
  { id: "sains",name: "SAINS", cls: "c-sains", current:43, t1:55, t2:65, trial:70, spm:70 },
  { id: "moral",name: "MORAL", cls: "c-moral", current:41, t1:50, t2:60, trial:70, spm:70 },
  { id: "eng", name: "BAHASA INGGERIS", cls: "c-eng", current:40, t1:45, t2:50, trial:55, spm:55 },
  { id: "cn",  name: "BAHASA CINA", cls: "c-cn", current:47, t1:50, t2:60, trial:65, spm:65 },
  { id: "art", name: "PENDIDIKAN SENI VISUAL", cls: "c-art", current:53, t1:55, t2:60, trial:65, spm:65 },
];

// 图表实例
let charts = {
  t1: null,
  t2: null,
  trial: null,
  spm: null
};

// 实用函数
function getGrade(score) {
  if (score === "" || isNaN(score) || score < 0) return "";
  
  const numScore = Number(score);
  
  if (numScore >= 90) return "A+";
  if (numScore >= 80) return "A";
  if (numScore >= 70) return "A-";
  if (numScore >= 65) return "B+";
  if (numScore >= 60) return "B";
  if (numScore >= 55) return "C+";
  if (numScore >= 50) return "C";
  if (numScore >= 45) return "D";
  if (numScore >= 40) return "E";
  return "F";
}

function getGradeClass(grade) {
  const gradeMap = {
    "A+": "grade-Aplus",
    "A": "grade-A",
    "A-": "grade-Aminus",
    "B+": "grade-Bplus",
    "B": "grade-B",
    "C+": "grade-Cplus",
    "C": "grade-C",
    "D": "grade-D",
    "E": "grade-E",
    "F": "grade-F"
  };
  return gradeMap[grade] || "";
}

// 本地存储函数
function save(key, value){ 
  localStorage.setItem(key, JSON.stringify(value)); 
}

function load(key, fallback=null){
  const v = localStorage.getItem(key);
  if(!v) return fallback;
  try{ 
    const parsed = JSON.parse(v);
    return parsed;
  } catch(e){ 
    console.error(`Error parsing key ${key}:`, e);
    return fallback; 
  }
}

function makeKey(round, id){ 
  return `scores.${round}.${id}`; 
}

function pass(value, threshold){ 
  return value !== "" && !isNaN(value) && Number(value) >= Number(threshold); 
}

// 统计数据计算
function calculateStats(round) {
  let totalScore = 0;
  let totalTarget = 0;
  let achievedCount = 0;
  let subjectCount = 0;
  let gradeCounts = {
    "A+": 0, "A": 0, "A-": 0,
    "B+": 0, "B": 0,
    "C+": 0, "C": 0,
    "D": 0, "E": 0, "F": 0
  };
  
  const scores = [];
  const targets = [];
  const subjectNames = [];
  
  subjects.forEach(s => {
    const key = makeKey(round, s.id);
    const score = load(key, "");
    
    if (score !== "" && !isNaN(score)) {
      const numScore = Number(score);
      totalScore += numScore;
      subjectCount++;
      scores.push(numScore);
      targets.push(s[round] || (round === "t2" ? s.t2 : (round === "trial" ? s.trial : s.spm)));
      subjectNames.push(s.name);
      
      const targetValue = s[round] || (round === "t2" ? s.t2 : (round === "trial" ? s.trial : s.spm));
      if (numScore >= targetValue) {
        achievedCount++;
      }
      
      const grade = getGrade(score);
      if (grade && gradeCounts.hasOwnProperty(grade)) {
        gradeCounts[grade]++;
      }
    }
    
    if (round === "t1") totalTarget += s.t1;
    else if (round === "t2") totalTarget += s.t2;
    else if (round === "trial") totalTarget += s.trial;
    else if (round === "spm") totalTarget += s.spm;
  });
  
  const averageScore = subjectCount > 0 ? (totalScore / subjectCount).toFixed(1) : "0.0";
  
  return {
    totalScore,
    totalTarget,
    achievedCount,
    totalSubjects: subjects.length,
    averageScore,
    gradeCounts,
    scores,
    targets,
    subjectNames
  };
}

// 图表创建
function createChart(round, canvasId) {
  const stats = calculateStats(round);
  const ctx = document.getElementById(canvasId).getContext('2d');
  
  if (charts[round]) {
    charts[round].destroy();
  }
  
  const subjectLabels = subjects.map(s => {
    const shortName = s.name.split(' ')[0];
    return shortName.length > 10 ? shortName.substring(0, 8) + '...' : shortName;
  });
  
  const userScores = subjects.map(s => {
    const key = makeKey(round, s.id);
    const score = load(key, "");
    return score !== "" ? Number(score) : 0;
  });
  
  const targetScores = subjects.map(s => {
    if (round === "t1") return s.t1;
    if (round === "t2") return s.t2;
    if (round === "trial") return s.trial;
    if (round === "spm") return s.spm;
    return 0;
  });
  
  charts[round] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: subjectLabels,
      datasets: [
        {
          label: currentLang === 'en' ? 'Your Score' : '您的分数',
          data: userScores,
          backgroundColor: currentTheme === 'dark' ? 'rgba(156, 163, 175, 0.7)' : 
                         currentTheme === 'light-blue' ? 'rgba(56, 189, 248, 0.7)' : 
                         'rgba(244, 114, 182, 0.7)',
          borderColor: currentTheme === 'dark' ? 'rgba(209, 213, 219, 1)' : 
                      currentTheme === 'light-blue' ? 'rgba(14, 165, 233, 1)' : 
                      'rgba(236, 72, 153, 1)',
          borderWidth: 2
        },
        {
          label: currentLang === 'en' ? 'Target' : '目标',
          data: targetScores,
          backgroundColor: currentTheme === 'dark' ? 'rgba(16, 185, 129, 0.5)' : 
                         'rgba(167, 243, 208, 0.7)',
          borderColor: currentTheme === 'dark' ? 'rgba(52, 211, 153, 1)' : 
                      'rgba(52, 211, 153, 1)',
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: currentLang === 'en' ? 'Score' : '分数'
          }
        },
        x: {
          title: {
            display: true,
            text: currentLang === 'en' ? 'Subjects' : '科目'
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
        }
      }
    }
  });
}
