# MMBasic for VSCode

Complete MMBasic language support for Visual Studio Code, including syntax highlighting and serial port communication for Micromite, PicoMite and other MMBasic devices.

**Updated for PicoMite V6.02.00** - Syntax highlighting and autocomplete based on the official PicoMite User Manual.

## Features

### 🎨 Syntax Highlighting
- Full syntax highlighting for MMBasic keywords, functions, and commands
- Support for comments (`'` and `REM`)
- Number formats: decimal, hexadecimal (&H), binary (&B), octal (&O)
- Hardware and graphics command highlighting
- Code folding for blocks

### 💡 IntelliSense & Autocomplete
- Smart code completion for keywords, functions, and commands
- Parameter hints with snippets
- Hover documentation with syntax examples
- Context-aware suggestions

### 🔌 Serial Port Communication
- Connect directly to MMBasic devices via serial port
- Send programs from VSCode to your device
- Execute code line-by-line or selections
- Interactive terminal output
- Run and stop programs remotely
- List files on the device

## Installation

### From Source

1. **Clone or download this repository**

2. **Install dependencies**
   ```bash
   cd mmbasic-vscode
   npm install
   ```

3. **Compile the TypeScript code**
   ```bash
   npm run compile
   ```

4. **Open in VSCode and test**
   - Press `F5` to launch Extension Development Host
   - Open a `.bas` or `.mmb` file

### Package as VSIX

```bash
npm install -g @vscode/vsce
vsce package
```

Then install the `.vsix` file via Extensions → Install from VSIX...

## Serial Port Setup

### Quick Start

1. **Connect your MMBasic device** via USB
2. **Open the Command Palette** (`Ctrl+Shift+P` or `Cmd+Shift+P`)
3. **Run:** `MMBasic: Connect to Device`
4. **Select your serial port** from the list

### Configuration

Open VSCode settings and search for "MMBasic":

- **Serial Port**: Default port (e.g., `COM3`, `/dev/ttyUSB0`, `/dev/tty.usbserial`)
- **Baud Rate**: Communication speed (default: 38400)
  - Options: 9600, 19200, 38400, 57600, 115200
- **Auto Connect**: Automatically connect on startup
- **Line Ending**: Line termination for serial communication

Example settings.json:
```json
{
  "mmbasic.serialPort": "/dev/ttyUSB0",
  "mmbasic.baudRate": 38400,
  "mmbasic.autoConnect": false,
  "mmbasic.lineEnding": "\\r\\n"
}
```

## Commands

All commands are available via Command Palette (`Ctrl+Shift+P`):

| Command | Keyboard Shortcut | Description |
|---------|------------------|-------------|
| `MMBasic: Connect to Device` | - | Connect to serial port |
| `MMBasic: Disconnect from Device` | - | Disconnect from device |
| `MMBasic: Send Current File to Device` | `Ctrl+Shift+U` | Upload entire file |
| `MMBasic: Send Selection to Device` | `Ctrl+Enter` | Send selected code or current line |
| `MMBasic: Run Program on Device` | `Ctrl+Shift+R` | Execute the program |
| `MMBasic: Stop Program` | - | Stop running program (Ctrl+C) |
| `MMBasic: List Files on Device` | - | Show files stored on device |
| `MMBasic: Clear Terminal` | - | Clear output window |

### Status Bar

The status bar shows connection status:
- 🔌 **MMBasic: Disconnected** - Click to connect
- ✓ **MMBasic: Connected** - Click to disconnect

## Usage Examples

### Using Autocomplete

The extension provides intelligent code completion as you type:

1. **Start typing a keyword**
   - Type `for` → Get full FOR loop snippet
   - Type `if` → Get IF...THEN...END IF structure
   - Type `sub` → Get SUB...END SUB template

2. **Function completion**
   - Type `print` → See PRINT with parameter hints
   - Type `sin` → Get SIN function with parameter placeholder
   - Type `len` → Get LEN function ready to use

