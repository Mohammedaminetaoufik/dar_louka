<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    @php
        $isFr = app()->getLocale() === 'fr';
        $defaultDescription = $isFr
            ? "Dar Louka - Maison d'hôte authentique à Tahanaout près de Marrakech, Maroc. Hébergement de charme avec vue sur l'Atlas, piscine, spa Shiatsu. Réservez votre séjour dans notre riad traditionnel."
            : "Dar Louka - Authentic guesthouse in Tahanaout near Marrakech, Morocco. Charming accommodation with Atlas Mountain views, pool, Shiatsu spa. Book your stay in our traditional riad.";
        $defaultKeywords = $isFr
            ? "maison d'hôte marrakech, maison d'hôte maroc, hotel marrakech, riad marrakech, hébergement marrakech, guesthouse marrakech, dar louka, tahanaout, atlas, séjour marrakech, chambre d'hôte maroc, hotel maroc, retraite bien-être marrakech"
            : "guesthouse marrakech, guesthouse morocco, hotel marrakech, riad marrakech, accommodation marrakech, maison d hote marrakech, dar louka, tahanaout, atlas mountains, stay marrakech, bed and breakfast morocco, hotel morocco, wellness retreat marrakech";
        $defaultTitleSuffix = $isFr ? "Maison d'hôte à Marrakech, Maroc" : "Guesthouse in Marrakech, Morocco";
        $metaDesc = View::hasSection('meta_description') ? View::getSection('meta_description') : $defaultDescription;
        $metaKw = View::hasSection('meta_keywords') ? View::getSection('meta_keywords') : $defaultKeywords;
        $titleSuffix = View::hasSection('title_suffix') ? View::getSection('title_suffix') : $defaultTitleSuffix;
        $pageTitle = View::hasSection('title') ? View::getSection('title') : 'Dar Louka';
    @endphp
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="{{ $metaDesc }}">
    <meta name="keywords" content="{{ $metaKw }}">
    <meta name="author" content="Dar Louka">
    <meta name="robots" content="index, follow">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ $pageTitle }} - {{ $titleSuffix }}</title>

    <!-- Canonical & Language Alternates -->
    <link rel="canonical" href="{{ url()->current() }}">
    <link rel="alternate" hreflang="fr" href="{{ url()->current() }}?lang=fr">
    <link rel="alternate" hreflang="en" href="{{ url()->current() }}?lang=en">
    <link rel="alternate" hreflang="x-default" href="{{ url()->current() }}">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:title" content="{{ $pageTitle }} - {{ $titleSuffix }}">
    <meta property="og:description" content="{{ $metaDesc }}">
    <meta property="og:image" content="@yield('og_image', asset('uploads/dar-louka-logo.svg'))">
    <meta property="og:locale" content="{{ $isFr ? 'fr_FR' : 'en_GB' }}">
    <meta property="og:site_name" content="Dar Louka">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $pageTitle }} - {{ $titleSuffix }}">
    <meta name="twitter:description" content="{{ $metaDesc }}">
    <meta name="twitter:image" content="@yield('og_image', asset('uploads/dar-louka-logo.svg'))">

    <!-- Geo Tags -->
    <meta name="geo.region" content="MA-07">
    <meta name="geo.placename" content="Tahanaout, Marrakech-Safi, Morocco">
    <meta name="geo.position" content="31.2861;-7.9498">
    <meta name="ICBM" content="31.2861, -7.9498">

    <!-- Favicons -->
    <link rel="icon" href="{{ asset('uploads/favicon.svg') }}" type="image/svg+xml">
    <link rel="shortcut icon" href="{{ asset('uploads/favicon.svg') }}" type="image/svg+xml">
    <link rel="apple-touch-icon" href="{{ asset('uploads/dar-louka-logo.svg') }}">

    <!-- Fonts & Styles -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">
    {
        "@@context": "https://schema.org",
        "@@type": "LodgingBusiness",
        "name": "Dar Louka",
        "description": "{{ $defaultDescription }}",
        "url": "{{ url('/') }}",
        "logo": "{{ asset('uploads/dar-louka-logo.svg') }}",
        "image": "{{ asset('uploads/dar-louka-logo.svg') }}",
        "telephone": "+212662024668",
        "email": "dar.louka@gmail.com",
        "address": {
            "@@type": "PostalAddress",
            "streetAddress": "Douar Ait Souka",
            "addressLocality": "Tahanaout",
            "addressRegion": "Marrakech-Safi",
            "addressCountry": "MA"
        },
        "geo": {
            "@@type": "GeoCoordinates",
            "latitude": 31.2861,
            "longitude": -7.9498
        },
        "priceRange": "600 MAD - 1100 MAD",
        "starRating": {
            "@@type": "Rating",
            "ratingValue": "5"
        },
        "amenityFeature": [
            {"@@type": "LocationFeatureSpecification", "name": "Pool", "value": true},
            {"@@type": "LocationFeatureSpecification", "name": "Air Conditioning", "value": true},
            {"@@type": "LocationFeatureSpecification", "name": "Garden", "value": true},
            {"@@type": "LocationFeatureSpecification", "name": "Mountain View", "value": true},
            {"@@type": "LocationFeatureSpecification", "name": "Free Parking", "value": true}
        ],
        "sameAs": [
            "https://www.instagram.com/dar_louka/",
            "https://www.facebook.com/darlouka",
            "https://www.tripadvisor.com/Hotel_Review-g12908043-d26879498-Reviews-Dar_Louka-Louka_Marrakech_Safi.html",
            "https://www.booking.com/hotel/ma/dar-louka.en-gb.html"
        ]
    }
    </script>
    @stack('structured_data')
</head>
<body>
    @include('partials.splash')

    @include('partials.header')

    <main id="main-content">
        @yield('content')
    </main>

    @include('partials.footer')


    @include('partials.whatsapp')

    <!-- Lightbox -->
    <div class="lightbox" id="lightbox">
        <button class="lightbox-close" onclick="closeLightbox()">&times;</button>
        <img id="lightbox-img" src="" alt="">
    </div>

    <script src="{{ asset('js/app.js') }}?v={{ filemtime(public_path('js/app.js')) }}"></script>
    @stack('scripts')
</body>
</html>
