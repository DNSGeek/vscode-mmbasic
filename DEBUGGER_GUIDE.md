# MMBasic VSCode Extension - Debugger & File Browser Guide

## Version 1.2.0 - New Features!

This release adds **remote file browsing**, **file transfer**, and a **basic debugger** to the MMBasic extension!

## 🗂️ Remote File Browser

### Overview
Browse, download, upload, and delete files directly on your PicoMite device from within VSCode.

### Accessing the File Browser
1. Click the **MMBasic** icon in the Activity Bar (left sidebar)
2. The "Remote Files" view shows files on the connected device
3. Expands to show A: and B: drives

### Features

**📁 Browse Files**
- View all files and directories on the device
- See file sizes
- Organized by drive (A: for internal flash, B: for SD card)

**⬆️ Upload Files**
- Click the upload icon (cloud with arrow up) in the file browser toolbar
- Select a local .bas or .mmb file
- Enter the remote filename
- File is transferred to the device

**⬇️ Download Files**
- Click on any file to open it in VSCode
- Or right-click → "Download File"
- File opens in a new editor tab
- You can save it locally

**🗑️ Delete Files**
- Click the trash icon next to any file
- Confirms before deleting
- Permanently removes file from device

**🔄 Refresh**
- Click the refresh icon to update the file list
- Useful after creating/deleting files

### Commands

| Command | Description |
|---------|-------------|
| `MMBasic: Refresh Files` | Reload file list from device |
| `MMBasic: Upload File to Device` | Upload local file to device |
| `MMBasic: Download File` | Download and open remote file |
| `MMBasic: Delete File` | Delete file from device |

### Usage Example

```
1. Connect to your PicoMite
2. Open MMBasic sidebar (circuit board icon)
3. Click "Refresh Files" to see what's on the device
4. Expand A: to see internal flash files
5. Click a file to view it
6. Click upload icon to send a new program
```

## 🐛 Debugger

### Overview
A basic line-by-line debugger for MMBasic programs with variable inspection and expression evaluation.

### Features

**🔴 Start/Stop Debugging**
- Press `F5` to start debugging the current file
- Press `Shift+F5` to stop
- Program uploads and runs with tracing enabled

**⏯️ Step Execution**
- Press `F10` to step over (execute next line)
- Press `F5` during debugging to continue

**🔍 Variable Inspection**
- Use "Inspect Variable" command
- Enter variable name
- Value shows in Debug Variables view
- Updates as you step through code

**📊 Expression Evaluation**
- Use "Evaluate Expression" command
- Enter any MMBasic expression
- Shows result in a popup

**📺 Debug Output**
- Dedicated "MMBasic Debug" output channel
- Shows debugging messages
- Tracks program execution

### Commands

| Command | Keybinding | Description |
|---------|-----------|-------------|
| `MMBasic: Start Debugging` | `F5` | Start debugging current file |
| `MMBasic: Stop Debugging` | `Shift+F5` | Stop debugging session |
| `MMBasic: Step Over` | `F10` | Execute next line |
| `MMBasic: Continue` | `F5` (in debug) | Continue execution |
| `MMBasic: Inspect Variable` | - | View variable value |
| `MMBasic: Evaluate Expression` | - | Evaluate expression |

### Debug Variables View

Located in the MMBasic sidebar, shows:
- Variable names
- Current values
- Updates when you inspect variables

### How to Debug

**Example Debugging Session:**

```basic
' Save this as test.bas
DIM counter AS INTEGER
DIM total AS INTEGER

counter = 0
total = 0

FOR counter = 1 TO 10
    total = total + counter
    PRINT "Counter: "; counter; " Total: "; total
NEXT counter

PRINT "Final total: "; total
```

**Steps:**
1. Open the file in VSCode
2. Connect to your PicoMite
3. Press `F5` to start debugging
4. Watch the MMBasic Debug output channel
5. Press `F10` to step through
6. Use "Inspect Variable" to check `counter` and `total`
7. Press `F5` to continue to end
8. Press `Shift+F5` to stop

### Limitations

**Current debugger is basic:**
- No true breakpoints (MMBasic limitation)
- Uses TRON (trace on) for line tracking
- Step execution may not be precise
- Best for sequential programs
- Interrupt-driven code may behave differently

**What it's good for:**
- Checking variable values during execution
- Understanding program flow
- Debugging logic errors
- Learning MMBasic

**What it's not (yet):**
- Full breakpoint support
- Call stack inspection
- Watch expressions
- Conditional breakpoints

## 🚀 Quick Start Guide

### Complete Workflow Example

**1. Connect**
```
Ctrl+Shift+P → "MMBasic: Connect to Device"
```

**2. Browse Files**
```
Click MMBasic icon in sidebar
Click "Refresh Files"
Expand A: to see files
```

**3. Upload a Program**
```
Write your program locally
Click upload icon in file browser
Select your .bas file
Enter remote name (e.g., "myprogram.bas")
```

**4. Debug It**
```
Open the file in VSCode
Press F5 to start debugging
Use F10 to step through
Inspect variables as needed
Press Shift+F5 when done
```

