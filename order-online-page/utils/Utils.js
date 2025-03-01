"use client";
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
    let idBase = timestamp.toString();

    if (idBase.length < 12) {
      idBase = idBase.padStart(6, "0");
    } else {
      idBase = idBase.substring(idBase.length - 6);
    }
    return idBase;
  }

  static getCurrentTime() {
    var d = new Date();
    var hours = d.getHours();
    var minutes = d.getMinutes();

    return hours + ":" + minutes;
  }

  static stripHtml(html) {
    const temporalDivElement = document.createElement("div");

    temporalDivElement.innerHTML = html;

    return temporalDivElement.textContent || temporalDivElement.innerText || "";
  }
}
