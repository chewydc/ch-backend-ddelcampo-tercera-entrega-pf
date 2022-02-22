//-------------------------------------------------------------------
// PROYECTO FINAL
// Fecha de Tercera Entrega: 15-02-22
// Alumno: Damian del Campo
//-------------------------------------------------------------------
import fs from 'fs';
import pinoms from 'pino-multi-stream';

let  prettyStream = pinoms.prettyStream()
let streams = [
    {stream: prettyStream },
    {level: 'warn', stream: fs.createWriteStream('./src/logs/logs.log') },
    {level: 'error', stream: fs.createWriteStream('./src/logs/logs.log') },
    {level: 'fatal', stream: fs.createWriteStream('./src/logs/logs.log') }
]
let logger = pinoms({streams: streams})
export default logger
