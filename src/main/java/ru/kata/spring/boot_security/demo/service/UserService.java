package ru.kata.spring.boot_security.demo.service;

import org.springframework.stereotype.Service;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

@Service
public interface UserService  {

    public List<User> getAllUsers();

    public User getUserById(int id);

    public User addUser(User user);

    public User updateUser(User user);

    public void deleteUser(int id);

    public User findByEmail(String email);
}
