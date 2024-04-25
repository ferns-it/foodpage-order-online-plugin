export default class Utils {
  static removeSpecialCharacters(str) {
    return str.replace(/<[^>]+>/g, '');
  }

  static removeSpecialCharactersOnly(text) {
    // Split the text into an array of words
    var words = text.split(/\b/);

    // Iterate over each word
    for (var i = 0; i < words.length; i++) {
      // Remove special characters from the word except for the pipe character |
      words[i] = words[i].replace(/[^\w|]/gi, "");
    }

    // Join the words back into a single string
    return words.join("");
  }
}
