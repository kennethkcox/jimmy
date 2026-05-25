const PomodoroTimer = require('./timer.js');

describe('PomodoroTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('initializes with correct defaults', () => {
    const timer = new PomodoroTimer();
    expect(timer.timeRemaining).toBe(25 * 60);
    expect(timer.isWorkMode).toBe(true);
    expect(timer.getFormattedTime()).toBe('25:00');
  });

  test('formats time correctly', () => {
    const timer = new PomodoroTimer();
    expect(timer.formatTime(0)).toBe('00:00');
    expect(timer.formatTime(59)).toBe('00:59');
    expect(timer.formatTime(60)).toBe('01:00');
    expect(timer.formatTime(61)).toBe('01:01');
  });

  test('ticks down when started', () => {
    const timer = new PomodoroTimer();
    timer.start();
    jest.advanceTimersByTime(1000);
    expect(timer.timeRemaining).toBe(25 * 60 - 1);
  });

  test('switches mode when time runs out', () => {
    const timer = new PomodoroTimer(2, 1); // 2 sec work, 1 sec break
    let modeChanged = false;
    timer.onModeChange = () => { modeChanged = true; };
    timer.start();
    
    // Advance 3 seconds (1s -> 1, 2s -> 0, 3s -> toggle)
    jest.advanceTimersByTime(3000);
    
    expect(modeChanged).toBe(true);
    expect(timer.isWorkMode).toBe(false);
    expect(timer.timeRemaining).toBe(1);
  });

  test('resets correctly', () => {
    const timer = new PomodoroTimer();
    timer.start();
    jest.advanceTimersByTime(5000); // 5 seconds
    expect(timer.timeRemaining).toBe(25 * 60 - 5);
    
    timer.reset();
    expect(timer.timeRemaining).toBe(25 * 60);
    expect(timer.timerInterval).toBeNull();
  });
});
