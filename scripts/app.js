'use strict';

//let globalMarkers = [];
const URL = 'https://richardsoderman.se/bennygo';
//const URL = 'http://localhost:3334';


const initMap = (pos) => {
  const mapOptions = {
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: new google.maps.LatLng(56.675750, 16.337335),
    scrollwheel: false,
    draggable: false,
    disableDefaultUI: false,
    zoomControl: false,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
    styles: [{'featureType':'administrative','elementType':'labels.text.fill','stylers':[{'color':'#444444'}]},{'featureType':'landscape','elementType':'all','stylers':[{'color':'#f2f2f2'}]},{'featureType':'poi','elementType':'all','stylers':[{'visibility':'off'}]},{'featureType':'road','elementType':'all','stylers':[{'saturation':-100},{'lightness':45}]},{'featureType':'road.highway','elementType':'all','stylers':[{'visibility':'simplified'}]},{'featureType':'road.arterial','elementType':'labels.icon','stylers':[{'visibility':'off'}]},{'featureType':'transit','elementType':'all','stylers':[{'visibility':'off'}]},{'featureType':'water','elementType':'all','stylers':[{'color':'#00FFFF'},{'visibility':'on'}]}]
  };
  return new google.maps.Map(document.getElementById('map'), mapOptions);
};

const getSavedKey = () => {
  return localStorage.getItem('key');
};

const saveUserKey = (key) => {
  localStorage.setItem('key', key);
};


const placeMarkers = (map, markers) => {
  return markers.map((marker) => {
    const myMarker = new google.maps.Marker({
     map: map,
     markerId: marker.markerId,
     draggable: false,
     optimized: marker.optimized,
     animation: google.maps.Animation.DROP,
     position: new google.maps.LatLng(marker.lat, marker.lng),
     icon: new google.maps.MarkerImage(
      marker.url, null, null,  null,
      new google.maps.Size(marker.width, marker.height))
    });
    return myMarker;
  });
};

const getMyPosition = () =>
  new Promise((resolve, reject) => {
    // Try HTML5 geolocation.
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        resolve(pos);
      }, function(e) {
        reject(e);
      });
    } else {
      // Browser doesn't support Geolocation
      reject(false);
    }
  });


const getUserData = (action, url) =>
  new Promise(function(resolve, reject) {
    const request = new XMLHttpRequest(null);
    request.open(action, url, true);
    request.addEventListener('load', function(event) {
      resolve(JSON.parse(this.response));
    });
    request.addEventListener('error', () => {
      reject('connection error');
    });
    request.addEventListener('timeout', () => {
      reject('timeout');
    });
    request.send();
});


const removeMarkerFromMarkers = () => {

};

const markerClick = (event, marker, circle, latLng, nav) => {
  if(circle.contains(latLng)){
    const userKey = getSavedKey();
    getUserData('POST', `${URL}/api/catch/${marker.markerId}?key=${userKey}`)
      .then(result => {
        marker.setMap(null);
        nav.$data.nrOfCaught += 1;
      })
      .catch(e => {
        console.log(e);
      });
  }
};

const placeMyPosition = (map, pos) =>{
  const myMarker = new google.maps.Marker({
    map: map,
    draggable: false,
    optimized: true,
    position: new google.maps.LatLng(pos.lat, pos.lng)
  });

  const circle = new google.maps.Circle({
    map: map,
    draggable: false,
    radius: 40,
    fillColor: '#00FFFF',
    strokeColor: '#00FFFF'
  });
  circle.bindTo('center', myMarker, 'position');

  myMarker.addListener('click', (e) => {
    console.log('This is my position');
  });

  return [myMarker, circle];
};

const addMarkerClick = (marker, circle, lat, lng, nav) => {
  return google.maps.event.addListener(marker, 'click', (e) => {
    markerClick(e, marker, circle, new google.maps.LatLng(lat, lng), nav);
  });
};
const removeMarkerClick = (listener) => {
  google.maps.event.removeListener(listener);
};


