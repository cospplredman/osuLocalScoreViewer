class sorttable extends table{
	constructor(a){
		super(a);
		this.sortedrows = [];
	}

	sort(a){
		this.sortedrows = [];
		for(let i = 0; i != this.headers.length; i++){
			let q = new Array(this.rows.length);
			for(let j = 0; j != q.length; j++)
				q[j] = j;

			this.sortedrows.push(q.sort((a,b)=>{
				a = this.rows[a][this.headers[i]];
				b = this.rows[b][this.headers[i]];
				return a<b?-1:1;
			}));
		}
	}

	toHTML(){
		this.sort();
		let table = super.toHTML(),
		    tbody = table.tBodies[0],
		    headers = Array.from(table.tHead.rows[0].cells),
		    headstr = Array.from(this.headers),
		    rows = Array.from(table.tBodies[0].rows),
		    sortedrows = Array.from(this.sortedrows),
		    curr = 0,
		    order = false;

		for(let i = 0; i != headers.length; i++){
			headers[i].onclick = ()=>{
				if(curr != i){
					order = true;
					headers[curr].innerText = headstr[curr];
					curr = i;
				}else{
					order = !order;
				}
				update();
			}
		}

		let update = () => {
			tbody.replaceChildren();
			if(order)
				for(let j = 0; j != sortedrows[curr].length; j++)
					tbody.appendChild(rows[sortedrows[curr][j]]);
			else
				for(let j = sortedrows[curr].length-1; j != -1; j--)
					tbody.appendChild(rows[sortedrows[curr][j]]);

			headers[curr].innerText = headstr[curr];
			headers[curr].innerHTML += ["&#9652;","&#9662;"][+order];
		}
		return table;
	}
}