// ...existing code...
// --------------------------
// Carousel (com guardas)
// --------------------------
const wrapper = document.querySelector('.carousel-wrapper');
const items = document.querySelectorAll('.carousel-item');
const dots = document.querySelectorAll('.dot');
const next = document.querySelector('.right');
const prev = document.querySelector('.left');

let index = 0;

function updateCarousel() {
  if (!wrapper || items.length === 0) return;
  wrapper.style.transform = `translateX(-${index * 100}%)`;
  if (dots && dots.length > 0) {
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[index]) dots[index].classList.add('active');
  }
}

if (next && prev && items.length > 0) {
  next.addEventListener('click', () => {
    index = (index + 1) % items.length;
    updateCarousel();
  });

  prev.addEventListener('click', () => {
    index = (index - 1 + items.length) % items.length;
    updateCarousel();
  });

  if (dots && dots.length > 0) {
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        index = i;
        updateCarousel();
      });
    });
  }

  // autoplay opcional
  if (items.length > 1 && wrapper) {
    setInterval(() => {
      index = (index + 1) % items.length;
      updateCarousel();
    }, 5000);
  }
}

// --------------------------
// SISTEMA LOGIN + REGISTER
// --------------------------
const loginModal = document.getElementById("loginModal");
const btnLogin = document.getElementById("btnLogin");
const fecharLogin = document.getElementById("fecharLogin");

const loginArea = document.getElementById("loginArea");
const registrarArea = document.getElementById("registrarArea");

const abrirRegistrar = document.getElementById("abrirRegistrar");
const abrirLogin = document.getElementById("abrirLogin");

const entrarBtn = document.getElementById("entrarBtn");
const registrarBtn = document.getElementById("registrarBtn");

const loginErro = document.getElementById("loginErro");
const registroErro = document.getElementById("registroErro");

window.mostrarLogin = function mostrarLogin() {
  if (loginArea) loginArea.style.display = "block";
  if (registrarArea) registrarArea.style.display = "none";
  if (loginErro) loginErro.textContent = "";
  // reposicionar o modal entre main e footer quando for mostrado
  setTimeout(() => {
    positionModalBetweenMainFooter();
  }, 0);
  // impedir rolagem da página enquanto o modal estiver aberto
  try { document.body.style.overflow = 'hidden'; document.documentElement.style.overflow = 'hidden'; } catch (err) {}
};

// calcula e posiciona o modal verticalmente entre o final de <main> e o início do <footer>
function positionModalBetweenMainFooter() {
  const loginBoxEl = document.querySelector('.login-box.glass');
  const mainEl = document.querySelector('main');
  const footerEl = document.querySelector('footer');
  if (!loginModal || !loginBoxEl) return;
  // modal não visível: nada a fazer
  const modalStyle = window.getComputedStyle(loginModal);
  if (modalStyle.display === 'none' || modalStyle.visibility === 'hidden') return;

  // se main e footer existirem, posiciona entre eles; caso contrário, centraliza na viewport
  if (mainEl && footerEl) {
    const mainRect = mainEl.getBoundingClientRect();
    const footerRect = footerEl.getBoundingClientRect();

    // center between bottom of main and top of footer (ambos em relação ao viewport)
    let centerY = (mainRect.bottom + footerRect.top) / 2;
    let top = centerY - (loginBoxEl.offsetHeight / 2);

    // limites para evitar recortar fora da viewport
    const minTop = window.innerHeight * 0.05;
    const maxTop = window.innerHeight - loginBoxEl.offsetHeight - window.innerHeight * 0.05;
    if (top < minTop) top = minTop;
    if (top > maxTop) top = maxTop;

    // aplicar como fixed relativo à viewport
    loginBoxEl.style.position = 'fixed';
    loginBoxEl.style.left = '50%';
    loginBoxEl.style.transform = 'translateX(-50%)';
    loginBoxEl.style.top = `${Math.round(top)}px`;
  } else {
    // fallback: center of viewport
    loginBoxEl.style.position = 'fixed';
    loginBoxEl.style.left = '50%';
    loginBoxEl.style.top = '50%';
    loginBoxEl.style.transform = 'translate(-50%,-50%)';
  }
}

// recalc on resize/scroll while modal is open (debounced)
let _posTimer = null;
function schedulePositionRecalc() {
  if (_posTimer) clearTimeout(_posTimer);
  _posTimer = setTimeout(() => {
    positionModalBetweenMainFooter();
    _posTimer = null;
  }, 80);
}
window.addEventListener('resize', schedulePositionRecalc);
window.addEventListener('scroll', schedulePositionRecalc);

if (btnLogin && loginModal) {
  btnLogin.addEventListener("click", () => {
    loginModal.style.display = "flex";
    window.mostrarLogin();
  });
}

if (fecharLogin && loginModal) {
  fecharLogin.addEventListener("click", () => {
    loginModal.style.display = "none";
    // limpar estilos aplicados dinamicamente ao fechar
    const loginBoxEl = document.querySelector('.login-box.glass');
    if (loginBoxEl) {
      loginBoxEl.style.top = '';
      loginBoxEl.style.left = '';
      loginBoxEl.style.transform = '';
      loginBoxEl.style.position = '';
    }
    // restaurar rolagem da página
    try { document.body.style.overflow = ''; document.documentElement.style.overflow = ''; } catch (err) {}
  });
}

