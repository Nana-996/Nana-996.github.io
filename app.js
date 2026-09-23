/**
 * Nana Ama Serwaa Akoto Djan - CV Portfolio Interactive Logic
 * Features:
 *  - Theme switcher (Warm Cream Latte <-> Dark Espresso Velvet)
 *  - Recruiter lens filtering (re-orders / highlights relevant domains)
 *  - Interactive CampusVerify poll demo
 *  - Interactive PharmaSim clinical scenario simulator
 *  - Case study modal system (with live demo and GitHub repository links)
 *  - One-click copy-to-clipboard for phone/email
 *  - Contact form handler with toast alerts
 *  - Download / Print CV handler
 *  - Navigation scrollspy & mobile menu
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initRecruiterLens();
  initCampusVerifyPoll();
  initPharmaSimulator();
  initCaseStudyModals();
  initClipboardButtons();
  initContactForm();
  initPrintCvButton();
  initNavigation();
  initDesignShowcase();
});

/* ==========================================================================
   1. Toast Notification System
   ========================================================================= */
function showToast(message, icon = 'fa-circle-check', duration = 3500) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ==========================================================================
   2. Theme Switcher (Latte Cream <-> Dark Espresso Velvet)
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  if (!toggleBtn) return;

  const currentTheme = localStorage.getItem('nd_theme') || 'theme-latte';
  document.body.className = currentTheme;
  updateThemeButtonUI(currentTheme === 'theme-espresso');

  toggleBtn.addEventListener('click', () => {
    const isEspresso = document.body.classList.contains('theme-espresso');
    if (isEspresso) {
      document.body.classList.remove('theme-espresso');
      document.body.classList.add('theme-latte');
      localStorage.setItem('nd_theme', 'theme-latte');
      updateThemeButtonUI(false);
      showToast('Switched to Warm Cream Latte theme', 'fa-mug-hot');
    } else {
      document.body.classList.remove('theme-latte');
      document.body.classList.add('theme-espresso');
      localStorage.setItem('nd_theme', 'theme-espresso');
      updateThemeButtonUI(true);
      showToast('Switched to Dark Espresso Velvet theme', 'fa-moon');
    }
  });
}

function updateThemeButtonUI(isEspresso) {
  const toggleBtn = document.getElementById('themeToggleBtn');
  if (!toggleBtn) return;

  const icon = toggleBtn.querySelector('i');
  const label = toggleBtn.querySelector('.theme-label');

  if (isEspresso) {
    icon.className = 'fa-solid fa-sun';
    label.textContent = 'Latte';
    toggleBtn.setAttribute('title', 'Switch to Warm Cream Latte theme');
  } else {
    icon.className = 'fa-solid fa-moon';
    label.textContent = 'Espresso';
    toggleBtn.setAttribute('title', 'Switch to Dark Espresso Velvet theme');
  }
}

/* ==========================================================================
   3. Recruiter Focus Lens (Role Focus Filtering)
   ========================================================================== */
function initRecruiterLens() {
  const lensButtons = document.querySelectorAll('.lens-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const timelineCards = document.querySelectorAll('.timeline-card');
  const skillCards = document.querySelectorAll('.skill-category-card');
  const certCards = document.querySelectorAll('.cert-card');

  lensButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update button states
      lensButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const lens = btn.getAttribute('data-lens');
      applyRecruiterLens(lens, { projectCards, timelineCards, skillCards, certCards });

      const lensNames = {
        all: 'All Work & Journey',
        pharmacy: 'Pharmacy & Clinical Science',
        tech: 'Software & AI Products',
        design: 'Creative & Branding',
        research: 'STEM & Research'
      };

      showToast(`Recruiter Focus: ${lensNames[lens] || lens}`, 'fa-filter');
    });
  });
}

