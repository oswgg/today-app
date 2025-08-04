export function boundingBox(
    lat: number,
    lng: number,
    radius_km: number,
): {
    min_lat: number;
    max_lat: number;
    min_lng: number;
    max_lng: number;
} {
    // const earth_radius_km = 6371; // Not used directly, for reference
    // 1 deg latitude ~ 111.32 km
    const delta_lat = radius_km / 111.32;
    const min_lat = lat - delta_lat;
    const max_lat = lat + delta_lat;

    // Convert latitude to radians for longitude calculation
    const lat_rad = (lat * Math.PI) / 180;
    const delta_lng = radius_km / (111.32 * Math.cos(lat_rad));
    const min_lng = lng - delta_lng;
    const max_lng = lng + delta_lng;

    return {
        min_lat,
        max_lat,
        min_lng,
        max_lng,
    };
}
