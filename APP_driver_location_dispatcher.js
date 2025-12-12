const { Socket } = require("dgram");

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
function sha256(ascii) {
	function rightRotate(value, amount) {
		return (value>>>amount) | (value<<(32 - amount));
	};

	var mathPow = Math.pow;
	var maxWord = mathPow(2, 32);
	var lengthProperty = 'length'
	var i, j; // Used as a counter across the whole file
	var result = ''

	var words = [];
	var asciiBitLength = ascii[lengthProperty]*8;

	//* caching results is optional - remove/add slash from front of this line to toggle
	// Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
	// (we actually calculate the first 64, but extra values are just ignored)
	var hash = sha256.h = sha256.h || [];
	// Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
	var k = sha256.k = sha256.k || [];
	var primeCounter = k[lengthProperty];
	/*/
	var hash = [], k = [];
	var primeCounter = 0;
	//*/

	var isComposite = {};
	for (var candidate = 2; primeCounter < 64; candidate++) {
		if (!isComposite[candidate]) {
			for (i = 0; i < 313; i += candidate) {
				isComposite[i] = candidate;
			}
			hash[primeCounter] = (mathPow(candidate, .5)*maxWord)|0;
			k[primeCounter++] = (mathPow(candidate, 1/3)*maxWord)|0;
		}
	}

	ascii += '\x80' // Append Ƈ' bit (plus zero padding)
	while (ascii[lengthProperty]%64 - 56) ascii += '\x00' // More zero padding
	for (i = 0; i < ascii[lengthProperty]; i++) {
		j = ascii.charCodeAt(i);
		if (j>>8) return; // ASCII check: only accept characters in range 0-255
		words[i>>2] |= j << ((3 - i)%4)*8;
	}
	words[words[lengthProperty]] = ((asciiBitLength/maxWord)|0);
	words[words[lengthProperty]] = (asciiBitLength)

	// process each chunk
	for (j = 0; j < words[lengthProperty];) {
		var w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
		var oldHash = hash;
		// This is now the undefinedworking hash", often labelled as variables a...g
		// (we have to truncate as well, otherwise extra entries at the end accumulate
		hash = hash.slice(0, 8);

		for (i = 0; i < 64; i++) {
			var i2 = i + j;
			// Expand the message into 64 words
			// Used below if
			var w15 = w[i - 15], w2 = w[i - 2];

			// Iterate
			var a = hash[0], e = hash[4];
			var temp1 = hash[7]
				+ (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // S1
				+ ((e&hash[5])^((~e)&hash[6])) // ch
				+ k[i]
				// Expand the message schedule if needed
				+ (w[i] = (i < 16) ? w[i] : (
						w[i - 16]
						+ (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15>>>3)) // s0
						+ w[i - 7]
						+ (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2>>>10)) // s1
					)|0
				);
			// This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
			var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) // S0
				+ ((a&hash[1])^(a&hash[2])^(hash[1]&hash[2])); // maj

			hash = [(temp1 + temp2)|0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
			hash[4] = (hash[4] + temp1)|0;
		}

		for (i = 0; i < 8; i++) {
			hash[i] = (hash[i] + oldHash[i])|0;
		}
	}

	for (i = 0; i < 8; i++) {
		for (j = 3; j + 1; j--) {
			var b = (hash[i]>>(j*8))&255;
			result += ((b < 16) ? 0 : '') + b.toString(16);
		}
	}
	return result;
}

function createToken(variable){
	var token_salt_hash = "1fd773046dedd607397d0509e7";
	var today = new Date();
	// console.log("\x1b[33m%s\x1b[0m",'HERE IS DATE:'+today);
    var date = today.getFullYear()+''
    + ((today.getMonth()+1) < 10 ? '0' : '') + (today.getMonth()+1)+''
	+ (today.getDate() < 10 ? '0' : '') + today.getDate();

	 //console.log("\x1b[33m%s\x1b[0m",date);

    val = variable+''+date+''+token_salt_hash;
    val = sha256(val);

    return val;


}

function UpdateLocations(drivers_array){

	var keys = Object.keys(drivers_array);
	var driver_guids='';
	var lattitudes='';
	var longtitudes='';
	var general_token='';
	var my_data = [];
console.log(drivers_array);
	for(i=0;i<keys.length;i++){
		var current_data = {};

		current_data['driver_guid'] = keys[i];
		current_data['lat'] = drivers_array[keys[i]][0];
		current_data['lng'] = drivers_array[keys[i]][1];
		my_data.push(current_data);

		/*console.log(driver_guids);
		console.log('');
		console.log(lattitudes);
		console.log('');
		console.log(longtitudes);*/

		//general token

		//console.log(general_token);
	}

	var last_data = {};

	last_data['driver_locations'] = JSON.stringify(my_data);

	if(keys.length != 0){


		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {

		if (this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);

			//Başarılı

			var date = new Date();
			if(response['result'] == 1 ){
				console.log("\x1b[32m%s\x1b[0m","**********************************************");
				console.log("\x1b[32m%s\x1b[0m",'LOCATIONS  UPDATED IN NEW SERVER '+date);
				console.log("\x1b[32m%s\x1b[0m","**********************************************");
			}else {
				console.log('LOCATIONS COULD NOT BEEN UPDATED NEW SERVER ');
			}

			//alert(this.responseText);
			//console.log(responseText);

		}else if(this.status >= 500) {
		//Başarısız
			console.log(this.responseText);
		}
		};
		xhttp.onerror = function onError(e) {
		//Başarısız
		console.log(this.responseText);
		};
		xhttp.open("POST", "https://api.atlantisfreshdelivery.com/api/driver-locations/update");
		xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xhttp.setRequestHeader("Authorization", "fddf7815f5f396be940eabb532b3718126a4fda7a41289bbeb1ac9700d10a811");
		xhttp.send(JSON.stringify(last_data));

	} else {
		console.log('NO DRIVERS IN ');
	}


}


