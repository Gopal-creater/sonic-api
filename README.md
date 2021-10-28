# Sonic Data Backend

Development work related to Sonic Data portal backend

## Available Scripts

In the project directory, you can run:

### `npm start`
Runs the app in development environmen without watch mode

### `npm run start:dev`
Runs the app in development environment with watch mode

### `npm run start:staging`
Runs the app in staging environment.

### `npm run start:prod`
Runs the app in production environment with NODE_ENV=production.

### `Using pm2`
Runs the app in specific environment with PM2 process manager.
```sh
$ pm2 start npm --name "sonic stream reader" -- run "start:prod"
```

# Env Files To Override
In .env.override OR in command line
```.env.override
BINARY_PATH=/home/ubuntu/code/Sonic-Radio-StreamReader/bin/
```
To override more env variables, please check the variable name in .env or .env.staging file

# Thirdparty library to work with encode / decode
* ffmpeg
* libsndfile1-dev
* zita-resampler
* libfftw3-dev
<br/>
We Can install all these library using apt get as follows
```sh 
$ sudo apt install ffmpeg libsndfile1-dev zita-resampler libfftw3-dev
```
# For More
see the package.json file :)