if (abrirRegistrar) {
  abrirRegistrar.addEventListener('click', () => {
    if (loginArea) loginArea.style.display = "none";
    if (registrarArea) registrarArea.style.display = "block";
    // reposicionar o modal apos alternar para registrar
    setTimeout(positionModalBetweenMainFooter, 0);
  });
}

if (abrirLogin) {
  abrirLogin.addEventListener("click", () => {
    window.mostrarLogin();
    setTimeout(positionModalBetweenMainFooter, 0);
  });
}

if (registrarBtn) {
  registrarBtn.addEventListener("click", (e) => {
    // impedir comportamento padrão (submit de formulário) que pode redirecionar a página
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const nome = document.getElementById("regNome")?.value || "";
    const email = document.getElementById("regEmail")?.value || "";
    const senha = document.getElementById("regSenha")?.value || "";

    if (!nome || !email || !senha) {
      alert("Preencha todos os campos!");
      return;
    }

    localStorage.setItem("usuarioNome", nome);
    localStorage.setItem("usuarioEmail", email);
    localStorage.setItem("usuarioSenha", senha);

    alert("Cadastro realizado com sucesso!");
    window.mostrarLogin();
  });
}

if (entrarBtn) {
  entrarBtn.addEventListener("click", (e) => {
    // impedir comportamento padrão (submit de formulário) que pode redirecionar a página
    if (e && typeof e.preventDefault === 'function') e.preventDefault();

    const email = document.getElementById("userLogin")?.value || "";
    const senha = document.getElementById("userSenha")?.value || "";

    const emailSalvo = localStorage.getItem("usuarioEmail");
    const senhaSalva = localStorage.getItem("usuarioSenha");

    if (email === emailSalvo && senha === senhaSalva) {
      localStorage.setItem("usuarioLogado", "true");
      if (loginModal) loginModal.style.display = "none";
      // restaurar rolagem da página após login
      try { document.body.style.overflow = ''; document.documentElement.style.overflow = ''; } catch (err) {}
      alert("Login realizado com sucesso!");
    } else {
      if (loginErro) loginErro.textContent = "Email ou senha incorretos!";
    }
  });
}

// --------------------------
// CARRINHO
// --------------------------
const btnCarrinho = document.getElementById("btnCarrinho");
const fecharCarrinho = document.getElementById("fecharCarrinho");
const carrinho = document.getElementById("carrinho");
const listaCarrinho = document.getElementById("listaCarrinho");
const totalCarrinho = document.getElementById("totalCarrinho");
const btnComprar = document.getElementById("btnComprar");

let total = 0;

function atualizarTotal() {
  totalCarrinho.textContent = total.toFixed(2);
}

if (btnCarrinho) {
  btnCarrinho.addEventListener("click", () => {
    carrinho.classList.add("ativo");
  });
}

if (fecharCarrinho) {
  fecharCarrinho.addEventListener("click", () => {
    carrinho.classList.remove("ativo");
  });
}

document.querySelectorAll(".addCart").forEach(btn => {
  btn.addEventListener("click", () => {
    const nome = btn.dataset.nome;
    const preco = parseFloat(btn.dataset.preco);

    const li = document.createElement("li");
    li.innerHTML = `${nome} - R$ ${preco.toFixed(2)} <button class="remove-btn">X</button>`;
    listaCarrinho.appendChild(li);

    total += preco;
    atualizarTotal();

    li.querySelector(".remove-btn").addEventListener("click", () => {
      li.remove();
      total -= preco;
      atualizarTotal();
    });
  });
});

if (btnComprar) {
  btnComprar.addEventListener("click", (e) => {
    e.preventDefault();

    const logado = localStorage.getItem("usuarioLogado") === "true";
    if (!logado) {
      alert("Faça login antes de comprar!");
      loginModal.style.display = "flex";
      window.mostrarLogin();
      return;
    }

    if (total <= 0) {
      alert("Carrinho vazio!");
      return;
    }

    alert("Compra finalizada!");

    listaCarrinho.innerHTML = "";
    total = 0;
    atualizarTotal();
    carrinho.classList.remove("ativo");
  });
}

/* ======= TRANSIÇÃO AO ENTRAR ======= */
document.body.classList.add("page-transition");

setTimeout(() => {
  document.body.classList.add("show");
}, 50);

/* ======= TRANSIÇÃO AO SAIR ======= */
document.querySelectorAll("a").forEach(link => {
  // ignore anchors used as UI toggles or with no href/fragment
  const hrefAttr = link.getAttribute && link.getAttribute('href');
  const href = hrefAttr ? hrefAttr.trim() : '';
  const isToggle = link.dataset && (link.dataset.noTransition === 'true');
  const isRoleButton = link.getAttribute && link.getAttribute('role') === 'button';
  const shouldSkip = !href || href.startsWith('#') || isToggle || isRoleButton || link.target;

  if (!shouldSkip) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const url = this.href;

      if (url.includes("index")) {
        document.body.style.transform = "translateX(-80px)";
      } else {
        document.body.style.transform = "translateX(80px)";
      }

      document.body.style.opacity = "0";

      setTimeout(() => {
        window.location.href = url;
      }, 400);
    });
  }
});
// ...existing code...
