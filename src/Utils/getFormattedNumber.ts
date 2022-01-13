class NumberParser {
  constructor(locale) {
    const format = new Intl.NumberFormat(locale);
    const parts = format.formatToParts(12345.6);
    const numerals = Array.from({ length: 10 }).map((_, i) => format.format(i));
    const index = new Map(numerals.map((d, i) => [d, i]));
    this._group = new RegExp(
      `[${parts.find((d) => d.type === "group").value}]`,
      "g"
    );
    this._decimal = new RegExp(
      `[${parts.find((d) => d.type === "decimal").value}]`
    );
    this._numeral = new RegExp(`[${numerals.join("")}]`, "g");
    this._index = (d) => index.get(d);
  }
  parse(string) {
    string = string
      .trim()
      .replace(this._group, "")
      .replace(this._decimal, ".")
      .replace(this._numeral, this._index);
    return string ? +string : NaN;
  }
}

const localizedAbbr = {
  en: {
    b: "b",
    m: "m",
    k: "k",
  },
  de: {
    b: "Mrd.",
    m: "Mio.",
    k: "Tsd.",
  },
};

function getLocalizedAbbreviation(langCode: string, abbr: string) {
  return localizedAbbr[langCode]
    ? localizedAbbr[langCode][abbr]
    : localizedAbbr["en"][abbr];
}

export function localizedAbbreviatedNumber(
  langCode: string,
  number: number,
  fractionDigits: number
) {
  if (number >= 1000000000)
    return (
      getFormattedRoundedNumber(langCode, number / 1000000000, fractionDigits) +
      getLocalizedAbbreviation(langCode, "b")
    );
  if (number >= 1000000)
    return (
      getFormattedRoundedNumber(langCode, number / 1000000, fractionDigits) +
      getLocalizedAbbreviation(langCode, "m")
    );
  //if (number >= 1000)
  //  return getFormattedRoundedNumber(langCode, number/1000, fractionDigits) + getLocalizedAbbreviation(langCode, 'k');

  return getFormattedRoundedNumber(langCode, number, fractionDigits);
}

export function getFormattedRoundedNumber(
  langCode: string,
  number: number,
  fractionDigits: number
) {
  if (
    Math.round(number) ===
    Math.round(number * fractionDigits * 10) / (fractionDigits * 10)
  )
    fractionDigits = 0;
  const formatter = new Intl.NumberFormat(langCode, {
    // These options are needed to round to whole numbers if that's what you want.
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
  return formatter.format(number);
}

export function getFormattedNumber(langCode: string, number: number) {
  const formatter = new Intl.NumberFormat(langCode);
  return formatter.format(number);
}

export function parseNumber(langCode: string, number: number) {
  const parser = new NumberParser(langCode);
  return parser.parse(number);
}

export function parseJwt(token: string) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}
