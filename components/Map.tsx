import React from "react";

export default function Map() {
  return (
    <div className="w-full h-96 mt-10">
      <iframe
        title="Luxe Plains Safaris Location"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8150193133874!2d36.821449670291756!3d-1.2849487327317903!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f116041c8127d%3A0x97121230126f6bd0!2sNairobi%20Cbd!5e0!3m2!1sen!2ske!4v1776963043343!5m2!1sen!2ske"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={false}
        loading="lazy"
      ></iframe>
    </div>
  );
}