function applyRecruiterLens(lens, elements) {
  const { projectCards, timelineCards, skillCards, certCards } = elements;

  const filterList = (items) => {
    items.forEach(item => {
      if (lens === 'all') {
        item.classList.remove('dimmed');
      } else {
        const cat = item.getAttribute('data-category') || '';
        if (cat.includes(lens)) {
          item.classList.remove('dimmed');
        } else {
          item.classList.add('dimmed');
        }
      }
    });
  };

  filterList(projectCards);
  filterList(timelineCards);
  filterList(skillCards);
  filterList(certCards);
}

/* ==========================================================================
   4. CampusVerify Interactive Survey Engine Demo
   ========================================================================== */
function initCampusVerifyPoll() {
  const pollContainer = document.getElementById('campusPollOptions');
  const feedback = document.getElementById('pollFeedback');
  if (!pollContainer) return;

  const optButtons = pollContainer.querySelectorAll('.poll-opt-btn');
  let hasVoted = false;

  optButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (hasVoted) {
        showToast('You already submitted a test response in this demo poll!', 'fa-info');
        return;
      }

      hasVoted = true;
      let currentVotes = parseInt(btn.getAttribute('data-votes') || '30', 10);
      currentVotes += 1;
      btn.setAttribute('data-votes', currentVotes);

      optButtons.forEach(b => b.classList.remove('voted'));
      btn.classList.add('voted');

      // Recalculate percentages
      let total = 0;
      optButtons.forEach(b => {
        total += parseInt(b.getAttribute('data-votes') || '0', 10);
      });

      optButtons.forEach(b => {
        const count = parseInt(b.getAttribute('data-votes') || '0', 10);
        const pct = Math.round((count / total) * 100);
        const pctLabel = b.querySelector('.vote-pct');
        if (pctLabel) pctLabel.textContent = `${pct}%`;
      });

      if (feedback) {
        feedback.innerHTML = `<span style="color: #2E7D32; font-weight: 600;"><i class="fa-solid fa-circle-check"></i> Response verified! CampusVerify records cohort data securely.</span>`;
      }

      showToast('Response recorded! Experience the live app at campus-verify.live', 'fa-square-poll-vertical');
    });
  });
}

/* ==========================================================================
   5. PharmaSim Interactive Mini Simulator
   ========================================================================== */
function initPharmaSimulator() {
  const choicesContainer = document.getElementById('simChoices');
  const resultDiv = document.getElementById('simResult');
  if (!choicesContainer) return;

  const choiceButtons = choicesContainer.querySelectorAll('.sim-choice-btn');

  choiceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const isCorrect = btn.getAttribute('data-correct') === 'true';

      choiceButtons.forEach(b => {
        b.classList.remove('correct', 'wrong');
      });

      if (isCorrect) {
        btn.classList.add('correct');
        if (resultDiv) {
          resultDiv.innerHTML = `
            <span style="color: #2E7D32; font-weight: 600;">
              <i class="fa-solid fa-circle-check"></i> Correct clinical assessment!
            </span> 
            Lisinopril is an ACE inhibitor. Patients must be counseled on the risk of a persistent dry cough and postural hypotension.
          `;
        }
        showToast('Clinical Check Passed! +50 XP in PharmaSim', 'fa-award');
      } else {
        btn.classList.add('wrong');
        if (resultDiv) {
          resultDiv.innerHTML = `
            <span style="color: #C62828; font-weight: 600;">
              <i class="fa-solid fa-circle-xmark"></i> Inaccurate Counseling.
            </span> 
            Please review ACE inhibitor pharmacology. ACE inhibitors cause potassium retention (hyperkalemia risk) and should never be abruptly discontinued.
          `;
        }
      }
    });
  });
}

/* ==========================================================================
   6. Case Study Modals (With Live Demo & GitHub Links)
   ========================================================================== */
