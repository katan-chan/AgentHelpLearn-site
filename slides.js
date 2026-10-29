// Một slide một lúc. Hash #N là số slide (1-based) để chia sẻ và để Back/Forward chạy.
// Không có JS thì mọi slide hiện xếp dọc — trang vẫn đọc được.
const slides = [...document.querySelectorAll('.slide')]
const viTri = document.querySelector('.vi-tri')
document.body.classList.add('co-js')

function soHienTai() {
  const n = parseInt(location.hash.slice(1), 10)
  return n >= 1 && n <= slides.length ? n : 1
}

function hien() {
  const n = soHienTai()
  slides.forEach((s, i) => { s.hidden = i !== n - 1 })
  slides[n - 1].scrollTop = 0
  viTri.textContent = `${n} / ${slides.length}`
  document.querySelector('.truoc').disabled = n === 1
  document.querySelector('.sau').disabled = n === slides.length
}

function di(buoc) {
  const n = Math.min(Math.max(soHienTai() + buoc, 1), slides.length)
  location.hash = String(n)
}

document.querySelector('.truoc').addEventListener('click', () => di(-1))
document.querySelector('.sau').addEventListener('click', () => di(1))
document.addEventListener('keydown', (e) => {
  if (e.target.closest('input, textarea, select')) return
  if (e.key === 'ArrowRight' || e.key === 'PageDown') di(1)
  if (e.key === 'ArrowLeft' || e.key === 'PageUp') di(-1)
})

// Vuốt ngang ≥ 50px mới tính; vuốt dọc để cuộn chữ trong slide thì bỏ qua.
let x0 = null, y0 = null
document.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY }, { passive: true })
document.addEventListener('touchend', (e) => {
  if (x0 === null) return
  const dx = e.changedTouches[0].clientX - x0
  const dy = e.changedTouches[0].clientY - y0
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) di(dx < 0 ? 1 : -1)
  x0 = null
})

window.addEventListener('hashchange', hien)
hien()
