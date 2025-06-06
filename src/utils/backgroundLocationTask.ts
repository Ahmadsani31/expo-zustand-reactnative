import * as TaskManager from 'expo-task-manager';
import { LocationObject } from 'expo-location';
import { useLocationStore } from '@/stores/locationStore';
import { calculateDistanceLocation } from './locationUtils';

const LOCATION_TASK_NAME = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.log('Background location task error:', error);
    return;
  }

  if (data) {
    const { locations } = data as { locations: LocationObject[] };
    console.log('Received new locations in background:', locations[0]);
    const latest = locations[0];

    if (latest) {
      const store = useLocationStore.getState();
      const last = store.coord;

      console.log('location update ', latest.coords);
      const { latitude, longitude, accuracy, altitude, altitudeAccuracy, heading, speed } =
        latest.coords;
      // Convert speed from m/s to km/h
      const kmh = speed ? (speed * 3.6).toFixed(1) : '0.0';

      
      const saveCoords = {
        latitude,
        longitude,
        accuracy,
        altitude,
        altitudeAccuracy,
        heading,
        speed: kmh,
        timestamp: Date.now(),
      };


      // await calculateDistanceLocation({
      //   lastLatitude: last?.latitude ?? 0,
      //   lastLongitude: last?.longitude ?? 0,
      //   lat2: latitude,
      //   lon2: longitude,
      // })
      //   .then((distance) => {
      //     console.log(`Distance between points: ${distance} meters`);

      //     // if (distance >= 3) {
      //     //   console.log('Distance is greater than or equal to 3 meters, saving coordinates.');
      //     //   // Simpan koordinat ke dalam store
      //     //   useLocationStore.getState().addToBatchCoordinate(saveCoords);
      //     // }
      //   })
      //   .catch((error) => {
      //     console.error('Error calculating distance:', error);
      //   });

      // Akses Zustand store secara manual
      useLocationStore.getState().addToBatchCoordinate(saveCoords);
      useLocationStore.getState().addToCoordinate(saveCoords);
    }
  }
});

export default LOCATION_TASK_NAME;
