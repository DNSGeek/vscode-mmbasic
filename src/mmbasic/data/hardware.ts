import { MMBasicKeywordList } from "../keywordTypes";

/** GPIO, PWM, timers, interrupts, communications buses and device support. */
export const HARDWARE_KEYWORDS: MMBasicKeywordList = [
  {
    name: "SETPIN",
    kind: "command",
    category: "I/O pins",
    syntax: [
      "SETPIN pin, cfg [, option]",
      "SETPIN pin, cfg, target [, option]",
      "SETPIN rx, tx, COM1|COM2",
      "SETPIN rx, tx, clk, SPI|SPI2",
      "SETPIN sda, scl, I2C|I2C2",
      "SETPIN pin, PWM[nx]",
      "SETPIN pin, PIOn",
      "SETPIN pin, OFF",
    ],
    summary: "Configures what a GPIO pin does.",
    notes: [
      "Digital: DIN, DOUT, OC (open collector), OFF.",
      "Analog: AIN.",
      "Counting: CIN (count), FIN (frequency), PIN (period).",
      "Interrupts: INTH, INTL, INTB with a target subroutine.",
      "Peripherals: PWM, COM1/COM2, SPI/SPI2, I2C/I2C2, IR, PIO0-PIO2.",
      "Pins can be named GP0 style or by physical pin number.",
    ],
    example: [
      "SETPIN GP25, DOUT      ' onboard LED",
      "SETPIN GP2, DIN, PULLUP",
      "SETPIN GP26, AIN",
      "SETPIN GP15, INTL, ButtonPressed",
      "SETPIN GP4, GP5, I2C",
    ].join("\n"),
    snippet:
      "SETPIN ${1:GP0}, ${2|DIN,DOUT,AIN,OC,CIN,FIN,PIN,INTH,INTL,INTB,PWM,IR,OFF|}",
  },
  {
    name: "PIN",
    kind: "function",
    category: "I/O pins",
    syntax: [
      "PIN( pin )",
      "PIN( pin ) = value",
      "PIN( BOOTSEL )",
      "PIN( TEMP )",
    ],
    summary:
      "Reads or writes a pin. PIN(TEMP) reads the internal temperature sensor, PIN(BOOTSEL) the BOOTSEL button.",
    example: [
      "SETPIN GP25, DOUT",
      "PIN(GP25) = 1",
      "state = PIN(GP2)",
      'PRINT PIN(TEMP); " degrees C"',
    ].join("\n"),
    snippet: "PIN(${1:GP0})",
  },
  {
    name: "PORT",
    kind: "function",
    category: "I/O pins",
    syntax: [
      "PORT( start, nbr [, start, nbr] ... )",
      "PORT( start, nbr [, start, nbr] ... ) = value",
    ],
    summary:
      "Reads or writes several consecutive pins at once as a single binary value.",
    example: [
      "' write the low 4 bits to GP0..GP3",
      "PORT(GP0, 4) = &B1010",
    ].join("\n"),
    snippet: "PORT(${1:GP0}, ${2:4})",
  },
  {
    name: "PULSE",
    kind: "command",
    category: "I/O pins",
    syntax: ["PULSE pin, width"],
    summary:
      "Generates a single pulse on a digital output. Width is in milliseconds and may be fractional.",
    example: ["PULSE GP10, 0.01   ' 10 microsecond pulse"].join("\n"),
    snippet: "PULSE ${1:GP0}, ${2:width}",
  },
  {
    name: "PULSIN",
    kind: "function",
    category: "I/O pins",
    syntax: [
      "PULSIN( pin, polarity )",
      "PULSIN( pin, polarity, t1 )",
      "PULSIN( pin, polarity, t1, t2 )",
    ],
    summary:
      "Measures the width of an incoming pulse in microseconds. Polarity 1 measures a high pulse, 0 a low one.",
    snippet: "PULSIN(${1:GP0}, ${2:1})",
  },
  {
    name: "ONESHOT",
    kind: "command",
    category: "I/O pins",
    syntax: [
      "ONESHOT triggerPin, sense, outputPin, prePulseDelay, pulseWidth [, quiescentPeriod]",
      "ONESHOT R triggerPin, sense, outputPin, prePulseDelay, pulseWidth [, quiescentPeriod]",
      "ONESHOT DISABLE",
    ],
    summary:
      "Hardware timed one shot: a trigger edge produces a delayed pulse on an output pin without CPU involvement.",
    snippet:
      "ONESHOT ${1:trigger}, ${2:sense}, ${3:output}, ${4:delay}, ${5:width}",
  },
  {
    name: "PWM",
    kind: "command",
    category: "PWM",
    syntax: [
      "PWM channel, frequency, [dutyA] [, dutyB] [, phase] [, defer]",
      "PWM channel, OFF",
      "PWM SYNC s0 [, s1] ...",
    ],
    summary:
      "Starts PWM output on a channel. Duty cycle is a percentage, and each channel drives up to two pins (A and B).",
    notes: [
      "Assign pins to a channel with SETPIN pin, PWMnA or PWMnB first.",
      "Frequency and duty can be changed on the fly by calling PWM again.",
    ],
    example: [
      "SETPIN GP0, PWM0A",
      "PWM 0, 1000, 50      ' 1 kHz at 50 percent",
      "PWM 0, OFF",
    ].join("\n"),
    snippet: "PWM ${1:0}, ${2:1000}, ${3:50}",
  },
  {
    name: "SERVO",
    kind: "command",
    category: "PWM",
    syntax: ["SERVO channel [positionA] [, positionB]"],
    summary:
      "Drives hobby servos on a PWM channel, using positions from -100 to 100.",
    snippet: "SERVO ${1:0}, ${2:0}",
  },
  {
    name: "FREQUENCY",
    kind: "function",
    category: "I/O pins",
    syntax: ["PIN( pin )"],
    summary:
      "A pin configured with SETPIN pin, FIN is read with PIN() and returns the measured frequency in Hz.",
    example: ["SETPIN GP1, FIN", "PAUSE 1000", 'PRINT PIN(GP1); " Hz"'].join(
      "\n",
    ),
  },

  // ----------------------------------------------------------- timing / ints
  {
    name: "TIMER",
    kind: "function",
    category: "Timing",
    syntax: ["TIMER", "TIMER = msec"],
    summary:
      "Free running millisecond counter. Assigning to it resets or presets the count.",
    example: [
      "TIMER = 0",
      "DoSomethingSlow",
      'PRINT "took "; TIMER; " ms"',
    ].join("\n"),
  },
  {
    name: "SETTICK",
    kind: "command",
    category: "Timing",
    syntax: [
      "SETTICK period, target [, nbr]",
      "SETTICK PAUSE, target [, nbr]",
      "SETTICK RESUME, target [, nbr]",
      "SETTICK 0, 0 [, nbr]",
    ],
    summary:
      "Calls a subroutine every 'period' milliseconds. Up to four independent tick timers (nbr 1 to 4).",
    example: [
      "SETTICK 500, Blink, 1",
      "DO : LOOP",
      "",
      "SUB Blink",
      "  PIN(GP25) = NOT PIN(GP25)",
      "END SUB",
    ].join("\n"),
    snippet: "SETTICK ${1:1000}, ${2:MySub}, ${3:1}",
  },
  {
    name: "INTERRUPT",
    kind: "command",
    category: "Timing",
    syntax: ["INTERRUPT [myint]"],
    summary: "Enables or disables the general interrupt handling for a target.",
    snippet: "INTERRUPT ${1:MySub}",
  },
  {
    name: "IRETURN",
    kind: "command",
    category: "Timing",
    syntax: ["IRETURN"],
    summary:
      "Returns from an interrupt when the target was a line number or label.",
    obsolete: true,
    replacedBy: "END SUB",
    notes: ["Prefer a SUB as the interrupt target; END SUB returns from it."],
  },
  {
    name: "WATCHDOG",
    kind: "command",
    category: "Timing",
    syntax: [
      "WATCHDOG timeout",
      "WATCHDOG OFF",
      "WATCHDOG HW timeout",
      "WATCHDOG HW OFF",
    ],
    summary:
      "Restarts the processor if the program does not reset the watchdog within the timeout in milliseconds.",
    example: [
      "WATCHDOG 5000",
      "DO",
      "  WATCHDOG 5000   ' pat the dog each pass",
      "  DoWork",
      "LOOP",
    ].join("\n"),
    snippet: "WATCHDOG ${1:5000}",
  },
  {
    name: "CPU",
    kind: "command",
    category: "System",
    syntax: ["CPU RESTART", "CPU SLEEP n", "CPU SPEED n"],
    summary:
      "Restarts the processor, sleeps for n seconds at low power, or changes the clock speed.",
    snippet: "CPU ${1|RESTART,SLEEP,SPEED|}",
  },

  // --------------------------------------------------------------- ADC
  {
    name: "ADC",
    kind: "command",
    category: "Analog",
    syntax: [
      "ADC OPEN freq, n_channels [, interrupt]",
      "ADC START array1!() [, array2!()] ...",
      "ADC RUN array1%(), array2%()",
      "ADC FREQUENCY freq",
      "ADC CLOSE",
    ],
    summary:
      "High speed block sampling of the analog inputs straight into arrays.",
    notes: [
      "For single readings just use SETPIN pin, AIN and read PIN(pin).",
      "Channels are allocated in order from ADC0, so 2 channels means GP26 and GP27.",
    ],
    example: [
      "DIM samples!(999)",
      "ADC OPEN 10000, 1",
      "ADC START samples!()",
      "ADC CLOSE",
    ].join("\n"),
    snippet: "ADC ${1|OPEN,START,RUN,FREQUENCY,CLOSE|}",
  },

  // --------------------------------------------------------------- I2C
  {
    name: "I2C",
    kind: "command",
    category: "I2C",
    syntax: [
      "I2C OPEN speed, timeout",
      "I2C WRITE addr, option, sendlen, senddata [, senddata] ...",
      "I2C READ addr, option, rcvlen, rcvbuf",
      "I2C CHECK addr",
      "I2C CLOSE",
      "I2C SLAVE ...",
    ],
    summary:
      "Master mode I2C bus. Speed is in kHz, timeout in milliseconds. Option 1 keeps the bus held for a repeated start.",
    notes: [
      "Assign the pins first with SETPIN sda, scl, I2C.",
      "MM.I2C holds the result status of the last transfer.",
    ],
    example: [
      "SETPIN GP4, GP5, I2C",
      "I2C OPEN 400, 1000",
      "I2C WRITE &H48, 1, 1, &H00",
      "I2C READ &H48, 0, 2, buf%()",
      "I2C CLOSE",
    ].join("\n"),
    snippet: "I2C ${1|OPEN,WRITE,READ,CHECK,CLOSE|}",
  },
  {
    name: "I2C2",
    kind: "command",
    category: "I2C",
    syntax: ["I2C2 OPEN|WRITE|READ|CHECK|CLOSE ..."],
    summary: "Second I2C bus. Same syntax as I2C.",
    snippet: "I2C2 ${1|OPEN,WRITE,READ,CHECK,CLOSE|}",
  },
  {
    name: "I2CLCD",
    kind: "command",
    category: "I2C",
    syntax: [
      "I2CLCD INIT address",
      "I2CLCD line, position, string$",
      "I2CLCD CLEAR",
      "I2CLCD BACKLIGHT state",
      "I2CLCD CURSOR state [, BLINK]",
      "I2CLCD CREATECHAR code, d0, d1, d2, d3, d4, d5, d6, d7",
      "I2CLCD CMD byte [, byte] ...",
      "I2CLCD DATA byte [, byte] ...",
      "I2CLCD CLOSE",
    ],
    summary: "Drives a character LCD on an I2C backpack.",
    example: ["I2CLCD INIT &H27", 'I2CLCD 1, 1, "Hello"'].join("\n"),
    snippet: "I2CLCD ${1|INIT,CLEAR,BACKLIGHT,CURSOR,CLOSE|}",
  },

  // --------------------------------------------------------------- SPI
  {
    name: "SPI",
    kind: "command",
    category: "SPI",
    syntax: [
      "SPI OPEN speed, mode, bits",
      "SPI WRITE nbr, data [, data] ...",
      "SPI READ nbr, data [, data] ...",
      "SPI CLOSE",
      "SPI( data )",
    ],
    summary:
      "SPI master. The function form SPI(data) writes and reads one word in a single operation.",
    notes: ["Assign the pins first with SETPIN rx, tx, clk, SPI."],
    example: [
      "SETPIN GP16, GP19, GP18, SPI",
      "SPI OPEN 1000000, 0, 8",
      "PIN(cs) = 0",
      "reply = SPI(&H9F)",
      "PIN(cs) = 1",
      "SPI CLOSE",
    ].join("\n"),
    snippet: "SPI ${1|OPEN,WRITE,READ,CLOSE|}",
  },
  {
    name: "SPI2",
    kind: "command",
    category: "SPI",
    syntax: ["SPI2 OPEN|WRITE|READ|CLOSE ...", "SPI2( data )"],
    summary: "Second SPI bus. Same syntax as SPI.",
    snippet: "SPI2 ${1|OPEN,WRITE,READ,CLOSE|}",
  },

  // ------------------------------------------------------------- 1-wire
  {
    name: "ONEWIRE",
    kind: "command",
    category: "1-Wire",
    syntax: [
      "ONEWIRE RESET pin",
      "ONEWIRE WRITE pin, flag, length, data [, data] ...",
      "ONEWIRE READ pin, flag, length, data [, data] ...",
    ],
    summary:
      "Low level 1-Wire bus access. MM.ONEWIRE reports whether a device responded.",
    snippet: "ONEWIRE ${1|RESET,WRITE,READ|} ${2:GP0}",
  },
  {
    name: "TEMPR",
    kind: "function",
    category: "1-Wire",
    syntax: ["TEMPR( pin [, timeout] )"],
    summary:
      "Reads a DS18B20 temperature sensor in degrees Celsius, blocking while it converts.",
    example: ["PRINT TEMPR(GP6)"].join("\n"),
    snippet: "TEMPR(${1:GP0})",
  },
  {
    name: "TEMPR START",
    kind: "command",
    category: "1-Wire",
    syntax: ["TEMPR START pin [, precision] [, timeout]"],
    summary:
      "Starts a DS18B20 conversion without blocking. Read the result later with TEMPR().",
    example: ["TEMPR START GP6", "PAUSE 800", "PRINT TEMPR(GP6)"].join("\n"),
    snippet: "TEMPR START ${1:GP0}",
  },
  {
    name: "HUMID",
    kind: "command",
    category: "Sensors",
    syntax: ["HUMID pin, tvar, hvar [, DHT11]"],
    summary:
      "Reads a DHT22 (or DHT11) temperature and humidity sensor into two variables.",
    example: ["HUMID GP7, t!, h!", 'PRINT t!; "C "; h!; "%"'].join("\n"),
    snippet: "HUMID ${1:GP0}, ${2:t!}, ${3:h!}",
  },
  {
    name: "DISTANCE",
    kind: "function",
    category: "Sensors",
    syntax: ["DISTANCE( trigger, echo )", "DISTANCE( trig-echo )"],
    summary:
      "Measures distance in centimetres with an HC-SR04 style ultrasonic sensor.",
    example: ["PRINT DISTANCE(GP10, GP11)"].join("\n"),
    snippet: "DISTANCE(${1:trigger}, ${2:echo})",
  },
  {
    name: "IR",
    kind: "command",
    category: "Sensors",
    syntax: ["IR dev, key, int", "IR SEND pin, dev, key", "IR CLOSE"],
    summary:
      "Decodes NEC infrared remote codes into variables via an interrupt, or transmits a code.",
    example: [
      "SETPIN GP8, IR",
      "IR dev, key, GotKey",
      "",
      "SUB GotKey",
      "  PRINT dev, key",
      "END SUB",
    ].join("\n"),
    snippet: "IR ${1:dev}, ${2:key}, ${3:MySub}",
  },
  {
    name: "KEYPAD",
    kind: "command",
    category: "Sensors",
    syntax: [
      "KEYPAD var, int, r1, r2, r3, r4, c1, c2, c3 [, c4]",
      "KEYPAD keymap!(), var!, int, startcolpin, nocols, startrowpin, norows",
      "KEYPAD CLOSE",
    ],
    summary:
      "Scans a matrix keypad in the background and calls an interrupt when a key is pressed.",
    snippet:
      "KEYPAD ${1:key}, ${2:MySub}, ${3:r1}, ${4:r2}, ${5:r3}, ${6:r4}, ${7:c1}, ${8:c2}, ${9:c3}",
  },
  {
    name: "RTC",
    kind: "command",
    category: "Sensors",
    syntax: [
      "RTC GETTIME",
      "RTC SETTIME year, month, day, hour, minute, second",
      "RTC SETREG reg, value",
      "RTC GETREG reg, var",
    ],
    summary:
      "Reads or sets an external I2C real time clock and copies the value into TIME$ and DATE$.",
    example: ["RTC GETTIME", 'PRINT DATE$; " "; TIME$'].join("\n"),
    snippet: "RTC ${1|GETTIME,SETTIME|}",
  },
  {
    name: "WS2812",
    kind: "command",
    category: "Sensors",
    syntax: ["WS2812 type, pin, nbr, value%[()]"],
    summary:
      "Drives a chain of WS2812 addressable LEDs. Type is O, B, G or W depending on the colour order.",
    example: [
      "DIM colours%(2) = (&HFF0000, &H00FF00, &H0000FF)",
      "WS2812 O, GP9, 3, colours%()",
    ].join("\n"),
    snippet: "WS2812 ${1|O,B,G,W|}, ${2:GP0}, ${3:nbr}, ${4:colours%}()",
  },
  {
    name: "LCD",
    kind: "command",
    category: "Sensors",
    syntax: [
      "LCD INIT d4, d5, d6, d7, rs, en",
      "LCD line, pos, text$",
      "LCD CLEAR",
      "LCD CMD d1 [, d2] ...",
      "LCD DATA d1 [, d2] ...",
      "LCD CLOSE",
    ],
    summary: "Drives a parallel connected HD44780 character LCD.",
    snippet: "LCD ${1|INIT,CLEAR,CMD,DATA,CLOSE|}",
  },
  {
    name: "BITSTREAM",
    kind: "command",
    category: "I/O pins",
    syntax: [
      "BITSTREAM pin1, count1, array1() [, mode1] [, pin2, count2, array2()] [, mode2] [, logic]",
    ],
    summary:
      "Emits a precisely timed sequence of high and low periods on a pin, for custom one wire protocols.",
    snippet: "BITSTREAM ${1:GP0}, ${2:count}, ${3:timings%}()",
  },
  {
    name: "DEVICE",
    kind: "command",
    category: "Sensors",
    syntax: [
      "DEVICE SERIALTX pinno, baudrate, ostring$",
      "DEVICE SERIALRX pinno, baudrate, istring$, timeout_ms, status% [, nbr] [, terminators$]",
    ],
    summary: "Software (bit banged) serial transmit and receive on any pin.",
    snippet: "DEVICE ${1|SERIALTX,SERIALRX|} ${2:GP0}, ${3:9600}, ${4:data$}",
  },
  {
    name: "GAMEPAD",
    kind: "command",
    category: "Input devices",
    syntax: [
      "GAMEPAD INTERRUPT ENABLE channel, int [, mask]",
      "GAMEPAD INTERRUPT DISABLE channel",
      "GAMEPAD COLOUR channel, colour",
      "GAMEPAD HAPTIC channel, left, right",
      "GAMEPAD MONITOR",
    ],
    summary: "USB gamepad support, read back with DEVICE(GAMEPAD ...).",
    snippet: "GAMEPAD ${1|INTERRUPT,COLOUR,HAPTIC,MONITOR|}",
  },
  {
    name: "MOUSE",
    kind: "command",
    category: "Input devices",
    syntax: [
      "MOUSE OPEN channel, CLKpin, DATApin",
      "MOUSE CLOSE channel",
      "MOUSE SET channel, x, y [, wheel]",
      "MOUSE INTERRUPT ENABLE channel, int",
      "MOUSE INTERRUPT DISABLE channel",
    ],
    summary: "PS2 or USB mouse support, read back with DEVICE(MOUSE ...).",
    snippet: "MOUSE ${1|OPEN,CLOSE,SET,INTERRUPT|}",
  },
  {
    name: "KEYBOARD",
    kind: "command",
    category: "Input devices",
    syntax: ["KEYBOARD ON", "KEYBOARD OFF"],
    summary: "Enables or disables the attached keyboard as a console input.",
    snippet: "KEYBOARD ${1|ON,OFF|}",
  },
  {
    name: "DEVICE(",
    kind: "function",
    category: "Input devices",
    syntax: [
      "DEVICE( GAMEPAD channel, funct )",
      "DEVICE( MOUSE channel, funct )",
      "DEVICE( WII [CLASSIC] funct )",
      "DEVICE( NUNCHUCK funct )",
    ],
    summary: "Reads the current state of a gamepad, mouse or Wii controller.",
    example: ["x = DEVICE(MOUSE 1, X)"].join("\n"),
    snippet: "DEVICE(${1|GAMEPAD,MOUSE,WII,NUNCHUCK|} ${2:1}, ${3:X})",
  },
  {
    name: "WII",
    kind: "command",
    category: "Input devices",
    syntax: [
      "WII [CLASSIC] OPEN [, interrupt]",
      "WII [CLASSIC] CLOSE",
      "WII NUNCHUCK OPEN [, interrupt]",
      "WII NUNCHUCK CLOSE",
    ],
    summary: "Reads a Wii Nunchuck or Classic controller over I2C.",
    snippet: "WII ${1|NUNCHUCK,CLASSIC|} ${2|OPEN,CLOSE|}",
  },
  {
    name: "CAMERA",
    kind: "command",
    category: "Sensors",
    syntax: [
      "CAMERA OPEN ...",
      "CAMERA CAPTURE [scale [, x, y]]",
      "CAMERA CAPTURE JPEG fname$ [, resolution [, quality]]",
      "CAMERA CHANGE image%(), change! [, scale [, x, y]]",
      "CAMERA REGISTER reg%, data%",
      "CAMERA TEST tnum",
      "CAMERA CLOSE",
    ],
    summary: "Supports OV7670, OV2640 and OV5640 camera modules.",
    snippet: "CAMERA ${1|OPEN,CAPTURE,CHANGE,CLOSE|}",
  },
  {
    name: "STEPPER",
    kind: "command",
    category: "Motors",
    syntax: ["STEPPER ..."],
    summary: "Background stepper motor pulse generation.",
  },
  {
    name: "TMC22xx",
    kind: "command",
    category: "Motors",
    syntax: [
      "TMC22xx pin, chip, address, current, holdpct, microsteps [, rsense] [, stealthchop]",
      "TMC22xx SGTHRS address, value",
      "TMC22xx TCOOLTHRS address, value",
      "TMC22xx CLOSE",
    ],
    summary: "Configures TMC22xx series stepper drivers over their UART.",
    snippet:
      "TMC22xx ${1:pin}, ${2:chip}, ${3:address}, ${4:current}, ${5:hold}, ${6:microsteps}",
  },

  // --------------------------------------------------------------- PIO
  {
    name: "PIO",
    kind: "command",
    category: "PIO",
    syntax: [
      "PIO ASSEMBLE pio, linedata$",
      "PIO PROGRAM pio [, array%()]",
      "PIO INIT MACHINE pio%, sm%, clockspeed [, pinctrl] [, execctrl] [, shiftctrl] [, startinstruction]",
      "PIO CONFIGURE pio, sm, clock ...",
      "PIO START pio, sm",
      "PIO STOP pio, sm",
      "PIO WRITE pio, sm, count, data0 [, data1] ...",
      "PIO READ pio, sm, count, data%[()]",
      "PIO DMA RX|TX pio, sm, nbr, data%() [, interrupt]",
      "PIO INTERRUPT pio, sm [, RXinterrupt] [, TXinterrupt]",
      "PIO EXECUTE pio, sm, instruction%",
      "PIO CLEAR pio",
      "PIO SET BASE 0|16",
    ],
    summary:
      "Assembles and runs programs on the RP2040 / RP2350 programmable I/O state machines.",
    notes: [
      "Use PIO ASSEMBLE to build a program line by line, then PIO PROGRAM to load it.",
      "The PIO() function form builds the control words and reads the FIFOs.",
    ],
    snippet:
      "PIO ${1|ASSEMBLE,PROGRAM,INIT MACHINE,CONFIGURE,START,STOP,WRITE,READ,CLEAR|}",
  },
  {
    name: "PIO(",
    kind: "function",
    category: "PIO",
    syntax: [
      "PIO( PINCTRL ... )",
      "PIO( EXECCTRL jmp_pin, wrap_target, wrap ... )",
      "PIO( SHIFTCTRL push_threshold ... )",
      "PIO( READFIFO a, b, c )",
      "PIO( FSTAT pio ) / PIO( FDEBUG pio ) / PIO( FLEVEL pio )",
      "PIO( DMA RX POINTER ) / PIO( DMA TX POINTER )",
      "PIO( .WRAP ) / PIO( .WRAP TARGET ) / PIO( NEXT LINE )",
    ],
    summary:
      "Builds PIO configuration words and reads state machine status and FIFOs.",
    snippet:
      "PIO(${1|PINCTRL,EXECCTRL,SHIFTCTRL,READFIFO,FSTAT,FLEVEL|} ${2:args})",
  },
];
