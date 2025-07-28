export default function staticMapUrl(latitude: string, longitude: string): URL {
  const baseUrl = new URL("https://maps.googleapis.com/maps/api/staticmap");

  const searchParam = {
    key: import.meta.env.VITE_GCP_KEY,
    markers: `size:mid,color:red|${latitude},${longitude}`,
    size: "540x304",
    scale: "2",
    center: ``,
    zoom: "17",
    language: "ko",
    region: "KR",
    style: "feature:poi|element:labels|visibility:off",
  };

  Object.entries(searchParam).forEach(([key, value]) => {
    baseUrl.searchParams.append(key, value);
  });

  return baseUrl;
}