var server_driver_location_dispatcher = require('http').createServer();

const io = require('socket.io')(server_driver_location_dispatcher);
server_driver_location_dispatcher.listen(3001);


const drivers = {};
const driver_reverse = {};
const driver_names={};
var driver_locations = {};
var driver_count =0;

setInterval(function(){ UpdateLocations(driver_locations);}, 5000);
io.on('connection',function(socket){

	//console.log(driver_names);

    socket.on('new-driver',function(data){

	    console.log("\x1b[33m%s\x1b[0m",' ');
	    console.log("\x1b[33m%s\x1b[0m","**********************************************");
	    console.log("\x1b[33m%s\x1b[0m","DRIVER LOCATION  SERVER CONNECTION ATTEMPT");

	    console.log("\x1b[33m%s\x1b[0m","**********************************************");
	    console.log("\x1b[33m%s\x1b[0m","DATA HERE:");
	    console.log(data);
	    console.log("\x1b[33m%s\x1b[0m","***********************************************");
		token = createToken(data.DriverGUID);
		//console.log(token);
	//	console.log("\x1b[33m%s\x1b[0m",'token : '+token);

		//console.log("\x1b[33m%s\x1b[0m",'data token : '+JSON.stringify(data));
		//CHECK STORE IS ALREADY LOGGED IN OR NOT
		if(driver_names[data.DriverGUID] != data.DriverName){
			if(token == data.Token){

				drivers[socket.id] = data.DriverGUID;
				driver_count++;
				driver_reverse[data.DriverGUID] = socket.id;
				driver_names[data.DriverGUID] =data.DriverName;

				var current_array = [""+data.Lattitude+"",""+data.Longtitude+"",""+data.DriverName+""];

				driver_locations[data.DriverGUID] = current_array;

				//console.log(driver_locations);


				current_array=[];
				 console.log("\x1b[33m%s\x1b[0m",'DRIVER TOKEN SET SUCCESSFULLLY');

			} else {

				 console.log("\x1b[33m%s\x1b[0m",'NOT A CORRECT TOKEN');
				// console.log("\x1b[33m%s\x1b[0m",token);
				socket.disconnect();


			}
			// console.log("\x1b[33m%s\x1b[0m",stores);
			// console.log("\x1b[33m%s\x1b[0m",driver_reverse);


		} else {
			 console.log("\x1b[33m%s\x1b[0m",'DRIVER ALREADY EXIST. NOT KICKED OUT.');
			socket.disconnect();
		}

    });

	socket.on('UpdateLocations',function(){
		if(driver_count != 0){
			UpdateLocations(driver_locations);

		} else {

			console.log('NO DRIVERS IN');
		}


	});

    socket.on('new-location',function(data){

        if(driver_names[data.DriverGUID] == data.DriverName){

			if(token == data.Token || data.Token == 'fddf7815f5f396be940eabb532b3718126a4fda7a41289bbeb1ac9700d10a811' ){

                driver_locations[data.DriverGUID][0] = data.Lattitude;
                driver_locations[data.DriverGUID][1] = data.Longtitude;
               var name = driver_names[data.DriverGUID];
				//console.log(driver_locations);


				console.log("\x1b[33m%s\x1b[0m",'{'+name+'} SENT NEW LOC. {'+data.Lattitude+','+data.Longtitude+'}');

			} else {

				 console.log("\x1b[33m%s\x1b[0m",'NOT A CORRECT TOKEN');
				// console.log("\x1b[33m%s\x1b[0m",token);
				socket.disconnect();


			}
			// console.log("\x1b[33m%s\x1b[0m",stores);
			// console.log("\x1b[33m%s\x1b[0m",driver_reverse);


		} else {
			console.log("\x1b[33m%s\x1b[0m",'DRIVER NOT EXIST. NOT KICKED OUT.');
			console.log(data);
			socket.disconnect();
		}



    });


    socket.on('disconnect',function(){

        var driver_guid = drivers[socket.id];

        var driver_name = driver_names[driver_guid];

        if(driver_guid != undefined){

		/*
            delete drivers[socket.id];
            delete driver_reverse[driver_guid];
			delete driver_names[driver_guid];
			delete driver_locations[driver_guid];
			 console.log("\x1b[33m%s\x1b[0m",' ');
			 console.log("\x1b[33m%s\x1b[0m",driver_name + ' DISCONNECTED');
			 console.log("\x1b[33m%s\x1b[0m",' ');
			 driver_count--;
		*/

        }else {

            // console.log("\x1b[33m%s\x1b[0m",'not deleting anything');
        }


       // console.log("\x1b[33m%s\x1b[0m",drivers);
       // console.log("\x1b[33m%s\x1b[0m",driver_reverse);
    });

});
