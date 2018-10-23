import * as c from './constants';

/**
 * Processes a packet of data using the VBAN protocol
 * @param  {Buffer} packet The raw packet to be processed
 * @return {Object} The audio data
 */
export const ProcessPacket = (packet) => {
  // outputs
  let format = null;
  let sampleRate = null;
  let buffer = null;

  var header = {
    vban: packet.slice(0, 4).toString('latin1'),
    format_SR: packet.slice(4, 5).readUInt8(0),
    format_nbs: packet.slice(5, 6).readUInt8(0),
    format_nbc: packet.slice(6, 7).readUInt8(0),
    format_bit: packet.slice(7, 8).readUInt8(0),
    streamname: packet.slice(8, 24).toString('latin1'),
    nuFrame: packet.slice(24, 28).readUInt32LE(0),
  };
  // console.log("vban: " + header.vban);
  // console.log("format_SR: 0b" + header.format_SR.toString(2).padStart(8, '0'));
  // console.log("format_nbs: " + header.format_nbs);
  // console.log("format_nbc: 0b" + header.format_nbc.toString(2).padStart(8, '0'));
  // console.log("format_bit: 0b" + header.format_bit.toString(2).padStart(8, '0'));
  // console.log("streamname: " + header.streamname);
  // console.log("nuFrame: " + header.nuFrame);

  const sampleRateIndex = (header.format_SR & 31) & 0xFF;
  const subProtocol = (header.format_SR >> 5) & 0xFF;
  // console.log("Sample rate index: " + sampleRateIndex);
  // console.log("Sub protocol: " + subProtocol);
  if (subProtocol != 0)
  {
    throw new TypeError('unsupported sub protocol');
  }
  sampleRate = c.VBAN_SAMPLE_RATES[sampleRateIndex];
  // console.log("Sample rate: " + sampleRate);
  const sampleCount = header.format_nbs + 1;
  // console.log("Number of samples: " + sampleCount);
  const channels = header.format_nbc + 1;
  // console.log("Number of channels: " + channels);
  const bitResolution = (((header.format_bit << 5) & 0xFF) >> 5) & 0xFF;
  switch (bitResolution)
  {
    case c.VBAN_DATATYPE_BYTE8:
      // console.log("Bit resolution: 8 bit unsigned integer");
      format = {
        channels,
        sampleRate,
        interleaved: true,
        float: false,
        signed: false,
        bitDepth: 8,
        byteOrder: 'LE',
      };
      break;
    case c.VBAN_DATATYPE_INT16:
      // console.log("Bit resolution: 16 bit integer");
      format = {
        channels,
        sampleRate,
        interleaved: true,
        float: false,
        signed: true,
        bitDepth: 16,
        byteOrder: 'LE',
      };
      break;
    case c.VBAN_DATATYPE_INT24:
      // console.log("Bit resolution: 24 bit integer");
      format = {
        channels,
        sampleRate,
        interleaved: true,
        float: false,
        signed: true,
        bitDepth: 24,
        byteOrder: 'LE',
      };
      break;
    case c.VBAN_DATATYPE_INT32:
      // console.log("Bit resolution: 32 bit integer");
      format = {
        channels,
        sampleRate,
        interleaved: true,
        float: false,
        signed: true,
        bitDepth: 32,
        byteOrder: 'LE',
      };
      break;
    case c.VBAN_DATATYPE_FLOAT32:
      // console.log("Bit resolution: 32 bit float");
      format = {
        channels,
        sampleRate,
        interleaved: true,
        float: true,
        signed: true,
        bitDepth: 32,
        byteOrder: 'LE',
      };
      break;
    case c.VBAN_DATATYPE_FLOAT64:
      // console.log("Bit resolution: 64 bit float");
      format = {
        channels,
        sampleRate,
        interleaved: true,
        float: true,
        signed: true,
        bitDepth: 64,
        byteOrder: 'LE',
      };
      break;
    case c.VBAN_DATATYPE_12BITS:
      // console.log("Bit resolution: 12 bit integer");
      format = {
        channels,
        sampleRate,
        interleaved: true,
        float: false,
        signed: true,
        bitDepth: 12,
        byteOrder: 'LE',
      };
      break;
    case c.VBAN_DATATYPE_10BITS:
      // console.log("Bit resolution: 10 bit integer");
      format = {
        channels,
        sampleRate,
        interleaved: true,
        float: false,
        signed: true,
        bitDepth: 10,
        byteOrder: 'LE',
      };
      break;
    default:
      // console.log("Bit resolution: UNKNOWN");
      throw new TypeError('unsupported format');
  }
  const codec = (((header.format_bit >> 4) & 0xFF) << 4) & 0xFF;
  switch (codec)
  {
    case c.VBAN_CODEC_PCM:
      // console.log("Codec: PCM");
      break;
    case c.VBAN_CODEC_VBCA:
      // console.log("Codec: VB-AUDIO AOIP");
      throw new TypeError('unsupported codec');
    case c.VBAN_CODEC_VBCV:
      // console.log("Codec: VB-AUDIO VOIP");
      throw new TypeError('unsupported codec');
    case c.VBAN_CODEC_USER:
      // console.log("Codec: USER");
      throw new TypeError('unsupported codec');
    default:
      // console.log("Codec: UNKNOWN");
      throw new TypeError('unsupported codec');
  }

  buffer = packet.slice(28);
  // console.log("Bytes read: " + packet.length);
  return {
    format,
    sampleRate,
    buffer,
    channels,
    samples: sampleCount,
  };
}
