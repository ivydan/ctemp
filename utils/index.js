function titleCase(str) {
	newStr = str.slice(0, 1).toUpperCase() + str.slice(1);
	return newStr;
}

module.exports = { titleCase }
