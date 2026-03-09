<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminUser;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function showLogin()
    {
        if (session('admin_authenticated')) {
            return redirect()->route('admin.dashboard');
        }
        return view('admin.login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $admin = AdminUser::where('email', $request->email)->first();

        if (!$admin || $request->password !== $admin->password) {
            return back()->withErrors(['login' => __('messages.admin.signInError')]);
        }

        session([
            'admin_authenticated' => true,
            'admin_id' => $admin->id,
            'admin_email' => $admin->email,
            'admin_name' => $admin->name,
        ]);

        return redirect()->route('admin.dashboard');
    }

    public function logout()
    {
        session()->forget(['admin_authenticated', 'admin_id', 'admin_email', 'admin_name']);
        return redirect()->route('admin.login');
    }
}
