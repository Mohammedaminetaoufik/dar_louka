/* ============================================
   DAR LOUKA - Admin JavaScript
   ============================================ */

function getCsrfToken() {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.getAttribute('content') : '';
}

function apiHeaders() {
    return {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': getCsrfToken(),
        'Accept': 'application/json',
    };
}

function resolveImageSrc(url) {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    return url.startsWith('/') ? url : '/' + url;
}

function normalizeImagePathForSave(url) {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) {
        try {
            var parsed = new URL(url);
            return parsed.pathname || '';
        } catch (e) {
            return url;
        }
    }
    return url;
}

/* ---------- Tab Switching ---------- */
function switchTab(tabName, tabButton) {
    document.querySelectorAll('.tab-content').forEach(function (el) {
        el.classList.add('hidden');
    });
    document.querySelectorAll('.admin-tab').forEach(function (el) {
        el.classList.remove('active');
    });

    const tabContent = document.getElementById('tab-' + tabName);
    if (tabContent) tabContent.classList.remove('hidden');

    const activeButton = tabButton || document.querySelector('.admin-tab[onclick*="\'' + tabName + '\'"]');
    if (activeButton) activeButton.classList.add('active');

    try {
        localStorage.setItem('adminActiveTab', tabName);
    } catch (e) {
        console.warn('Cannot persist active tab in localStorage:', e);
    }
}

function getActiveTabName() {
    const activeTabContent = document.querySelector('.tab-content:not(.hidden)');
    if (!activeTabContent?.id) {
        return 'rooms';
    }
    return activeTabContent.id.replace('tab-', '');
}

function reloadPreservingCurrentTab() {
    try {
        localStorage.setItem('adminActiveTab', getActiveTabName());
    } catch (e) {
        console.warn('Cannot persist active tab before reload:', e);
    }
    location.reload();
}

/* ==================== ROOMS ==================== */
var roomUploadedImages = [];
var roomMainImage = '';
var MAX_ROOM_IMAGES = 5;

function toggleRoomForm() {
    var form = document.getElementById('roomForm');
    form.classList.toggle('hidden');
    if (form.classList.contains('hidden')) {
        resetRoomForm();
    } else {
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function resetRoomForm() {
    document.getElementById('roomEditId').value = '';
    document.getElementById('roomNameFr').value = '';
    document.getElementById('roomNameEn').value = '';
    document.getElementById('roomDescFr').value = '';
    document.getElementById('roomDescEn').value = '';
    document.getElementById('roomPrice').value = '';
    document.getElementById('roomCapacity').value = '2';
    document.getElementById('roomSurface').value = '';
    document.getElementById('roomAmenitiesFr').value = '';
    document.getElementById('roomAmenitiesEn').value = '';
    document.getElementById('roomImagesList').innerHTML = '';
    document.getElementById('roomFormTitle').textContent = 'Ajouter une chambre';
    roomUploadedImages = [];
    roomMainImage = '';
    updateImageCounter();
    // Reset iCal section
    document.getElementById('roomIcalSection').classList.add('hidden');
    document.getElementById('roomIcalExportUrl').value = '';
    document.getElementById('icalImportUrlsList').innerHTML = '';
    document.getElementById('roomLastSync').textContent = '';
    document.getElementById('roomSyncStatus').textContent = '';
}

function uploadRoomImages(input) {
    var files = input.files;
    var remaining = MAX_ROOM_IMAGES - roomUploadedImages.length;
    if (remaining <= 0) {
        alert('Maximum ' + MAX_ROOM_IMAGES + ' images autorisées.');
        input.value = '';
        return;
    }
    var toUpload = Math.min(files.length, remaining);
    for (var i = 0; i < toUpload; i++) {
        uploadFile(files[i], function (url) {
            roomUploadedImages.push(url);
            if (!roomMainImage) roomMainImage = url;
            renderRoomImages();
        }, 'rooms');
    }
    if (files.length > remaining) {
        alert('Seulement ' + remaining + ' image(s) supplémentaire(s) autorisée(s). Maximum ' + MAX_ROOM_IMAGES + '.');
    }
    input.value = '';
}

function handleRoomImageDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    var dropZone = document.getElementById('roomDropZone');
    dropZone.classList.remove('drag-over');

    var files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    var remaining = MAX_ROOM_IMAGES - roomUploadedImages.length;
    if (remaining <= 0) {
        alert('Maximum ' + MAX_ROOM_IMAGES + ' images autorisées.');
        return;
    }

    var toUpload = Math.min(files.length, remaining);
    for (var i = 0; i < toUpload; i++) {
        if (files[i].type.startsWith('image/')) {
            uploadFile(files[i], function (url) {
                roomUploadedImages.push(url);
                if (!roomMainImage) roomMainImage = url;
                renderRoomImages();
            }, 'rooms');
        }
    }
    if (files.length > remaining) {
        alert('Seulement ' + remaining + ' image(s) supplémentaire(s) autorisée(s). Maximum ' + MAX_ROOM_IMAGES + '.');
    }
}

function handleRoomDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('roomDropZone').classList.add('drag-over');
}

function handleRoomDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('roomDropZone').classList.remove('drag-over');
}

function updateImageCounter() {
    var counter = document.getElementById('roomImageCounter');
    if (counter) {
        counter.textContent = roomUploadedImages.length + '/' + MAX_ROOM_IMAGES;
        if (roomUploadedImages.length >= MAX_ROOM_IMAGES) {
            counter.style.color = '#e74c3c';
        } else {
            counter.style.color = '#888';
        }
    }
    // Show/hide drop zone
    var dropZone = document.getElementById('roomDropZone');
    if (dropZone) {
        dropZone.style.display = roomUploadedImages.length >= MAX_ROOM_IMAGES ? 'none' : '';
    }
}

var dragSrcIdx = null;

function renderRoomImages() {
    var container = document.getElementById('roomImagesList');
    container.innerHTML = '';
    roomUploadedImages.forEach(function (url, idx) {
        var div = document.createElement('div');
        div.className = 'room-img-thumb';
        div.draggable = true;
        div.dataset.idx = idx;
        var imgSrc = resolveImageSrc(url);
        div.innerHTML =
            '<img src="' + imgSrc + '" alt="Room image ' + (idx + 1) + '">' +
            '<span class="room-img-num">' + (idx + 1) + '</span>' +
            (idx === 0 ? '<span class="room-img-main">Principal</span>' : '') +
            '<button type="button" class="room-img-replace" onclick="replaceRoomImage(' + idx + ')" title="Remplacer"><i class="fas fa-sync-alt"></i></button>' +
            '<button type="button" class="room-img-remove" onclick="removeRoomImage(' + idx + ')" title="Supprimer">&times;</button>';

        // Hidden file input for replacing this specific image
        var replaceInput = document.createElement('input');
        replaceInput.type = 'file';
        replaceInput.accept = 'image/*';
        replaceInput.style.display = 'none';
        replaceInput.id = 'replaceInput-' + idx;
        replaceInput.onchange = function() {
            if (this.files[0]) {
                var replaceIdx = parseInt(this.id.split('-')[1]);
                uploadFile(this.files[0], function(url) {
                    roomUploadedImages[replaceIdx] = url;
                    if (replaceIdx === 0) roomMainImage = url;
                    renderRoomImages();
                }, 'rooms');
            }
        };
        div.appendChild(replaceInput);

        // Drag handlers for reordering
        div.addEventListener('dragstart', function (e) {
            dragSrcIdx = idx;
            e.dataTransfer.effectAllowed = 'move';
            div.classList.add('dragging');
        });
        div.addEventListener('dragend', function () {
            div.classList.remove('dragging');
            dragSrcIdx = null;
        });
        div.addEventListener('dragover', function (e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            div.classList.add('drag-target');
        });
        div.addEventListener('dragleave', function () {
            div.classList.remove('drag-target');
        });
        div.addEventListener('drop', function (e) {
            e.preventDefault();
            e.stopPropagation();
            div.classList.remove('drag-target');
            if (dragSrcIdx !== null && dragSrcIdx !== idx) {
                // Swap images
                var moved = roomUploadedImages.splice(dragSrcIdx, 1)[0];
                roomUploadedImages.splice(idx, 0, moved);
                roomMainImage = roomUploadedImages[0];
                renderRoomImages();
            }
        });

        container.appendChild(div);
    });
    updateImageCounter();
}

function replaceRoomImage(idx) {
    var input = document.getElementById('replaceInput-' + idx);
    if (input) input.click();
}

