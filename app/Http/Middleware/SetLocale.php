<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SetLocale
{
    public function handle(Request $request, Closure $next)
    {
        $locale = session('locale', config('app.locale', 'fr'));

        if ($request->has('lang')) {
            $locale = $request->get('lang');
            session(['locale' => $locale]);
        }

        if (in_array($locale, ['en', 'fr'])) {
            app()->setLocale($locale);
        }

        return $next($request);
    }
}
