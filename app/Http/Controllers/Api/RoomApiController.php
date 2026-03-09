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
        ]);

        $data = $request->all();
        $data['ical_token'] = Str::random(32);

        // Handle amenities: accept array or JSON string
        $amenities = $request->input('amenities', []);
        if (is_string($amenities)) {
            $decoded = json_decode($amenities, true);
            $amenities = is_array($decoded) ? $decoded : [];
        }
        $data['amenities'] = json_encode($amenities);

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
        ]);

        $data = $request->all();

        // Handle amenities: accept array or JSON string
        $amenities = $request->input('amenities', []);
        if (is_string($amenities)) {
            $decoded = json_decode($amenities, true);
            $amenities = is_array($decoded) ? $decoded : [];
        }
        $data['amenities'] = json_encode($amenities);

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
            'amenities' => $room->amenities_array,
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
}
