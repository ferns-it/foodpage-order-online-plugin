export default class Utils {
  static removeSpecialCharacters(str) {
    return str.replace(/<[^>]+>/g, "");
  }

  static removeSpecialCharactersOnly(text) {
    var words = text.split(/\b/);

    for (var i = 0; i < words.length; i++) {
      words[i] = words[i].replace(/[^\w|]/gi, "");
    }

    return words.join("");
  }

  static generateRandomId() {
    const timestamp = new Date().getTime();
    const smallTimestamp = timestamp % 10000;
    const randomCharCode = Math.floor(Math.random() * 26) + 65;
    const randomChar = String.fromCharCode(randomCharCode);
    const randomId = `${smallTimestamp}${randomChar}`;
    return randomId;
  }
}
