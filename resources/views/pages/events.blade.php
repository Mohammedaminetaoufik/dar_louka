@extends('layouts.app')
@section('title', __('messages.nav.events'))
@section('meta_description')
@php
    echo app()->getLocale() === 'fr'
        ? "Forfaits bien-être et retraites à Dar Louka, maison d'hôte à Marrakech. Shiatsu, randonnée Atlas, cuisine marocaine, hammam. Séjours tout compris au Maroc."
        : "Wellness packages and retreats at Dar Louka guesthouse in Marrakech. Shiatsu, Atlas hiking, Moroccan cuisine, hammam. All-inclusive stays in Morocco.";
@endphp
@endsection
@section('meta_keywords')
@php
    echo app()->getLocale() === 'fr'
        ? "forfait bien-être marrakech, retraite shiatsu maroc, randonnée atlas marrakech, hammam marrakech, séjour tout compris maroc, retraite yoga marrakech, forfait maison d'hôte maroc"
        : "wellness package marrakech, shiatsu retreat morocco, atlas hiking marrakech, hammam marrakech, all-inclusive morocco, yoga retreat marrakech, guesthouse package morocco";
@endphp
@endsection

@section('content')
<!-- Page Hero -->
<section class="page-hero">
    <div class="hero-ornament">
        <span><i class="fas fa-spa"></i></span>
    </div>
    <h1>{{ __('messages.events.title') }}</h1>
    <p>{{ __('messages.events.subtitle') }}</p>
</section>

<!-- Forfaits List -->
<section class="section">
    <div class="container">
        @if(count($events) === 0)
        <p class="text-center text-muted">{{ __('messages.events.noEvents') }}</p>
        @else
        <div class="grid-2">
            @foreach($events->sortByDesc(fn($e) => $e->type === 'THREE_DAYS') as $event)
            <div class="card event-card reveal">
                @if($event->image)
                <div style="overflow:hidden;position:relative;">
                    <img src="{{ asset($event->image) }}" alt="{{ $event->translated_title }}" class="card-img">
                    <span class="badge {{ $event->type === 'THREE_DAYS' ? 'badge-confirmed' : 'badge-pending' }}" style="position:absolute;top:1rem;left:1rem;font-size:0.9rem;padding:0.4rem 0.8rem;">
                        {{ $event->type === 'THREE_DAYS' ? __('messages.events.threeDays') : __('messages.events.oneDay') }}
                    </span>
                </div>
                @endif
                <div class="card-body">
                    @if(!$event->image)
                    <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem;">
                        <span class="badge {{ $event->type === 'THREE_DAYS' ? 'badge-confirmed' : 'badge-pending' }}">
                            {{ $event->type === 'THREE_DAYS' ? __('messages.events.threeDays') : __('messages.events.oneDay') }}
                        </span>
                    </div>
                    @endif
                    <h3>{{ $event->translated_title }}</h3>

                    <div class="event-meta" style="margin-bottom:1rem;">
                        <span class="event-meta-item">
                            <i class="fas fa-calendar"></i>
                            {{ $event->start_date->format('d M Y') }}
                            @if($event->end_date) - {{ $event->end_date->format('d M Y') }} @endif
                        </span>
                        @if($event->max_participants)
                        <span class="event-meta-item">
                            <i class="fas fa-users"></i>
                            {{ __('messages.events.maxParticipants') }}: {{ $event->max_participants }} {{ __('messages.events.participants') }}
                        </span>
                        @endif
                        <span class="event-meta-item">
                            <i class="fas fa-shuttle-van"></i>
                            {{ __('messages.events.transferIncluded') }}
                        </span>
                        @if($event->type === 'THREE_DAYS')
                        <span class="event-meta-item">
                            <i class="fas fa-bed"></i>
                            {{ __('messages.events.doubleOrSingle') }}
                        </span>
                        @endif
                    </div>

                    <p class="room-description">{{ $event->translated_description }}</p>

                    <!-- Program -->
                    @php
                        $locale = app()->getLocale();
                        $program = $locale === 'fr' ? $event->program_fr : $event->program_en;
                        // If program is a string (JSON-encoded string value), split by newlines into an array
                        if (is_string($program)) {
                            $program = array_filter(explode("\n", $program));
                        }
                    @endphp
                    @if($program && is_array($program) && count($program) > 0)
                    <div style="margin-bottom:1rem;">
                        <strong class="room-amenities-title"><i class="fas fa-list-ul"></i> {{ __('messages.events.program') }}</strong>
                        <ul class="program-list" style="margin-top:0.5rem;">
                            @foreach($program as $item)
                            <li style="padding:0.3rem 0;border-bottom:1px solid var(--sand-100);">{{ $item }}</li>
                            @endforeach
                        </ul>
                    </div>
                    @endif

                    <div class="event-card__footer">
                        @if($event->price)
                        <div class="event-price" style="padding:1rem;background:var(--sand-50);border-radius:8px;text-align:center;">
                            <span style="font-size:2rem;font-weight:700;color:var(--color-primary);">{{ number_format($event->price, 0, ',', ' ') }} &euro;</span>
                            <span style="font-size:0.85rem;color:var(--color-muted-foreground);display:block;">{{ __('messages.events.perPerson') }}</span>
                        </div>
                        @endif

                        <button class="btn btn-gold w-full" onclick="openEventBookingModal({{ $event->id }}, '{{ addslashes($event->translated_title) }}', '{{ $event->start_date->format('Y-m-d') }}', '{{ $event->end_date ? $event->end_date->format('Y-m-d') : $event->start_date->format('Y-m-d') }}', {{ $event->max_participants ?? 'null' }})">
                            <i class="fas fa-calendar-check"></i> {{ __('messages.events.bookEvent') }}
                        </button>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
        @endif
    </div>
