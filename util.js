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
