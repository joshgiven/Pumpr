package entities;

//import static org.junit.Assert.*;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

public class FillupTest {

	EntityManagerFactory emf;
	EntityManager em;
	
	@Before
	public void setUp() {
		emf = Persistence.createEntityManagerFactory("Pumpr");
		em = emf.createEntityManager();
	}
	
	@After
	public void tearDown() {
		if (em != null)
			em.close();
		if (em != null)
			emf.close();
	}
	
	@Test
	public void test_findFillup() {
		Fillup quiz = em.find(Fillup.class, 1);
		assertNotNull(quiz);
	}
	
	@Test
	public void test_findFillupList() {
		String query = "SELECT f FROM Fillup f";
		
		List<Fillup> quizzes = em.createQuery(query, Fillup.class).getResultList();
		assertNotNull(quizzes);
		assertEquals(4, quizzes.size());
		
		Fillup lastQuiz = quizzes.get(quizzes.size()-1);
		assertNotNull(lastQuiz);
		

	}

}
