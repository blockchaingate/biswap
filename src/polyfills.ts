import * as buffer from 'buffer';
import * as process from 'process';

(window as any).global = window;
(window as any).global.Buffer = (window as any).global.Buffer || buffer.Buffer;
(window as any).global.process = process;