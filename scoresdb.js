class scoresdb extends buffer{
	constructor(a){
		super(a);
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

	parseScoresDBHeader(i=this.i){
		this.i=i;
		let q = {};
		q.version = this.parseInt();
		q.maps = this.parseInt();
		return q;
	}

	parseScoresDB(i=this.i){
		this.i=i;
		let q = this.parseScoresDBHeader();
		q.maps = Array(q.maps);
		for(let i = 0; i != q.maps.length; i++){
			q.maps[i] = this.parseMapScores();
		}
		return q;
	}
}
