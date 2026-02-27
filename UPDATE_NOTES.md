# MMBasic VSCode Extension - PicoMite V6.02.00 Update

## What's New in Version 1.1.0

This release synchronizes the extension with the **official PicoMite User Manual V6.02.00** (February 11, 2026).

### Major Updates

✅ **Comprehensive Keyword Coverage**
- All control flow keywords (IF, FOR, DO, WHILE, SELECT CASE, etc.)
- Program structure commands (SUB, FUNCTION, DIM, LOCAL, STATIC, CONST)
- Error handling (ON ERROR SKIP, ERROR, ERRNO, ERRMSG$)
- Library management (LIBRARY SAVE, LIBRARY LIST, etc.)

✅ **Hardware Commands - Complete PicoMite Support**
- **Pin Configuration**: DIN, DOUT, AIN, CIN, FIN, PIN, INTH, INTL, COUT, PWM, SERVO
- **Serial Ports**: COM1, COM2 with full UART support
- **I2C Interfaces**: I2C and I2C2 (dual I2C buses)
- **SPI Interfaces**: SPI and SPI2 (dual SPI buses)
- **Specialized**: 1WIRE, IR, DS18B20, DHT22, KEYPAD
- **System**: WATCHDOG, RTC, GPS, BACKLIGHT, USB, PS2

✅ **Graphics Commands - Full Display Support**
- Basic: CLS, PIXEL, LINE, BOX, RBOX, CIRCLE, ARC, TRIANGLE
- Advanced: POLYGON, TILE, FRAMEBUFFER, LAYER, BITMAP
- Text: TEXT, FONT, PRINT with rotation support
- Images: LOAD IMAGE, SAVE IMAGE, BLIT, SPRITE
- Control: MODE, PAGE, REFRESH, GUI (HIDE/SHOW)

✅ **Built-in Functions - 50+ Functions**
- Math: ABS, SIN, COS, TAN, ATN, LOG, EXP, SQR, SGN, INT, FIX
- String: LEFT$, RIGHT$, MID$, INSTR, LINSTR, LCASE$, UCASE$, FORMAT$
- Conversion: CHR$, ASC, STR$, VAL, HEX$, BIN$, OCT$
- System: MMINFO, DEVICE, DIR$, FIELD$, CHOICE
- Time: TIME$, DATE$, DATETIME$, EPOCH, TIMER
- Advanced: JSON$, LGETBYTE, LGETSTR$, LCOMPARE, LLEN
- Graphics: PIXEL (function), RGB, DISTANCE

✅ **WiFi & Networking (WebMite)**
- WEB commands (OPEN CLIENT, OPEN SERVER, OPEN UDP, CLOSE, TRANSMIT)
- TFTP (GET/PUT for file transfer)
- NTP (network time protocol)
- EMAIL (SMTP email sending)
- TCP/IP and UDP support

### Improved Autocomplete

**More Accurate Pin Modes:**
```mmbasic
SETPIN GP21, [DIN|DOUT|AIN|CIN|FIN|PIN|INTH|INTL|COUT|PWM|SERVO...]
```

**Serial Port Configuration:**
```mmbasic
SETPIN GP0, COM1 TX
SETPIN GP1, COM1 RX
```

**I2C Configuration:**
```mmbasic
SETPIN GP0, I2C SDA
SETPIN GP1, I2C SCL
```

**SPI Configuration:**
```mmbasic
SETPIN GP2, SPI CLK
SETPIN GP3, SPI TX
SETPIN GP4, SPI RX
```

### Hardware Support

**Raspberry Pi Pico Variants:**
- RP2040 (original Pico)
- RP2350A (Pico 2)
- RP2350B (Pico 2 with 80 pins - GP0 to GP47)
- Pico W & Pico 2 W (with WiFi)

