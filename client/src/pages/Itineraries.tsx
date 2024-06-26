import {useContext, useEffect, useState} from "react";
import api from "../helper/api.ts";
import map, {Station} from "../helper/map.ts";
import {toast} from "react-toastify";
import Spinner from "../components/Spinner.tsx";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {LatLngExpression} from "leaflet";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../context/AuthContext.tsx";

const Itineraries = () => {
    const [stations, setStations] = useState<Station[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const {login, logout, isConnected} = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api("POST", "verify")
                .then((response) => {
                    login(response.utilisateur.identifiant)
                })
                .catch(error => {
                    // Le token ne correspond pas à un utilisateur connecté ou une erreur est survenue
                    logout()
                    navigate("/")
                    console.error(error);
                })
        } else {
            logout()
            navigate("/")
        }
    }, [isConnected, navigate, login, logout]);

    useEffect(() => {
        api("GET", "stations").then(stations => {
            setStations(stations as Station[]);
        }).catch((err) => {
            toast.error(err.message, {
                position: "bottom-center"
            })
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);

    if (isLoading) {
        return (
            <>
                <p>Les stations sont en cours de chargement, veuillez patienter</p>
                <Spinner/>
            </>
        );
    }

    if (stations.length === 0) {
        return <p>Il n'y a pas de stations disponibles</p>;
    }

    return (
        <div className="flex justify-center flex-col items-center">
            <h1 className="text-sm font-bold mb-2">Les stations disponibles sont affichées sur la carte : </h1>
            <MapContainer id="map-all-stations" center={map.getCenterStations(stations) as LatLngExpression} zoom={12}
                          scrollWheelZoom={false} preferCanvas={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {stations.map((station, index) => {
                    if (station.coordonnees_geo) {
                        return (
                            <Marker
                                key={`${station.stationcode}-${index}`}
                                position={[station.coordonnees_geo.lat, station.coordonnees_geo.lon]}
                            >
                                <Popup>
                                    <p>Nom de la station : {station.name}</p>
                                    <p>Capacité : {station.capacity}</p>
                                    <p>Nombre de vélo disponible : {station.numbikesavailable}</p>
                                    <p>Capacité de rangement disponible : {station.numdocksavailable}</p>
                                </Popup>
                            </Marker>
                        );
                    } else {
                        return null;
                    }
                })}
            </MapContainer>
        </div>
    )
}

export default Itineraries;