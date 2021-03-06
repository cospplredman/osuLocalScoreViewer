class OsuStr{
	constructor(b,s,l){
		this.buf = b;
		this.s = s;
		this.l = l;
	}

	toString(){
		return OsuStr.td.decode(this.buf.subarray(this.s,this.s+this.l));
	}

	valueOf(){
		return this.toString();
	}
}

OsuStr.td = new TextDecoder();

class buffer{

	constructor(a){
		this.ed = endianness();
		let reader = new FileReader();
		reader.onload = () => {
			this.buffer = Object.freeze(reader.result);
			this.buf = new Int8Array(this.buffer);
			this.dv = Object.freeze(new DataView(this.buffer));
			(this.onload ?? (()=>{})) ();
		}
		reader.readAsArrayBuffer(a, "UTF-8");
		this.buffer = null;
		this.dv = null;
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
			str = new OsuStr(this.buf, this.i, r);
			this.i += r;
		}
		return str;
	}

	parseLong(i=this.i){
		this.i = i;
		let r = this.dv.getBigInt64(i, this.ed);
		this.i += 8;
		return r;
	}

	parseInt(i=this.i){
		this.i = i;
		let r = this.dv.getInt32(i, this.ed);
		this.i += 4;
		return r;
	}

	parseShort(i=this.i){
		this.i = i;
		let r = this.dv.getInt16(i, this.ed);
		this.i += 2;
		return r;
	}

	parseByte(i=this.i){
		this.i = i;
		let r = this.dv.getInt8(i, this.ed);
		this.i++;
		return r;
	}

	parseBool(i=this.i){
		this.i = i;
		let r = !!this.dv.getInt8(i, this.ed);
		this.i++;
		return r;
	}

	parseDouble(i=this.i){
		this.i = i;
		let r = this.dv.getFloat64(i, this.ed);
		this.i += 8;
		return r;
	}

	parseFloat(i=this.i){
		this.i = i;
		let r = this.dv.getFloat32(i, this.ed);
		this.i += 4;
		return r;
	}
}