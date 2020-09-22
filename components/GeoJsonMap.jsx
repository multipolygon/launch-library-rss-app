/* global process URL */

import Paper from '@material-ui/core/Paper';
import { useRef, useEffect, useCallback } from 'react';

export default function GeoJsonMap({ geo }) {
    const lMap = useRef();
    const geoBaseLayer = useRef();

    const drawMap = useCallback((container) => {
        if (
            container !== null &&
            typeof window === 'object' &&
            typeof window.L === 'object' &&
            !lMap.current &&
            !geoBaseLayer.current
        ) {
            const osmBaseLayer = window.L.tileLayer(
                `//${new URL(process.env.OSM_HOST).host}/{z}/{x}/{y}.png`,
                {
                    attribution:
                        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
                },
            );

            const thuderforestBaseLayer = window.L.tileLayer(
                `https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=${process.env.TF_API_KEY}`,
                {
                    attribution:
                        '<a href="https://www.thunderforest.com/maps/landscape/">thunderforest.com</a>',
                },
            );

            const baseLayers = {
                Streetmap: osmBaseLayer,
                Landscape: thuderforestBaseLayer,
            };

            const featureLayers = {};

            geoBaseLayer.current = window.L.markerClusterGroup({
                showCoverageOnHover: false,
                removeOutsideVisibleBounds: true,
                animate: false,
                animateAddingMarkers: false,
                chunkedLoading: true,
                zoomToBoundsOnClick: true,
            });

            geoBaseLayer.current.on('clusterclick', (e) => {
                e.layer.zoomToBounds({ padding: [20, 20], animate: true });
            });

            window.L.layerGroup();

            featureLayers.Geo = geoBaseLayer.current;

            lMap.current = window.L.map(container, {
                center: [0, 0],
                zoom: 1,
                scrollWheelZoom: true,
                fullscreenControl: {
                    pseudoFullscreen: true,
                },
                layers: [osmBaseLayer, ...Object.values(featureLayers)],
            });

            window.L.control
                .layers(baseLayers, featureLayers, { autoZIndex: false, hideSingleBase: true })
                .addTo(lMap.current);
        }
    }, []);

    useEffect(() => {
        if (
            typeof window === 'object' &&
            typeof window.L === 'object' &&
            geoBaseLayer.current &&
            lMap.current
        ) {
            geoBaseLayer.current.clearLayers();

            if (geo && geo.type && geo.type === 'FeatureCollection' && geo.features.length > 0) {
                const geoLayer = window.L.geoJSON(geo, {
                    pointToLayer: (feature, latlng) => {
                        return window.L.circleMarker(latlng, {
                            radius: 8,
                            weight: 5,
                            color: '#00f',
                            opacity: 0.2,
                            fill: true,
                            fillOpacity: 1,
                        });
                    },
                    style: {
                        fillOpacity: 0.6,
                    },
                    onEachFeature: ({ properties }, featureLayer) => {
                        featureLayer.bindPopup(
                            () =>
                                `<a href="${properties.url}">
                                    ${properties.date}
                                    <br>
                                    ${properties.title}
                                    ${
                                        properties.image
                                            ? `<br /><img src="${properties.image}" />`
                                            : ''
                                    }
                                 </a>`,
                            {
                                autoPan: true,
                                autoPanPadding: [40, 10],
                                closeButton: false,
                                closeOnEscapeKey: true,
                                closeOnClick: true,
                                minWidth: 160,
                                minHeight: 160,
                            },
                        );
                    },
                });

                geoBaseLayer.current.addLayer(geoLayer);

                lMap.current.fitBounds(geoLayer.getBounds(), {
                    animate: true,
                    padding: [10, 10],
                    maxZoom: 6,
                });
            }
        }
    }, [geo, geoBaseLayer.current, lMap.current]);

    // Note, minHeight must be bigger than marker icon popup balloon.
    return <Paper ref={drawMap} elevation={1} style={{ height: '25vh', minHeight: '220px' }} />;
}
