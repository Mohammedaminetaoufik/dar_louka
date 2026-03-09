<!-- Footer -->
<footer class="footer">
    <div class="container">
        <div class="footer-grid">
            <!-- Brand -->
            <div class="footer-brand">
                <img src="{{ asset('uploads/dar-louka-logo.svg') }}" alt="Dar Louka" class="footer-logo">
                <h3>Dar Louka</h3>
                <p class="footer-slogan">{{ __('messages.slogan') }}</p>
                <p class="footer-tagline">{{ __('messages.tagline') }}</p>
                <div class="footer-social">
                    <a href="https://www.instagram.com/dar_louka/" target="_blank" rel="noopener"><i class="fab fa-instagram"></i></a>
                    <a href="https://www.facebook.com/darlouka" target="_blank" rel="noopener"><i class="fab fa-facebook"></i></a>
                    <a href="https://www.tripadvisor.com/Hotel_Review-g12908043-d26879498-Reviews-Dar_Louka-Louka_Marrakech_Safi.html" target="_blank" rel="noopener"><i class="fab fa-tripadvisor"></i></a>
                </div>
            </div>

            <!-- Quick Links -->
            <div class="footer-section">
                <h4>{{ __('messages.footer.quickLinks') }}</h4>
                <ul class="footer-links">
                    <li><a href="{{ route('rooms') }}">{{ __('messages.nav.rooms') }}</a></li>
                    <li><a href="{{ route('events') }}">{{ __('messages.nav.events') }}</a></li>
                    <li><a href="{{ route('gallery') }}">{{ __('messages.nav.gallery') }}</a></li>
                    <li><a href="{{ route('about') }}">{{ __('messages.nav.about') }}</a></li>
                    <li><a href="{{ route('contact') }}">{{ __('messages.nav.contact') }}</a></li>
                </ul>
            </div>

            <!-- Contact Info -->
            <div class="footer-section">
                <h4>{{ __('messages.footer.contactUs') }}</h4>
                <div class="footer-contact-item">
                    <span class="footer-contact-icon"><i class="fas fa-map-marker-alt"></i></span>
                    <span>{{ __('messages.footer.address') }}</span>
                </div>
                <div class="footer-contact-item">
                    <span class="footer-contact-icon"><i class="fas fa-phone"></i></span>
                    <span>+212 6 62 02 46 68</span>
                </div>
                <div class="footer-contact-item">
                    <span class="footer-contact-icon"><i class="fas fa-envelope"></i></span>
                    <span>dar.louka@gmail.com</span>
                </div>
            </div>

            <!-- Booking Platforms -->
            <div class="footer-section">
                <h4>{{ __('messages.footer.bookingPlatforms') }}</h4>
                <ul class="footer-links">
                    <li><a href="https://www.booking.com/hotel/ma/dar-louka.en-gb.html" target="_blank" rel="noopener"><i class="fas fa-hotel"></i> Booking.com</a></li>
                    <li><a href="#" target="_blank" rel="noopener"><i class="fas fa-home"></i> Airbnb</a></li>
                    <li><a href="https://www.tripadvisor.com/Hotel_Review-g12908043-d26879498-Reviews-Dar_Louka-Louka_Marrakech_Safi.html" target="_blank" rel="noopener"><i class="fab fa-tripadvisor"></i> TripAdvisor</a></li>
                </ul>
            </div>
        </div>

        <div class="footer-bottom">
            <p>&copy; {{ date('Y') }} Dar Louka. {{ __('messages.footer.rights') }}</p>
        </div>
    </div>
</footer>
