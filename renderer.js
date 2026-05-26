// No requires! Using window.notchflowAPI and window.PomodoroTimer
const island = document.getElementById('island');
const collapsedView = document.getElementById('collapsed-view');
const expandedView = document.getElementById('expanded-view');
const btnClose = document.getElementById('btn-close');

const miniTimer = document.getElementById('mini-timer');
const mainTimer = document.getElementById('main-timer');
const modeText = document.getElementById('mode-text');

const btnPlay = document.getElementById('btn-play');
const btnPause = document.getElementById('btn-pause');
const btnReset = document.getElementById('btn-reset');
const btnMode = document.getElementById('btn-mode');

// IPC for mouse events
island.addEventListener('mouseenter', () => {
  window.notchflowAPI.setIgnoreMouseEvents(false);
});
island.addEventListener('mouseleave', () => {
  window.notchflowAPI.setIgnoreMouseEvents(true);
});

// Expanding / Collapsing
island.addEventListener('click', (e) => {
  if (e.target.closest('.drag-handle')) return;
  if (island.classList.contains('collapsed')) {
    island.classList.remove('collapsed');
    island.classList.add('expanded');
    collapsedView.style.display = 'none';
    expandedView.style.display = 'flex';
  }
});

btnClose.addEventListener('click', (e) => {
  e.stopPropagation();
  island.classList.remove('expanded');
  island.classList.add('collapsed');
  expandedView.style.display = 'none';
  collapsedView.style.display = 'flex';
});

// Pomodoro Logic
const timer = new PomodoroTimer(25 * 60, 5 * 60);

function updateDisplay() {
  const formatted = timer.getFormattedTime();
  miniTimer.textContent = formatted;
  mainTimer.textContent = formatted;
  modeText.textContent = timer.isWorkMode ? 'Focus' : 'Break';
  
  if (document.body.classList.contains('braun')) {
    miniTimer.style.color = '';
    mainTimer.style.color = '';
  } else {
    const color = timer.isWorkMode ? '#ff9f0a' : '#32d74b';
    miniTimer.style.color = color;
    mainTimer.style.color = color;
  }
  
  updateBurnFrame();
}

timer.onTick = updateDisplay;
timer.onModeChange = () => {
  updateDisplay();
  btnPlay.style.display = 'inline-block';
  btnPause.style.display = 'none';
};

btnPlay.addEventListener('click', () => {
  btnPlay.style.display = 'none';
  btnPause.style.display = 'inline-block';
  timer.start();
});
btnPause.addEventListener('click', () => {
  btnPlay.style.display = 'inline-block';
  btnPause.style.display = 'none';
  timer.pause();
});
btnReset.addEventListener('click', () => timer.reset());
btnMode.addEventListener('click', () => timer.toggleMode());

const btnTheme = document.getElementById('btn-theme');
btnTheme.addEventListener('click', () => {
  document.body.classList.toggle('braun');
  updateDisplay();
});

const btnQuit = document.getElementById('btn-quit');
btnQuit.addEventListener('click', () => {
  window.notchflowAPI.quitApp();
});

// Custom Dragging Logic
const dragHandle = document.getElementById('drag-handle');
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;

dragHandle.addEventListener('mousedown', (e) => {
  isDragging = true;
  dragStartX = e.screenX;
  dragStartY = e.screenY;
});

window.addEventListener('mousemove', (e) => {
  if (isDragging) {
    const deltaX = e.screenX - dragStartX;
    const deltaY = e.screenY - dragStartY;
    window.notchflowAPI.windowMoveDelta({ deltaX, deltaY });
    dragStartX = e.screenX;
    dragStartY = e.screenY;
  }
});

window.addEventListener('mouseup', () => {
  isDragging = false;
});

// 1. Sparkline Logic
const sparklineCanvas = document.getElementById('sparkline-canvas');
const sparkCtx = sparklineCanvas.getContext('2d');
let idleHistory = new Array(60).fill(0);

window.notchflowAPI.onSystemIdleTime((idleTime) => {
  idleHistory.shift();
  idleHistory.push(idleTime);
  drawSparkline();
});

function drawSparkline() {
  sparkCtx.clearRect(0, 0, sparklineCanvas.width, sparklineCanvas.height);
  sparkCtx.beginPath();
  sparkCtx.strokeStyle = document.body.classList.contains('braun') ? '#888' : '#ff9f0a';
  sparkCtx.lineWidth = 1.5;
  
  const w = sparklineCanvas.width;
  const h = sparklineCanvas.height;
  const step = w / (idleHistory.length - 1);
  
  for (let i = 0; i < idleHistory.length; i++) {
    let idle = idleHistory[i];
    let val = Math.max(0, 1 - (idle / 5)); 
    let y = h - (val * h);
    if (y >= h) y = h - 1; 
    let x = i * step;
    
    if (i === 0) sparkCtx.moveTo(x, y);
    else sparkCtx.lineTo(x, y);
  }
  sparkCtx.stroke();
}

// 2. Deep Work Logic
const btnDeepWork = document.getElementById('btn-deep-work');
const burnFrame = document.getElementById('burn-frame');
const burnRect = document.getElementById('burn-rect');
let isDeepWork = false;

btnDeepWork.addEventListener('click', () => {
  isDeepWork = !isDeepWork;
  window.notchflowAPI.toggleDeepWork(isDeepWork);
  if (isDeepWork) {
    burnFrame.style.display = 'block';
    btnDeepWork.style.color = '#ff9f0a'; 
  } else {
    burnFrame.style.display = 'none';
    btnDeepWork.style.color = '';
  }
});

function updateBurnFrame() {
  if (isDeepWork && timer.isWorkMode) {
    const total = timer.WORK_TIME;
    const progress = (total - timer.timeRemaining) / total;
    burnRect.style.strokeDashoffset = progress * 100;
  }
}

// 3. Flow State Canvas
const flowCanvas = document.getElementById('flow-canvas');
const flowCtx = flowCanvas.getContext('2d');
let particles = [];
for(let i=0; i<30; i++) {
  particles.push({
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.002,
    vy: (Math.random() - 0.5) * 0.002,
    size: Math.random() * 40 + 20
  });
}

function drawFlow() {
  flowCanvas.width = island.clientWidth;
  flowCanvas.height = island.clientHeight;
  flowCtx.clearRect(0, 0, flowCanvas.width, flowCanvas.height);
  
  let isActive = timer.timerInterval !== null && timer.isWorkMode;
  flowCanvas.style.opacity = isActive ? '0.3' : '0';
  
  if (isActive) {
    flowCtx.globalCompositeOperation = 'lighter';
    const isBraun = document.body.classList.contains('braun');
    flowCtx.fillStyle = isBraun ? 'rgba(0,0,0,0.05)' : 'rgba(255, 159, 10, 0.15)';
    
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > 1) p.vx *= -1;
      if (p.y < 0 || p.y > 1) p.vy *= -1;
      
      const px = p.x * flowCanvas.width;
      const py = p.y * flowCanvas.height;
      
      flowCtx.beginPath();
      flowCtx.arc(px, py, p.size, 0, Math.PI * 2);
      flowCtx.fill();
    });
  }
  
  requestAnimationFrame(drawFlow);
}
drawFlow();

updateDisplay();
window.notchflowAPI.setIgnoreMouseEvents(true);
