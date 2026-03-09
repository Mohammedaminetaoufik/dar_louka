<?php

namespace App\Http\Controllers;

use App\Models\Room;

class RoomController extends Controller
{
    public function index()
    {
        $rooms = Room::orderBy('created_at', 'desc')->get();
        return view('pages.rooms', compact('rooms'));
    }
}
