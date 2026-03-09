@extends('layouts.app')
@section('title', __('messages.nav.about'))

@section('content')
<!-- Page Hero -->
<section class="page-hero">
    <div class="hero-ornament">
        <span><i class="fas fa-star"></i></span>
    </div>
    <h1>{{ __('messages.about.title') }}</h1>
    <p>{{ __('messages.about.subtitle') }}</p>
</section>

<!-- Our Story -->
<section class="section">
    <div class="container">
        <div class="about-story reveal">
            <div>
                <div class="section-label" style="text-align:left;margin-bottom:1.5rem;">
                    {{ __('messages.about.story.title') }}
                </div>
                <h2 style="font-family:var(--font-display);font-size:2.25rem;font-weight:400;margin-bottom:1.25rem;">{{ __('messages.about.story.title') }}</h2>
                <p style="margin-bottom:1rem;color:var(--color-muted-foreground);line-height:1.9;font-size:0.9375rem;">{{ __('messages.about.story.p1') }}</p>
                <p style="margin-bottom:1rem;color:var(--color-muted-foreground);line-height:1.9;font-size:0.9375rem;">{{ __('messages.about.story.p2') }}</p>
                <p style="color:var(--color-muted-foreground);line-height:1.9;font-size:0.9375rem;">{{ __('messages.about.story.p3') }}</p>
            </div>
            <div class="about-story-img">
                <img src="{{ asset('images/about-story.jpg') }}" alt="{{ __('messages.about.story.title') }}" onerror="this.style.display='none'">
            </div>
        </div>
    </div>
</section>

<!-- Values -->
<section class="section section-alt">
    <div class="container">
        <div class="section-header">
            <div class="section-label">{{ __('messages.about.values.title') }}</div>
            <h2 class="section-title">{{ __('messages.about.values.title') }}</h2>
            <p class="section-subtitle">{{ __('messages.about.values.subtitle') }}</p>
        </div>
        <div class="grid-4">
            <div class="value-card reveal">
                <div class="value-icon"><i class="fas fa-leaf"></i></div>
                <h3>{{ __('messages.about.values.sustainability.title') }}</h3>
                <p>{{ __('messages.about.values.sustainability.description') }}</p>
            </div>
            <div class="value-card reveal">
                <div class="value-icon"><i class="fas fa-hands-helping"></i></div>
                <h3>{{ __('messages.about.values.community.title') }}</h3>
                <p>{{ __('messages.about.values.community.description') }}</p>
            </div>
            <div class="value-card reveal">
                <div class="value-icon"><i class="fas fa-gem"></i></div>
                <h3>{{ __('messages.about.values.authenticity.title') }}</h3>
                <p>{{ __('messages.about.values.authenticity.description') }}</p>
            </div>
            <div class="value-card reveal">
                <div class="value-icon"><i class="fas fa-heart"></i></div>
                <h3>{{ __('messages.about.values.hospitality.title') }}</h3>
                <p>{{ __('messages.about.values.hospitality.description') }}</p>
            </div>
        </div>
    </div>
</section>

<!-- Location -->
<section class="section">
    <div class="container">
        <div class="section-header">
            <div class="section-label">{{ __('messages.about.location.title') }}</div>
            <h2 class="section-title">{{ __('messages.about.location.title') }}</h2>
            <p class="section-subtitle">{{ __('messages.about.location.subtitle') }}</p>
        </div>
        <div class="about-story reveal">
            <div>
                <p style="margin-bottom:1rem;color:var(--color-muted-foreground);line-height:1.9;">{{ __('messages.about.location.description') }}</p>
                <div style="margin-top:1.5rem;display:flex;flex-direction:column;gap:0.75rem;">
                    <div class="direction-card">
                        <span>{{ __('messages.about.location.marrakech') }}</span>
                        <span>{{ __('messages.about.location.marrakechTime') }}</span>
                    </div>
                    <div class="direction-card">
                        <span>{{ __('messages.about.location.airport') }}</span>
                        <span>{{ __('messages.about.location.airportTime') }}</span>
                    </div>
                    <div class="direction-card">
                        <span>{{ __('messages.about.location.atlas') }}</span>
                        <span>{{ __('messages.about.location.atlasTime') }}</span>
                    </div>
                </div>
            </div>
            <div class="map-container">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3396.123!2d-8.123456!3d31.123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sDar%20Louka!5e0!3m2!1sen!2sma!4v1234567890" allowfullscreen loading="lazy"></iframe>
            </div>
        </div>
    </div>
</section>
@endsection
