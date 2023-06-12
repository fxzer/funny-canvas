<template>
  <div ref="wrap" class="w-full h-full">
    <canvas ref="canvas"></canvas>
  </div>
</template>


<script setup>

import { ref, onMounted, onUnmounted } from 'vue';
const wrap = ref(null);
const canvas = ref(null);
const ctx = ref(null);
const particles = ref([]);
const particleRadius = 2;
const attrtchDistance = 180;
const connectionDistance = 120;
const connectionOpacity = 0.2;
let mouseX = 0;
let mouseY = 0;

const initializeCanvas = () => {
  const { width, height } = wrap.value.getBoundingClientRect();
  canvas.value.width = width;
  canvas.value.height = height;
};

const createParticles = () => {
  for (let i = 0; i < 100; i++) {
    const particle = {
      x: Math.random() * canvas.value.width,
      y: Math.random() * canvas.value.height,
      dx: Math.random() * 2 - 1,
      dy: Math.random() * 2 - 1
    };
    particles.value.push(particle);
  }
};

const animateParticles = () => {
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
  particles.value.forEach(particle => {
    
    const distance = Math.sqrt(
      Math.pow(particle.x - mouseX, 2) +
      Math.pow(particle.y - mouseY, 2)
    );
    if (distance < attrtchDistance   ) {
      const opacity = 1 - distance / attrtchDistance;
      ctx.value.beginPath();
      ctx.value.moveTo(particle.x, particle.y);
      ctx.value.lineTo(mouseX, mouseY);
      ctx.value.strokeStyle = `rgba(0, 0, 0, ${opacity * connectionOpacity})`;
      ctx.value.stroke();
      ctx.value.closePath();
    }
    //如果<180并且大于120，则吸引
    if (distance < attrtchDistance && distance > connectionDistance) {
      if (distance < connectionDistance.value + 10) {
        particle.x += (mouseX - particle.x) * 0.002
        particle.y += (mouseY - particle.y) * 0.002
      }
      else {
        particle.x += (mouseX - particle.x) * 0.02;
        particle.y += (mouseY - particle.y) * 0.02;
      }
    }else{
      particle.x += particle.dx;
      particle.y += particle.dy;
    }

    if (particle.x < particleRadius || particle.x > canvas.value.width - particleRadius) {
      particle.dx *= -1;
    }

    if (particle.y < particleRadius || particle.y > canvas.value.height - particleRadius) {
      particle.dy *= -1;
    }

    ctx.value.beginPath();
    ctx.value.arc(particle.x, particle.y, particleRadius, 0, Math.PI * 2);
    ctx.value.fillStyle = '#000';
    ctx.value.fill();
    ctx.value.closePath();

 
    particles.value.forEach(otherParticle => {
      if (particle !== otherParticle) {
        const dp = Math.sqrt(
          Math.pow(particle.x - otherParticle.x, 2) +
          Math.pow(particle.y - otherParticle.y, 2)
        );

        if (dp < connectionDistance ) {
          const opacity = 1 - dp / connectionDistance;
          ctx.value.beginPath();
          ctx.value.moveTo(particle.x, particle.y);
          ctx.value.lineTo(otherParticle.x, otherParticle.y);
          ctx.value.strokeStyle = `rgba(0, 0, 0, ${opacity * connectionOpacity})`;
          ctx.value.stroke();
          ctx.value.closePath();
        }
      }
    });

    
  });

  requestAnimationFrame(animateParticles);
};

const handleMouseMove = (event) => {
  const rect = wrap.value.getBoundingClientRect();
  mouseX = event.clientX - rect.left;
  mouseY = event.clientY - rect.top;
};

onMounted(() => {
  canvas.value = canvas.value;
  ctx.value = canvas.value.getContext('2d');
  initializeCanvas();
  createParticles();
  animateParticles();
  canvas.value.addEventListener('mousemove', handleMouseMove);
});

onUnmounted(() => {
  cancelAnimationFrame(animateParticles);
  canvas.value?.removeEventListener('mousemove', handleMouseMove);
});
</script>

