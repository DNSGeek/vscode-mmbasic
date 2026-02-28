# Change Log

All notable changes to the MMBasic VSCode extension.

## [1.2.0] - 2026-02-28

### Added
- **🗂️ Remote File Browser**
  - Browse files on connected PicoMite device
  - View A: (internal flash) and B: (SD card) drives
  - See file sizes and directory structure
  - Tree view in MMBasic sidebar
  
- **⬆️⬇️ File Transfer**
  - Upload local .bas/.mmb files to device
  - Download files from device to VSCode
  - Delete files from device
  - Refresh file list on demand
  
- **🐛 Basic Debugger**
  - Start/stop debugging with F5/Shift+F5
  - Step through code with F10
  - Inspect variable values during execution
  - Evaluate expressions on the fly
  - Debug output channel
  - Debug Variables view
  
- **📊 New Views**
  - MMBasic activity bar icon
  - Remote Files tree view
  - Debug Variables tree view
  
- **⌨️ New Commands**
  - Upload/Download/Delete files
  - Start/Stop debugging
  - Step over execution
  - Inspect variables
  - Evaluate expressions
  
- **🎨 UI Enhancements**
  - Context menus for file operations
  - Icons for all file browser actions
  - Integrated toolbar buttons
  
### Documentation
- Added DEBUGGER_GUIDE.md with complete usage instructions
- Examples for debugging and file management
- Troubleshooting tips

### Known Limitations
- Debugger is basic (no true breakpoints due to MMBasic limitations)
- File browser requires manual refresh
- Step execution timing may vary

## [1.1.0] - 2026-02-27

### Updated
- **Synchronized with PicoMite V6.02.00 User Manual**
  - Updated all keywords, commands, and functions to match official documentation
  - Added comprehensive hardware commands (I2C2, SPI2, COM1, COM2, etc.)
  - Added graphics commands (FRAMEBUFFER, LAYER, RBOX, POLYGON, etc.)
  - Added system commands (WATCHDOG, BACKLIGHT, USB, PS2, etc.)
  - Enhanced built-in functions list (JSON$, EPOCH, LGETBYTE, LGETSTR$, etc.)
  - Updated syntax highlighting for all PicoMite-specific features
  - Improved autocomplete suggestions with accurate parameters
  - Updated hover documentation with examples from the manual

## [1.0.0] - 2026-02-17

### Added
- Initial release
- Full MMBasic syntax highlighting
- **IntelliSense and autocomplete**
  - Smart code completion for all keywords and functions
  - Snippet-based templates for control structures (IF, FOR, SUB, etc.)
  - Parameter hints for functions and commands
  - Hover documentation with syntax examples
- Serial port communication support
- Commands:
  - Connect/Disconnect to device
  - Send file to device
  - Send selection/line to device
  - Run program on device
  - Stop running program
  - List files on device
  - Clear terminal output
- Keyboard shortcuts:
  - `Ctrl+Shift+U` - Upload file
  - `Ctrl+Shift+R` - Run program
  - `Ctrl+Enter` - Send selection/line
- Configuration options:
  - Serial port selection
  - Baud rate (9600-115200)
  - Auto-connect on startup
  - Line ending customization
- Status bar indicator showing connection state
- Real-time serial terminal output
- Support for .bas and .mmb file extensions
- Code folding for blocks
- Auto-closing brackets and quotes
- Example programs
- Comprehensive documentation

### Language Features
- Keyword highlighting (IF, FOR, DO, WHILE, SUB, FUNCTION, etc.)
- Built-in function highlighting
- Hardware command highlighting (SETPIN, I2C, SPI, PWM, etc.)
- Graphics command highlighting (PIXEL, LINE, BOX, CIRCLE, etc.)
- Comment support (' and REM)
- Number format support (decimal, hex, binary, octal)
- Variable type indicators ($, %)

### Dependencies
- serialport ^12.0.0
- TypeScript ^4.9.3
- VSCode API ^1.75.0
