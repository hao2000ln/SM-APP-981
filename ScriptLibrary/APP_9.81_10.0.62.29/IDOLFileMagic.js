// http://en.wikipedia.org/wiki/List_of_file_signatures

// service manager "attachment value" is interpreted as "javascript string"
// and javascript string is encoded in unicode, the "char code" size has two bytes
// need to consider big/little endian situation
var IDOLFileMagic = (function() {

  function detectMimeTypeOnBigEndian(bin) {
    if (bin.charCodeAt(0) === 0x8950 && bin.charCodeAt(1) === 0x4e47) {
      return "image/png";
    } else if (bin.charCodeAt(0) === 0xffd8 && (0xff00 & bin.charCodeAt(1)) === 0xff00) {
      // http://www.garykessler.net/library/file_sigs.html
      // 
      // all JPEG files start with the three hex digits 0xFF-D8-FF.
      // The fourth digit is also indicative of JPEG content. Various options include:
      // 0xFF-D8-FF-DB — Samsung D807 JPEG file.
      // 0xFF-D8-FF-E0 — Shown above. Standard JPEG/JFIF file.
      // 0xFF-D8-FF-E1 — Shown above. Standard JPEG/Exif file.
      // 0xFF-D8-FF-E2 — Canon EOS-1D JPEG file.
      // 0xFF-D8-FF-E3 — Samsung D500 JPEG file.
      // 0xFF-D8-FF-E8 — Shown above. Still Picture Interchange File Format (SPIFF).
      return "image/jpeg";
    } else if (bin.charCodeAt(0) === 0x4749 && bin.charCodeAt(1) === 0x4638 && bin.charCodeAt(2) === 0x3761) {
      // GIF87a
      return "image/gif";
    } else if (bin.charCodeAt(0) === 0x4749 && bin.charCodeAt(1) === 0x4638 && bin.charCodeAt(2) === 0x3961) {
      // GIF89a
      return "image/gif";
    } else if (bin.charCodeAt(0) === 0x424d) {
      return "image/bmp";
    } else if (bin.charCodeAt(0) === 0x4d4d && bin.charCodeAt(1) === 0x002a) {
      // big endian format
      return "image/tiff";
    } else if (bin.charCodeAt(0) === 0x4949 && bin.charCodeAt(1) === 0x2a00) {
      // little endian forma
      return "image/tiff";
    } 
    return null;
  }

  function detectMimeTypeOnLittleEndian(bin) {
    if (bin.charCodeAt(0) === 0x5089 && bin.charCodeAt(1) === 0x474e) {
      return "image/png";
    } else if (bin.charCodeAt(0) === 0xd8ff && (0x00ff & bin.charCodeAt(1)) === 0x00ff) {
      return "image/jpeg";
    } else if (bin.charCodeAt(0) === 0x4947 && bin.charCodeAt(1) === 0x3846 && bin.charCodeAt(2) === 0x6137) {
      // GIF87a
      return "image/gif";
    } else if (bin.charCodeAt(0) === 0x4947 && bin.charCodeAt(1) === 0x3846 && bin.charCodeAt(2) === 0x6139) {
      // GIF89a
      return "image/gif";
    } else if (bin.charCodeAt(0) === 0x4d42) {
      return "image/bmp";
    } else if (bin.charCodeAt(0) === 0x4d4d && bin.charCodeAt(1) === 0x2a00) {
      // big endian format
      return "image/tiff";
    } else if (bin.charCodeAt(0) === 0x4949 && bin.charCodeAt(1) === 0x002a) {
      // little endian forma
      return "image/tiff";
    } 
    return null;
  }

  function detectMimeType(bin) {
    var mimeType = detectMimeTypeOnLittleEndian(bin) || detectMimeTypeOnBigEndian(bin);
    return mimeType || "unknown";
  }

  // TODO: there is a typo, should change "mine" => "mime"
  return {
    detectMineType: detectMimeType
  };
}());


function require() {
  return IDOLFileMagic;
}