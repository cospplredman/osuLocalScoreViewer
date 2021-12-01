class table{
	constructor(a=[]){
		this.headers = a;
		this.rows = [];
	}

	insertRow(a){
		this.rows.push(a);
	}

	toHTML(){
		let table = document.createElement("table"),
		    thead = table.createTHead().insertRow(),
		    tbody = table.createTBody();

		for(let i = 0; i != this.headers.length; i++)
			thead.insertCell().innerText = this.headers[i];

		for(let i = 0; i != this.rows.length; i++){
			let row = tbody.insertRow();
			for(let j = 0; j != this.headers.length; j++)
				row.insertCell().innerHTML = this.rows[i][this.headers[j]] ?? "";
		}

		return table;
	}
}