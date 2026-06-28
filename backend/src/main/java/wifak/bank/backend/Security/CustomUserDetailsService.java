package wifak.bank.backend.Security;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import wifak.bank.backend.Repositories.UserRepository;
import wifak.bank.backend.entities.User;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Fetch permissions through profils
        List<SimpleGrantedAuthority> authorities =
                user.getProfils()
                        .stream()
                        .flatMap(profil ->
                                profil.getPermissions().stream())
                        .map(permission ->
                                new SimpleGrantedAuthority(permission.getName()))
                        .distinct()
                        .toList();

        System.out.println("AUTHORITIES = " + authorities);

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPasswordHash(),
                authorities
        );
    }
}