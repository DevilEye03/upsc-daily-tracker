// UPSC 2027 Tracker UI Controller & Routing

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initial Data Setup
  let appState = window.StorageManager.loadState();
  let currentSelectedDate = window.getLocalDateString(); // Default to today
  
  // Make sure today falls within the prep schedule. If not, default to Day 1 (June 12, 2026)
  const scheduleStart = "2026-06-12";
  const scheduleEnd = "2027-05-20";
  if (currentSelectedDate < scheduleStart || currentSelectedDate > scheduleEnd) {
    currentSelectedDate = scheduleStart;
  }

  // Active view tracking
  let activeView = "dashboard";
  
  // 2. DOM Elements
  const sideNavItems = document.querySelectorAll(".nav-item");
  const views = document.querySelectorAll(".view-container");
  const streakNumDisplay = document.getElementById("streak-num");
  
  // Dashboard Elements
  const dashPercentage = document.getElementById("dash-pct");
  const dashAwPercentage = document.getElementById("dash-aw-pct");
  const dashPctRing = document.getElementById("dash-pct-ring");
  const dashTasksCompleted = document.getElementById("dash-completed-tasks");
  const dashTasksTotal = document.getElementById("dash-total-tasks");
  const dashAnswersCompleted = document.getElementById("dash-completed-answers");
  const dashAnswersTotal = document.getElementById("dash-total-answers");
  const dashActivePhase = document.getElementById("dash-active-phase");
  const dashPhaseDesc = document.getElementById("dash-phase-desc");
  const dashCircularOffset = document.getElementById("progress-circle-fill");
  const todayTasksList = document.getElementById("today-tasks-checklist");
  
  // Daily Tracker Elements
  const trackerDateLabel = document.getElementById("tracker-date-label");
  const trackerDayIndexLabel = document.getElementById("tracker-day-index");
  const trackerPhaseLabel = document.getElementById("tracker-phase-label");
  const trackerDayCard = document.getElementById("tracker-day-header");
  const dailyTasksChecklist = document.getElementById("daily-tasks-list");
  const dailyAnswersList = document.getElementById("daily-answers-list");
  
  // Calendar Grid Elements
  const calendarDaysContainer = document.getElementById("calendar-days");
  const calMonthYearLabel = document.getElementById("cal-month-year");
  const prevMonthBtn = document.getElementById("prev-month-btn");
  const nextMonthBtn = document.getElementById("next-month-btn");
  
  // Study Timer Elements
  const timerDisplay = document.getElementById("timer-time");
  const timerToggleBtn = document.getElementById("timer-toggle");
  const timerResetBtn = document.getElementById("timer-reset");
  
  // Syllabus Elements
  const syllabusTabContainer = document.getElementById("syllabus-tabs-wrapper");
  const syllabusGrid = document.getElementById("syllabus-grid-body");
  
  // Analytics elements
  const weeklyCanvas = document.getElementById("weekly-canvas");
  const pieCanvas = document.getElementById("pie-canvas");
  const heatmapCanvas = document.getElementById("heatmap-canvas");
  const qualityTrendCanvas = document.getElementById("quality-trend-canvas");
  const proficiencyCanvas = document.getElementById("proficiency-canvas");
  
  // KPI Elements
  const kpiAvgRating = document.getElementById("kpi-avg-rating");
  const kpi30dayVelocity = document.getElementById("kpi-30day-velocity");
  const kpiStrongestSubject = document.getElementById("kpi-strongest-subject");
  const kpiWeakestSubject = document.getElementById("kpi-weakest-subject");
  
  // Answers View Elements
  const answersVaultList = document.getElementById("answers-vault-list");
  const awTabToday = document.getElementById("aw-tab-today");
  const awTabPast = document.getElementById("aw-tab-past");
  const geminiApiKeyInput = document.getElementById("gemini-api-key-input");
  const saveGeminiKeyBtn = document.getElementById("save-gemini-key-btn");
  
  if(geminiApiKeyInput && saveGeminiKeyBtn) {
    geminiApiKeyInput.value = window.StorageManager.getApiKey();
    saveGeminiKeyBtn.addEventListener("click", () => {
      window.StorageManager.setApiKey(geminiApiKeyInput.value.trim());
      saveGeminiKeyBtn.innerText = "Saved ✓";
      setTimeout(() => saveGeminiKeyBtn.innerHTML = '<i class="fas fa-save"></i> Save', 1500);
    });
  }

  let currentAnswersTab = "today"; // "today" or "past"
  if(awTabToday && awTabPast) {
    awTabToday.addEventListener("click", () => { currentAnswersTab = "today"; renderAnswersView(); });
    awTabPast.addEventListener("click", () => { currentAnswersTab = "past"; renderAnswersView(); });
  }

  // Timeline nodes
  const timelineNodes = document.querySelectorAll(".timeline-node");
  
  // Backups and Resets
  const exportBtn = document.getElementById("export-backup-btn");
  const importBtn = document.getElementById("import-backup-btn");
  const importInput = document.getElementById("import-file-input");
  const resetBtn = document.getElementById("reset-tracker-btn");
  
  // Modals
  const resetModal = document.getElementById("reset-modal");
  const confirmResetBtn = document.getElementById("confirm-reset-btn");
  const cancelResetBtn = document.getElementById("cancel-reset-btn");
  const closeResetModal = document.getElementById("close-reset-modal");

  // Timer state
  let timerInterval = null;
  let timerSeconds = 0;
  let timerRunning = false;

  // Calendar month tracker (starts at selected date month)
  let calendarActiveDate = new Date(currentSelectedDate);

  // 3. Routing Engine
  function navigateTo(targetView) {
    activeView = targetView;
    
    // Manage Sidebar State
    sideNavItems.forEach(item => {
      if (item.getAttribute("data-target") === targetView) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // Toggle View Components
    views.forEach(view => {
      if (view.id === `${targetView}-view`) {
        view.classList.add("active-view");
      } else {
        view.classList.remove("active-view");
      }
    });

    // Trigger View-specific Renderings
    if (targetView === "dashboard") {
      renderDashboard();
    } else if (targetView === "tracker") {
      renderDailyTracker();
      renderCalendar();
    } else if (targetView === "syllabus") {
      renderSyllabus("gs1");
    } else if (targetView === "overlap") {
      renderPhaseTimeline();
    } else if (targetView === "analytics") {
      renderAnalytics();
    } else if (targetView === "answers") {
      renderAnswersView();
    }
  }

  // Bind Sidebar Navigation Click Events
  sideNavItems.forEach(item => {
    item.addEventListener("click", () => {
      const target = item.getAttribute("data-target");
      navigateTo(target);
    });
  });

  // Hash change routing
  window.addEventListener("hashchange", () => {
    const hash = window.location.hash.substring(1);
    if (hash && ["dashboard", "tracker", "syllabus", "overlap", "analytics", "strategy", "answers"].includes(hash)) {
      navigateTo(hash);
    }
  });

  // 4. Dashboard Renderer
  function renderDashboard() {
    appState = window.StorageManager.loadState();
    const stats = window.StorageManager.getStats(appState);
    
    // Update Stats Numerics
    dashPercentage.innerText = `${Math.round(stats.totalProgress)}%`;
    dashAwPercentage.innerText = `${Math.round(stats.answerProgress)}%`;
    dashPctRing.innerHTML = `${Math.round(stats.totalProgress)}%<span>Completed</span>`;
    dashTasksCompleted.innerText = stats.completedTasks;
    dashTasksTotal.innerText = stats.totalTasks;
    dashAnswersCompleted.innerText = stats.completedAnswers;
    dashAnswersTotal.innerText = stats.totalAnswers;
    streakNumDisplay.innerText = stats.streak;

    // SVG Circular stroke calculation (Circumference is 440)
    const strokeOffset = 440 - (440 * stats.totalProgress) / 100;
    dashCircularOffset.style.strokeDashoffset = strokeOffset;

    // Get today's object from schedule
    const todayStr = window.getLocalDateString();
    let todayObj = appState.days.find(d => d.date === todayStr);
    
    // Fallback to day 1 if schedule dates don't match local dates
    if (!todayObj) {
      todayObj = appState.days[0];
    }
    
    // Bind Daily Quote & Ethics/Essay Example
    const quoteTitle = document.getElementById("dash-quote-title");
    const quoteText = document.getElementById("dash-quote-text");
    const quoteExample = document.getElementById("dash-quote-example");
    
    if (quoteTitle && quoteText && quoteExample && window.DailyQuotesData) {
      const quoteIndex = (todayObj.dayIndex - 1) % window.DailyQuotesData.length;
      const todayQuote = window.DailyQuotesData[quoteIndex];
      if (todayQuote) {
        quoteTitle.innerHTML = `<i class="fas fa-lightbulb"></i> Daily Spark & quote — By ${todayQuote.author}`;
        quoteText.innerText = `"${todayQuote.quote}"`;
        quoteExample.innerHTML = `<strong>Case Study / Quote Usage:</strong> ${todayQuote.example}`;
      }
    }
    
    dashActivePhase.innerText = todayObj.phaseName;
    dashPhaseDesc.innerText = todayObj.phaseDescription;
    
    // Populate Quick Daily Targets Checklists
    todayTasksList.innerHTML = "";
    if (todayObj.isBuffer) {
      todayTasksList.innerHTML = `<div class="task-item">
        <i class="fas fa-umbrella" style="color: var(--color-buffer); font-size: 1.5rem;"></i>
        <div class="task-content">
          <div class="task-title">Sunday Buffer Day active!</div>
          <div class="task-books">Use the main 'Daily Tracker' tab to catch up on backlogs, review week notes, and prepare for next week.</div>
        </div>
      </div>`;
    } else {
      todayObj.tasks.forEach(task => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "task-item";
        itemDiv.innerHTML = `
          <input type="checkbox" id="dash_chk_${task.id}" class="task-checkbox-input" ${task.completed ? 'checked' : ''}>
          <label for="dash_chk_${task.id}" class="custom-checkbox"><i class="fas fa-check"></i></label>
          <div class="task-content">
            <div class="task-meta">
              <span class="task-category-tag tag-${task.category.toLowerCase().replace(/\s+/g, '-')}">${task.category}</span>
              ${task.priority ? `<span class="priority-badge priority-${task.priority.toLowerCase()}" style="font-size: 0.65rem; padding: 0.15rem 0.4rem; font-weight: 700; margin-left: 0.35rem; display: inline-flex; align-items: center; gap: 0.2rem;"><i class="fas fa-circle-exclamation"></i> PYQ ${task.priority}</span>` : ''}
              <span class="task-duration"><i class="far fa-clock"></i> ${task.duration}</span>
            </div>
            <div class="task-title">${task.text}</div>
          </div>
        `;
        
        // Add toggle checkbox event listener
        const checkbox = itemDiv.querySelector(".task-checkbox-input");
        checkbox.addEventListener("change", (e) => {
          appState = window.StorageManager.toggleTask(todayObj.dayIndex, task.id, e.target.checked);
          renderDashboard(); // re-render to update percentages
        });
        
        todayTasksList.appendChild(itemDiv);
      });
    }

    // Populate Daily PYQs on Dashboard
    const dashPyqsList = document.getElementById("dashboard-pyqs-list");
    if (dashPyqsList) {
      dashPyqsList.innerHTML = "";
      if (todayObj.isBuffer) {
        dashPyqsList.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 1.5rem;">
          <i class="fas fa-coffee" style="font-size: 2.5rem; margin-bottom: 0.5rem; color: var(--color-buffer);"></i>
          <p style="font-size: 0.9rem;">Sunday Buffer Day! No new answer-writing questions scheduled.</p>
        </div>`;
      } else if (todayObj.answers && todayObj.answers.length > 0) {
        todayObj.answers.forEach(ans => {
          const qCard = document.createElement("div");
          qCard.className = "task-item";
          qCard.style.padding = "0.75rem 1rem";
          qCard.style.borderRadius = "8px";
          qCard.style.backgroundColor = "rgba(255, 255, 255, 0.02)";
          qCard.style.border = "1px solid var(--border-color)";
          qCard.style.display = "flex";
          qCard.style.flexDirection = "column";
          qCard.style.gap = "0.35rem";
          qCard.style.cursor = "pointer";
          
          // Switch to tracker tab when question is clicked
          qCard.addEventListener("click", () => {
            currentSelectedDate = todayObj.date;
            navigateTo("tracker");
            // Scroll to the specific question element
            setTimeout(() => {
              const qEl = document.getElementById("text_" + ans.id);
              if (qEl) qEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
          });
          
          let starsHTML = "";
          if (ans.completed) {
            starsHTML = `<span style="font-size: 0.75rem; color: var(--accent-amber); font-weight: 700;"><i class="fas fa-star"></i> Rated: ${ans.rating}/5</span>`;
          } else {
            starsHTML = `<span style="font-size: 0.75rem; color: var(--text-muted);"><i class="far fa-edit"></i> Not written yet</span>`;
          }
          
          qCard.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
              <span class="task-category-tag tag-${ans.category.toLowerCase().replace(/\s+/g, '-')}">${ans.category}</span>
              ${starsHTML}
            </div>
            <div style="font-size: 0.9rem; line-height: 1.4; color: var(--text-primary); font-weight: 500;">${ans.question}</div>
          `;
          dashPyqsList.appendChild(qCard);
        });
      } else {
        dashPyqsList.innerHTML = `<p style="color: var(--text-secondary); text-align: center; font-size: 0.9rem;">No questions scheduled for today.</p>`;
      }
    }
    // Render Gamification Badges
    renderBadges(stats);
  }

  // --- Gamification Badges Logic ---
  function renderBadges(stats) {
    const container = document.getElementById("badges-container");
    if (!container) return;
    
    container.innerHTML = ""; // Clear existing

    // Define the milestone badges
    const badges = [
      {
        id: "first_step",
        icon: "fa-shoe-prints",
        name: "First Step",
        desc: "Complete your first task",
        isUnlocked: stats.completedTasks >= 1
      },
      {
        id: "consistent",
        icon: "fa-fire",
        name: "Consistent",
        desc: "Reach a 7-day streak",
        isUnlocked: stats.streak >= 7
      },
      {
        id: "scholar",
        icon: "fa-book-open",
        name: "Scholar",
        desc: "Complete 100 tasks",
        isUnlocked: stats.completedTasks >= 100
      },
      {
        id: "scribe",
        icon: "fa-feather-alt",
        name: "Scribe",
        desc: "Write 20 answers",
        isUnlocked: stats.completedAnswers >= 20
      },
      {
        id: "half_way",
        icon: "fa-mountain",
        name: "Halfway There",
        desc: "Reach 50% overall completion",
        isUnlocked: stats.totalProgress >= 50
      }
    ];

    badges.forEach(badge => {
      const badgeDiv = document.createElement("div");
      badgeDiv.className = `badge-item ${badge.isUnlocked ? "unlocked" : "locked"}`;
      badgeDiv.title = badge.desc;
      
      badgeDiv.innerHTML = `
        <div class="badge-icon"><i class="fas ${badge.icon}"></i></div>
        <div class="badge-name">${badge.name}</div>
      `;
      container.appendChild(badgeDiv);
    });
  }

  // 5. Daily Tracker Renderer
  function renderDailyTracker() {
    appState = window.StorageManager.loadState();
    const dayObj = appState.days.find(d => d.date === currentSelectedDate);
    if (!dayObj) return;

    // Header updates
    trackerDateLabel.innerText = new Date(dayObj.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    trackerDayIndexLabel.innerText = `Day ${dayObj.dayIndex}`;
    trackerPhaseLabel.innerText = dayObj.phaseName;

    // Screen Time binding
    const screenTimeInput = document.getElementById("daily-screen-time");
    if (screenTimeInput) {
      const newScreenTimeInput = screenTimeInput.cloneNode(true);
      screenTimeInput.parentNode.replaceChild(newScreenTimeInput, screenTimeInput);
      newScreenTimeInput.value = dayObj.screenTime !== undefined ? dayObj.screenTime : "";
      newScreenTimeInput.addEventListener("change", (e) => {
        let val = parseFloat(e.target.value);
        if (isNaN(val) || val < 0) val = 0;
        appState = window.StorageManager.saveScreenTime(dayObj.dayIndex, val);
      });
    }

    // Add Sunday styling
    if (dayObj.isBuffer) {
      trackerDayCard.classList.add("is-sunday");
    } else {
      trackerDayCard.classList.remove("is-sunday");
    }

    // Populate Tasks Checklist
    dailyTasksChecklist.innerHTML = "";
    dayObj.tasks.forEach(task => {
      const taskDiv = document.createElement("div");
      taskDiv.className = "task-item";
      
      let noteValue = task.note || "";
      
      // Render micro-topics if they exist
      let microTopicsHTML = "";
      if (task.micro_topics && task.micro_topics.length > 0) {
        const completedCount = task.completed_micro_topics ? task.completed_micro_topics.length : 0;
        microTopicsHTML = `
          <div class="micro-topics-section" style="margin-top: 0.75rem; padding-left: 0.75rem; border-left: 2px solid rgba(255,255,255,0.15); width: 100%;">
            <div class="micro-topics-toggle" style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); margin-bottom: 0.5rem; cursor: pointer; display: flex; align-items: center; gap: 0.35rem; user-select: none;">
              <i class="fas fa-chevron-down" style="font-size: 0.7rem;"></i> Micro Targets (${completedCount}/${task.micro_topics.length})
            </div>
            <div class="micro-topics-list" style="display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 0.5rem;">
              ${task.micro_topics.map((mt, idx) => {
                const mtChecked = task.completed_micro_topics && task.completed_micro_topics.includes(mt);
                const mtId = `mt_${task.id}_${idx}`;
                return `
                  <div class="micro-topic-item" style="display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.8rem; color: ${mtChecked ? 'var(--text-muted)' : 'var(--text-secondary)'}; text-decoration: ${mtChecked ? 'line-through' : 'none'};">
                    <input type="checkbox" id="${mtId}" data-mt="${mt.replace(/"/g, '&quot;')}" class="micro-topic-checkbox-input" ${mtChecked ? 'checked' : ''} style="margin-top: 0.15rem; cursor: pointer; accent-color: var(--color-primary);">
                    <label for="${mtId}" style="cursor: pointer; line-height: 1.3; user-select: none;">${mt}</label>
                  </div>
                `;
              }).join("")}
            </div>
          </div>
        `;
      }

      taskDiv.innerHTML = `
        <input type="checkbox" id="track_chk_${task.id}" class="task-checkbox-input" ${task.completed ? 'checked' : ''}>
        <label for="track_chk_${task.id}" class="custom-checkbox"><i class="fas fa-check"></i></label>
        <div class="task-content" style="width: 100%;">
          <div class="task-meta">
            <span class="task-category-tag tag-${task.category.toLowerCase().replace(/\s+/g, '-')}">${task.category}</span>
            ${task.priority ? `<span class="priority-badge priority-${task.priority.toLowerCase()}" style="font-size: 0.65rem; padding: 0.15rem 0.4rem; font-weight: 700; margin-left: 0.35rem; display: inline-flex; align-items: center; gap: 0.2rem;"><i class="fas fa-circle-exclamation"></i> PYQ ${task.priority}</span>` : ''}
            <span class="task-duration"><i class="far fa-clock"></i> ${task.duration}</span>
          </div>
          <div class="task-title">${task.text}</div>
          ${task.books ? `<div class="task-books"><i class="fas fa-book"></i> Source: ${task.books}</div>` : ''}
          
          ${microTopicsHTML}

          <div style="margin-top: 0.75rem; width: 100%;">
            <input type="text" class="task-note-input" placeholder="Add study notes/pages read..." value="${noteValue}" 
              style="width: 100%; padding: 0.4rem 0.75rem; border-radius: 6px; border: 1px solid var(--border-color); background-color: rgba(0,0,0,0.15); color: var(--text-primary); font-size: 0.85rem; outline: none;">
          </div>
        </div>
      `;

      // Checkbox Listener
      const checkbox = taskDiv.querySelector(".task-checkbox-input");
      checkbox.addEventListener("change", (e) => {
        appState = window.StorageManager.toggleTask(dayObj.dayIndex, task.id, e.target.checked);
        renderDailyTracker();
        renderCalendar();
      });

      // Micro-topic checkboxes listener
      const mtCheckboxes = taskDiv.querySelectorAll(".micro-topic-checkbox-input");
      mtCheckboxes.forEach(mtCheckbox => {
        mtCheckbox.addEventListener("change", (e) => {
          const mtText = e.target.getAttribute("data-mt");
          appState = window.StorageManager.toggleMicroTopic(dayObj.dayIndex, task.id, mtText, e.target.checked);
          renderDailyTracker();
          renderCalendar();
        });
      });

      // Micro-topic toggle expand/collapse
      const toggleHeader = taskDiv.querySelector(".micro-topics-toggle");
      if (toggleHeader) {
        toggleHeader.addEventListener("click", () => {
          const list = taskDiv.querySelector(".micro-topics-list");
          const icon = toggleHeader.querySelector("i");
          if (list.style.display === "none") {
            list.style.display = "flex";
            icon.className = "fas fa-chevron-down";
          } else {
            list.style.display = "none";
            icon.className = "fas fa-chevron-right";
          }
        });
      }

      // Notes Input Listener (save on blur)
      const noteInput = taskDiv.querySelector(".task-note-input");
      noteInput.addEventListener("blur", (e) => {
        appState = window.StorageManager.saveTaskNote(dayObj.dayIndex, task.id, e.target.value);
      });

      dailyTasksChecklist.appendChild(taskDiv);
    });

    if (dayObj.tasks.length === 0) {
      dailyTasksChecklist.innerHTML = `<p style="color: var(--text-secondary); text-align: center;">No targets scheduled for today.</p>`;
    }

    // Populate Daily Answer Writing
    dailyAnswersList.innerHTML = "";
    if (dayObj.isBuffer) {
      dailyAnswersList.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 2rem;">
        <i class="fas fa-book-open" style="font-size: 3rem; margin-bottom: 1rem; color: var(--color-buffer);"></i>
        <p>Sundays are answer-writing rest days! Focus on reviewing previous answers and matching with topper copies.</p>
      </div>`;
    } else {
      if (dayObj.answers.length > 0) {
        // Since we migrated to a separate Answer Writing view, just show a link
        dailyAnswersList.innerHTML = `
          <div style="text-align: center; padding: 1.5rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: 8px;">
            <p style="margin-bottom: 1rem; font-size: 0.95rem;">You have <strong>${dayObj.answers.length}</strong> questions scheduled for today.</p>
            <button class="timer-btn" onclick="document.querySelector('.nav-item[data-target=\\'answers\\']').click()" style="padding: 0.75rem 1.5rem; font-weight: 600;">
              <i class="fas fa-external-link-alt"></i> Go to Answer Writing Vault
            </button>
          </div>
        `;
      } else {
        dailyAnswersList.innerHTML = `<p style="color: var(--text-secondary); text-align: center;">No written answers required today. Focused on Prelims mocks!</p>`;
      }
    }
  }

  // 6. Interactive Calendar Widget Renderer
  function renderCalendar() {
    calendarDaysContainer.innerHTML = "";
    
    const year = calendarActiveDate.getFullYear();
    const month = calendarActiveDate.getMonth();
    
    // Set Month-Year Label (e.g. "June 2026")
    calMonthYearLabel.innerText = calendarActiveDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    
    // First day of month
    const firstDay = new Date(year, month, 1);
    const firstDayIndex = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Total days in month
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    // Fill empty offset boxes
    const gridOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1; // Align to Mon starting grid
    for (let i = 0; i < gridOffset; i++) {
      const emptyDiv = document.createElement("div");
      calendarDaysContainer.appendChild(emptyDiv);
    }
    
    // Populate month days
    for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
      const thisDate = new Date(year, month, dayNum);
      const dateString = window.getLocalDateString(thisDate);
      
      const dayDiv = document.createElement("div");
      dayDiv.className = "calendar-day";
      dayDiv.innerText = dayNum;
      
      // Highlight Sunday buffer day
      if (thisDate.getDay() === 0) {
        dayDiv.classList.add("buffer-day");
      }
      
      // Match active date selection
      if (dateString === currentSelectedDate) {
        dayDiv.classList.add("active-day");
      }

      // Check if date falls inside the schedule
      const dayObj = appState.days.find(d => d.date === dateString);
      if (dayObj) {
        // Evaluate completion status for this day
        const allTasksDone = dayObj.tasks.every(t => t.completed);
        const hasTask = dayObj.tasks.length > 0;
        const answersDone = dayObj.answers.length > 0 ? dayObj.answers.every(a => a.completed) : true;
        
        if (hasTask && allTasksDone && answersDone) {
          dayDiv.classList.add("completed-day");
        }
        
        // Add click listener
        dayDiv.addEventListener("click", () => {
          currentSelectedDate = dateString;
          renderDailyTracker();
          // Update active day highlights in the calendar UI
          document.querySelectorAll(".calendar-day").forEach(d => d.classList.remove("active-day"));
          dayDiv.classList.add("active-day");
        });
      } else {
        // Date outside study range
        dayDiv.style.opacity = "0.2";
        dayDiv.style.pointerEvents = "none";
      }
      
      calendarDaysContainer.appendChild(dayDiv);
    }
  }

  // Bind Calendar Navigation Controls
  prevMonthBtn.addEventListener("click", () => {
    calendarActiveDate.setMonth(calendarActiveDate.getMonth() - 1);
    renderCalendar();
  });
  nextMonthBtn.addEventListener("click", () => {
    calendarActiveDate.setMonth(calendarActiveDate.getMonth() + 1);
    renderCalendar();
  });

  // 7. Study Timer Engine
  timerToggleBtn.addEventListener("click", () => {
    if (timerRunning) {
      clearInterval(timerInterval);
      timerToggleBtn.innerText = "Start";
      timerToggleBtn.classList.remove("btn-active");
      timerRunning = false;
    } else {
      timerRunning = true;
      timerToggleBtn.innerText = "Pause";
      timerToggleBtn.classList.add("btn-active");
      
      timerInterval = setInterval(() => {
        timerSeconds++;
        const hrs = Math.floor(timerSeconds / 3600);
        const mins = Math.floor((timerSeconds % 3600) / 60);
        const secs = timerSeconds % 60;
        
        const pad = (n) => n.toString().padStart(2, "0");
        timerDisplay.innerText = `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
      }, 1000);
    }
  });

  timerResetBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    timerSeconds = 0;
    timerRunning = false;
    timerToggleBtn.innerText = "Start";
    timerToggleBtn.classList.remove("btn-active");
    timerDisplay.innerText = "00:00:00";
  });

  // 8. Syllabus Explorer Renderer
  function renderSyllabus(paperKey) {
    syllabusGrid.innerHTML = "";
    
    // Draw active tab highlight
    const tabWrapper = document.getElementById("syllabus-tabs-wrapper");
    tabWrapper.querySelectorAll(".syllabus-tab-btn").forEach(btn => {
      if (btn.getAttribute("data-paper") === paperKey) {
        btn.classList.add("active-tab");
      } else {
        btn.classList.remove("active-tab");
      }
    });

    const paper = SyllabusData[paperKey];
    if (!paper) return;

    paper.topics.forEach(topic => {
      const row = document.createElement("div");
      row.className = "syllabus-topic-row";
      
      // Determine completion status
      // We will count how many times this topic was assigned and completed in appState
      let timesAssigned = 0;
      let timesCompleted = 0;
      
      appState.days.forEach(day => {
        day.tasks.forEach(task => {
          if (task.id.includes(topic.id)) {
            timesAssigned++;
            if (task.completed) timesCompleted++;
          }
        });
      });

      const percentage = timesAssigned > 0 ? Math.round((timesCompleted / timesAssigned) * 100) : 0;
      const statusText = timesAssigned === 0 ? "Not Started" : percentage === 100 ? "Completed & Revised" : percentage > 0 ? "In Progress" : "Not Started";
      const statusClass = timesAssigned === 0 ? "priority-low" : percentage === 100 ? "priority-low" : "priority-medium";

      const priority = topic.priority || "Medium";
      const details = topic.details || (topic.micro_topics ? topic.micro_topics.slice(0, 5).join(", ") + "..." : "");

      row.innerHTML = `
        <div style="font-weight:600; color:var(--text-primary);">${topic.title}</div>
        <div style="font-size:0.85rem; color:var(--text-secondary); line-height:1.4;">${details}</div>
        <div><span class="priority-badge priority-${priority.toLowerCase()}">${priority}</span></div>
        <div>
          <span style="font-size:0.85rem; font-weight:600;">${percentage}%</span>
          <div style="font-size:0.7rem; color:var(--text-muted);">${statusText}</div>
        </div>
      `;
      syllabusGrid.appendChild(row);
    });
  }

  // Bind Syllabus Tab Buttons
  document.querySelectorAll(".syllabus-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const paper = btn.getAttribute("data-paper");
      renderSyllabus(paper);
    });
  });

  // 9. Timeline & Phase Overlap Renderer
  function renderPhaseTimeline() {
    appState = window.StorageManager.loadState();
    const stats = window.StorageManager.getStats(appState);
    
    // Update percentages for the 5 phases
    for (let phaseNum = 1; phaseNum <= 5; phaseNum++) {
      const progressFill = document.getElementById(`phase-progress-fill-${phaseNum}`);
      const progressLabel = document.getElementById(`phase-progress-pct-${phaseNum}`);
      
      if (progressFill && progressLabel) {
        const pStat = stats.phaseStats[phaseNum];
        const pct = pStat.total > 0 ? Math.round((pStat.completed / pStat.total) * 100) : 0;
        progressFill.style.width = `${pct}%`;
        progressLabel.innerText = `${pct}%`;
      }
    }

    // Set Active State Highlights
    // Find current active phase based on today's date
    const todayStr = window.getLocalDateString();
    const todayObj = appState.days.find(d => d.date === todayStr) || appState.days[0];
    
    timelineNodes.forEach(node => {
      const nodePhase = parseInt(node.getAttribute("data-phase"));
      if (nodePhase === todayObj.phaseNum) {
        node.classList.add("active-node");
      } else {
        node.classList.remove("active-node");
      }
    });
  }

  // 10. Analytics Dashboard Renderer
  function renderAnalytics() {
    appState = window.StorageManager.loadState();
    const stats = window.StorageManager.getStats(appState);

    // ── STREAK CALCULATIONS ──
    const today = window.getLocalDateString();
    let currentStreak = 0, longestStreak = 0, tempStreak = 0;
    const sortedDays = [...appState.days].filter(d => !d.isBuffer && d.tasks.length > 0).sort((a,b) => a.date.localeCompare(b.date));
    
    sortedDays.forEach(d => {
      const hasAnyDone = d.tasks.some(t => t.completed);
      if (hasAnyDone) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    });
    // Current streak: count back from today
    const reverseDays = [...sortedDays].reverse();
    for (const d of reverseDays) {
      if (d.date > today) continue;
      if (d.tasks.some(t => t.completed)) currentStreak++;
      else break;
    }
    const kpiStreakEl = document.getElementById('kpi-streak');
    const kpiLongestStreakEl = document.getElementById('kpi-longest-streak');
    if (kpiStreakEl) kpiStreakEl.innerText = currentStreak;
    if (kpiLongestStreakEl) kpiLongestStreakEl.innerText = longestStreak;

    // ── 30-DAY VELOCITY ──
    let velocityTotalTasks = 0, velocityDoneTasks = 0;
    const thirtyDaysAgo = new Date(today); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];
    appState.days.forEach(d => {
      if (d.date >= thirtyDaysAgoStr && d.date <= today && !d.isBuffer) {
        velocityTotalTasks += d.tasks.length;
        velocityDoneTasks += d.tasks.filter(t => t.completed).length;
      }
    });
    const kpi30El = document.getElementById('kpi-30day-velocity');
    if (kpi30El) kpi30El.innerText = velocityTotalTasks > 0 ? Math.round((velocityDoneTasks / velocityTotalTasks) * 100) + "%" : "-";

    // ── AVG RATING + GS vs PSIR RATINGS + ANSWERS WRITTEN ──
    let totalRating = 0, ratedCount = 0, answersWritten = 0;
    let gsRatingSum = 0, gsRatingCount = 0, psirRatingSum = 0, psirRatingCount = 0;
    appState.days.forEach(d => {
      d.answers.forEach(a => {
        if (a.completed) answersWritten++;
        if (a.completed && a.rating > 0) {
          totalRating += a.rating; ratedCount++;
          if (a.category === 'GS Static') { gsRatingSum += a.rating; gsRatingCount++; }
          if (a.category === 'PSIR Optional') { psirRatingSum += a.rating; psirRatingCount++; }
        }
      });
    });
    const kpiAvgRatingEl = document.getElementById('kpi-avg-rating');
    if (kpiAvgRatingEl) kpiAvgRatingEl.innerText = ratedCount > 0 ? (totalRating / ratedCount).toFixed(1) + "★" : "-";
    const kpiAWEl = document.getElementById('kpi-answers-written');
    if (kpiAWEl) kpiAWEl.innerText = answersWritten;

    // GS vs PSIR bar chart
    const gsPsirCanvas = document.getElementById('gs-psir-canvas');
    window.CanvasCharts.drawGsvsPSIRRatings(gsPsirCanvas, {
      gs: gsRatingCount > 0 ? gsRatingSum / gsRatingCount : 0,
      psir: psirRatingCount > 0 ? psirRatingSum / psirRatingCount : 0
    });

    // ── DAYS STUDIED ──
    const studiedDays = sortedDays.filter(d => d.date <= today && d.tasks.some(t => t.completed)).length;
    const totalStudyDays = sortedDays.filter(d => d.date <= today).length;
    const kpiDaysEl = document.getElementById('kpi-days-studied');
    const kpiDaysSubEl = document.getElementById('kpi-days-studied-sub');
    if (kpiDaysEl) kpiDaysEl.innerText = studiedDays;
    if (kpiDaysSubEl) kpiDaysSubEl.innerText = `of ${totalStudyDays} elapsed days`;

    // ── STRONGEST / WEAKEST SUBJECT ──
    let bestSubject = "-", worstSubject = "-", highestRate = -1, lowestRate = 101;
    const categoryProficiency = {};
    Object.keys(stats.categoryStats).forEach(cat => {
      const cStat = stats.categoryStats[cat];
      if (cStat.total > 0) {
        const rate = (cStat.completed / cStat.total) * 100;
        categoryProficiency[cat] = { rate };
        if (rate > highestRate) { highestRate = rate; bestSubject = cat; }
        if (rate < lowestRate) { lowestRate = rate; worstSubject = cat; }
      }
    });
    const kpiStrongEl = document.getElementById('kpi-strongest-subject');
    const kpiWeakEl = document.getElementById('kpi-weakest-subject');
    if (kpiStrongEl) kpiStrongEl.innerText = bestSubject;
    if (kpiWeakEl) kpiWeakEl.innerText = worstSubject;

    // ── PHASE PROGRESS BARS ──
    const phases = [
      { num: 1, label: "Phase 1 — Foundation", start: "2026-06-12", end: "2026-09-15", color: "#38bdf8" },
      { num: 2, label: "Phase 2 — Intermediate", start: "2026-09-16", end: "2027-01-15", color: "#a78bfa" },
      { num: 3, label: "Phase 3 — Intensive", start: "2027-01-16", end: "2027-04-15", color: "#f59e0b" },
      { num: 4, label: "Phase 4 — Final Stretch", start: "2027-04-16", end: "2027-05-20", color: "#34d399" },
    ];
    const phaseBarsEl = document.getElementById('phase-progress-bars');
    if (phaseBarsEl) {
      phaseBarsEl.innerHTML = phases.map(ph => {
        const phaseDays = appState.days.filter(d => !d.isBuffer && d.date >= ph.start && d.date <= ph.end);
        const totalTasks = phaseDays.reduce((s, d) => s + d.tasks.length, 0);
        const doneTasks = phaseDays.reduce((s, d) => s + d.tasks.filter(t => t.completed).length, 0);
        const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
        const daysTotal = phaseDays.length;
        const daysLeft = phaseDays.filter(d => d.date > today).length;
        const isActive = today >= ph.start && today <= ph.end;
        const isDone = today > ph.end;
        const badge = isDone ? `<span style="background:${ph.color}22;color:${ph.color};font-size:0.65rem;padding:2px 7px;border-radius:10px;font-weight:700;">DONE</span>` 
                   : isActive ? `<span style="background:#f59e0b22;color:#f59e0b;font-size:0.65rem;padding:2px 7px;border-radius:10px;font-weight:700;">ACTIVE · ${daysLeft}d left</span>` 
                   : `<span style="background:#ffffff11;color:#8b949e;font-size:0.65rem;padding:2px 7px;border-radius:10px;">Upcoming</span>`;
        return `<div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;">
            <span style="font-size:0.82rem;font-weight:600;color:var(--text-secondary);">${ph.label} ${badge}</span>
            <span style="font-size:0.8rem;font-weight:700;color:${ph.color};">${pct}% &nbsp;<span style="color:var(--text-muted);font-weight:400;">${doneTasks}/${totalTasks} tasks</span></span>
          </div>
          <div style="background:rgba(255,255,255,0.07);border-radius:6px;height:10px;overflow:hidden;">
            <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,${ph.color},${ph.color}99);border-radius:6px;transition:width 0.6s ease;"></div>
          </div>
        </div>`;
      }).join('');
    }

    // ── LAST 7 DAYS CHART ──
    const last7Days = [];
    const baseDate = new Date(today);
    for (let i = 6; i >= 0; i--) {
      const d = new Date(baseDate); d.setDate(baseDate.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayObj = appState.days.find(day => day.date === dateStr);
      const label = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      let pct = 0;
      if (dayObj) { const t = dayObj.tasks.length, done = dayObj.tasks.filter(t => t.completed).length; pct = t > 0 ? (done/t)*100 : 0; }
      last7Days.push({ dateLabel: label, percent: pct });
    }
    const weeklyCanvas = document.getElementById('weekly-canvas');
    window.CanvasCharts.drawWeeklyProgress(weeklyCanvas, last7Days);

    // ── CUMULATIVE CURVE ──
    const cumulativeCanvas = document.getElementById('cumulative-canvas');
    window.CanvasCharts.drawCumulativeProgress(cumulativeCanvas, appState.days);

    // ── WEEKLY ANSWER MOMENTUM (last 8 weeks) ──
    const momentumCanvas = document.getElementById('momentum-canvas');
    const weeklyAnswerData = [];
    for (let w = 7; w >= 0; w--) {
      const wStart = new Date(today); wStart.setDate(wStart.getDate() - w * 7 - 6);
      const wEnd = new Date(today); wEnd.setDate(wEnd.getDate() - w * 7);
      const wStartStr = wStart.toISOString().split('T')[0];
      const wEndStr = wEnd.toISOString().split('T')[0];
      let count = 0;
      appState.days.forEach(d => {
        if (d.date >= wStartStr && d.date <= wEndStr) {
          count += d.answers.filter(a => a.completed).length;
        }
      });
      weeklyAnswerData.push({ label: wEnd.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), count });
    }
    window.CanvasCharts.drawAnswerMomentum(momentumCanvas, weeklyAnswerData);

    // ── SUBJECT DISTRIBUTION PIE ──
    const distributionCounts = {
      "General Studies": stats.categoryStats["General Studies"] || { completed: 0 },
      "PSIR Optional": stats.categoryStats["PSIR Optional"] || { completed: 0 },
      "Current Affairs": stats.categoryStats["Current Affairs"] || { completed: 0 },
      "CSAT": stats.categoryStats["CSAT"] || { completed: 0 },
      "Essay": stats.categoryStats["Essay"] || { completed: 0 }
    };
    const pieCanvas = document.getElementById('pie-canvas');
    window.CanvasCharts.drawSubjectDistribution(pieCanvas, distributionCounts);

    // ── ANSWER QUALITY TREND ──
    const ratedAnswers = [];
    appState.days.forEach(d => {
      d.answers.forEach(a => {
        if (a.completed && a.rating > 0) {
          ratedAnswers.push({ label: new Date(d.date).toLocaleDateString('en-IN', {day:'numeric', month:'short'}), rating: a.rating, fullDate: d.date });
        }
      });
    });
    ratedAnswers.sort((a,b) => new Date(a.fullDate) - new Date(b.fullDate));
    const qualityTrendCanvas = document.getElementById('quality-trend-canvas');
    if (qualityTrendCanvas) window.CanvasCharts.drawAnswerQualityLineChart(qualityTrendCanvas, ratedAnswers.slice(-14));

    // ── SUBJECT PROFICIENCY BAR ──
    const proficiencyCanvas = document.getElementById('proficiency-canvas');
    if (proficiencyCanvas) window.CanvasCharts.drawProficiencyBarChart(proficiencyCanvas, categoryProficiency);

    // ── CONSISTENCY HEATMAP ──
    const heatmapCanvas = document.getElementById('heatmap-canvas');
    window.CanvasCharts.drawConsistencyHeatmap(heatmapCanvas, appState.days);

    // ── SUBJECT MASTERY TABLE ──
    const masteryTableEl = document.getElementById('subject-mastery-table');
    if (masteryTableEl) {
      const rows = Object.keys(stats.categoryStats).map(cat => {
        const c = stats.categoryStats[cat];
        const pct = c.total > 0 ? Math.round((c.completed / c.total) * 100) : 0;
        const barColor = pct >= 80 ? '#34d399' : pct >= 50 ? '#f59e0b' : '#f87171';
        return `<tr>
          <td style="padding:8px 12px;font-size:0.83rem;font-weight:600;color:var(--text-secondary);white-space:nowrap;">${cat}</td>
          <td style="padding:8px 12px;font-size:0.83rem;color:var(--text-muted);">${c.completed}/${c.total}</td>
          <td style="padding:8px 12px;min-width:120px;">
            <div style="background:rgba(255,255,255,0.07);border-radius:4px;height:7px;">
              <div style="height:100%;width:${pct}%;background:${barColor};border-radius:4px;"></div>
            </div>
          </td>
          <td style="padding:8px 12px;font-size:0.83rem;font-weight:700;color:${barColor};">${pct}%</td>
        </tr>`;
      }).join('');
      masteryTableEl.innerHTML = `<table style="width:100%;border-collapse:collapse;">
        <thead><tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
          <th style="padding:6px 12px;text-align:left;font-size:0.72rem;color:var(--text-muted);text-transform:uppercase;font-weight:600;">Subject</th>
          <th style="padding:6px 12px;text-align:left;font-size:0.72rem;color:var(--text-muted);text-transform:uppercase;font-weight:600;">Done/Total</th>
          <th style="padding:6px 12px;text-align:left;font-size:0.72rem;color:var(--text-muted);text-transform:uppercase;font-weight:600;">Progress</th>
          <th style="padding:6px 12px;text-align:left;font-size:0.72rem;color:var(--text-muted);text-transform:uppercase;font-weight:600;">Rate</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
    }
  }

  // 11. AI Evaluator Logic
  function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async function evaluateAnswerWithAI(answerObj, awDiv) {
    const apiKey = window.StorageManager.getApiKey();
    if (!apiKey) {
      alert("Please enter and save your Gemini API Key in the top right of the Vault first.");
      return;
    }
    
    const btn = awDiv.querySelector(".ai-evaluate-btn");
    const remarksBox = awDiv.querySelector(".ai-remarks-content");
    const container = awDiv.querySelector(".ai-remarks-container");
    
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Analyzing...`;
    btn.disabled = true;
    container.style.display = "block";
    remarksBox.innerHTML = "<p style='color: var(--text-muted); font-size: 0.85rem;'>AI is analyzing your answer based on UPSC parameters...</p>";
    
    try {
      const textVal = awDiv.querySelector(".aw-textarea").value;
      let promptParts = [
        { text: `You are an expert UPSC CSE evaluator. Evaluate the following answer for this question: "${answerObj.question}"\n\nSubject Category: ${answerObj.category}\n\nPlease evaluate based on standard UPSC parameters: 1. Structure (Intro, Body, Conclusion) 2. Dimensions/Content 3. Presentation. Provide strengths, weaknesses, and a suggested mark out of 10 or 15 (assume 10 marks if less than 150 words, 15 if more). Be constructive but strict. Format using markdown.\n\n` }
      ];
      
      if (textVal && textVal.trim().length > 0) {
        promptParts.push({ text: `Student's Text Answer:\n${textVal}` });
      }
      
      if (answerObj.hasFile) {
        const fileBlob = await window.AnswerFileDB.getFile(answerObj.id);
        if (fileBlob && fileBlob.type.startsWith("image/")) {
          const b64 = await blobToBase64(fileBlob);
          promptParts.push({
            inlineData: {
              mimeType: fileBlob.type,
              data: b64
            }
          });
          promptParts.push({ text: "\n(Student's handwritten answer image is attached above)" });
        }
      }
      
      if (promptParts.length === 1) {
        throw new Error("No text or image provided to evaluate. Please write or upload an answer first.");
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: promptParts }] })
      });
      
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message || "API Error");
      }
      
      const aiText = data.candidates[0].content.parts[0].text;
      
      // Save it
      appState = window.StorageManager.saveAnswer(answerObj.dayIndex, answerObj.id, undefined, undefined, undefined, undefined, aiText);
      
      // Render it
      remarksBox.innerHTML = `<div style="white-space: pre-wrap; font-size: 0.85rem; line-height: 1.6; color: var(--text-secondary);">${aiText.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>`;
      
    } catch(err) {
      console.error(err);
      remarksBox.innerHTML = `<p style="color: rgb(239, 68, 68); font-size: 0.85rem;"><i class="fas fa-exclamation-circle"></i> ${err.message}</p>`;
    } finally {
      btn.innerHTML = `<i class="fas fa-robot"></i> AI Evaluate`;
      btn.disabled = false;
    }
  }

  // 12. Answers Vault Renderer
  async function renderAnswersView() {
    if (!answersVaultList) return;
    answersVaultList.innerHTML = "";

    // Update active tab styling
    awTabToday.classList.toggle("active-tab", currentAnswersTab === "today");
    awTabPast.classList.toggle("active-tab", currentAnswersTab === "past");

    appState = window.StorageManager.loadState();
    
    let answersToShow = [];
    
    if (currentAnswersTab === "today") {
      const dayObj = appState.days.find(d => d.date === currentSelectedDate) || appState.days[0];
      if (dayObj && !dayObj.isBuffer) {
        answersToShow = dayObj.answers.map(a => ({...a, dayDate: dayObj.date, dayIndex: dayObj.dayIndex}));
      }
    } else {
      // Past: find all completed answers or answers with files
      appState.days.forEach(d => {
        if (!d.isBuffer) {
          d.answers.forEach(a => {
            if (a.completed || a.hasFile || (a.writtenAnswer && a.writtenAnswer.trim().length > 0)) {
              answersToShow.push({...a, dayDate: d.date, dayIndex: d.dayIndex});
            }
          });
        }
      });
      // Sort newest first
      answersToShow.sort((a, b) => new Date(b.dayDate) - new Date(a.dayDate));
    }
    
    if (answersToShow.length === 0) {
      answersVaultList.innerHTML = `<p style="color: var(--text-secondary); text-align: center;">No answers found for this section.</p>`;
      return;
    }
    
    for (const answer of answersToShow) {
      const awDiv = document.createElement("div");
      awDiv.className = "aw-question-card";
      
      let starsHTML = "";
      for (let i = 1; i <= 5; i++) {
        starsHTML += `<button type="button" class="star-btn ${i <= answer.rating ? 'active-star' : ''}" data-value="${i}"><i class="fas fa-star"></i></button>`;
      }
      
      // Determine Status
      const isCompleted = answer.completed;
      const statusClass = isCompleted ? "tag-psir" : "tag-buffer";
      const statusText = isCompleted ? "Completed" : "Pending";
      
      // File indicator
      let fileIndicatorHTML = "";
      if (answer.hasFile) {
        fileIndicatorHTML = `<div class="file-preview-indicator" id="file_indicator_${answer.id}" style="margin-top: 1rem; padding: 0.75rem; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.85rem; color: var(--color-psir); font-weight: 600;"><i class="fas fa-file-image"></i> Answer File Uploaded</span>
          <div style="display:flex; gap: 0.5rem;">
            <button class="timer-btn view-file-btn" data-id="${answer.id}" style="padding: 0.3rem 0.75rem; font-size: 0.75rem;">View</button>
            <button class="btn-danger delete-file-btn" data-id="${answer.id}" data-day="${answer.dayIndex}" style="padding: 0.3rem 0.75rem; font-size: 0.75rem;"><i class="fas fa-trash"></i></button>
          </div>
        </div>`;
      }
      
      awDiv.innerHTML = `
        <div class="aw-question-header">
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <span class="aw-question-category">${answer.category}</span>
            <span class="task-category-tag ${statusClass}" style="font-size: 0.6rem;">${statusText}</span>
            <span style="font-size: 0.75rem; color: var(--text-muted);">(${answer.dayDate})</span>
          </div>
          <div class="star-rating" id="stars_vault_${answer.id}" data-rating="${answer.rating}">
            ${starsHTML}
          </div>
        </div>
        <div class="aw-question-text">${answer.question}</div>
        
        <div style="display: flex; gap: 1rem; align-items: flex-start; flex-direction: column;">
          <textarea class="aw-textarea" id="text_vault_${answer.id}" placeholder="Type notes, outline, or full text here..." style="min-height: 80px; margin-bottom: 0;">${answer.writtenAnswer || ''}</textarea>
          
          <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; margin-top: 0.75rem;">
            <div style="display: flex; gap: 0.75rem; align-items: center;">
              <input type="file" id="file_upload_${answer.id}" accept="image/*,.pdf" style="display: none;">
              <button class="timer-btn upload-trigger-btn" data-id="${answer.id}" style="font-size: 0.8rem; background-color: rgba(14, 165, 233, 0.1); border-color: rgba(14, 165, 233, 0.3); color: var(--color-ca);">
                <i class="fas fa-upload"></i> Upload Photo/PDF
              </button>
              <button class="timer-btn ai-evaluate-btn" data-id="${answer.id}" style="font-size: 0.8rem; background-color: rgba(250, 204, 21, 0.1); border-color: rgba(250, 204, 21, 0.3); color: var(--accent-amber);">
                <i class="fas fa-robot"></i> AI Evaluate
              </button>
            </div>
            
            <div style="display: flex; gap: 0.75rem;">
              <button class="btn-secondary toggle-status-btn" data-id="${answer.id}" data-day="${answer.dayIndex}" data-completed="${isCompleted}" style="font-size: 0.8rem;">
                ${isCompleted ? '<i class="fas fa-times"></i> Mark Pending' : '<i class="fas fa-check"></i> Mark Complete'}
              </button>
              <button class="aw-save-btn" id="btn_save_vault_${answer.id}" style="font-size: 0.8rem;">Save Notes & Rating</button>
            </div>
          </div>
        </div>
        
        <!-- AI Remarks Box -->
        <div class="ai-remarks-container" style="margin-top: 1rem; border-top: 1px dashed var(--border-color); padding-top: 1rem; display: ${answer.aiRemarks ? 'block' : 'none'};">
          <h4 style="font-size: 0.85rem; color: var(--accent-cyan); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.4rem;"><i class="fas fa-robot"></i> UPSC AI Evaluator Remarks</h4>
          <div class="ai-remarks-content" style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color);">${answer.aiRemarks ? `<div style="white-space: pre-wrap; font-size: 0.85rem; line-height: 1.6; color: var(--text-secondary);">${answer.aiRemarks.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>` : ''}</div>
        </div>

        ${fileIndicatorHTML}
        <div class="file-view-container" id="file_view_container_${answer.id}" style="display: none; margin-top: 1rem; width: 100%;"></div>
      `;
      
      answersVaultList.appendChild(awDiv);

      // AI Evaluate Button
      const evaluateBtn = awDiv.querySelector(".ai-evaluate-btn");
      evaluateBtn.addEventListener("click", () => {
        evaluateAnswerWithAI(answer, awDiv);
      });
      
      // Star click listeners
      const stars = awDiv.querySelectorAll(".star-btn");
      stars.forEach(star => {
        star.addEventListener("click", () => {
          const val = parseInt(star.getAttribute("data-value"));
          stars.forEach(s => {
            const sVal = parseInt(s.getAttribute("data-value"));
            s.classList.toggle("active-star", sVal <= val);
          });
          awDiv.querySelector(".star-rating").setAttribute("data-rating", val);
        });
      });
      
      // Save Button
      const saveBtn = awDiv.querySelector(`#btn_save_vault_${answer.id}`);
      saveBtn.addEventListener("click", () => {
        const ratingVal = parseInt(awDiv.querySelector(".star-rating").getAttribute("data-rating")) || answer.rating;
        const textVal = awDiv.querySelector(".aw-textarea").value;
        appState = window.StorageManager.saveAnswer(answer.dayIndex, answer.id, textVal, ratingVal, undefined, undefined);
        saveBtn.innerText = "Saved ✓";
        setTimeout(() => saveBtn.innerText = "Save Notes & Rating", 1500);
      });
      
      // Toggle Status Button
      const statusBtn = awDiv.querySelector(".toggle-status-btn");
      statusBtn.addEventListener("click", () => {
        const currentlyCompleted = statusBtn.getAttribute("data-completed") === "true";
        appState = window.StorageManager.saveAnswer(answer.dayIndex, answer.id, undefined, undefined, !currentlyCompleted, undefined);
        renderAnswersView();
      });
      
      // Upload Button
      const uploadTrigger = awDiv.querySelector(".upload-trigger-btn");
      const fileInput = awDiv.querySelector(`#file_upload_${answer.id}`);
      uploadTrigger.addEventListener("click", () => fileInput.click());
      
      fileInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
          await window.AnswerFileDB.saveFile(answer.id, file);
          appState = window.StorageManager.saveAnswer(answer.dayIndex, answer.id, undefined, undefined, true, true);
          alert("File uploaded successfully!");
          renderAnswersView();
        } catch(err) {
          console.error(err);
          alert("Failed to save file locally. Storage might be full.");
        }
      });
      
      // View/Delete File Handlers
      if (answer.hasFile) {
        const viewBtn = awDiv.querySelector(".view-file-btn");
        const viewContainer = awDiv.querySelector(`#file_view_container_${answer.id}`);
        viewBtn.addEventListener("click", async () => {
          if (viewContainer.style.display === "block") {
            viewContainer.style.display = "none";
            viewBtn.innerText = "View";
            return;
          }
          try {
            const fileBlob = await window.AnswerFileDB.getFile(answer.id);
            if (!fileBlob) { alert("File not found in database."); return; }
            
            const objUrl = URL.createObjectURL(fileBlob);
            if (fileBlob.type.startsWith("image/")) {
              viewContainer.innerHTML = `<img src="${objUrl}" style="max-width: 100%; border-radius: 8px; border: 1px solid var(--border-color);">`;
            } else if (fileBlob.type === "application/pdf") {
              viewContainer.innerHTML = `<iframe src="${objUrl}" style="width: 100%; height: 500px; border: none; border-radius: 8px;"></iframe>`;
            } else {
              viewContainer.innerHTML = `<a href="${objUrl}" download="${fileBlob.name || 'answer_file'}" class="timer-btn">Download File</a>`;
            }
            viewContainer.style.display = "block";
            viewBtn.innerText = "Hide";
          } catch(err) {
            console.error(err);
            alert("Error loading file.");
          }
        });
        
        const delBtn = awDiv.querySelector(".delete-file-btn");
        delBtn.addEventListener("click", async () => {
          if (confirm("Are you sure you want to delete this attached file?")) {
            await window.AnswerFileDB.deleteFile(answer.id);
            appState = window.StorageManager.saveAnswer(answer.dayIndex, answer.id, undefined, undefined, undefined, false);
            renderAnswersView();
          }
        });
      }
    }
  }

  // 11. Modal, Backup, Cloud Sync, and Data Restores

  const githubPatInput = document.getElementById("github-pat-input");
  const saveGithubPatBtn = document.getElementById("save-github-pat-btn");
  const forceSyncBtn = document.getElementById("force-sync-btn");
  const syncStatusBadge = document.getElementById("sync-status-badge");
  
  if (githubPatInput && saveGithubPatBtn) {
    githubPatInput.value = window.StorageManager.getGithubToken();
    saveGithubPatBtn.addEventListener("click", () => {
      window.StorageManager.setGithubToken(githubPatInput.value.trim());
      saveGithubPatBtn.innerText = "Saved ✓";
      setTimeout(() => saveGithubPatBtn.innerHTML = '<i class="fas fa-save"></i> Save Token', 1500);
      window.StorageManager.syncToCloud();
    });
  }

  if (forceSyncBtn) {
    forceSyncBtn.addEventListener("click", async () => {
      const success = await window.StorageManager.syncFromCloud();
      if (success) {
        appState = window.StorageManager.loadState();
        navigateTo(activeView);
        alert("Pulled latest data from cloud successfully!");
      } else {
        alert("No cloud data found or token is invalid.");
      }
    });
  }

  // Handle Sync Events
  window.addEventListener('cloud-sync-start', () => {
    if (syncStatusBadge) {
      syncStatusBadge.innerText = "Syncing...";
      syncStatusBadge.style.color = "var(--primary)";
    }
  });
  window.addEventListener('cloud-sync-success', () => {
    if (syncStatusBadge) {
      syncStatusBadge.innerText = "Synced Just Now";
      syncStatusBadge.style.color = "#10b981"; // success green
    }
  });
  window.addEventListener('cloud-sync-error', () => {
    if (syncStatusBadge) {
      syncStatusBadge.innerText = "Sync Error";
      syncStatusBadge.style.color = "#ef4444"; // error red
    }
  });

  // Attempt initial sync on load
  if (window.StorageManager.getGithubToken() && window.StorageManager.getSyncGistId()) {
      window.StorageManager.syncFromCloud().then(success => {
          if (success) {
              appState = window.StorageManager.loadState();
              navigateTo(activeView);
          }
      });
  }

  exportBtn.addEventListener("click", () => {
    window.StorageManager.exportData();
  });

  importBtn.addEventListener("click", () => {
    importInput.click();
  });

  importInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
      const success = window.StorageManager.importData(evt.target.result);
      if (success) {
        alert("Backup imported successfully! Reloading data...");
        appState = window.StorageManager.loadState();
        navigateTo(activeView); // redraw active view
      } else {
        alert("Failed to import. Invalid JSON backup file.");
      }
    };
    reader.readAsText(file);
  });

  resetBtn.addEventListener("click", () => {
    resetModal.classList.add("active-modal");
  });

  closeResetModal.addEventListener("click", () => {
    resetModal.classList.remove("active-modal");
  });

  cancelResetBtn.addEventListener("click", () => {
    resetModal.classList.remove("active-modal");
  });

  confirmResetBtn.addEventListener("click", () => {
    appState = window.StorageManager.resetData();
    resetModal.classList.remove("active-modal");
    alert("Tracker progress has been reset.");
    navigateTo("dashboard");
  });

  // 12. Initialize App Landing
  navigateTo("dashboard");
});