**5. Download Results**
```
Click any file in the browser
Opens in VSCode
Save locally if needed
```

## 📝 Tips & Best Practices

### File Browser

**✅ Do:**
- Refresh after major changes
- Use descriptive filenames
- Keep A: for active programs
- Use B: for data/storage (if SD card present)

**❌ Don't:**
- Delete system files
- Upload files while program is running
- Expect instant updates (refresh manually)

### Debugger

**✅ Do:**
- Start with simple programs
- Inspect variables at key points
- Use PRINT statements for additional logging
- Stop debugging before uploading new code

**❌ Don't:**
- Expect real-time debugging
- Debug interrupt-heavy code
- Rely on precise step timing
- Use with programs that require user input mid-execution

## 🔧 Configuration

No additional configuration needed! The features use your existing serial connection settings:

```json
{
  "mmbasic.serialPort": "/dev/ttyUSB0",
  "mmbasic.baudRate": 38400,
  "mmbasic.lineEnding": "\\r\\n"
}
```

## 🆘 Troubleshooting

### File Browser Issues

**Files don't appear:**
- Ensure you're connected to the device
- Click "Refresh Files"
- Check MMBasic Serial output for errors
- Verify device has files (run FILES command)

**Upload fails:**
- Check connection
- Ensure enough space on device
- Try smaller file first
- Check file permissions

**Can't delete file:**
- File may be currently running
- Restart device and try again

### Debugger Issues

**Debugging doesn't start:**
- Ensure MMBasic file is open and active
- Check connection to device
- Try stopping any running program first
- Clear and reconnect

**Step doesn't work:**
- Some MMBasic versions may behave differently
- Try using expression evaluation instead
- Check MMBasic Debug output channel

**Variables show wrong values:**
- Re-inspect the variable
- Values only update when explicitly inspected
- Try evaluating the variable as an expression

## 🎯 Use Cases

### Remote Development
1. Develop on your computer
2. Upload to device
3. Test and debug
4. Download for backup
5. Repeat!

### Quick Testing
1. Write a quick test program
2. Upload and run
3. Check results
4. Delete test file

### Learning MMBasic
1. Browse example files on device
2. Download and study
3. Modify and re-upload
4. Debug to understand flow

### Production Deployment
1. Develop and test locally
2. Upload final version
3. Verify with debugger
4. Set OPTION AUTORUN
5. Done!

## 📚 Examples

### Example: Upload and Debug

```basic
' Create this file locally: blink_debug.bas
OPTION EXPLICIT

CONST LED_PIN = GP21
CONST BLINK_COUNT = 5

DIM i AS INTEGER

SUB Setup()
  SETPIN LED_PIN, DOUT
  PRINT "Setup complete"
END SUB

SUB BlinkLED(times AS INTEGER)
  LOCAL count AS INTEGER
  FOR count = 1 TO times
    PIN(LED_PIN) = 1
    PAUSE 300
    PIN(LED_PIN) = 0
    PAUSE 300
    PRINT "Blink "; count
  NEXT count
END SUB

' Main
Setup()
BlinkLED(BLINK_COUNT)
PRINT "Done!"
```

**Workflow:**
1. Save the file locally
2. Upload via file browser
3. Start debugging (F5)
4. Step through Setup (F10)
5. Inspect `i` before loop
6. Continue (F5) to let it run
7. Check output in debug channel

### Example: File Management

**Scenario**: You have multiple test programs

```
A:/
  ├── main.bas          (your production code)
  ├── test_i2c.bas     (I2C testing)
  ├── test_spi.bas     (SPI testing)
  └── test_pwm.bas     (PWM testing)
```

**Actions:**
- Download main.bas for backup
- Upload new test_lcd.bas
- Delete old test files
- Organize into folders (if supported)

## 🎓 Advanced Usage

### Debugging Complex Programs

For programs with multiple subroutines:

```basic
SUB Test1()
  LOCAL x AS INTEGER
  x = 42
  PRINT "Test1: x ="; x
END SUB

SUB Test2()
  LOCAL y AS INTEGER
  y = 100
  PRINT "Test2: y ="; y
END SUB

Test1()
' <-- Inspect variables here
Test2()
' <-- Inspect again
```

Use "Evaluate Expression" to check:
- `x` (won't work - local to Test1)
- Global variables
- Expressions like `42 * 2`

### Batch File Operations

While the UI is manual, you can script operations:
1. Create multiple programs locally
2. Upload them one by one
3. Test each with debugger
4. Keep versions organized

## 🔮 Future Enhancements

Planned features for future releases:
- True breakpoint support (if PicoMite firmware adds support)
- Watch expressions
- Call stack view
- Batch file upload/download
- File comparison (local vs remote)
- Automatic backup on upload
- Program library management

## 📖 Additional Resources

- Main README: Installation and basic usage
- PicoMite Manual: http://geoffg.net/Downloads/picomite/PicoMite_User_Manual.pdf
- Community Forum: http://www.thebackshed.com/forum/Microcontrollers

---

Happy debugging and remote development! 🎉
