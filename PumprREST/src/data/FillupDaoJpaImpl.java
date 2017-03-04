package data;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import entities.Fillup;

@Transactional
@Repository
public class FillupDaoJpaImpl implements FillupDAO {
	
	@PersistenceContext
	private EntityManager em;

	@Override
	public List<Fillup> index() {
		String query = "SELECT f FROM Fillup f";
		return em.createQuery(query, Fillup.class).getResultList();
	}

	@Override
	public Fillup show(int id) {
		return em.find(Fillup.class, id);
	}

	@Override
	public Fillup create(Fillup fillup) {
		em.persist(fillup);
		em.flush();
		return em.find(Fillup.class, fillup.getId());
	}

	@Override
	public Fillup update(int id, Fillup fillup) {
		Fillup pFillup = em.find(Fillup.class, id);
		
		if(pFillup != null) {
			pFillup.setDate(fillup.getDate());
			pFillup.setGallons(fillup.getGallons());
			pFillup.setDollarsPerGallon(fillup.getDollarsPerGallon());
			pFillup.setOdometer(fillup.getOdometer());
			pFillup.setComments(fillup.getComments());

			em.flush();
		}
		
		return pFillup;
	}

	@Override
	public boolean destroy(int id) {
		boolean retVal = false;
		
		Fillup fillup = em.find(Fillup.class, id);
		if(fillup != null) {
			em.remove(fillup);
			retVal = true;
		}
		
		return retVal;
	}
	
}
