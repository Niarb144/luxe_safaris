// "use client";

// import { useState } from "react";
// import { supabase } from "@/lib/supabase";

// export default function BookingModal({
//   open,
//   onClose,
//   tourId,
// }: {
//   open: boolean;
//   onClose: () => void;
//   tourId: string;
// }) {

//   const [loading,setLoading]=useState(false);

//   async function handleSubmit(e:any){
//       e.preventDefault();
//       setLoading(true);

//       const form = new FormData(e.target);

//       const booking = {
//         tour_id: tourId,
//         full_name: form.get("name"),
//         email: form.get("email"),
//         phone: form.get("phone"),
//         adults: Number(form.get("adults")),
//         children: Number(form.get("children")),
//         travel_date: form.get("travel_date"),
//         special_requests: form.get("requests")
//       };

//       const {error} =
//       await supabase
//       .from("bookings")
//       .insert([booking]);

//       setLoading(false);

//       if(error){
//         alert(error.message);
//       }else{
//         alert("Booking submitted");
//         onClose();
//       }
//   }

//   if(!open) return null;

//   return(

// <div className="
// fixed inset-0
// bg-black/60
// flex items-center
// justify-center
// z-[999]
// ">

// <div className="
// bg-white
// rounded-2xl
// p-8
// w-full
// max-w-lg
// ">

// <h2 className="text-2xl font-bold mb-6">
// Book Tour
// </h2>

// <form onSubmit={handleSubmit}
// className="space-y-4">

// <input
// name="name"
// placeholder="Full Name"
// className="w-full border p-3 rounded"
// />

// <input
// name="email"
// type="email"
// placeholder="Email"
// className="w-full border p-3 rounded"
// />

// <input
// name="phone"
// placeholder="Phone"
// className="w-full border p-3 rounded"
// />

// <div className="grid grid-cols-2 gap-4">

// <input
// type="number"
// name="adults"
// placeholder="Adults"
// defaultValue={1}
// className="border p-3 rounded"
// />

// <input
// type="number"
// name="children"
// placeholder="Children"
// defaultValue={0}
// className="border p-3 rounded"
// />

// </div>

// <input
// type="date"
// name="travel_date"
// className="w-full border p-3 rounded"
// />

// <textarea
// name="requests"
// placeholder="Special requests"
// className="w-full border p-3 rounded"
// />

// <div className="flex gap-4">

// <button
// type="submit"
// disabled={loading}
// className="
// bg-green-600
// text-white
// px-5 py-3
// rounded
// cursor-pointer
// ">

// {loading ? "Saving..." : "Book"}

// </button>

// <button
// type="button"
// onClick={onClose}
// className="border px-5 py-3 rounded cursor-pointer"
// >

// Cancel

// </button>

// </div>

// </form>

// </div>
// </div>

//   )
// }

"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function BookingModal({
 open,
 onClose,
 tourId,
}:{
 open:boolean;
 onClose:()=>void;
 tourId:string;
}){

const [loading,setLoading]=useState(false);

  async function handleSubmit(e:any){
      e.preventDefault();
      setLoading(true);

      const form = new FormData(e.target);

      const booking = {
        tour_id: tourId,
        full_name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        adults: Number(form.get("adults")),
        children: Number(form.get("children")),
        travel_date: form.get("travel_date"),
        special_requests: form.get("requests")
      };

      const {error} =
      await supabase
      .from("bookings")
      .insert([booking]);

      setLoading(false);

      if(error){
        alert(error.message);
      }else{
        alert("Booking submitted");
        onClose();
      }
  }

  // if(!open) return null;

const [mounted,setMounted]=useState(false);

useEffect(()=>{
 setMounted(true);
},[]);

if(!mounted || !open) return null;

return createPortal(

<div
className="
fixed
inset-0
bg-black/60
flex
items-center
justify-center
z-[9999]
"
>

<div className="
bg-white
rounded-2xl
p-8
w-full
max-w-lg
max-h-[90vh]
overflow-y-auto
">

<h2 className="text-2xl font-bold mb-6 text-gray-800">
Book Tour
</h2>

<form onSubmit={handleSubmit}
className="space-y-4">

<input
name="name"
placeholder="Full Name"
className="w-full border p-3 rounded text-gray-700"
/>

<input
name="email"
type="email"
placeholder="Email"
className="w-full border p-3 rounded text-gray-700"
/>

<input
name="phone"
placeholder="Phone"
className="w-full border p-3 rounded text-gray-700"
/>

<div className="grid grid-cols-2 gap-4">

<input
type="number"
name="adults"
placeholder="Adults"
// defaultValue={1}
className="border p-3 rounded text-gray-700"
/>

<input
type="number"
name="children"
placeholder="Children"
// defaultValue={0}
className="border p-3 rounded text-gray-700"
/>

</div>

<input
type="date"
name="travel_date"
className="w-full border p-3 rounded text-gray-700"
/>

<textarea
name="requests"
placeholder="Special requests"
className="w-full border p-3 rounded text-gray-700"
/>

<div className="flex gap-4">

<button
type="submit"
disabled={loading}
className="
bg-green-600
text-white
px-5 py-3
rounded
cursor-pointer
">

{loading ? "Saving..." : "Book"}

</button>

<button
type="button"
onClick={onClose}
className="border px-5 py-3 rounded cursor-pointer text-gray-700"
>

Cancel

</button>

</div>

</form>

</div>

</div>,

document.body

);

}