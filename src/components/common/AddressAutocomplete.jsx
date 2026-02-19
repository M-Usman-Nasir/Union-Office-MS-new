import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { TextField, Box } from '@mui/material'

const GOOGLE_SCRIPT_ID = 'google-maps-bootstrap'

/**
 * Parse address components (legacy format or Place class format) into { city, area }.
 * Place class uses addressComponents[].types and longText.
 */
function parseAddressComponents(components = []) {
  let city = ''
  let area = ''
  for (const comp of components) {
    const types = comp.types || []
    const longName = comp.long_name ?? comp.longText ?? ''
    if (types.includes('locality') && longName) {
      city = longName
    }
    if (!city && types.includes('administrative_area_level_2') && longName) {
      city = longName
    }
    if (types.includes('sublocality') && longName) {
      area = area ? `${area} ${longName}` : longName
    }
    if (types.includes('neighborhood') && longName && !area) {
      area = longName
    }
    if (types.includes('administrative_area_level_3') && longName && !area) {
      area = longName
    }
  }
  return { city, area }
}

function usePlaceSelectRef(onPlaceSelect) {
  const ref = useRef(onPlaceSelect)
  ref.current = onPlaceSelect
  return ref
}

/**
 * Load Maps API via dynamic library import (async, recommended).
 * Then load places library and optionally create PlaceAutocompleteElement.
 */
async function loadPlacesLibrary(apiKey) {
  if (window.google?.maps?.places) return window.google.maps.places
  if (!window.google?.maps?.importLibrary) {
    const bootstrapCode = `(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await(a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src="https://maps."+c+"apis.com/maps/api/js?"+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({key:"${apiKey.replace(/"/g, '\\"')}",v:"weekly"});`
    const script = document.createElement('script')
    script.id = GOOGLE_SCRIPT_ID
    script.textContent = bootstrapCode
    document.head.appendChild(script)
    await new Promise((resolve) => {
      if (window.google?.maps?.importLibrary) return resolve()
      const check = setInterval(() => {
        if (window.google?.maps?.importLibrary) {
          clearInterval(check)
          resolve()
        }
      }, 50)
    })
  }
  const places = await window.google.maps.importLibrary('places')
  return places
}

function AddressAutocomplete({
  value = '',
  onChange,
  onPlaceSelect,
  apiKey,
  ...textFieldProps
}) {
  const containerRef = useRef(null)
  const elementRef = useRef(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [loadError, setLoadError] = useState(null)
  const apiKeyValue = apiKey || import.meta.env?.VITE_GOOGLE_MAPS_API_KEY || ''
  const onPlaceSelectRef = usePlaceSelectRef(onPlaceSelect)

  // Load Maps API with async pattern (bootstrap + importLibrary) and create PlaceAutocompleteElement
  useEffect(() => {
    const container = containerRef.current
    if (!apiKeyValue) return
    let cancelled = false
    setLoadError(null)
    loadPlacesLibrary(apiKeyValue)
      .then((places) => {
        if (cancelled || !container) return
        if (elementRef.current) return
        const PlaceAutocompleteElement = places.PlaceAutocompleteElement || window.google?.maps?.places?.PlaceAutocompleteElement
        if (!PlaceAutocompleteElement) {
          setLoadError('PlaceAutocompleteElement not available')
          return
        }
        const el = new PlaceAutocompleteElement({
          // optional: restrict to addresses
        })
        el.id = 'place-autocomplete-address'
        // Force light theme so input background is white in light-themed modals
        el.style.colorScheme = 'light'
        el.style.setProperty('--gmp-mat-color-surface', '#fff')
        el.style.setProperty('--gmp-mat-color-on-surface', 'rgba(0, 0, 0, 0.87)')
        container.innerHTML = ''
        container.appendChild(el)
        el.addEventListener('gmp-select', async (event) => {
          const placePrediction = event.placePrediction
          if (!placePrediction?.toPlace) return
          const place = placePrediction.toPlace()
          await place.fetchFields({
            fields: ['displayName', 'formattedAddress', 'addressComponents'],
          })
          const address = place.formattedAddress || ''
          if (!address) return
          const name = (place.displayName && place.displayName !== address ? place.displayName : '') || ''
          const comps = place.addressComponents || []
          const { city, area } = parseAddressComponents(comps)
          onPlaceSelectRef.current?.({ address, city, area, name })
        })
        elementRef.current = el
        setScriptLoaded(true)
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err?.message || 'Failed to load Google Maps')
      })
    return () => {
      cancelled = true
      const el = elementRef.current
      if (el && container?.contains(el)) {
        container.removeChild(el)
      }
      elementRef.current = null
    }
  }, [apiKeyValue, onPlaceSelectRef])

  const hasGoogle = Boolean(apiKeyValue)

  if (!hasGoogle) {
    return (
      <TextField
        value={value}
        onChange={(e) => onChange?.(e)}
        placeholder="Enter address"
        helperText="Add VITE_GOOGLE_MAPS_API_KEY to .env to enable map search."
        {...textFieldProps}
      />
    )
  }

  if (loadError) {
    return (
      <TextField
        value={value}
        onChange={(e) => onChange?.(e)}
        placeholder="Enter address"
        helperText={loadError}
        error
        {...textFieldProps}
      />
    )
  }

  return (
    <Box sx={{ width: '100%', position: 'relative', zIndex: 10 }}>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          minHeight: 56,
          borderRadius: 4,
          overflow: 'visible',
          position: 'relative',
          zIndex: 10,
        }}
      />
      <Box component="p" sx={{ m: 0, mt: 0.5, fontSize: '0.75rem', color: 'text.secondary' }}>
        {scriptLoaded ? 'Select an address from Google Maps suggestions.' : 'Loading map search...'}
      </Box>
    </Box>
  )
}

AddressAutocomplete.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onPlaceSelect: PropTypes.func,
  apiKey: PropTypes.string,
}

export default AddressAutocomplete
