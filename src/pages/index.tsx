'use client'

// Importación de módulos y estilos
import styles from '../styles/Home.module.scss'
import Image from 'next/image'
import { Roboto } from 'next/font/google'
import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { getData, getHourlyData } from '@/api/getData'; // Funciones para obtener datos

// Configuración de la fuente Roboto
const roboto = Roboto({
    weight: '400',
    subsets: ['latin'],
})

interface ErrorState {
    message: string;
}

// Componente principal Home
export default function Home() {

    // Estados para manejar los datos
    const [isMounted, setIsMounted] = useState(false);
    const [isCelsius, setIsCelsius] = useState(true);
    const [error, setError] = useState<ErrorState | null>(null); // Estado para almacenar el error
    const [inputLocation, setInputLocation] = useState('Málaga'); // Estado para almacenar la ubicación ingresada // Ubicación por defecto
    const [data, setData] = useState<WeatherData>(
        {
            coord: {
                lon: 0,
                lat: 0,
            },
            weather: [],
            base: "",
            main: {
                temp: 0,
                feels_like: 0,
                temp_min: 0,
                temp_max: 0,
                pressure: 0,
                humidity: 0,
                sea_level: 0,
                grnd_level: 0,
            },
            visibility: 0,
            wind: {
                speed: 0,
                deg: 0,
                gust: 0,
            },
            clouds: {
                all: 0,
            },
            dt: 0,
            sys: {
                type: 0,
                id: 0,
                country: "",
                sunrise: 0,
                sunset: 0,
            },
            timezone: 0,
            id: 0,
            name: "",
            cod: 0,
        }
    );
    const [hourlyData, setHourlyData] = useState<WeatherHourlyData>({
        cod: '',
        message: 0,
        cnt: 0,
        list: []
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputLocation(event.target.value);
    };

    // Funciones para obtener datos del clima actual y por hora
    const fetchData = async () => {
        try {
            const result = await getData(inputLocation); // Llama a la función para obtener los datos
            if (result.data.cod == 200) {
                setData(result.data); // Establece los datos en el estado del componente
                setError(null); // Limpia el estado de error si la solicitud tiene éxito
                console.log(result);
            } else {
                throw new Error('Ubicación no válida');
            }
        } catch (error) {
            setError({ message: 'Ubicación no válida.' }); // Establecer el error en el estado
            console.error('Error al obtener los datos:', error);
            console.log('Error establecido:', error); // Añadir esta línea para verificar si se establece el estado de error
        }
    };

    const fetchHourlyData = async () => {
        try {
            const result = await getHourlyData(inputLocation); // Llama a la función para obtener los datos
            if (result.data.cod == 200) {
                setHourlyData(result.data); // Establece los datos en el estado del componente
                setError(null); // Limpia el estado de error si la solicitud tiene éxito
                console.log(result);
            } else {
                throw new Error('Ubicación no válida');
            }
        } catch (error) {
            setError({ message: 'Ubicación no válida.' }); // Establecer el error en el estado
            console.error('Error al obtener los datos:', error);
            console.log('Error establecido:', error); // Añadir esta línea para verificar si se establece el estado de error
        }
    };

    // Efecto para establecer el estado inicial al montar el componente
    useEffect(() => {
        setIsMounted(true); // Indica que el componente está montado en el cliente
        const cookies = new Cookies();
        const initialIsCelsius = cookies.get('isCelsius');
        setIsCelsius(initialIsCelsius === true); // Establecer el estado basado en la cookie
    }, []);

    // Efectos para obtener datos al montar el componente
    useEffect(() => {
        fetchData(); // Invoca la función para obtener los datos al montar el componente en el cliente
    }, []);

    useEffect(() => {
        fetchHourlyData();
        console.log(hourlyData.list.slice(0, 6)) // Invoca la función para obtener los datos al montar el componente en el cliente
    }, []);

    // Funciones para cambiar entre Celsius y Fahrenheit y guardar la preferencia en cookies
    const handleCelsiusClick = (): void => {
        setIsCelsius(true);
        const cookies = new Cookies();
        cookies.set('isCelsius', 'true', { path: '/' });
    };

    const handleFahrenheitClick = (): void => {
        setIsCelsius(false);
        const cookies = new Cookies();
        cookies.set('isCelsius', 'false', { path: '/' });
    };


    // Funciones para convertir temperaturas
    function kelvinToCelsius(kelvin: number): number {
        return Number((kelvin - 273.15).toFixed(1));
    }

    function kelvinToFahrenheit(kelvin: number): number {
        const fahrenheit = (kelvin - 273.15) * (9 / 5) + 32;
        return Number(fahrenheit.toFixed(1));
    }

    // Funciones para obtener la hora en una zona horaria
    function getCurrentTimeInTimeZone(timezoneOffsetInSeconds: number): string {
        const now: Date = new Date();
        const timezoneOffsetInMilliseconds: number = timezoneOffsetInSeconds * 1000; // Convert to milliseconds
        const localTime: Date = new Date(now.getTime() + timezoneOffsetInMilliseconds);

        const hours: string = (localTime.getHours() < 10 ? '0' : '') + localTime.getHours();
        const minutes: string = (localTime.getMinutes() < 10 ? '0' : '') + localTime.getMinutes();

        return `${hours}:${minutes}`;
    }

    const handleSearch = () => {
        fetchData();
        fetchHourlyData();
    };

    // Renderizado condicional para mostrar el estado inicial al montar el componente
    if (!isMounted) {
        return null; // Renderiza un estado inicial mientras el componente se monta
    }


    return (
        <>
            <main className={`${styles.weatherApp} ${roboto.className}`}>
                <div className={styles.searchBar}>
                    <div className={styles.searchContainer}>
                        <input type="text"
                            value={inputLocation}
                            onChange={handleInputChange}
                            placeholder="Ingrese la ubicación"
                            className={`${styles.cssInput} ${styles.searchBox}`} />
                        <button
                            type="submit"
                            className={styles.searchButton}
                            onClick={handleSearch}>
                            <Image
                                src="/search.svg"
                                width={20}
                                height={20}
                                alt="Buscar"
                                unoptimized
                                className={styles.picture}
                            />
                        </button>
                    </div>

                    <div className={styles.buttonsBox}>
                        <a onClick={handleCelsiusClick} className={styles.myButton}>ºC</a>
                        <a onClick={handleFahrenheitClick} className={styles.myButton}>ºF</a>
                    </div>
                </div>
                {error ?
                    <div>Error: {error.message}</div>
                    :
                    <div className={styles.simpleDataBar}>
                        <div className={styles.overwiewData}>
                            <div className={styles.cityData}>
                                <h2 id="temperature">{isCelsius ? kelvinToCelsius(data.main.temp) : kelvinToFahrenheit(data.main.temp)}º</h2>
                                <div className={styles.nameAndTime}>
                                    <span>{data.name}</span>
                                    <span>{getCurrentTimeInTimeZone(data.timezone)}</span>
                                </div>
                            </div>
                            <div className={styles.forecastStatus}>
                                <div className={styles.sunOrWind}>
                                    <Image
                                        loader={() => `https://openweathermap.org/img/wn/${data.weather.map(e => e.icon)}@2x.png`}
                                        src={`https://openweathermap.org/img/wn/${data.weather.map(e => e.icon)}@2x.png`}
                                        width={50}
                                        height={50}
                                        unoptimized
                                        alt="Picture of the author"
                                        className={styles.picture}
                                    />
                                    <span>{data.weather.map(e => e.main)}</span>
                                </div>
                                <div className={styles.sunOrWind}>
                                    <Image
                                        src="/wind-solid.svg"
                                        width={30}
                                        height={30}
                                        unoptimized
                                        alt="Picture of the author"
                                        className={styles.picture}
                                    />
                                    <span>{data.wind.speed} m/s</span>
                                </div>
                            </div>
                            <div>
                                <span>Feels like: {isCelsius ? kelvinToCelsius(data.main.feels_like) : kelvinToFahrenheit(data.main.feels_like)} ºC</span>
                                <span>{isCelsius ? kelvinToCelsius(data.main.temp_min) : kelvinToFahrenheit(data.main.temp_min)}º to {isCelsius ? kelvinToCelsius(data.main.temp_max) : kelvinToFahrenheit(data.main.temp_max)}º</span>
                            </div>
                        </div>
                        <div className={styles.hoursForecast}>
                            {
                                hourlyData.list.slice(0, 9).map((e, index) =>
                                    <div key={index.toString()}>
                                        <span>{getCurrentTimeInTimeZone(e.dt)}</span>
                                        <hr />
                                        <Image
                                            loader={() => `https://openweathermap.org/img/wn/${e.weather.map(e => e.icon)}@2x.png`}
                                            src={`https://openweathermap.org/img/wn/${e.weather.map(e => e.icon)}@2x.png`}
                                            width={50}
                                            height={50}
                                            unoptimized
                                            alt="Picture of the author"
                                            className={styles.picture}
                                        />
                                        <span>{e.weather.map(x => x.main)}</span>
                                        <h2>{isCelsius ? kelvinToCelsius(e.main.temp) : kelvinToFahrenheit(e.main.temp)}º</h2>
                                    </div>
                                )
                            }
                        </div>
                    </div>}
            </main>
        </>
    )
}
