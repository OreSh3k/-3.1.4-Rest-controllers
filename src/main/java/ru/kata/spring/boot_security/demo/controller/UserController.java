package ru.kata.spring.boot_security.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserService userService,
                          PasswordEncoder passwordEncoder) {

        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/")
    public String index() {
        return "forward:/index.html"; // Перенаправляем на HTML-файл
    }

    //Чисто для всех
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        return ResponseEntity.ok(userService.addUser(user));
    }

    // ===== Для аутентифицированных пользователей =====
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<User> getCurrentUser(Principal principal) {
        return ResponseEntity.ok(userService.findByEmail(principal.getName()));
    }

    // Обновление текущего пользователя (безопасная версия)
    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<User> updateSelf(
            Principal principal,
            @RequestBody User inputUser) { // Принимаем Entity, но защищаемся

        // 1. Получаем текущего пользователя из БД
        User currentUser = userService.findByEmail(principal.getName());

        // 2. Обновляем ТОЛЬКО разрешённые поля (игнорируем ID, email, роли)
        currentUser.setName(inputUser.getName());
        currentUser.setLastName(inputUser.getLastName());

        // 3. Если пришёл новый пароль - хешируем
        if (inputUser.getPassword() != null && !inputUser.getPassword().isEmpty()) {
            currentUser.setPassword(passwordEncoder.encode(inputUser.getPassword()));
        }

        // 4. Сохраняем
        return ResponseEntity.ok(userService.addUser(currentUser));
    }

    // ===== Для администраторов =====
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.addUser(user));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable int id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }


}
