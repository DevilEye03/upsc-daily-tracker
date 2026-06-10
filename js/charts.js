// UPSC 2027 pure HTML5 Canvas Charting Engine

const CanvasCharts = {
  /**
   * Draws a gorgeous weekly bar chart showing target completion over the last 7 days.
   * @param {HTMLCanvasElement} canvas
   * @param {Array} last7DaysData Array of { dateLabel, percent }
   */
  drawWeeklyProgress(canvas, last7DaysData) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    
    // Draw Background grids
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + ((height - 2 * padding) * i) / 4;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
      
      // Draw grid labels
      ctx.fillStyle = '#8b949e';
      ctx.font = '10px Inter';
      ctx.textAlign = 'right';
      ctx.fillText(`${100 - i * 25}%`, padding - 10, y + 3);
    }
    
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    const barWidth = (chartWidth / last7DaysData.length) * 0.6;
    const gap = (chartWidth / last7DaysData.length) * 0.4;
    
    // Draw Bars
    last7DaysData.forEach((day, index) => {
      const x = padding + index * (barWidth + gap) + gap / 2;
      const barHeight = (day.percent / 100) * chartHeight;
      const y = height - padding - barHeight;
      
      // Draw gradient bar
      const gradient = ctx.createLinearGradient(x, y, x, height - padding);
      gradient.addColorStop(0, '#818cf8'); // primary active purple
      gradient.addColorStop(1, '#00f3ff'); // cyan accent
      
      ctx.fillStyle = gradient;
      
      // Round top corners of bar
      ctx.beginPath();
      if (barHeight > 5) {
        ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
      } else {
        ctx.rect(x, y, barWidth, barHeight);
      }
      ctx.fill();
      
      // Draw labels
      ctx.fillStyle = '#c9d1d9';
      ctx.font = '11px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(day.dateLabel, x + barWidth / 2, height - padding + 18);
      
      // Draw percent value inside/above bar
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px Inter';
      if (day.percent > 0) {
        ctx.fillText(`${Math.round(day.percent)}%`, x + barWidth / 2, y - 6);
      }
    });
  },

  /**
   * Draws a study distribution pie chart representing study time or task completion by subject category.
   * @param {HTMLCanvasElement} canvas
   * @param {Object} categoryCounts Object of { "General Studies": count, "PSIR Optional": count, ... }
   */
  drawSubjectDistribution(canvas, categoryCounts) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width * 0.35;
    const centerY = height * 0.5;
    const radius = Math.min(width, height) * 0.35;
    
    const categories = Object.keys(categoryCounts);
    const total = categories.reduce((sum, cat) => sum + (categoryCounts[cat].completed || 0), 0);
    
    if (total === 0) {
      // Empty state
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.fillStyle = '#8b949e';
      ctx.font = '14px Inter';
      ctx.textAlign = 'center';
      ctx.fillText("No completed tasks yet", centerX, centerY);
      return;
    }

    // Color definitions corresponding to HSLs in main.css
    const colors = {
      "General Studies": "#ff6b54",
      "PSIR Optional": "#10b981",
      "Current Affairs": "#0ea5e9",
      "CSAT": "#f59e0b",
      "Essay": "#e05594",
      "Buffer": "#5cd3e6",
      "Video Course": "#a78bfa",
      "Answer Writing": "#f43f5e"
    };

    let startAngle = -Math.PI / 2;
    
    categories.forEach((cat, index) => {
      const value = categoryCounts[cat].completed || 0;
      if (value === 0) return;
      
      const sliceAngle = (value / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;
      
      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      
      ctx.fillStyle = colors[cat] || `hsl(${(index * 360) / categories.length}, 70%, 55%)`;
      ctx.fill();
      
      ctx.strokeStyle = '#0d1117';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      startAngle = endAngle;
    });

    // Draw Legend on the right side
    const legendX = width * 0.7;
    let legendY = height * 0.2;
    const itemHeight = 22;
    
    ctx.textAlign = 'left';
    ctx.font = '12px Inter';
    
    categories.forEach((cat, index) => {
      const completed = categoryCounts[cat].completed || 0;
      const pct = Math.round((completed / total) * 100);
      
      if (completed === 0) return;
      
      // Color box
      ctx.fillStyle = colors[cat] || `hsl(${(index * 360) / categories.length}, 70%, 55%)`;
      ctx.beginPath();
      ctx.roundRect(legendX - 20, legendY - 10, 12, 12, 3);
      ctx.fill();
      
      // Text label
      ctx.fillStyle = '#c9d1d9';
      ctx.fillText(`${cat}: ${completed} (${pct}%)`, legendX, legendY);
      
      legendY += itemHeight;
    });
  },

  /**
   * Draws a line chart showing moving average of answer quality (ratings) over time.
   * @param {HTMLCanvasElement} canvas
   * @param {Array} dataPoints Array of { label, rating }
   */
  drawAnswerQualityLineChart(canvas, dataPoints) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (dataPoints.length === 0) {
      ctx.fillStyle = '#8b949e';
      ctx.font = '14px Inter';
      ctx.textAlign = 'center';
      ctx.fillText("No rated answers found", canvas.width/2, canvas.height/2);
      return;
    }

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    // Draw Background grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + ((height - 2 * padding) * (5 - i)) / 5;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
      
      // Labels (0 to 5 stars)
      ctx.fillStyle = '#8b949e';
      ctx.font = '10px Inter';
      ctx.textAlign = 'right';
      ctx.fillText(`${i}★`, padding - 10, y + 3);
    }
    
    // Plot Line
    ctx.beginPath();
    ctx.strokeStyle = '#f59e0b'; // Amber color
    ctx.lineWidth = 3;
    
    const pointGap = dataPoints.length > 1 ? chartWidth / (dataPoints.length - 1) : chartWidth;
    
    const pointsCoords = [];
    dataPoints.forEach((pt, index) => {
      const x = padding + index * pointGap;
      const y = height - padding - (pt.rating / 5) * chartHeight;
      pointsCoords.push({x, y, label: pt.label, rating: pt.rating});
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    
    // Draw points & fill gradient
    ctx.lineTo(padding + (dataPoints.length - 1) * pointGap, height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();
    
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(245, 158, 11, 0.3)');
    gradient.addColorStop(1, 'rgba(245, 158, 11, 0.0)');
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw circle points and text
    pointsCoords.forEach((pt, index) => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#161b22';
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Rating label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px Inter';
      ctx.textAlign = 'center';
      if (pt.rating > 0) {
        ctx.fillText(pt.rating.toFixed(1), pt.x, pt.y - 10);
      }
      
      // Date label
      ctx.fillStyle = '#c9d1d9';
      ctx.font = '9px Inter';
      ctx.fillText(pt.label, pt.x, height - padding + 15);
    });
  },

  /**
   * Draws a horizontal bar chart showing proficiency (completion rate) by subject.
   * @param {HTMLCanvasElement} canvas
   * @param {Object} categoryData { "Subject": { rate: 85 }, ... }
   */
  drawProficiencyBarChart(canvas, categoryData) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (Object.keys(categoryData).length === 0) {
      ctx.fillStyle = '#8b949e';
      ctx.font = '14px Inter';
      ctx.textAlign = 'center';
      ctx.fillText("No tasks completed", canvas.width/2, canvas.height/2);
      return;
    }

    const width = canvas.width;
    const height = canvas.height;
    const paddingX = 120; // Room for labels
    const paddingY = 40;
    
    const chartWidth = width - paddingX - 40;
    const chartHeight = height - 2 * paddingY;
    
    const categories = Object.keys(categoryData).sort((a,b) => categoryData[b].rate - categoryData[a].rate);
    
    const barHeight = Math.min((chartHeight / categories.length) * 0.6, 30);
    const gap = (chartHeight / categories.length) * 0.4;
    
    // Draw background grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const x = paddingX + (chartWidth * i) / 4;
      ctx.beginPath();
      ctx.moveTo(x, paddingY);
      ctx.lineTo(x, height - paddingY);
      ctx.stroke();
      
      ctx.fillStyle = '#8b949e';
      ctx.font = '10px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(`${i * 25}%`, x, height - paddingY + 15);
    }

    const colors = {
      "General Studies": "#ff6b54",
      "PSIR Optional": "#10b981",
      "Current Affairs": "#0ea5e9",
      "CSAT": "#f59e0b",
      "Essay": "#e05594"
    };

    categories.forEach((cat, index) => {
      const y = paddingY + index * (barHeight + gap) + gap / 2;
      const rate = categoryData[cat].rate || 0; // 0 to 100
      const barLength = (rate / 100) * chartWidth;
      
      // Draw Label
      ctx.fillStyle = '#c9d1d9';
      ctx.font = '11px Inter';
      ctx.textAlign = 'right';
      ctx.fillText(cat.length > 15 ? cat.substring(0, 13) + '...' : cat, paddingX - 10, y + barHeight / 1.5);
      
      // Draw Bar
      ctx.fillStyle = colors[cat] || '#818cf8';
      ctx.beginPath();
      if (barLength > 5) {
        ctx.roundRect(paddingX, y, barLength, barHeight, [0, 4, 4, 0]);
      } else {
        ctx.rect(paddingX, y, barLength, barHeight);
      }
      ctx.fill();
      
      // Draw Rate Value
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px Inter';
      ctx.textAlign = 'left';
      ctx.fillText(`${Math.round(rate)}%`, paddingX + barLength + 5, y + barHeight / 1.5);
    });
  },

  /**
   * Draws a GitHub-like contribution grid showing consistent check-ins over months.
   * @param {HTMLCanvasElement} canvas
   * @param {Array} daysList Array of day objects containing { date, tasks, answers }
   */
  drawConsistencyHeatmap(canvas, daysList) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const cols = 53; // weeks
    const rows = 7;  // days of week
    const boxSize = 10;
    const boxGap = 3.5;
    const startX = 30;
    const startY = 30;
    
    // Group days by date key
    const dayMap = {};
    daysList.forEach(day => {
      let count = 0;
      day.tasks.forEach(t => { if (t.completed) count++; });
      day.answers.forEach(a => { if (a.completed) count++; });
      dayMap[day.date] = count;
    });

    // We start showing from June 1, 2026. Let's find the day index of June 1.
    // We will align the grid columns with Sunday-Saturday rows.
    const startPrepDate = new Date(2026, 5, 1);
    const dayOffset = startPrepDate.getDay(); // June 1, 2026 is Monday (1)
    
    // Draw row labels (Mon, Wed, Fri)
    ctx.fillStyle = '#8b949e';
    ctx.font = '9px Inter';
    ctx.textAlign = 'right';
    ctx.fillText("Mon", startX - 8, startY + boxSize + boxGap + 8);
    ctx.fillText("Wed", startX - 8, startY + 3 * (boxSize + boxGap) + 8);
    ctx.fillText("Fri", startX - 8, startY + 5 * (boxSize + boxGap) + 8);
    
    // We will plot 354 days
    const totalDays = daysList.length;
    let currentX = startX;
    
    const monthLabels = [];
    let lastMonth = -1;
    
    for (let dayIndex = 0; dayIndex < totalDays; dayIndex++) {
      const dayObj = daysList[dayIndex];
      const dateObj = new Date(dayObj.date);
      
      const gridRow = (dayOffset + dayIndex) % 7;
      const gridCol = Math.floor((dayOffset + dayIndex) / 7);
      
      const x = startX + gridCol * (boxSize + boxGap);
      const y = startY + gridRow * (boxSize + boxGap);
      
      // Calculate activity color intensity
      const completedCount = dayMap[dayObj.date] || 0;
      let fillStyle = '#161b22'; // Empty
      
      if (completedCount > 0 && completedCount <= 1) {
        fillStyle = '#0e4429'; // Low activity
      } else if (completedCount > 1 && completedCount <= 3) {
        fillStyle = '#006d32'; // Med activity
      } else if (completedCount > 3 && completedCount <= 5) {
        fillStyle = '#26a641'; // High activity
      } else if (completedCount > 5) {
        fillStyle = '#39d353'; // Ultra high activity
      }
      
      // Draw grid box
      ctx.fillStyle = fillStyle;
      ctx.beginPath();
      ctx.roundRect(x, y, boxSize, boxSize, 2);
      ctx.fill();
      
      // Draw Month headings
      const month = dateObj.getMonth();
      if (month !== lastMonth && gridRow === 0) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        monthLabels.push({ text: monthNames[month], x: x });
        lastMonth = month;
      }
    }
    
    // Draw month label texts
    ctx.fillStyle = '#8b949e';
    ctx.font = '10px Inter';
    ctx.textAlign = 'left';
    monthLabels.forEach(label => {
      ctx.fillText(label.text, label.x, startY - 10);
    });

    // Draw Heatmap Legend at the bottom
    const legendY = startY + 7 * (boxSize + boxGap) + 12;
    ctx.fillStyle = '#8b949e';
    ctx.font = '10px Inter';
    ctx.fillText("Less", startX, legendY + 8);
    
    const legendColors = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
    legendColors.forEach((color, idx) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(startX + 35 + idx * 14, legendY, boxSize, boxSize, 2);
      ctx.fill();
    });
    ctx.fillStyle = '#8b949e';
    ctx.fillText("More", startX + 45 + legendColors.length * 14, legendY + 8);
  },

  /**
   * Cumulative all-time task completion curve
   * @param {HTMLCanvasElement} canvas
   * @param {Array} days - all appState.days sorted by date
   */
  drawCumulativeProgress(canvas, days) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const W = canvas.width, H = canvas.height;
    const pad = { top: 30, right: 20, bottom: 40, left: 50 };
    const cW = W - pad.left - pad.right;
    const cH = H - pad.top - pad.bottom;

    // Build cumulative data
    let cumDone = 0, cumTotal = 0;
    const points = [];
    const studyDays = days.filter(d => !d.isBuffer && d.tasks.length > 0);
    studyDays.forEach((d, i) => {
      cumDone += d.tasks.filter(t => t.completed).length;
      cumTotal += d.tasks.length;
      if (i % 3 === 0 || i === studyDays.length - 1) {
        points.push({ x: i / Math.max(studyDays.length - 1, 1), pct: cumTotal > 0 ? (cumDone / cumTotal) * 100 : 0 });
      }
    });

    if (points.length < 2) {
      ctx.fillStyle = '#8b949e';
      ctx.font = '13px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('Study more days to see trend', W / 2, H / 2);
      return;
    }

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (cH * i) / 4;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
      ctx.fillStyle = '#8b949e'; ctx.font = '10px Inter'; ctx.textAlign = 'right';
      ctx.fillText(`${100 - i * 25}%`, pad.left - 6, y + 3);
    }

    // Fill under curve
    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + cH);
    grad.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
    grad.addColorStop(1, 'rgba(56, 189, 248, 0.02)');
    ctx.beginPath();
    ctx.moveTo(pad.left + points[0].x * cW, pad.top + cH);
    points.forEach(p => ctx.lineTo(pad.left + p.x * cW, pad.top + cH - (p.pct / 100) * cH));
    ctx.lineTo(pad.left + points[points.length - 1].x * cW, pad.top + cH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    points.forEach((p, i) => {
      const px = pad.left + p.x * cW;
      const py = pad.top + cH - (p.pct / 100) * cH;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    });
    ctx.stroke();

    // X-axis label
    ctx.fillStyle = '#8b949e'; ctx.font = '10px Inter'; ctx.textAlign = 'center';
    ctx.fillText('All study days →', W / 2, H - 6);
  },

  /**
   * Weekly answer writing momentum — answers written per week
   * @param {HTMLCanvasElement} canvas
   * @param {Array} weeklyData — [{label, count}]
   */
  drawAnswerMomentum(canvas, weeklyData) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const W = canvas.width, H = canvas.height;
    const pad = 40;
    const cW = W - 2 * pad;
    const cH = H - 2 * pad;
    const maxCount = Math.max(...weeklyData.map(w => w.count), 1);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad + (cH * i) / 4;
      ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(W - pad, y); ctx.stroke();
      ctx.fillStyle = '#8b949e'; ctx.font = '10px Inter'; ctx.textAlign = 'right';
      ctx.fillText(Math.round(maxCount - (maxCount * i) / 4), pad - 6, y + 3);
    }

    if (weeklyData.length === 0) {
      ctx.fillStyle = '#8b949e'; ctx.font = '13px Inter'; ctx.textAlign = 'center';
      ctx.fillText('No answers submitted yet', W / 2, H / 2);
      return;
    }

    const barW = (cW / weeklyData.length) * 0.6;
    const gap = cW / weeklyData.length;

    weeklyData.forEach((w, i) => {
      const x = pad + i * gap + (gap - barW) / 2;
      const bH = (w.count / maxCount) * cH;
      const y = pad + cH - bH;

      const grad = ctx.createLinearGradient(x, y, x, pad + cH);
      grad.addColorStop(0, '#a78bfa');
      grad.addColorStop(1, 'rgba(167,139,250,0.2)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, barW, bH, [4, 4, 0, 0]);
      ctx.fill();

      ctx.fillStyle = '#e6edf3'; ctx.font = '9px Inter'; ctx.textAlign = 'center';
      ctx.fillText(w.label, x + barW / 2, H - 8);
      if (w.count > 0) {
        ctx.fillStyle = '#a78bfa'; ctx.font = 'bold 10px Inter';
        ctx.fillText(w.count, x + barW / 2, y - 4);
      }
    });
  },

  /**
   * GS vs PSIR average ratings grouped bar
   * @param {HTMLCanvasElement} canvas
   * @param {{gs: number, psir: number}} ratings
   */
  drawGsvsPSIRRatings(canvas, ratings) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const W = canvas.width, H = canvas.height;
    const maxScore = 10;

    const bars = [
      { label: 'GS Avg', value: ratings.gs || 0, color: '#34d399' },
      { label: 'PSIR Avg', value: ratings.psir || 0, color: '#f59e0b' }
    ];

    const pad = 40;
    const cW = W - 2 * pad;
    const cH = H - 2 * pad;
    const barW = cW / 4;

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = pad + (cH * i) / 5;
      ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(W - pad, y); ctx.stroke();
      ctx.fillStyle = '#8b949e'; ctx.font = '10px Inter'; ctx.textAlign = 'right';
      ctx.fillText(maxScore - (maxScore * i) / 5, pad - 6, y + 3);
    }

    bars.forEach((bar, i) => {
      const x = pad + (i + 0.5) * (cW / bars.length) - barW / 2;
      const bH = (bar.value / maxScore) * cH;
      const y = pad + cH - bH;

      const grad = ctx.createLinearGradient(x, y, x, pad + cH);
      grad.addColorStop(0, bar.color);
      grad.addColorStop(1, bar.color + '33');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, barW, bH, [6, 6, 0, 0]);
      ctx.fill();

      ctx.fillStyle = '#e6edf3'; ctx.font = '11px Inter'; ctx.textAlign = 'center';
      ctx.fillText(bar.label, x + barW / 2, H - 8);

      if (bar.value > 0) {
        ctx.fillStyle = bar.color; ctx.font = 'bold 14px Inter';
        ctx.fillText(bar.value.toFixed(1) + '★', x + barW / 2, y - 8);
      } else {
        ctx.fillStyle = '#8b949e'; ctx.font = '11px Inter';
        ctx.fillText('No data', x + barW / 2, H / 2);
      }
    });

    // Center divider line
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(W / 2, pad); ctx.lineTo(W / 2, H - pad); ctx.stroke();
  }
};

// Export globally
if (typeof window !== 'undefined') {
  window.CanvasCharts = CanvasCharts;
}
