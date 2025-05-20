package ru.kata.spring.boot_security.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    public List<User> findByName(String name);

    public User findByEmail(String email);

    Optional<User> findByUsername(String username);

    public User findUserById(int id);

    public List<User> findAll();
}