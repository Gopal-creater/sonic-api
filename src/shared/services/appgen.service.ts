import { Injectable } from '@nestjs/common';

import * as moment from 'moment';
import 'moment-timezone';
import axios from 'axios';

@Injectable()
export class AppgenService {
  private partnerId = process.env.APPGEN_PARTNER_ID;
  private apiKey = process.env.APPGEN_API_KEY;

  // Convert the server time to destination timezone and return the number of seconds past in the dest time.
  private getProgramTimeInSecs(srvDateTime: Date, destTZ: string): number {
    const destDatestring: string = moment(srvDateTime)
      .tz(destTZ)
      .format();
    const destDateTime: Date = new Date(destDatestring);
    return (
      destDateTime.getHours() * 3600 +
      destDateTime.getMinutes() * 60 +
      destDateTime.getSeconds()
    );
  }

  appGenGetRadioProgramming(appGenStationId: string, detectedAt: Date) {
    const endpoint =
      'https://partners.mytuner.mobi/api/v1/' +
      this.partnerId +
      '/radio-programming?station_id=' +
      appGenStationId;

    return axios
      .get(endpoint, {
        headers: {
          Authorization: 'APikey ' + this.apiKey,
          Accept: 'application/json',
        },
      })
      .then(res => {
        console.log('appgen: api response status: ', res.status);

        let progs = res.data;
        let secs = this.getProgramTimeInSecs(detectedAt, progs.timezone);
        let day = moment.weekdaysShort(detectedAt.getDay()).toLowerCase(); // we need day as in 'mon'
        let title = '', subtitle = '';
				
				console.log('appgen: finding prog at secs:', secs, ' on day:', day);

        for (const program of progs.radio_programming) {
          let res = false;
          if (secs >= program.start_time && secs <= program.end_time) {
            if (program.mon && day == 'mon') res = true;
            if (program.tue && day == 'tue') res = true;
            if (program.wed && day == 'wed') res = true;
            if (program.thu && day == 'thu') res = true;
            if (program.fri && day == 'fri') res = true;
            if (program.sat && day == 'sat') res = true;
            if (program.sun && day == 'sun') res = true;
          }
          if (res) {
            title = program.title;
            subtitle = program.subtitle;
						break;
          }
        }

        return { title: title, subtitle: subtitle };
      });
  }
}
