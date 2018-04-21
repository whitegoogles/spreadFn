const fs = require('fs');
const proxiedExpect = require('chai').expect;
const codeStringify = require('code-stringify');
const spread = require('./spread');
const readmePath = "README.md";
const examplesMarker = "# Examples"
let examples = "";
const expect = (before,...args)=>{
	const removeBrackets = str=>str.slice(1,-1);
	const logSpread = args=> JSON.stringify(spread(...args));
	try{
		if(args[0] === undefined){
			const output = spread();
			examples += `spread() === ${output}\n`;
		}
		else if(typeof args[0] === 'function'){
			let err;
			try{
				args[0]();
			}
			catch(e){
				err = `new Error("${e.message}")`;
			}
			examples += `spread(${removeBrackets(JSON.stringify(before))}) === ${err}\n`;
		}
		else{
			examples += `spread(${removeBrackets(JSON.stringify(before))}) === ${logSpread(args)}\n`;
		}
	}
	catch(e){
		console.log(`Failed to log for ${before}`);
	}
	return proxiedExpect(...args);
}

const es6SpreadInArr = (...args)=>args.reduce((arr,arg)=>Array.isArray(arg) ? [...arr, ...arg] : [...arr,arg],[]);
const es6SpreadInObj = (...args)=>args.reduce((obj,arg)=>{
	return {...obj,...arg};
},{});
const matchesEs6Spread = (es6SpreadFn,...args)=>it("it matches es6 spread",()=>expect(args,spread(...args)).to.eql(es6SpreadFn(...args)));

describe('spread',function(){
	after(()=>{
		const readme = `${fs.readFileSync(readmePath,"utf8").split(examplesMarker).shift()}${examplesMarker}\n\`\`\`javascript\n${examples}\`\`\`\n`;
		fs.writeFileSync(readmePath,readme);
	});
	describe("checking various argument lengths",()=>{
		describe("when nothing",()=>{
			it("should return undefined",()=>{
				expect(undefined,spread()).to.be.undefined
			});
		});
		describe("when it is an empty array",()=>matchesEs6Spread(es6SpreadInArr,[]));
		describe("when it is an empty object",()=>matchesEs6Spread(es6SpreadInObj,{}));
		describe("as sanity checks",()=>{
			it("spreads arrays",()=>{
				const input = [[1,2,3],[4,5,6],7,8,9]; 
				expect(input,spread(...input)).to.eql([1,2,3,4,5,6,7,8,9]);
			});
			it("spreads objects",()=>{
				const input = [{a:"b"},{c:"d"}];
				expect(input,spread(...input)).to.eql({
					a:"b",
					c:"d"
				});
			})
		});
	});
	describe("arrays",()=>{
		describe("when mixed arrays and others",()=>matchesEs6Spread(es6SpreadInArr,1,2,[3,4],{josh:"test"}),[4,5,6]);
		describe("when all arrays",()=>matchesEs6Spread(es6SpreadInArr,[1,2],[3,4],["josh","asdf"]));
		describe("when all primitives",()=>matchesEs6Spread(es6SpreadInArr,1,2,3,"josh",5,9.45));
	});
	describe("objects",()=>{
		describe("when all objects",()=>matchesEs6Spread(es6SpreadInObj,{xd:"xdddd"},{a:1,b:45}));
		describe("when mixed object and others (first arg is object)",()=>{
			it("throws with mixed primitives",()=>{
				const input = [{a:"32"},1,2];
				expect(input,()=>spread(...input)).to.throw;
			});
			it("throws with mixed arrays",()=>{
				const input = [{a:32},[1,2]];
				expect(input,()=>spread(...input)).to.throw;
			});
		});
	});
});