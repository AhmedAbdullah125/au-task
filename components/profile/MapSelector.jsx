'use client';
import { useEffect, useState } from 'react';

export default function MapSelector(data) {
  const lang = localStorage.getItem('lang') || 'en';
  const [lat, setLat] = useState(29.390481); // Default to initial map center
  const [lng, setLng] = useState(47.994058); // Default to initial map center
  useEffect(() => {
    const loadScript = (url) => {
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      document.body.appendChild(script);
    };

    window.initMap = () => {
      const map = new google.maps.Map(document.getElementById('gmaps-canvas'), {
        center: { lat, lng },
        zoom: 12,
      });

      const marker = new google.maps.Marker({
        map: map,
        position: { lat, lng },
        draggable: true,
      });

      // Update state when marker is dragged
      google.maps.event.addListener(marker, 'dragend', function () {
        const newLat = this.getPosition().lat();
        const newLng = this.getPosition().lng();
        data.setLat(newLat);
        data.setLng(newLng);
      });

      const input = document.getElementById('location-name');
      const autocomplete = new google.maps.places.Autocomplete(input, {
        language: lang // Set the language for the autocomplete
      });

      autocomplete.addListener('place_changed', function () {
        const place = autocomplete.getPlace();
        if (!place.geometry) return;

        const newLat = place.geometry.location.lat();
        const newLng = place.geometry.location.lng();

        map.setCenter(place.geometry.location);
        marker.setPosition(place.geometry.location);
        setLat(newLat);
        setLng(newLng);
      });
    };

    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=AIzaSyDMqfttkgKXXAztXetz1a4hiIj28tqW6go&libraries=places&callback=initMap&language=${lang}`
    );
  }, [lang]);

  return (
    <div className={`map-container ${data.iserror ? 'error-map-container' : ''}`}>
      <input
        id="location-name"
        type="text"
        placeholder={lang === 'ar' ? 'ابحث عن موقع' : 'Search for a location'}
        style={{ 
          width: '100%', 
          padding: '10px', 
          marginBottom: '10px',
          textAlign: lang === 'ar' ? 'right' : 'left'
        }}
      />
      <div 
        id="gmaps-canvas" 
        className='map-canvas' 
        style={{ 
          height: '200px', 
          border: `1px solid ${data.iserror ? 'red' : '#999'}`, 
          borderRadius: '8px' 
        }}
      ></div>
    </div>
  );
}