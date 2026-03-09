/* ============================================
   DAR LOUKA - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
    initSplashScreen();
    initScrollHeader();
    initCarousels();
    initGalleryFilters();
    initScrollReveal();
});

/* ---------- CSRF Token ---------- */
function getCsrfToken() {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.getAttribute('content') : '';
}

/* ---------- Splash Screen ---------- */
function initSplashScreen() {
    const splash = document.getElementById('splashScreen');
    if (!splash) return;
    // Check if already seen in this session
    if (sessionStorage.getItem('splashSeen')) {
        splash.style.display = 'none';
        return;
    }
    setTimeout(function () {
        splash.classList.add('fade-out');
        setTimeout(function () {
            splash.style.display = 'none';
        }, 500);
        sessionStorage.setItem('splashSeen', 'true');
    }, 3000);
}

/* ---------- Scroll Header ---------- */
function initScrollHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    function checkScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', checkScroll);
    checkScroll();
}

/* ---------- Language Dropdown ---------- */
function toggleLangDropdown() {
    var dd = document.getElementById('langDropdown');
    dd.classList.toggle('open');
}

// Close dropdown on outside click
document.addEventListener('click', function (e) {
    var dd = document.getElementById('langDropdown');
    if (dd && !dd.contains(e.target)) {
        dd.classList.remove('open');
    }
});

/* ---------- Mobile Sidebar ---------- */
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebarBackdrop').classList.toggle('open');
}

/* ---------- Image Carousel ---------- */
function initCarousels() {
    document.querySelectorAll('.carousel').forEach(function (carousel) {
        var imgs = carousel.querySelectorAll('img');
        if (imgs.length <= 1) return;
        carousel._currentSlide = 0;
        carousel._totalSlides = imgs.length;
        // Auto-play
        carousel._interval = setInterval(function () {
            goToSlideIndex(carousel, (carousel._currentSlide + 1) % carousel._totalSlides);
        }, 5000);
    });
}

function nextSlide(btn) {
    var carousel = btn.closest('.carousel');
    var next = (carousel._currentSlide + 1) % carousel._totalSlides;
    goToSlideIndex(carousel, next);
    resetAutoplay(carousel);
}

function prevSlide(btn) {
    var carousel = btn.closest('.carousel');
    var prev = (carousel._currentSlide - 1 + carousel._totalSlides) % carousel._totalSlides;
    goToSlideIndex(carousel, prev);
    resetAutoplay(carousel);
}

function goToSlide(dot, index) {
    var carousel = dot.closest('.carousel');
    goToSlideIndex(carousel, index);
    resetAutoplay(carousel);
}

function goToSlideIndex(carousel, index) {
    var imgs = carousel.querySelectorAll('img');
    var dots = carousel.querySelectorAll('.carousel-dot');
    var counter = carousel.querySelector('.carousel-counter');
    imgs.forEach(function (img, i) {
        img.classList.toggle('active', i === index);
    });
    dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
    });
    if (counter) {
        counter.textContent = (index + 1) + '/' + carousel._totalSlides;
    }
    carousel._currentSlide = index;
}

function resetAutoplay(carousel) {
    clearInterval(carousel._interval);
    carousel._interval = setInterval(function () {
        goToSlideIndex(carousel, (carousel._currentSlide + 1) % carousel._totalSlides);
    }, 5000);
}

/* ---------- Gallery Filters ---------- */
function initGalleryFilters() {
    document.querySelectorAll('.gallery-filter').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var category = this.dataset.category;
            // Update active button
            document.querySelectorAll('.gallery-filter').forEach(function (b) {
                b.classList.remove('active');
                b.classList.remove('btn-primary');
                b.classList.add('btn-outline-primary');
            });
            this.classList.add('active');
            this.classList.remove('btn-outline-primary');
            this.classList.add('btn-primary');
            // Filter items
            document.querySelectorAll('.gallery-item').forEach(function (item) {
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

/* ---------- Lightbox ---------- */
function openLightbox(src) {
    var lb = document.getElementById('lightbox');
    document.getElementById('lightbox-img').src = src;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
});

/* ---------- Room Booking Modal ---------- */
function openBookingModal(roomId, roomName, price) {
    document.getElementById('bookingRoomId').value = roomId;
    document.getElementById('bookingRoomName').textContent = roomName + ' - ' + price + ' MAD';
    document.getElementById('bookingModal').classList.add('open');
    document.body.style.overflow = 'hidden';
    // Set min date to today
    var today = new Date().toISOString().split('T')[0];
    document.getElementById('bookingCheckIn').min = today;
    document.getElementById('bookingCheckOut').min = today;
    // Reset form
    document.getElementById('bookingForm').reset();
    document.getElementById('bookingError').classList.add('hidden');
    document.getElementById('bookingSuccess').classList.add('hidden');
}

function closeBookingModal() {
    document.getElementById('bookingModal').classList.remove('open');
    document.body.style.overflow = '';
}

function submitBooking(e) {
    e.preventDefault();
    var btn = document.getElementById('bookingSubmitBtn');
    var errorDiv = document.getElementById('bookingError');
    var successDiv = document.getElementById('bookingSuccess');

    btn.disabled = true;
    btn.textContent = (typeof bookingTranslations !== 'undefined' ? bookingTranslations.submitting : 'Chargement...');
    errorDiv.classList.add('hidden');
    successDiv.classList.add('hidden');

    var data = {
        room_id: document.getElementById('bookingRoomId').value,
        check_in: document.getElementById('bookingCheckIn').value,
        check_out: document.getElementById('bookingCheckOut').value,
        guests: parseInt(document.getElementById('bookingGuests').value),
        name: document.getElementById('bookingName').value,
        email: document.getElementById('bookingEmail').value,
        phone: document.getElementById('bookingPhone').value,
        special_requests: document.getElementById('bookingRequests').value,
    };

    fetch('/api/bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': getCsrfToken(),
        },
        body: JSON.stringify(data),
    })
        .then(function (res) { return res.json().then(function (j) { return { ok: res.ok, status: res.status, data: j }; }); })
        .then(function (result) {
            btn.disabled = false;
            btn.textContent = (typeof bookingTranslations !== 'undefined' ? bookingTranslations.submit : 'Réserver');
            if (result.ok) {
                successDiv.classList.remove('hidden');
                document.getElementById('bookingForm').reset();
            } else {
                var msg = result.data.message || result.data.error || 'Erreur';
                if (result.status === 409 && result.data.conflictDates) {
                    msg += ': ' + result.data.conflictDates.join(', ');
                }
                document.getElementById('bookingErrorText').textContent = msg;
                errorDiv.classList.remove('hidden');
            }
        })
        .catch(function () {
            btn.disabled = false;
            btn.textContent = (typeof bookingTranslations !== 'undefined' ? bookingTranslations.submit : 'Réserver');
            document.getElementById('bookingErrorText').textContent = 'Erreur réseau';
            errorDiv.classList.remove('hidden');
        });
}