**Pin Naming:**
- Physical pins: 1-40 (Pico standard form factor)
- GPIO pins: GP0-GP28 (RP2040/RP2350A)
- GPIO pins: GP0-GP47 (RP2350B with 80-pin package)
- **Recommendation**: Always use GP notation for compatibility

### Based on Official Documentation

This extension is now fully synchronized with:
- **PicoMite User Manual V6.02.00**
- Release Date: February 11, 2026
- Maintained by: Geoff Graham and Peter Mather
- Official site: http://geoffg.net/picomite.html

### What Works Now

**Syntax Highlighting:**
- All MMBasic keywords properly colored
- Control structures, functions, hardware commands distinguished
- Comments, strings, numbers with proper formatting
- PicoMite-specific features highlighted

**Autocomplete:**
- Accurate parameter hints for all commands
- Context-aware suggestions
- Snippet templates for common patterns
- Function signatures with proper types

**Hover Documentation:**
- Quick reference without leaving editor
- Syntax examples from the manual
- Parameter descriptions
- Common use cases

**Serial Communication:**
- Upload programs to PicoMite
- Interactive line-by-line execution
- Real-time terminal output
- Full control over device

### Compatibility

**Supports:**
- PicoMite (all versions)
- PicoMiteVGA (VGA video output)
- PicoMiteHDMI (HDMI video output - Pico 2 only)
- WebMite (WiFi-enabled versions)
- Third-party RP2040/RP2350 modules

**File Extensions:**
- `.bas` - Standard BASIC files
- `.mmb` - MMBasic files
- `.inc` - Include files

### Examples from the Manual

**Pin Configuration (from manual page 16):**
```mmbasic
' Configure LED on GP21
SETPIN GP21, DOUT
PIN(GP21) = 1      ' Turn on
PAUSE 500
PIN(GP21) = 0      ' Turn off
```

**I2C Communication (from appendix B):**
```mmbasic
' Open I2C bus at 100kHz
I2C OPEN 100, 1000

' Write to device at address 0x48
I2C WRITE &H48, 0, 1, &H01

' Read 2 bytes
DIM data(2) AS INTEGER
I2C READ &H48, 0, 1, 2, data()

I2C CLOSE
```

**SPI Communication (from appendix D):**
```mmbasic
' Configure SPI pins
SETPIN GP2, SPI CLK
SETPIN GP3, SPI TX
SETPIN GP4, SPI RX

' Open SPI at 1MHz
SPI OPEN 1000, 0, 8

' Send data
SPI WRITE 2, &H12, &H34

SPI CLOSE
```

**Graphics (from manual page 73+):**
```mmbasic
' Draw on LCD display
CLS                              ' Clear screen
COLOUR 255, 0, 0                ' Set red
BOX 10, 10, 100, 100            ' Draw box
COLOUR 0, 255, 0                ' Set green
CIRCLE 160, 120, 50             ' Draw circle
TEXT 10, 200, "Hello PicoMite", "LT", 2
```

### Documentation Reference

For complete details, refer to the PicoMite User Manual:
- **Download**: https://geoffg.net/Downloads/picomite/PicoMite_User_Manual.pdf
- **Website**: http://geoffg.net/picomite.html
- **Community**: http://mmbasic.com
- **Forum**: http://www.thebackshed.com/forum/Microcontrollers

### Known Differences

This extension aims for maximum compatibility but note:
- Some advanced PIO programming features may have limited autocomplete
- Complex OPTION commands may need manual parameter entry
- WebMite-specific commands are included but may not be relevant for non-WiFi versions

### Feedback

Found a missing keyword or incorrect documentation?
- Check the official PicoMite manual first
- Report issues with specific page references
- Suggest improvements based on real usage

### Credits

- **MMBasic**: Geoff Graham & Peter Mather
- **PicoMite Firmware**: Peter Mather (matherp)
- **Manual**: Geoff Graham with community input
- **This Extension**: Based on official documentation

---

Enjoy the updated MMBasic development experience! 🚀
