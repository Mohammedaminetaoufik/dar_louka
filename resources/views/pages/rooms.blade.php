@extends('layouts.app')
@section('title', __('messages.nav.rooms'))
@section('meta_description')
@php
    echo app()->getLocale() === 'fr'
        ? "Chambres et suites de charme à Dar Louka, maison d'hôte à Tahanaout, Marrakech. Suite Nuptiale, Suite Familiale, chambres confort avec vue Atlas. À partir de 600 MAD/nuit."
        : "Charming rooms and suites at Dar Louka guesthouse in Tahanaout, Marrakech. Bridal Suite, Family Suite, comfort rooms with Atlas views. From 600 MAD/night.";
@endphp
@endsection
@section('meta_keywords')
@php
    echo app()->getLocale() === 'fr'
        ? "chambres maison d'hôte marrakech, suite nuptiale marrakech, suite familiale maroc, hébergement tahanaout, chambre vue atlas, hotel chambre marrakech, riad chambre maroc, tarif maison d'hôte marrakech"
        : "guesthouse rooms marrakech, bridal suite marrakech, family suite morocco, accommodation tahanaout, atlas view room, hotel room marrakech, riad room morocco, guesthouse rates marrakech";
@endphp
@endsection

@section('content')
<!-- Page Hero -->
<section class="page-hero">
    <div class="hero-ornament">
        <span><i class="fas fa-star"></i></span>
    </div>
    <h1>{{ __('messages.rooms.title') }}</h1>
    <p>{{ __('messages.rooms.subtitle') }}</p>
</section>

<!-- Rooms List -->
<section class="section">
    <div class="container">
        @if(count($rooms) === 0)
        <p class="text-center text-muted">{{ __('messages.rooms.noRooms') }}</p>
        @else

        @foreach($rooms as $room)
        @php
            $images = is_string($room->images) ? (json_decode($room->images, true) ?? []) : ($room->images ?? []);
            if (!is_array($images)) $images = [];
            $mainImg = $room->image ?: (count($images) > 0 ? $images[0] : '');
            $amenities = is_string($room->amenities) ? (json_decode($room->amenities, true) ?? []) : ($room->amenities ?? []);
            if (!is_array($amenities)) $amenities = [];
            $allImages = [];
            if($room->image) $allImages[] = $room->image;
            if(is_array($images)) $allImages = array_merge($allImages, $images);
            $allImages = array_values(array_unique(array_filter($allImages)));
            $roomSurface = $room->surface ? ($room->surface . 'm²') : '—';
        @endphp
        <div class="room-card-luxury reveal">
            <!-- Image Gallery -->
            <div class="room-gallery-mosaic" data-images='@json($allImages)'>
                @foreach($allImages as $idx => $img)
                <div class="mosaic-tile {{ $idx === 0 ? 'mosaic-hero' : '' }}" onclick="openRoomLightbox(this, {{ $idx }})">
                    <img src="{{ Str::startsWith($img, ['http://', 'https://']) ? $img : asset($img) }}" alt="{{ $room->translated_name }}" loading="{{ $idx < 3 ? 'eager' : 'lazy' }}">
                    <div class="mosaic-hover">
                        <i class="fas fa-search-plus"></i>
                    </div>
                </div>
                @endforeach
            </div>

            <div class="room-card-content">
                <!-- Room Badge -->
                <div class="room-badge">
                    <i class="fas fa-gem"></i> {{ __('messages.rooms.exclusive') }}
                </div>

                <!-- Room Name -->
                <h3 class="room-name">{{ $room->translated_name }}</h3>

                <!-- Description -->
                <p class="room-description">{{ $room->translated_description }}</p>

                <!-- Room Features Grid -->
                <div class="room-features-grid">
                    <div class="room-feature-item">
                        <i class="fas fa-users"></i>
                        <span class="feature-val">{{ $room->capacity }}</span>
                        <span class="feature-lbl">{{ __('messages.rooms.guests') }}</span>
                    </div>
                    <div class="room-feature-item">
                        <i class="fas fa-bed"></i>
                        <span class="feature-val">{{ $room->capacity > 2 ? 'King' : 'Queen' }}</span>
                        <span class="feature-lbl">{{ __('messages.rooms.bedType') }}</span>
                    </div>
                    <div class="room-feature-item">
                        <i class="fas fa-mountain"></i>
                        <span class="feature-val">Atlas</span>
                        <span class="feature-lbl">{{ __('messages.rooms.view') }}</span>
                    </div>
                    <div class="room-feature-item">
                        <i class="fas fa-expand-arrows-alt"></i>
                        <span class="feature-val">{{ $roomSurface }}</span>
                        <span class="feature-lbl">{{ __('messages.rooms.size') }}</span>
                    </div>
                </div>

                <!-- Amenities -->
                @if(count($amenities) > 0)
                <div class="amenities-section">
                    <h4 class="room-amenities-title">{{ __('messages.rooms.amenities') }}</h4>
                    <div>
                        @foreach($amenities as $amenity)
                        <span class="amenity-tag">
                            <i class="fas fa-check-circle"></i>
                            {{ __('messages.amenities.' . $amenity, [], app()->getLocale()) !== 'messages.amenities.' . $amenity ? __('messages.amenities.' . $amenity) : $amenity }}
                        </span>
                        @endforeach
                    </div>
                </div>
                @endif

                <!-- Footer: Price + Booking -->
                <div class="room-footer">
                    <div class="price-block">
                        <span class="price-from">{{ __('messages.rooms.from') }}</span>
                        <span class="price-amount">{{ number_format($room->price) }} €<span class="price-unit">/ {{ __('messages.rooms.perNight') }}</span></span>
                    </div>
                    <button class="btn btn-gold" onclick="openBookingModal({{ $room->id }}, '{{ addslashes($room->translated_name) }}', {{ $room->price }})">
                        <i class="fas fa-calendar-check"></i> {{ __('messages.rooms.bookNow') }}
                    </button>
                </div>

                <!-- External Platforms -->
                <div class="platform-links">
                    <a href="https://www.booking.com/hotel/ma/dar-louka.en-gb.html" target="_blank" class="platform-link">
                        <i class="fas fa-hotel"></i> Booking.com
                    </a>
                    <a href="#" target="_blank" class="platform-link">
                        <i class="fas fa-home"></i> Airbnb
                    </a>
                    <a href="https://www.tripadvisor.com/Hotel_Review-g12908043-d26879498-Reviews-Dar_Louka-Louka_Marrakech_Safi.html" target="_blank" class="platform-link">
                        <i class="fas fa-plane"></i> TripAdvisor
                    </a>
                </div>
            </div>
        </div>
        @endforeach

        @endif
    </div>
