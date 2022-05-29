function doodle() {
	let key = window.location.hash.substring(1);
	if (key.length == 0) {
		key = generateId(8);
		window.location.hash = '#' + key;
	}

	Croquet.Session.join({
		appId: "com.devpika.randomcolor",
		apiKey: "1HttiDaH6vDErBdLoGxxa4NxpEc00d27mDxEdEF9q",
		name: key,
		password: '123',
		model: MyModel,
		view: MyView}
	);

	// dec2hex :: Integer -> String
	// i.e. 0-255 -> '00'-'ff'
	function dec2hex (dec) {
		return dec.toString(16).padStart(2, "0")
	}

	// generateId :: Integer -> String
	function generateId (len) {
		var arr = new Uint8Array((len || 40) / 2)
		window.crypto.getRandomValues(arr)
		return Array.from(arr, dec2hex).join('')
	}

}

function main() {
	window.addEventListener('hashchange', doodle);
	doodle();
}

main();

