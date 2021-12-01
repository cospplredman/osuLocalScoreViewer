class buffer{
	constructor(a){
		let reader = new FileReader();
		reader.onload = () => {
			this.buffer = new Uint8Array(reader.result);
			(this.onload ?? (()=>{})) ();
		}
		reader.readAsArrayBuffer(a, "UTF-8");
		this.buffer = null;
		this.i = 0;
	}

	parseOsuStr(i=this.i){
		this.i = i;
		let str = "";
		if(this.parseByte() == 11){
			let r = 0,
			    shift = 0,
			    byte;
			do{
  				byte = this.parseByte();
  				r |= (byte & 127) << shift;
  				shift += 7;
			}while((byte & 128) != 0);
			str = new TextDecoder().decode(this.buffer.slice(this.i,this.i+r));
			this.i += r;
		}
		return str;
	}

	skipOsuStr(i=this.i){
		this.i = i;
		if(this.parseByte() == 11){
			let r = 0,
			    shift = 0,
			    byte;
			do{
  				byte = this.parseByte();
  				r |= (byte & 127) << shift;
  				shift += 7;
			}while((byte & 128) != 0);
			this.i+=r;
		}
	}

	parseLong(i=this.i){
		this.i = i;
		let r = cast(this.buffer.slice(this.i,this.i+8),BigUint64Array)[0];
		this.i += 8;
		return r;
	}

	parseInt(i=this.i){
		this.i = i;
		let r = cast(this.buffer.slice(this.i,this.i+4),Uint32Array)[0];
		this.i += 4;
		return r;
	}

	parseShort(i=this.i){
		this.i = i;
		let r = cast(this.buffer.slice(this.i,this.i+2),Uint16Array)[0];
		this.i += 2;
		return r;
	}

	parseByte(i=this.i){
		this.i = i;
		let r = this.buffer[this.i];
		this.i++;
		return r;
	}

	parseBool(i=this.i){
		this.i = i;
		let r = !!this.buffer[this.i];
		this.i++;
		return r;
	}

	parseDouble(i=this.i){
		this.i = i;
		let r = cast(this.buffer.slice(this.i,this.i+8),Float64Array)[0];
		this.i += 8;
		return r;
	}

	parseFloat(i=this.i){
		this.i = i;
		let r = cast(this.buffer.slice(this.i,this.i+4),Float32Array)[0];
		this.i += 4;
		return r;
	}
}