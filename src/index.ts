import {showGoogleAutocomplete} from './google'
import {showBookAutocomplete} from './book'
export default {
    onload: ({extensionAPI}: { extensionAPI: any }) => {
        extensionAPI.settings.panel.create({
            tabTitle: 'Object Metadata Autocomplete',
            settings: [
                {
                    id: 'google-maps-api-key',
                    name: 'Google Maps API Key',
                    description:
                        'Required for location autocomplete. Get one at console.cloud.google.com/apis/credentials — enable the Places API. To avoid charges, set a daily quota limit in the Quotas page.',
                    action: {type: 'input', placeholder: 'AIza...'},
                },
            ],
        });

        extensionAPI.ui.commandPalette.addCommand({
            label: 'Google maps autocomplete',
            callback: () => showGoogleAutocomplete(extensionAPI.settings.get('google-maps-api-key') || ''),
        })

        extensionAPI.ui.commandPalette.addCommand({
            label: 'Book autocomplete',
            callback: showBookAutocomplete,
        })
    },
    onunload: () => {
    },
}
