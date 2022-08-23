import {createOverlayRender} from 'roamjs-components/util'
import {Classes, Dialog} from '@blueprintjs/core'

import Autocomplete from 'react-google-autocomplete'
import PlaceResult = google.maps.places.PlaceResult
import {createPage} from 'roamjs-components/writes'


interface AutocompletePromptProps {

}

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

/**
 * Ideally one would find out the cursor position and then insert the name at the cursor position.
 * But that is not available in the API and would require roamToolkit like hacks
 */
function reActivateBlock() {
    const focusedBlock = window.roamAlphaAPI.ui.getFocusedBlock()
    return window.roamAlphaAPI.ui.setBlockFocusAndSelection({location: focusedBlock})
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
                        createPageFromLocation(place)
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
export const AutocompletePromptOverlay = createOverlayRender<AutocompletePromptProps>('autocomplete-prompt', AutocompletePrompt)
