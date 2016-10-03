'use strict';


const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('firebase');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});

firebase.initializeApp({
  serviceAccount: {
    'type': 'service_account',
    'project_id': 'bennygo-1475253959505',
    'private_key_id': '09546c9d9e5580afdd70f802a80ec73dd01eace9',
    'private_key': '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCpsibcVBWEGAm5\nmn4Cq8icyXNlyD9owpF/4OEOvYE6sHSchyAodNAU4sCWZ4PLm3x3KyF9/BPv8tQr\ndYQXoqDioxUcaIrUkt57rQzsuipwsC9lmZVTKulFmCXHCdmRlhiYBuCe8tyMipyi\noUvPB02iVnRk3V2QEtSpX0HmFAFODXqWmJdNZP7Pgxq/KW6P7E44aKsttD3kHCS1\nuMkHuk7sOQ0vUB6ugC5GgmCX5V4UmuSULCjwHOJ4j4fJYf02KFVHWbTBw/ej5nUR\nbIWqw88/HNbn10EeCdSLNX/PzHzcjKhhFeO8RyaVPr+DnCb+5h7fvUS+4/Vk7Fp+\nv1epPdLBAgMBAAECggEBAIL0X3biUKRapI6eAaZwCOWttKcUTJK8q+oCkct9RNAU\nwjjVMmTmGHo1rqejBJtIx1lzaGo/8ObX/xH2o1RWBVBAyBbfOlvnZ1gL6JB67it+\nW2VNi2XeFJzHWEfsewEV0q7nh8pB4x92DICYdtcybJ/dlf8MsZpwXbrDLyitwYAI\nNoYfNLu7HDTR3MBgxTuNPSBf+pVnhMrv/n4oGiMHapBfkhij/cyaGm/yR0bbJAJC\nNhxWBlraHSu7AJDBLUt8ppBU8F9uEgpXM/H2HvR7u3ffhyYu1V3qBfazrvXhIWku\noL9uQhIXNOL8noy9kSTSoE+19fuBwyNA9EmqaAG2zNECgYEA3bp04zTvZuJRkBVW\n8+6WqDy2bll8cmbA03YN/j6m2SyXPU/z8VG8qXQo46q/cim3uP6B67OQUQSlxmDR\nlVF/awoy0FZCc3D5V7BZZJ2JPTLa75eVvo9+/KBQttkRiKrZ8pNXzl110PLGrHz6\nE+arfgvyZMSit3T03Zqnz5KcGw0CgYEAw+zUXaFgYTv4RQmIbVDqYCCcgKPL3c0J\nEPFmFPhqh6SfJvWi9YM73NiP0z6PUZ3ycy5NdUqZJtO044A2zUHaSuDvBtvGL/QX\nzzwFp7E1ALXxnlBXj7lK0UXXNLisGy76zjtI4A2Di4gW6Rozjlowu1RCYqPlnsts\n256GNEedmYUCgYEAu2Uj9wc9MooifxDaDY3fPM8bLEZrPFEFtXK4PuH6p9/c7s/N\nD26ScfEfwdMEvNrvUOWhLnDzjtXLuc8IMxfPBct3yMauoNyhj/AWjUfrvpJloUtP\nHuAuZhqkPPVWsVgcnbzT4DDzKyaUrSFvRjSVShGUyn+6Oi0Z6tUT8QYq810CgYBk\nRmPyf9OaMF1CyDxA5rbt+ALhe/OtU3EecM50USgEwGaMRA/hZAdRYq1Jyq0DcrlR\n5hLSwxlbW+MqxMZHizq0NCdh9T2b8Wv2LpweVX3xHS3KfwgxkP4P2ZTpcNL1HrhS\nsNj9gy0eTsqbB0P3yYVDez52ybeN7EOMq7e4LiclGQKBgFjSXE2GeKSD4GYP0073\nU/E+lI1mYfeqBe72V27m0w2Rv/j+XWmHvjcchRlq8bUreXo9MyKV8zZLRkzlBDHI\n2NOM539QyxN1tV2Ots6jK0jNWuWAdkW0ioR40L3atE4YYzE4omNTaUfVcV6ilQzz\nkUQS8qCCiW3Zy73iQpdzpBV2\n-----END PRIVATE KEY-----\n',
    'client_email': 'bennygo-1475253959505@appspot.gserviceaccount.com',
    'client_id': '116485506355444762489',
    'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
    'token_uri': 'https://accounts.google.com/o/oauth2/token',
    'auth_provider_x509_cert_url': 'https://www.googleapis.com/oauth2/v1/certs',
    'client_x509_cert_url': 'https://www.googleapis.com/robot/v1/metadata/x509/bennygo-1475253959505%40appspot.gserviceaccount.com'
  },
  databaseURL: 'https://bennygo-1475253959505.firebaseio.com'
});
const db = firebase.database();
const gifRef = db.ref('gifs');


// gifRef.once('value', function(snapshot) {
//   console.log('heej');
//   console.log(snapshot.val());
// }, function(e){
//   console.log(e);
// });

const playersRef = db.ref('players');




//playersRef.child('gifsCaught').push().set(0);


const router = express.Router();

router.route('/user/:key')
  .get((req, res) => {
    const playerRef = db.ref(`players/${req.params.key}`);
    gifRef.once('value', function(gifs) {
      playerRef.once('value', function(snapshot) {
        if(snapshot.val()){
          res.json({
            key: req.params.key,
            data: snapshot.val(),
            allGifs: gifs.val()
          });
        }else{
          const player = playersRef.push({ nfOfCaught: 0 });
          res.json({
            key: player.key,
            data: snapshot.val(),
            allGifs: gifs.val()
          });
        }
      }, function(e){
        console.log(e);
      });
    }, function(e){
      console.log(e);
    });
  });

router.route('/catch/:gifId')
  .post((req, res) => {
    const playerRef = db.ref(`players/${req.query.key}`);
    const gifChild = playerRef.child('gifsCaught');
    const nfOfCaughtChild = playerRef.child('nfOfCaught');
    nfOfCaughtChild.once('value', function(caught){
      nfOfCaughtChild.set(caught.val() + 1);
      gifChild.child(req.params.gifId).set(1);

      res.json({ message: 'toppen!', gifsCaught: caught.val() + 1});
    });
  });

app.use('/api', router);

const server = app.listen(3334, function() {
    console.log('Listening on port %d', server.address().port);
});
