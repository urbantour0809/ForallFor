package com.spring.project.config;

import java.io.IOException;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import com.spring.project.dto.user.UserDTO;
import com.spring.project.service.impl.CustomOAuth2UserServiceImpl;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private CustomOAuth2UserServiceImpl customOAuth2UserService;

    // ����� CORS ���� ���
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/api/**", config);
        return new CorsFilter(source);	
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .csrf().disable() // CSRF ��Ȱ��ȭ
            .authorizeRequests()
                // API ��δ� ���� ���� ���
                .antMatchers("/api/**").permitAll()
                .antMatchers("/", "/index.jsp", "/index.do", "/mainpage.do", 
                           "/*.css", "/*.js", "/*.ico", "/*.png", "/*.jpg", "/*.gif", "/*.svg",
                           "/css/**", "/js/**", "/images/**", "/login**", "/oauth2/**", 
                           "/registerpage.do", "/loginpage.do", "/login.do", 
                           "/sendEmailVerification.do", "/verifyEmailCode.do").permitAll()
                .anyRequest().authenticated()
            .and()
            .cors() // ����� CORS ���� ����
            .and()
            .oauth2Login()
                .loginPage("/loginpage.do")
                .userInfoEndpoint()
                    .userService(customOAuth2UserService)
                .and()
                .successHandler(new OAuth2AuthenticationSuccessHandler())
                .failureHandler((request, response, exception) -> {
                    System.out.println("OAuth2 �α��� ����: " + exception.getMessage());
                    exception.printStackTrace();
                    response.sendRedirect("/FAF/loginpage.do?error=1");
                })
            .and()
            .formLogin()
                .loginPage("/loginpage.do")
                .defaultSuccessUrl("/mainpage.do", true)
                .permitAll()
            .and()
            .logout()
                .logoutSuccessUrl("/mainpage.do")
                .permitAll();
    }
    
    private static class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {
        @Override
        public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                Authentication authentication) throws IOException, ServletException {
            
            if (authentication.getPrincipal() instanceof OAuth2User) {
                OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
                Map<String, Object> attributes = oauth2User.getAttributes();
                
                if (attributes.containsKey("userDTO")) {
                    UserDTO userDTO = (UserDTO) attributes.get("userDTO");
                    HttpSession session = request.getSession();
                    session.setAttribute("userSession", userDTO);
                    System.out.println("OAuth2 �α��� ���� - ���ǿ� ����� ���� ����: " + userDTO.getEmail());
                }
            }
            
            response.sendRedirect("/FAF/mainpage.do");
        }
    }
}