function removeRoomImage(idx) {
    roomUploadedImages.splice(idx, 1);
    if (roomUploadedImages.length > 0) {
        roomMainImage = roomUploadedImages[0];
    } else {
        roomMainImage = '';
    }
    renderRoomImages();
}

function editRoom(id) {
    var room = roomsData.find(function (r) { return r.id === id; });
    if (!room) return;
    document.getElementById('roomEditId').value = room.id;
    document.getElementById('roomNameFr').value = room.name_fr || '';
    document.getElementById('roomNameEn').value = room.name_en || '';
    document.getElementById('roomDescFr').value = room.description_fr || '';
    document.getElementById('roomDescEn').value = room.description_en || '';
    document.getElementById('roomPrice').value = room.price || '';
    document.getElementById('roomCapacity').value = room.capacity || 2;
    document.getElementById('roomSurface').value = room.surface || '';
    var amenitiesFr = room.amenities_fr;
    if (typeof amenitiesFr === 'string') {
        try { amenitiesFr = JSON.parse(amenitiesFr); } catch (e) { amenitiesFr = []; }
    }
    if (!Array.isArray(amenitiesFr) || amenitiesFr.length === 0) {
        amenitiesFr = room.amenities;
        if (typeof amenitiesFr === 'string') {
            try { amenitiesFr = JSON.parse(amenitiesFr); } catch (e) { amenitiesFr = []; }
        }
    }

    var amenitiesEn = room.amenities_en;
    if (typeof amenitiesEn === 'string') {
        try { amenitiesEn = JSON.parse(amenitiesEn); } catch (e) { amenitiesEn = []; }
    }
    if (!Array.isArray(amenitiesEn) || amenitiesEn.length === 0) {
        amenitiesEn = room.amenities;
        if (typeof amenitiesEn === 'string') {
            try { amenitiesEn = JSON.parse(amenitiesEn); } catch (e) { amenitiesEn = []; }
        }
    }

    document.getElementById('roomAmenitiesFr').value = (amenitiesFr || []).join('\n');
    document.getElementById('roomAmenitiesEn').value = (amenitiesEn || []).join('\n');
    roomMainImage = room.image || '';
    var images = room.images;
    if (typeof images === 'string') {
        try { images = JSON.parse(images); } catch (e) { images = []; }
    }
    roomUploadedImages = [];
    if (roomMainImage) roomUploadedImages.push(roomMainImage);
    if (Array.isArray(images)) {
        images.forEach(function (img) {
            if (img && !roomUploadedImages.includes(img)) roomUploadedImages.push(img);
        });
    }
    renderRoomImages();
    document.getElementById('roomFormTitle').textContent = 'Modifier la chambre';

    // Populate iCal section
    var icalSection = document.getElementById('roomIcalSection');
    icalSection.classList.remove('hidden');
    document.getElementById('roomIcalExportUrl').value = room.export_url || '';

    // Populate import URLs
    var importUrls = room.ical_import_urls || [];
    document.getElementById('icalImportUrlsList').innerHTML = '';
    if (importUrls.length > 0) {
        importUrls.forEach(function (entry, idx) {
            addIcalImportUrlRow(entry.platform || 'other', entry.url || '');
        });
    }

    // Show last sync
    var lastSyncEl = document.getElementById('roomLastSync');
    if (room.last_ical_sync) {
        lastSyncEl.textContent = 'Dernière sync: ' + room.last_ical_sync;
    } else {
        lastSyncEl.textContent = 'Jamais synchronisé';
    }
    document.getElementById('roomSyncStatus').textContent = '';

    var roomForm = document.getElementById('roomForm');
    roomForm.classList.remove('hidden');
    roomForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function saveRoom() {
    var id = document.getElementById('roomEditId').value;
    var amenitiesFrText = document.getElementById('roomAmenitiesFr').value;
    var amenitiesEnText = document.getElementById('roomAmenitiesEn').value;
    var amenitiesFr = amenitiesFrText.split('\n').map(function (a) { return a.trim(); }).filter(Boolean);
    var amenitiesEn = amenitiesEnText.split('\n').map(function (a) { return a.trim(); }).filter(Boolean);

    var body = {
        name_fr: document.getElementById('roomNameFr').value,
        name_en: document.getElementById('roomNameEn').value,
        description_fr: document.getElementById('roomDescFr').value,
        description_en: document.getElementById('roomDescEn').value,
        price: parseFloat(document.getElementById('roomPrice').value) || 0,
        capacity: parseInt(document.getElementById('roomCapacity').value) || 2,
        surface: parseInt(document.getElementById('roomSurface').value) || null,
        amenities_fr: amenitiesFr,
        amenities_en: amenitiesEn,
        amenities: amenitiesFr.length ? amenitiesFr : amenitiesEn,
        image: normalizeImagePathForSave(roomUploadedImages[0] || ''),
        images: roomUploadedImages.slice(1).map(normalizeImagePathForSave),
    };

    var url = id ? '/api/rooms/' + id : '/api/rooms';
    var method = id ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        headers: apiHeaders(),
        body: JSON.stringify(body),
    })
        .then(function (res) {
            if (!res.ok) {
                return res.json().then(function (err) {
                    var msg = 'Erreur de sauvegarde.';
                    if (err.errors) {
                        msg = Object.values(err.errors).flat().join('\n');
                    } else if (err.message) {
                        msg = err.message;
                    }
                    throw new Error(msg);
                });
            }
            return res.json();
        })
        .then(function (data) {
            // If editing, also save iCal import URLs
            if (id) {
                var urls = getIcalImportUrls();
                if (urls.length > 0) {
                    return fetch('/api/rooms/' + id + '/ical-urls', {
                        method: 'PUT',
                        headers: apiHeaders(),
                        body: JSON.stringify({ ical_import_urls: urls }),
                    }).then(function () { reloadPreservingCurrentTab(); });
                }
            }
            reloadPreservingCurrentTab();
        })
        .catch(function (err) { alert('Erreur: ' + err.message); });
}

