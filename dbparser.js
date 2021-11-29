function cast(src, type) {
    var buffer = new ArrayBuffer(src.byteLength);
    var baseView = new src.constructor(buffer).set(src);
    return new type(buffer);
}

function antifreezeloop(fn,itr,f = ()=>{},s=0,max=100){
	requestAnimationFrame(
		()=>{
			let ts = new Date();
			for(; s < itr && (new Date() - ts < max); s++)
				fn(s);
			if(s < itr)
				antifreezeloop(fn,itr,f,s,max);
			else
				f();
		}
	);
}

class parser{
	constructor(a){
		this.buffer = a;
		this.i = 0;
	}

	getInt(){
		let q = new Uint16Array([this.getShort(),this.getShort()]);
		return cast(q,Uint32Array)[0];
	}

	getShort(){
		let q = new Uint8Array([this.getByte(),this.getByte()]);
		return cast(q,Uint16Array)[0];
	}

	getLong(){
		let q =	new Uint32Array([this.getInt(),this.getInt()])
		return cast(q,BigUint64Array)[0];
	}

	getByte(){
		let q = this.buffer[this.i];
		this.i++;
		return q;
	}

	getBool(){
		return this.getByte() ? true : false;
	}

	getFloat(){
		let q = new Uint32Array([this.getInt()])
		return cast(q,Float32Array)[0];
	}


	getDouble(){
		let q = new BigUint64Array([this.getLong()])
		return cast(q,Float64Array)[0];
	}


	getULEB128(){
		let result = 0;
		let shift = 0;
		let byte;
		do{
  			byte = this.getByte();
  			result |= (byte & 127) << shift;
  			shift += 7;
		}while((byte & 128) != 0);
		return result;
	}

	getString(){
		let q = "";
		if(this.getByte() == 11){
			let f = new Uint8Array(this.getULEB128());
			for(let i = 0; i != f.length; i++)
				f[i] = this.getByte();
			q = new TextDecoder().decode(f);
		}
		return q;
	}

	parseScores(){
		let p = document.getElementById("sdbp");
		let q = {};
		q.version = this.getInt();
		q.maps = Array(this.getInt());
		antifreezeloop((i)=>{
			q.maps[i] = {hash: this.getString()}
			q.maps[i].scores = Array(this.getInt());
			for(let j = 0; j != q.maps[i].scores.length; j++)
				q.maps[i].scores[j] = this.getScore();
			p.innerText = (i+1)+"/"+q.maps.length + " " + ((i+1)/q.maps.length)*100 + "%";
		}, q.maps.length);
		return q;
	}

	getScore(){
		let q = {};
		q.mode = this.getByte();
		q.version = this.getInt();
		q.hash = this.getString();
		q.player = this.getString();
		q.ReplayHash = this.getString();
		q["300"] = this.getShort();
		q["100"] = this.getShort();
		q["50"] = this.getShort();
		q.Gekis = this.getShort();
		q.Katus = this.getShort();
		q.miss = this.getShort();
		q.score = this.getInt();
		q.combo = this.getShort();
		q.fullcombo = this.getBool();
		q.mods = this.getInt();
		q.es = this.getString();
		q.time = this.getLong();
		q.ei = this.getInt();
		q.ScoreId = this.getLong();
		if(q.mods & 8388608)
			q.additionalmodinfo = this.getDouble();
		return q;
	}

	parseOsuDB(){
		let p = document.getElementById("odbp");
		let q = {};
		q.version = this.getInt();
		q.FolderCount = this.getInt();
		q.AccountUnlocked = this.getBool();
		q.Date = this.getLong();
		q.PlayerName = this.getString();
		q.beatmaps = Array(this.getInt());
		antifreezeloop((i)=>{
			q.beatmaps[i] = this.getBeatMap(q.version);
			p.innerText = (i+1)+"/"+q.beatmaps.length + " " + ((i+1)/q.beatmaps.length)*100 + "%";
		},q.beatmaps.length,()=>{q.ri = this.getInt();});
		return q;
	}

	getBeatMap(version = 20140609){
		let q = {};
		q.artist = this.getString();
		q.uartist = this.getString();
		q.title = this.getString();
		q.utitle = this.getString();
		q.creator = this.getString();
		q.difficulty = this.getString();
		q.audiofile = this.getString();
		q.hash = this.getString();
		q.osufile = this.getString();
		q.rankedstatus = this.getByte();
		q.hitcircles = this.getShort();
		q.sliders = this.getShort();
		q.spinners = this.getShort();
		q.lastupdate = this.getLong();
		q.AR = version < 2014609 ? this.getByte() : this.getFloat();
		q.CS = version < 2014609 ? this.getByte() : this.getFloat();
		q.HP = version < 2014609 ? this.getByte() : this.getFloat();
		q.OD = version < 2014609 ? this.getByte() : this.getFloat();
		q.slidervelocity = this.getDouble();
                if (version >= 20140609) {
                  let difficulties = []
                  
                  for(let i = 0; i<4; i++) {
                    let length = this.getInt()
                    let diffs = {}
                    for(let j=0; j<length; j++) {
                        this.getByte()
                        let mode = this.getInt();
                        this.getByte();
                        let diff = this.getDouble();
                        diffs[mode] = diff
                    }
                    difficulties.push(diffs)
                  }
		  q.diffs = difficulties;
		}
		q.draintime = this.getInt();
		q.totaltime = this.getInt();
		q.audiopreview = this.getInt();
		q.timingpoints = Array(this.getInt())
		for(let i = 0; i != q.timingpoints.length; i++){
			q.timingpoints[i] = [this.getDouble(), this.getDouble(), this.getByte()];
		}
		q.beatmapID = this.getInt();
		q.mapsetID = this.getInt();
		q.threadID = this.getInt();
		q.ue = this.getByte();
		q.uf = this.getByte();
		q.ug = this.getByte();
		q.uh = this.getByte();
		q.localoffset = this.getShort();
		q.stackleniency = this.getFloat();
		q.mode = this.getByte();
		q.source = this.getString();
		q.tags = this.getString();
		q.onlineoffset = this.getShort();
		q.font = this.getString();
		q.unplayed = this.getBool();
		q.lastplayed = this.getLong();
		q.osz2 = this.getBool();
		q.foldername = this.getString();
		q.lastchecked = this.getLong();
		q.ignoresounds = this.getBool();
		q.ignoreskin = this.getBool();
		q.disablestoryboard = this.getBool();
		q.disablevideo = this.getBool();
		q.visualoverride = this.getBool();
		if(version < 20140609){
			q.ui = this.getShort();
		}
		q.lastmodified = this.getInt();
		q.maniascrollspeed = this.getByte();
		return q;
	}
}