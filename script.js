mapboxgl.accessToken = 'pk.eyJ1IjoiZ2VvY2FkZGVyIiwiYSI6ImNqanE2ejV1aTA3dXozcGxxaDRlcjVmN2wifQ.2Gpftu5ybKxj_MHfk56FLw';

// Initialize the map
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/geocadder/cjyn8e3553gj41cocjydmr8r5',
    center: [23.317155, 42.664602],
    zoom: 10
});

var marker;

// Add zoom controls
var nav = new mapboxgl.NavigationControl({ showCompass: false });
map.addControl(nav, 'bottom-right');

// Add a keyup event listener to our input element
document.getElementById('name-input').addEventListener("keyup", function (event) { searchAddress(event) });

// Search for an address with autocomplete
function searchAddress(event) {
    var input = event.target;
    var hugeList = document.getElementById('huge-list');
    // Minimum number of characters before we start to generate suggestions
    var min_characters = 0;

    if (!isNaN(input.value) || input.value.length < min_characters) {
        return;
    } else {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                var response = JSON.parse(xhttp.responseText);
                hugeList.innerHTML = "";
                response['candidates'].forEach(function (item) {
                    // Create a new <option> element.
                    var option = document.createElement('option');
                    option.value = item.address;
                    if (option.value === input.value) {
                        if (marker) {
                            marker.remove();
                        };
                        var popup = new mapboxgl.Popup({ className: 'popup-opened' })
                            .setHTML(item.address)
                        marker = new mapboxgl.Marker()
                            .setLngLat([item.location.x, item.location.y])
                            .setPopup(popup)
                            .addTo(map);
                        map.setCenter([item.location.x, item.location.y]);
                        map.setZoom(18);
                        console.log(marker.getElement())
                    }
                    hugeList.appendChild(option);
                });
            }
        };

        xhttp.open("GET", "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&singleLine=" + input.value + "&outFields=Match_addr,Addr_type", true);

        xhttp.send()
    }
}