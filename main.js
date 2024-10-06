let characters = {}
let markers = []
let markersVisible = true
let places = {}
let otherPlacesVisible = false
let placeMarkers = []
let gilbPath = {}
let curvePath = []
let gilbPathVisible = true

import { createdMap, addCredits } from "./map-creation.js"
import { pathOptions } from "./icons.js"
import { createPlaceMarker, createMarker, createCountryInfo } from "./markers.js"


const map = createdMap
addCredits(map)

const style = (feature) => {
    return { color: feature.properties.fill }
}

const showInfo = (feature) => {
    if (feature.properties) {
        createCountryInfo(feature.properties, map)
    }
}

window.switchCharsLocations = () => {
    markers.forEach((marker) => {
        markersVisible ? map.removeLayer(marker) : marker.addTo(map)
    })
    document.getElementById('houses').style.color = !markersVisible? 'gold' : 'black'
    markersVisible = !markersVisible
}

window.switchGilbertsPath = () => {
    gilbPathVisible ? map.removeLayer(gilbPath) : gilbPath.addTo(map)
    document.getElementById('route').style.color = !gilbPathVisible? 'gold' : 'black'
    gilbPathVisible = !gilbPathVisible
}

window.switchOtherPlaces = () => {
    placeMarkers.forEach((marker) => {
        otherPlacesVisible ? map.removeLayer(marker) : marker.addTo(map)
    })
    document.getElementById('places').style.color = !otherPlacesVisible ? 'gold' : 'black'
    otherPlacesVisible = !otherPlacesVisible
}

window.backToDefaultView = function () {
    map.setView(defaultCoordinates, defaultZoom)
}

window.toggleMenu = function() {
    const header = document.getElementById('header')
    header.classList.toggle('menu-visible')
}


// Data loading
fetch("data/characters.json")
    .then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok")
        }
        return response.json()
    })
    .then((data) => {
        characters = data.characters
        characters.sort((a, b) => a.order - b.order)
        curvePath.push("M", characters[0].coordinates)
        characters.forEach((character, index) => {
            createMarker(character, markers, map)
            if (index > 0) {
                curvePath.push("L", character.coordinates)
            }
        })
        gilbPath = L.curve(curvePath, pathOptions).addTo(map)
    })
    .catch((error) => {
        console.error("There was a problem with the fetch operation:", error)
    })

fetch("data/map.geojson")
    .then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok")
        }
        return response.json()
    })
    .then((data) => {
        L.geoJSON(data, {
            style: style,
            onEachFeature: showInfo,
        }).addTo(map)
    })

fetch("data/places.json")
    .then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok")
        }
        return response.json()
    })
    .then((data) => {
        places = data.places
        places.forEach((place) => {
            createPlaceMarker(place, placeMarkers)
        })
    })
    .catch((error) => {
        console.error("There was a problem with the fetch operation:", error)
    })
