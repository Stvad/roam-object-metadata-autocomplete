import {Classes, Dialog} from '@blueprintjs/core'

import Autocomplete from 'react-google-autocomplete'
import {openPageInSidebar, reActivateBlock, createPage, renderOverlay} from './common'
import PlaceResult = google.maps.places.PlaceResult

import './autocomplete-dialog.css'


function buildTags(location: PlaceResult) {

    function removeGenericTags(tags: string[]) {
        const genericTags = ['point_of_interest', 'store', 'establishment']
        return tags.filter(it => !genericTags.includes(it))
    }

    return removeGenericTags(location.types).map(it => `[[${it}]]`).join(' ')
}

const createPageFromLocation = (location: PlaceResult) => {
    return createPage({
        title: location.name,
        tree: [
            {text: `isa::[[geographic location]] ${buildTags(location)}`},
            {text: `address::${location.formatted_address}`},
            {text: `url::${location.url}`},
            {text: `link::${location.website || ''}`},
            {text: `vicinity of::${location.vicinity}`},
            {text: `location::${location.geometry.location.lat()},${location.geometry.location.lng()}`},
        ],
    })

}

// todo can I get a type of cusine?
export const GoogleAutocompletePrompt = ({onClose, apiKey}: { onClose: () => void; apiKey: string }) => {

    if (!apiKey) {
        return (
            <Dialog
                isOpen={true}
                onClose={onClose}
                canEscapeKeyClose
                backdropClassName={'autocomplete-dialog-backdrop'}
                className={'autocomplete-dialog'}
            >
                <div className={Classes.DIALOG_BODY + ' autocomplete-dialog-body'}>
                    <h3>Google Maps Location</h3>
                    <p>Please set your Google Maps API key in the extension settings (Settings → Extensions → Object Metadata Autocomplete).</p>
                    <p style={{fontSize: '0.85em', color: '#5c7080'}}>
                        Get a key at <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener">console.cloud.google.com</a> — enable the <strong>Places API</strong>.
                        To avoid charges, set a daily quota limit in the Quotas page.
                    </p>
                </div>
            </Dialog>
        )
    }

    return (
        <Dialog
            isOpen={true}
            onClose={onClose}
            canEscapeKeyClose
            backdropClassName={'autocomplete-dialog-backdrop'}
            className={'autocomplete-dialog'}
        >
            <div
                className={Classes.DIALOG_BODY + ' autocomplete-dialog-body'}
            >
                <h3>Google Maps Location</h3>

                <Autocomplete
                    apiKey={apiKey}
                    className={'bp3-input'}
                    onPlaceSelected={(place) => {
                        createPageFromLocation(place).then(() => openPageInSidebar(place.name))
                        window.navigator.clipboard.writeText(`[[${place.name}]]`)

                        onClose()

                        reActivateBlock()
                    }}
                    options={{
                        /* overriding the default of cities only */
                        types: null,
                        fields: [
                            'address_components',
                            'formatted_address',
                            'geometry.location',
                            'name',
                            'place_id',
                            'types',
                            'vicinity',
                            'photos',
                            'website',
                            'url',
                        ],
                    }}
                />

            </div>
        </Dialog>
    )
}

export const showGoogleAutocomplete = (apiKey: string) =>
    renderOverlay(({onClose}) => <GoogleAutocompletePrompt onClose={onClose} apiKey={apiKey} />)
