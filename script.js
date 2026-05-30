const loader = document.querySelector("[data-loader]");
const loaderBar = document.querySelector("[data-loader-bar]");
const loaderCount = document.querySelector("[data-loader-count]");
const audioToggle = document.querySelector("[data-audio-toggle]");
const portfolioAudio = document.querySelector("#portfolio-audio");
const cursor = document.querySelector("[data-cursor]");
const canvas = document.querySelector("#heist-scene");
const ctx = canvas.getContext("2d", { alpha: true });

let progress = 0;
const loadingTimer = window.setInterval(() => {
  progress = Math.min(progress + Math.random() * 4.5 + 1.8, 100);
  loaderBar.style.width = `${progress}%`;
  loaderCount.textContent = `${Math.round(progress)}%`;

  if (progress >= 100) {
    window.clearInterval(loadingTimer);
    window.setTimeout(() => loader.classList.add("is-hidden"), 1500);
  }
}, 130);

audioToggle?.addEventListener("click", () => {
  if (!portfolioAudio) return;

  if (!portfolioAudio.paused) {
    portfolioAudio.pause();
    audioToggle.classList.remove("is-on");
    audioToggle.textContent = "Audio";
    return;
  }

  portfolioAudio.volume = 0.62;
  portfolioAudio.play().then(() => {
    audioToggle.classList.add("is-on");
    audioToggle.textContent = "Audio On";
  });
});

