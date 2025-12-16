// ===============================
// 完全修复的 saveAsPDF 函数
// ===============================
function saveAsPDF() {
  try {
    if (typeof jspdf !== 'undefined') {
      const doc = new jspdf.jsPDF('p', 'mm', 'a4');
      generatePDFContent(doc);
    } else if (typeof window.jspdf !== 'undefined') {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF('p', 'mm', 'a4');
      generatePDFContent(doc);
    } else {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/jspdf@latest/dist/jspdf.umd.min.js';
      script.onload = () => generatePDFContent(new window.jspdf.jsPDF());
      document.head.appendChild(script);
    }
  } catch (e) {
    alert('PDF Error: ' + e.message);
  }
}

// ===============================
// PDF 内容生成
// ===============================
function generatePDFContent(doc) {

  // ===== 标题 =====
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

  doc.line(20, 42, 190, 42);
  let yPos = 50;

  // ===============================
  // 表头
  // ===============================
  doc.setFontSize(16);
  doc.setTextColor(236, 72, 153);
  doc.text('TARGET 1 SCORES AND REWARDS', 20, yPos);
  yPos += 10;

  doc.setFillColor(252, 231, 243);
  doc.rect(20, yPos, 170, 8, 'F');

  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('No.', 22, yPos + 6);
  doc.text('Subject', 30, yPos + 6);
  doc.text('Current', 70, yPos + 6);
  doc.text('Target 1', 90, yPos + 6);
  doc.text('Score', 110, yPos + 6);
  doc.text('Achieves', 130, yPos + 6);
  doc.text('Reward', 165, yPos + 6);

  yPos += 8;

  let baseReward = 0;
  let allPass = true;

  // ===============================
  // 科目列
  // ===============================
  subjects.forEach((s, i) => {

    const t1Score = load(makeKey("t1", s.id), "");
    const score = t1Score !== "" ? Number(t1Score) : NaN;
    const reward = calculateSubjectReward(s.id, t1Score, s.t1, s.t2, s.current);
    baseReward += reward;

    if (isNaN(score) || score < 40) allPass = false;

    if (i % 2 === 0) {
      doc.setFillColor(253, 242, 248);
      doc.rect(20, yPos, 170, 8, 'F');
    }

    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');

    doc.text(String(i + 1), 22, yPos + 6);
    doc.text(s.name.length > 18 ? s.name.slice(0, 15) + '...' : s.name, 30, yPos + 6);
    doc.text(String(s.current), 70, yPos + 6);
    doc.text(String(s.t1), 90, yPos + 6);
    doc.text(t1Score !== "" ? String(t1Score) : "-", 110, yPos + 6);

    // ✅ Achieves 显示 Target 几
    let achieveText = "-";
    if (!isNaN(score)) {
      if (score >= s.t2) achieveText = "Target 2 ✓";
      else if (score >= s.t1) achieveText = "Target 1 ✓";
      else achieveText = "Below Target";
    }
    doc.text(achieveText, 128, yPos + 6);

    doc.text(`RM${reward}`, 165, yPos + 6);
    yPos += 8;
  });

  yPos += 15;

  // ===============================
  // 计算变量
  // ===============================
  const dictation = 5;
  const extraPercent = dictation * 0.5;
  const multiplier = 100 + extraPercent;
  const rewardAfterMultiplier = baseReward * (multiplier / 100);
  const allPassBonus = allPass ? 30 : 0;
  const allImproveBonus = 50;
  const finalTotal = rewardAfterMultiplier + allPassBonus + allImproveBonus;

  // ===============================
  // 格子1 (整行) - Reward Calculation
  // ===============================
  const fullWidth = 170;
  const boxHeight1 = 40;
  
  // 格子1：浅蓝色格子
  doc.setFillColor(219, 234, 254);
  doc.rect(20, yPos, fullWidth, boxHeight1, 'F');
  
  // 加深边框
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1.5);
  doc.rect(20, yPos, fullWidth, boxHeight1);
  doc.setLineWidth(0.5);
  
  // 标题
  doc.setFontSize(13);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(0, 0, 128);
  doc.text('Reward Calculation', 105, yPos + 9, { align: 'center' });
  
  // 内容
  let textY = yPos + 17;
  doc.setFontSize(9);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(0, 0, 0);
  
  // 左列
  const leftColX = 25;
  const leftValueX = 70;
  
  // 右列
  const rightColX = 105;
  const rightValueX = 150;
  
  // 第一行
  doc.text('Base Reward:', leftColX, textY);
  doc.text(`RM${baseReward.toFixed(2)}`, leftValueX, textY);
  
  doc.text('Perfect dictations:', rightColX, textY);
  doc.text(`${dictation}`, rightValueX, textY);
  textY += 6;
  
  // 第二行
  doc.text('Extra Percentage:', leftColX, textY);
  doc.text(`${dictation} × 0.5% = ${extraPercent}%`, leftValueX, textY);
  
  doc.text('Total Percentage:', rightColX, textY);
  doc.text(`100% + ${extraPercent}% = ${multiplier}%`, rightValueX, textY);
  textY += 6;
  
  // 第三行
  doc.text('Multiplier:', leftColX, textY);
  doc.text(`${multiplier}%`, leftValueX, textY);
  
  doc.text('Final Calculation:', rightColX, textY);
  doc.text(`RM${baseReward.toFixed(2)} × ${multiplier}%`, rightValueX, textY);
  textY += 6;
  
  // 第四行
  doc.text('Final Reward:', leftColX, textY);
  doc.text(`RM${rewardAfterMultiplier.toFixed(2)}`, leftValueX, textY);

  yPos += boxHeight1 + 10;

  // ===============================
  // 格子2和格子3 (并排)
  // ===============================
  const halfWidth = (fullWidth - 10) / 2;
  
  // 格子2：浅粉色格子 - Extra Bonus Reward (左边)
  doc.setFillColor(255, 228, 240);
  doc.rect(20, yPos, halfWidth, 50, 'F');
  
  // 加深边框
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1.5);
  doc.rect(20, yPos, halfWidth, 50);
  doc.setLineWidth(0.5);
  
  // 标题
  doc.setFontSize(13);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(199, 21, 133);
  doc.text('Extra Bonus Reward', 20 + halfWidth/2, yPos + 9, { align: 'center' });
  
  // ALL PASS 和 ALL IMPROVE
  const checkY = yPos + 17;
  const checkBoxSize = 8;
  const checkBoxX = 20 + halfWidth - 20;
  
  // ALL PASS
  doc.setFontSize(9);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(0, 0, 0);
  
  doc.text(`ALL PASS (RM${allPassBonus})`, 25, checkY);
  
  // 打勾格子
  doc.setFillColor(255, 255, 255);
  doc.rect(checkBoxX, checkY - 4, checkBoxSize, checkBoxSize, 'F');
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1);
  doc.rect(checkBoxX, checkY - 4, checkBoxSize, checkBoxSize);
  
  // 打勾符号
  if (allPass) {
    doc.setDrawColor(0, 128, 0);
    doc.setLineWidth(0.8);
    const centerX = checkBoxX + checkBoxSize/2;
    const centerY = checkY - 4 + checkBoxSize/2;
    doc.line(centerX - 2, centerY - 1, centerX, centerY + 2);
    doc.line(centerX, centerY + 2, centerX + 3, centerY - 2);
  }
  
  // ALL IMPROVE
  const checkY2 = checkY + 12;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.setTextColor(0, 0, 0);
  
  doc.text(`ALL IMPROVE (RM${allImproveBonus})`, 25, checkY2);
  
  // 打勾格子
  doc.setFillColor(255, 255, 255);
  doc.rect(checkBoxX, checkY2 - 4, checkBoxSize, checkBoxSize, 'F');
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1);
  doc.rect(checkBoxX, checkY2 - 4, checkBoxSize, checkBoxSize);
  
  // 打勾符号（总是有）
  doc.setDrawColor(0, 128, 0);
  doc.setLineWidth(0.8);
  const centerX2 = checkBoxX + checkBoxSize/2;
  const centerY2 = checkY2 - 4 + checkBoxSize/2;
  doc.line(centerX2 - 2, centerY2 - 1, centerX2, centerY2 + 2);
  doc.line(centerX2, centerY2 + 2, centerX2 + 3, centerY2 - 2);
  
  doc.setLineWidth(0.5);

  // 格子3：浅紫色格子 - Final Calculation (右边)
  const box3X = 20 + halfWidth + 10;
  
  doc.setFillColor(230, 220, 250);
  doc.rect(box3X, yPos, halfWidth, 50, 'F');
  
  // 加深边框
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1.5);
  doc.rect(box3X, yPos, halfWidth, 50);
  doc.setLineWidth(0.5);
  
  // 标题
  doc.setFontSize(13);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(75, 0, 130);
  doc.text('Final Calculation', box3X + halfWidth/2, yPos + 9, { align: 'center' });
  
  // 内容
  let calcY = yPos + 17;
  doc.setFontSize(9);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(0, 0, 0);
  
  const calcX = box3X + 5;
  doc.text(`RM${baseReward.toFixed(2)} × ${multiplier}%`, calcX, calcY);
  doc.text(`= RM${rewardAfterMultiplier.toFixed(2)}`, calcX + 30, calcY);
  calcY += 7;
  
  doc.text(`RM${rewardAfterMultiplier.toFixed(2)} + RM${allPassBonus} + RM${allImproveBonus}`, calcX, calcY);
  calcY += 7;
  
  doc.text(`= RM${finalTotal.toFixed(2)}`, calcX, calcY);

  yPos += 50 + 10;

  // ===============================
  // 格子4 (整行) - TOTAL REWARD
  // ===============================
  const boxHeight4 = 50;
  
  // 浅青色格子
  doc.setFillColor(224, 255, 255);
  doc.rect(20, yPos, fullWidth, boxHeight4, 'F');
  
  // 加深边框
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1.5);
  doc.rect(20, yPos, fullWidth, boxHeight4);
  doc.setLineWidth(0.5);
  
  // 标题
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('TOTAL REWARD', 105, yPos + 17, { align: 'center' });
  
  // 金额
  doc.setFontSize(30);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(`RM${finalTotal.toFixed(2)}`, 105, yPos + 32, { align: 'center' });

  // ===============================
  // 保存PDF (这行之前缺失了)
  // ===============================
  doc.save(`SPM_Target_Report_${date.replace(/\//g, '-')}.pdf`);
}
