# MMBasic VSCode Extension - Installation Guide

## Prerequisites

- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)
- **Visual Studio Code** (latest version)
- **MMBasic device** (Micromite, etc.) connected via USB

## Step 1: Install Dependencies

```bash
cd vscode-mmbasic
npm install
```

This will install:
- TypeScript compiler
- VSCode extension API
- SerialPort library
- Other development dependencies

## Step 2: Compile the Extension

```bash
npm run compile
```

This compiles the TypeScript source code in `src/` to JavaScript in `out/`.

## Step 3: Test the Extension

### Option A: Development Mode (Recommended for testing)

1. Open the `vscode-mmbasic` folder in VSCode
2. Press `F5` (or Run → Start Debugging)
3. A new "Extension Development Host" window opens
4. Open or create a `.bas` file
5. Try the serial commands!

### Option B: Install as VSIX Package

1. **Package the extension:**
   ```bash
   npm install -g @vscode/vsce
   vsce package
   ```
   This creates `vscode-mmbasic-1.0.0.vsix`

2. **Install in VSCode:**
   - Open VSCode
   - Press `Ctrl+Shift+P` (Cmd+Shift+P on Mac)
   - Type "Install from VSIX"
   - Select the `.vsix` file

3. **Reload VSCode** if prompted

## Step 4: Configure Serial Port

### Find Your Serial Port

**Windows:**
```
Device Manager → Ports (COM & LPT)
Look for: COM3, COM4, etc.
```

**macOS:**
```bash
ls /dev/tty.*
# Look for: /dev/tty.usbserial-* or /dev/tty.SLAB_USBtoUART
```

**Linux:**
```bash
ls /dev/ttyUSB* /dev/ttyACM*
# Look for: /dev/ttyUSB0, /dev/ttyACM0, etc.
```

### Set Default Port (Optional)

1. Open VSCode Settings (`Ctrl+,`)
2. Search for "MMBasic"
3. Set **Serial Port** to your device (e.g., `COM3` or `/dev/ttyUSB0`)
4. Set **Baud Rate** (default: 38400)

Or edit `settings.json`:
```json
{
  "mmbasic.serialPort": "/dev/ttyUSB0",
  "mmbasic.baudRate": 38400,
  "mmbasic.lineEnding": "\\r\\n"
}
```

## Step 5: Test Serial Connection

1. **Connect your MMBasic device** via USB
2. Open Command Palette: `Ctrl+Shift+P`
3. Run: `MMBasic: Connect to Device`
4. Select your serial port from the list
5. Check the **MMBasic Serial** output panel

You should see:
```
Connecting to /dev/ttyUSB0 at 38400 baud...
✓ Connected successfully
```

## Step 6: Test Sending Code

1. **Open** `examples/blink.bas`
2. **Press** `Ctrl+Shift+U` to upload the file
3. **Press** `Ctrl+Shift+R` to run it

Watch the output in the MMBasic Serial panel!

## Troubleshooting

### "No serial ports found"

- **Check USB connection**
- **Install drivers** (CH340, FTDI, etc.)
- **Restart VSCode**

### "Permission denied" (Linux)

```bash
sudo usermod -a -G dialout $USER
# Log out and back in
```

Or temporary fix:
```bash
sudo chmod 666 /dev/ttyUSB0
```

### Compilation Errors

```bash
# Clean and rebuild
rm -rf node_modules out
npm install
npm run compile
```

### Extension Not Loading

1. Check for errors: `Help → Toggle Developer Tools → Console`
2. Reload window: `Ctrl+Shift+P → Reload Window`
3. Check `package.json` for syntax errors

### Serial Port Already in Use

- Close other serial monitors (Arduino IDE, PuTTY, screen, etc.)
- Disconnect and reconnect in VSCode

## Linux-Specific Setup

### Install Serial Port Dependencies

Some Linux systems need additional packages:

```bash
# Ubuntu/Debian
sudo apt-get install build-essential libudev-dev

# Fedora
sudo dnf install make automake gcc gcc-c++ systemd-devel
```

### Udev Rules (Optional)

Create `/etc/udev/rules.d/50-mmbasic.rules`:
```
SUBSYSTEM=="tty", ATTRS{idVendor}=="1a86", ATTRS{idProduct}=="7523", MODE="0666"
```

Reload:
```bash
sudo udevadm control --reload-rules
sudo udevadm trigger
```

## macOS-Specific Setup

### Install CH340 Driver (if needed)

1. Download from: https://github.com/adrianmihalko/ch340g-ch34g-ch34x-mac-os-x-driver
2. Install and restart

### Check Port Access

```bash
ls -l /dev/tty.*
# Should show readable/writable permissions
```

## Windows-Specific Setup

### Install USB-to-Serial Drivers

- **CH340**: https://www.wch.cn/downloads/CH341SER_EXE.html
- **FTDI**: https://ftdichip.com/drivers/vcp-drivers/
- **Prolific**: http://www.prolific.com.tw/US/ShowProduct.aspx?p_id=225

### Find COM Port

1. Open Device Manager
2. Expand "Ports (COM & LPT)"
3. Look for your device (e.g., "USB-SERIAL CH340 (COM3)")

## Next Steps

1. ✅ Extension installed
2. ✅ Serial connection working
3. ✅ Code uploads successfully

Now you can:
- Write MMBasic programs in VSCode
- Upload and run them instantly
- Use interactive line-by-line execution
- Monitor output in real-time

## Getting Help

- Check the main **README.md** for usage examples
- Review **examples/blink.bas** for sample code
- Join the MMBasic community forums
- Report issues on GitHub

Happy coding! 🎉
