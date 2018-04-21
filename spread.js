module.exports = function(){
	arguments = Object.keys(arguments || []).map(key=>arguments[key]);
	const spreadObjOrArray = typeof arguments[0] === "object" && !Array.isArray(arguments[0]) ? {} :[];
	const spreadObj = arguments.reduce((spreadObjOrArray,arg)=>{
		if(!(Array.isArray(spreadObjOrArray) || (typeof arg === "object" && !Array.isArray(arg)))){
			throw new Error("Can't spread mixed types into an object. Either use all objects or make the first argument not an object");
		}
		if(Array.isArray(spreadObjOrArray)){
			spreadObjOrArray = spreadObjOrArray.concat(Array.isArray(arg) ? arg :[arg]);
		}
		else{
			Object.keys(arg).forEach(objKey=>spreadObjOrArray[objKey]=arg[objKey]);
		}
		return spreadObjOrArray;
	},spreadObjOrArray)
	return arguments.length ? spreadObj: undefined;
}