document.addEventListener("pointermove", (event) => {
  document.documentElement.style.setProperty("--mouse-x", event.clientX);
  document.documentElement.style.setProperty("--mouse-y", event.clientY);
  cursor.style.left = `${event.clientX}px`;
  cursor.style.top = `${event.clientY}px`;
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll("[data-section]").forEach((section) => observer.observe(section));

if (ctx) {
  const pointer = { x: 0.5, y: 0.5 };
  const bills = [];
  const sparks = [];
  const lasers = [
    { y: 0.22, speed: 0.00042, angle: -0.18 },
    { y: 0.58, speed: -0.00036, angle: 0.14 },
    { y: 0.78, speed: 0.00031, angle: -0.08 },
    { y: 0.38, speed: -0.00028, angle: -0.28 },
  ];

  const random = (min, max) => min + Math.random() * (max - min);

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const createBill = () => ({
    x: random(-120, window.innerWidth + 120),
    y: random(-window.innerHeight, -40),
    w: random(72, 124),
    h: random(34, 58),
    speed: random(2.2, 5.6),
    drift: random(-1.4, 1.4),
    rotate: random(-Math.PI, Math.PI),
    spin: random(-0.052, 0.052),
    hue: random(0.75, 1),
    alpha: random(0.46, 0.86),
  });

  const createSpark = () => ({
    x: random(0, window.innerWidth),
    y: random(-window.innerHeight, window.innerHeight),
    r: random(0.8, 2.8),
    speed: random(2.6, 6.4),
    alpha: random(0.3, 0.95),
  });

  const roundedRect = (x, y, width, height, radius) => {
    if (ctx.roundRect) {
      ctx.roundRect(x, y, width, height, radius);
      return;
    }
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
  };

  const seed = () => {
    bills.length = 0;
    sparks.length = 0;
    const billCount = Math.min(92, Math.floor(window.innerWidth / 14));
    const sparkCount = Math.min(160, Math.floor(window.innerWidth / 6));
    for (let i = 0; i < billCount; i += 1) bills.push(createBill());
    for (let i = 0; i < sparkCount; i += 1) sparks.push(createSpark());
  };

  const drawBill = (bill) => {
    ctx.save();
    ctx.translate(bill.x, bill.y);
    ctx.rotate(bill.rotate);
    ctx.globalAlpha = bill.alpha;
    const billGradient = ctx.createLinearGradient(-bill.w / 2, 0, bill.w / 2, 0);
    billGradient.addColorStop(0, "rgba(85, 155, 92, 0.92)");
    billGradient.addColorStop(0.5, "rgba(196, 235, 176, 0.96)");
    billGradient.addColorStop(1, "rgba(66, 132, 76, 0.9)");
    ctx.fillStyle = billGradient;
    ctx.strokeStyle = "rgba(211, 255, 196, 0.84)";
    ctx.lineWidth = 1.2;
    ctx.shadowColor = "rgba(88, 255, 108, 0.42)";
    ctx.shadowBlur = 14;
    ctx.beginPath();
    roundedRect(-bill.w / 2, -bill.h / 2, bill.w, bill.h, 5);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(12, 76, 32, 0.58)";
    ctx.strokeRect(-bill.w / 2 + 8, -bill.h / 2 + 7, bill.w - 16, bill.h - 14);
    ctx.beginPath();
    ctx.arc(0, 0, Math.min(bill.w, bill.h) * 0.22, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(9, 70, 30, 0.82)";
    ctx.font = `900 ${Math.max(18, bill.h * 0.48)}px Inter, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("$", 0, 1);
    ctx.font = `800 ${Math.max(9, bill.h * 0.22)}px Inter, sans-serif`;
    ctx.fillText("$", -bill.w * 0.34, -bill.h * 0.24);
    ctx.fillText("$", bill.w * 0.34, bill.h * 0.24);
    ctx.restore();
  };

  const drawVaultRings = (time) => {
    const cx = window.innerWidth * (0.72 + (pointer.x - 0.5) * 0.05);
    const cy = window.innerHeight * (0.42 + (pointer.y - 0.5) * 0.05);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(time * 0.00012);
    for (let i = 0; i < 4; i += 1) {
      const radius = 120 + i * 58 + Math.sin(time * 0.0014 + i) * 8;
      ctx.globalAlpha = 0.16 - i * 0.022;
      ctx.strokeStyle = i % 2 ? "#ff2b2b" : "#ff8b4a";
      ctx.lineWidth = i === 0 ? 2.4 : 1.2;
      ctx.setLineDash([18, 16]);
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
    ctx.setLineDash([]);
  };

  const drawLasers = (time) => {
    lasers.forEach((laser, index) => {
      const y = ((laser.y + time * laser.speed) % 1) * window.innerHeight;
      ctx.save();
      ctx.translate(window.innerWidth / 2, y);
      ctx.rotate(laser.angle + Math.sin(time * 0.0007 + index) * 0.05);
      const gradient = ctx.createLinearGradient(-window.innerWidth, 0, window.innerWidth, 0);
      gradient.addColorStop(0, "rgba(255, 0, 0, 0)");
      gradient.addColorStop(0.5, "rgba(255, 18, 18, 0.62)");
      gradient.addColorStop(1, "rgba(255, 0, 0, 0)");
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2.2;
      ctx.shadowColor = "rgba(255, 0, 0, 0.9)";
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.moveTo(-window.innerWidth, 0);
      ctx.lineTo(window.innerWidth, 0);
      ctx.stroke();
      ctx.restore();
    });
  };

  const render = (time) => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    const bg = ctx.createRadialGradient(
      window.innerWidth * 0.74,
      window.innerHeight * 0.28,
      20,
      window.innerWidth * 0.5,
      window.innerHeight * 0.5,
      window.innerWidth
    );
    bg.addColorStop(0, "rgba(255, 0, 0, 0.24)");
    bg.addColorStop(0.42, "rgba(45, 0, 0, 0.34)");
    bg.addColorStop(1, "rgba(0, 0, 0, 0.96)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    drawVaultRings(time);
    drawLasers(time);

    sparks.forEach((spark) => {
      spark.y += spark.speed;
      if (spark.y > window.innerHeight + 20) {
        Object.assign(spark, createSpark(), { y: -20 });
      }
      ctx.globalAlpha = spark.alpha;
      ctx.fillStyle = "#ff2b2b";
      ctx.shadowColor = "rgba(255, 0, 0, 0.9)";
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(spark.x, spark.y, spark.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.shadowBlur = 0;
    bills.forEach((bill) => {
      bill.y += bill.speed;
      bill.x += bill.drift + Math.sin(time * 0.001 + bill.y * 0.01) * 0.35;
      bill.rotate += bill.spin;
      if (bill.y > window.innerHeight + 80) {
        Object.assign(bill, createBill(), { y: -80 });
      }
      drawBill(bill);
    });

    ctx.globalAlpha = 1;
    ctx.fillStyle = "rgba(0, 0, 0, 0.46)";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    requestAnimationFrame(render);
  };

  document.addEventListener("pointermove", (event) => {
    pointer.x = event.clientX / window.innerWidth;
    pointer.y = event.clientY / window.innerHeight;
  });

  window.addEventListener("resize", () => {
    resize();
    seed();
  });

  resize();
  seed();
  requestAnimationFrame(render);
}