function deleteRoom(id) {
    if (!confirm('Supprimer cette chambre ?')) return;
    fetch('/api/rooms/' + id, {
        method: 'DELETE',
        headers: apiHeaders(),
    })
        .then(function () { reloadPreservingCurrentTab(); })
        .catch(function (err) { alert('Erreur: ' + err.message); });
}

/* ==================== ICAL MANAGEMENT ==================== */
function addIcalImportUrl(platform, url) {
    addIcalImportUrlRow(platform || '', url || '');
}

function addIcalImportUrlRow(platform, url) {
    var container = document.getElementById('icalImportUrlsList');
    var idx = container.children.length;
    var div = document.createElement('div');
    div.style.cssText = 'display:flex;gap:0.5rem;align-items:center;margin-bottom:0.5rem;';
    div.className = 'ical-import-row';
    div.innerHTML =
        '<select class="form-input ical-platform" style="width:140px;">' +
            '<option value="booking"' + (platform === 'booking' ? ' selected' : '') + '>Booking.com</option>' +
            '<option value="airbnb"' + (platform === 'airbnb' ? ' selected' : '') + '>Airbnb</option>' +
            '<option value="tripadvisor"' + (platform === 'tripadvisor' ? ' selected' : '') + '>TripAdvisor</option>' +
            '<option value="vrbo"' + (platform === 'vrbo' ? ' selected' : '') + '>Vrbo</option>' +
            '<option value="other"' + (platform === 'other' ? ' selected' : '') + '>Autre</option>' +
        '</select>' +
        '<input type="text" class="form-input ical-url" style="flex:1;" placeholder="https://..." value="' + (url || '') + '">' +
        '<button type="button" class="btn btn-sm btn-danger" onclick="removeIcalImportUrl(this)" title="Supprimer"><i class="fas fa-times"></i></button>';
    container.appendChild(div);
}

function removeIcalImportUrl(btn) {
    btn.closest('.ical-import-row').remove();
}

function getIcalImportUrls() {
    var rows = document.querySelectorAll('#icalImportUrlsList .ical-import-row');
    var urls = [];
    rows.forEach(function (row) {
        var platform = row.querySelector('.ical-platform').value;
        var url = row.querySelector('.ical-url').value.trim();
        if (url) {
            urls.push({ platform: platform, url: url });
        }
    });
    return urls;
}

function copyIcalUrl() {
    var input = document.getElementById('roomIcalExportUrl');
    input.select();
    document.execCommand('copy');
    alert('URL iCal copiée !');
}

