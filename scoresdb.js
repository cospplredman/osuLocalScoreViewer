class scoresdb extends buffer{
	constructor(a){
		super(a);
		this.maps = null;
		this.hashs = null;
	}

	parseScore(i=this.i){
		this.i=i;
		let score = {};
		score.Mode = this.parseByte();
		score.Version = this.parseInt();
		score.Hash = this.parseOsuStr();
		score.Player = this.parseOsuStr();
		score.ReplayHash = this.parseOsuStr();
		score["300"] = this.parseShort();
		score["100"] = this.parseShort();
		score["50"] = this.parseShort();
		score.Geki = this.parseShort();
		score.Katu = this.parseShort();
		score.Miss = this.parseShort();
		score.Score = this.parseInt();
		score.Combo = this.parseShort();
		score.FullCombo = this.parseBool();
		score.Mods = this.parseInt();
		this.skipOsuStr();
		score.Date = this.parseLong();
		this.i+=4;
		score.ScoreID = this.parseLong();
		if(score.Mods & 8388608)
			score.AddModInfo = this.parseDouble();
		return score;
	}

	parseMapScores(i=this.i){
		this.i=i;
		let map = {};
		map.Hash = this.parseOsuStr();
		map.scores = new Array(this.parseInt());
		for(let i = 0; i != map.scores.length; i++)
			map.scores[i] = this.parseScore();
		return map;
	}

	parseScoresDB(i=this.i){
		this.i=i;
		this.maps = Array(this.parseInt(4));
		this.hashs = Array(this.maps.length);
		i+=4;
		//antifreezeloop((i)=>
		for(let i = 0; i != this.maps.length; i++){
			this.maps[i] = this.i;
			this.hashs[i] = this.parseOsuStr();
			let r = this.parseInt();
			for(let j = 0; j != r; j++){
				this.i+=5;
				this.skipOsuStr();
				this.skipOsuStr();
				this.skipOsuStr();
				this.i+=19;
				let m = this.parseInt();
				this.skipOsuStr();
				this.i+=20;
				if(m & 8388608)
					c+=8;
			}
		}//, this.maps.length);
	}
}