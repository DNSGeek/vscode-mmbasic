' MMBasic Serial Communication Example
' This example demonstrates basic I/O and hardware control

OPTION BASE 1
OPTION EXPLICIT

' Pin definitions
CONST LED_PIN = 13
CONST BUTTON_PIN = 2

' Variables
DIM counter% AS INTEGER
DIM button_state% AS INTEGER

'============================================
' Initialize Hardware
'============================================
SUB Init()
  SETPIN LED_PIN, DOUT
  SETPIN BUTTON_PIN, DIN
  PIN(LED_PIN) = 0
  PRINT "Hardware initialized"
  PRINT "LED on pin "; LED_PIN
  PRINT "Button on pin "; BUTTON_PIN
END SUB

'============================================
' Blink LED
'============================================
SUB Blink(times%, delay_ms%)
  LOCAL i%
  FOR i% = 1 TO times%
    PIN(LED_PIN) = 1
    PAUSE delay_ms%
    PIN(LED_PIN) = 0
    PAUSE delay_ms%
  NEXT i%
END SUB

'============================================
' Main Program
'============================================
CLS
PRINT "MMBasic Example Program"
PRINT STRING$(40, "=")
PRINT

Init()

' Welcome blink
Blink(3, 200)

PRINT
PRINT "Press Ctrl+C to stop"
PRINT

' Main loop
counter% = 0
DO
  counter% = counter% + 1
  
  ' Read button
  button_state% = PIN(BUTTON_PIN)
  
  IF button_state% = 1 THEN
    PRINT "Button pressed! Count: "; counter%
    Blink(1, 100)
  ENDIF
  
  ' Print status every 100 loops
  IF counter% MOD 100 = 0 THEN
    PRINT "Running... Loop: "; counter%
  ENDIF
  
  PAUSE 10
LOOP
