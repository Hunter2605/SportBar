const slides = document.querySelector(".slides");
const slideList = document.querySelectorAll(".slide");
const dotsWrapper = document.getElementById("dots");

let index = 0;

// создаём точки
slideList.forEach((_, i) => {
  const dot = document.createElement("button");
  dot.dataset.index = i;
  if (i === 0) dot.classList.add("active");
  dotsWrapper.appendChild(dot);
});

const dots = document.querySelectorAll("#dots button");

function updateSlider() {
  slides.style.transform = `translateX(-${index * 100}%)`;

  dots.forEach(dot => dot.classList.remove("active"));
  dots[index].classList.add("active");
}

document.getElementById("nextBtn").onclick = () => {
  index = (index + 1) % slideList.length;
  updateSlider();
};

document.getElementById("prevBtn").onclick = () => {
  index = (index - 1 + slideList.length) % slideList.length;
  updateSlider();
};

dots.forEach(dot => {
  dot.onclick = () => {
    index = Number(dot.dataset.index);
    updateSlider();
  };
});
const items = document.querySelectorAll('.menu-list > li');

items.forEach(item => {
  item.addEventListener('click', (e) => {
    e.stopPropagation();
    items.forEach(i => {
      if (i !== item) i.classList.remove('active');
    });
    item.classList.toggle('active');
  });
});

document.addEventListener('click', () => {
  items.forEach(i => i.classList.remove('active'));
});
document.addEventListener("DOMContentLoaded", function () {

  // Загружаем бонусы (это же баланс)
  let balance = parseInt(localStorage.getItem("slotBonus") || "0", 10);

  const balanceText = document.getElementById("balance-amount");

  function updateBalance() {
    balanceText.textContent = balance;
  }

  function saveBalance() {
    localStorage.setItem("slotBonus", balance);
  }

  updateBalance();


  const slotItems = ["🍒", "⭐", "🍋", "7️⃣"];

  const reel1 = document.getElementById("r1");
  const reel2 = document.getElementById("r2");
  const reel3 = document.getElementById("r3");

  const spinBtn = document.getElementById("spin-btn");
  const popup = document.getElementById("popup");
  const closePopup = document.getElementById("close-popup");



  const soundSpin = new Audio("sounds/spin.mp3");
  const soundStop = new Audio("sounds/stop.mp3");
  const soundWin = new Audio("sounds/win.mp3");
  const soundJackpot = new Audio("sounds/jackpot.mp3");

  function playSound(s) {
    s.currentTime = 0;
    s.play();
  }


  function getRandomSymbol() {
    return slotItems[Math.floor(Math.random() * slotItems.length)];
  }


  function animateReels(done) {
    let steps = 0;

    playSound(soundSpin);

    const timer = setInterval(() => {

      reel1.textContent = getRandomSymbol();
      reel2.textContent = getRandomSymbol();
      reel3.textContent = getRandomSymbol();

      steps++;

      if (steps === 15) {
        clearInterval(timer);
        done && done();
      }

    }, 100);
  }


  function getReward(a, b, c) {

    // 777 — джекпот
    if (a === "7️⃣" && b === "7️⃣" && c === "7️⃣") return 100;

    if (a === "⭐" && b === "⭐" && c === "⭐") return 50;
    if (a === "🍒" && b === "🍒" && c === "🍒") return 25;
    if (a === "🍋" && b === "🍋" && c === "🍋") return 10;


    return 0;
  }


  function spin() {

    spinBtn.disabled = true;
    spinBtn.textContent = "SPINNING...";

    animateReels(function () {

      const s1 = getRandomSymbol();
      const s2 = getRandomSymbol();
      const s3 = getRandomSymbol();

      reel1.textContent = s1;
      reel2.textContent = s2;
      reel3.textContent = s3;

      spinBtn.disabled = false;
      spinBtn.textContent = "SPIN 🎰";

      playSound(soundStop);

      // получаем награду
      const reward = getReward(s1, s2, s3);

      // обновляем баланс
      if (reward > 0) {
        balance += reward;
        saveBalance();
        updateBalance();

        playSound(soundWin);
      }

      // джекпот
      if (reward >= 100) {
        playSound(soundJackpot);
        popup.style.display = "flex";
      }

    });
  }


  spinBtn.addEventListener("click", spin);
  closePopup.addEventListener("click", () => popup.style.display = "none");

});

