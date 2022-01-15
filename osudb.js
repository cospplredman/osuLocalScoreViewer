class osudb extends buffer{
	constructor(a){
		super(a);
	}

	parseBeatmap(i=this.i){
		this.i = i;
		let beatmap = {};
		if(this.version < 20191106){
			beatmap.entrySize = this.parseInt();
		}
		beatmap.Artist = this.parseOsuStr();
		beatmap.uArtist = this.parseOsuStr();
		beatmap.SongTitle = this.parseOsuStr();
		beatmap.uSongTitle = this.parseOsuStr();
		beatmap.Creator = this.parseOsuStr();
		beatmap.Difficulty = this.parseOsuStr();
		beatmap.AudioFile = this.parseOsuStr();
		beatmap.Hash = this.parseOsuStr();
		beatmap.OsuFile = this.parseOsuStr();
		beatmap.RankedStatus = this.parseByte();
		beatmap.HitCircles = this.parseShort();
		beatmap.Sliders = this.parseShort();
		beatmap.Spinners = this.parseShort();
		beatmap.LastModification = this.parseLong();

		if(this.version < 20140609){
			beatmap.AR = this.parseByte();
			beatmap.CS = this.parseByte();
			beatmap.HP = this.parseByte();
			beatmap.OD = this.parseByte();
		}else{
			beatmap.AR = this.parseFloat();
			beatmap.CS = this.parseFloat();
			beatmap.HP = this.parseFloat();
			beatmap.OD = this.parseFloat();
		}

		beatmap.SliderVelocity = this.parseDouble();

		if(this.version >= 20140609){
			let difficulties = new Array(4);
			for(let i = 0; i != 4; i++){
				let diffs = {};
				let len = this.parseInt();
				for(let i = 0; i != len; i++){
					this.i+=1;
					let mode = this.parseInt();
					this.i+=1;
					let diff = this.parseDouble();
					diffs[mode] = diff;
				}
				difficulties[i] = diffs;
				
			}
			beatmap.SR = difficulties;

		}

		beatmap.DrainTime = this.parseInt();
		beatmap.ToatalTime = this.parseInt();
		beatmap.AudioPreview = this.parseInt();

		beatmap.TimingPoints = new Array(this.parseInt());
		for(let i = 0; i != beatmap.TimingPoints.length; i++){
			let timingpoint = {};
			timingpoint.BPM = this.parseDouble();
			timingpoint.Offset = this.parseDouble();
			timingpoint.Inhereted = this.parseBool();
			beatmap.TimingPoints[i] = timingpoint;
		}

		
		beatmap.ID = this.parseInt();
		beatmap.MapsetID = this.parseInt();
		beatmap.ThreadID = this.parseInt();
		beatmap.StandardGrade = this.parseByte();
		beatmap.TaikoGrade = this.parseByte();
		beatmap.CTBGrade = this.parseByte();
		beatmap.ManiaGrade = this.parseByte();
		beatmap.LocalOffset = this.parseShort();
		beatmap.StackLeniency = this.parseFloat();
		beatmap.Mode = this.parseByte();
		beatmap.Source = this.parseOsuStr();
		beatmap.Tags = this.parseOsuStr();
		beatmap.OnlineOffset = this.parseShort();
		beatmap.TitleFont = this.parseOsuStr();
		beatmap.Unplayed = this.parseBool();
		beatmap.LastPlayed = this.parseLong();
		beatmap.Osz2 = this.parseBool();
		beatmap.FolderName = this.parseOsuStr();
		beatmap.LastChecked = this.parseLong();
		beatmap.IgnoreSound = this.parseBool();
		beatmap.IgnoreSkin = this.parseBool();
		beatmap.DisableStoryBoard = this.parseBool();
		beatmap.DisableVideo = this.parseBool();
		beatmap.VisualOverride = this.parseBool();

		if(this.version < 20140609){
			this.i+=2;
		}

		beatmap.LastModification2 = this.parseInt();
		beatmap.ScrollSpeed = this.parseByte();

		return beatmap;
	}

	parseOsuDBHeader(i=this.i){
		this.i = i;
		let q = {};
		q.version = this.parseInt();
		this.version = q.version;
		q.folders = this.parseInt();
		q.isunlocked = this.parseBool();
		q.dateUnlocked = this.parseLong();
		q.player = this.parseOsuStr();
		q.beatmaps = this.parseInt();
		return q;
	}

	parseOsuDB(i=this.i){
		this.i = i;
		let q = this.parseOsuDBHeader();
		q.beatmaps = new Array(q.beatmaps);
		for(let i = 0; i != q.beatmaps.length; i++){
			q.beatmaps[i] = this.parseBeatmap();
		}
		q.perms = this.parseInt();
		return q;
	}
}
