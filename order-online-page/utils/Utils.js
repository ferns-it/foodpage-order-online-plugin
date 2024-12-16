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

  static get15MinuteIntervals(openingTime, closingTime) {
    const intervals = [];
    let start = new Date(`1970-01-01T${openingTime}Z`);
    const end = new Date(`1970-01-01T${closingTime}Z`);

    if (end <= start) {
      end.setDate(end.getDate() + 1);
    }

    while (start <= end) {
      intervals.push(start.toISOString().substr(11, 5));
      start.setMinutes(start.getMinutes() + 15);
    }

    return intervals;
  }

  static convertTiming = (time24) => {
    const [hours, minutes] = time24.split(":");

    let hoursNumber = parseInt(hours, 10);

    const period = hoursNumber >= 12 ? "PM" : "AM";

    hoursNumber = hoursNumber % 12 || 12; // The modulo operation handles 0 and 12 appropriately

    const paddedHours = hoursNumber.toString().padStart(2, "0");
    const paddedMinutes = minutes.padStart(2, "0");

    return `${paddedHours}:${paddedMinutes} ${period}`;
  };
}
