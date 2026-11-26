<?php

test('public registration screen is disabled and redirects to login', function () {
    $response = $this->get('/register');

    $response->assertRedirect(route('login', absolute: false));
});

test('public registration submission is disabled and redirects to login', function () {
    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertGuest();
    $response->assertRedirect(route('login', absolute: false));
});
