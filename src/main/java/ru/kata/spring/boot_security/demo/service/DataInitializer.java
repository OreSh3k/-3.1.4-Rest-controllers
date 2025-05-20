package ru.kata.spring.boot_security.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repository.RoleRepository;

import javax.transaction.Transactional;
import java.util.Set;

@Service
public class DataInitializer implements CommandLineRunner {

    private final UserService userService;
    private final RoleRepository roleRepository;

    @Autowired
    public DataInitializer(UserService userService,
                           RoleRepository roleRepository) {
        this.userService = userService;
        this.roleRepository = roleRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Создаем роли, если их нет
        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseGet(() -> {
                    Role role = new Role("ROLE_ADMIN");
                    return roleRepository.save(role);
                });

        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseGet(() -> {
                    Role role = new Role("ROLE_USER");
                    return roleRepository.save(role);
                });

        // Создаем администратора, если его нет
        if (userService.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(("admin"));
            admin.setEmail("admin@mail.com");
            admin.setRoles(Set.of(adminRole, userRole));

            userService.createUser(admin);
            System.out.println("Создан администратор: admin / admin");
        }
    }
}