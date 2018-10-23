export const VBAN_SAMPLE_RATES = [
    6000, 12000, 24000, 48000, 96000, 192000, 384000,
    8000, 16000, 32000, 64000, 128000, 256000, 512000,
    11025, 22050, 44100, 88200, 176400, 352800, 705600
];
export const VBAN_PROTOCOL_AUDIO = 0;
export const VBAN_PROTOCOL_SERIAL = 1;
export const VBAN_PROTOCOL_TXT = 2;
export const VBAN_PROTOCOL_SERVICE = 3;
export const VBAN_PROTOCOL_UNDEFINED_1 = 4;
export const VBAN_PROTOCOL_UNDEFINED_2 = 5;
export const VBAN_PROTOCOL_UNDEFINED_3 = 6;
export const VBAN_PROTOCOL_USER = 7;
export const VBAN_DATATYPE_BYTE8 = 0;
export const VBAN_DATATYPE_INT16 = 1;
export const VBAN_DATATYPE_INT24 = 2;
export const VBAN_DATATYPE_INT32 = 3;
export const VBAN_DATATYPE_FLOAT32 = 4;
export const VBAN_DATATYPE_FLOAT64 = 5;
export const VBAN_DATATYPE_12BITS = 6;
export const VBAN_DATATYPE_10BITS = 7;
export const VBAN_CODEC_PCM = 0;
export const VBAN_CODEC_VBCA = 1;
export const VBAN_CODEC_VBCV = 2;
export const VBAN_CODEC_UNDEFINED_1 = 3;
export const VBAN_CODEC_UNDEFINED_2 = 4;
export const VBAN_CODEC_UNDEFINED_3 = 5;
export const VBAN_CODEC_UNDEFINED_4 = 6;
export const VBAN_CODEC_UNDEFINED_5 = 7;
export const VBAN_CODEC_UNDEFINED_6 = 8;
export const VBAN_CODEC_UNDEFINED_7 = 9;
export const VBAN_CODEC_UNDEFINED_8 = 10;
export const VBAN_CODEC_UNDEFINED_9 = 11;
export const VBAN_CODEC_UNDEFINED_10 = 12;
export const VBAN_CODEC_UNDEFINED_11 = 13;
export const VBAN_CODEC_UNDEFINED_12 = 14;
export const VBAN_CODEC_USER = 15;
export class VBAN_HEADER {
    // vban; // 4 bytes header - 'V' 'B', 'A', 'N'
    // format_SR; // 5 bits for SR index, 3 bits for sub protocol selection
    // format_nbs; // nb sample per frame (1 to 256)
    // format_nbc; // nb channel (1 to 256)
    // format_bit; // 3 bits for data format, 1 bit reserved, 4 bits for codec selector
    // streamname; // 16 char stream name
    // nuFrame; // 32 bit unsigned frame number.

    constructor(header) {
      Object.assign(this, header);
    }
}
