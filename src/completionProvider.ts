import * as vscode from 'vscode';

export class MMBasicCompletionProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): vscode.CompletionItem[] {
        const completions: vscode.CompletionItem[] = [];

        // Control flow keywords
        this.addControlFlowCompletions(completions);
        
        // Data types and declarations
        this.addDeclarationCompletions(completions);
        
        // Built-in functions
        this.addFunctionCompletions(completions);
        
        // Hardware commands
        this.addHardwareCompletions(completions);
        
        // Graphics commands
        this.addGraphicsCompletions(completions);
        
        // I/O commands
        this.addIOCompletions(completions);

        // WiFi commands (for WebMite)
        this.addWiFiCompletions(completions);

        return completions;
    }

    private addControlFlowCompletions(completions: vscode.CompletionItem[]): void {
        // IF statement
        const ifItem = new vscode.CompletionItem('IF', vscode.CompletionItemKind.Keyword);
        ifItem.insertText = new vscode.SnippetString('IF ${1:condition} THEN\n\t$0\nEND IF');
        ifItem.documentation = new vscode.MarkdownString('IF...THEN...END IF statement');
        completions.push(ifItem);

        // FOR loop
        const forItem = new vscode.CompletionItem('FOR', vscode.CompletionItemKind.Keyword);
        forItem.insertText = new vscode.SnippetString('FOR ${1:i} = ${2:1} TO ${3:10}\n\t$0\nNEXT ${1:i}');
        forItem.documentation = new vscode.MarkdownString('FOR...TO...NEXT loop');
        completions.push(forItem);

        // DO loop
        const doItem = new vscode.CompletionItem('DO', vscode.CompletionItemKind.Keyword);
        doItem.insertText = new vscode.SnippetString('DO\n\t$0\nLOOP');
        doItem.documentation = new vscode.MarkdownString('DO...LOOP statement');
        completions.push(doItem);

        // WHILE loop
        const whileItem = new vscode.CompletionItem('WHILE', vscode.CompletionItemKind.Keyword);
        whileItem.insertText = new vscode.SnippetString('WHILE ${1:condition}\n\t$0\nWEND');
        whileItem.documentation = new vscode.MarkdownString('WHILE...WEND loop');
        completions.push(whileItem);

        // SELECT CASE
        const selectItem = new vscode.CompletionItem('SELECT CASE', vscode.CompletionItemKind.Keyword);
        selectItem.insertText = new vscode.SnippetString('SELECT CASE ${1:variable}\n\tCASE ${2:value1}\n\t\t$0\n\tCASE ELSE\n\t\t\nEND SELECT');
        selectItem.documentation = new vscode.MarkdownString('SELECT CASE statement');
        completions.push(selectItem);

        // Simple keywords
        const keywords = ['THEN', 'ELSE', 'ELSEIF', 'END IF', 'TO', 'STEP', 'NEXT', 
                         'LOOP', 'UNTIL', 'WEND', 'CASE', 'END SELECT', 'GOTO', 
                         'GOSUB', 'RETURN', 'EXIT', 'CONTINUE'];
        keywords.forEach(keyword => {
            const item = new vscode.CompletionItem(keyword, vscode.CompletionItemKind.Keyword);
            completions.push(item);
        });
    }

    private addDeclarationCompletions(completions: vscode.CompletionItem[]): void {
        // SUB
        const subItem = new vscode.CompletionItem('SUB', vscode.CompletionItemKind.Snippet);
        subItem.insertText = new vscode.SnippetString('SUB ${1:SubName}(${2:params})\n\t$0\nEND SUB');
        subItem.documentation = new vscode.MarkdownString('Define a subroutine');
        completions.push(subItem);

        // FUNCTION
        const funcItem = new vscode.CompletionItem('FUNCTION', vscode.CompletionItemKind.Snippet);
        funcItem.insertText = new vscode.SnippetString('FUNCTION ${1:FunctionName}(${2:params}) AS ${3:FLOAT}\n\t$0\n\t${1:FunctionName} = ${4:result}\nEND FUNCTION');
        funcItem.documentation = new vscode.MarkdownString('Define a function that returns a value');
        completions.push(funcItem);

        // DIM
        const dimItem = new vscode.CompletionItem('DIM', vscode.CompletionItemKind.Keyword);
        dimItem.insertText = new vscode.SnippetString('DIM ${1:variable} AS ${2|INTEGER,FLOAT,STRING|}');
        dimItem.documentation = new vscode.MarkdownString('Declare a variable');
        completions.push(dimItem);

        // LOCAL
        const localItem = new vscode.CompletionItem('LOCAL', vscode.CompletionItemKind.Keyword);
        localItem.insertText = new vscode.SnippetString('LOCAL ${1:variable} AS ${2|INTEGER,FLOAT,STRING|}');
        localItem.documentation = new vscode.MarkdownString('Declare a local variable');
        completions.push(localItem);

        // CONST
        const constItem = new vscode.CompletionItem('CONST', vscode.CompletionItemKind.Keyword);
        constItem.insertText = new vscode.SnippetString('CONST ${1:NAME} = ${2:value}');
        constItem.documentation = new vscode.MarkdownString('Define a constant');
        completions.push(constItem);

        // OPTION
        const optionBase = new vscode.CompletionItem('OPTION BASE', vscode.CompletionItemKind.Keyword);
        optionBase.insertText = 'OPTION BASE 1';
        optionBase.documentation = new vscode.MarkdownString('Set array base index (0 or 1)');
        completions.push(optionBase);

        const optionExplicit = new vscode.CompletionItem('OPTION EXPLICIT', vscode.CompletionItemKind.Keyword);
        optionExplicit.documentation = new vscode.MarkdownString('Require variable declarations');
        completions.push(optionExplicit);
    }

    private addFunctionCompletions(completions: vscode.CompletionItem[]): void {
        const functions = [
            { name: 'ABS', params: '(number)', desc: 'Returns absolute value', snippet: 'ABS(${1:number})' },
            { name: 'ASC', params: '(string)', desc: 'Returns ASCII code of first character', snippet: 'ASC(${1:string})' },
            { name: 'ATN', params: '(number)', desc: 'Returns arctangent', snippet: 'ATN(${1:number})' },
            { name: 'CHR$', params: '(code)', desc: 'Returns character from ASCII code', snippet: 'CHR$(${1:code})' },
            { name: 'CINT', params: '(number)', desc: 'Converts to integer', snippet: 'CINT(${1:number})' },
            { name: 'COS', params: '(angle)', desc: 'Returns cosine', snippet: 'COS(${1:angle})' },
            { name: 'DATE$', params: '', desc: 'Returns current date', snippet: 'DATE$' },
            { name: 'EXP', params: '(number)', desc: 'Returns e raised to power', snippet: 'EXP(${1:number})' },
            { name: 'FIX', params: '(number)', desc: 'Returns integer portion', snippet: 'FIX(${1:number})' },
            { name: 'HEX$', params: '(number)', desc: 'Returns hexadecimal string', snippet: 'HEX$(${1:number})' },
            { name: 'INSTR', params: '(start, string, search)', desc: 'Finds substring position', snippet: 'INSTR(${1:start}, ${2:string}, ${3:search})' },
            { name: 'INT', params: '(number)', desc: 'Returns integer (rounds down)', snippet: 'INT(${1:number})' },
            { name: 'LCASE$', params: '(string)', desc: 'Converts to lowercase', snippet: 'LCASE$(${1:string})' },
            { name: 'LEFT$', params: '(string, length)', desc: 'Returns leftmost characters', snippet: 'LEFT$(${1:string}, ${2:length})' },
            { name: 'LEN', params: '(string)', desc: 'Returns string length', snippet: 'LEN(${1:string})' },
            { name: 'LOG', params: '(number)', desc: 'Returns natural logarithm', snippet: 'LOG(${1:number})' },
            { name: 'MID$', params: '(string, start, length)', desc: 'Returns substring', snippet: 'MID$(${1:string}, ${2:start}, ${3:length})' },
            { name: 'RIGHT$', params: '(string, length)', desc: 'Returns rightmost characters', snippet: 'RIGHT$(${1:string}, ${2:length})' },
            { name: 'RND', params: '(min, max)', desc: 'Returns random number', snippet: 'RND(${1:min}, ${2:max})' },
            { name: 'SGN', params: '(number)', desc: 'Returns sign (-1, 0, 1)', snippet: 'SGN(${1:number})' },
            { name: 'SIN', params: '(angle)', desc: 'Returns sine', snippet: 'SIN(${1:angle})' },
            { name: 'SPACE$', params: '(count)', desc: 'Returns string of spaces', snippet: 'SPACE$(${1:count})' },
            { name: 'SQR', params: '(number)', desc: 'Returns square root', snippet: 'SQR(${1:number})' },
            { name: 'STR$', params: '(number)', desc: 'Converts number to string', snippet: 'STR$(${1:number})' },
            { name: 'STRING$', params: '(count, char)', desc: 'Returns repeated character', snippet: 'STRING$(${1:count}, ${2:char})' },
            { name: 'TAN', params: '(angle)', desc: 'Returns tangent', snippet: 'TAN(${1:angle})' },
            { name: 'TIME$', params: '', desc: 'Returns current time', snippet: 'TIME$' },
            { name: 'TIMER', params: '', desc: 'Returns milliseconds since startup', snippet: 'TIMER' },
            { name: 'UCASE$', params: '(string)', desc: 'Converts to uppercase', snippet: 'UCASE$(${1:string})' },
            { name: 'VAL', params: '(string)', desc: 'Converts string to number', snippet: 'VAL(${1:string})' },
        ];

        functions.forEach(func => {
            const item = new vscode.CompletionItem(func.name, vscode.CompletionItemKind.Function);
            item.insertText = new vscode.SnippetString(func.snippet);
            item.documentation = new vscode.MarkdownString(`**${func.name}${func.params}**\n\n${func.desc}`);
            item.detail = func.params;
            completions.push(item);
        });
    }

    private addHardwareCompletions(completions: vscode.CompletionItem[]): void {
        // SETPIN
        const setpinItem = new vscode.CompletionItem('SETPIN', vscode.CompletionItemKind.Function);
        setpinItem.insertText = new vscode.SnippetString('SETPIN ${1:pin}, ${2|DIN,DOUT,AIN,CIN,FIN,PIN,INTH,INTL,COUT,PWM,SERVO,I2C SDA,I2C SCL,I2C2 SDA,I2C2 SCL,SPI RX,SPI TX,SPI CLK,SPI2 RX,SPI2 TX,SPI2 CLK,COM1 TX,COM1 RX,COM2 TX,COM2 RX,1WIRE,IR,DS18B20,DHT22,KEYPAD,OFF|}');
        setpinItem.documentation = new vscode.MarkdownString('Configure a pin mode\n\n**Modes:**\n- DIN/DOUT: Digital input/output\n- AIN: Analog input\n- CIN: Count input\n- FIN: Frequency input\n- PIN: Period input\n- INTH/INTL: Interrupt on high/low\n- COUT: Count output\n- PWM: PWM output\n- SERVO: Servo output\n- I2C/I2C2: I2C interfaces\n- SPI/SPI2: SPI interfaces\n- COM1/COM2: Serial ports\n- And more...');
        completions.push(setpinItem);

        // PIN
        const pinItem = new vscode.CompletionItem('PIN', vscode.CompletionItemKind.Function);
        pinItem.insertText = new vscode.SnippetString('PIN(${1:pin})');
        pinItem.documentation = new vscode.MarkdownString('Read or write pin value');
        completions.push(pinItem);

        // PWM
        const pwmItem = new vscode.CompletionItem('PWM', vscode.CompletionItemKind.Function);
        pwmItem.insertText = new vscode.SnippetString('PWM ${1:pin}, ${2:frequency}, ${3:duty_cycle}');
        pwmItem.documentation = new vscode.MarkdownString('Set PWM output\n\nfrequency: Hz, duty_cycle: 0-100%');
        completions.push(pwmItem);

        // PULSE
        const pulseItem = new vscode.CompletionItem('PULSE', vscode.CompletionItemKind.Function);
        pulseItem.insertText = new vscode.SnippetString('PULSE ${1:pin}, ${2:period}');
        pulseItem.documentation = new vscode.MarkdownString('Generate pulse on pin (period in microseconds)');
        completions.push(pulseItem);

        // PAUSE
        const pauseItem = new vscode.CompletionItem('PAUSE', vscode.CompletionItemKind.Function);
        pauseItem.insertText = new vscode.SnippetString('PAUSE ${1:milliseconds}');
        pauseItem.documentation = new vscode.MarkdownString('Delay execution (milliseconds)');
        completions.push(pauseItem);

        // I2C
        const i2cOpen = new vscode.CompletionItem('I2C OPEN', vscode.CompletionItemKind.Function);
        i2cOpen.insertText = new vscode.SnippetString('I2C OPEN ${1:speed}, ${2:timeout}');
        i2cOpen.documentation = new vscode.MarkdownString('Open I2C bus (speed in kHz)');
        completions.push(i2cOpen);

        const i2cWrite = new vscode.CompletionItem('I2C WRITE', vscode.CompletionItemKind.Function);
        i2cWrite.insertText = new vscode.SnippetString('I2C WRITE ${1:addr}, ${2:option}, ${3:count}, ${4:data}');
        i2cWrite.documentation = new vscode.MarkdownString('Write to I2C device');
        completions.push(i2cWrite);

        const i2cRead = new vscode.CompletionItem('I2C READ', vscode.CompletionItemKind.Function);
        i2cRead.insertText = new vscode.SnippetString('I2C READ ${1:addr}, ${2:option}, ${3:send_count}, ${4:recv_count}, ${5:buffer}');
        i2cRead.documentation = new vscode.MarkdownString('Read from I2C device');
        completions.push(i2cRead);

        // SPI
        const spiOpen = new vscode.CompletionItem('SPI OPEN', vscode.CompletionItemKind.Function);
        spiOpen.insertText = new vscode.SnippetString('SPI OPEN ${1:speed}, ${2:mode}, ${3:bits}');
        spiOpen.documentation = new vscode.MarkdownString('Open SPI bus');
        completions.push(spiOpen);

        const spiWrite = new vscode.CompletionItem('SPI WRITE', vscode.CompletionItemKind.Function);
        spiWrite.insertText = new vscode.SnippetString('SPI WRITE ${1:count}, ${2:data}');
        spiWrite.documentation = new vscode.MarkdownString('Write to SPI device');
        completions.push(spiWrite);

        // ADC
        const adcItem = new vscode.CompletionItem('ADC', vscode.CompletionItemKind.Function);
        adcItem.insertText = new vscode.SnippetString('ADC(${1:channel})');
        adcItem.documentation = new vscode.MarkdownString('Read analog-to-digital converter (returns 0-4095)');
        completions.push(adcItem);

        // SETTICK
        const settickItem = new vscode.CompletionItem('SETTICK', vscode.CompletionItemKind.Function);
        settickItem.insertText = new vscode.SnippetString('SETTICK ${1:period}, ${2:SubName}');
        settickItem.documentation = new vscode.MarkdownString('Set periodic interrupt (period in ms)');
        completions.push(settickItem);
    }

    private addGraphicsCompletions(completions: vscode.CompletionItem[]): void {
        // CLS
        const clsItem = new vscode.CompletionItem('CLS', vscode.CompletionItemKind.Function);
        clsItem.documentation = new vscode.MarkdownString('Clear screen');
        completions.push(clsItem);

        // PIXEL
        const pixelItem = new vscode.CompletionItem('PIXEL', vscode.CompletionItemKind.Function);
        pixelItem.insertText = new vscode.SnippetString('PIXEL ${1:x}, ${2:y}, ${3:color}');
        pixelItem.documentation = new vscode.MarkdownString('Draw a pixel at (x, y)');
        completions.push(pixelItem);

        // LINE
        const lineItem = new vscode.CompletionItem('LINE', vscode.CompletionItemKind.Function);
        lineItem.insertText = new vscode.SnippetString('LINE ${1:x1}, ${2:y1}, ${3:x2}, ${4:y2}, ${5:width}, ${6:color}');
        lineItem.documentation = new vscode.MarkdownString('Draw a line from (x1,y1) to (x2,y2)');
        completions.push(lineItem);

        // BOX
        const boxItem = new vscode.CompletionItem('BOX', vscode.CompletionItemKind.Function);
        boxItem.insertText = new vscode.SnippetString('BOX ${1:x}, ${2:y}, ${3:width}, ${4:height}, ${5:line_width}, ${6:color}, ${7:fill_color}');
        boxItem.documentation = new vscode.MarkdownString('Draw a rectangle');
        completions.push(boxItem);

        // CIRCLE
        const circleItem = new vscode.CompletionItem('CIRCLE', vscode.CompletionItemKind.Function);
        circleItem.insertText = new vscode.SnippetString('CIRCLE ${1:x}, ${2:y}, ${3:radius}, ${4:line_width}, ${5:color}, ${6:fill_color}');
        circleItem.documentation = new vscode.MarkdownString('Draw a circle');
        completions.push(circleItem);

        // TEXT
        const textItem = new vscode.CompletionItem('TEXT', vscode.CompletionItemKind.Function);
        textItem.insertText = new vscode.SnippetString('TEXT ${1:x}, ${2:y}, "${3:text}", "${4:align}", ${5:font}, ${6:color}');
        textItem.documentation = new vscode.MarkdownString('Display text on screen');
        completions.push(textItem);

        // COLOUR / COLOR
        const colourItem = new vscode.CompletionItem('COLOUR', vscode.CompletionItemKind.Function);
        colourItem.insertText = new vscode.SnippetString('COLOUR ${1:red}, ${2:green}, ${3:blue}');
        colourItem.documentation = new vscode.MarkdownString('Set drawing color (RGB 0-255)');
        completions.push(colourItem);

        const colorItem = new vscode.CompletionItem('COLOR', vscode.CompletionItemKind.Function);
        colorItem.insertText = new vscode.SnippetString('COLOR ${1:red}, ${2:green}, ${3:blue}');
        colorItem.documentation = new vscode.MarkdownString('Set drawing color (RGB 0-255)');
        completions.push(colorItem);
    }

    private addWiFiCompletions(completions: vscode.CompletionItem[]): void {
        // WEB
        const webItem = new vscode.CompletionItem('WEB', vscode.CompletionItemKind.Function);
        webItem.insertText = new vscode.SnippetString('WEB ${1|OPEN CLIENT,OPEN SERVER,OPEN UDP,CLOSE,TRANSMIT|}');
        webItem.documentation = new vscode.MarkdownString('WiFi/Web commands for WebMite\n\n- OPEN CLIENT: Connect as TCP client\n- OPEN SERVER: Start TCP server\n- OPEN UDP: Open UDP socket\n- CLOSE: Close connection\n- TRANSMIT: Send data');
        completions.push(webItem);

        // WEB SERVER
        const webServerItem = new vscode.CompletionItem('WEB OPEN SERVER', vscode.CompletionItemKind.Function);
        webServerItem.insertText = new vscode.SnippetString('WEB OPEN SERVER ${1:port}');
        webServerItem.documentation = new vscode.MarkdownString('Start a web server on specified port');
        completions.push(webServerItem);

        // TFTP
        const tftpItem = new vscode.CompletionItem('TFTP', vscode.CompletionItemKind.Function);
        tftpItem.insertText = new vscode.SnippetString('TFTP ${1|GET,PUT|} "${2:filename}"');
        tftpItem.documentation = new vscode.MarkdownString('Transfer files via TFTP\n\n- GET: Download file\n- PUT: Upload file');
        completions.push(tftpItem);

        // NTP
        const ntpItem = new vscode.CompletionItem('NTP', vscode.CompletionItemKind.Function);
        ntpItem.insertText = new vscode.SnippetString('NTP');
        ntpItem.documentation = new vscode.MarkdownString('Get time from NTP server');
        completions.push(ntpItem);

        // EMAIL
        const emailItem = new vscode.CompletionItem('EMAIL', vscode.CompletionItemKind.Function);
        emailItem.insertText = new vscode.SnippetString('EMAIL "${1:to}", "${2:subject}", "${3:message}"');
        emailItem.documentation = new vscode.MarkdownString('Send email via SMTP');
        completions.push(emailItem);
    }

    private addIOCompletions(completions: vscode.CompletionItem[]): void {
        // PRINT
        const printItem = new vscode.CompletionItem('PRINT', vscode.CompletionItemKind.Function);
        printItem.insertText = new vscode.SnippetString('PRINT ${1:value}');
        printItem.documentation = new vscode.MarkdownString('Output to console');
        completions.push(printItem);

        // INPUT
        const inputItem = new vscode.CompletionItem('INPUT', vscode.CompletionItemKind.Function);
        inputItem.insertText = new vscode.SnippetString('INPUT "${1:prompt}", ${2:variable}');
        inputItem.documentation = new vscode.MarkdownString('Read input from user');
        completions.push(inputItem);

        // OPEN
        const openItem = new vscode.CompletionItem('OPEN', vscode.CompletionItemKind.Function);
        openItem.insertText = new vscode.SnippetString('OPEN "${1:filename}" FOR ${2|INPUT,OUTPUT,APPEND|} AS #${3:1}');
        openItem.documentation = new vscode.MarkdownString('Open a file');
        completions.push(openItem);

        // CLOSE
        const closeItem = new vscode.CompletionItem('CLOSE', vscode.CompletionItemKind.Function);
        closeItem.insertText = new vscode.SnippetString('CLOSE #${1:1}');
        closeItem.documentation = new vscode.MarkdownString('Close a file');
        completions.push(closeItem);
    }
}
