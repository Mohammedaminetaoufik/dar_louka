@extends('layouts.app')
@section('title', __('messages.nav.home'))
@section('meta_description')
@php
    echo app()->getLocale() === 'fr'
        ? "Dar Louka - Maison d'hôte de charme à Tahanaout près de Marrakech, Maroc. Chambres avec vue Atlas, piscine, spa Shiatsu, cuisine marocaine authentique. Réservez votre hébergement au Maroc."
        : "Dar Louka - Charming guesthouse in Tahanaout near Marrakech, Morocco. Rooms with Atlas views, pool, Shiatsu spa, authentic Moroccan cuisine. Book your accommodation in Morocco.";
@endphp
@endsection
@section('meta_keywords')
@php
    echo app()->getLocale() === 'fr'
        ? "maison d'hôte marrakech, hotel marrakech, riad marrakech, maison d'hôte maroc, hébergement marrakech, guesthouse marrakech, dar louka tahanaout, retraite atlas, piscine marrakech, spa shiatsu maroc, chambre d'hôte maroc, hotel maroc"
        : "guesthouse marrakech, hotel marrakech, riad marrakech, maison d hote morocco, accommodation marrakech, guest house morocco, dar louka tahanaout, atlas retreat, pool marrakech, shiatsu spa morocco, bed and breakfast morocco, hotel morocco";
@endphp
@endsection

@section('content')
<!-- Hero Section -->
<section class="hero">
    <div class="hero-bg" style="background-image: url('{{ asset('images/hero.jpg') }}');"></div>
    <div class="hero-overlay"></div>
    <div class="hero-content">
        <div class="hero-badge">
            <i class="fas fa-star"></i> Atlas Retreat en Terre Berbère
        </div>
        <h1>{{ __('messages.hero.title') }}</h1>
        <p class="hero-subtitle">{{ __('messages.hero.subtitle') }}</p>
        <p class="hero-desc">{{ __('messages.hero.description') }}</p>
        <div class="hero-btns">
            <a href="{{ route('rooms') }}" class="btn btn-gold btn-lg">{{ __('messages.hero.cta') }}</a>
            <a href="{{ route('about') }}" class="btn btn-outline btn-lg">{{ __('messages.hero.secondary') }}</a>
        </div>
    </div>
    <div class="scroll-indicator"><i class="fas fa-chevron-down"></i></div>
</section>

<!-- Features Section -->
<section class="section">
    <div class="container">
        <div class="section-header">
            <div class="section-label">
                {{ __('messages.features.title') }}
            </div>
            <h2 class="section-title">{{ __('messages.features.title') }}</h2>
            <p class="section-subtitle">{{ __('messages.features.subtitle') }}</p>
        </div>
        <div class="grid-3">
            <!-- Feature 1: Mountain -->
            <div class="feature-card reveal">
                <div class="feature-icon"><i class="fas fa-mountain"></i></div>
                <h3>{{ __('messages.features.mountain.title') }}</h3>
                <p>{{ __('messages.features.mountain.description') }}</p>
            </div>
            <!-- Feature 2: Authenticity -->
            <div class="feature-card reveal">
                <div class="feature-icon"><i class="fas fa-home"></i></div>
                <h3>{{ __('messages.features.authenticity.title') }}</h3>
                <p>{{ __('messages.features.authenticity.description') }}</p>
            </div>
            <!-- Feature 3: Cuisine -->
            <div class="feature-card reveal">
                <div class="feature-icon"><i class="fas fa-utensils"></i></div>
                <h3>{{ __('messages.features.cuisine.title') }}</h3>
                <p>{{ __('messages.features.cuisine.description') }}</p>
            </div>
            <!-- Feature 4: Activities -->
            <div class="feature-card reveal">
                <div class="feature-icon"><i class="fas fa-hiking"></i></div>
                <h3>{{ __('messages.features.activities.title') }}</h3>
                <p>{{ __('messages.features.activities.description') }}</p>
            </div>
            <!-- Feature 5: Peace -->
            <div class="feature-card reveal">
                <div class="feature-icon"><i class="fas fa-spa"></i></div>
                <h3>{{ __('messages.features.peace.title') }}</h3>
                <p>{{ __('messages.features.peace.description') }}</p>
            </div>
            <!-- Feature 6: Hospitality -->
            <div class="feature-card reveal">
                <div class="feature-icon"><i class="fas fa-heart"></i></div>
                <h3>{{ __('messages.features.hospitality.title') }}</h3>
                <p>{{ __('messages.features.hospitality.description') }}</p>
            </div>
        </div>
    </div>
</section>

