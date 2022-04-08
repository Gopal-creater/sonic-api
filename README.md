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
$ pm2 start npm --name "sonic-api" -- run "start:prod" or "start:staging"
```

## Deployment
To deploy this project on aws ec2 instance

### Make a build
Since build process used high CPU its better to make a build in our local system and then only upload to instance
```bash
$ npm run build
```

### Push to github
Since we are using github as our code repository lets push it to github
```bash
$ git add .
$ git commit "<message>"
$ git push origin main or <anyotherbranch>
```

### SSH to instance
Lets SSH into the ec2 instance with address and pem file given to you

### Run the server
Inorder to run ther server in the instance lets consider the followings
#### First time
```bash
$ git clone <repositorypath>
$ cd <sourcefolder>
$ npm install
$ pm2 start npm --name "sonic-api" -- run "start:staging" // For production use "start:prod"
```

#### Updating or Restarting
```bash
$ cd <sourcefolder>
$ git pull origin <branchname>
$ npm install //Only run if there is any new packages added
$ pm2 restart "sonic-api"
```

# Env Files To Override
Create .env.override file OR in command line
```.env.override
BINARY_PATH=/home/ubuntu/code/Sonic-Radio-StreamReader/bin/
```
To override more env variables, please check the variable name in production.env or staging.env file

# Thirdparty library to work with encode / decode
* ffmpeg
* libsndfile1-dev
* zita-resampler
* libfftw3-dev

We Can install all these library using apt get as follows
```sh
$ sudo apt install ffmpeg libsndfile1-dev zita-resampler libfftw3-dev
```
# For More
see the package.json file :)
