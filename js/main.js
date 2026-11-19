// Deigiane Lima · antes e depois, agendamento pelo WhatsApp e animações

const WA = "5581992519055";

/* ===== Antes e depois ===== */
const BA = {
  alinhamento: {
    antes: "img/alinhamento-antes.jpg",
    depois: "img/alinhamento-depois.jpg",
    altAntes: "Antes: cabelo crespo com bastante volume",
    altDepois: "Depois: cabelo alinhado e brilhante",
    legenda: "Cabelo crespo com volume para fios alinhados, com brilho e movimento.",
  },
  perola: {
    antes: "img/perola-antes.jpg",
    depois: "img/perola-depois.jpg",
    altAntes: "Antes: cachos escuros com pontas claras",
    altDepois: "Depois: loiro pérola cacheado",
    legenda: "Cachos escuros para um loiro pérola que chama atenção por onde passa.",
  },
};

const ba = document.getElementById("ba");
const range = document.getElementById("baRange");
const imgAntes = document.getElementById("baBefore");
const imgDepois = document.getElementById("baAfter");

range.addEventListener("input", () => ba.style.setProperty("--pos", range.value + "%"));

document.querySelectorAll("[data-ba]").forEach((tab) => {
  tab.addEventListener("click", () => {
    const d = BA[tab.dataset.ba];
    document.querySelectorAll("[data-ba]").forEach((t) => t.setAttribute("aria-selected", t === tab));
    imgAntes.style.opacity = imgDepois.style.opacity = 0;
    setTimeout(() => {
      imgAntes.src = d.antes; imgAntes.alt = d.altAntes;
      imgDepois.src = d.depois; imgDepois.alt = d.altDepois;
      imgAntes.style.opacity = imgDepois.style.opacity = 1;
    }, 250);
    document.getElementById("baCaption").textContent = d.legenda;
    range.value = 50;
    ba.style.setProperty("--pos", "50%");
  });
});

// Dica de arraste: a linha passeia uma vez quando o comparador aparece
let dicaFeita = false;
new IntersectionObserver((entradas, obs) => {
  if (!entradas[0].isIntersecting || dicaFeita) return;
  dicaFeita = true; obs.disconnect();
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const passos = [50, 70, 30, 50];
  let i = 0, de = 50, t0 = null;
  function anima(t) {
    if (!t0) t0 = t;
    const p = Math.min((t - t0) / 600, 1);
    const ease = 0.5 - Math.cos(p * Math.PI) / 2;
    const v = de + (passos[i + 1] - de) * ease;
    ba.style.setProperty("--pos", v + "%"); range.value = v;
    if (p < 1) return requestAnimationFrame(anima);
    i++; de = passos[i]; t0 = null;
    if (i < passos.length - 1) requestAnimationFrame(anima);
  }
  setTimeout(() => requestAnimationFrame(anima), 400);
}, { threshold: 0.6 }).observe(ba);

/* ===== Agendamento ===== */
const form = document.getElementById("book");
const diasEl = document.getElementById("days");
const SEMANA = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const SEMANA_LONGA = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

// Próximos 12 dias, sem domingo
(function montarDias() {
  const hoje = new Date();
  let n = 0;
  for (let i = 0; n < 12; i++) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + i);
    if (d.getDay() === 0) continue;
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const rotulo = i === 0 ? "hoje" : i === 1 ? "amanhã" : SEMANA[d.getDay()];
    const valor = `${SEMANA_LONGA[d.getDay()]}, ${dd}/${mm}`;
    diasEl.insertAdjacentHTML("beforeend",
      `<label><input type="radio" name="dia" value="${valor}"${n === 0 ? " checked" : ""}><span><small>${rotulo}</small><b>${dd}</b></span></label>`);
    n++;
  }
})();

function atualizarMensagem() {
  const dados = new FormData(form);
  const nome = (dados.get("nome") || "").trim();
  const servico = dados.get("servico");
  const msg =
    `Olá, Deigiane! ${nome ? `Sou ${nome} e v` : "V"}im pelo site.\n` +
    (servico === "Avaliação"
      ? `Queria uma avaliação do meu cabelo.\n`
      : `Gostaria de agendar: ${servico}.\n`) +
    `Dia: ${dados.get("dia")}, de ${dados.get("periodo")}.\n` +
    `Tem horário disponível?`;
  document.getElementById("preview").textContent = msg;
  document.getElementById("bookBtn").href = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
}
form.addEventListener("input", atualizarMensagem);
form.addEventListener("change", atualizarMensagem);
form.addEventListener("submit", (e) => e.preventDefault());
atualizarMensagem();

// "Agendar este serviço" nos cards: marca o serviço e rola até o formulário
document.querySelectorAll("[data-servico]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const opcao = form.querySelector(`input[name="servico"][value="${btn.dataset.servico}"]`);
    if (opcao) { opcao.checked = true; atualizarMensagem(); }
    document.getElementById("agendar").scrollIntoView({ behavior: "smooth" });
  });
});

/* ===== Entrada suave ===== */
const io = new IntersectionObserver((entradas) => {
  entradas.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = (i % 3) * 80 + "ms";
  io.observe(el);
});
