window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
	const newColorScheme = e.matches ? "dark" : "light";
	console.log("switched to " + newColorScheme);
});
if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
	console.log("dark mode");
}
if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
	console.log("light mode");
}