const updatePosition = (map, myMarker, myCircle, markers, markerListeners, nav) => {
  return setInterval(() => {
    getMyPosition()
      .then(pos => {
        myMarker.setMap(null);
        myCircle.setMap(null);
        markerListeners.map(listener => {
          removeMarkerClick(listener);
        });
        const [marker, circle] = placeMyPosition(map, pos);
        myMarker = marker;
        myCircle = circle;
        markerListeners = markers.map(m => {
          return addMarkerClick(m, myCircle, m.position.lat(), m.position.lng(), nav);
        });
        map.setCenter(new google.maps.LatLng(pos.lat, pos.lng));
      });
  }, 5000);
};

const objectToArray = (o) => {
  const array = [];
  for (let variable in o) {
    if (o.hasOwnProperty(variable)) {
      o[variable].markerId = variable;
      array.push(o[variable]);
    }
  }
  return array;
};

const objectNamesToArray = (o) => {
  const array = [];
  for (let variable in o) {
    if (o.hasOwnProperty(variable)) {
      array.push(variable);
    }
  }
  return array;
};


const removeCaughtMarkers = (caught, gifs) => {
  const g = objectNamesToArray(caught);
  return gifs.filter(name => {
    for (let i = 0; i < g.length; i++) {
      if(g[i] === name.markerId){
        return false;
      }
    }
    return true;
  });
};


const vueComponents = () => {
  Vue.component('info', {
    template: '#modal-template-intro',
    props: {
      display: {
        type: Boolean,
        required: true,
        twoWay: true
      }
    }
  });

  Vue.component('modal', {
    template: '#modal-template',
    props: {
      show: {
        type: Boolean,
        required: true,
        twoWay: true
      },
      gifs: {
        type: Object,
        required: true,
        twoWay: true
      },
      gifscaught: {
        type: Number,
        required: true,
        twoWay: true
      },
      totalgifs: {
        type: Number,
        required: true,
        twoWay: true
      }
    }
  });
};
const vueNav = (nrOfCaught) => {
  return new Vue({
    el: '#nav',
    data: {
      nrOfCaught: nrOfCaught,
      totalGifs: 0,
      showGallery: false,
      gifsCaught: {},
      showIntro: false
    },
    methods: {
      galleryClick: function(){
        const userKey = getSavedKey();
        getUserData('GET', `${URL}/api/user/${userKey}`)
          .then(result => {
            this.$data.gifsCaught = result.data.gifsCaught ? result.data.gifsCaught : {};
            this.$data.nrOfCaught = result.data.nfOfCaught;
            this.$data.totalGifs = objectToArray(result.allGifs).length;
          })
          .catch(e => {

          });
        this.$data.showGallery = true;
      },

      galleryIntroClick: function(){
        this.$data.showIntro = true;
      }
    },
    attached: function(){

    }
  });
};

const init = () => {
  google.maps.Circle.prototype.contains = function(latLng) {
    return this.getBounds().contains(latLng) && google.maps.geometry.spherical.computeDistanceBetween(this.getCenter(), latLng) <= this.getRadius();
  };
  vueComponents();
  const map = initMap();
  const userKey = getSavedKey();

  getUserData('GET', `${URL}/api/user/${userKey}`)
    .then(result => {
      const nav = vueNav(result.data.nfOfCaught);
      if(!userKey){
        nav.$data.showIntro = true;
      }
      saveUserKey(result.key);


      let gifs = objectToArray(result.allGifs);
      if(result.data.hasOwnProperty('gifsCaught')){
        gifs = removeCaughtMarkers(result.data.gifsCaught, objectToArray(result.allGifs));
      }

      const myMarkers = placeMarkers(map, gifs);
      getMyPosition()
      .then(pos => {
        map.setCenter(new google.maps.LatLng(pos.lat, pos.lng));
        const [myMarker, circle] = placeMyPosition(map, pos);
        const markerListeners = myMarkers.map(marker => {
          return addMarkerClick(marker, circle, marker.position.lat(), marker.position.lng(), nav);
        });
        updatePosition(map, myMarker, circle, myMarkers, markerListeners, nav);
      });

  })
  .catch(e => {
    console.log(e);
  });
};




window.onload = init;
