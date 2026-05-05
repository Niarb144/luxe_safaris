export default function TourGallery({ images }: any) {
  if (!images?.length) return null;

  return (
    <div className="grid grid-cols-4 gap-2 h-[400px] p-2 bg-blue-500">
      <img
        src={images[0]?.image_url}
        className="col-span-2 row-span-2 object-cover w-full h-full rounded-xl"
      />

      {images.slice(1, 5).map((img: any) => (
        <img
          key={img.id}
          src={img.image_url}
          className="object-cover w-full h-full rounded-xl"
        />
      ))}
    </div>
  );
}