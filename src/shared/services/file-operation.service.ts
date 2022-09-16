import { Injectable } from '@nestjs/common';
import { exec, execSync } from 'child_process';
import * as appRootPath from 'app-root-path';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as path from 'path';
import * as readline from 'line-reader';
import * as readlineByline from 'readline';
import { IDecodeResponse } from '../interfaces/DecodeResponse.interface';
import { EncodeResponse } from 'src/api/sonickey/schemas/sonickey.schema';

@Injectable()
export class FileOperationService {
  encodeFile(
    sonicEncodeCmd: string,
    outFilePath: string,
    logFilePath?: string,
  ) {
    return new Promise((resolve, reject) => {
      try {
        console.log('sonicEncodeCmd', sonicEncodeCmd);
        execSync('bash ' + sonicEncodeCmd);

        // see if there is anything in the loFile.
        var fileSizeInBytes = fs.statSync(logFilePath).size;
        if (fileSizeInBytes <= 0) {
          console.error('empty logfile while encoding.');
          reject({
            message: 'No encode response found',
          });
        }

        //Read the txtfile synchronously
        let rawdata = fs.readFileSync(logFilePath).toString();
        let encodeResponse: EncodeResponse;
        try {
          encodeResponse = JSON.parse(rawdata);
        } catch (error) {
          console.log('error parsing decoded data', error);
        }

        console.log('encodeResponse', encodeResponse);

        //TODO Check if response json object has result = true
        //If result is false throw error
        if (!encodeResponse.result)
          reject({
            message: 'Error encountered during encoding from binary.!',
          });

        resolve(encodeResponse);
      } catch {
        reject({
          message: 'Error encountered during encoding!',
        });
      }
    });
  }

  decodeFile(
    sonicDecodeCmd: string,
    logFilePath: string,
  ): Promise<{ sonicKey: string }> {
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
            message: 'Key not found',
          });
        }

        // read lines from the logfile. each line will be a detected key.
        readline.eachLine(logFilePath, function(line) {
          console.log('Decoder output line: ', line);
          const sonicKey = line?.split(': ')[1]?.trim();
          resolve({ sonicKey: sonicKey });
          // we need only the first line from logfile. returning false stops further reading.
          return false;
        });
      } catch (err) {
        console.error('Caught error while decodibng:', err);
        reject({
          message: 'Error while decoding',
        });
      }
    });
  }

  decodeFileForMultipleKeys(
    sonicDecodeCmd: string,
    logFilePath: string,
  ): Promise<{ sonicKeys: IDecodeResponse[] }> {
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
        var decodeResponses: IDecodeResponse[] = [];
        let rawdata = fs.readFileSync(logFilePath, { encoding: 'utf8' });
        console.log('rawdata', rawdata);
        try {
          decodeResponses = JSON.parse(rawdata);
        } catch (error) {
          console.log('error parsing decoded data', error);
        }
        console.log('decodeResponses', decodeResponses);
        decodeResponses = _.unionBy(decodeResponses, 'sonicKey');
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
        resolve({ sonicKeys: decodeResponses });
      } catch (err) {
        console.error('Caught error while decodibng:', err);
        reject({
          message: err?.message || 'Error while decoding',
        });
      }
    });
  }
}
