import React from "react";

export default function Map() {
  return (
    <div className="w-full h-96 mt-10">
      <iframe
        title="Luxe Plains Safaris Location"
        src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d127643.69330078612!2d36.649729537123584!3d-1.2522598235618623!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e6!4m5!1s0x182f103e09c14d5f%3A0x2b33cecc344ab4b8!2sGP%20Karting%20Ltd%2C%20Carnivore%20road%20off%20Langata%20Road.%20Racing%20Circuit%2C%20Nairobi%20City!3m2!1d-1.3308246!2d36.8042106!4m5!1s0x182f23ffd40b166b%3A0x3b158ff3a69f42a6!2sRedhill%20Karting%20Ltd%2C%20RPH6%2B3WV%2C%20Kianjogu!3m2!1d-1.1723006999999999!2d36.7133997!5e0!3m2!1sen!2ske!4v1776927570854!5m2!1sen!2ske"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={false}
        loading="lazy"
      ></iframe>
    </div>
  );
}