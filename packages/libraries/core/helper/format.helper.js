
export const handleHtmlEntities = (str) => str ? str.replace('&amp;', '&').replace(/&([a-z]*;)/gi,'').replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec)).replace(/<[^>]*>?/gm, '') : '';