</section>

<!-- Room Booking Modal -->
<div class="modal-backdrop" id="bookingModal">
    <div class="modal">
        <button class="modal-close" onclick="closeBookingModal()">&times;</button>
        <h2>{{ __('messages.booking.title') }}</h2>
        <p class="modal-subtitle" id="bookingRoomName"></p>
        
        <form id="bookingForm" onsubmit="submitBooking(event)">
            <input type="hidden" id="bookingRoomId" name="room_id">
            
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label"><i class="fas fa-calendar-alt text-gold"></i> {{ __('messages.booking.form.checkIn') }}</label>
                    <input type="date" class="form-input" id="bookingCheckIn" name="check_in" required>
                </div>
                <div class="form-group">
                    <label class="form-label"><i class="fas fa-calendar-alt text-gold"></i> {{ __('messages.booking.form.checkOut') }}</label>
                    <input type="date" class="form-input" id="bookingCheckOut" name="check_out" required>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label"><i class="fas fa-users text-gold"></i> {{ __('messages.booking.form.guests') }}</label>
                <input type="number" class="form-input" id="bookingGuests" name="guests" min="1" value="1" required>
            </div>

            <div class="form-group">
                <label class="form-label"><i class="fas fa-user text-gold"></i> {{ __('messages.booking.form.name') }}</label>
                <input type="text" class="form-input" id="bookingName" name="name" placeholder="{{ __('messages.booking.placeholder.name') }}" required>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label class="form-label"><i class="fas fa-envelope text-gold"></i> {{ __('messages.booking.form.email') }}</label>
                    <input type="email" class="form-input" id="bookingEmail" name="email" placeholder="{{ __('messages.booking.placeholder.email') }}" required>
                </div>
                <div class="form-group">
                    <label class="form-label"><i class="fas fa-phone text-gold"></i> {{ __('messages.booking.form.phone') }}</label>
                    <input type="tel" class="form-input" id="bookingPhone" name="phone" placeholder="{{ __('messages.booking.placeholder.phone') }}" required>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label"><i class="fas fa-comment-dots text-gold"></i> {{ __('messages.booking.form.specialRequests') }}</label>
                <textarea class="form-textarea" id="bookingRequests" name="special_requests" placeholder="{{ __('messages.booking.placeholder.specialRequests') }}"></textarea>
            </div>

            <div id="bookingError" class="alert alert-error hidden">
                <span class="alert-icon"><i class="fas fa-exclamation-circle"></i></span>
                <span id="bookingErrorText"></span>
            </div>

            <div id="bookingSuccess" class="alert alert-success hidden">
                <span class="alert-icon"><i class="fas fa-check-circle"></i></span>
                <span>{{ __('messages.booking.form.success') }}</span>
            </div>

            <button type="submit" class="btn btn-gold w-full" id="bookingSubmitBtn">
                <i class="fas fa-calendar-check"></i> {{ __('messages.booking.form.submit') }}
            </button>
        </form>
    </div>