<!-- Room Preview Section -->
@if(count($rooms) > 0)
<section class="section section-alt">
    <div class="container">
        <div class="section-header">
            <div class="section-label">
                {{ __('messages.rooms.title') }}
            </div>
            <h2 class="section-title">{{ __('messages.rooms.title') }}</h2>
            <p class="section-subtitle">{{ __('messages.rooms.subtitle') }}</p>
        </div>
        <div class="grid-3">
            @foreach($rooms as $room)
            <div class="card room-card reveal">
                @php
                    $images = is_string($room->images) ? json_decode($room->images, true) : ($room->images ?? []);
                    $mainImg = $room->image ?: (count($images) > 0 ? $images[0] : '');
                @endphp
                @if($mainImg)
                <div style="overflow:hidden;">
                    <img src="{{ Str::startsWith($mainImg, ['http://', 'https://']) ? $mainImg : asset($mainImg) }}" alt="{{ $room->translated_name }}" class="card-img">
                </div>
                @endif
                <div class="card-body">
                    <h3>{{ $room->translated_name }}</h3>
                    <div class="room-meta">
                        <span><i class="fas fa-users"></i> {{ $room->capacity }} {{ __('messages.rooms.guests') }}</span>
                    </div>
                    <p class="room-description">{{ Str::limit($room->translated_description, 120) }}</p>
                    <div class="room-price-row">
                        <span class="room-price-label">{{ __('messages.rooms.from') }}</span>
                        <span class="room-price">{{ number_format($room->price) }} €<span class="room-price-unit">/ {{ __('messages.rooms.perNight') }}</span></span>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
        <div class="text-center mt-8">
            <a href="{{ route('rooms') }}" class="btn btn-gold">{{ __('messages.rooms.viewAll') }}</a>
        </div>
    </div>
</section>
@endif

<!-- Testimonials Section -->
<section class="section">
    <div class="container">
        <div class="section-header">
            <div class="section-label">
                {{ __('messages.testimonials.title') }}
            </div>
            <h2 class="section-title">{{ __('messages.testimonials.title') }}</h2>
            <p class="section-subtitle">{{ __('messages.testimonials.subtitle') }}</p>
        </div>
        <div class="grid-3">
            <!-- Sarah Johnson -->
            <div class="card testimonial-card reveal">
                <div class="stars">
                    <span class="star"><i class="fas fa-star"></i></span>
                    <span class="star"><i class="fas fa-star"></i></span>
                    <span class="star"><i class="fas fa-star"></i></span>
                    <span class="star"><i class="fas fa-star"></i></span>
                    <span class="star"><i class="fas fa-star"></i></span>
                </div>
                <p class="testimonial-text">"{{ __('messages.testimonials.review1') }}"</p>
                <p class="testimonial-author">Sarah Johnson</p>
                <p class="testimonial-country">{{ __('messages.testimonials.country1') }}</p>
            </div>
            <!-- Pierre Dubois -->
            <div class="card testimonial-card reveal">
                <div class="stars">
                    <span class="star"><i class="fas fa-star"></i></span>
                    <span class="star"><i class="fas fa-star"></i></span>
                    <span class="star"><i class="fas fa-star"></i></span>
                    <span class="star"><i class="fas fa-star"></i></span>
                    <span class="star"><i class="fas fa-star"></i></span>
                </div>
                <p class="testimonial-text">"{{ __('messages.testimonials.review2') }}"</p>
                <p class="testimonial-author">Pierre Dubois</p>
                <p class="testimonial-country">{{ __('messages.testimonials.country2') }}</p>
            </div>
            <!-- Ahmed Al-Rashid -->
            <div class="card testimonial-card reveal">
                <div class="stars">
                    <span class="star"><i class="fas fa-star"></i></span>
                    <span class="star"><i class="fas fa-star"></i></span>
                    <span class="star"><i class="fas fa-star"></i></span>
                    <span class="star"><i class="fas fa-star"></i></span>
                    <span class="star"><i class="fas fa-star"></i></span>
                </div>
                <p class="testimonial-text">"{{ __('messages.testimonials.review3') }}"</p>
                <p class="testimonial-author">Ahmed Al-Rashid</p>
                <p class="testimonial-country">{{ __('messages.testimonials.country3') }}</p>
            </div>
        </div>
    </div>
</section>

<!-- CTA Section -->
<section class="cta-section">
    <div class="cta-bg" style="background-image: url('{{ asset('images/cta-bg.jpg') }}');"></div>
    <div class="cta-overlay"></div>
    <div class="container cta-content">
        <h2>{{ __('messages.cta.title') }}</h2>
        <p>{{ __('messages.cta.description') }}</p>
        <div class="cta-btns">
            <a href="{{ route('rooms') }}" class="btn btn-gold btn-lg">{{ __('messages.cta.book') }}</a>
            <a href="{{ route('contact') }}" class="btn btn-outline btn-lg">{{ __('messages.cta.contact') }}</a>
        </div>
    </div>
</section>
@endsection
