import { MMBasicKeywordList } from "../keywordTypes";

/** Audio output: tones, file playback, MIDI and streaming. */
export const SOUND_KEYWORDS: MMBasicKeywordList = [
  {
    name: "PLAY",
    kind: "command",
    category: "Sound",
    syntax: [
      "PLAY TONE left, right [, dur] [, interrupt]",
      "PLAY WAV file$ [, interrupt]",
      "PLAY MP3 file$ [, interrupt]",
      "PLAY FLAC file$ [, interrupt]",
      "PLAY MODFILE file$ [, interrupt]",
      "PLAY MIDIFILE file$ [, interrupt]",
      "PLAY SOUND soundno, channelno, type [, frequency] [, volume]",
      "PLAY VOLUME left, right",
      "PLAY PAUSE / PLAY RESUME / PLAY STOP",
      "PLAY NEXT / PLAY PREVIOUS",
    ],
    summary:
      "Plays tones, sound effects and audio files. An optional interrupt subroutine runs when playback finishes.",
    notes: [
      "Configure the output first with OPTION AUDIO (PWM, I2S, SPI DAC or VS1053).",
      "Frequencies for PLAY TONE are in Hz, duration in milliseconds.",
    ],
    example: [
      "PLAY TONE 440, 440, 500",
      'PLAY WAV "alert.wav", Finished',
      "PLAY VOLUME 50, 50",
      "",
      "SUB Finished",
      '  PRINT "done"',
      "END SUB",
    ].join("\n"),
    snippet: "PLAY ${1|TONE,WAV,MP3,FLAC,MODFILE,MIDIFILE,SOUND,VOLUME,PAUSE,RESUME,STOP|}",
  },
  {
    name: "PLAY TONE",
    kind: "command",
    category: "Sound",
    syntax: ["PLAY TONE left, right [, dur] [, interrupt]"],
    summary:
      "Plays a sine wave on each channel at the given frequency in Hz, for dur milliseconds.",
    example: ["PLAY TONE 1000, 1000, 250"].join("\n"),
    snippet: "PLAY TONE ${1:440}, ${2:440}, ${3:500}",
  },
  {
    name: "PLAY SOUND",
    kind: "command",
    category: "Sound",
    syntax: ["PLAY SOUND soundno, channelno, type [, frequency] [, volume]"],
    summary:
      "Plays one of the built in waveform generators. Type is S (sine), Q (square), T (triangle), W (sawtooth), N (noise) or O (off).",
    example: ["PLAY SOUND 1, B, S, 500, 20"].join("\n"),
    snippet: "PLAY SOUND ${1:1}, ${2|L,R,B|}, ${3|S,Q,T,W,N,O|}, ${4:500}, ${5:20}",
  },
  {
    name: "PLAY STOP",
    kind: "command",
    category: "Sound",
    syntax: ["PLAY STOP"],
    summary: "Stops all audio output and closes the current file.",
  },
  {
    name: "PLAY MIDI",
    kind: "command",
    category: "Sound",
    syntax: [
      "PLAY MIDI CMD cmd%, data1%, data2%",
      "PLAY MIDI TEST n",
      "PLAY NOTE ON channel%, note%, velocity%",
      "PLAY NOTE OFF channel%, note% [, velocity%]",
    ],
    summary: "Drives the internal MIDI synthesiser note by note.",
    snippet: "PLAY NOTE ON ${1:1}, ${2:60}, ${3:100}",
  },
  {
    name: "PLAY ARRAY",
    kind: "command",
    category: "Sound",
    syntax: [
      "PLAY ARRAY l%(), r%(), freq [, start] [, end] [, terminationinterrupt]",
    ],
    summary: "Plays raw sample data held in integer arrays at a sample rate.",
    snippet: "PLAY ARRAY ${1:l%}(), ${2:r%}(), ${3:22050}",
  },
  {
    name: "PLAY STREAM",
    kind: "command",
    category: "Sound",
    syntax: ["PLAY STREAM buffer%(), readpointer%, writepointer%"],
    summary:
      "Plays audio from a circular buffer that your program keeps filling, for streaming sources.",
    snippet: "PLAY STREAM ${1:buffer%}(), ${2:rp%}, ${3:wp%}",
  },
  {
    name: "SYNC",
    kind: "command",
    category: "Sound",
    syntax: ["SYNC", "SYNC time% [, period]"],
    summary:
      "Waits for the next audio or frame period boundary, giving steady timing for animation and sound.",
    snippet: "SYNC",
  },
];