const projectData = {
  campusverify: {
    title: 'CampusVerify: Real Research, Real Classmates, Real Fast',
    meta: '03/2026 – Present • React · TypeScript · Supabase · Production Web Platform',
    image: 'assets/campus_verify.jpg',
    description: `CampusVerify is a credit-powered survey feed engineered for verified university students and academic researchers. Students publish surveys, answer a few in return, and receive real responses from verified campus peers — eliminating bots and random submissions.`,
    features: [
      'Verified student accounts tied to authentic university academic emails.',
      'Fair credit exchange: students start with 10 free credits to publish, and earn 1 credit per quality response given.',
      'Targeting filters: query respondents by department, year of study, country, and interests.',
      'Clean data exports, live response analytics, and targeting tools built for real academic research.',
      'Live production platform deployed and running at https://campus-verify.live/'
    ],
    link: 'https://campus-verify.live/',
    github: 'https://github.com/Nana-996/'
  },
  pharmacyguard: {
    title: 'PharmacyGuard | Hospital Pharmacy Decision Support',
    meta: 'Active Production • AI/LLM Integration · AI Agents · React · TypeScript · Supabase · Vercel',
    image: 'assets/pharmacyguard.jpg',
    description: `PharmacyGuard is an AI-powered pharmacy decision support system and verification agent engineered for safer hospital medication workflows. It helps pharmacists verify prescriptions against clinical information, patient history, and drug-drug interactions before dispensing.`,
    features: [
      'Prescription OCR parsing and clinical data verification against patient history.',
      'Automated drug-drug interaction detection, hyperkalemia risk checks, and contraindication alerts.',
      'AI agent decision support tailored for clinical pharmacists and hospital pharmacy technicians.',
      'Developed with React, TypeScript, and Supabase for seamless hospital and community pharmacy workflows.',
      'Live production application deployed on Vercel at https://pharmacy-guard.vercel.app/',
      'Open source codebase available at https://github.com/Nana-996/PharmacyGuard'
    ],
    link: 'https://pharmacy-guard.vercel.app/',
    github: 'https://github.com/Nana-996/PharmacyGuard'
  },
  novelweaver: {
    title: 'Novel Weaver: AI-Assisted Long-Form Writing Platform',
    meta: 'In Progress • AI/LLM Integration · React · TypeScript · Web Development',
    image: 'assets/novelweaver.jpg',
    description: `Novel Weaver is an AI-assisted storytelling platform designed to help authors and novelists develop, structure, and manage long-form narratives, character arcs, and complex story universes without losing creative flow.`,
    features: [
      'Multi-level chapter scene tree and narrative timeline organizer.',
      'Interactive visual character relationship graph and motive tracker.',
      'Context-aware AI co-writing suggestions providing in-scene dialogue and sensory detail expansions.',
      'Distraction-free rich text editor optimized for deep creative focus.'
    ],
    github: 'https://github.com/Nana-996/'
  },
  pharmasim: {
    title: 'PharmaSim: Pharmaceutical Everyday Practice Game',
    meta: 'In Progress • Product Development · AI/LLM Integration · Web Development',
    image: 'assets/pharmasim.jpg',
    description: `PharmaSim is an interactive gamified simulation environment created for pharmacy students and trainees to build intuitive clinical decision-making skills before entering hospital wards and community retail settings.`,
    features: [
      'Interactive digital dispensary counter with realistic patient profiles and prescription orders.',
      'Prescription validation engine: Detects incorrect dosages, drug-drug interactions, and contraindications.',
      'Patient counseling dialogue tree: Tests student ability to communicate critical warnings, food interactions, and adherence strategies.',
      'XP and scoring mechanics aligned with international pharmaceutical practice standards.'
    ],
    github: 'https://github.com/Nana-996/'
  },
  stemnnovation: {
    title: 'Amphibious Solar Solution to Land Degradation & Water Pollution',
    meta: '2023 – 2024 • Lead Researcher & Mechanical Designer • Yaa Asantewaa Girls\' Senior High School',
    image: 'assets/amphibious_device.jpg',
    description: `Developed an amphibious semi-automated solar-powered system to counteract acute water pollution and land degradation caused by illegal gold mining ('galamsey') in Ghana. The project directly addresses findings from the Water Resources Commission (water quality drop from 86% to 58.8%) and Ghana Water Company Limited (operational downtime from turbidity & power outages).`,
    features: [
      'Semi-Automated Amphibious Architecture: Constructed with buoyant recycled PET bottle pontoon floats and wood/PVC chassis, capable of navigating river surfaces and littoral zones.',
      'Solar-Powered Power Distribution: 12V solar PV array with 12V battery storage powering relays, motors, and pumps, promoting low-carbon circular operation (<4% solar baseline in Ghana).',
      'Arduino Microcontroller Integration: Onboard Arduino motherboard driving relay-switched 12V DC water pumps, geared roller motors, and an aeration propeller.',
      'Mechanical Trash Skimmer & Aeration: Front-mounted roller conveyor belt harvesting floating solid debris into a dedicated trash chamber, while an underwater propeller boosts dissolved oxygen levels.',
      'Real-Time Turbidity & Multi-Stage Filtration: Integrated turbidity sensor with 16x2 LCD display; multi-stage sand/carbon filtration separating treated water for domestic use vs. agricultural irrigation.',
      'Duckweed & Bamboo Phytoremediation: Green bioresource technology extracting heavy metals (mercury, lead) from water and soil; harvested duckweed biomass upcycled into bio-plastics, bio-fuel, and high-protein animal feed.',
      'Frugal Engineering: Entire working prototype fabricated with locally sourced materials at a total cost of only 2,570 GHS (~$170 USD).',
      'Awarded National Certificate of Honour across both the Ghana Stemnnovation competition and the Ghana Renewable Energy Challenge (Energy Commission & GES).'
    ]
  }
};

