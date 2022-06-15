Inorder to use this module, make sure to install following,

For Mailing
$ npm install --save @nestjs-modules/mailer nodemailer handlebars
$ npm install --save-dev @types/nodemailer

For mjml templates
$ npm i --save-dev mjml @types/mjml
We need to convert all mjml files into bhs file, 
so inorder to convert mjml to hbs, please run  $ npm run build:mjml either by adding in package.json file as
"scripts":{
  "build:mjml": "node src/modules/mail/mjml/mjml.js",
}
OR
run node mjml.js directly

Since we are user mjml folder just to build hbs so we dont want it to copy into dist,
inorder to do this update tsconfig.json
  "exclude": [
    "src/modules/mail/mjml"
  ]
And update nest-cli.json as to include all hbs files into dist,
  "compilerOptions": {
    "assets": [
      { "include": "./modules/mail/templates/**/*","outDir": "dist/src", "watchAssets": true }    ]
  }
