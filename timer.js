class PomodoroTimer {
  constructor(workTimeSeconds = 25 * 60, breakTimeSeconds = 5 * 60) {
    this.WORK_TIME = workTimeSeconds;
    this.BREAK_TIME = breakTimeSeconds;
    this.timeRemaining = this.WORK_TIME;
    this.isWorkMode = true;
    this.timerInterval = null;
    this.onTick = null;
    this.onModeChange = null;
  }

  formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  start() {
    if (!this.timerInterval) {
      this.timerInterval = setInterval(() => {
        if (this.timeRemaining > 0) {
          this.timeRemaining--;
          if (this.onTick) this.onTick();
        } else {
          this.pause();
          this.toggleMode();
        }
      }, 1000);
    }
  }

  pause() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  reset() {
    this.pause();
    this.timeRemaining = this.isWorkMode ? this.WORK_TIME : this.BREAK_TIME;
    if (this.onTick) this.onTick();
  }

  toggleMode() {
    this.isWorkMode = !this.isWorkMode;
    this.reset();
    if (this.onModeChange) this.onModeChange();
  }

  getFormattedTime() {
    return this.formatTime(this.timeRemaining);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PomodoroTimer;
}
