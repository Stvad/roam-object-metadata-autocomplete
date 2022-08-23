import toConfigPageName from 'roamjs-components/util/toConfigPageName'
import runExtension from 'roamjs-components/util/runExtension'
import 'roamjs-components/types'
import {createConfigObserver} from 'roamjs-components/components/ConfigPage'
import {AutocompletePromptOverlay} from './autocomplete'

const extensionId = 'world-autocomplete-roam'
const CONFIG = toConfigPageName(extensionId)

const mapsCommand = 'Google maps autocomplete'

export default runExtension({
    extensionId,
    run: () => {
        createConfigObserver({title: CONFIG, config: {tabs: []}})
        window.roamAlphaAPI.ui.commandPalette.addCommand({
            label: mapsCommand,
            callback: () => {
                AutocompletePromptOverlay({})
            },
        })

    },
    unload: () => {
        window.roamAlphaAPI.ui.commandPalette.removeCommand({label: mapsCommand})
    },
})

// createOverlayRender({}

