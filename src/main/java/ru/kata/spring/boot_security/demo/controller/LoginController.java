package ru.kata.spring.boot_security.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LoginController {

    @GetMapping("/login")
    public String loginPage() {
        return "login"; // имя шаблона login.html в templates/
    }

    @GetMapping("/")
    public String home() {
        return "index"; // если используешь Thymeleaf: index.html в templates
    }

}