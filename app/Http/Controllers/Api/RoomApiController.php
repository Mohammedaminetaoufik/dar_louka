<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class RoomApiController extends Controller
{
    public function index()
    {
        $rooms = Room::orderBy('created_at', 'desc')->get()->map(function ($room) {
            return $this->serializeRoom($room, false);
        });

        return response()->json($rooms);
    }

    public function show($id)
    {
        $room = Room::findOrFail($id);
        return response()->json($this->serializeRoom($room, true));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name_en' => 'required|string|max:255',
            'name_fr' => 'required|string|max:255',
            'description_en' => 'required|string',
            'description_fr' => 'required|string',
            'price' => 'required|numeric|min:0',
            'capacity' => 'required|integer|min:1',
            'surface' => 'nullable|integer|min:1',
            'amenities_fr' => 'nullable',
            'amenities_en' => 'nullable',
        ]);

        $data = $request->all();
        $data['ical_token'] = Str::random(32);

        $amenitiesFr = $this->parseArrayInput($request->input('amenities_fr', []));
        $amenitiesEn = $this->parseArrayInput($request->input('amenities_en', []));
        $legacyAmenities = $this->parseArrayInput($request->input('amenities', []));

        if (empty($amenitiesFr) && empty($amenitiesEn) && !empty($legacyAmenities)) {
            $amenitiesFr = $legacyAmenities;
            $amenitiesEn = $legacyAmenities;
        }

        $data['amenities_fr'] = json_encode($amenitiesFr);
        $data['amenities_en'] = json_encode($amenitiesEn);
        $data['amenities'] = json_encode(!empty($amenitiesFr) ? $amenitiesFr : $amenitiesEn);

        // Handle images: accept array or JSON string
        $images = $request->input('images', []);
        if (is_string($images)) {
            $decoded = json_decode($images, true);
            $images = is_array($decoded) ? $decoded : [];
        }
        $data['images'] = json_encode($images);

        $data['ical_import_urls'] = $request->input('ical_import_urls')
            ? json_encode($request->input('ical_import_urls'))
            : null;

        $room = Room::create($data);

        return response()->json($this->serializeRoom($room, true), 201);
    }

    public function update(Request $request, $id)
    {
        $room = Room::findOrFail($id);

        $request->validate([
            'name_en' => 'required|string|max:255',
            'name_fr' => 'required|string|max:255',
            'description_en' => 'required|string',
            'description_fr' => 'required|string',
            'price' => 'required|numeric|min:0',
            'capacity' => 'required|integer|min:1',
            'surface' => 'nullable|integer|min:1',
            'amenities_fr' => 'nullable',
            'amenities_en' => 'nullable',
        ]);

        $data = $request->all();

        $amenitiesFr = $this->parseArrayInput($request->input('amenities_fr', []));
        $amenitiesEn = $this->parseArrayInput($request->input('amenities_en', []));
        $legacyAmenities = $this->parseArrayInput($request->input('amenities', []));

        if (empty($amenitiesFr) && empty($amenitiesEn) && !empty($legacyAmenities)) {
            $amenitiesFr = $legacyAmenities;
            $amenitiesEn = $legacyAmenities;
        }

        $data['amenities_fr'] = json_encode($amenitiesFr);
        $data['amenities_en'] = json_encode($amenitiesEn);
        $data['amenities'] = json_encode(!empty($amenitiesFr) ? $amenitiesFr : $amenitiesEn);

        // Handle images: accept array or JSON string
        $images = $request->input('images', []);
        if (is_string($images)) {
            $decoded = json_decode($images, true);
            $images = is_array($decoded) ? $decoded : [];
        }
        $data['images'] = json_encode($images);

        if ($request->has('ical_import_urls')) {
            $data['ical_import_urls'] = json_encode($request->input('ical_import_urls'));
        }

        $room->update($data);

        return response()->json($this->serializeRoom($room->fresh(), true));
    }

    public function destroy($id)
    {
        $room = Room::findOrFail($id);
        $room->delete();

        return response()->json(['success' => true, 'message' => 'Room deleted successfully']);
    }

    private function serializeRoom($room, $includeToken = false)
    {
        $data = [
            'id' => $room->id,
            'name_en' => $room->name_en,
            'name_fr' => $room->name_fr,
            'nameEn' => $room->name_en,
            'nameFr' => $room->name_fr,
            'description_en' => $room->description_en,
            'description_fr' => $room->description_fr,
            'descriptionEn' => $room->description_en,
            'descriptionFr' => $room->description_fr,
            'price' => (float) $room->price,
            'capacity' => $room->capacity,
            'surface' => $room->surface,
            'amenities' => $room->amenities_array,
            'amenities_fr' => $room->amenities_fr_array,
            'amenities_en' => $room->amenities_en_array,
            'amenitiesFr' => $room->amenities_fr_array,
            'amenitiesEn' => $room->amenities_en_array,
            'image' => $room->image,
            'images' => $room->images_array,
            'created_at' => $room->created_at,
            'updated_at' => $room->updated_at,
        ];

        if ($includeToken) {
            $data['ical_token'] = $room->ical_token;
            $data['icalToken'] = $room->ical_token;
            $data['ical_import_urls'] = $room->ical_import_urls_array;
            $data['icalImportUrls'] = $room->ical_import_urls_array;
        }

        return $data;
    }

    private function parseArrayInput($value): array
    {
        if (is_array($value)) {
            return array_values(array_filter(array_map('trim', $value), fn($item) => $item !== ''));
        }

        if (is_string($value)) {
            $decoded = json_decode($value, true);
            if (is_array($decoded)) {
                return array_values(array_filter(array_map('trim', $decoded), fn($item) => $item !== ''));
            }
        }

        return [];
    }
}
