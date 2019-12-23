#!/bin/bash
set -e

node ./scripts/gsheetstojson.js '1z5GaDeDu2Ei_pCEFpFWSS53NZSmseBdDXuadUPh9qWE' 1547075518 'festival/events' 'festival'
node ./scripts/gsheetstojson.js '12vIWrL2DnrfRlEZ23PFwv4sJO-rGtbD95WWsjirNqTk' 1242995252 'festival/speakers'