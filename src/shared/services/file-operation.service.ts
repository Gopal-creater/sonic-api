import { Injectable } from '@nestjs/common';
import { exec, execSync } from 'child_process';
import * as fs from 'fs';
import * as readline from 'line-reader';
import * as readlineByline from 'readline';
import * as es from 'event-stream';


@Injectable()
export class FileOperationService {
  encodeFile(sonicEncodeCmd: string, outFilePath: string) {
    return new Promise((resolve, reject) => {
      try {
        execSync('bash ' + sonicEncodeCmd);
        resolve(outFilePath);
      } catch {
        reject({
          message:'Error encountered during encoding!'
        });
      }
    });
  }

  decodeFile(sonicDecodeCmd: string, logFilePath: string) {
    return new Promise((resolve, reject) => {
      try {
        // the result of this decoder binary invokation using a shellscript will be
        // in the log file (given as part of the commandline).
        execSync('bash ' + sonicDecodeCmd);
        
        // see if there is anything in the logile.
        var fileSizeInBytes = fs.statSync(logFilePath).size;
        if (fileSizeInBytes <= 0) {
          console.error('empty logfile while decoding. no key found!');
          reject({
            message:'Key not found'
          });
        }

        // read lines from the logfile. each line will be a detected key.
        readline.eachLine(logFilePath, function(line) {
          console.log('Decoder output line: ', line);
          const sonicKey = line?.split(': ')[1]?.trim()
          resolve({ sonicKey: sonicKey });          
          // we need only the first line from logfile. returning false stops further reading.
          return false; 
        });
      } catch(err) {
        console.error('Caught error while decodibng:', err);
        reject({
          message:'Error while decoding'
        });
      }      
    });    
  }

  decodeFileForMultipleKeys(sonicDecodeCmd: string, logFilePath: string):Promise<{sonicKeys:string[]}> {
    return new Promise((resolve, reject) => {
      try {
        // the result of this decoder binary invokation using a shellscript will be
        // in the log file (given as part of the commandline).
        execSync('bash ' + sonicDecodeCmd);
        
        // see if there is anything in the logfile.
        // var fileSizeInBytes = fs.statSync(logFilePath).size;
        // if (fileSizeInBytes <= 0) {
        //   console.error('empty logfile while decoding. no key found!');
        //   reject({
        //     message:'Key not found'
        //   });
        // }
        var sonicKeys:string[] = [];
        var lineReader = readlineByline.createInterface({
          input: fs.createReadStream(logFilePath)
        });
        
        lineReader.on('line', function (line) {
          console.log('Line from file:', line);
          const sonicKey = line?.split(': ')[1]?.trim()
          const isPresent = sonicKeys.find(key=>key==sonicKey)
          if(sonicKey && !isPresent){
            sonicKeys.push(sonicKey); //push each line in the file into the lineArray
          }
        });
        lineReader.on('close', function (line) {
          console.log("Finished");
          
          resolve({ sonicKeys: sonicKeys });
        });
        // // read each line in the logfile in order to return all the sonicKeys
        // var sonicKeys = [];
        // // create read stream for the output log file
        // var stream = fs.createReadStream(logFilePath).pipe(es.split()).pipe(es.mapSync(function (line) {
        //   stream.pause();//pause the readstream
        //   const isPresent = sonicKeys.find(key=>key==line)
        //   if(line && !isPresent){
        //     sonicKeys.push(line); //push each line in the file into the lineArray
        //   }
        //   stream.resume();//resume the readstream
        // })
        //   // return if there is an error 
        //   .on('error', function (err) {
        //     console.log('Error:', err);
        //   })
        //   .on('end', function () {
        //     resolve({ sonicKey: sonicKeys });
        //   })
        // );
      } catch(err) {
        console.error('Caught error while decodibng:', err);
        reject({
          message:'Error while decoding'
        });
      }      
    });    
  }
}