3. **Hardware commands**
   - Type `setpin` → Get SETPIN with mode options (DIN, DOUT, etc.)
   - Type `pwm` → Get PWM with parameter placeholders
   - Type `i2c` → See I2C commands (OPEN, WRITE, READ, CLOSE)

4. **Hover for help**
   - Hover over any keyword to see documentation
   - Examples and syntax shown in tooltip
   - Quick reference without leaving your code

### Example 1: Upload and Run a Program

1. Write your MMBasic code:
```basic
' Blink LED example
SETPIN 13, DOUT

FOR i = 1 TO 10
  PIN(13) = 1
  PAUSE 500
  PIN(13) = 0
  PAUSE 500
NEXT i

PRINT "Done!"
```

2. Press `Ctrl+Shift+U` to send the file to the device
3. Press `Ctrl+Shift+R` to run the program

### Example 2: Interactive Development

1. Connect to your device
2. Select a line or code block
3. Press `Ctrl+Enter` to execute it immediately
4. Watch the output in the MMBasic Serial terminal

### Example 3: Testing Individual Lines

Write some test code:
```basic
PRINT "Hello from MMBasic!"
x = 42
PRINT "The answer is "; x
```

Place cursor on any line and press `Ctrl+Enter` to execute just that line.

## Serial Terminal Output

All serial communication appears in the **MMBasic Serial** output panel:
- Sent commands are prefixed with `>`
- Device responses appear in real-time
- Use `MMBasic: Clear Terminal` to clear the output

## Troubleshooting

### "No serial ports found"

**Windows:**
- Install USB-to-Serial drivers for your device
- Check Device Manager for COM port

**macOS:**
- Port appears as `/dev/tty.usbserial-*` or `/dev/tty.SLAB_USBtoUART`
- May need to install CH340 or FTDI drivers

**Linux:**
- Add user to `dialout` group: `sudo usermod -a -G dialout $USER`
- Log out and back in
- Check `ls /dev/ttyUSB*` or `ls /dev/ttyACM*`

### "Permission denied" (Linux/macOS)

```bash
# Linux
sudo chmod 666 /dev/ttyUSB0

# Or add to dialout group (permanent)
sudo usermod -a -G dialout $USER
```

### Connection Fails

- Verify correct baud rate (38400 is standard for MMBasic)
- Try different line endings in settings
- Close other applications using the serial port
- Power cycle your device

### Extension Won't Compile

Make sure you have the correct Node.js version:
```bash
node --version  # Should be v16 or higher
npm install
npm run compile
```

## Supported File Extensions

- `.bas` - BASIC files
- `.mmb` - MMBasic files

## Development

### Project Structure

```
mmbasic-vscode/
├── src/
│   ├── extension.ts           # Main extension entry point
│   └── serialPortManager.ts   # Serial port handling
├── syntaxes/
│   └── mmbasic.tmLanguage.json  # Syntax highlighting
├── package.json               # Extension manifest
└── tsconfig.json             # TypeScript config
```

### Building from Source

```bash
npm install
npm run compile
npm run watch  # Auto-compile on changes
```

### Testing

Press `F5` in VSCode to launch Extension Development Host.

## Contributing

Contributions welcome! To add features:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Known Limitations

- Serial port selection doesn't auto-detect all device types
- No file download from device yet (planned feature)
- Line-by-line execution may have small delays

## Roadmap

- [ ] Download programs from device
- [ ] Auto-detection of MMBasic devices
- [ ] Code snippets and IntelliSense
- [ ] Integrated debugger support
- [ ] File manager for device storage
- [ ] Terminal with command history

## License

MIT License

## Credits

- MMBasic language by Geoff Graham
- Extension development for the MMBasic community

## Links

- [MMBasic Official Site](http://mmbasic.com/)
- [Micromite Information](https://geoffg.net/micromite.html)
- [The Back Shed Forum](https://www.thebackshed.com/forum/forum_topics.asp?FID=16)

## Support

For issues or questions:
- Check the [troubleshooting section](#troubleshooting)
- Open an issue on GitHub
- Visit the MMBasic community forums

---

Happy coding with MMBasic! 🚀
