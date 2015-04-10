package com.aok.shipment.model;

import java.util.ArrayList;
import java.util.List;

public class ListExportAShipment {
	private String type;
	private List<ExportAShipment> eah = new ArrayList<ExportAShipment>();
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public List<ExportAShipment> getEah() {
		return eah;
	}
	public void setEah(List<ExportAShipment> eah) {
		this.eah = eah;
	}

	
}
