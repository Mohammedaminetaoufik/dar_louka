<!-- Header -->
<header class="header" id="header">
    <div class="container header-inner">
        <!-- Logo -->
        <a href="{{ route('home') }}" class="logo-link">
            <img src="{{ asset('uploads/dar-louka-logo.svg') }}" alt="Dar Louka" class="logo-img">
            <span class="logo-text">Dar Louka</span>
        </a>

        <!-- Desktop Navigation -->
        <nav class="nav-desktop">
            <a href="{{ route('home') }}" class="nav-link {{ request()->routeIs('home') ? 'active' : '' }}">{{ __('messages.nav.home') }}</a>
            <a href="{{ route('about') }}" class="nav-link {{ request()->routeIs('about') ? 'active' : '' }}">{{ __('messages.nav.about') }}</a>
            <a href="{{ route('rooms') }}" class="nav-link {{ request()->routeIs('rooms') ? 'active' : '' }}">{{ __('messages.nav.rooms') }}</a>
            <a href="{{ route('events') }}" class="nav-link {{ request()->routeIs('events') ? 'active' : '' }}">{{ __('messages.nav.events') }}</a>
            <a href="{{ route('gallery') }}" class="nav-link {{ request()->routeIs('gallery') ? 'active' : '' }}">{{ __('messages.nav.gallery') }}</a>
            <a href="{{ route('contact') }}" class="nav-link {{ request()->routeIs('contact') ? 'active' : '' }}">{{ __('messages.nav.contact') }}</a>
        </nav>

        <!-- Controls -->
        <div class="header-controls">
            <!-- Language Dropdown -->
            <div class="lang-dropdown" id="langDropdown">
                <button class="lang-btn" onclick="toggleLangDropdown()">
                    <i class="fas fa-globe"></i>
                </button>
                <div class="lang-menu">
                    <a href="{{ route('lang.switch', 'fr') }}" class="lang-option {{ app()->getLocale() === 'fr' ? 'active' : '' }}"><span style="font-weight:700;font-size:0.75rem;border:1px solid currentColor;border-radius:2px;padding:1px 4px;margin-right:4px;">FR</span> Français</a>
                    <a href="{{ route('lang.switch', 'en') }}" class="lang-option {{ app()->getLocale() === 'en' ? 'active' : '' }}"><span style="font-weight:700;font-size:0.75rem;border:1px solid currentColor;border-radius:2px;padding:1px 4px;margin-right:4px;">EN</span> English</a>
                </div>
            </div>

            <!-- Mobile Nav Toggle -->
            <button class="mobile-toggle" onclick="toggleSidebar()">
                <i class="fas fa-bars"></i>
            </button>
        </div>
    </div>
</header>

<!-- Mobile Sidebar -->
<div class="sidebar-backdrop" id="sidebarBackdrop" onclick="toggleSidebar()"></div>
<nav class="sidebar" id="sidebar">
    <div class="sidebar-nav">
        <a href="{{ route('home') }}" class="sidebar-link">{{ __('messages.nav.home') }}</a>
        <a href="{{ route('about') }}" class="sidebar-link">{{ __('messages.nav.about') }}</a>
        <a href="{{ route('rooms') }}" class="sidebar-link">{{ __('messages.nav.rooms') }}</a>
        <a href="{{ route('events') }}" class="sidebar-link">{{ __('messages.nav.events') }}</a>
        <a href="{{ route('gallery') }}" class="sidebar-link">{{ __('messages.nav.gallery') }}</a>
        <a href="{{ route('contact') }}" class="sidebar-link">{{ __('messages.nav.contact') }}</a>
    </div>
</nav>
