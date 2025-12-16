// 奖励规则
const rewardRates = {
  bm: { perPoint: 2, targetBonus: 20, target2Bonus: 15 },
  sej: { perPoint: 2, targetBonus: 20, target2Bonus: 15 },
  mt: { perPoint: 1, targetBonus: 40, target2Bonus: 15 },
  sains: { perPoint: 2, targetBonus: 20, target2Bonus: 15 },
  moral: { perPoint: 2, targetBonus: 20, target2Bonus: 15 },
  eng: { perPoint: 2, targetBonus: 20, target2Bonus: 15 },
  cn: { perPoint: 2, targetBonus: 0, target2Bonus: 15 },
  art: { perPoint: 2, targetBonus: 0, target2Bonus: 15 }
};

// 单个科目奖励计算
function calculateSubjectReward(subjectId, score, target1, target2, current) {
  const rewardRate = rewardRates[subjectId];
  let reward = 0;
  
  if (score !== "" && !isNaN(score)) {
    const numScore = Number(score);
    const improvement = numScore - current;
    
    if (improvement > 0) {
      // 基础奖励：每分奖励
      reward = improvement * rewardRate.perPoint;
      
      // 如果达到target1，加RM20
      if (numScore >= target1) {
        reward += rewardRate.targetBonus;
        
        // 如果直接达到target2，再加RM15
        if (numScore >= target2) {
          reward += rewardRate.target2Bonus;
        }
      }
    }
  }
  
  return reward;
}

// 总奖励计算 - 与PDF计算顺序一致
function calculateReward() {
  let totalReward = 0;
  let allPassed = true;
  let allImproved = true;
  let subjectsWithData = 0;
  
  subjects.forEach((s, index) => {
    const t1Score = load(makeKey("t1", s.id), "");
    
    if (t1Score !== "" && !isNaN(t1Score)) {
      const score = Number(t1Score);
      subjectsWithData++;
      
      // 计算单个科目奖励
      const subjectReward = calculateSubjectReward(s.id, score, s.t1, s.t2, s.current);
      totalReward += subjectReward;
      
      if (document.getElementById(`reward-${s.id}`)) {
        document.getElementById(`reward-${s.id}`).textContent = `Reward: RM${subjectReward}`;
      }
      
      if (score < 40) {
        allPassed = false;
      }
      
      if (score <= s.current) {
        allImproved = false;
      }
    } else {
      if (document.getElementById(`reward-${s.id}`)) {
        document.getElementById(`reward-${s.id}`).textContent = `Reward: RM0`;
      }
    }
  });
  
  // 听写奖励（先应用听写奖励）
  const dictationCount = parseInt(document.getElementById('dictation-count').value) || 0;
  const bonusMultiplier = 1 + (dictationCount * 0.005);
  let finalReward = totalReward * bonusMultiplier;
  
  // 整体奖励（最后加ALL PASS和ALL IMPROVE）
  if (subjectsWithData === subjects.length) {
    if (allPassed) {
      finalReward += 30;  // ALL PASS奖励
      if (allImproved) {
        finalReward += 50;  // ALL IMPROVE奖励
      }
    }
  }
  
  if (document.getElementById('total-reward')) {
    document.getElementById('total-reward').textContent = `RM${finalReward.toFixed(2)}`;
  }
  
  return finalReward;
}

// 初始化奖励显示
function initRewardsDisplay() {
  const rewardGrid = document.querySelector('.reward-grid');
  if (!rewardGrid) return;
  
  const rewardItems = [
    { id: "bm", name: "BAHASA MELAYU", details: "RM2 per point + RM20 if target achieved + RM15 if directly achieve Target 2" },
    { id: "sej", name: "SEJARAH", details: "RM2 per point + RM20 if target achieved + RM15 if directly achieve Target 2" },
    { id: "mt", name: "MATEMATIK", details: "RM1 per point + RM40 if target achieved + RM15 if directly achieve Target 2" },
    { id: "sains", name: "SAINS", details: "RM2 per point + RM20 if target achieved + RM15 if directly achieve Target 2" },
    { id: "moral", name: "MORAL", details: "RM2 per point + RM20 if target achieved + RM15 if directly achieve Target 2" },
    { id: "eng", name: "BAHASA INGGERIS", details: "RM2 per point + RM20 if target achieved + RM15 if directly achieve Target 2" },
    { id: "cn", name: "BAHASA CINA", details: "RM2 per point + RM15 if directly achieve Target 2" },
    { id: "art", name: "PENDIDIKAN SENI VISUAL", details: "RM2 per point + RM15 if directly achieve Target 2" }
  ];
  
  let html = '';
  rewardItems.forEach(item => {
    html += `
      <div class="reward-item">
        <div class="reward-subject">${item.name}</div>
        <div class="reward-details">${item.details}</div>
        <div class="subject-reward" id="reward-${item.id}">Reward: RM0</div>
      </div>
    `;
  });
  
  rewardGrid.innerHTML = html;
}

// 页面加载时初始化奖励显示
document.addEventListener('DOMContentLoaded', function() {
  initRewardsDisplay();
  
  // 听写计数输入监听
  const dictationCountInput = document.getElementById('dictation-count');
  if (dictationCountInput) {
    dictationCountInput.addEventListener('input', calculateReward);
  }
});
