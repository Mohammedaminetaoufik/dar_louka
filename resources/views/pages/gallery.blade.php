@extends('layouts.app')
@section('title', __('messages.nav.gallery'))
@section('meta_description')
@php
    echo app()->getLocale() === 'fr'
        ? "Galerie photos de Dar Louka, maison d'hôte à Tahanaout, Marrakech. Découvrez nos chambres, la piscine, les jardins et la vue sur l'Atlas. Hébergement authentique au Maroc."
        : "Photo gallery of Dar Louka guesthouse in Tahanaout, Marrakech. Discover our rooms, pool, gardens and Atlas Mountain views. Authentic accommodation in Morocco.";
@endphp
@endsection

@section('content')
<!-- Page Hero -->
<section class="page-hero">
    <div class="hero-ornament">
        <span><i class="fas fa-star"></i></span>
    </div>
    <h1>{{ __('messages.gallery.title') }}</h1>
    <p>{{ __('messages.gallery.subtitle') }}</p>
</section>

<!-- Gallery -->
<section class="section">
    <div class="container">
        @if(count($images) === 0)
        <p class="text-center text-muted">{{ __('messages.gallery.noImages') }}</p>
        @else
        <!-- Category Filter -->
        @php
            $categories = $images->pluck('category')->unique()->filter()->values();
        @endphp
        @if($categories->count() > 0)
        <div class="gallery-filters">
            <button class="btn btn-sm btn-gold gallery-filter active" data-category="all">{{ __('messages.gallery.all') }}</button>
            @foreach($categories as $cat)
            <button class="btn btn-sm btn-outline-primary gallery-filter" data-category="{{ $cat }}">{{ ucfirst($cat) }}</button>
            @endforeach
        </div>
        @endif

        <div class="gallery-grid" id="galleryGrid">
            @foreach($images as $image)
            <div class="gallery-item" data-category="{{ $image->category ?? 'all' }}" onclick="openLightbox('{{ Str::startsWith($image->image, ['http://', 'https://']) ? $image->image : asset($image->image) }}')">
                <img src="{{ Str::startsWith($image->image, ['http://', 'https://']) ? $image->image : asset($image->image) }}" alt="{{ $image->translated_title }}" loading="lazy">
                @if($image->translated_title || $image->translated_description)
                <div class="gallery-caption">
                    @if($image->translated_title)
                    <h3>{{ $image->translated_title }}</h3>
                    @endif
                    @if($image->translated_description)
                    <p>{{ $image->translated_description }}</p>
                    @endif
                </div>
                @endif
            </div>
            @endforeach
        </div>
        @endif
    </div>
</section>
@endsection
