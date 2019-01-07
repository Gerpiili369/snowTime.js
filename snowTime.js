/**
 * @arg {String} input
 * @returns {Number|String}
 */
class Uptime {
        constructor(start = Date.now(), end = Date.now()) {
        this.start = start;
        this.end = end;
        this.ms = this.end - this.start;
        this.s = Math.floor(this.ms / 1000);
        this.ms -= this.s * 1000;
        this.min = Math.floor(this.s / 60);
        this.s -= this.min * 60;
        this.h = Math.floor(this.min / 60);
        this.min -= this.h * 60;
        this.d = Math.floor(this.h / 24);
        this.h -= this.d * 24;
        this.y = Math.floor(this.d / 365);
        this.d -= this.y * 365;
    }

    toString() {
        return (this.y > 0 ? this.y + ' year(s), ' : '') +
            (this.d > 0 ? this.d + ' day(s), ' : '') +
            (this.h > 0 ? this.h + ' hour(s), ' : '') +
            (this.min > 0 ? this.min + ' minute(s), ' : '') +
            this.s + ' second(s)';
    }

    toMs() {
        return this.end - this.start;
    }

    toSeconds() {
        return Math.round(toMs() / 10000) / 10;
    }

    toMinutes() {
        return Math.round(this.toSeconds() / 600) / 10;
    }

    toHours() {
        return Math.round(this.toMinutes() / 600) / 10;
    }

    toDays() {
        return Math.round(this.toHours() / 240) / 10;
    }

    toWeeks() {
        return Math.round(this.toDays() / 70) / 10;
    }

    toMonths() {
        return Math.round(this.toDays() / 300) / 10;
    }

    toYears() {
        return Math.round(this.toDays() / 3650) / 10;
    }
}

function anyTimeToMs(input) {
    let num = '', unit;

    if (!input) return 'Invalid input!';
    for (const char of input) if (!isNaN(char)) {
        num += char;
    } else {
        unit = char;
        break;
    }

    if (!num) num = 1;
    else num = Number(num);

    if (!unit) return 'Unit missing!';
    switch (unit) {
        case 'y': num *= 365;
        case 'd': num *= 24;
        case 'h': num *= 60;
        case 'min': num *= 60;
        case 's': num *= 1000;
        case 'ms':
            return num;
        default:
            return 'Incorrect unit!'
    }
}

/**
 * @arg {String} input
 * @returns {Snowflake}
*/
function stripNaNs(input = '') {
    let result = '';
    for (const char of input) if (!isNaN(char)) result += char;
    return result;
}

/**
 * @arg {String} dateString
 * @returns {Date}
 */
function datemaker(dateString = '') {
    const current = new Date().toISOString();
    let date;
    if (dateString.indexOf('T') < 0) {
        date = new Date(`${ current.substring(0, current.indexOf('T')) }T${ dateString }`);
        if (date < new Date()) date.setDate(date.getDate() + 1);
    } else date = new Date(dateString);

    return date;
}

/**
 * @arg {String} tz
 * @returns {Boolean}
 */
function isValidTimezone(tz = '') {
    if (tz.toLowerCase() === 'z') return false;
    return new Date(`2017-12-08T12:36:24${ tz }`) !== 'Invalid Date';
}

/**
 * @arg {String} timezone
 * @arg {Date} d
 * @returns {String}
 */
function timeAt(timezone, d = new Date()) {
    const tz = timezone.split(':');
    d.setHours(d.getHours() + Number(tz[0]) + Number(tz[1] / 60));
    return d.toUTCString().replace('GMT', 'UTC') + `${ timezone }`;
}

/**
 * @arg {Object} tz
 * @arg {Array} keys
 * @returns {String}
 */
function findTimeZone(tz, keys) {
    for (const key of keys) if (tz[key] && isValidTimezone(tz[key])) return tz[key];
    return '+00:00';
}

/**
 * @returns {String}
 */
function currentTimezone() {
    const time = new Date().toString();
    timezone = time.substring(time.indexOf('GMT') + 3, time.indexOf('GMT') + 8).split('');
    timezone.splice(3, 0, ':');
    return timezone.join('');
}

module.exports = {
    Uptime,
    anyTimeToMs,
    stripNaNs,
    datemaker,
    isValidTimezone,
    timeAt,
    findTimeZone,
    currentTimezone,
    sfToDate: id => new Date(id / Math.pow(2, 22) + 1420070400000),
    info: 'Time and Snowflake function library.',
}
