/* global process */
/* eslint-disable no-alert */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import humanize from 'underscore.string/humanize';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import _isFinite from 'lodash/isFinite';
import DialogActions from '@material-ui/core/DialogActions';

export default function LocationFormDialog({
    open,
    setOpen,
    title = 'Location',
    description,
    onSubmit,
    submitButtonText = 'Submit',
    coord,
}) {
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');

    const mapMarker = useRef(null);

    useEffect(() => {
        if (coord) {
            setLat(coord.lat);
            setLng(coord.lng);
        }
    }, [coord]);

    const isFloat = (n) => _isFinite(parseFloat(n));

    const isValidLat = useMemo(() => isFloat(lat) && lat >= -90 && lat <= 90, [lat]);

    const isValidLng = useMemo(() => isFloat(lng) && lng >= -180 && lng <= 180, [lng]);

    const setLatLng = (latLng) => {
        setLat(latLng.lat.toFixed(3));
        setLng(latLng.lng.toFixed(3));
    };

    const markerMapContainerRef = useCallback((container) => {
        if (
            container !== null &&
            mapMarker.current === null &&
            typeof window === 'object' &&
            typeof window.L === 'object'
        ) {
            const osmBaseLayer = window.L.tileLayer(
                `//${new URL(process.env.OSM_HOST).host}/{z}/{x}/{y}.png`,
                {
                    attribution:
                        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
                },
            );

            const center = [lat || -28.076, lng || 134.003];

            const lMap = window.L.map(container, {
                center,
                zoom: 1,
                scrollWheelZoom: true,
                layers: [osmBaseLayer],
            });

            const divIcon = window.L.divIcon({
                html: '',
                className: 'mapicon',
                iconSize: [20, 20],
            });

            const marker = window.L.marker(center, {
                icon: divIcon,
                draggable: true,
                autoPan: true,
                autoPanPadding: [10, 10],
            })
                .addTo(lMap)
                .on('moveend', (e) => {
                    setLatLng(e.target.getLatLng().wrap());
                });

            mapMarker.current = marker;

            const CustomControl = window.L.Control.extend({
                onAdd: () => {
                    const div = window.L.DomUtil.create('button');
                    div.innerHTML = '&#127968;';
                    div.style.height = '30px';
                    div.style.width = '30px';
                    div.style.backgroundColor = '#FFF';
                    div.style.fontWeight = 'bold';
                    div.onclick = () => {
                        lMap.locate({ setView: false });
                    };
                    return div;
                },
                onRemove: () => {},
            });

            new CustomControl({ position: 'topright' }).addTo(lMap);

            lMap.on('locationfound', (e) => setLatLng(e.latlng));
        }
    }, []);

    useEffect(() => {
        if (mapMarker.current && isValidLat && isValidLng) {
            mapMarker.current.setLatLng([parseFloat(lat), parseFloat(lng)]);
        }
    }, [lat, lng]);

    return (
        <>
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{humanize(title)}</DialogTitle>

                <DialogContent>
                    {description && (
                        <Box mb={3}>
                            <Typography variant="body1">{description}</Typography>
                        </Box>
                    )}

                    <Box
                        mt={0}
                        component={Paper}
                        elevation={1}
                        style={{ height: '160px' }}
                        ref={markerMapContainerRef}
                    />

                    <Box mt={3}>
                        <TextField
                            label="Latitude"
                            type="text"
                            value={lat}
                            onChange={(e) => setLat(e.target.value)}
                            error={!isValidLat}
                            variant="outlined"
                            size="small"
                            fullWidth
                        />
                    </Box>

                    <Box mt={3}>
                        <TextField
                            label="Longitude"
                            type="text"
                            value={lng}
                            onChange={(e) => setLng(e.target.value)}
                            error={!isValidLng}
                            variant="outlined"
                            size="small"
                            fullWidth
                        />
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>{' '}
                    <Button
                        disabled={!isValidLat || !isValidLng}
                        onClick={() => onSubmit({ lat, lng })}
                    >
                        {submitButtonText}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
