# Wallbox Startup Process

1. Adressen von Config-File einlesen
2. Standard Abfrage
3. Event `UDP` mit type `FIRST_UPDATE` zeigt, dass Wallbox antwortet.
4. Listener auf `FIRST_UPDATE` schaltet diese Wallbox dann aus `ena 0`
5. (Wenn noch ein Auto eingesteckt ist, daten der letzten session holen und wieder aktivieren `ena 1`)
6. Dabei bei gestarteter Ladesession `carStartedCharging` event senden