import "./style.css"

// Dark mode toggle 
const btn = document.getElementById('toggleDark') 
const html = document.documentElement  
// Cek preferensi tersimpan 
if (localStorage.getItem('theme') === 'dark') { 
  html.classList.add('dark') 
  btn.textContent = 'light' 
}  
btn.addEventListener('click', () => { 
 html.classList.toggle('dark') 
  const isDark = html.classList.contains('dark') 
  btn.textContent = isDark ? 'light' : 'dark' 
  localStorage.setItem('theme', isDark ? 'dark' : 'light') 
})
