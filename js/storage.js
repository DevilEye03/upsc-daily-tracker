// UPSC 2027 Tracker Storage & Metrics Manager

const STORAGE_KEY = "UPSC_2027_TRACKER_STATE";

const DB_NAME = "UPSC_Answers_DB";
const DB_VERSION = 1;
const STORE_NAME = "answer_files";

const AnswerFileDB = {
  init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
    });
  },

  async saveFile(answerId, fileBlob) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(fileBlob, answerId);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  },

  async getFile(answerId) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(answerId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  
  async deleteFile(answerId) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(answerId);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }
};

const StorageManager = {
  /**
   * Initializes or loads the application state from localStorage.
   */
  loadState() {
    let stateString = localStorage.getItem(STORAGE_KEY);
    const CURRENT_VERSION = "2.9"; // Phase 2+ answer slots now left blank for user-uploaded questions
    
    if (!stateString) {
      // First time loading: generate the initial baseline schedule
      console.log("No stored state found. Initializing baseline schedule...");
      const baselineSchedule = window.generateSchedule();
      const initialState = {
        days: baselineSchedule,
        streak: 0,
        lastActiveDate: null,
        createdDate: window.getLocalDateString(),
        version: CURRENT_VERSION
      };
      this.saveState(initialState);
      return initialState;
    }
    
    try {
      const parsed = JSON.parse(stateString);
      // Migrate to new schedule if date mismatch or outdated version detected
      if (parsed && parsed.days && parsed.days[0] && (parsed.days[0].date !== "2026-06-12" || parsed.version !== CURRENT_VERSION)) {
        console.log(`Outdated version (${parsed.version || 'unknown'}) or restructured schedule detected. Migrating to version ${CURRENT_VERSION}...`);
        
        const freshSchedule = window.generateSchedule();
        
        // Transfer user progress from old schedule to the fresh one
        freshSchedule.forEach(newDay => {
          const oldDay = parsed.days.find(d => d.dayIndex === newDay.dayIndex || d.date === newDay.date);
          if (oldDay) {
            // 1. Migrate tasks
            newDay.tasks.forEach(newTask => {
              const oldTask = oldDay.tasks.find(t => t.id === newTask.id || (t.category === newTask.category && t.text === newTask.text));
              if (oldTask) {
                newTask.completed = oldTask.completed || false;
                newTask.note = oldTask.note || "";
                if (oldTask.completed_micro_topics) {
                  newTask.completed_micro_topics = [...oldTask.completed_micro_topics];
                }
              }
            });
            
            // 2. Migrate answers (written answer, rating, completed status)
            newDay.answers.forEach(newAns => {
              const oldAns = oldDay.answers.find(a => a.id === newAns.id || (a.category === newAns.category && a.question.substring(0, 20) === newAns.question.substring(0, 20)));
              if (oldAns) {
                newAns.writtenAnswer = oldAns.writtenAnswer || "";
                newAns.rating = oldAns.rating || 0;
                newAns.completed = oldAns.completed || false;
              }
            });
          }
        });
        
        const migratedState = {
          days: freshSchedule,
          streak: parsed.streak || 0,
          lastActiveDate: parsed.lastActiveDate || null,
          createdDate: parsed.createdDate || window.getLocalDateString(),
          version: CURRENT_VERSION
        };
        this.saveState(migratedState);
        console.log(`Migration to version ${CURRENT_VERSION} complete.`);
        return migratedState;
      }
      return parsed;
    } catch (e) {
      console.error("Error parsing stored state, resetting...", e);
      const baselineSchedule = window.generateSchedule();
      const initialState = {
        days: baselineSchedule,
        streak: 0,
        lastActiveDate: null,
        createdDate: window.getLocalDateString(),
        version: CURRENT_VERSION
      };
      this.saveState(initialState);
      return initialState;
    }
  },

  /**
   * Saves the current state to localStorage.
   */
  saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  },

  /**
   * Updates a single task's completion status.
   */
  toggleTask(dayIndex, taskId, completed) {
    const state = this.loadState();
    const day = state.days.find(d => d.dayIndex === dayIndex);
    if (day) {
      const task = day.tasks.find(t => t.id === taskId);
      if (task) {
        task.completed = completed;
        // If we complete the parent task, also complete all micro-topics
        if (completed && task.micro_topics) {
          task.completed_micro_topics = [...task.micro_topics];
        } else if (!completed && task.micro_topics) {
          task.completed_micro_topics = [];
        }
        this.updateStreak(state);
        this.saveState(state);
      }
    }
    return state;
  },

  /**
   * Toggles completion of a specific micro-topic in a task.
   */
  toggleMicroTopic(dayIndex, taskId, microTopicText, completed) {
    const state = this.loadState();
    const day = state.days.find(d => d.dayIndex === dayIndex);
    if (day) {
      const task = day.tasks.find(t => t.id === taskId);
      if (task) {
        if (!task.completed_micro_topics) {
          task.completed_micro_topics = [];
        }
        if (completed) {
          if (!task.completed_micro_topics.includes(microTopicText)) {
            task.completed_micro_topics.push(microTopicText);
          }
        } else {
          task.completed_micro_topics = task.completed_micro_topics.filter(mt => mt !== microTopicText);
        }
        
        // Auto-complete parent task if all micro-topics are done
        if (task.micro_topics && task.micro_topics.length > 0 && 
            task.completed_micro_topics.length === task.micro_topics.length) {
          task.completed = true;
        } else {
          // If not all are done, uncheck the parent task (forcing active work)
          task.completed = false;
        }
        
        this.updateStreak(state);
        this.saveState(state);
      }
    }
    return state;
  },

  /**
   * Updates note text for a task.
   */
  saveTaskNote(dayIndex, taskId, noteText) {
    const state = this.loadState();
    const day = state.days.find(d => d.dayIndex === dayIndex);
    if (day) {
      const task = day.tasks.find(t => t.id === taskId);
      if (task) {
        task.note = noteText;
        this.saveState(state);
      }
    }
    return state;
  },

  /**
   * Saves a written answer and its rating.
   */
  saveAnswer(dayIndex, answerId, writtenAnswer, rating, completed, hasFile, aiRemarks) {
    const state = this.loadState();
    const day = state.days.find(d => d.dayIndex === dayIndex);
    if (day) {
      const answer = day.answers.find(a => a.id === answerId);
      if (answer) {
        if (writtenAnswer !== undefined) answer.writtenAnswer = writtenAnswer;
        if (rating !== undefined) answer.rating = rating;
        if (completed !== undefined) answer.completed = completed;
        if (hasFile !== undefined) answer.hasFile = hasFile;
        if (aiRemarks !== undefined) answer.aiRemarks = aiRemarks;
        this.updateStreak(state);
        this.saveState(state);
      }
    }
    return state;
  },

  /**
   * API Key Management
   */
  getApiKey() {
    return localStorage.getItem("GEMINI_API_KEY") || "";
  },

  setApiKey(key) {
    localStorage.setItem("GEMINI_API_KEY", key);
  },

  /**
   * Increments/updates the user's consecutive day streak.
   */
  updateStreak(state) {
    const today = window.getLocalDateString();
    
    // Check if user has done anything today
    let activeToday = false;
    const todayDayObj = state.days.find(d => {
      // Check if this date matches today
      return d.date === today;
    });

    if (todayDayObj) {
      const tasksCompleted = todayDayObj.tasks.some(t => t.completed);
      const answersCompleted = todayDayObj.answers.some(a => a.completed);
      activeToday = tasksCompleted || answersCompleted;
    }

    if (activeToday) {
      if (state.lastActiveDate !== today) {
        // If the last active date was yesterday, increment streak
        if (state.lastActiveDate) {
          const lastDate = new Date(state.lastActiveDate);
          const currDate = new Date(today);
          const diffTime = Math.abs(currDate - lastDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            state.streak += 1;
          } else if (diffDays > 1) {
            state.streak = 1; // Streak broken, restart
          }
        } else {
          state.streak = 1; // First activity
        }
        state.lastActiveDate = today;
      }
    }
  },

  /**
   * Calculates overall stats for dashboard.
   */
  getStats(state) {
    let totalTasks = 0;
    let completedTasks = 0;
    let totalAnswers = 0;
    let completedAnswers = 0;
    
    const phaseStats = {
      1: { total: 0, completed: 0 },
      2: { total: 0, completed: 0 },
      3: { total: 0, completed: 0 },
      4: { total: 0, completed: 0 },
      5: { total: 0, completed: 0 }
    };

    const categoryStats = {};

    state.days.forEach(day => {
      // Skip buffer days for task denominator if user wants, but we keep them
      day.tasks.forEach(t => {
        totalTasks++;
        if (t.completed) completedTasks++;
        
        // Category breakdown
        if (!categoryStats[t.category]) {
          categoryStats[t.category] = { total: 0, completed: 0 };
        }
        categoryStats[t.category].total++;
        if (t.completed) categoryStats[t.category].completed++;
        
        // Phase breakdown
        if (phaseStats[day.phaseNum]) {
          phaseStats[day.phaseNum].total++;
          if (t.completed) phaseStats[day.phaseNum].completed++;
        }
      });

      day.answers.forEach(a => {
        totalAnswers++;
        if (a.completed) completedAnswers++;

        // Track answers in categories
        const catName = "Answer Writing - " + a.category;
        if (!categoryStats[catName]) {
          categoryStats[catName] = { total: 0, completed: 0 };
        }
        categoryStats[catName].total++;
        if (a.completed) categoryStats[catName].completed++;
      });
    });

    const totalProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const answerProgress = totalAnswers > 0 ? (completedAnswers / totalAnswers) * 100 : 0;

    return {
      totalTasks,
      completedTasks,
      totalAnswers,
      completedAnswers,
      totalProgress,
      answerProgress,
      phaseStats,
      categoryStats,
      streak: state.streak || 0
    };
  },

  /**
   * Exports the entire tracking data as a downloadable JSON file.
   */
  exportData() {
    const state = this.loadState();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `UPSC_2027_Tracker_Backup_${window.getLocalDateString()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  /**
   * Imports configuration state and overwrites localStorage.
   */
  importData(jsonString) {
    try {
      const stateObj = JSON.parse(jsonString);
      if (stateObj && Array.isArray(stateObj.days)) {
        this.saveState(stateObj);
        return true;
      }
      return false;
    } catch (e) {
      console.error("Failed to import data: invalid JSON.", e);
      return false;
    }
  },

  /**
   * Resets all progress.
   */
  resetData() {
    localStorage.removeItem(STORAGE_KEY);
    return this.loadState();
  }
};

// Export to global scope
if (typeof window !== 'undefined') {
  window.StorageManager = StorageManager;
  window.AnswerFileDB = AnswerFileDB;
}
