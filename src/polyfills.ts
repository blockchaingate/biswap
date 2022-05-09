
import 'zone.js/dist/zone';  // Included with Angular CLI.
import { Buffer } from 'buffer';

(window as any).global = window;
global.Buffer = Buffer;
global.process = {
    env: { DEBUG: undefined },
    version: '',
    nextTick: require('next-tick'),
} as any;