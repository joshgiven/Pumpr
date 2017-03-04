package data;

import java.util.List;

import entities.Fillup;

public interface FillupDAO {
	public List<Fillup> index();
	public Fillup show(int id);
	public Fillup create(Fillup quiz);
	public Fillup update(int id, Fillup quiz);
	public boolean destroy(int id);
}
