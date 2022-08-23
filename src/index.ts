import toConfigPageName from 'roamjs-components/util/toConfigPageName'
import runExtension from 'roamjs-components/util/runExtension'
import 'roamjs-components/types'
import {createConfigObserver} from 'roamjs-components/components/ConfigPage'
import {GoogleAutocompletePromptOverlay} from './google'
import {GoodReadsAutocompletePromptOverlay} from './goodreads'

const extensionId = 'world-autocomplete-roam'
const CONFIG = toConfigPageName(extensionId)

const mapsCommand = 'Google maps autocomplete'
const grCommand = 'GoodReads autocomplete'

export default runExtension({
    extensionId,
    run: () => {
        createConfigObserver({title: CONFIG, config: {tabs: []}})

        window.roamAlphaAPI.ui.commandPalette.addCommand({
            label: mapsCommand,
            callback: () => GoogleAutocompletePromptOverlay({}),
        })

        window.roamAlphaAPI.ui.commandPalette.addCommand({
            label: grCommand,
            callback: () => GoodReadsAutocompletePromptOverlay({}),
        })


    },
    unload: () => {
        window.roamAlphaAPI.ui.commandPalette.removeCommand({label: mapsCommand})
        window.roamAlphaAPI.ui.commandPalette.removeCommand({label: grCommand})
    },
})

// createOverlayRender({}

