import {createOverlayRender} from 'roamjs-components/util'
import {Classes, Dialog} from '@blueprintjs/core'

import Autocomplete from 'react-google-autocomplete'
import {createPage} from 'roamjs-components/writes'
import {openPageInSidebar, reActivateBlock} from './common'
import PlaceResult = google.maps.places.PlaceResult

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

interface AutocompletePromptProps {
}

export const AutocompletePrompt = ({onClose}: { onClose: () => void; } & AutocompletePromptProps) => {
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

                <Autocomplete
                    apiKey={''}
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

// @ts-ignore
export const GoogleAutocompletePromptOverlay = createOverlayRender<AutocompletePromptProps>('autocomplete-prompt', AutocompletePrompt)
