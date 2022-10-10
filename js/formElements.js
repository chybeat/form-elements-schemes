document.addEventListener("DOMContentLoaded", (event) => {
	//submit prevent default
	takeSourceCode();
	writeCode();
	copyCode();
	preventSubmit();
});

function preventSubmit(e) {
	const inputs = document.querySelectorAll("form");

	for (const input of inputs) {
		input.addEventListener("submit", (e) => {
			e.preventDefault();
		});
	}
}

function takeSourceCode() {
	//Source code took from dark theme (the only one code need to write for samples) to reply on Source Code column and light theme
	const dests = document.querySelectorAll(".elementSourceCode");

	for (const dest of dests) {
		const row = dest.parentElement;
		origin = row.querySelector(".darkSchemeElements");
		//Copying to light scheme Column
		lightTheme = row.querySelector(".ligthSchemeElements");
		lightTheme.innerHTML = changeForIdLabel(origin.innerHTML);
		//Copying to source code column
		preTag = document.createElement("pre");
		preTag.classList = "language-html";

		const codeTag = document.createElement("code");
		let code = cleanSourceCode(origin.innerHTML);
		code = document.createTextNode(code);
		codeTag.appendChild(code);

		preTag.append(codeTag);
		dest.append(preTag);
	}
}

function cleanSourceCode(code) {
	let txt = "";
	let start = code.indexOf("<") - 1;
	lines = code.split("\n");
	for (let l of lines) {
		if (l.trim() == "") continue;
		l = l.replace('=""', "");
		txt += l.substring(start) + "\n";
	}
	return txt.trim();
}

function changeForIdLabel(nodes) {
	const regex = /for="(.*?)"/gm;
	nodesList = regex.exec(nodes);
	if (nodesList !== null) {
		const labelFor = nodesList[1];
		nodes = nodes.replace('for="' + labelFor + '"', 'for="' + labelFor + '_light"');
		nodes = nodes.replace('id="' + labelFor + '"', 'id="' + labelFor + '_light"');
	}
	return nodes;
}

function writeCode() {
	const request = document.querySelectorAll("[data-code]");
	for (pre of request) {
		let code = cleanReturn(pre.dataset.code);
		const codeTag = document.createElement("code");
		codeTag.innerHTML = code;
		pre.classList = "language-" + pre.dataset.language;
		pre.append(codeTag);
	}
}

function cleanReturn(code) {
	let regex = /\\n|\\t|</gm;
	code = code.replace(regex, (symbol) => {
		if (symbol == "\\n") {
			return "\u000A";
		} else if (symbol == "\\t") {
			return "\u0009";
		} else {
			return "&lt;";
		}
	});
	return code;
}

function copyCode() {
	const request = document.querySelectorAll("[data-take-code-from]");
	for (pre of request) {
		const source = document.querySelector(pre.dataset.takeCodeFrom);

		codeTag = document.createElement("code");
		let code = cleanSourceCode(source.innerHTML);
		code = document.createTextNode(code);
		codeTag.appendChild(code);
		pre.appendChild(codeTag);
		pre.classList = "language-html";
	}
}
