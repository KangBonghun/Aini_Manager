package aini.service;

import java.util.ArrayList;
import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import aini.vo.UserVO;
import aini.web.service.UserService;

public class MemberService implements UserDetailsService
{
    @Autowired
    UserService userService;

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException
    {
        UserVO user = userService.getUserById(userId);

        if (user == null)
        {
            throw new UsernameNotFoundException("No user found with user id : " + userId);
        }

        Collection<SimpleGrantedAuthority> roles = new ArrayList<SimpleGrantedAuthority>();
        roles.add(new SimpleGrantedAuthority("ROLE_USER"));

        UserDetails userDetails = new User(user.getUserId(), user.getPassword(), roles);

        return userDetails;
    }
}