function regenerateIcalToken() {
    var id = document.getElementById('roomEditId').value;
    if (!id) return;
    if (!confirm('Régénérer le token iCal ? Les anciennes URLs partagées ne fonctionneront plus.')) return;

    fetch('/api/rooms/' + id + '/regenerate-ical-token', {
        method: 'POST',
        headers: apiHeaders(),
    })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (data.success) {
                document.getElementById('roomIcalExportUrl').value = data.export_url;
                // Update roomsData
                var room = roomsData.find(function (r) { return r.id == id; });
                if (room) {
                    room.ical_token = data.ical_token;
                    room.export_url = data.export_url;
                }
                alert('Token régénéré !');
            }
        })
        .catch(function (err) { alert('Erreur: ' + err.message); });
}

function syncRoomIcal() {
    var id = document.getElementById('roomEditId').value;
    if (!id) return;

    // First save the import URLs
    var urls = getIcalImportUrls();
    if (urls.length === 0) {
        alert('Ajoutez au moins une URL iCal à importer.');
        return;
    }

    var statusEl = document.getElementById('roomSyncStatus');
    statusEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Synchronisation en cours...';
    statusEl.style.color = '#888';

    // Save URLs first, then sync
    fetch('/api/rooms/' + id + '/ical-urls', {
        method: 'PUT',
        headers: apiHeaders(),
        body: JSON.stringify({ ical_import_urls: urls }),
    })
        .then(function (res) { return res.json(); })
        .then(function () {
            // Now trigger sync
            return fetch('/api/rooms/' + id + '/sync-ical', {
                method: 'POST',
                headers: apiHeaders(),
            });
        })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (data.success) {
                statusEl.innerHTML = '<i class="fas fa-check-circle" style="color:green;"></i> ' + data.message;
                statusEl.style.color = 'green';
                document.getElementById('roomLastSync').textContent = 'Dernière sync: maintenant';
            } else {
                statusEl.innerHTML = '<i class="fas fa-exclamation-circle" style="color:red;"></i> ' + (data.message || 'Erreur');
                statusEl.style.color = 'red';
            }
        })
        .catch(function (err) {
            statusEl.innerHTML = '<i class="fas fa-exclamation-circle" style="color:red;"></i> Erreur: ' + err.message;
            statusEl.style.color = 'red';
        });
}

function saveIcalUrlsOnRoomSave() {
    var id = document.getElementById('roomEditId').value;
    if (!id) return Promise.resolve();

    var urls = getIcalImportUrls();
    if (urls.length === 0) return Promise.resolve();

    return fetch('/api/rooms/' + id + '/ical-urls', {
        method: 'PUT',
        headers: apiHeaders(),
        body: JSON.stringify({ ical_import_urls: urls }),
    }).then(function (res) { return res.json(); });
}

/* ==================== EVENTS (FORFAITS) ==================== */
var eventUploadedImage = '';

function onForfaitTypeChange() {
    var type = document.getElementById('eventType').value;
    var maxP = document.getElementById('eventMaxParticipants');
    var startDate = document.getElementById('eventStartDate');
    var endDate = document.getElementById('eventEndDate');
    if (type === 'THREE_DAYS') {
        maxP.value = maxP.value || '4';
        maxP.max = '4';
        // Auto-calculate end date (+3 nights = +3 days)
        if (startDate.value && !endDate.value) {
            var d = new Date(startDate.value);
            d.setDate(d.getDate() + 3);
            endDate.value = d.toISOString().split('T')[0];
        }
    } else {
        maxP.value = maxP.value || '2';
        maxP.max = '2';
        // 1 day: end = same as start
        if (startDate.value) {
            endDate.value = startDate.value;
        }
    }
}

function toggleEventForm() {
    var form = document.getElementById('eventForm');
    form.classList.toggle('hidden');
    if (form.classList.contains('hidden')) resetEventForm();
}

// Listen for start date changes to auto-set end date
document.addEventListener('DOMContentLoaded', function() {
    var savedTab = null;
    try {
        savedTab = localStorage.getItem('adminActiveTab');
    } catch (e) {
        savedTab = null;
    }
    if (savedTab) {
        switchTab(savedTab);
    }

    var startDateEl = document.getElementById('eventStartDate');
    if (startDateEl) {
        startDateEl.addEventListener('change', function() {
            onForfaitTypeChange();
        });
    }
});

