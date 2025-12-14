// 特效函数
function createEffect(x, y, emoji, className = 'effect') {
  const effect = document.createElement('div');
  effect.className = className;
  effect.innerHTML = emoji;
  effect.style.position = 'fixed';
  effect.style.left = (x - 25) + 'px';
  effect.style.top = (y - 25) + 'px';
  effect.style.fontSize = '50px';
  effect.style.zIndex = '9999';
  effect.style.pointerEvents = 'none';
  
  document.body.appendChild(effect);
  
  // 2秒后移除
  setTimeout(() => {
    effect.remove();
  }, 2000);
}

// 等级庆祝特效
function createGradeCelebration(grade) {
  const celebration = document.createElement('div');
  celebration.className = 'grade-celebration';
  document.body.appendChild(celebration);
  
  let items = [];
  let duration = 3000;
  
  if (grade === 'C' || grade === 'C+') {
    // C/C+等级：5个星星
    items = ['⭐', '⭐', '⭐', '⭐', '⭐'];
    duration = 3000;
  } else if (grade === 'B' || grade === 'B+') {
    // B/B+等级：5个粉色爱心和3个星星
    items = ['💖', '💖', '💖', '💖', '💖', '⭐', '⭐', '⭐'];
    duration = 3000;
  } else if (grade === 'A-' || grade === 'A' || grade === 'A+') {
    // A-/A/A+等级：一堆星星、礼物、爱心等梦幻特效
    items = ['⭐', '✨', '🎁', '💝', '🎀', '💖', '🌟', '🎉', '💕', '💫', '🎇', '💞'];
    duration = 5000;
  }
  
  items.forEach((emoji, index) => {
    setTimeout(() => {
      const item = document.createElement('div');
      item.className = 'celebration-item';
      item.innerHTML = emoji;
      item.style.left = Math.random() * 100 + 'vw';
      item.style.fontSize = (30 + Math.random() * 30) + 'px';
      item.style.animationDuration = (duration / 1000) + 's';
      celebration.appendChild(item);
      
      setTimeout(() => {
        item.remove();
      }, duration);
    }, index * 100);
  });
  
  setTimeout(() => {
    celebration.remove();
  }, duration + 1000);
}

// 检查成绩并触发特效
function checkScoreEffects(subjectId, score, current, target, target2, inputElement, round) {
  if (score === "" || isNaN(score)) return;
  
  const numScore = Number(score);
  const numCurrent = Number(current);
  const numTarget = Number(target);
  const numTarget2 = Number(target2);
  const rect = inputElement.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  
  // 检查是否低于current成绩
  if (numScore < numCurrent) {
    createEffect(x, y, '💩', 'poop-effect');
    return;
  }
  
  // 检查是否比current高
  if (numScore > numCurrent) {
    createEffect(x, y, '⭐', 'star-effect');
  }
  
  // 检查是否达到target
  if (numScore >= numTarget) {
    createEffect(x, y, '💖', 'heart-effect');
  }
  
  // 检查是否超过target
  if (numScore > numTarget) {
    createEffect(x, y, '❤️', 'red-heart-effect');
  }
  
  // 检查等级并触发庆祝特效
  const grade = getGrade(score);
  if (grade) {
    if (grade === 'C' || grade === 'C+') {
      createGradeCelebration(grade);
    } else if (grade === 'B' || grade === 'B+') {
      createGradeCelebration(grade);
    } else if (grade === 'A-' || grade === 'A' || grade === 'A+') {
      createGradeCelebration(grade);
    }
  }
}
