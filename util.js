function endianness(){
	let uInt32 = new Uint32Array([0x11223344]);
	let uInt8 = new Uint8Array(uInt32.buffer);
 
	if(uInt8[0] === 0x44)
		return true;
	return false;
};

function OsuModsToString(mods){
	let q = "";
	if(mods == 0) q = "NoMod";
	if(mods & 1) q += "NF";
	if(mods & 2) q += "EZ";
	if(mods & 8) q += "HD";
	if(mods & 16) q += "HR";
	if(mods & 16384) q += "PF"
	else if(mods & 32) q += "SD";
	if(mods & 128) q += "RX";
	if(mods & 256) q += "HT";
	if(mods & 512) q += "NC";
	else if(mods & 64) q += "DT";
	if(mods & 1024) q += "FL";
	if(mods & 2048) q += "Auto";
	if(mods & 8192) q += "AP";
	if(mods & 4096) q += "SO";

	if(mods & 67108864) q += "1K";
	if(mods & 268435456) q += "2K";
	if(mods & 134217728) q += "3K";

	if(mods & 2048) q += "KeyMod";
	else{
		if(mods & 32768) q += "4K";
		if(mods & 65536) q += "5K";
		if(mods & 131072) q += "6K";
		if(mods & 262144) q += "7K";
		if(mods & 524288) q += "8K";
	}

	if(mods & 16777216) q += "9K";
	if(mods & 536870912) q += "ScoreV2";
	if(mods & 4) q += "NoVideo";
	if(mods & 2097152) q += "Random";
	if(mods & 1048576) q += "FadeIn";
	if(mods & 4194304) q += "Cinema";
	if(mods & 8388608) q += "TargetPractice";
	if(mods & 33554432) q += "Coop";
	return q;
}

function OsuModsSRAffecting(mods){
	return mods & 521109842;
}

function OsuAcc(s){
	return [
		(300*(s[300]+s.Geki) + 100*(s[100]+s.Katu) + 50*s[50])/(300*(s[300] + s[100] + s[50] + s.Geki + s.Katu + s.Miss)),
		(0.5*(s[100]) + s[300]) / (s.Miss + s[300] + s[100]),
		(s[300] + s[100] + s[50]) / (s[300] + s[100] + s[50] + s.Miss + s.Geki + s.Katu),
		(50*s[50] + 100*s.Katu + 200*s[100] + 300*(s.Geki + s[300])) / (300*(s[50] + s.Katu + s[100] + s.Geki + s[300] + s.Miss))
	][s.Mode] * 100;
}