function initCaseStudyModals() {
  const modal = document.getElementById('caseStudyModal');
  const modalContent = document.getElementById('modalContent');
  const closeBtn = document.getElementById('modalCloseBtn');
  const openButtons = document.querySelectorAll('.open-modal-btn');

  if (!modal || !modalContent) return;

  openButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const projKey = btn.getAttribute('data-project');
      const data = projectData[projKey];
      if (!data) return;

      modalContent.innerHTML = `
        <img src="${data.image}" alt="${data.title}" class="modal-hero-img">
        <h2 id="modalTitle" class="modal-title">${data.title}</h2>
        <div class="modal-meta-row">
          <span>${data.meta}</span>
        </div>
        <p class="modal-body-text">${data.description}</p>
        <h4 style="font-family: var(--font-serif); font-size: 1.15rem; margin-bottom: 0.75rem; color: var(--text-primary);">Key Innovations & Architecture:</h4>
        <ul class="modal-feature-list">
          ${data.features.map(f => `<li><i class="fa-solid fa-check"></i> <span>${f}</span></li>`).join('')}
        </ul>
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 1.5rem;">
          ${data.link ? `
            <a href="${data.link}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
              <span>Open Live Platform</span>
              <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          ` : ''}
          ${data.github ? `
            <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
              <i class="fa-brands fa-github"></i>
              <span>View on GitHub</span>
            </a>
          ` : ''}
        </div>
      `;

      modal.showModal();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.close());
  }

  modal.addEventListener('click', (e) => {
    const dialogDimensions = modal.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      modal.close();
    }
  });
}

/* ==========================================================================
   7. Copy to Clipboard Utility
   ========================================================================== */
function initClipboardButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`, 'fa-copy');
        }).catch(() => {
          fallbackCopyText(textToCopy);
        });
      } else {
        fallbackCopyText(textToCopy);
      }
    });
  });
}

function fallbackCopyText(text) {
  const tempInput = document.createElement('textarea');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  showToast(`Copied to clipboard: ${text}`, 'fa-copy');
}

/* ==========================================================================
   8. Contact Form Handler
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('senderName');
    const emailInput = document.getElementById('senderEmail');
    const typeInput = document.getElementById('inquiryType');
    const messageInput = document.getElementById('senderMessage');
    const submitBtn = document.getElementById('submitBtn');

    if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
      showToast('Please complete all required fields.', 'fa-triangle-exclamation');
      return;
    }

    const payload = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      type: typeInput.value,
      message: messageInput.value.trim(),
      timestamp: new Date().toISOString()
    };

    // Save to localStorage so submissions are preserved
    try {
      const existing = JSON.parse(localStorage.getItem('nd_inquiries') || '[]');
      existing.push(payload);
      localStorage.setItem('nd_inquiries', JSON.stringify(existing));
    } catch (err) {
      console.warn('Could not save to localStorage', err);
    }

    // Button feedback state
    const originalContent = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = `<span>Sent Successfully!</span> <i class="fa-solid fa-check"></i>`;
      submitBtn.style.backgroundColor = '#2E7D32';

      showToast(`Thank you, ${payload.name}! Your message has been recorded.`, 'fa-paper-plane');

      setTimeout(() => {
        form.reset();
        submitBtn.innerHTML = originalContent;
        submitBtn.style.backgroundColor = '';
        submitBtn.disabled = false;
      }, 2500);
    }, 800);
  });
}

/* ==========================================================================
   9. Download / Print CV Handler
   ========================================================================== */
function initPrintCvButton() {
  const downloadBtn = document.getElementById('downloadCvBtn');
  if (!downloadBtn) return;

  downloadBtn.addEventListener('click', () => {
    showToast('Opening print/PDF view for Nana Ama\'s CV...', 'fa-file-pdf');
    setTimeout(() => {
      window.print();
    }, 400);
  });
}

/* ==========================================================================
   10. Navigation, Scrollspy & Mobile Menu
   ========================================================================== */
function initNavigation() {
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('open');
      if (isOpen) {
        navMenu.classList.remove('open');
        mobileBtn.setAttribute('aria-expanded', 'false');
      } else {
        navMenu.classList.add('open');
        mobileBtn.setAttribute('aria-expanded', 'true');
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Scrollspy to highlight active link
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(sec => {
      const sectionHeight = sec.offsetHeight;
      const sectionTop = sec.offsetTop - 120;
      const sectionId = sec.getAttribute('id');
      const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(l => l.classList.remove('active'));
        if (navLink) navLink.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   11. Graphic Design Showcase Carousel & Lightbox Modal (Zero-Redirect)
   ========================================================================== */
const defaultDesignProjects = [
  {
    id: "hcp-symposium-poster",
    title: "Healthcare Innovation Symposium",
    category: "poster",
    categoryLabel: "Posters & Flyers",
    imageUrl: "assets/designs/health_symposium.jpg",
    year: "2024",
    tools: ["Adobe Illustrator", "Photoshop", "Typography"],
    description: "Official promotional poster and visual system for the Healthcare Professionals Innovation Symposium. Designed with high-contrast geometric layouts and warm earthen tones to communicate medical advancement and clinical accessibility."
  },
  {
    id: "nd-brand-guidelines",
    title: "Executive ND Brand & Stationery Identity",
    category: "brand",
    categoryLabel: "Brand Identity",
    imageUrl: "assets/designs/brand_identity.jpg",
    year: "2024",
    tools: ["Adobe Illustrator", "Figma", "Print Production"],
    description: "Comprehensive brand guideline book, custom gold foil monogram typography, executive stationery, and minimalist color specification designed for professional and research ventures."
  },
  {
    id: "clinical-pharmacy-guide",
    title: "Clinical Pharmacy Medication Safety Guide",
    category: "campaign",
    categoryLabel: "Health Campaigns",
    imageUrl: "assets/designs/antibiotic_safety.jpg",
    year: "2024",
    tools: ["Canva Pro", "Photoshop", "Data Visuals"],
    description: "Visual patient-safety infographic created for community health outreach, breaking down medication administration principles, error prevention metrics, and pharmacist intervention workflows."
  },
  {
    id: "youth-innovation-summit",
    title: "Youth Innovation Summit Roll-up Banner",
    category: "digital",
    categoryLabel: "Social & Digital",
    imageUrl: "assets/designs/creative_campaign.jpg",
    year: "2024",
    tools: ["Adobe Photoshop", "InDesign", "Event Collateral"],
    description: "Striking 33x79 inch roll-up conference display banner and promotional social flyers incorporating West African geometric patterns fused with modern tech hackathon aesthetics."
  }
];

let activeDesigns = [...defaultDesignProjects];

async function initDesignShowcase() {
  const track = document.getElementById('designCarouselTrack');
  if (!track) return;

  // Attempt to fetch synced designs (GitHub Pages static json or local/Vercel serverless)
  try {
    let res = await fetch('assets/designs.json');
    if (!res.ok) {
      res = await fetch('/api/designs');
    }
    if (res.ok) {
      const data = await res.json();
      const items = Array.isArray(data) ? data : (data.items || []);
      if (items.length > 0) {
        activeDesigns = items.map(item => ({
          ...item,
          categoryLabel: item.category,
          category: normalizeCategory(item.category)
        }));
      }
    }
  } catch (e) {
    // Graceful offline fallback to default starter designs
  }

  renderDesignCards('all');
  initCarouselControls();
  initDesignLightbox();
  initCategoryFilters();
}

function normalizeCategory(cat) {
  if (!cat) return 'poster';
  const c = String(cat).toLowerCase();
  if (c.includes('brand') || c.includes('logo') || c.includes('identity')) return 'brand';
  if (c.includes('campaign') || c.includes('health') || c.includes('clinic')) return 'campaign';
  if (c.includes('social') || c.includes('digital') || c.includes('ui') || c.includes('app')) return 'digital';
  return 'poster';
}

function renderDesignCards(filter = 'all') {
  const track = document.getElementById('designCarouselTrack');
  const dotsContainer = document.getElementById('carouselDots');
  if (!track) return;

  const filtered = filter === 'all' 
    ? activeDesigns 
    : activeDesigns.filter(d => d.category === filter);

  if (filtered.length === 0) {
    track.innerHTML = `
      <div style="padding: 2.5rem; text-align: center; color: var(--text-muted); width: 100%;">
        <i class="fa-solid fa-folder-open" style="font-size: 2rem; margin-bottom: 0.75rem;"></i>
        <p>No designs found in this category yet.</p>
      </div>
    `;
    if (dotsContainer) dotsContainer.innerHTML = '';
    return;
  }

  track.innerHTML = filtered.map((item) => `
    <article class="design-card" data-id="${item.id}" data-category="${item.category}" tabindex="0" role="button" aria-label="View ${item.title}">
      <div class="design-card-media">
        <span class="design-category-tag">${item.categoryLabel || 'Design'}</span>
        <span class="design-year-tag">${item.year || '2024'}</span>
        <img src="${item.imageUrl}" alt="${item.title}" class="design-thumb-img" loading="lazy">
        <div class="design-card-overlay">
          <span class="inspect-pill"><i class="fa-solid fa-expand"></i> Inspect Artwork</span>
        </div>
      </div>
      <div class="design-card-body">
        <h3 class="design-card-title">${item.title}</h3>
        <p class="design-card-desc">${item.description || ''}</p>
        <div class="design-tools-row">
          ${(item.tools || []).map(t => `<span class="tool-badge">${t}</span>`).join('')}
        </div>
      </div>
    </article>
  `).join('');

  // Attach click listener for lightbox
  track.querySelectorAll('.design-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      const item = activeDesigns.find(d => String(d.id) === String(id));
      if (item) openDesignLightbox(item);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const id = card.getAttribute('data-id');
        const item = activeDesigns.find(d => String(d.id) === String(id));
        if (item) openDesignLightbox(item);
      }
    });
  });

  renderCarouselDots(filtered.length);
  updateArrowStates();
}

function initCarouselControls() {
  const track = document.getElementById('designCarouselTrack');
  const prevBtn = document.getElementById('carouselPrevBtn');
  const nextBtn = document.getElementById('carouselNextBtn');
  if (!track || !prevBtn || !nextBtn) return;

  const scrollAmount = 370;

  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });

  track.addEventListener('scroll', () => {
    updateArrowStates();
    updateActiveDot();
  }, { passive: true });
}

function updateArrowStates() {
  const track = document.getElementById('designCarouselTrack');
  const prevBtn = document.getElementById('carouselPrevBtn');
  const nextBtn = document.getElementById('carouselNextBtn');
  if (!track || !prevBtn || !nextBtn) return;

  const isAtStart = track.scrollLeft <= 5;
  const isAtEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;

  prevBtn.disabled = isAtStart;
  nextBtn.disabled = isAtEnd;
}

function renderCarouselDots(count) {
  const dotsContainer = document.getElementById('carouselDots');
  if (!dotsContainer) return;

  dotsContainer.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('button');
    dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => {
      const track = document.getElementById('designCarouselTrack');
      const cards = track ? track.querySelectorAll('.design-card') : [];
      if (cards[i]) {
        cards[i].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      }
    });
    dotsContainer.appendChild(dot);
  }
}

function updateActiveDot() {
  const track = document.getElementById('designCarouselTrack');
  const dots = document.querySelectorAll('.carousel-dot');
  if (!track || dots.length === 0) return;

  const cards = track.querySelectorAll('.design-card');
  if (cards.length === 0) return;

  const trackCenter = track.getBoundingClientRect().left + track.clientWidth / 2;
  let closestIndex = 0;
  let minDiff = Infinity;

  cards.forEach((card, index) => {
    const rect = card.getBoundingClientRect();
    const cardCenter = rect.left + rect.width / 2;
    const diff = Math.abs(trackCenter - cardCenter);
    if (diff < minDiff) {
      minDiff = diff;
      closestIndex = index;
    }
  });

  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === closestIndex);
  });
}

function initCategoryFilters() {
  const filterButtons = document.querySelectorAll('.design-filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      renderDesignCards(filter);
      const track = document.getElementById('designCarouselTrack');
      if (track) track.scrollTo({ left: 0, behavior: 'smooth' });
    });
  });
}

function initDesignLightbox() {
  const modal = document.getElementById('designLightboxModal');
  const closeBtn = document.getElementById('designModalCloseBtn');
  if (!modal) return;

  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.close());
  }

  modal.addEventListener('click', (e) => {
    const rect = modal.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      modal.close();
    }
  });
}

function openDesignLightbox(item) {
  const modal = document.getElementById('designLightboxModal');
  const content = document.getElementById('designLightboxContent');
  if (!modal || !content) return;

  content.innerHTML = `
    <div class="lightbox-image-container">
      <img src="${item.imageUrl}" alt="${item.title}" class="lightbox-full-img">
    </div>
    <div class="lightbox-meta-header">
      <h2 id="designModalTitle" class="lightbox-title">${item.title}</h2>
      <div class="lightbox-tags">
        <span class="tool-badge" style="background: var(--color-caramel); color: #fff;">${item.categoryLabel || item.category}</span>
        <span class="tool-badge">${item.year || '2024'}</span>
      </div>
    </div>
    <p class="lightbox-desc">${item.description || ''}</p>
    <div class="lightbox-tools-section">
      <span class="lightbox-tools-title"><i class="fa-solid fa-wrench"></i> Creative Tools:</span>
      ${(item.tools || []).map(t => `<span class="tool-badge">${t}</span>`).join('')}
    </div>
  `;

  modal.showModal();
}

