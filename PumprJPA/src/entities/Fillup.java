package entities;

import java.time.LocalDate;

import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name="fillup")
public class Fillup {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@Convert(converter = LocalDateAttributeConverter.class)
	@JsonFormat(shape=JsonFormat.Shape.STRING, pattern="yyyy-MM-dd")
	private LocalDate date;
	
	private double gallons;
	private double dollarsPerGallon;
	private double odometer;
	private String comments;
	
	public Fillup() {}

	public Fillup(int id, LocalDate date, double gallons, double dollarsPerGallon, double odometer, String comments) {
		super();
		this.id = id;
		this.date = date;
		this.gallons = gallons;
		this.dollarsPerGallon = dollarsPerGallon;
		this.odometer = odometer;
		this.comments = comments;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public double getGallons() {
		return gallons;
	}

	public void setGallons(double gallons) {
		this.gallons = gallons;
	}

	public double getDollarsPerGallon() {
		return dollarsPerGallon;
	}

	public void setDollarsPerGallon(double dollarsPerGallon) {
		this.dollarsPerGallon = dollarsPerGallon;
	}

	public double getOdometer() {
		return odometer;
	}

	public void setOdometer(double odometer) {
		this.odometer = odometer;
	}

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}

	public int getId() {
		return id;
	}

	@Override
	public String toString() {
		return "Fillup [id=" + id + ", date=" + date + "]";
	}
	
}
