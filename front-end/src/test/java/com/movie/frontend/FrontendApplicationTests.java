//package com.movie.frontend;
//
//import com.movie.frontend.Model.MovieDTO;
//import org.junit.jupiter.api.Test;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.http.*;
//import org.springframework.web.client.RestTemplate;
//import org.springframework.web.util.UriComponentsBuilder;
//import java.time.LocalDateTime;
//import java.util.Collections;
//
//@SpringBootTest
//class FrontendApplicationTests {
//
//	@Test
//	void contextLoads() {
//	}
//
//	@Test
//	public void testGetMethodRestTemplate() {
////		HttpHeaders httpHeaders = new HttpHeaders();
////		httpHeaders.set(HttpHeaders.ACCEPT , MediaType.APPLICATION_JSON_VALUE);
////		String jwtToken = "";
////		httpHeaders.set(HttpHeaders.AUTHORIZATION ,"Bearer "+jwtToken);
////		HttpEntity<?> entity = new HttpEntity<>(httpHeaders);
//
//		RestTemplate restTemplate = new RestTemplate();
//		String url = "http://localhost:8080/api/v1/movies";
//		ResponseEntity<MovieDTO[]> response = restTemplate.getForEntity(url,MovieDTO[].class);
//		MovieDTO[] listFilm = response.getBody();
//		for (MovieDTO film : listFilm) {
//			System.out.println(film);
//		}
//		System.out.println(response.getStatusCode());
//	}
//
////	@Test
////	public void testPostMethodRestTemplate() {
////		RestTemplate restTemplate = new RestTemplate();
////		String url = "http://localhost:8080/api/v1/films/";
////		// header
////		HttpHeaders httpHeaders = new HttpHeaders();
////		httpHeaders.set(HttpHeaders.ACCEPT , MediaType.APPLICATION_JSON_VALUE);
////		String jwtToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0aHVhbjIwMjNAZ21haWwuY29tIiwiaWF0IjoxNjgwNzA1NjAzLCJleHAiOjE2ODA3MDY4MTN9.WB8QeAo5VEa2K7dsCkuZQCTbqKBGxy4KDqVM9FIzuTk";
////		httpHeaders.set(HttpHeaders.AUTHORIZATION ,"Bearer "+jwtToken);
////
////		// url Rest
////		Mo filmDto = FilmDto.builder()
////				.id(8L)
////				.title("Hello")
////				.poster("hello.png")
////				.releaseDate(LocalDateTime.now())
////				.duration(120)
////				.build();
////		HttpEntity<?> request =  new HttpEntity<>(filmDto , httpHeaders);
////		ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST,request ,String.class);
////		System.out.println(response.getStatusCode());
////	}
////
////	@Test
////	public void testPutMethodRestTemplate() {
////		RestTemplate restTemplate = new RestTemplate();
////		String url = "http://localhost:8080/api/v1/films/{id}";
////		UriComponentsBuilder builder = UriComponentsBuilder
////				.fromUriString(url)
////				.uriVariables(Collections
////						.singletonMap("id", 1L));
////		// header
////		HttpHeaders httpHeaders = new HttpHeaders();
////		httpHeaders.set(HttpHeaders.ACCEPT , MediaType.APPLICATION_JSON_VALUE);
////		String jwtToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0aHVhbjIwMjRAZ21haWwuY29tIiwiaWF0IjoxNjgwNzA3Mzg2LCJleHAiOjE2ODA3MDg1OTZ9.SwyLiK1wK6cpl0wYOc9WxAQNnDabiMcbTNlfwt4s320";
////		httpHeaders.set(HttpHeaders.AUTHORIZATION ,"Bearer "+jwtToken);
////
////		// url Rest
////		FilmDto filmDto = FilmDto.builder()
////				.title("Hello Update method")
////				.poster("helloAndUpdate.png")
////				.releaseDate(LocalDateTime.now())
////				.duration(120)
////				.build();
////		HttpEntity<?> request =  new HttpEntity<>(filmDto , httpHeaders);
////		ResponseEntity<String> response = restTemplate.exchange(builder.toUriString(), HttpMethod.PUT,request ,String.class);
////		System.out.println(response.getStatusCode());
////	}
////
////	@Test
////	public void testDeleteMethod() {
////		HttpHeaders httpHeaders = new HttpHeaders();
////		httpHeaders.set(HttpHeaders.ACCEPT , MediaType.APPLICATION_JSON_VALUE);
////		String jwtToken = "";
////		httpHeaders.set(HttpHeaders.AUTHORIZATION ,"Bearer "+jwtToken);
////		HttpEntity<?> entity = new HttpEntity<>(httpHeaders);
////
////		RestTemplate restTemplate = new RestTemplate();
////		String url = "http://localhost:8080/api/v1/films/";
////		ResponseEntity<FilmDto[]> response = restTemplate.getForEntity(url,FilmDto[].class);
////		FilmDto[] listFilm = response.getBody();
////		for (FilmDto film : listFilm) {
////			System.out.println(film);
////		}
////		System.out.println(response.getStatusCode());
////	}
//
//}
