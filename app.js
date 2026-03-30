// Sistema de Gerenciamento de Conteúdo para Vercel
class ContentManager {
  constructor() {
    this.content = {};
    this.editMode = false;
    this.currentImageUpload = null;
    this.currentImageField = null;
    this.init();
  }

  async init() {
    await this.loadContent();
    this.setupEventListeners();
    this.renderContent();
    this.setupAnimations();
  }

  // Carregar conteúdo do JSON
  async loadContent() {
    try {
      // Tentar carregar do localStorage primeiro (edições recentes)
      const savedContent = localStorage.getItem('scw_content_draft');
      if (savedContent) {
        this.content = JSON.parse(savedContent);
        console.log('Conteúdo carregado do localStorage');
      } else {
        // Se não houver no localStorage, carregar do arquivo
        const response = await fetch('content.json');
        this.content = await response.json();
        console.log('Conteúdo carregado do arquivo JSON');
      }
    } catch (error) {
      console.error('Erro ao carregar conteúdo:', error);
      // Fallback para conteúdo padrão
      this.content = this.getDefaultContent();
    }
  }

  // Renderizar conteúdo na página
  renderContent() {
    // Hero
    this.setElement('heroBadge', this.content.hero.badge);
    this.setElement('heroTitle', this.content.hero.title);
    this.setElement('heroSub', this.content.hero.subtitle);
    this.setElement('heroImg', this.content.hero.image, 'src');

    // Gallery
    this.setElement('gallEye', this.content.gallery.title);
    this.setElement('gallTitle', this.content.gallery.subtitle);
    this.setElement('gallDesc', this.content.gallery.description);
    this.renderChapters();

    // Quote
    this.setElement('quoteText', this.content.quote.text);
    this.setElement('quoteAuthor', this.content.quote.author);
    this.setElement('quoteImg', this.content.quote.image, 'src');

    // Memories
    this.setElement('memoriesTitle', this.content.memories.title);
    this.setElement('memoriesSubtitle', this.content.memories.subtitle);
    this.renderMemories();

    // Stats
    this.renderStats();

    // About
    this.setElement('aboutEye', this.content.about.title);
    this.setElement('aboutTitle', this.content.about.subtitle);
    this.setElement('aboutBody', this.content.about.description);
    this.setElement('aboutSig', this.content.about.signature);
    this.setElement('aboutImg', this.content.about.image, 'src');

    // Testimonials
    this.setElement('testiEye', this.content.testimonials.title);
    this.setElement('testiTitle', this.content.testimonials.subtitle);
    this.renderTestimonials();

    // Contact
    this.setElement('ctaEye', this.content.contact.title);
    this.setElement('ctaTitle', this.content.contact.subtitle);
    this.setElement('ctaImg', this.content.contact.image, 'src');

    // Footer
    this.setElement('footerTagline', this.content.site.tagline);
    this.setElement('footerCopy', this.content.site.copyright);

    // Setup contatos
    this.setupContacts();
  }

  // Renderizar capítulos da galeria
  renderChapters() {
    const container = document.getElementById('chaptersContainer');
    if (!container) return;

    container.innerHTML = this.content.gallery.chapters.map((chapter, index) => `
      <div class="chapter reveal ${index % 2 === 1 ? 'rev' : ''}" id="${chapter.id}">
        <div class="ch-img-wrap">
          <img id="${chapter.id}Img" src="${chapter.image}" alt="" class="editable-image" data-field="gallery.chapters[${index}].image">
          <div class="ch-num">${chapter.num}</div>
        </div>
        <div class="ch-text">
          <div class="ch-tag">
            <div class="ch-tag-line"></div>
            <span class="ch-tag-lbl editable" data-field="gallery.chapters[${index}].tag">${chapter.tag}</span>
          </div>
          <h3 class="ch-title editable" data-field="gallery.chapters[${index}].title">${chapter.title}</h3>
          <p class="ch-desc editable" data-field="gallery.chapters[${index}].description">${chapter.description}</p>
        </div>
      </div>
    `).join('');
  }

