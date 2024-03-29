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

function takeSourceCode() {
	//takeSourceCode take from dark theme (the only one code need to write for samples) to repeat on Source Code column and light theme
	const dests = document.querySelectorAll(".elementSourceCode");

	for (const dest of dests) {
		const row = dest.parentElement;
		origin = row.querySelector(".darkSchemeElements");
		//Copying to light scheme Column
		lightTheme = row.querySelector(".ligthSchemeElements");
		lightTheme.innerHTML = changeForIdLabel(origin.innerHTML);
		lightTheme.innerHTML = lightTheme.innerHTML.replace("<h5>Dark Scheme</h5>", "<h5>Light Scheme</h5>");
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

function preventSubmit(e) {
	const inputs = document.querySelectorAll("form");

	for (const input of inputs) {
		input.addEventListener("submit", (e) => {
			e.preventDefault();
		});
	}
}

function schemeSelection() {
	const darkScheme = window.matchMedia("(prefers-color-scheme: dark)");
	const schemeSwitchArea = document.querySelector("#switch-scheme");
	const schemeSwitchCheckbox = schemeSwitchArea.querySelector(".switch");

	const formSchemeToSet = darkScheme.matches ? "form-light-scheme" : "form-dark-scheme";
	const mainSchemeToSet = darkScheme.matches ? "main-light-scheme" : "main-dark-scheme";

	if (darkScheme.matches) {
		schemeSwitchCheckbox.checked = true;
	} else {
		schemeSwitchCheckbox.checked = false;
	}
	schemeSwitchCheckbox.addEventListener("change", (e) => {
		//html is the root tag to set CSS color variables, in this case using a tag class called "main-ligth/dark-scheme"
		html.classList.toggle(mainSchemeToSet);
		schemeSwitchArea.classList.toggle(formSchemeToSet);
	});

	//if current scheme is dark the scheme to set in html tag is the opposite scheme color.

	window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
		schemeSelection();
	});
}

function writeResponsiveMenu() {
	//const menuElements = document.querySelectorAll("#main-header .menu-element");
	var menuElements = [].map
		.call(document.querySelectorAll("#main-header .menu-element"), (el) => {
			return el.outerHTML;
		})
		.join("");
	let menuResponsiveContainer = document.createElement("ul");
	menuResponsiveContainer.id = "mobile-menu";
	menuResponsiveContainer.innerHTML = menuElements;

	const mainHeader = document.getElementById("main-header");
	mainHeader.append(menuResponsiveContainer);

	return "#main-header #mobile-menu";
}

function goMenu() {
	var menuIcon = document.getElementById("menu-icon");
	//writeResponsiveMenu function returns the TEXT for selector
	menuResponsive = document.querySelector(writeResponsiveMenu());
	mainMenuToggleInfo = {
		name: "main menu",
		openStatus: false,
		menuNode: menuResponsive,
		openClassname: "open",
		closeClassname: "close",
		iconNode: menuIcon,
		iconHoverClassName: "menu-element-hover",
		autoclose: true,
	};
	html.menuToggle.push(mainMenuToggleInfo);
	menuIcon.addEventListener("click", (e) => {
		openMenu(mainMenuToggleInfo.name);
	});
}

function closeMenu() {
	for (let i = 0; i < html.menuToggle.length; i++) {
		if (html.menuToggle[i].openStatus) {
			menuInfo = html.menuToggle[i];
			index = i;
			//set icon to normal state
			menuInfo.iconNode.classList.remove(menuInfo.iconHoverClassName);

			//hide menu
			menuInfo.menuNode.classList.remove(menuInfo.openClassname);
			menuInfo.menuNode.classList.add(menuInfo.closeClassname);
			menuInfo.openStatus = false;
		}
	}
	html.removeEventListener("click", closeMenu, false);
}

function openMenu(menuName) {
	//open any menu requires close other menus
	//closeMenu();
	let menuInfo = "";
	let index = "";
	for (let i = 0; i < html.menuToggle.length; i++) {
		if (html.menuToggle[i].name == menuName) {
			menuInfo = html.menuToggle[i];
			index = i;
			//when click same icon menu, the menu will close
			if (html.menuToggle[i].openStatus) {
				closeMenu();
				continue;
			} else {
				setTimeout(() => {
					menuInfo.openStatus = true;
					//set icon to hover state
					menuInfo.iconNode.classList.add(menuInfo.iconHoverClassName);

					//show menu
					menuInfo.menuNode.classList.remove(menuInfo.closeClassname);
					menuInfo.menuNode.classList.add(menuInfo.openClassname);
					html.menuToggle[index] = menuInfo;
					if (menuInfo.autoclose) {
						setTimeout(() => {
							html.addEventListener("click", closeMenu, false);
						}, 50);
					}
				}, 50);
				break;
			}
		}
	}
}

function goSummary() {
	console.log("Summary needs a lot of information because in wider screens has to show always like an aside area");
	const summaryMenu = document.getElementById("summary-wrapper");
	const expandIcon = summaryMenu.querySelector(".icon-arrow");
	summaryToggleMenu = {
		name: "summary menu",
		openStatus: false,
		menuNode: summaryMenu,
		openClassname: "show",
		closeClassname: "hide",
		iconNode: expandIcon,
		iconHoverClassName: "summary-element-hover",
		autoclose: false,
	};
	expandIcon.addEventListener("click", function (e) {
		openMenu(summaryToggleMenu.name);
		html.addEventListener("click", summaryListener, false);
	});
	html.menuToggle.push(summaryToggleMenu);
}
function summaryListener(evt) {
	const clickedElement = evt.srcElement;
	let summaryMenuData = "";
	let closeSummary = false;
	for (let i = 0; i < html.menuToggle.length; i++) {
		if (html.menuToggle[i].name == "summary menu") {
			summaryMenuData = html.menuToggle[i];
			break;
		}
	}

	//if is in link (anchor) needs to close but the offset parent is summary
	if (clickedElement.nodeName == "A" && clickedElement.closest("section").id == "summary-wrapper") {
		closeSummary = true;
	}

	//if is outside summary needs to close
	if (clickedElement.closest("header") || clickedElement.closest("footer") || clickedElement.closest("section").id != summaryMenuData.menuNode.id) {
		closeSummary = true;
	}

	if (closeSummary) {
		closeMenu();
		html.removeEventListener("click", summaryListener, false);
	}
	return;
}

const html = document.querySelector("html");

document.addEventListener("DOMContentLoaded", (event) => {
	schemeSelection();
	takeSourceCode();
	writeCode();
	copyCode();
	preventSubmit();

	html.menuToggle = [];
	goMenu();
	goSummary();
});
