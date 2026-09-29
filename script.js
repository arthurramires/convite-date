/**
 * CONVITE PARA UM DATE - LÓGICA E INTERATIVIDADE
 * Reprodução fiel da dinâmica e dos efeitos do vídeo
 */

// Estado da Aplicação
const dateState = {
  date: '',
  dateFormatted: '',
  time: '19:00',
  food: 'Sushi',
  foodIcon: '🍣',
  place: 'Minha casa',
  placeIcon: '🏠',
  pickupText: 'Fica pronta que eu vou te buscar 🚗'
};

// Áudio Sintético via Web Audio API (sem dependência de arquivos externos)
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playPopSound() {
  try {
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.13);
  } catch (e) {
    // Silently ignore audio errors if blocked
  }
}

function playFanfareSound() {
  try {
    initAudio();
    if (!audioCtx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.1);
      gain.gain.setValueAtTime(0.25, audioCtx.currentTime + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + idx * 0.1 + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime + idx * 0.1);
      osc.stop(audioCtx.currentTime + idx * 0.1 + 0.36);
    });
  } catch (e) {}
}

// Navegação entre telas
function goToScreen(screenNumber) {
  const current = document.querySelector('.screen.active');
  const target = document.getElementById(`screen-${screenNumber}`);
  
  if (current) {
    current.classList.remove('active');
  }
  
  if (target) {
    target.classList.add('active');
    target.scrollTop = 0;
  }
}

// Chuva de Confetes
function fireConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff4d6d', '#c9184a', '#ff758f', '#ffffff', '#ffb3c1']
    });
  }
}

function fireBigCelebration() {
  if (typeof confetti === 'function') {
    const end = Date.now() + 2.5 * 1000;
    const colors = ['#ff4d6d', '#e63946', '#ffd166', '#ffffff', '#c1121f'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }
}

// Notificação Toast
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 2800);
}

// ========================================================
// INICIALIZAÇÃO
// ========================================================
document.addEventListener('DOMContentLoaded', () => {
  // 1. Gerar corações pretos flutuantes no fundo
  createFloatingHearts();

  // 2. Configurar Data Padrão (Amanhã)
  setupDefaultDate();

  // 3. Inicializar Telas e Eventos
  setupScreen1();
  setupScreen2();
  setupScreen3();
  setupScreen4();
  setupScreen5();
  setupScreen6();
});

// Fundo de corações pretos animados
function createFloatingHearts() {
  const container = document.getElementById('hearts-container');
  const totalHearts = 18;

  for (let i = 0; i < totalHearts; i++) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerHTML = '🖤';
    
    const size = Math.floor(Math.random() * 22) + 16; // 16px a 38px
    const left = Math.random() * 100; // 0% a 100%
    const duration = Math.random() * 9 + 8; // 8s a 17s
    const delay = Math.random() * 12; // 0s a 12s
    const opacity = Math.random() * 0.4 + 0.35; // 0.35 a 0.75

    heart.style.fontSize = `${size}px`;
    heart.style.left = `${left}vw`;
    heart.style.animationDuration = `${duration}s`;
    heart.style.animationDelay = `${delay}s`;
    heart.style.opacity = opacity;

    container.appendChild(heart);
  }
}

// Data Padrão
function setupDefaultDate() {
  const dateInput = document.getElementById('date-input');
  const today = new Date();
  
  // Data mínima: hoje
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  dateInput.min = `${yyyy}-${mm}-${dd}`;

  // Default: próximo fim de semana ou amanhã
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tY = tomorrow.getFullYear();
  const tM = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const tD = String(tomorrow.getDate()).padStart(2, '0');
  dateInput.value = `${tY}-${tM}-${tD}`;
}

// ========================================================
// TELA 1: O PEDIDO (Botão NÃO fujão / desaparece)
// ========================================================
function setupScreen1() {
  const btnSim = document.getElementById('btn-sim');
  const btnNao = document.getElementById('btn-nao');
  const buttonsArea = document.getElementById('buttons-area');
  const pleaBanner = document.getElementById('plea-banner');

  let evasionCount = 0;

  function dodgeNo() {
    evasionCount++;
    playPopSound();

    // Mostra o banner "POR FAVOR!!" no topo
    pleaBanner.classList.remove('hidden');

    // Vibração háptica no celular se suportado
    if (navigator.vibrate) {
      navigator.vibrate(60);
    }

    if (evasionCount >= 3) {
      // Após 3 tentativas, o botão some de vez igual no vídeo
      btnNao.classList.add('hidden');
      btnSim.style.transform = 'scale(1.15)';
      btnSim.style.boxShadow = '0 12px 32px rgba(255, 71, 87, 0.7)';
      return;
    }

    // Calcula posição aleatória para fugir
    btnNao.classList.add('fleeing');
    const areaRect = buttonsArea.getBoundingClientRect();
    const btnRect = btnNao.getBoundingClientRect();

    // Deslocamento aleatório
    const maxOffset = 90;
    const randomX = (Math.random() - 0.5) * maxOffset * 2;
    const randomY = (Math.random() - 0.5) * maxOffset * 1.5;

    btnNao.style.transform = `translate(${randomX}px, ${randomY}px)`;
  }

  // Desktop hover
  btnNao.addEventListener('mouseenter', dodgeNo);

  // Mobile touch
  btnNao.addEventListener('touchstart', (e) => {
    e.preventDefault();
    dodgeNo();
  }, { passive: false });

  btnNao.addEventListener('click', (e) => {
    e.preventDefault();
    dodgeNo();
  });

  // Clique no SIM
  btnSim.addEventListener('click', () => {
    playPopSound();
    fireConfetti();
    pleaBanner.classList.add('hidden');
    goToScreen(2);
  });
}

