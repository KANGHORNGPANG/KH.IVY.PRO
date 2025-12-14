// 完全修复的saveAsPDF函数
function saveAsPDF() {
  try {
    // 检查jsPDF是否可用
    if (typeof jspdf !== 'undefined') {
      // 如果有全局jspdf变量
      const doc = new jspdf.jsPDF('p', 'mm', 'a4');
      generatePDFContent(doc);
    } else if (typeof window.jspdf !== 'undefined') {
      // 如果有window.jspdf变量
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF('p', 'mm', 'a4');
      generatePDFContent(doc);
    } else {
      // 尝试动态加载jsPDF
      alert('PDF library loading, please wait...');
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/jspdf@latest/dist/jspdf.umd.min.js';
      script.onload = function() {
        const doc = new window.jspdf.jsPDF('p', 'mm', 'a4');
        generatePDFContent(doc);
      };
      script.onerror = function() {
        alert('Failed to load PDF library. Please check your internet connection.');
      };
      document.head.appendChild(script);
      return;
    }
  } catch (error) {
    console.error('PDF save error:', error);
    alert('Error saving PDF: ' + error.message + '\nPlease try again or check your internet connection.');
  }
}

// 修复的PDF内容生成函数
function generatePDFContent(doc) {
  // 标题 - 修复：确保所有文本都是字符串
  doc.setFontSize(24);
  doc.setTextColor(124, 58, 237);
  doc.text('SPM TARGET TRACKER REPORT', 105, 20, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setTextColor(168, 85, 247);
  doc.text('Student: IVY YAW ZI XUAN', 105, 30, { align: 'center' });
  
  const date = new Date().toLocaleDateString();
  doc.setFontSize(10);
  doc.setTextColor(139, 93, 93);
  doc.text(`Report Generated: ${date}`, 105, 37, { align: 'center' });
  
  // 添加分隔线
  doc.setDrawColor(244, 114, 182);
  doc.setLineWidth(0.5);
  doc.line(20, 42, 190, 42);
  
  let yPos = 50;
  
  // TARGET 1 成绩表标题
  doc.setFontSize(16);
  doc.setTextColor(236, 72, 153);
  doc.text('TARGET 1 SCORES AND REWARDS', 20, yPos);
  yPos += 10;
  
  // 表头
  doc.setFillColor(252, 231, 243);
  doc.rect(20, yPos, 170, 8, 'F');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, 'bold');
  
  // 表头列
  doc.text('No.', 22, yPos + 6);
  doc.text('Subject', 30, yPos + 6);
  doc.text('Current', 70, yPos + 6);
  doc.text('Target', 90, yPos + 6);
  doc.text('Score', 110, yPos + 6);
  doc.text('Achieves', 130, yPos + 6);
  doc.text('Reward', 165, yPos + 6);
  
  yPos += 8;
  
  let totalReward = 0;
  
  // 科目数据行 - 修复：确保所有值都转换为字符串
  subjects.forEach((s, index) => {
    const t1Score = load(makeKey("t1", s.id), "");
    const scoreNum = t1Score ? Number(t1Score) : 0;
    
    // 计算奖励
    const reward = calculateSubjectReward(s.id, t1Score, s.t1, s.t2, s.current);
    totalReward += reward;
    
    // 交替行背景色
    if (index % 2 === 0) {
      doc.setFillColor(253, 242, 248);
      doc.rect(20, yPos, 170, 8, 'F');
    }
    
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    
    // No. - 修复：转换为字符串
    doc.text((index + 1).toString(), 22, yPos + 6);
    
    // Subject
    const shortName = s.name.length > 18 ? s.name.substring(0, 15) + '...' : s.name;
    doc.text(shortName, 30, yPos + 6);
    
    // Current - 修复：确保是字符串
    doc.text(s.current.toString(), 70, yPos + 6);
    
    // Target - 修复：确保是字符串
    doc.text(s.t1.toString(), 90, yPos + 6);
    
    // Score - 修复：处理空值和确保是字符串
    const scoreText = t1Score !== "" ? t1Score.toString() : "-";
    doc.text(scoreText, 110, yPos + 6);
    
    // Achieves
    let achievesText = "-";
    if (t1Score !== "" && !isNaN(scoreNum)) {
      if (scoreNum >= s.t2) {
        achievesText = "Target 2 ✓";
      } else if (scoreNum >= s.t1) {
        achievesText = "Target 1 ✓";
      } else if (scoreNum >= 40) {
        achievesText = "Pass";
      } else {
        achievesText = "Fail";
      }
    }
    doc.text(achievesText, 130, yPos + 6);
    
    // Reward - 修复：确保是字符串
    doc.text(`RM${reward}`, 165, yPos + 6);
    
    yPos += 8;
    
    // 检查是否需要新页面
    if (yPos > 270 && index < subjects.length - 1) {
      doc.addPage();
      yPos = 20;
    }
  });
  
  yPos += 10;
  
  // 总奖励部分
  doc.setFillColor(240, 249, 235);
  doc.rect(20, yPos, 170, 25, 'F');
  doc.setDrawColor(52, 211, 153);
  doc.setLineWidth(1);
  doc.rect(20, yPos, 170, 25);
  
  // 听写奖励
  const dictationCount = parseInt(document.getElementById('dictation-count').value) || 0;
  const bonusMultiplier = 1 + (dictationCount * 0.005);
  const finalReward = totalReward * bonusMultiplier;
  
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(5, 150, 105);
  doc.text('TOTAL REWARD', 105, yPos + 10, { align: 'center' });
  
  yPos += 20;
  
  // 最终总奖励 - 修复：确保是字符串
  doc.setFontSize(32);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(236, 72, 153);
  doc.text(`RM${finalReward.toFixed(2)}`, 105, yPos, { align: 'center' });
  
  yPos += 15;
  
  // 奖励明细 - 修复：确保是字符串
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Base Reward: RM${totalReward.toFixed(2)}`, 30, yPos);
  
  if (dictationCount > 0) {
    yPos += 5;
    doc.text(`Perfect Dictations: ${dictationCount} (+${(dictationCount * 0.5).toFixed(1)}%)`, 30, yPos);
  }
  
  yPos += 10;
  
  // 页脚
  doc.setFontSize(9);
  doc.setTextColor(139, 93, 93);
  doc.text('Generated by SPM Target Tracker © 2026', 105, yPos, { align: 'center' });
  yPos += 5;
  doc.text('BY: KH@ONLY GIVE TO IVY YAW ZI XUAN', 105, yPos, { align: 'center' });
  
  // 保存PDF
  const fileName = `SPM_Target_Report_${date.replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
  
  alert('PDF saved successfully! File: ' + fileName);
}
