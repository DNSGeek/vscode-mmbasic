# vscode-mmbasic

Visual Studio Code support for [MMBasic](https://mmbasic.com/) on the
Raspberry Pi Pico family, targeting the PicoMite firmware.

Write your program in VS Code, upload it over the USB serial console, run it,
browse the device filesystem, and poke at variables while it runs. No copy and
paste into a terminal emulator.

Reference documentation follows the PicoMite User Manual V6.03.01.

## Features

### Language support

- Completion for 334 commands, functions, options and system variables,
  each with a syntax signature and a category
- Snippet bodies with tab stops for anything that takes arguments, including
  choice lists for enumerated parameters such as `SETPIN` modes
- Hover documentation with syntax, notes and a worked example
- Multi word commands resolve as a unit, so hovering either half of
  `ARRAY SLICE` or any word of `WEB MQTT PUBLISH` gives the right entry
- Obsolete keywords are marked deprecated and point at their replacement
- Completions are suppressed inside comments and string literals

### Device integration

- Connect to a PicoMite over the USB serial console, with port selection from
  a list of detected devices
- Upload the active editor or a selection, using `AUTOSAVE` as the transfer
  mechanism
- Run and stop programs, and send arbitrary commands to the prompt
- File browser tree view for the on-device filesystem, with upload, download,
  open and delete
- Serial output in a dedicated Output channel
- Status bar item showing connection state, click to connect or disconnect

### Debugging

The PicoMite has no true stepping debugger, so what is here is pragmatic
rather than complete: `TRON`-based line tracing, a variables tree view, and
commands to inspect a variable or evaluate an expression by sending `PRINT`
to the prompt. Useful, but do not expect breakpoints to behave like a native
debug adapter.

## Requirements

- VS Code 1.75 or later
- A device running PicoMite, PicoMiteVGA, PicoMiteHDMI, WebMite or a related
  MMBasic firmware build
- A USB serial connection to that device

The extension uses the [`serialport`](https://serialport.io/) native module.
Prebuilt binaries cover the common platforms; if your platform is not covered
you will need a build toolchain when the module installs.

## Installation

### From a VSIX

```bash
npx vsce package
code --install-extension vscode-mmbasic-2.0.0.vsix
```

### From source

```bash
git clone https://github.com/DNSGeek/vscode-mmbasic.git
cd vscode-mmbasic
npm install
npm run compile
```

Then press `F5` in VS Code to launch an Extension Development Host.

## Configuration

| Setting               | Default | Description                                                                                                    |
| --------------------- | ------- | -------------------------------------------------------------------------------------------------------------- |
| `mmbasic.serialPort`  | unset   | Device path, for example `/dev/tty.usbmodem1101` or `COM3`. Prompts for a selection when unset or not present. |
| `mmbasic.baudRate`    | `38400` | Console baud rate. Must match `OPTION BAUDRATE` on the device.                                                 |
| `mmbasic.lineEnding`  | `\r\n`  | Line ending sent with each command.                                                                            |
| `mmbasic.autoConnect` | `false` | Connect on activation.                                                                                         |

## Commands

| Command             | ID                           |
| ------------------- | ---------------------------- |
| Connect Serial      | `mmbasic.connectSerial`      |
| Disconnect Serial   | `mmbasic.disconnectSerial`   |
| Send File           | `mmbasic.sendFile`           |
| Send Selection      | `mmbasic.sendSelection`      |
| Run Program         | `mmbasic.runProgram`         |
| Stop Program        | `mmbasic.stopProgram`        |
| List Files          | `mmbasic.listFiles`          |
| Clear Terminal      | `mmbasic.clearTerminal`      |
| Refresh Files       | `mmbasic.refreshFiles`       |
| Upload File         | `mmbasic.uploadFile`         |
| Download File       | `mmbasic.downloadFile`       |
| Delete File         | `mmbasic.deleteFile`         |
| Open Remote File    | `mmbasic.openRemoteFile`     |
| Start Debugging     | `mmbasic.startDebugging`     |
| Stop Debugging      | `mmbasic.stopDebugging`      |
| Step Over           | `mmbasic.debugStepOver`      |
| Continue            | `mmbasic.debugContinue`      |
| Inspect Variable    | `mmbasic.inspectVariable`    |
| Evaluate Expression | `mmbasic.evaluateExpression` |

## Project layout

```
src/
  extension.ts             activation, command registration, status bar
  serialPortManager.ts     port lifecycle, program upload, data listeners
  completionProvider.ts    completion items built from the keyword model
  hoverProvider.ts         hover lookup, including multi word commands
  fileBrowserProvider.ts   tree view over the device filesystem
  debugger.ts              TRON based tracing and the variables view
  mmbasic/
    keywordTypes.ts        the MMBasicKeyword shape
    keywords.ts            aggregation, lookup index, markdown rendering
    data/                  keyword tables, split by domain
```

### Adding or correcting a keyword

Everything the language providers know lives in `src/mmbasic/data/`. Add an
entry to the file matching its domain and both completion and hover pick it up
with no further changes:

```ts
{
  name: "PAUSE",
  kind: "command",
  category: "Program control",
  syntax: ["PAUSE delay"],
  summary: "Suspends the program for the given number of milliseconds.",
  example: "PAUSE 1000   ' one second",
  snippet: "PAUSE ${1:1000}",
}
```

`name` may contain spaces for multi word commands. `snippet` defaults to the
plain name when omitted. Set `variants` to restrict an entry to particular
firmware builds, and `obsolete` with `replacedBy` for compatibility keywords.

## Known limitations

- A handful of specialised keywords are present for completion but carry no
  example yet: `TILEMAP`, `TURTLE`, `DRAW3D`, `STEPPER`, `SPRITE()`, `IMAGE`
  and `STRUCT`
- `PIO` and `MATH` are documented at the family level plus their common
  subcommands rather than every individual form
- Roughly 20 of the 113 `OPTION` settings are included, chosen as the ones
  likely to appear in a program rather than typed once at the prompt
- The file browser assumes drives `A:` and `B:` and parses the text output of
  `FILES`, so unusual listings may not parse cleanly
- Debugging is trace based, not a real debug adapter

## Contributing

Corrections to the keyword tables are especially welcome, particularly for
hardware the author does not have to hand. Keep the summaries and examples
written for this project rather than pasted from the manual.

## License

See [LICENSE.md](LICENSE.md).

## Acknowledgements

MMBasic and the PicoMite firmware are the work of Geoff Graham and Peter
Mather. This extension is an independent project and is not affiliated with
or endorsed by them.
