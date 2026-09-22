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
