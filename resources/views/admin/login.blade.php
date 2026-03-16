<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administration - Dar Louka</title>
    <link rel="icon" href="{{ asset('uploads/favicon.svg') }}" type="image/svg+xml">
    <link rel="shortcut icon" href="{{ asset('uploads/favicon.svg') }}" type="image/svg+xml">
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body>
    <div class="login-container">
        <div class="login-card">
            <img src="{{ asset('uploads/dar-louka-logo.png') }}" alt="Dar Louka" style="height:64px;margin:0 auto 1rem;display:block;">
            <h1>Dar Louka</h1>
            <h2>Administration</h2>

            @if(session('error'))
            <div class="alert alert-error">
                <span class="alert-icon"><i class="fas fa-exclamation-circle"></i></span>
                <span>{{ session('error') }}</span>
            </div>
            @endif

            <form action="{{ route('admin.login.submit') }}" method="POST">
                @csrf
                <div class="form-group">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-input" name="email" placeholder="admin@darlouka.com" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Mot de passe</label>
                    <input type="password" class="form-input" name="password" placeholder="••••••••" required>
                </div>
                <button type="submit" class="btn btn-primary w-full">
                    <i class="fas fa-sign-in-alt"></i> Se connecter
                </button>
            </form>
        </div>
    </div>
</body>
</html>