  // Renderizar memórias
  renderMemories() {
    const grid = document.getElementById('miniGrid');
    if (!grid) return;

    grid.innerHTML = this.content.memories.items.map(item => `
      <div class="mini-item">
        <img id="${item.id}" src="${item.image}" alt="" class="editable-image" data-field="memories.items[${this.content.memories.items.findIndex(i => i.id === item.id)}].image">
        <div class="mini-ov">
          <span class="mini-lbl editable" data-field="memories.items[${this.content.memories.items.findIndex(i => i.id === item.id)}].label">${item.label}</span>
        </div>
      </div>
    `).join('');
  }

  // Renderizar estatísticas
  renderStats() {
    const container = document.getElementById('statsContainer');
    if (!container) return;

    container.innerHTML = this.content.stats.map(stat => `
      <div class="stat">
        <div class="stat-n editable" data-field="stats[${this.content.stats.findIndex(s => s.id === stat.id)}].value">${stat.value}${stat.suffix || ''}</div>
        <div class="stat-l editable" data-field="stats[${this.content.stats.findIndex(s => s.id === stat.id)}].label">${stat.label}</div>
      </div>
    `).join('');
  }

  // Renderizar depoimentos
  renderTestimonials() {
    const scroll = document.getElementById('testiScroll');
    const dots = document.getElementById('testiDots');
    if (!scroll || !dots) return;

    scroll.innerHTML = this.content.testimonials.items.map(item => `
      <div class="testi-card">
        <div class="testi-q">"</div>
        <div class="testi-stars">${item.stars}</div>
        <p class="testi-text editable" data-field="testimonials.items[${this.content.testimonials.items.findIndex(i => i.id === item.id)}].text">${item.text}</p>
        <div class="testi-name editable" data-field="testimonials.items[${this.content.testimonials.items.findIndex(i => i.id === item.id)}].name">${item.name}</div>
        <div class="testi-date editable" data-field="testimonials.items[${this.content.testimonials.items.findIndex(i => i.id === item.id)}].date">${item.date}</div>
      </div>
    `).join('');

    dots.innerHTML = this.content.testimonials.items.map((_, index) => `
      <button class="testi-dot ${index === 0 ? 'act' : ''}" onclick="scrollTesti(${index})"></button>
    `).join('');
  }

  // Configurar contatos
  setupContacts() {
    const whatsappUrl = `https://wa.me/${this.content.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(this.content.contact.message)}`;
    
    const waBtn = document.getElementById('waBtn');
    const floatWa = document.getElementById('floatWa');
    const fWa = document.getElementById('fWa');
    
    if (waBtn) waBtn.onclick = () => window.open(whatsappUrl, '_blank');
    if (floatWa) floatWa.onclick = () => window.open(whatsappUrl, '_blank');
    if (fWa) fWa.href = whatsappUrl;

    const igBtn = document.getElementById('igBtn');
    const fInsta = document.getElementById('fInsta');
    if (igBtn) igBtn.onclick = () => window.open(this.content.contact.instagram, '_blank');
    if (fInsta) fInsta.href = this.content.contact.instagram;

    const fFace = document.getElementById('fFace');
    if (fFace) fFace.href = this.content.contact.facebook;
  }

  // Verificar acesso admin
  checkAdminAccess() {
    const editBtn = document.getElementById('editBtn');
    const urlParams = new URLSearchParams(window.location.search);
    const adminParam = urlParams.get('admin');
    
    // Mostrar botão apenas se o parâmetro admin estiver presente
    if (adminParam === 'true' || adminParam === 'scwedding2025') {
      if (editBtn) editBtn.style.display = 'inline-flex';
    } else {
      // Verificar se há senha no localStorage
      const adminPassword = localStorage.getItem('scw_admin_access');
      if (adminPassword === 'scwedding2025') {
        if (editBtn) editBtn.style.display = 'inline-flex';
      }
    }
  }

  // Configurar event listeners
  setupEventListeners() {
    // Verificar se é admin e mostrar botão de edição
    this.checkAdminAccess();

    // Edit mode toggle
    const editBtn = document.getElementById('editBtn');
    if (editBtn) {
      editBtn.addEventListener('click', () => this.toggleEditMode());
    }

    // Editable elements
    document.addEventListener('click', (e) => {
      if (this.editMode) {
        if (e.target.classList.contains('editable')) {
          this.makeEditable(e.target);
        } else if (e.target.classList.contains('editable-image')) {
          this.openImageUpload(e.target);
        }
      }
    });

    // Image upload
    const imageUpload = document.getElementById('imageUpload');
    if (imageUpload) {
      imageUpload.addEventListener('change', (e) => this.previewImageUpload(e));
    }
  }