/* ---------- Forfait Booking Modal ---------- */
function openEventBookingModal(eventId, eventTitle, startDate, endDate, maxParticipants) {
    document.getElementById('eventBookingId').value = eventId;
    document.getElementById('eventCheckIn').value = startDate;
    document.getElementById('eventCheckOut').value = endDate;
    document.getElementById('eventBookingName').textContent = eventTitle;
    document.getElementById('eventBookingModal').classList.add('open');
    document.body.style.overflow = 'hidden';
    // Reset
    document.getElementById('eventBookingForm').reset();
    document.getElementById('eventBookingId').value = eventId;
    document.getElementById('eventCheckIn').value = startDate;
    document.getElementById('eventCheckOut').value = endDate;
    document.getElementById('eventBookingError').classList.add('hidden');
    document.getElementById('eventBookingSuccess').classList.add('hidden');
    // Set max participants
    var guestsInput = document.getElementById('eventGuests');
    if (maxParticipants) {
        guestsInput.max = maxParticipants;
    } else {
        guestsInput.removeAttribute('max');
    }
}

function closeEventBookingModal() {
    document.getElementById('eventBookingModal').classList.remove('open');
    document.body.style.overflow = '';
}

function submitEventBooking(e) {
    e.preventDefault();
    var btn = document.getElementById('eventBookingSubmitBtn');
    var errorDiv = document.getElementById('eventBookingError');
    var successDiv = document.getElementById('eventBookingSuccess');

    btn.disabled = true;
    errorDiv.classList.add('hidden');
    successDiv.classList.add('hidden');

    var data = {
        event_id: document.getElementById('eventBookingId').value,
        check_in: document.getElementById('eventCheckIn').value,
        check_out: document.getElementById('eventCheckOut').value,
        guests: parseInt(document.getElementById('eventGuests').value),
        name: document.getElementById('eventBookerName').value,
        email: document.getElementById('eventBookerEmail').value,
        phone: document.getElementById('eventBookerPhone').value,
        special_requests: document.getElementById('eventBookerRequests').value,
    };

    fetch('/api/bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': getCsrfToken(),
        },
        body: JSON.stringify(data),
    })
        .then(function (res) { return res.json().then(function (j) { return { ok: res.ok, data: j }; }); })
        .then(function (result) {
            btn.disabled = false;
            if (result.ok) {
                successDiv.classList.remove('hidden');
                document.getElementById('eventBookingForm').reset();
            } else {
                document.getElementById('eventBookingErrorText').textContent = result.data.message || result.data.error || 'Erreur';
                errorDiv.classList.remove('hidden');
            }
        })
        .catch(function () {
            btn.disabled = false;
            document.getElementById('eventBookingErrorText').textContent = 'Erreur réseau';
            errorDiv.classList.remove('hidden');
        });
}

/* ---------- Scroll Reveal Animations ---------- */
function initScrollReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry, index) {
                if (entry.isIntersecting) {
                    // Add staggered delay based on position
                    var siblings = entry.target.parentElement.querySelectorAll('.reveal');
                    var idx = Array.prototype.indexOf.call(siblings, entry.target);
                    var delay = idx * 100; // 100ms stagger
                    setTimeout(function () {
                        entry.target.classList.add('visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        reveals.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        // Fallback: show all
        reveals.forEach(function (el) {
            el.classList.add('visible');
        });
    }
}
