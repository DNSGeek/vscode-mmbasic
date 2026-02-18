import * as vscode from 'vscode';

export class MMBasicHoverProvider implements vscode.HoverProvider {
    private documentation: Map<string, vscode.MarkdownString>;

    constructor() {
        this.documentation = new Map();
        this.initializeDocumentation();
    }

    provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.Hover> {
        const range = document.getWordRangeAtPosition(position);
        if (!range) {
            return null;
        }

        const word = document.getText(range).toUpperCase();
        const docs = this.documentation.get(word);

        if (docs) {
            return new vscode.Hover(docs);
        }

        return null;
    }

    private initializeDocumentation(): void {
        // Control flow
        this.addDoc('IF', '**IF** condition **THEN**\n\n' +
            'Conditional execution.\n\n' +
            '```mmbasic\n' +
            'IF x > 10 THEN\n' +
            '  PRINT "Greater than 10"\n' +
            'ELSEIF x > 5 THEN\n' +
            '  PRINT "Greater than 5"\n' +
            'ELSE\n' +
            '  PRINT "5 or less"\n' +
            'END IF\n' +
            '```');

        this.addDoc('FOR', '**FOR** variable = start **TO** end [**STEP** increment]\n\n' +
            'Loop with counter.\n\n' +
            '```mmbasic\n' +
            'FOR i = 1 TO 10 STEP 2\n' +
            '  PRINT i\n' +
            'NEXT i\n' +
            '```');

        this.addDoc('DO', '**DO** [**WHILE** | **UNTIL** condition]\n\n' +
            'Loop until condition is met.\n\n' +
            '```mmbasic\n' +
            'DO WHILE x < 100\n' +
            '  x = x + 1\n' +
            'LOOP\n' +
            '```');

        this.addDoc('WHILE', '**WHILE** condition\n\n' +
            'Loop while condition is true.\n\n' +
            '```mmbasic\n' +
            'WHILE x < 100\n' +
            '  x = x + 1\n' +
            'WEND\n' +
            '```');

        this.addDoc('SELECT', '**SELECT CASE** variable\n\n' +
            'Multi-way branch.\n\n' +
            '```mmbasic\n' +
            'SELECT CASE x\n' +
            '  CASE 1\n' +
            '    PRINT "One"\n' +
            '  CASE 2 TO 5\n' +
            '    PRINT "Two to Five"\n' +
            '  CASE ELSE\n' +
            '    PRINT "Other"\n' +
            'END SELECT\n' +
            '```');

        // Functions
        this.addDoc('PRINT', '**PRINT** [expression [; | ,] ...]\n\n' +
            'Output to console. Use semicolon to suppress newline.\n\n' +
            '```mmbasic\n' +
            'PRINT "Value: "; x\n' +
            'PRINT "Line 1", "Line 2"\n' +
            '```');

        this.addDoc('INPUT', '**INPUT** ["prompt",] variable\n\n' +
            'Read input from user.\n\n' +
            '```mmbasic\n' +
            'INPUT "Enter name: ", name$\n' +
            'INPUT x\n' +
            '```');

        this.addDoc('DIM', '**DIM** variable [(size)] [**AS** type]\n\n' +
            'Declare a variable or array.\n\n' +
            'Types: INTEGER, FLOAT, STRING\n\n' +
            '```mmbasic\n' +
            'DIM counter AS INTEGER\n' +
            'DIM values(100) AS FLOAT\n' +
            'DIM name$ AS STRING\n' +
            '```');

        this.addDoc('SUB', '**SUB** name [(parameters)]\n\n' +
            'Define a subroutine.\n\n' +
            '```mmbasic\n' +
            'SUB PrintMessage(msg$)\n' +
            '  PRINT msg$\n' +
            'END SUB\n' +
            '```');

        this.addDoc('FUNCTION', '**FUNCTION** name [(parameters)] **AS** type\n\n' +
            'Define a function that returns a value.\n\n' +
            '```mmbasic\n' +
            'FUNCTION Square(x) AS FLOAT\n' +
            '  Square = x * x\n' +
            'END FUNCTION\n' +
            '```');

        // Hardware commands
        this.addDoc('SETPIN', '**SETPIN** pin, mode\n\n' +
            'Configure pin mode.\n\n' +
            'Modes: DIN (digital in), DOUT (digital out), AIN (analog in), PWM, SERVO\n\n' +
            '```mmbasic\n' +
            'SETPIN 13, DOUT  \' LED pin\n' +
            'SETPIN 2, DIN    \' Button pin\n' +
            'SETPIN 5, PWM    \' PWM output\n' +
            '```');

        this.addDoc('PIN', '**PIN** (pin) [= value]\n\n' +
            'Read or write digital pin value.\n\n' +
            '```mmbasic\n' +
            'PIN(13) = 1      \' Set high\n' +
            'x = PIN(2)       \' Read pin\n' +
            '```');

        this.addDoc('PWM', '**PWM** pin, frequency, duty_cycle\n\n' +
            'Set PWM output.\n\n' +
            'frequency: Hz (20-1000000)\n' +
            'duty_cycle: 0-100%\n\n' +
            '```mmbasic\n' +
            'PWM 5, 1000, 50  \' 1kHz at 50%\n' +
            '```');

        this.addDoc('PAUSE', '**PAUSE** milliseconds\n\n' +
            'Delay execution.\n\n' +
            '```mmbasic\n' +
            'PAUSE 1000  \' Wait 1 second\n' +
            '```');

        this.addDoc('ADC', '**ADC** (channel)\n\n' +
            'Read analog input (0-4095).\n\n' +
            '```mmbasic\n' +
            'voltage = ADC(0) * 3.3 / 4095\n' +
            '```');

        // I2C
        this.addDoc('I2C', '**I2C** command\n\n' +
            'I2C bus communication.\n\n' +
            '**Commands:**\n' +
            '- OPEN speed, timeout\n' +
            '- WRITE addr, option, count, data\n' +
            '- READ addr, option, send_count, recv_count, buffer\n' +
            '- CLOSE\n\n' +
            '```mmbasic\n' +
            'I2C OPEN 100, 1000\n' +
            'I2C WRITE &H48, 0, 1, &H01\n' +
            'I2C CLOSE\n' +
            '```');

        // SPI
        this.addDoc('SPI', '**SPI** command\n\n' +
            'SPI bus communication.\n\n' +
            '**Commands:**\n' +
            '- OPEN speed, mode, bits\n' +
            '- WRITE count, data\n' +
            '- READ count, buffer\n' +
            '- CLOSE\n\n' +
            '```mmbasic\n' +
            'SPI OPEN 1000, 0, 8\n' +
            'SPI WRITE 2, &H12, &H34\n' +
            'SPI CLOSE\n' +
            '```');

        // Graphics
        this.addDoc('CLS', '**CLS**\n\nClear screen.');

        this.addDoc('PIXEL', '**PIXEL** x, y, color\n\n' +
            'Draw a pixel.\n\n' +
            '```mmbasic\n' +
            'PIXEL 100, 50, RGB(255, 0, 0)\n' +
            '```');

        this.addDoc('LINE', '**LINE** x1, y1, x2, y2, [width,] color\n\n' +
            'Draw a line.\n\n' +
            '```mmbasic\n' +
            'LINE 0, 0, 100, 100, 2, RGB(0, 255, 0)\n' +
            '```');

        this.addDoc('BOX', '**BOX** x, y, width, height, [line_width,] color [, fill_color]\n\n' +
            'Draw a rectangle.\n\n' +
            '```mmbasic\n' +
            'BOX 10, 10, 80, 60, 2, RGB(0, 0, 255)\n' +
            '```');

        this.addDoc('CIRCLE', '**CIRCLE** x, y, radius, [line_width,] color [, fill_color]\n\n' +
            'Draw a circle.\n\n' +
            '```mmbasic\n' +
            'CIRCLE 160, 120, 50, 2, RGB(255, 255, 0)\n' +
            '```');

        this.addDoc('TEXT', '**TEXT** x, y, string, align, [font,] color\n\n' +
            'Display text.\n\n' +
            'Align: "LT", "CT", "RT" (left/center/right, top)\n\n' +
            '```mmbasic\n' +
            'TEXT 10, 10, "Hello", "LT", 1, RGB(255, 255, 255)\n' +
            '```');

        // String functions
        this.addDoc('LEN', '**LEN** (string)\n\n' +
            'Returns length of string.\n\n' +
            '```mmbasic\n' +
            'x = LEN("Hello")  \' Returns 5\n' +
            '```');

        this.addDoc('LEFT$', '**LEFT$** (string, count)\n\n' +
            'Returns leftmost characters.\n\n' +
            '```mmbasic\n' +
            's$ = LEFT$("Hello", 3)  \' Returns "Hel"\n' +
            '```');

        this.addDoc('RIGHT$', '**RIGHT$** (string, count)\n\n' +
            'Returns rightmost characters.\n\n' +
            '```mmbasic\n' +
            's$ = RIGHT$("Hello", 3)  \' Returns "llo"\n' +
            '```');

        this.addDoc('MID$', '**MID$** (string, start [, count])\n\n' +
            'Returns substring.\n\n' +
            '```mmbasic\n' +
            's$ = MID$("Hello", 2, 3)  \' Returns "ell"\n' +
            '```');

        this.addDoc('UCASE$', '**UCASE$** (string)\n\n' +
            'Converts to uppercase.\n\n' +
            '```mmbasic\n' +
            's$ = UCASE$("hello")  \' Returns "HELLO"\n' +
            '```');

        this.addDoc('LCASE$', '**LCASE$** (string)\n\n' +
            'Converts to lowercase.\n\n' +
            '```mmbasic\n' +
            's$ = LCASE$("HELLO")  \' Returns "hello"\n' +
            '```');

        // Math functions
        this.addDoc('ABS', '**ABS** (number)\n\n' +
            'Returns absolute value.\n\n' +
            '```mmbasic\n' +
            'x = ABS(-5)  \' Returns 5\n' +
            '```');

        this.addDoc('SIN', '**SIN** (angle)\n\n' +
            'Returns sine (angle in radians).\n\n' +
            '```mmbasic\n' +
            'y = SIN(3.14159 / 2)  \' Returns 1\n' +
            '```');

        this.addDoc('COS', '**COS** (angle)\n\n' +
            'Returns cosine (angle in radians).\n\n' +
            '```mmbasic\n' +
            'y = COS(0)  \' Returns 1\n' +
            '```');

        this.addDoc('TAN', '**TAN** (angle)\n\n' +
            'Returns tangent (angle in radians).');

        this.addDoc('SQR', '**SQR** (number)\n\n' +
            'Returns square root.\n\n' +
            '```mmbasic\n' +
            'x = SQR(16)  \' Returns 4\n' +
            '```');

        this.addDoc('RND', '**RND** ([min, max])\n\n' +
            'Returns random number.\n\n' +
            '```mmbasic\n' +
            'x = RND()        \' 0.0 to 1.0\n' +
            'x = RND(1, 100)  \' 1 to 100\n' +
            '```');

        this.addDoc('INT', '**INT** (number)\n\n' +
            'Returns integer (rounds down).\n\n' +
            '```mmbasic\n' +
            'x = INT(3.7)  \' Returns 3\n' +
            '```');
    }

    private addDoc(keyword: string, markdown: string): void {
        this.documentation.set(keyword, new vscode.MarkdownString(markdown));
    }
}
