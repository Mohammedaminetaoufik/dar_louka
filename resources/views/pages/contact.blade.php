@extends('layouts.app')
@section('title', __('messages.nav.contact'))
@section('meta_description')
@php
    echo app()->getLocale() === 'fr'
        ? "Contactez Dar Louka, maison d'hôte à Tahanaout, Marrakech. Réservation, informations et accès. Douar Ait Souka, à 30 min de Marrakech, Maroc."
        : "Contact Dar Louka guesthouse in Tahanaout, Marrakech. Reservations, information and directions. Douar Ait Souka, 30 min from Marrakech, Morocco.";
@endphp
@endsection

@section('content')
<!-- Page Hero -->
<section class="page-hero">
    <div class="hero-ornament">
        <span><i class="fas fa-star"></i></span>
    </div>
    <h1>{{ __('messages.contact.title') }}</h1>
    <p>{{ __('messages.contact.subtitle') }}</p>
</section>

<!-- Contact Content -->
<section class="section">
    <div class="container">
        <!-- Success/Error Messages -->
        @if(session('success'))
        <div class="alert alert-success">
            <span class="alert-icon"><i class="fas fa-check-circle"></i></span>
            <span>{{ session('success') }}</span>
        </div>
        @endif

        @if($errors->any())
        <div class="alert alert-error">
            <span class="alert-icon"><i class="fas fa-exclamation-circle"></i></span>
            <span>{{ $errors->first() }}</span>
        </div>
        @endif

        <!-- Contact Info Cards -->
        <div class="grid-3 mb-8">
            <div class="contact-info-card">
                <div class="contact-icon"><i class="fas fa-map-marker-alt"></i></div>
                <div>
                    <h3>{{ __('messages.contact.address') }}</h3>
                    <p>{{ __('messages.footer.address') }}</p>
                </div>
            </div>
            <div class="contact-info-card">
                <div class="contact-icon"><i class="fas fa-phone"></i></div>
                <div>
                    <h3>{{ __('messages.contact.phone') }}</h3>
                    <p>+212 6 62 02 46 68</p>
                </div>
            </div>
            <div class="contact-info-card">
                <div class="contact-icon"><i class="fas fa-envelope"></i></div>
                <div>
                    <h3>{{ __('messages.contact.email') }}</h3>
                    <p>dar.louka@gmail.com</p>
                </div>
            </div>
        </div>

        <!-- Contact Form & Map -->
        <div class="contact-grid">
            <!-- Form -->
            <div>
                <h2 class="font-serif font-bold mb-4" style="font-size:1.5rem;">{{ __('messages.contact.formTitle') }}</h2>
                <form action="{{ route('contact.submit') }}" method="POST">
                    @csrf
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">{{ __('messages.contact.form.name') }}</label>
                            <input type="text" class="form-input" name="name" placeholder="{{ __('messages.contact.placeholder.name') }}" value="{{ old('name') }}" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">{{ __('messages.contact.form.email') }}</label>
                            <input type="email" class="form-input" name="email" placeholder="{{ __('messages.contact.placeholder.email') }}" value="{{ old('email') }}" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">{{ __('messages.contact.form.phone') }}</label>
                            <input type="tel" class="form-input" name="phone" placeholder="{{ __('messages.contact.placeholder.phone') }}" value="{{ old('phone') }}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">{{ __('messages.contact.form.subject') }}</label>
                            <input type="text" class="form-input" name="subject" placeholder="{{ __('messages.contact.placeholder.subject') }}" value="{{ old('subject') }}">
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">{{ __('messages.contact.form.message') }}</label>
                        <textarea class="form-textarea" name="message" rows="5" placeholder="{{ __('messages.contact.placeholder.message') }}" required>{{ old('message') }}</textarea>
                    </div>

                    <button type="submit" class="btn btn-gold">
                        <i class="fas fa-paper-plane"></i> {{ __('messages.contact.form.submit') }}
                    </button>
                </form>
            </div>

            <!-- Map & Directions -->
            <div>
                <h2 class="font-serif font-bold mb-4" style="font-size:1.5rem;">{{ __('messages.contact.findUs') }}</h2>
                <div class="map-container mb-4">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3396.123!2d-8.123456!3d31.123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sDar%20Louka!5e0!3m2!1sen!2sma!4v1234567890" allowfullscreen loading="lazy"></iframe>
                </div>

                <div style="display:flex;flex-direction:column;gap:0.75rem;">
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
        </div>
    </div>
</section>
@endsection