// ========================================================
// TELA 2: A REAÇÃO
// ========================================================
function setupScreen2() {
  const btnNext = document.getElementById('btn-next-to-date');
  btnNext.addEventListener('click', () => {
    playPopSound();
    goToScreen(3);
  });
}

// ========================================================
// TELA 3: DATA E HORÁRIO
// ========================================================
function setupScreen3() {
  const btnSubmit = document.getElementById('btn-submit-date');
  const dateInput = document.getElementById('date-input');
  const timeInput = document.getElementById('time-input');

  btnSubmit.addEventListener('click', () => {
    if (!dateInput.value) {
      showToast('Por favor, escolhe uma data! 🗓️');
      return;
    }

    dateState.date = dateInput.value;
    dateState.time = timeInput.value || '19:00';

    // Formatar data em português: ex: "12 de outubro de 2026"
    const [year, month, day] = dateInput.value.split('-');
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    
    const meses = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    dateState.dateFormatted = `${parseInt(day)} de ${meses[dateObj.getMonth()]} de ${year}`;

    playPopSound();
    goToScreen(4);
  });
}

// ========================================================
// TELA 4: COMIDA
// ========================================================
function setupScreen4() {
  const foodCards = document.querySelectorAll('#food-options .option-card');
  const btnSubmit = document.getElementById('btn-submit-food');

  foodCards.forEach(card => {
    card.addEventListener('click', () => {
      playPopSound();
      foodCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      dateState.food = card.dataset.food;
      dateState.foodIcon = card.dataset.icon;

      btnSubmit.removeAttribute('disabled');
    });
  });

  // Pré-selecionar Sushi como no vídeo
  const defaultSushi = document.querySelector('#food-options [data-food="Sushi"]');
  if (defaultSushi) {
    defaultSushi.classList.add('selected');
    dateState.food = 'Sushi';
    dateState.foodIcon = '🍣';
    btnSubmit.removeAttribute('disabled');
  }

  btnSubmit.addEventListener('click', () => {
    playPopSound();
    goToScreen(5);
  });
}

// ========================================================
// TELA 5: A VIBE / LOCAL (Minha casa, Sua casa, Na rua)
// ========================================================
function setupScreen5() {
  const placeCards = document.querySelectorAll('#place-options .option-card');
  const btnSubmit = document.getElementById('btn-submit-place');

  placeCards.forEach(card => {
    card.addEventListener('click', () => {
      playPopSound();
      placeCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      dateState.place = card.dataset.place;
      dateState.placeIcon = card.dataset.icon;
      dateState.pickupText = card.dataset.pickup;

      btnSubmit.removeAttribute('disabled');
    });
  });

  // Pré-selecionar a primeira opção
  if (placeCards.length > 0) {
    placeCards[0].classList.add('selected');
    dateState.place = placeCards[0].dataset.place;
    dateState.placeIcon = placeCards[0].dataset.icon;
    dateState.pickupText = placeCards[0].dataset.pickup;
    btnSubmit.removeAttribute('disabled');
  }

  btnSubmit.addEventListener('click', () => {
    playPopSound();
    updateFinalScreen();
    goToScreen(6);
    fireBigCelebration();
    playFanfareSound();
  });
}

// ========================================================
// TELA 6: CONFIRMAÇÃO FINAL
// ========================================================
function updateFinalScreen() {
  document.getElementById('summary-date').textContent = dateState.dateFormatted || dateState.date;
  document.getElementById('summary-time').textContent = dateState.time;
  
  document.getElementById('summary-food').textContent = dateState.food;
  document.getElementById('summary-food-icon').textContent = dateState.foodIcon;

  document.getElementById('summary-place').textContent = dateState.place;
  document.getElementById('summary-place-icon').textContent = dateState.placeIcon;

  document.getElementById('final-pickup-text').textContent = dateState.pickupText;

  // Montar link direto do WhatsApp com a mensagem formatada
  const msg = 
`Oii! Respondi seu convite de date 🥰🫀

🗓️ Data: ${dateState.dateFormatted}
⏰ Horário: ${dateState.time}
${dateState.foodIcon} Comida: ${dateState.food}
${dateState.placeIcon} Lugar: ${dateState.place}

${dateState.pickupText}`;

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
  document.getElementById('btn-whatsapp-share').href = whatsappUrl;
}

function setupScreen6() {
  const btnCopy = document.getElementById('btn-copy-summary');

  btnCopy.addEventListener('click', () => {
    playPopSound();
    const textToCopy = 
`Resumo do nosso Date 🥰🫀:
🗓️ Data: ${dateState.dateFormatted}
⏰ Horário: ${dateState.time}
${dateState.foodIcon} Comida: ${dateState.food}
${dateState.placeIcon} Local: ${dateState.place}
${dateState.pickupText}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast('Resumo copiado para a área de transferência! 📋✨');
      }).catch(() => {
        fallbackCopy(textToCopy);
      });
    } else {
      fallbackCopy(textToCopy);
    }
  });
}

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    showToast('Resumo copiado com sucesso! 📋✨');
  } catch (err) {
    showToast('Não foi possível copiar automaticamente.');
  }
  document.body.removeChild(textarea);
}