function resetEventForm() {
    document.getElementById('eventEditId').value = '';
    document.getElementById('eventTitleFr').value = '';
    document.getElementById('eventTitleEn').value = '';
    document.getElementById('eventDescFr').value = '';
    document.getElementById('eventDescEn').value = '';
    document.getElementById('eventStartDate').value = '';
    document.getElementById('eventEndDate').value = '';
    document.getElementById('eventType').value = 'ONE_DAY';
    document.getElementById('eventPrice').value = '';
    document.getElementById('eventMaxParticipants').value = '2';
    document.getElementById('eventProgramFr').value = '';
    document.getElementById('eventProgramEn').value = '';
    document.getElementById('eventImagePreview').innerHTML = '';
    document.getElementById('eventFormTitle').textContent = 'Ajouter un forfait';
    eventUploadedImage = '';
}

function uploadEventImage(input) {
    if (input.files[0]) {
        uploadFile(input.files[0], function (url) {
            eventUploadedImage = url;
            var src = resolveImageSrc(url);
            document.getElementById('eventImagePreview').innerHTML = '<img src="' + src + '" style="width:100px;height:60px;object-fit:cover;border-radius:4px;">';
        });
    }
}

function editEvent(id) {
    var ev = eventsData.find(function (e) { return e.id === id; });
    if (!ev) return;
    document.getElementById('eventEditId').value = ev.id;
    document.getElementById('eventTitleFr').value = ev.title_fr || '';
    document.getElementById('eventTitleEn').value = ev.title_en || '';
    document.getElementById('eventDescFr').value = ev.description_fr || '';
    document.getElementById('eventDescEn').value = ev.description_en || '';
    document.getElementById('eventStartDate').value = ev.start_date || '';
    document.getElementById('eventEndDate').value = ev.end_date || '';
    document.getElementById('eventType').value = ev.type || 'ONE_DAY';
    document.getElementById('eventPrice').value = ev.price || '';
    document.getElementById('eventMaxParticipants').value = ev.max_participants || '';
    var progFr = ev.program_fr;
    if (typeof progFr === 'string') { try { progFr = JSON.parse(progFr); } catch (e) { progFr = []; } }
    var progEn = ev.program_en;
    if (typeof progEn === 'string') { try { progEn = JSON.parse(progEn); } catch (e) { progEn = []; } }
    document.getElementById('eventProgramFr').value = (progFr || []).join('\n');
    document.getElementById('eventProgramEn').value = (progEn || []).join('\n');
    eventUploadedImage = ev.image || '';
    if (eventUploadedImage) {
        var src = resolveImageSrc(eventUploadedImage);
        document.getElementById('eventImagePreview').innerHTML = '<img src="' + src + '" style="width:100px;height:60px;object-fit:cover;border-radius:4px;">';
    }
    document.getElementById('eventFormTitle').textContent = 'Modifier le forfait';
    var eventForm = document.getElementById('eventForm');
    eventForm.classList.remove('hidden');
    eventForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function saveEvent() {
    var id = document.getElementById('eventEditId').value;
    var programFrText = document.getElementById('eventProgramFr').value;
    var programEnText = document.getElementById('eventProgramEn').value;
    var programFr = programFrText.split('\n').map(function (a) { return a.trim(); }).filter(Boolean);
    var programEn = programEnText.split('\n').map(function (a) { return a.trim(); }).filter(Boolean);

    var body = {
        title_fr: document.getElementById('eventTitleFr').value,
        title_en: document.getElementById('eventTitleEn').value,
        description_fr: document.getElementById('eventDescFr').value,
        description_en: document.getElementById('eventDescEn').value,
        start_date: document.getElementById('eventStartDate').value,
        end_date: document.getElementById('eventEndDate').value || null,
        type: document.getElementById('eventType').value,
        price: parseFloat(document.getElementById('eventPrice').value) || null,
        max_participants: parseInt(document.getElementById('eventMaxParticipants').value) || null,
        program_fr: programFr,
        program_en: programEn,
        image: normalizeImagePathForSave(eventUploadedImage),
    };

    var url = id ? '/api/events/' + id : '/api/events';
    var method = id ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        headers: apiHeaders(),
        body: JSON.stringify(body),
    })
        .then(function (res) { return res.json(); })
        .then(function () { reloadPreservingCurrentTab(); })
        .catch(function (err) { alert('Erreur: ' + err.message); });
}

