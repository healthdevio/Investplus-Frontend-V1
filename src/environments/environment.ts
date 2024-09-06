// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  /* production: false,

  url_api: "http://localhost:8080/api",
  userPoolId: "us-east-1_ec2OBxkjT",
  clientId: "69137gvu1cfd7r2gkg6fva0n77",

  region: "us-east-1",
  bucketRegion: "us-east-1",
  identityPoolId: "",
  rekognitionBucket: "rekognition-pics",
  albumName: "usercontent",
  ddbTableName: "LoginTrail",
  cognito_idp_endpoint: "",
  cognito_identity_endpoint: "",
  sts_endpoint: "",
  dynamodb_endpoint: "",
  s3_endpoint: "", */
  production: true,
  // url_api: " ://api.fcjinvest.com.br/api",
  url_api: "https://54.82.48.219:8080/api",
  // url_api: "http://localhost:8080/api",
  userPoolId: "us-east-2_GAF4pxPcD",
  clientId: "3ph8jpuh1f6maiuilank50gbfe",

  region: "us-east-2",
  bucketRegion: "us-east-2",
  identityPoolId: "",
  rekognitionBucket: "rekognition-pics",
  albumName: "usercontent",
  ddbTableName: "LoginTrail",
  cognito_idp_endpoint: "",
  cognito_identity_endpoint: "",
  sts_endpoint: "",
  dynamodb_endpoint: "",
  s3_endpoint: "",
};

// export const environment = {
//   production: true,

//   // ---------- Ambiente de Produção ----------
//   url_api: 'https://api.upangel.com.br/api',
//   userPoolId: 'us-east-1_dYGsLZwy7',
//   clientId: '4mm1fhdr3g1meqt3ouc2ohdq0a',

//   region: 'us-west-2',
//   bucketRegion: 'us-east-1',
//   identityPoolId: 'us-west-2:1fdc9013-6842-4f51-8950-6a2132b3856b',
//   rekognitionBucket: 'rekognition-pics',
//   albumName: 'usercontent',
//   ddbTableName: 'LoginTrail',
//   cognito_idp_endpoint: '',
//   cognito_identity_endpoint: '',
//   sts_endpoint: '',
//   dynamodb_endpoint: '',
//   s3_endpoint: ''
// };