</div>

<!-- Room Lightbox -->
<div class="room-lightbox" id="roomLightbox" onclick="closeLightboxOutside(event)">
    <div class="room-lightbox-content">
        <button class="room-lightbox-close" onclick="closeRoomLightbox()"><i class="fas fa-times"></i></button>
        <button class="room-lightbox-btn room-lightbox-prev" onclick="lightboxNav(-1)"><i class="fas fa-chevron-left"></i></button>
        <img id="lightboxMainImg" src="" alt="">
        <button class="room-lightbox-btn room-lightbox-next" onclick="lightboxNav(1)"><i class="fas fa-chevron-right"></i></button>
        <div class="room-lightbox-counter" id="lightboxCounter"></div>
        <div class="room-lightbox-thumbstrip" id="lightboxThumbs"></div>
    </div>
</div>
@endsection

@push('scripts')
<script>
const bookingTranslations = {
    conflictMessage: "{{ __('messages.booking.form.conflictDates') }}",
    submitting: "{{ __('messages.common.loading') }}",
    submit: "{{ __('messages.booking.form.submit') }}"
};

// Room Gallery Lightbox
let lightboxImages = [];
let lightboxIndex = 0;

function openRoomLightbox(el, startIndex) {
    const gallery = el.closest('.room-gallery-mosaic');
    lightboxImages = JSON.parse(gallery.dataset.images);
    lightboxIndex = startIndex;

    const lightbox = document.getElementById('roomLightbox');
    const mainImg = document.getElementById('lightboxMainImg');
    const counter = document.getElementById('lightboxCounter');
    const thumbs = document.getElementById('lightboxThumbs');

    // Build thumb strip
    thumbs.innerHTML = lightboxImages.map((img, i) =>
        `<img src="${img.startsWith('/') ? img : '/' + img}" onclick="lightboxGoTo(${i})" class="${i === startIndex ? 'active' : ''}" alt="">`
    ).join('');

    lightboxGoTo(startIndex);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function lightboxGoTo(index) {
    lightboxIndex = index;
    const src = lightboxImages[index];
    document.getElementById('lightboxMainImg').src = src.startsWith('/') ? src : '/' + src;
    document.getElementById('lightboxCounter').textContent = (index + 1) + ' / ' + lightboxImages.length;

    document.querySelectorAll('#lightboxThumbs img').forEach((t, i) => {
        t.classList.toggle('active', i === index);
    });

    // Scroll active thumb into view
    const activeThumb = document.querySelector('#lightboxThumbs img.active');
    if (activeThumb) activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

function lightboxNav(dir) {
    let next = lightboxIndex + dir;
    if (next < 0) next = lightboxImages.length - 1;
    if (next >= lightboxImages.length) next = 0;
    lightboxGoTo(next);
}

function closeRoomLightbox() {
    document.getElementById('roomLightbox').classList.remove('active');
    document.body.style.overflow = '';
}

function closeLightboxOutside(e) {
    if (e.target === document.getElementById('roomLightbox')) {
        closeRoomLightbox();
    }
}

document.addEventListener('keydown', function(e) {
    const lb = document.getElementById('roomLightbox');
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape') closeRoomLightbox();
    if (e.key === 'ArrowLeft') lightboxNav(-1);
    if (e.key === 'ArrowRight') lightboxNav(1);
});
</script>
@endpush