function deleteEvent(id) {
    if (!confirm('Supprimer ce forfait ?')) return;
    fetch('/api/events/' + id, {
        method: 'DELETE',
        headers: apiHeaders(),
    })
        .then(function () { reloadPreservingCurrentTab(); })
        .catch(function (err) { alert('Erreur: ' + err.message); });
}

/* ==================== GALLERY ==================== */
var galleryUploadedImage = '';

function toggleGalleryForm() {
    var form = document.getElementById('galleryForm');
    form.classList.toggle('hidden');
    if (form.classList.contains('hidden')) resetGalleryForm();
}

function resetGalleryForm() {
    document.getElementById('galleryEditId').value = '';
    document.getElementById('galleryTitleFr').value = '';
    document.getElementById('galleryTitleEn').value = '';
    document.getElementById('galleryDescFr').value = '';
    document.getElementById('galleryDescEn').value = '';
    document.getElementById('galleryCategory').value = '';
    document.getElementById('galleryImagePreview').innerHTML = '';
    document.getElementById('galleryFormTitle').textContent = 'Ajouter une image';
    galleryUploadedImage = '';
}

function uploadGalleryImage(input) {
    if (input.files[0]) {
        uploadFile(input.files[0], function (url) {
            galleryUploadedImage = url;
            var src = resolveImageSrc(url);
            document.getElementById('galleryImagePreview').innerHTML = '<img src="' + src + '" style="width:100px;height:60px;object-fit:cover;border-radius:4px;">';
        });
    }
}

function editGalleryItem(id) {
    var img = galleryData.find(function (g) { return g.id === id; });
    if (!img) return;
    document.getElementById('galleryEditId').value = img.id;
    document.getElementById('galleryTitleFr').value = img.title_fr || '';
    document.getElementById('galleryTitleEn').value = img.title_en || '';
    document.getElementById('galleryDescFr').value = img.description_fr || '';
    document.getElementById('galleryDescEn').value = img.description_en || '';
    document.getElementById('galleryCategory').value = img.category || '';
    galleryUploadedImage = img.image || '';
    if (galleryUploadedImage) {
        var src = resolveImageSrc(galleryUploadedImage);
        document.getElementById('galleryImagePreview').innerHTML = '<img src="' + src + '" style="width:100px;height:60px;object-fit:cover;border-radius:4px;">';
    }
    document.getElementById('galleryFormTitle').textContent = 'Modifier l\'image';
    var galleryForm = document.getElementById('galleryForm');
    galleryForm.classList.remove('hidden');
    galleryForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function saveGalleryItem() {
    var id = document.getElementById('galleryEditId').value;
    var body = {
        title_fr: document.getElementById('galleryTitleFr').value,
        title_en: document.getElementById('galleryTitleEn').value,
        description_fr: document.getElementById('galleryDescFr').value,
        description_en: document.getElementById('galleryDescEn').value,
        category: document.getElementById('galleryCategory').value,
        image: normalizeImagePathForSave(galleryUploadedImage),
    };

    var url = id ? '/api/gallery/' + id : '/api/gallery';
    var method = id ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        headers: apiHeaders(),
        body: JSON.stringify(body),
    })
        .then(function (res) { return res.json(); })
        .then(function () { reloadPreservingCurrentTab(); })
        .catch(function (err) { alert('Erreur: ' + err.message); });
}

function deleteGalleryItem(id) {
    if (!confirm('Supprimer cette image ?')) return;
    fetch('/api/gallery/' + id, {
        method: 'DELETE',
        headers: apiHeaders(),
    })
        .then(function () { reloadPreservingCurrentTab(); })
        .catch(function (err) { alert('Erreur: ' + err.message); });
}

/* ==================== BOOKINGS ==================== */
function updateBookingStatus(id, status) {
    fetch('/api/bookings/' + id, {
        method: 'PUT',
        headers: apiHeaders(),
        body: JSON.stringify({ status: status }),
    })
        .then(function () { reloadPreservingCurrentTab(); })
        .catch(function (err) { alert('Erreur: ' + err.message); });
}

function deleteBooking(id) {
    if (!confirm('Supprimer cette réservation ?')) return;
    fetch('/api/bookings/' + id, {
        method: 'DELETE',
        headers: apiHeaders(),
    })
        .then(function () { reloadPreservingCurrentTab(); })
        .catch(function (err) { alert('Erreur: ' + err.message); });
}

