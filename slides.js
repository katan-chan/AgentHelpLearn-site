// Một slide một lúc. Hash #N là số slide (1-based) để chia sẻ và để Back/Forward chạy.
// Không có JS thì mọi slide hiện xếp dọc, trang vẫn đọc được.
const slides = [...document.querySelectorAll('.slide')]
const vach = document.querySelector('.vach')
document.body.classList.add('co-js')

slides.forEach((s, i) => {
  const li = document.createElement('li')
  li.innerHTML = `<a href="#${i + 1}" aria-label="${s.getAttribute('aria-label')}"></a>`
  vach.append(li)
})

function soHienTai() {
  const n = parseInt(location.hash.slice(1), 10)
  return n >= 1 && n <= slides.length ? n : 1
}

function hien() {
  const n = soHienTai()
  slides.forEach((s, i) => { s.hidden = i !== n - 1 })
  slides[n - 1].scrollTop = 0
  vach.querySelectorAll('a').forEach((a, i) => a.toggleAttribute('aria-current', i === n - 1))
  document.querySelector('.truoc').disabled = n === 1
  document.querySelector('.sau').disabled = n === slides.length
}

function di(buoc) {
  location.hash = String(Math.min(Math.max(soHienTai() + buoc, 1), slides.length))
}

document.querySelector('.truoc').addEventListener('click', () => di(-1))
document.querySelector('.sau').addEventListener('click', () => di(1))
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); di(1) }
  if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); di(-1) }
})

// Vuốt ngang ≥ 50px mới tính; vuốt dọc để cuộn trong slide thì bỏ qua.
let x0 = null, y0 = null
document.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY }, { passive: true })
document.addEventListener('touchend', (e) => {
  if (x0 === null) return
  const dx = e.changedTouches[0].clientX - x0
  const dy = e.changedTouches[0].clientY - y0
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) di(dx < 0 ? 1 : -1)
  x0 = null
})

// Vùng sáng: figure.man[data-vung] giữ các vùng "x,y,w,h;..." trên ảnh gốc 1280x800,
// theo thứ tự các nút trong .diem. Bấm, rê chuột hay focus nút nào thì sáng vùng đó.
const DEM = 8 // px đệm quanh vùng, tính trên ảnh gốc
document.querySelectorAll('.buoc').forEach((slide) => {
  const fig = slide.querySelector('.man')
  const den = fig.querySelector('.den')
  const vung = fig.dataset.vung.split(';').map((v) => v.split(',').map(Number))
  const nut = [...slide.querySelectorAll('.diem button')]
  function chon(i) {
    const [x, y, w, h] = vung[i]
    Object.assign(den.style, {
      left: `${(x - DEM) / 12.8}%`, top: `${(y - DEM) / 8}%`,
      width: `${(w + 2 * DEM) / 12.8}%`, height: `${(h + 2 * DEM) / 8}%`,
    })
    nut.forEach((b, j) => b.setAttribute('aria-pressed', String(j === i)))
  }
  nut.forEach((b, i) => {
    b.addEventListener('click', () => chon(i))
    b.addEventListener('mouseenter', () => chon(i))
    b.addEventListener('focus', () => chon(i))
  })
  chon(0)
})

window.addEventListener('hashchange', hien)
hien()
