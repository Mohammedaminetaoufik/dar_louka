<?php

namespace App\Http\Controllers;

use App\Models\Room;

class HomeController extends Controller
{
    public function index()
    {
        $rooms = Room::orderBy('created_at', 'desc')->take(3)->get();
        return view('pages.home', compact('rooms'));
    }
}