  // Toggle modo de edição
  toggleEditMode() {
    this.editMode = !this.editMode;
    const controls = document.getElementById('editControls');
    const editBtn = document.getElementById('editBtn');
    
    if (this.editMode) {
      controls.classList.add('active');
      editBtn.textContent = '✕ Sair';
      document.body.classList.add('edit-mode');
    } else {
      controls.classList.remove('active');
      editBtn.textContent = '📝 Editar';
      document.body.classList.remove('edit-mode');
      this.clearEditMode();
    }
  }

  // Tornar elemento editável
  makeEditable(element) {
    // Remove edição de outros elementos
    document.querySelectorAll('.editing').forEach(el => {
      el.classList.remove('editing');
      el.contentEditable = false;
    });

    element.classList.add('editing');
    element.contentEditable = true;
    element.focus();

    // Selecionar todo o texto
    const range = document.createRange();
    range.selectNodeContents(element);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    // Salvar ao perder foco
    element.addEventListener('blur', () => {
      element.classList.remove('editing');
      element.contentEditable = false;
      this.saveField(element.dataset.field, element.innerHTML);
    }, { once: true });

    // Salvar ao pressionar Enter
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        element.blur();
      }
    });
  }

  // Abrir upload de imagem
  openImageUpload(element) {
    this.currentImageField = element.dataset.field;
    this.currentImageUpload = element;
    
    const overlay = document.getElementById('uploadOverlay');
    const input = document.getElementById('imageUpload');
    const preview = document.getElementById('imagePreview');
    
    overlay.classList.add('active');
    input.value = '';
    preview.innerHTML = '';
    
    // Mostrar imagem atual
    preview.innerHTML = `<img src="${element.src}" alt="Preview">`;
  }

  // Preview do upload
  previewImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = document.getElementById('imagePreview');
        preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
      };
      reader.readAsDataURL(file);
    }
  }

  // Confirmar upload de imagem
  confirmImageUpload() {
    const input = document.getElementById('imageUpload');
    const file = input.files[0];
    
    if (file && this.currentImageUpload) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.currentImageUpload.src = e.target.result;
        this.saveField(this.currentImageField, e.target.result);
        this.cancelImageUpload();
      };
      reader.readAsDataURL(file);
    }
  }

  // Cancelar upload de imagem
  cancelImageUpload() {
    const overlay = document.getElementById('uploadOverlay');
    overlay.classList.remove('active');
    this.currentImageField = null;
    this.currentImageUpload = null;
  }

  // Salvar campo específico
  saveField(field, value) {
    const keys = field.split('.');
    let current = this.content;
    
    // Navegar até o objeto correto
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      const arrayMatch = key.match(/(\w+)\[(\d+)\]/);
      
      if (arrayMatch) {
        const [, arrayName, index] = arrayMatch;
        current = current[arrayName][parseInt(index)];
      } else {
        current = current[key];
      }
    }
    
    // Atualizar valor
    const lastKey = keys[keys.length - 1];
    current[lastKey] = value;
    
    // Salvar automaticamente no localStorage
    localStorage.setItem('scw_content_draft', JSON.stringify(this.content));
    console.log('Conteúdo salvo automaticamente no localStorage');
  }

  // Salvar conteúdo completo
  saveContent() {
    const blob = new Blob([JSON.stringify(this.content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.json';
    a.click();
    URL.revokeObjectURL(url);
    
    // Também salvar no localStorage
    localStorage.setItem('scw_content_draft', JSON.stringify(this.content));
    console.log('Conteúdo salvo e backup no localStorage');
  }

  // Exportar conteúdo
  exportContent() {
    this.saveContent();
  }

  // Limpar modo de edição
  clearEditMode() {
    document.querySelectorAll('.editing').forEach(el => {
      el.classList.remove('editing');
      el.contentEditable = false;
    });
  }

  // Utilitário para setar elemento
  setElement(id, content, attribute = 'innerHTML') {
    const element = document.getElementById(id);
    if (element) {
      if (attribute === 'src') {
        element.src = content;
      } else {
        element[attribute] = content;
      }
    }
  }

  // Configurar animações
  setupAnimations() {
    // Reveal animation
    const observerOptions = { threshold: 0.08 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('vis');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Counter animation
    this.setupCounterAnimation();

    // Testimonials carousel
    this.setupTestimonialCarousel();

    // Navigation
    this.setupNavigation();

    // Mobile menu
    this.setupMobileMenu();
  }

  // Configurar contador animado
  setupCounterAnimation() {
    let counted = false;
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !counted) {
        counted = true;
        this.content.stats.forEach(stat => {
          const element = document.querySelector(`[data-field="stats[${this.content.stats.findIndex(s => s.id === stat.id)}].value"]`);
          if (element) {
            this.animateCounter(element, parseInt(stat.value), stat.suffix || '');
          }
        });
      }
    }, { threshold: 0.3 });

    const statsElement = document.querySelector('.stats');
    if (statsElement) statsObserver.observe(statsElement);
  }

  // Animar contador
  animateCounter(element, target, suffix = '') {
    let start = null;
    const duration = 1600;
    
    function animate(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const current = Math.floor(progress * target);
      element.innerHTML = current + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }
    
    requestAnimationFrame(animate);
  }

  // Configurar carrossel de depoimentos
  setupTestimonialCarousel() {
    const testiScroll = document.getElementById('testiScroll');
    if (testiScroll) {
      testiScroll.addEventListener('scroll', function() {
        const cards = [...this.children];
        const middle = this.scrollLeft + this.offsetWidth / 2;
        let closestIndex = 0;
        let closestDistance = Infinity;
        
        cards.forEach((card, i) => {
          const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - middle);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = i;
          }
        });
        
        document.querySelectorAll('.testi-dot').forEach((dot, i) => {
          dot.classList.toggle('act', i === closestIndex);
        });
      }, { passive: true });
    }
  }

  // Configurar navegação
  setupNavigation() {
    window.addEventListener('scroll', () => {
      const nav = document.getElementById('nav');
      if (nav) {
        nav.classList.toggle('solid', window.scrollY > 40);
      }
    }, { passive: true });
  }

  // Configurar menu mobile
  setupMobileMenu() {
    const ham = document.getElementById('ham');
    const mobMenu = document.getElementById('mobMenu');

    if (ham && mobMenu) {
      ham.addEventListener('click', () => {
        ham.classList.toggle('open');
        mobMenu.classList.toggle('open');
        document.body.style.overflow = mobMenu.classList.contains('open') ? 'hidden' : '';
      });
    }
  }

  // Conteúdo padrão (fallback)
  getDefaultContent() {
    return {
      site: {
        title: "SC Wedding Production",
        tagline: "Produtora de Filmes & Fotos para Casamentos · Ceará",
        copyright: "© 2025 SC Wedding Production · Todos os direitos reservados"
      },
      hero: {
        badge: "Filmes & Fotos para Casamentos · Ceará",
        title: "Momentos que<br>ficam para <em>sempre</em>",
        subtitle: "Capturamos e filmamos a emoção real do seu grande dia com luz, arte e sentimento que atravessam o tempo.",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=85"
      }
      // ... resto do conteúdo padrão
    };
  }
}

// Funções globais
function scrollS(id) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

function closeMob() {
  const ham = document.getElementById('ham');
  const mobMenu = document.getElementById('mobMenu');
  if (ham && mobMenu) {
    ham.classList.remove('open');
    mobMenu.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function scrollTesti(index) {
  const scroll = document.getElementById('testiScroll');
  const cards = scroll.children;
  if (cards[index]) {
    scroll.scrollTo({ left: cards[index].offsetLeft, behavior: 'smooth' });
  }
  
  document.querySelectorAll('.testi-dot').forEach((dot, i) => {
    dot.classList.toggle('act', i === index);
  });
}

function toggleEditMode() {
  if (window.contentManager) {
    window.contentManager.toggleEditMode();
  }
}

function saveContent() {
  if (window.contentManager) {
    window.contentManager.saveContent();
  }
}

function exportContent() {
  if (window.contentManager) {
    window.contentManager.exportContent();
  }
}

function confirmImageUpload() {
  if (window.contentManager) {
    window.contentManager.confirmImageUpload();
  }
}

function cancelImageUpload() {
  if (window.contentManager) {
    window.contentManager.cancelImageUpload();
  }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  window.contentManager = new ContentManager();
});
