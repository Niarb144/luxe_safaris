export default function Accommodations({ accommodations }: { accommodations: any[] }) {
    if (!accommodations?.length) return null;
    return(
        <div className="space-y-6">
        <h2 className="text-3xl">

        Available Accommodation

        </h2>


        <div className="
        grid
        md:grid-cols-2
        gap-6
        ">

        {accommodations.map((hotel)=>(

        <div key={hotel.id}>

        <img
        src={hotel.images[0]}
        />

        <h3>

        {hotel.hotel_name}

        </h3>

        <p>

        {hotel.classification}

        </p>

        </div>

        ))

        }

        </div>
        </div>
    );
}