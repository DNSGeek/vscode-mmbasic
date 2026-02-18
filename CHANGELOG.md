# Change Log

All notable changes to the MMBasic VSCode extension.

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
