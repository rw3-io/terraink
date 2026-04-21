/**
 * Shared poster text layout constants and pure helpers used by both the live
 * preview overlay and the export canvas renderer.
 */
export const TEXT_DIMENSION_REFERENCE_PX = 3600;

export const TEXT_CITY_Y_RATIO = 0.845;
export const TEXT_DIVIDER_Y_RATIO = 0.875;
export const TEXT_COUNTRY_Y_RATIO = 0.9;
export const TEXT_COORDS_Y_RATIO = 0.93;

/** City text scales down when labels get long. */
export const CITY_TEXT_SHRINK_THRESHOLD = 10;

export const CITY_FONT_BASE_PX = 250;
export const CITY_FONT_MIN_PX = 110;
export const COUNTRY_FONT_BASE_PX = 92;
export const COORDS_FONT_BASE_PX = 58;

export function isLatinScript(text: string | undefined | null): boolean {
  if (!text) {
    return true;
  }

  let latinCount = 0;
  let alphaCount = 0;

  for (const char of text) {
    if (/[A-Za-z\u00C0-\u024F]/.test(char)) {
      latinCount += 1;
      alphaCount += 1;
    } else if (/\p{L}/u.test(char)) {
      alphaCount += 1;
    }
  }

  if (alphaCount === 0) {
    return true;
  }

  return latinCount / alphaCount > 0.8;
}

export function formatCityLabel(city: string): string {
  return isLatinScript(city) ? city.toUpperCase().split("").join("  ") : city;
}

/**
 * Returns a multiplier (≤1) to shrink the city font for long names.
 * Callers apply it to their own base font size.
 */
export function computeCityFontScale(city: string): number {
  const len = Math.max(city.length, 1);
  if (len <= CITY_TEXT_SHRINK_THRESHOLD) {
    return 1;
  }
  return Math.max(
    CITY_FONT_MIN_PX / CITY_FONT_BASE_PX,
    CITY_TEXT_SHRINK_THRESHOLD / len,
  );
}