</section>

<!-- Forfait Booking Modal -->
<div class="modal-backdrop" id="eventBookingModal">
    <div class="modal">
        <button class="modal-close" onclick="closeEventBookingModal()">&times;</button>
        <h2>{{ __('messages.events.bookEvent') }}</h2>
        <p class="text-muted mb-4" id="eventBookingName"></p>
        
        <form id="eventBookingForm" onsubmit="submitEventBooking(event)">
            <input type="hidden" id="eventBookingId" name="event_id">
            <input type="hidden" id="eventCheckIn" name="check_in">
            <input type="hidden" id="eventCheckOut" name="check_out">
            
            <div class="form-group">
                <label class="form-label" for="eventGuests">{{ __('messages.booking.form.guests') }}</label>
                <input type="number" class="form-input" id="eventGuests" name="guests" min="1" value="1" required>
            </div>

            <div class="form-group">
                <label class="form-label" for="eventBookerName">{{ __('messages.booking.form.name') }}</label>
                <input type="text" class="form-input" id="eventBookerName" name="name" placeholder="{{ __('messages.booking.placeholder.name') }}" required>
            </div>

            <div class="form-group">
                <label class="form-label" for="eventBookerEmail">{{ __('messages.booking.form.email') }}</label>
                <input type="email" class="form-input" id="eventBookerEmail" name="email" placeholder="{{ __('messages.booking.placeholder.email') }}" required>
            </div>

            <div class="form-group">
                <label class="form-label" for="eventBookerPhone">{{ __('messages.booking.form.phone') }}</label>
                <input type="tel" class="form-input" id="eventBookerPhone" name="phone" placeholder="{{ __('messages.booking.placeholder.phone') }}" required>
            </div>

            <div class="form-group">
                <label class="form-label" for="eventBookerRequests">{{ __('messages.booking.form.specialRequests') }}</label>
                <textarea class="form-textarea" id="eventBookerRequests" name="special_requests" placeholder="{{ __('messages.booking.placeholder.specialRequests') }}"></textarea>
            </div>

            <div id="eventBookingError" class="alert alert-error hidden">
                <span class="alert-icon"><i class="fas fa-exclamation-circle"></i></span>
                <span id="eventBookingErrorText"></span>
            </div>

            <div id="eventBookingSuccess" class="alert alert-success hidden">
                <span class="alert-icon"><i class="fas fa-check-circle"></i></span>
                <span>{{ __('messages.booking.form.success') }}</span>
            </div>

            <button type="submit" class="btn btn-primary w-full" id="eventBookingSubmitBtn">
                {{ __('messages.booking.form.submit') }}
            </button>
        </form>
    </div>
</div>
@endsection
