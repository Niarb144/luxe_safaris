import Link from "next/link";

export default function Accommodations({ accommodations,
}: {
  accommodations: any[];
}) {

if (!accommodations?.length)
return null;


/* GROUP BY DESTINATION */

const grouped = accommodations.reduce(
(acc:any, hotel:any)=>{

const destination = hotel.destinations?.name || "Other";

if(!acc[destination])
acc[destination]=[];

acc[destination]
.push(hotel);

return acc;

},
{}
);


const levels = [
"Economy",
"Comfort",
"Luxury"
];


return (

<div className="space-y-10">

<h2 className="
text-3xl
font-bold
">

Available Accommodation

</h2>



{Object.entries(grouped)
.map(

([destination, hotels]:
any)=>(

<div
key={destination}

className="
border
border-gray-300
overflow-hidden
"
>

{/* DESTINATION HEADER */}

<div className="
bg-amber-500
text-white
font-bold
px-4
py-2
uppercase
">

{destination}

</div>



<table className="
w-full
border-collapse
">

<tbody>

{levels.map(level=>{

const matching =
hotels.filter(
(h:any)=>
h.classification === level
);

return(

<tr
key={level}

className="
border-t
"

>

<td className="
w-1/3
p-4
font-medium
text-gray-700
">

{level} level
lodge/tented camp option

</td>



<td className="
p-4
">

{matching.length ?

matching.map(
(hotel:any)=>(

<div
key={hotel.id}
className="mb-2"
>

<Link

href={
`/accommodations/${hotel.slug}`
}

className="
text-amber-700
hover:underline
"

>

{hotel.hotel_name}

</Link>

</div>

))

:

"-"

}

</td>

</tr>

)

})}

</tbody>

</table>

</div>

))

}

</div>

);

}