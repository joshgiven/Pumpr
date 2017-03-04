package controllers;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import data.FillupDAO;
import entities.Fillup;

@RestController
public class FillupController {
	
	@Autowired
	private FillupDAO fillupDAO;
	
//	private ObjectMapper mapper;
//	
//	//MappingJackson2HttpMessageConverter
//	//Jackson2ObjectMapperFactoryBean
//	
//	public FillupController(Jackson2ObjectMapperFactoryBean omf) {
//		mapper = omf.getObject();
//	}
	
	@GetMapping("fillups")
	public List<Fillup> index() {
		return fillupDAO.index();
	}
	
	@GetMapping("fillups/{id}")
	public Fillup show(@PathVariable int id) {
		Fillup f = fillupDAO.show(id);
		return f;
	}
	
	@PostMapping("fillups")
	public Fillup create(@RequestBody String fillupJSON, HttpServletResponse res) {
		Fillup fillup = null;
		
		ObjectMapper mapper = new ObjectMapper();
		mapper.registerModule(new JavaTimeModule());
		
		try {
			fillup = mapper.readValue(fillupJSON, Fillup.class);
		} 
		catch(IOException e) {
			e.printStackTrace();
			
			res.setStatus(400);
			return null;
		}

		fillup = fillupDAO.create(fillup);

		res.setStatus(201); // 201: Created
		return fillup;
	}
	
	@PutMapping("fillups/{id}")
	public Fillup update( @PathVariable int id, 
	                      @RequestBody String fillupJSON, 
	                      HttpServletResponse res) {
		
		Fillup updateFillup = null;
		
		ObjectMapper mapper = new ObjectMapper();
		mapper.registerModule(new JavaTimeModule());

		try {
			updateFillup = mapper.readValue(fillupJSON, Fillup.class);
		} 
		catch (IOException e) {
			e.printStackTrace();
			
			res.setStatus(400);
			return null;
		}
		
		updateFillup = fillupDAO.update(id, updateFillup);
		
		res.setStatus(202); // 202: Accepted
		return updateFillup;
	}
	
	@DeleteMapping("fillups/{id}")
	public boolean destroy(@PathVariable int id) {
		return fillupDAO.destroy(id);
	}
	
	@GetMapping("ping")
	public String ping() {
		return "pong";
	}
}
