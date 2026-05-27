"use client";

import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [show,setShow]=useState(false);

  useEffect(()=>{

    const consent =
      localStorage.getItem("cookieConsent");

    if(!consent){

      setShow(true);

    }

  },[]);


function saveConsent(type:string){

localStorage.setItem(
"cookieConsent",
type
);

setShow(false);

}


if(!show) return null;


return (

<div className="fixed bottom-6 left-6 right-6 bg-white shadow-xl p-6 rounded-xl z-50">

<h3 className="font-bold text-xl mb-2">
Cookie Preferences
</h3>

<p className="text-gray-600">

We use cookies for functionality,
analytics and marketing.

</p>


<div className="flex gap-3 mt-5">

<button
onClick={()=>saveConsent("accepted")}
className="bg-green-700 text-white px-4 py-2 rounded"
>

Accept All

</button>


<button
onClick={()=>saveConsent("denied")}
className="border px-4 py-2 rounded"
>

Reject

</button>


<button
onClick={()=>saveConsent("custom")}
className="border px-4 py-2 rounded"
>

Customise

</button>

</div>

</div>

);

}