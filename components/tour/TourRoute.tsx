export default function TourRoute({ routes }: any) {
  if (!routes?.length) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Route</h2>

      {routes.map((route: any) => (
        <div key={route.id}>
          {route.route_url.includes("google.com") ? (
            <iframe
              src={route.route_url}
              className="w-full h-80 rounded-xl"
            />
          ) : (
            <img
              src={route.route_url}
              className="w-full h-80 object-cover rounded-xl"
            />
          )}
        </div>
      ))}
    </div>
  );
}