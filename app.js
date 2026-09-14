/**
 * NX Medi — Smart Medication Management Platform
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navigation Header
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // 3. How It Works Interactive Step Switcher
  const stepItems = document.querySelectorAll('.works-step-item');
  const previewChip = document.getElementById('preview-chip');
  const previewTitle = document.getElementById('preview-title');
  const previewDesc = document.getElementById('preview-desc');
  const previewIcon = document.getElementById('preview-icon-svg');

  const stepDetails = [
    {
      chip: 'STEP 1 • PRESCRIPTION DIGITIZATION',
      title: '1. Prescription Upload & OCR Sync',
      desc: 'Caregivers or physicians scan or upload official prescriptions using the NX Medi app. Our cloud engine parses dosage times, medication rules, and refill dates automatically.',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>'
    },
    {
      chip: 'STEP 2 • AUTOMATED SCHEDULING',
      title: '2. Smart Medication Scheduling',
      desc: 'The platform creates an intuitive, color-coded daily timetable mapped directly to patient routines (Breakfast, Lunch, Dinner, Bedtime) with conflict detection.',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>'
    },
    {
      chip: 'STEP 3 • SECURE PACK LOADING',
      title: '3. Load Sealed Blister Pods',
      desc: 'Pre-filled, tamper-evident blister packs are securely loaded into the locked NX Medi hardware unit. Compartments lock automatically to prevent double-dosing.',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>'
    },
    {
      chip: 'STEP 4 • MULTI-SENSORY ALERTS',
      title: '4. Gentle Smart Reminders',
      desc: 'When a dose is due, the NX Medi device emits clear voice guidance, soothing ambient LED illumination, and gentle mobile push notifications to the patient.',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>'
    },
    {
      chip: 'STEP 5 • PRECISION DISPENSING',
      title: '5. Automatic Medication Dispensing',
      desc: 'At the exact scheduled timestamp, the internal motorized tray delivers only the required blister pod into the lighted retrieval chute.',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>'
    },
    {
      chip: 'STEP 6 • HARDWARE VERIFICATION',
      title: '6. Sensory Dose Collection Verification',
      desc: 'Optical beam break and weight sensors verify that the patient actually picked up the medication pod. Unlike ordinary apps, collection event is physically confirmed.',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>'
    },
    {
      chip: 'STEP 7 • REAL-TIME CLOUD SYNC',
      title: '7. Secure Cloud Telemetry',
      desc: 'Dose pickup data, timestamp, and hardware status are encrypted and synchronized instantly via cellular / Wi-Fi to the HIPAA-ready NX Cloud database.',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 001-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z"/>'
    },
    {
      chip: 'STEP 8 • CAREGIVER NOTIFICATION',
      title: '8. Real-Time Caregiver Assurance',
      desc: 'Caregivers receive peace-of-mind confirmation on their app. If a dose is uncollected after a grace period, immediate SMS & call escalation alerts trigger.',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>'
    }
  ];

  stepItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      stepItems.forEach(s => s.classList.remove('active'));
      item.classList.add('active');

      const data = stepDetails[index];
      if (data) {
        previewChip.textContent = data.chip;
        previewTitle.textContent = data.title;
        previewDesc.textContent = data.desc;
        previewIcon.innerHTML = data.icon;
      }

      // Smooth scroll to preview display on mobile screens if tapped below
      if (window.innerWidth <= 768) {
        const previewDisplay = document.querySelector('.works-preview-display');
        if (previewDisplay) {
          previewDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });
  });

  // 4. Hardware Hotspots Showcase Interaction
  const hotspots = document.querySelectorAll('.hotspot');
  const specCards = document.querySelectorAll('.showcase-spec-card');

  hotspots.forEach(hs => {
    hs.addEventListener('click', () => {
      const targetId = hs.getAttribute('data-target');
      hotspots.forEach(h => h.classList.remove('active'));
      specCards.forEach(c => c.classList.remove('active'));

      hs.classList.add('active');
      const activeCard = document.getElementById(`spec-${targetId}`);
      if (activeCard) {
        activeCard.classList.add('active');
        activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });

  specCards.forEach(sc => {
    sc.addEventListener('click', () => {
      const specId = sc.id.replace('spec-', '');
      specCards.forEach(c => c.classList.remove('active'));
      hotspots.forEach(h => h.classList.remove('active'));

      sc.classList.add('active');
      const activeHotspot = document.querySelector(`.hotspot-${specId}`);
      if (activeHotspot) {
        activeHotspot.classList.add('active');
      }
    });
  });

  // 5. Patient App vs Caregiver Dashboard Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabTarget = btn.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const activeContent = document.getElementById(tabTarget);
      if (activeContent) {
        activeContent.classList.add('active');
      }
    });
  });

  // 6. Interactive ROI & Adherence Calculator
  const medsSlider = document.getElementById('meds-slider');
  const patientsSlider = document.getElementById('patients-slider');
  const medsValDisplay = document.getElementById('meds-val');
  const patientsValDisplay = document.getElementById('patients-val');
  const preventedValDisplay = document.getElementById('prevented-val');
  const peaceScoreDisplay = document.getElementById('peace-score');

  function calculateAdherenceImpact() {
    if (!medsSlider || !patientsSlider) return;
    const medsCount = parseInt(medsSlider.value, 10);
    const patientCount = parseInt(patientsSlider.value, 10);

    medsValDisplay.textContent = medsCount;
    patientsValDisplay.textContent = patientCount;

    // Average non-adherence rate without verification ~ 30% missed or late doses
    // 365 days * doses per day * 0.30 missed = missed doses prevented per patient
    const totalAnnualDoses = medsCount * 365 * patientCount;
    const preventedMissedDoses = Math.round(totalAnnualDoses * 0.32);

    // Peace of mind score scales from 85% to 99.4%
    const score = Math.min(99.4, 94.0 + (patientCount * 0.5)).toFixed(1);

    preventedValDisplay.textContent = preventedMissedDoses.toLocaleString();
    peaceScoreDisplay.textContent = `${score}%`;
  }

  if (medsSlider && patientsSlider) {
    medsSlider.addEventListener('input', calculateAdherenceImpact);
    patientsSlider.addEventListener('input', calculateAdherenceImpact);
    calculateAdherenceImpact();
  }

  // 7. Modal Popup for Demo Booking / Contact
  const modalOverlay = document.getElementById('modal-overlay');
  const modalCloseBtn = document.getElementById('modal-close');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const modalForm = document.getElementById('demo-modal-form');
  const toast = document.getElementById('toast');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modalOverlay.classList.add('active');
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
  }

  if (modalForm) {
    modalForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = modalForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';

      const formData = {
        name: document.getElementById('form-name')?.value || '',
        email: document.getElementById('form-email')?.value || '',
        role: document.getElementById('form-role')?.value || '',
        message: document.getElementById('form-message')?.value || ''
      };

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
          modalOverlay.classList.remove('active');
          modalForm.reset();

          // Show toast notification
          toast.classList.add('show');
          setTimeout(() => {
            toast.classList.remove('show');
          }, 4000);
        } else {
          alert(result.error || 'Failed to submit form. Please try again.');
        }
      } catch (err) {
        console.error('Error submitting form:', err);
        alert('Could not connect to database server. Please try again.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  }
});
