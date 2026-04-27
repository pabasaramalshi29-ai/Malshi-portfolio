
// ── Cursor ──
const cur = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
let mx=0, my=0, rx=0, ry=0;
document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY;
cur.style.left=mx+'px'; cur.style.top=my+'px'; });
(function loop(){ rx+=(mx-rx)*.11; ry+=(my-ry)*.11;
ring.style.left=rx+'px'; ring.style.top=ry+'px';
requestAnimationFrame(loop); })();

// ── Scroll Reveal ──
const io = new IntersectionObserver(entries => {
entries.forEach(e => {
    if(e.isIntersecting) {
    e.target.classList.add('on');
    e.target.querySelectorAll('.bar-fill').forEach(b => {
        setTimeout(()=>{ b.style.width = b.dataset.w+'%'; }, 350);
    });
    }
});
}, { threshold:.12 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// also watch bars directly
document.querySelectorAll('.bar-fill').forEach(bar => {
const bo = new IntersectionObserver(entries => {
    if(entries[0].isIntersecting) {
    setTimeout(()=>{ bar.style.width = bar.dataset.w+'%'; }, 400);
    bo.disconnect();
    }
}, { threshold:.5 });
bo.observe(bar);
});