/* ==================== CONFIRMATION MESSAGES ==================== */
function toggleConfirmation(id) {
    var row = document.getElementById('confirm-' + id);
    row.classList.toggle('hidden');
}

function generateConfirmation(bookingId, method, lang) {
    // Find booking data from either room or event bookings
    var booking = bookingsData.find(function (b) { return b.id === bookingId; });
    var isEvent = false;
    if (!booking) {
        booking = eventBookingsData.find(function (b) { return b.id === bookingId; });
        isEvent = true;
    }
    if (!booking) return;

    var checkIn = new Date(booking.check_in).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US');
    var checkOut = new Date(booking.check_out).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US');
    var locationName = isEvent ? (booking.event_name || '') : (booking.room_name || '');
    var msg = '';

    if (lang === 'fr') {
        msg = 'Cher(e) ' + booking.name + ',\n\n';
        msg += 'Nous avons le plaisir de confirmer votre reservation a Dar Louka.\n\n';
        msg += 'Details de la reservation :\n';
        msg += (isEvent ? '- Forfait : ' : '- Chambre : ') + locationName + '\n';
        msg += '- Arrivee : ' + checkIn + '\n';
        msg += '- Depart : ' + checkOut + '\n';
        msg += '- Nombre de voyageurs : ' + booking.guests + '\n';
        if (booking.special_requests) {
            msg += '- Demandes speciales : ' + booking.special_requests + '\n';
        }
        msg += '\nNous vous attendons avec impatience !\n\n';
        msg += 'Cordialement,\nL\'equipe Dar Louka\n';
        msg += 'Tel: +212 6 16 46 05 40\n';
        msg += 'Email: info@dar-louka-maroc.com';
    } else {
        msg = 'Dear ' + booking.name + ',\n\n';
        msg += 'We are pleased to confirm your reservation at Dar Louka.\n\n';
        msg += 'Booking Details:\n';
        msg += (isEvent ? '- Package: ' : '- Room: ') + locationName + '\n';
        msg += '- Check-in: ' + checkIn + '\n';
        msg += '- Check-out: ' + checkOut + '\n';
        msg += '- Number of guests: ' + booking.guests + '\n';
        if (booking.special_requests) {
            msg += '- Special requests: ' + booking.special_requests + '\n';
        }
        msg += '\nWe look forward to welcoming you!\n\n';
        msg += 'Best regards,\nThe Dar Louka Team\n';
        msg += 'Tel: +212 6 16 46 05 40\n';
        msg += 'Email: info@dar-louka-maroc.com';
    }

    var msgDiv = document.getElementById('confirmMsg-' + bookingId);
    var textarea = document.getElementById('confirmText-' + bookingId);
    textarea.value = msg;
    msgDiv.classList.remove('hidden');

    if (method === 'email-send') {
        var subject = lang === 'fr'
            ? 'Confirmation de votre reservation - Dar Louka'
            : 'Your reservation confirmation - Dar Louka';
        var recipient = booking.email || '';
        var mailtoUrl = 'mailto:' + encodeURIComponent(recipient)
            + '?subject=' + encodeURIComponent(subject)
            + '&body=' + encodeURIComponent(msg);
        window.location.href = mailtoUrl;
        return;
    }

    if (method === 'whatsapp') {
        var phone = (booking.phone || '').replace(/[^0-9+]/g, '');
        if (phone.startsWith('0')) phone = '+212' + phone.substring(1);
        window.open('https://wa.me/' + phone.replace('+', '') + '?text=' + encodeURIComponent(msg), '_blank');
    }
}

function copyConfirmation(bookingId) {
    var textarea = document.getElementById('confirmText-' + bookingId);
    textarea.select();
    document.execCommand('copy');
    alert('Message copié !');
}

/* ==================== FILE UPLOAD ==================== */
function uploadFile(file, callback, folder) {
    var formData = new FormData();
    formData.append('file', file);
    if (folder) {
        formData.append('folder', folder);
    }

    fetch('/api/upload', {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': getCsrfToken(),
            'Accept': 'application/json',
        },
        body: formData,
    })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (data.url) {
                callback(data.url);
            } else {
                alert('Erreur upload: ' + (data.error || 'Erreur inconnue'));
            }
        })
        .catch(function (err) { alert('Erreur upload: ' + err.message); });
}
