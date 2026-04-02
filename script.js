document.addEventListener('DOMContentLoaded', () => {
    
    // 1. AŞAĞI KAYDIRDIKÇA GÖRÜNÜR OLMA (FADE-IN) EFEKTLERİ
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // 2. DİNAMİK İSTATİSTİK SAYAÇLARI
    const counters = document.querySelectorAll('.counter');
    const speed = 200; 

    const startCounters = (entry, observer) => {
        if (!entry.isIntersecting) return; 

        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 15);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });

        observer.unobserve(entry.target); 
    };

    const counterObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            startCounters(entry, observer);
        });
    }, {
        threshold: 0.5 
    });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        counterObserver.observe(statsSection);
    }

});// 3. MOBİL MENÜ
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if(menuToggle){
menuToggle.addEventListener("click", () => {
navLinks.classList.toggle("active");
});
}// --- 1. Enerji Partikülleri ---
const particleBg = document.createElement('canvas');
particleBg.classList.add('particle-bg');
document.body.appendChild(particleBg);
const ctx = particleBg.getContext('2d');
let particles = [];
const particleCount = 80;

function initParticles(){
    particles = [];
    for(let i=0;i<particleCount;i++){
        particles.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            r: Math.random() * 2 + 1,
            dx: (Math.random()-0.5)*0.5,
            dy: (Math.random()-0.5)*0.5
        });
    }
}

function animateParticles(){
    ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
    particles.forEach(p=>{
        p.x += p.dx;
        p.y += p.dy;
        if(p.x < 0 || p.x > window.innerWidth) p.dx*=-1;
        if(p.y < 0 || p.y > window.innerHeight) p.dy*=-1;
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle='rgba(212,175,55,0.15)';
        ctx.fill();
    });
    requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', () => {
    particleBg.width = window.innerWidth;
    particleBg.height = window.innerHeight;
    initParticles();
});

particleBg.width = window.innerWidth;
particleBg.height = window.innerHeight;
initParticles();
animateParticles();

// --- 2. Parallax Hero Başlığı ---
const heroContent = document.querySelector('.hero-content');
window.addEventListener('mousemove', (e)=>{
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    heroContent.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
});

// --- 3. Gelişmiş Sayaç Animasyonu ---
const counters = document.querySelectorAll('.counter');
const speed = 150;

const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            counters.forEach(counter=>{
                let target = +counter.dataset.target;
                let count = 0;
                const step = () => {
                    count += Math.ceil(target/speed);
                    if(count < target){
                        counter.innerText = count;
                        requestAnimationFrame(step);
                    } else {
                        counter.innerText = target;
                    }
                }
                step();
            });
        }
    });
}, {threshold: 0.5});

const statsSection = document.querySelector('.stats-section');
if(statsSection) counterObserver.observe(statsSection);