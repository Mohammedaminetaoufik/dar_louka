<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Tableau de bord - Dar Louka</title>
    <link rel="icon" href="{{ asset('uploads/favicon.svg') }}" type="image/svg+xml">
    <link rel="shortcut icon" href="{{ asset('uploads/favicon.svg') }}" type="image/svg+xml">
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body style="background: var(--sand-50);">
    <!-- Admin Header -->
    <header class="admin-header">
        <h1><img src="{{ asset('uploads/dar-louka-logo.png') }}" alt="Dar Louka" style="height:32px;vertical-align:middle;margin-right:8px;"> Dar Louka - Administration</h1>
        <div style="display:flex;align-items:center;gap:1rem;">
            <a href="{{ route('home') }}" class="btn btn-sm btn-outline" style="border-color:var(--color-primary);color:var(--color-primary);">
                <i class="fas fa-external-link-alt"></i> Voir le site
            </a>
            <form action="{{ route('admin.logout') }}" method="POST" style="display:inline;">
                @csrf
                <button type="submit" class="btn btn-sm btn-danger"><i class="fas fa-sign-out-alt"></i> Déconnexion</button>
            </form>
        </div>
    </header>

    <div class="admin-container">
        <!-- Tabs -->
        <div class="admin-tabs">
            <button class="admin-tab active" onclick="switchTab('rooms', this)"><i class="fas fa-bed"></i> Chambres</button>
            <button class="admin-tab" onclick="switchTab('events', this)"><i class="fas fa-calendar-alt"></i> Forfaits</button>
            <button class="admin-tab" onclick="switchTab('gallery', this)"><i class="fas fa-images"></i> Galerie</button>
            <button class="admin-tab" onclick="switchTab('roomBookings', this)"><i class="fas fa-book"></i> Réservations Chambres</button>
            <button class="admin-tab" onclick="switchTab('eventBookings', this)"><i class="fas fa-ticket-alt"></i> Réservations Forfaits</button>
        </div>

        <!-- ==================== ROOMS TAB ==================== -->
        <div class="tab-content" id="tab-rooms">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
                <h2 class="font-serif font-bold" style="font-size:1.5rem;">Gestion des Chambres</h2>
                <button class="btn btn-primary" onclick="toggleRoomForm()"><i class="fas fa-plus"></i> Ajouter</button>
            </div>

            <!-- Room Form -->
            <div class="admin-form hidden" id="roomForm">
                <h3 id="roomFormTitle">Ajouter une chambre</h3>
                <input type="hidden" id="roomEditId">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Nom (FR)</label>
                        <input type="text" class="form-input" id="roomNameFr" placeholder="Suite Atlas">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Nom (EN)</label>
                        <input type="text" class="form-input" id="roomNameEn" placeholder="Atlas Suite">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Description (FR)</label>
                    <textarea class="form-textarea" id="roomDescFr"></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Description (EN)</label>
                    <textarea class="form-textarea" id="roomDescEn"></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Prix (MAD/nuit)</label>
                        <input type="number" class="form-input" id="roomPrice" min="0">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Capacité</label>
                        <input type="number" class="form-input" id="roomCapacity" min="1" value="2">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Équipements (un par ligne)</label>
                    <textarea class="form-textarea" id="roomAmenities" placeholder="wifi&#10;climatisation&#10;piscine"></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Images <span id="roomImageCounter" style="font-size:0.85rem;color:#888;font-weight:normal;">0/5</span></label>
                    <!-- Drop Zone -->
                    <div id="roomDropZone" class="room-drop-zone"
                         ondrop="handleRoomImageDrop(event)"
                         ondragover="handleRoomDragOver(event)"
                         ondragleave="handleRoomDragLeave(event)"
                         onclick="document.getElementById('roomImages').click()">
                        <i class="fas fa-cloud-upload-alt" style="font-size:2rem;color:var(--sand-400);margin-bottom:0.5rem;"></i>
                        <p style="margin:0;font-size:0.9rem;color:#666;">Glissez-déposez vos images ici</p>
                        <p style="margin:0.25rem 0 0;font-size:0.8rem;color:#999;">ou cliquez pour parcourir (max 5 images)</p>
                    </div>
                    <input type="file" id="roomImages" multiple accept="image/*" onchange="uploadRoomImages(this)" style="display:none;">
                    <div id="roomImagesList" class="room-images-grid"></div>
                    <p style="font-size:0.8rem;color:#888;margin-top:0.5rem;"><i class="fas fa-info-circle"></i> Glissez les images pour réorganiser. La première image sera l'image principale.</p>
                </div>

                <!-- iCal Integration Section -->
                <div id="roomIcalSection" class="hidden" style="border:1px solid var(--sand-200);border-radius:8px;padding:1rem;margin-top:1rem;background:var(--sand-50);">
                    <h4 style="margin:0 0 1rem 0;font-size:1.1rem;color:var(--color-primary);">
                        <i class="fas fa-sync-alt"></i> Synchronisation iCal (Booking.com, Airbnb, etc.)
                    </h4>

                    <!-- Export URL -->
                    <div class="form-group">
                        <label class="form-label"><i class="fas fa-upload"></i> URL d'export (à donner aux plateformes)</label>
                        <div style="display:flex;gap:0.5rem;align-items:center;">
                            <input type="text" class="form-input" id="roomIcalExportUrl" readonly style="flex:1;background:#f5f5f5;">
                            <button type="button" class="btn btn-sm btn-outline-primary" onclick="copyIcalUrl()" title="Copier"><i class="fas fa-copy"></i></button>
                            <button type="button" class="btn btn-sm btn-outline-primary" onclick="regenerateIcalToken()" title="Régénérer le token"><i class="fas fa-redo"></i></button>
                        </div>
                        <small style="color:#888;">Partagez cette URL avec Booking.com, Airbnb, TripAdvisor pour qu'ils importent vos disponibilités.</small>
                    </div>

                    <!-- Import URLs -->
                    <div class="form-group">
                        <label class="form-label"><i class="fas fa-download"></i> URLs d'import (depuis les plateformes)</label>
                        <div id="icalImportUrlsList"></div>
                        <button type="button" class="btn btn-sm btn-outline-primary" onclick="addIcalImportUrl()" style="margin-top:0.5rem;">
                            <i class="fas fa-plus"></i> Ajouter une URL iCal
                        </button>
                    </div>

                    <!-- Sync Status -->
                    <div style="display:flex;align-items:center;gap:1rem;margin-top:0.5rem;">
                        <button type="button" class="btn btn-sm btn-primary" onclick="syncRoomIcal()">
                            <i class="fas fa-sync-alt"></i> Synchroniser maintenant
                        </button>
                        <span id="roomLastSync" style="color:#888;font-size:0.85rem;"></span>
                        <span id="roomSyncStatus" style="font-size:0.85rem;"></span>
                    </div>
                </div>

                <div style="display:flex;gap:0.5rem;margin-top:1rem;">
                    <button class="btn btn-primary" onclick="saveRoom()"><i class="fas fa-save"></i> Enregistrer</button>
                    <button class="btn btn-outline-primary" onclick="toggleRoomForm()">Annuler</button>
                </div>
            </div>

            <!-- Rooms Table -->
            <div style="overflow-x:auto;">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Nom</th>
                            <th>Prix</th>
                            <th>Capacité</th>
                            <th>iCal</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="roomsTableBody">
                        @foreach($rooms as $room)
                        <tr data-id="{{ $room->id }}">
                            <td>
                                @php
                                    $allImgs = [];
                                    if($room->image) $allImgs[] = $room->image;
                                    $extra = is_string($room->images) ? (json_decode($room->images, true) ?? []) : ($room->images ?? []);
                                    foreach($extra as $ei) { if($ei && !in_array($ei, $allImgs)) $allImgs[] = $ei; }
                                @endphp
                                @if(count($allImgs) > 0)
                                <div class="table-images-row">
                                    @foreach($allImgs as $tIdx => $tImg)
                                    <img src="{{ asset($tImg) }}" alt="" title="Image {{ $tIdx + 1 }}{{ $tIdx === 0 ? ' (Principal)' : '' }}">
                                    @endforeach
                                </div>
                                @else
                                <span class="text-muted">—</span>
                                @endif
                            </td>
                            <td>{{ $room->name_fr ?: $room->name_en }}</td>
                            <td>{{ number_format($room->price) }} MAD</td>
                            <td>{{ $room->capacity }}</td>
                            <td>
                                @if($room->ical_token)
                                    @php
                                        $importUrls = json_decode($room->ical_import_urls, true) ?? [];
                                    @endphp
                                    <span style="color:var(--color-primary);font-size:0.85rem;" title="Export actif{{ count($importUrls) > 0 ? ', ' . count($importUrls) . ' import(s)' : '' }}">
                                        <i class="fas fa-check-circle"></i>
                                        {{ count($importUrls) > 0 ? count($importUrls) . ' lien(s)' : 'Export' }}
                                    </span>
                                    @if($room->last_ical_sync)
                                        <br><small style="color:#888;">Sync: {{ $room->last_ical_sync->format('d/m H:i') }}</small>
                                    @endif
                                @else
                                    <span style="color:#ccc;"><i class="fas fa-minus-circle"></i></span>
                                @endif
                            </td>
                            <td>
                                <div class="action-btns">
                                    <button class="btn btn-sm btn-primary" onclick="editRoom({{ $room->id }})"><i class="fas fa-edit"></i></button>
                                    <button class="btn btn-sm btn-danger" onclick="deleteRoom({{ $room->id }})"><i class="fas fa-trash"></i></button>
                                </div>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>

        <!-- ==================== EVENTS TAB ==================== -->
        <div class="tab-content hidden" id="tab-events">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
                <h2 class="font-serif font-bold" style="font-size:1.5rem;">Gestion des Forfaits</h2>
                <button class="btn btn-primary" onclick="toggleEventForm()"><i class="fas fa-plus"></i> Ajouter</button>
            </div>

            <!-- Event Form -->
            <div class="admin-form hidden" id="eventForm">
                <h3 id="eventFormTitle">Ajouter un forfait</h3>
                <input type="hidden" id="eventEditId">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Titre (FR)</label>
                        <input type="text" class="form-input" id="eventTitleFr">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Titre (EN)</label>
                        <input type="text" class="form-input" id="eventTitleEn">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Description (FR)</label>
                    <textarea class="form-textarea" id="eventDescFr"></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Description (EN)</label>
                    <textarea class="form-textarea" id="eventDescEn"></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Date de début</label>
                        <input type="date" class="form-input" id="eventStartDate">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Date de fin</label>
                        <input type="date" class="form-input" id="eventEndDate">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Type de Forfait</label>
                        <select class="form-select" id="eventType" onchange="onForfaitTypeChange()">
                            <option value="ONE_DAY">1 Jour (Retraite)</option>
                            <option value="THREE_DAYS">3 Nuits (Séjour)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Prix (€ / personne)</label>
                        <input type="number" class="form-input" id="eventPrice" min="0" step="0.01">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Max personnes</label>
                    <input type="number" class="form-input" id="eventMaxParticipants" min="1">
                    <small style="color:#888;">1 à 4 pers pour 3 Nuits, 1 à 2 pers pour 1 Jour</small>
                </div>
                <div class="form-group">
                    <label class="form-label">Programme FR (un par ligne)</label>
                    <textarea class="form-textarea" id="eventProgramFr" rows="6" placeholder="Jour 1 (Ancrage) : Arrivée, immersion, installation...&#10;Jour 2 (Réparation) : Petit-déjeuner, Séance Shiatsu...&#10;Jour 3 (Intégration) : Éveil Corporel, Déjeuner Vitalité...&#10;Jour 4 (Départ) : Départ et Intention"></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Programme EN (un par ligne)</label>
                    <textarea class="form-textarea" id="eventProgramEn" rows="6" placeholder="Day 1 (Grounding): Arrival, immersion...&#10;Day 2 (Repair): Breakfast, Shiatsu Session...&#10;Day 3 (Integration): Body Awakening, Vitality Lunch...&#10;Day 4 (Departure): Departure and Intention"></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Image</label>
                    <input type="file" class="form-input" id="eventImage" accept="image/*" onchange="uploadEventImage(this)">
                    <div id="eventImagePreview" style="margin-top:0.5rem;"></div>
                </div>
                <div style="display:flex;gap:0.5rem;">
                    <button class="btn btn-primary" onclick="saveEvent()"><i class="fas fa-save"></i> Enregistrer</button>
                    <button class="btn btn-outline-primary" onclick="toggleEventForm()">Annuler</button>
                </div>
            </div>

            <!-- Events Table -->
            <div style="overflow-x:auto;">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Titre</th>
                            <th>Type</th>
                            <th>Date</th>
                            <th>Prix</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="eventsTableBody">
                        @foreach($events as $event)
                        <tr data-id="{{ $event->id }}">
                            <td>
                                @if($event->image)
                                <img src="{{ asset($event->image) }}" alt="">
                                @else
                                <span class="text-muted">—</span>
                                @endif
                            </td>
                            <td>{{ $event->title_fr ?: $event->title_en }}</td>
                            <td><span class="badge {{ $event->type === 'THREE_DAYS' ? 'badge-confirmed' : 'badge-pending' }}">{{ $event->type === 'THREE_DAYS' ? '3 Nuits' : '1 Jour' }}</span></td>
                            <td>{{ $event->start_date->format('d/m/Y') }}</td>
                            <td>{{ $event->price ? number_format($event->price, 0, ',', ' ') . ' €/pers' : '—' }}</td>
                            <td>
                                <div class="action-btns">
                                    <button class="btn btn-sm btn-primary" onclick="editEvent({{ $event->id }})"><i class="fas fa-edit"></i></button>
                                    <button class="btn btn-sm btn-danger" onclick="deleteEvent({{ $event->id }})"><i class="fas fa-trash"></i></button>
                                </div>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>

        <!-- ==================== GALLERY TAB ==================== -->
        <div class="tab-content hidden" id="tab-gallery">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
                <h2 class="font-serif font-bold" style="font-size:1.5rem;">Gestion de la Galerie</h2>
                <button class="btn btn-primary" onclick="toggleGalleryForm()"><i class="fas fa-plus"></i> Ajouter</button>
            </div>

            <!-- Gallery Form -->
            <div class="admin-form hidden" id="galleryForm">
                <h3 id="galleryFormTitle">Ajouter une image</h3>
                <input type="hidden" id="galleryEditId">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Titre (FR)</label>
                        <input type="text" class="form-input" id="galleryTitleFr">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Titre (EN)</label>
                        <input type="text" class="form-input" id="galleryTitleEn">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Description (FR)</label>
                        <textarea class="form-textarea" id="galleryDescFr"></textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Description (EN)</label>
                        <textarea class="form-textarea" id="galleryDescEn"></textarea>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Catégorie</label>
                    <input type="text" class="form-input" id="galleryCategory" placeholder="rooms, garden, food...">
                </div>
                <div class="form-group">
                    <label class="form-label">Image</label>
                    <input type="file" class="form-input" id="galleryImage" accept="image/*" onchange="uploadGalleryImage(this)">
                    <div id="galleryImagePreview" style="margin-top:0.5rem;"></div>
                </div>
                <div style="display:flex;gap:0.5rem;">
                    <button class="btn btn-primary" onclick="saveGalleryItem()"><i class="fas fa-save"></i> Enregistrer</button>
                    <button class="btn btn-outline-primary" onclick="toggleGalleryForm()">Annuler</button>
                </div>
            </div>

            <!-- Gallery Grid -->
            <div class="grid-4" id="galleryAdminGrid">
                @foreach($galleryImages as $img)
                <div class="card" data-id="{{ $img->id }}">
                    <img src="{{ asset($img->image) }}" alt="" class="card-img" style="height:12rem;">
                    <div class="card-body" style="padding:1rem;">
                        <p class="font-semibold text-sm">{{ $img->title_fr ?: $img->title_en ?: 'Sans titre' }}</p>
                        @if($img->category)
                        <span class="badge badge-pending mt-1">{{ $img->category }}</span>
                        @endif
                        <div class="action-btns mt-2">
                            <button class="btn btn-sm btn-primary" onclick="editGalleryItem({{ $img->id }})"><i class="fas fa-edit"></i></button>
                            <button class="btn btn-sm btn-danger" onclick="deleteGalleryItem({{ $img->id }})"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                </div>
                @endforeach
            </div>
        </div>

        <!-- ==================== ROOM BOOKINGS TAB ==================== -->
        <div class="tab-content hidden" id="tab-roomBookings">
            <h2 class="font-serif font-bold mb-4" style="font-size:1.5rem;">Réservations Chambres</h2>
            <div style="overflow-x:auto;">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Client</th>
                            <th>Chambre</th>
                            <th>Arrivée</th>
                            <th>Départ</th>
                            <th>Voyageurs</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="roomBookingsTableBody">
                        @foreach($roomBookings as $booking)
                        <tr data-id="{{ $booking->id }}">
                            <td>
                                <div>
                                    <strong>{{ $booking->name }}</strong><br>
                                    <span class="text-xs text-muted">{{ $booking->email }}</span><br>
                                    <span class="text-xs text-muted">{{ $booking->phone }}</span>
                                </div>
                            </td>
                            <td>{{ $booking->room ? ($booking->room->name_fr ?: $booking->room->name_en) : '—' }}</td>
                            <td>{{ \Carbon\Carbon::parse($booking->check_in)->format('d/m/Y') }}</td>
                            <td>{{ \Carbon\Carbon::parse($booking->check_out)->format('d/m/Y') }}</td>
                            <td>{{ $booking->guests }}</td>
                            <td>
                                <span class="badge badge-{{ $booking->status }}">{{ ucfirst($booking->status) }}</span>
                            </td>
                            <td>
                                <div class="action-btns">
                                    @if($booking->status === 'pending')
                                    <button class="btn btn-sm btn-success" onclick="updateBookingStatus({{ $booking->id }}, 'confirmed')"><i class="fas fa-check"></i></button>
                                    @endif
                                    @if($booking->status !== 'cancelled')
                                    <button class="btn btn-sm btn-warning" onclick="updateBookingStatus({{ $booking->id }}, 'cancelled')"><i class="fas fa-times"></i></button>
                                    @endif
                                    <button class="btn btn-sm btn-danger" onclick="deleteBooking({{ $booking->id }})"><i class="fas fa-trash"></i></button>
                                    <button class="btn btn-sm btn-primary" onclick="toggleConfirmation({{ $booking->id }})"><i class="fas fa-envelope"></i></button>
                                </div>
                            </td>
                        </tr>
                        <!-- Confirmation Row -->
                        <tr class="hidden" id="confirm-{{ $booking->id }}">
                            <td colspan="7">
                                <div class="confirmation-area">
                                    <h4>Confirmation de réservation</h4>
                                    <div class="confirmation-methods">
                                        <button class="btn btn-sm btn-primary" onclick="generateConfirmation({{ $booking->id }}, 'email', 'fr')"><i class="fas fa-envelope"></i> Email FR</button>
                                        <button class="btn btn-sm btn-primary" onclick="generateConfirmation({{ $booking->id }}, 'email', 'en')"><i class="fas fa-envelope"></i> Email EN</button>
                                        <button class="btn btn-sm btn-outline-primary" onclick="generateConfirmation({{ $booking->id }}, 'email-send', 'fr')"><i class="fas fa-paper-plane"></i> Envoyer Email FR</button>
                                        <button class="btn btn-sm btn-outline-primary" onclick="generateConfirmation({{ $booking->id }}, 'email-send', 'en')"><i class="fas fa-paper-plane"></i> Envoyer Email EN</button>
                                        <button class="btn btn-sm btn-success" onclick="generateConfirmation({{ $booking->id }}, 'whatsapp', 'fr')"><i class="fab fa-whatsapp"></i> WhatsApp FR</button>
                                        <button class="btn btn-sm btn-success" onclick="generateConfirmation({{ $booking->id }}, 'whatsapp', 'en')"><i class="fab fa-whatsapp"></i> WhatsApp EN</button>
                                    </div>
                                    <div id="confirmMsg-{{ $booking->id }}" class="hidden" style="margin-top:1rem;">
                                        <textarea class="form-textarea" id="confirmText-{{ $booking->id }}" rows="8" style="font-family:monospace;font-size:0.8rem;"></textarea>
                                        <div style="display:flex;gap:0.5rem;margin-top:0.5rem;">
                                            <button class="btn btn-sm btn-primary" onclick="copyConfirmation({{ $booking->id }})"><i class="fas fa-copy"></i> Copier</button>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>

        <!-- ==================== EVENT BOOKINGS TAB ==================== -->
        <div class="tab-content hidden" id="tab-eventBookings">
            <h2 class="font-serif font-bold mb-4" style="font-size:1.5rem;">Réservations Forfaits</h2>
            <div style="overflow-x:auto;">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Client</th>
                            <th>Forfait</th>
                            <th>Dates</th>
                            <th>Participants</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="eventBookingsTableBody">
                        @foreach($eventBookings as $booking)
                        <tr data-id="{{ $booking->id }}">
                            <td>
                                <div>
                                    <strong>{{ $booking->name }}</strong><br>
                                    <span class="text-xs text-muted">{{ $booking->email }}</span><br>
                                    <span class="text-xs text-muted">{{ $booking->phone }}</span>
                                </div>
                            </td>
                            <td>{{ $booking->event ? ($booking->event->title_fr ?: $booking->event->title_en) : '—' }}</td>
                            <td>{{ \Carbon\Carbon::parse($booking->check_in)->format('d/m/Y') }} - {{ \Carbon\Carbon::parse($booking->check_out)->format('d/m/Y') }}</td>
                            <td>{{ $booking->guests }}</td>
                            <td>
                                <span class="badge badge-{{ $booking->status }}">{{ ucfirst($booking->status) }}</span>
                            </td>
                            <td>
                                <div class="action-btns">
                                    @if($booking->status === 'pending')
                                    <button class="btn btn-sm btn-success" onclick="updateBookingStatus({{ $booking->id }}, 'confirmed')"><i class="fas fa-check"></i></button>
                                    @endif
                                    @if($booking->status !== 'cancelled')
                                    <button class="btn btn-sm btn-warning" onclick="updateBookingStatus({{ $booking->id }}, 'cancelled')"><i class="fas fa-times"></i></button>
                                    @endif
                                    <button class="btn btn-sm btn-danger" onclick="deleteBooking({{ $booking->id }})"><i class="fas fa-trash"></i></button>
                                    <button class="btn btn-sm btn-primary" onclick="toggleConfirmation({{ $booking->id }})"><i class="fas fa-envelope"></i></button>
                                </div>
                            </td>
                        </tr>
                        <!-- Confirmation Row -->
                        <tr class="hidden" id="confirm-{{ $booking->id }}">
                            <td colspan="6">
                                <div class="confirmation-area">
                                    <h4>Confirmation de réservation</h4>
                                    <div class="confirmation-methods">
                                        <button class="btn btn-sm btn-primary" onclick="generateConfirmation({{ $booking->id }}, 'email', 'fr')"><i class="fas fa-envelope"></i> Email FR</button>
                                        <button class="btn btn-sm btn-primary" onclick="generateConfirmation({{ $booking->id }}, 'email', 'en')"><i class="fas fa-envelope"></i> Email EN</button>
                                        <button class="btn btn-sm btn-outline-primary" onclick="generateConfirmation({{ $booking->id }}, 'email-send', 'fr')"><i class="fas fa-paper-plane"></i> Envoyer Email FR</button>
                                        <button class="btn btn-sm btn-outline-primary" onclick="generateConfirmation({{ $booking->id }}, 'email-send', 'en')"><i class="fas fa-paper-plane"></i> Envoyer Email EN</button>
                                        <button class="btn btn-sm btn-success" onclick="generateConfirmation({{ $booking->id }}, 'whatsapp', 'fr')"><i class="fab fa-whatsapp"></i> WhatsApp FR</button>
                                        <button class="btn btn-sm btn-success" onclick="generateConfirmation({{ $booking->id }}, 'whatsapp', 'en')"><i class="fab fa-whatsapp"></i> WhatsApp EN</button>
                                    </div>
                                    <div id="confirmMsg-{{ $booking->id }}" class="hidden" style="margin-top:1rem;">
                                        <textarea class="form-textarea" id="confirmText-{{ $booking->id }}" rows="8" style="font-family:monospace;font-size:0.8rem;"></textarea>
                                        <div style="display:flex;gap:0.5rem;margin-top:0.5rem;">
                                            <button class="btn btn-sm btn-primary" onclick="copyConfirmation({{ $booking->id }})"><i class="fas fa-copy"></i> Copier</button>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Store data for JS -->
    <script>
        const roomsData = @json($roomsJson);
        const eventsData = @json($eventsJson);
        const galleryData = @json($galleryJson);
        const bookingsData = @json($bookingsJson);
        const eventBookingsData = @json($eventBookingsJson);
    </script>
    <script src="{{ asset('js/admin.js') }}?v={{ filemtime(public_path('js/admin.js')) }}"></script>
</body>
</html>
