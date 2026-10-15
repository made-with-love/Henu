let enteredPin = "";
const correctPin = "0910";
let swipedCards = 0;
const totalCards = 5;

let audioContext;
let analyser;
let microphone;
let isBlown = false;

/* Jar Notes Pool - Boyfriend to Girlfriend */
const jarNotes = [
  "✨ Your smile is literally my favorite thing in the world.",
  "🌸 Having you in my life makes every single day so much better.",
  "✨ You're not just my girlfriend, you're my best friend and favorite person.",
  "🌸 I love how effortless and cute you are without even trying.",
  "✨ Thank you for choosing me and being by my side through everything.",
  "🌸 You bring so much peace, happiness, and sweetness into my life.",
  "✨ I love every little detail about you—never change, baby!"
];

let unusedNotes = [...jarNotes];

function drawJarNote() {
  if (unusedNotes.length === 0) {
    unusedNotes = [...jarNotes];
  }
  const randomIndex = Math.floor(Math.random() * unusedNotes.length);
  const note = unusedNotes.splice(randomIndex, 1)[0];

  const display = document.getElementById('jar-note-text');
  if (display) {
    display.style.opacity = 0;
    setTimeout(() => {
      display.innerText = `"${note}"`;
      display.style.opacity = 1;
    }, 150);
  }
}

function goToScreen(screenId) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(s => s.classList.remove('active'));

  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (screenId === 'screen-coupons') {
      initScratchCards();
    }
  }
}

function unlockBlossom() {
  const music = document.getElementById('bg-music');
  if (music) {
    music.play().catch(e => console.log("Audio waiting for user action:", e));
  }
  goToScreen('screen-passcode');
}

/* Keypad Logic */
function pressKey(num) {
  if (enteredPin.length < 4) {
    enteredPin += num;
    updateDots();

    if (enteredPin.length === 4) {
      setTimeout(checkPin, 200);
    }
  }
}

function deleteKey() {
  if (enteredPin.length > 0) {
    enteredPin = enteredPin.slice(0, -1);
    updateDots();
  }
}

function updateDots() {
  for (let i = 0; i < 4; i++) {
    const dot = document.getElementById(`dot-${i}`);
    if (dot) {
      if (i < enteredPin.length) {
        dot.classList.add('filled');
      } else {
        dot.classList.remove('filled');
      }
    }
  }
}

function checkPin() {
  if (enteredPin === correctPin) {
    goToScreen('screen-intro');
  } else {
    alert("Incorrect passcode! Check the hint 😉");
    enteredPin = "";
    updateDots();
  }
}

function playfulNo() {
  alert("Wrong choice! Tapping Yes for you 😜❤️");
  goToScreen('screen-photos');
}

/* 3D Flip Card */
function flipCard(cardInner) {
  cardInner.classList.toggle('flipped');
}

/* Swipe Photo Deck */
function swipeTopCard(e, cardId) {
  e.stopPropagation();
  const card = document.getElementById(cardId);
  if (card && !card.classList.contains('swiped')) {
    card.classList.add('swiped');
    swipedCards++;

    if (swipedCards >= totalCards) {
      const stack = document.getElementById('card-stack');
      const sub = document.getElementById('deck-sub');
      if (stack) stack.classList.add('shrink');
      if (sub) sub.style.display = 'none';
      document.getElementById('photo-finish-btn').style.display = 'block';
    }
  }
}

function openEnvelope() {
  const scroll = document.getElementById('letter-scroll');
  if (scroll) scroll.classList.add('active');
}

/* Scratch-Off Canvas Logic */
function initScratchCards() {
  ['canvas-1', 'canvas-2', 'canvas-3'].forEach(id => {
    const canvas = document.getElementById(id);
    if (!canvas || canvas.dataset.inited) return;
    canvas.dataset.inited = "true";

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.fillStyle = '#f8bbd0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = '14px Poppins, sans-serif';
    ctx.fillStyle = '#880e4f';
    ctx.textAlign = 'center';
    ctx.fillText('✨ Scratch to Reveal ✨', canvas.width / 2, canvas.height / 2 + 5);

    let isDrawing = false;

    function scratch(e) {
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 18, 0, Math.PI * 2);
      ctx.fill();
    }

    ['mousedown', 'touchstart'].forEach(evt => canvas.addEventListener(evt, (e) => { isDrawing = true; scratch(e); }));
    ['mousemove', 'touchmove'].forEach(evt => canvas.addEventListener(evt, scratch));
    ['mouseup', 'touchend'].forEach(evt => canvas.addEventListener(evt, () => isDrawing = false));
  });
}

/* Parallax Tilt Physics */
document.addEventListener('mousemove', (e) => {
  const cards = document.querySelectorAll('.tilt-card');
  const x = (window.innerWidth / 2 - e.pageX) / 30;
  const y = (window.innerHeight / 2 - e.pageY) / 30;

  cards.forEach(card => {
    card.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  });
});

/* Floating Petals Physics */
function initPetals() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petals = Array.from({ length: 
