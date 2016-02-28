function ITF14(string){
	this.string = string+"";
}

ITF14.prototype.getText = function(){
	return this.string;
};

ITF14.prototype.valid = function(){
	return valid(this.string);
};

ITF14.prototype.encoded = function(){
	//Create the variable that should be returned at the end of the function
	var result = "";

	//If checksum is not already calculated, do it
	if(this.string.length == 13){
		this.string += checksum(this.string);
	}

	//Always add the same start bits
	result += startBin;

	//Calculate all the digit pairs
	for(var i=0;i<14;i+=2){
		result += calculatePair(this.string.substr(i,2));
	}

	//Always add the same end bits
	result += endBin;

	return result;
};

//The structure for the all digits, 1 is wide and 0 is narrow
var digitStructure = {
 "0":"00110"
,"1":"10001"
,"2":"01001"
,"3":"11000"
,"4":"00101"
,"5":"10100"
,"6":"01100"
,"7":"00011"
,"8":"10010"
,"9":"01010"}

//The start bits
var startBin = "1010";
//The end bits
var endBin = "11101";

//Regexp for a valid ITF14 code
var regexp = /^[0-9]{13,14}$/;

//Calculate the data of a number pair
function calculatePair(twoNumbers){
	var result = "";

	var number1Struct = digitStructure[twoNumbers[0]];
	var number2Struct = digitStructure[twoNumbers[1]];

	//Take every second bit and add to the result
	for(var i=0;i<5;i++){
		result += (number1Struct[i]=="1") ? "111" : "1";
		result += (number2Struct[i]=="1") ? "000" : "0";
	}
	return result;
}

//Calulate the checksum digit
function checksum(numberString){
	var result = 0;

	for(var i=0;i<13;i++){result+=parseInt(numberString[i])*(3-(i%2)*2)}

	return 10 - (result % 10);
}

function valid(number){
	if(number.search(regexp)==-1){
		return false;
	}
	//Check checksum if it is already calculated
	else if(number.length==14){
		return number[13] == checksum(number);
	}
	return true;
}

//Required to register for both browser and nodejs
var register = function(core){
	core.register(["ITF14","itf14"],ITF14);
}
try{register(JsBarcode)} catch(e){}
try{module.exports.register = register} catch(e){}