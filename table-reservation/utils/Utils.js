export default class Utils {
  static generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  static generateRandomId() {
    const timestamp = new Date().getTime();
    const smallTimestamp = timestamp % 10000;
    const randomCharCode = Math.floor(Math.random() * 26) + 65;
    const randomChar = String.fromCharCode(randomCharCode);
    const randomId = `${smallTimestamp}${randomChar}`;
    return randomId;
  }
  static formatDate(value) {
    const date = new Date(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    // Create a normal date string
    const normalDate = `${day}-${month}-${year}`;

    return normalDate;
  }

  static convertTiming = (time24) => {
    // Split the time into hours, minutes, and seconds
    const [hours, minutes] = time24.split(':');

    // Convert hours from string to number
    let hoursNumber = parseInt(hours, 10);

    // Determine AM or PM
    const period = hoursNumber >= 12 ? 'PM' : 'AM';

    // Convert hours from 24-hour to 12-hour format
    hoursNumber = hoursNumber % 12 || 12; // The modulo operation handles 0 and 12 appropriately

    const paddedHours = hoursNumber.toString().padStart(2, '0');
    const paddedMinutes = minutes.padStart(2, '0');

    // Return the formatted time without seconds
    return `${paddedHours}:${paddedMinutes} ${period}`;
  };
}
